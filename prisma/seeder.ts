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
        // id: "d63b6982-048d-414e-92d4-50357234e010",
        name: 'Bronze', // Testing only
        max_employee: 14,
        price_per_employee: 1000,
        type: 'PAID',
        day_length: 28,
      },
      {
        // id: "d63b6982-048d-414e-92d4-50357234e010",
        name: 'Silver',
        max_employee: 30,
        price_per_employee: 1500,
        type: 'PAID',
        day_length: 28,
      },
      {
        // id: "d63b6982-048d-414e-92d4-50357234e010",
        name: 'Gold',
        max_employee: 60,
        price_per_employee: 1500,
        type: 'PAID',
        day_length: 28,
      },
    ],
  });

  await prisma.company.create({
    data: {
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
        is_admin: true,
      },
      {
        first_name: 'Setia',
        last_name: 'Budi',
        email: 'setiabudi@gmail.com',
        password: await hash('admin123'),
        company_id: '9be1d801-23af-4727-ae39-a2bf74ec00e0',
        is_admin: false,
        attendance_id: '1c2e0ec4-3957-4a5c-bc70-e4ad1b99391a',
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
