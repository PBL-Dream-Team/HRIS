<img src="apps/frontend/public/images/logo.png" alt="HRIS" width="120" />

# HRIS - Human Resource Information System

Human Resource Information System (HRIS) is a software application designed to help organizations manage and automate various human resource functions. This system typically includes features such as employee management, attendance tracking, absence requests, and document handling.
</br></br>
## Contributor
- **Andreagazy Iza Amerianto** as *Project Manager & System Analyst*
- **Armand Maulana Andika Putra** as *UI/UX Designer*
- **Farid Fitriansah Alfarizi** as *Frontend Developer*
- **Muhammad Bagus Indrawan** as *Quality Assurance & Cloud Engineer*
- **Ricky Putra Pratama Tedjo** as *Backend Developer*
</br></br>
## Tech Stack

### Project Management
![Notion](https://img.shields.io/badge/Notion-000000?logo=notion&logoColor=white&style=for-the-badge)
![Google Docs](https://img.shields.io/badge/Google_Docs-4285F4?logo=google-docs&logoColor=white&style=for-the-badge)
### UI/UX
![Figma](https://img.shields.io/badge/Figma-F24E1E?logo=figma&logoColor=white&style=for-the-badge)
### Frontend
![Next.js](https://img.shields.io/badge/Next.js-000000?logo=next.js&logoColor=white&style=for-the-badge)
![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB&style=for-the-badge)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?logo=tailwindcss&logoColor=white&style=for-the-badge)
### Backend
![NestJS](https://img.shields.io/badge/NestJS-E0234E?logo=nestjs&logoColor=white&style=for-the-badge)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?logo=postgresql&logoColor=white&style=for-the-badge)
![Supabase](https://img.shields.io/badge/Supabase-000000?logo=supabase&logoColor=3ECF8E&style=for-the-badge)
### Quality Assurance
![Cypress](https://img.shields.io/badge/Cypress-17202C?logo=cypress&logoColor=white&style=for-the-badge)
![Postman](https://img.shields.io/badge/Postman-FF6C37?logo=postman&logoColor=white&style=for-the-badge)
![Google Sheets](https://img.shields.io/badge/Google_Sheets-34A853?logo=google-sheets&logoColor=white&style=for-the-badge)
### Cloud Computing
![Google Cloud](https://img.shields.io/badge/Google_Cloud-4285F4?logo=google-cloud&logoColor=white&style=for-the-badge)
![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-20232A?logo=github-actions&logoColor=white&style=for-the-badge)

</br>

```
HRIS/
├── .github/
│   └── workflows/        # CI/CD workflows
├── apps/
│   ├── frontend/         # Next.js application
│   └── backend/          # Nest.js application
├── cypress/
│   └── e2e/              # End to end testing script
├── docker/
|   ├── frontend/         # Dockerfile for frontend
|   └── backend/          # Dockerfile for backend
└── prisma/
    ├── migrations/       # Database migrations
    └── schema.prisma     # Database schema
    └── seeder.ts         # Database seeder
```

</br>
## Cloud Architecture

![alt text](clouddiagram.png)

</br></br>
## Setup

### Install node modules

```
npm install
```

### Generate database from existing migrations

```
 npx prisma generate
```

Then,

```
npx prisma migrate deploy
```

### Create a .env file

You could create one by duplicating the `.env.example` file in root and renaming it to `.env`. Then configure the `PORT` and the PostgreSQL url in `DATABASE_URL` based on your Postgres configuration.

### To run the backend

```
npm run start:backend
```

### To run the frontend

```
npm run start:frontend
```

More commands can be found on the `scripts` properties in `package.json` file in root.
