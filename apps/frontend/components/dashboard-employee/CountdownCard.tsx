'use client';

import React, { useEffect, useState } from 'react';
import { LogIn } from 'lucide-react';
import { IoMdAdd } from 'react-icons/io';

import {
    Card,
    CardHeader,
    CardContent,
    CardTitle,
} from '@/components/ui/card';
import { Button } from '../ui/button';
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { CheckClockForm } from '../checkclock/checkclock-form';
import { AbsenceAddForm } from '../absence/absenceAdd-form';

import api from '@/lib/axios';
import { formatWorkHours, getTimeRangeInHours, formatTimeOnly, isSameDate } from '@/src/app/user/[id]/employee/checkclock/client';

type CountdownCardProps = {
    userId: string;
    companyId: string;
};

export default function CountdownCard({ userId, companyId }: CountdownCardProps) {
    const [user, setUser] = useState({
        name: '',
        first_name: '',
        last_name: '',
        position: '',
        avatar: '',
        typeId: '',
    });

    const [employee, setEmployee] = useState<any[]>([]);
    const [attendance, setAttendance] = useState<any[]>([]);
    const [attendanceType, setAttendanceType] = useState<Record<string, any>>({});
    const [company, setCompany] = useState<any[]>([]);

    const [currentTime, setCurrentTime] = useState(new Date());
    const [hasMounted, setHasMounted] = useState(false);
    const [openClockInDialog, setOpenClockInDialog] = useState(false);
    const [openAbsenceDialog, setOpenAbsenceDialog] = useState(false);

    // Untuk daily limit clock in
    let dailyLimit = 1;

    useEffect(() => {
        setHasMounted(true);
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const formatTime = (date: Date) =>
        new Intl.DateTimeFormat('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true,
        }).format(date);

    const formatDate = (date: Date) =>
        new Intl.DateTimeFormat('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        }).format(date);

    // Fetch data seperti di client.tsx
    const fetchAllData = async () => {
        try {
            const res = await api.get(`/api/employee/${userId}`);
            const { first_name, last_name, position, attendance_id, pict_dir } =
                res.data.data;

            setUser({
                name: `${first_name} ${last_name}`,
                first_name: first_name,
                last_name: last_name,
                position: position,
                avatar: pict_dir || '/avatars/default.jpg',
                typeId: attendance_id,
            });

            const [attendanceRes, employeeRes, typeRes, companyRes] =
                await Promise.all([
                    api.get(`api/attendance?employee_id=${userId}`),
                    api.get(`api/employee?id=${userId}`),
                    api.get(`api/attendanceType?company_id=${companyId}`),
                    api.get(`api/company?id=${companyId}`),
                ]);

            setEmployee(employeeRes.data ?? []);

            const typeMap: Record<string, any> = {};
            for (const typ of typeRes.data ?? []) {
                typeMap[typ.id] = typ;
            }
            setAttendanceType(typeMap);

            setAttendance(attendanceRes.data ?? []);

            setCompany(companyRes.data ?? []);
        } catch (err: any) {
            console.error(
                'Error fetching data:',
                err.response?.data || err.message,
            );
            setAttendance([]);
            setEmployee([]);
            setAttendanceType({});
            setCompany([]);
        }
    };

    useEffect(() => {
        fetchAllData();
    }, [userId, companyId]);

    // Cek daily limit
    attendance.forEach((att: any) => {
        if (isSameDate(new Date(att.created_at), new Date())) {
            dailyLimit = 0;
        }
    });

    const handleAddCheckClockSuccess = () => {
        setOpenClockInDialog(false); // Tutup dialog
        fetchAllData(); // Refresh data
    };

    if (!hasMounted) return null;


    return (
        <Card>
            <CardHeader className="pb-5">
                <CardTitle className="text-xl">Countdown</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col gap-4">
                    {/* Card Atas - Countdown Waktu */}
                    <Card>
                        <CardHeader className="flex flex-row justify-between items-center">
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full flex-shrink-0 bg-[#1E3A5F]"></span>
                                <CardTitle className="text-lg font-medium text-muted-foreground">
                                    Countdown
                                </CardTitle>
                            </div>
                            <div className="text-sm text-muted-foreground">
                                {formatDate(currentTime)}
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="items-center flex flex-col text-3xl font-semibold">
                                {formatTime(currentTime)}
                            </div>
                        </CardContent>
                    </Card>

                    {/* 2 Card Bawah */}
                    <div className="grid gap-4 sm:grid-cols-2">
                        {/* Kiri: Clock In */}
                        <Card>
                            <CardHeader className="flex flex-row">
                                <div className="flex items-center gap-2">
                                    <span className="w-3 h-3 rounded-full flex-shrink-0 bg-[#1E3A5F]"></span>
                                    <CardTitle className="text-lg font-medium text-muted-foreground">
                                        Clock In
                                    </CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="items-center flex flex-col">
                                    <Dialog open={openClockInDialog} onOpenChange={setOpenClockInDialog}>
                                        <DialogTrigger asChild>
                                            <Button
                                                disabled={dailyLimit === 0}
                                                variant="outline"
                                                className={
                                                    dailyLimit === 0 ? 'opacity-50 cursor-not-allowed' : ''
                                                }
                                            >
                                                <LogIn className="mr-2 h-4 w-4" />
                                                Clock In
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="max-w-4xl">
                                            <DialogHeader>
                                                <DialogTitle>Clock In</DialogTitle>
                                            </DialogHeader>
                                            <CheckClockForm
                                                employeeId={userId}
                                                companyId={companyId}
                                                typeId={user.typeId}
                                                onSuccess={handleAddCheckClockSuccess}
                                            />
                                        </DialogContent>
                                    </Dialog>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Kanan: Add Absence */}
                        <Card>
                            <CardHeader className="flex flex-row">
                                <div className="flex items-center gap-2">
                                    <span className="w-3 h-3 rounded-full flex-shrink-0 bg-[#1E3A5F]"></span>
                                    <CardTitle className="text-lg font-medium text-muted-foreground">
                                        Add Absence
                                    </CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="items-center flex flex-col">
                                    <Dialog open={openAbsenceDialog} onOpenChange={setOpenAbsenceDialog}>
                                        <DialogTrigger asChild>
                                            <Button variant="outline">
                                                <IoMdAdd className="mr-2 h-4 w-4" />
                                                Add Absence
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="max-w-4xl">
                                            <DialogHeader>
                                                <DialogTitle>Add Absence</DialogTitle>
                                            </DialogHeader>
                                            {/* <AbsenceAddForm
                                                employeeId={userId}
                                                companyId={companyId}
                                                onSuccess={handleAddAbsenceSuccess}
                                                onClose={() => setOpenAbsenceDialog(false)}
                                            /> */}
                                        </DialogContent>
                                    </Dialog>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
