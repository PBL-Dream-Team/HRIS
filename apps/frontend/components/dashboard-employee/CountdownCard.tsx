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
import { CheckOutForm } from '@/components/checkout-form';

import api from '@/lib/axios';
import { formatWorkHours, getTimeRangeInHours, formatTimeOnly, isSameDate } from '@/src/app/user/[id]/employee/checkclock/client';

type CountdownCardProps = {
    userId: string;
    companyId: string;
};


type Absence = {
    id: string;
    employee_id: string;
    company_id: string;
    reason: string;
    date: string;
    status: string;
    name: string;
    position: string;
    type: AbsenceType;
    address: string;
    created_at: string;
    filedir: string;
};


type AbsenceType = 'SICK' | 'PERMIT' | 'LEAVE';

export default function CountdownCard({ userId, companyId }: CountdownCardProps) {
    const [user, setUser] = useState({
        name: '',
        first_name: '',
        last_name: '',
        position: '',
        avatar: '',
        typeId: '',
    });

    const [userAbsence, setUserAbsence] = useState({
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
    const [openCheckOutDialog, setOpenCheckOutDialog] = useState(false);
    const [todayAttendance, setTodayAttendance] = useState<any | null>(null);

    const [absences, setAbsences] = useState<Absence[]>([]);
    const [employees, setEmployees] = useState<Record<string, any>>({});

    const [pictdir, setPictDir] = useState({
        pictdir: ''
    });
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
    const fetchAllCheckclockData = async () => {
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
        fetchAllCheckclockData();
    }, [userId, companyId]);

    // Cek daily limit
    attendance.forEach((att: any) => {
        if (isSameDate(new Date(att.created_at), new Date())) {
            dailyLimit = 0;
        }
    });

    const fetchAbsences = async () => {
        try {
            const absenceRes = await api.get(`/api/absence?employee_id=${userId}`);
            setAbsences(absenceRes.data ?? []);

            const res = await api.get(`/api/employee/${userId}`);
            const pict = res.data.data;

            setPictDir({
                pictdir: pict.pict_dir || '',
            })

        } catch (err: any) {
            console.error(
                'Error fetching absences:',
                err.response?.data || err.message,
            );
            setAbsences([]);
        }
    };

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await api.get(`/api/employee/${userId}`);
                const { first_name, last_name, position, pict_dir } = res.data.data;
                setUserAbsence({
                    name: `${first_name} ${last_name}`,
                    first_name: first_name,
                    last_name: last_name,
                    position,
                    avatar: pict_dir || '/avatars/default.jpg',
                    typeId: '', // Tambahkan baris ini agar sesuai dengan tipe user
                });

                const [absenceRes, employeeRes] = await Promise.all([
                    api.get(`/api/absence?employee_id=${userId}`),
                    api.get(`/api/employee?id=${userId}`),
                ]);

                const employeeMap: Record<string, any> = {};
                for (const emp of employeeRes.data ?? []) {
                    employeeMap[emp.id] = emp;
                }

                setEmployees(employeeMap);
                setAbsences(absenceRes.data ?? []);
            } catch (err: any) {
                console.error(
                    'Error fetching data:',
                    err.response?.data || err.message,
                );
                setAbsences([]);
            }
        }

        fetchData();
    }, [userId]);

    useEffect(() => {
        const today = attendance.find(
            (att: any) =>
                isSameDate(new Date(att.created_at), new Date()) &&
                att.check_in &&
                !att.check_out
        );
        setTodayAttendance(today || null);
    }, [attendance]);

    const handleAddCheckClockSuccess = () => {
        setOpenClockInDialog(false); // Tutup dialog
        fetchAllCheckclockData(); // Refresh data
    };

    const handleAddAbsenceSuccess = () => {
        setOpenAbsenceDialog(false); // Tutup dialog
        fetchAbsences(); // Refresh data absence
    };


    if (!hasMounted) return null;

    return (
        <Card>
            <CardHeader className="pb-5">
                <CardTitle className="text-xl">Check Clock</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col gap-4">
                    {/* Bagian Atas: Waktu dan Tanggal Sekarang */}
                    <div className="flex flex-col items-center justify-center py-6">
                        <span className="text-5xl font-bold text-primary">
                            {formatTime(currentTime)}
                        </span>
                        <span className="text-lg text-muted-foreground mt-2">
                            {formatDate(currentTime)}
                        </span>
                    </div>

                    {/* 3 Card Bawah */}
                    <div className="grid gap-4 sm:grid-cols-3">
                        {/* Card 1: Clock In */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg font-medium text-muted-foreground">
                                    Clock In
                                </CardTitle>
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

                        {/* Card 2: Check Out */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg font-medium text-muted-foreground">
                                    Clock Out
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="items-center flex flex-col">
                                    <Dialog open={openCheckOutDialog} onOpenChange={setOpenCheckOutDialog}>
                                        <DialogTrigger asChild>
                                            <Button
                                                variant="outline"
                                                disabled={!todayAttendance}
                                                className={!todayAttendance ? 'opacity-50 cursor-not-allowed' : ''}
                                            >
                                                <LogIn className="mr-2 h-4 w-4" />
                                                Clock Out
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="max-w-4xl">
                                            <DialogHeader>
                                                <DialogTitle>Check Out</DialogTitle>
                                            </DialogHeader>
                                            {todayAttendance ? (
                                                <CheckOutForm
                                                    attendanceId={todayAttendance.id}
                                                    onSuccess={() => {
                                                        setOpenCheckOutDialog(false);
                                                        fetchAllCheckclockData();
                                                    }}
                                                />
                                            ) : (
                                                <div className="text-center text-muted-foreground">
                                                    Anda sudah melakukan check out hari ini atau belum clock in.
                                                </div>
                                            )}
                                        </DialogContent>
                                    </Dialog>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Card 3: Add Absence */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg font-medium text-muted-foreground">
                                    Add Absence
                                </CardTitle>
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
                                            <AbsenceAddForm
                                                employeeId={userId}
                                                companyId={companyId}
                                                onSuccess={handleAddAbsenceSuccess}
                                                onClose={() => setOpenAbsenceDialog(false)}
                                            />
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
