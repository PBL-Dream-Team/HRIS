import { PrismaClient } from '@prisma/client';
import { hash } from 'argon2';
const prisma = new PrismaClient();

async function main() {
  await prisma.subscription.createMany({
    data: [
      {
        id: 'bcf1b2a6-bdc2-4b66-98b1-e8a2c0ea2e95',
        name: 'Trial',
        max_employee: 10,
        price_per_employee: 0,
        type: 'TRIAL',
        day_length: 14,
      },
      {
        id: 'd63b6982-048d-414e-92d4-50357234e010',
        name: 'Pay as you go',
        price_per_employee: 7000,
        type: 'PAID',
        day_length: 28,
      },
      {
        id: "3883ceb2-0e1b-416a-a04a-25a1c13ea235",
        name: 'Bronze', // Testing only
        max_employee: 14,
        price_per_employee: 1000,
        type: 'PAID',
        day_length: 28,
      },
      {
        id: "570e5b14-c64a-420c-a0a9-2d139a197c4f",
        name: 'Silver',
        max_employee: 30,
        price_per_employee: 1500,
        type: 'PAID',
        day_length: 28,
      },
      {
        id: "83ae1693-b69d-42ba-93c4-66eb6efffb6f",
        name: 'Gold',
        max_employee: 60,
        price_per_employee: 1500,
        type: 'PAID',
        day_length: 28,
      },
    ],
  });

  await prisma.company.createMany({
    data: [
      {
        id: '9be1d801-23af-4727-ae39-a2bf74ec00e0',
        name: 'PBL 2',
        subscription_id: 'bcf1b2a6-bdc2-4b66-98b1-e8a2c0ea2e95',
        max_employee: 10,
        subs_date_start: '2025-05-29T14:25:30.123+08:00',
        subs_date_end: '2025-06-12T14:25:30.123+08:00',
        loc_lat: -7.94627,
        loc_long: 112.619786,
        address:
          'Jalan Pinangsia, Jatimulyo, Malang, Kota Malang, East Java, Java, 65113, Indonesia',
      },
      {
        id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        name: 'HRIS Testing co.',
        loc_lat: -7.94627,
        loc_long: 112.619786,
        address:
          'Jalan Pinangsia, Jatimulyo, Malang, Kota Malang, East Java, Java, 65113, Indonesia',
      },
    ],
  });

  await prisma.attendanceType.createMany({
    data: [
      {
        id: '3f5e99b8-8af9-4e9f-b2d7-4a939e3a9e2d',
        company_id: '9be1d801-23af-4727-ae39-a2bf74ec00e0',
        name: 'WFA',
        check_in: '1970-01-01T09:00:00.000+07:00',
        check_out: '1970-01-01T17:00:00.000+07:00',
      },
      {
        id: '7b6fc280-61fc-4e61-96f1-c41de52d7b8b',
        company_id: '9be1d801-23af-4727-ae39-a2bf74ec00e0',
        name: 'Hybrid',
        check_in: '1970-01-01T09:00:00.000+07:00',
        check_out: '1970-01-01T17:00:00.000+07:00',
        workspace_address:
          'Jalan Pinangsia, Jatimulyo, Malang, Kota Malang, East Java, Java, 65113, Indonesia',
        workspace_lat: -7.94627,
        workspace_long: 112.619786,
      },
      {
        id: '1c2e0ec4-3957-4a5c-bc70-e4ad1b99391a',
        company_id: '9be1d801-23af-4727-ae39-a2bf74ec00e0',
        name: 'WFO',
        check_in: '1970-01-01T09:00:00.000+07:00',
        check_out: '1970-01-01T17:00:00.000+07:00',
        workspace_address:
          'Jalan Pinangsia, Jatimulyo, Malang, Kota Malang, East Java, Java, 65113, Indonesia',
        workspace_lat: -7.94627,
        workspace_long: 112.619786,
      },
    ],
  });

  await prisma.employee.createMany({
    data: [
      {
        first_name: 'PBL',
        last_name: 'Admin',
        email: 'admin@gmail.com',
        password: await hash('admin123'),
        company_id: '9be1d801-23af-4727-ae39-a2bf74ec00e0',
        position:"HR",
        is_admin: true,
      },
      {
        id: '52d3a116-ac55-49a8-8123-8bda6c109362',
        first_name: 'Setia',
        last_name: 'Budi',
        email: 'setiabudi@gmail.com',
        password: await hash('admin123'),
        company_id: '9be1d801-23af-4727-ae39-a2bf74ec00e0',
        is_admin: false,
        attendance_id: '1c2e0ec4-3957-4a5c-bc70-e4ad1b99391a',
        position:"Employee",
        workscheme: 'WFO',
      },
      {
        first_name: 'Daffa',
        last_name: 'Yudisa',
        email: 'dappyud@gmail.com',
        password: await hash('admin123'),
        company_id: '9be1d801-23af-4727-ae39-a2bf74ec00e0',
        is_admin: false,
        attendance_id: '7b6fc280-61fc-4e61-96f1-c41de52d7b8b',
        workscheme: 'HYBRID',
        position:"Employee"
      },
      {
        first_name: 'HRIS',
        last_name: 'Admin',
        email: 'hris-admin@gmail.com',
        password: await hash('hrisadmin123'),
        company_id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        is_admin: true,
        position:"HR"
      },
    ],
  });

  await prisma.attendance.createMany({
    data: [
      {
        id: '1988c784-5b09-4977-9249-319781cd0e04',
        company_id: '9be1d801-23af-4727-ae39-a2bf74ec00e0',
        employee_id: '52d3a116-ac55-49a8-8123-8bda6c109362',
        check_in: '1970-01-01T14:02:35.000+07:00',
        check_in_status: 'LATE',
        check_in_long: 112.609121,
        check_in_lat: -7.937615,
        check_out: '1970-01-01T14:08:28.000+07:00',
        check_out_long: 112.609121,
        check_out_lat: -7.937644,
        created_at: '2025-06-02T21:02:35.544+07:00',
        updated_at: '2025-06-02T21:08:28.554+07:00',
        deleted_at: null,
        is_deleted: false,
        check_in_address:
          'Dinoyo, Malang, Kota Malang, East Java, Java, 65144, Indonesia',
        check_out_address:
          'Dinoyo, Malang, Kota Malang, East Java, Java, 65144, Indonesia',
        type_id: '1c2e0ec4-3957-4a5c-bc70-e4ad1b99391a',
        check_out_status: 'ON_TIME',
        filedir: null,
        approval: 'APPROVED',
      },
      {
        id: 'f1c2e0ec-3957-4a5c-bc70-e4ad1b99391a',
        company_id: '9be1d801-23af-4727-ae39-a2bf74ec00e0',
        employee_id: '52d3a116-ac55-49a8-8123-8bda6c109362',
        check_in: '1970-01-01T14:02:35.000+07:00',
        check_in_status: 'ON_TIME',
        check_in_long: 112.609121,
        check_in_lat: -7.937615,
        check_out: '1970-01-01T14:08:28.000+07:00',
        check_out_long: 112.609121,
        check_out_lat: -7.937644,
        created_at: '2025-06-02T21:02:35.544+07:00',
        updated_at: '2025-06-02T21:08:28.554+07:00',
        deleted_at: null,
        is_deleted: false,
        check_in_address:
          'Dinoyo, Malang, Kota Malang, East Java, Java, 65144, Indonesia',
        check_out_address:
          'Dinoyo, Malang, Kota Malang, East Java, Java, 65144, Indonesia',
        type_id: '3f5e99b8-8af9-4e9f-b2d7-4a939e3a9e2d',
        check_out_status: 'ON_TIME',
        filedir: null,
        approval: 'APPROVED',
      },
      {
        id: '7b6fc280-61fc-4e61-96f1-c41de52d7b8b',
        company_id: '9be1d801-23af-4727-ae39-a2bf74ec00e0',
        employee_id: '52d3a116-ac55-49a8-8123-8bda6c109362',
        check_in: '1970-01-01T14:02:35.000+07:00',
        check_in_status: 'ON_TIME',
        check_in_long: 112.609121,
        check_in_lat: -7.937615,
        check_out: '1970-01-01T14:08:28.000+07:00',
        check_out_long: 112.609121,
        check_out_lat: -7.937644,
        created_at: '2025-06-02T21:02:35.544+07:00',
        updated_at: '2025-06-02T21:08:28.554+07:00',
        deleted_at: null,
        is_deleted: false,
        check_in_address:
          'Dinoyo, Malang, Kota Malang, East Java, Java, 65144, Indonesia',
        check_out_address:
          'Dinoyo, Malang, Kota Malang, East Java, Java, 65144, Indonesia',
        type_id: '7b6fc280-61fc-4e61-96f1-c41de52d7b8b',
        check_out_status: 'ON_TIME',
        filedir: null,
        approval: 'APPROVED',
      },
      {
        id: '1c2e0ec4-3957-4a5c-bc70-e4ad1b99391a',
        company_id: '9be1d801-23af-4727-ae39-a2bf74ec00e0',
        employee_id: '52d3a116-ac55-49a8-8123-8bda6c109362',
        check_in: '1970-01-01T14:02:35.000+07:00',
        check_in_status: 'ON_TIME',
        check_in_long: 112.609121,
        check_in_lat: -7.937615,
        check_out: '1970-01-01T14:08:28.000+07:00',
        check_out_long: 112.609121,
        check_out_lat: -7.937644,
        created_at: '2025-06-02T21:02:35.544+07:00',
        updated_at: '2025-06-02T21:08:28.554+07:00',
        deleted_at: null,
        is_deleted: false,
        check_in_address:
          'Dinoyo, Malang, Kota Malang, East Java, Java, 65144, Indonesia',
        check_out_address:
          'Dinoyo, Malang, Kota Malang, East Java, Java, 65144, Indonesia',
        type_id: '1c2e0ec4-3957-4a5c-bc70-e4ad1b99391a',
        check_out_status: 'ON_TIME',
        filedir: null,
        approval: 'APPROVED',
      },
    ],
  });

  await prisma.absenceLeave.createMany({
    data: [
      {
        id: 'c1511ca5-5156-410d-a8fa-5217282c5277',
        employee_id: '52d3a116-ac55-49a8-8123-8bda6c109362',
        company_id: '9be1d801-23af-4727-ae39-a2bf74ec00e0',
        reason: 'Males kerja',
        date: '2025-06-02T00:00:00.000Z',
        status: 'APPROVED',
        created_at: '2025-06-02T21:03:49.071+07:00',
        updated_at: '2025-06-02T21:06:27.624+07:00',
        deleted_at: null,
        is_deleted: false,
        filedir:
          '1748873029070_WhatsApp Image 2025-05-15 at 14.32.56_eecb5327.jpg',
        type: 'LEAVE',
      },
      {
        id: 'd2f1c2e0-ec39-57a5-cb70-e4ad1b99391a',
        employee_id: '52d3a116-ac55-49a8-8123-8bda6c109362',
        company_id: '9be1d801-23af-4727-ae39-a2bf74ec00e0',
        reason: 'Demam tinggi',
        date: '2025-06-02T00:00:00.000Z',
        status: 'APPROVED',
        created_at: '2025-06-02T21:03:49.071+07:00',
        updated_at: '2025-06-02T21:06:27.624+07:00',
        deleted_at: null,
        is_deleted: false,
        filedir:
          '1748873029070_WhatsApp Image 2025-05-15 at 14.32.56_eecb5327.jpg',
        type: 'SICK',
      },
      {
        id: '7b6fc280-61fc-4e61-96f1-c41de52d7b8b',
        employee_id: '52d3a116-ac55-49a8-8123-8bda6c109362',
        company_id: '9be1d801-23af-4727-ae39-a2bf74ec00e0',
        reason: 'Ada keperluan mendesak',
        date: '2025-06-02T00:00:00.000Z',
        status: 'APPROVED',
        created_at: '2025-06-02T21:03:49.071+07:00',
        updated_at: '2025-06-02T21:06:27.624+07:00',
        deleted_at: null,
        is_deleted: false,
        filedir:
          '1748873029070_WhatsApp Image 2025-05-15 at 14.32.56_eecb5327.jpg',
        type: 'PERMIT',
      },
    ],
  });

  await prisma.letterType.create({
    data: {
      id: '2d72cde7-70b3-4340-9021-1739c5d06d2b',
      name: 'Surat Izin',
      company_id: '9be1d801-23af-4727-ae39-a2bf74ec00e0',
    },
  });

  console.log('✅ Seed complete');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
