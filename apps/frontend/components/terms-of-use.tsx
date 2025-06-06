'use client';

import {
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export default function TermsOfUse() {
  return (
    <DialogHeader>
      <DialogTitle>Terms of Use</DialogTitle>

      <div className="text-gray-600 text-sm space-y-4 mt-2">
        <p>
          Welcome to the Human Resource Information System (HRIS). By accessing
          and using this system, you agree to comply with the following Terms of
          Use. Please read them carefully.
        </p>

        <p>
          <strong>1. Authorized Use</strong><br />
          This system is intended solely for use by authorized employees and
          administrators of the company. Accessing HRIS using another person’s
          credentials or sharing login details is strictly prohibited.
        </p>

        <p>
          <strong>2. Data Accuracy</strong><br />
          Users are responsible for ensuring the accuracy of the personal and
          employment-related data they submit. Falsification of information may
          lead to disciplinary action.
        </p>

        <p>
          <strong>3. Confidentiality</strong><br />
          All information contained in the HRIS, including employee data,
          salaries, and performance records, must be kept confidential.
          Unauthorized disclosure or misuse of this data is subject to company
          policy and applicable laws.
        </p>

        <p>
          <strong>4. System Availability</strong><br />
          While we strive to maintain 24/7 access, system downtime may occur for
          maintenance or due to unforeseen issues. The company is not liable for
          any inconvenience caused by such downtime.
        </p>

        <p>
          <strong>5. Monitoring</strong><br />
          User activities within the HRIS may be logged and monitored to ensure
          compliance with security and usage policies.
        </p>

        <p>
          <strong>6. Security</strong><br />
          Users must take necessary precautions to protect their login
          credentials. If you suspect unauthorized access, report it to the HR
          or IT department immediately.
        </p>

        <p>
          <strong>7. Changes to Terms</strong><br />
          The company reserves the right to update or modify these Terms of Use
          at any time. Continued use of the system signifies acceptance of the
          revised terms.
        </p>

        <p>
          By using this system, you acknowledge that you have read, understood,
          and agree to comply with these Terms of Use.
        </p>
      </div>
    </DialogHeader>
  );
}
