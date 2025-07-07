import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  vus: 10, // virtual users
  duration: '30s', // test duration
};

export default function () {
  // First authenticate to get token
  const loginPayload = JSON.stringify({
    input: "admin@gmail.com",
    password: "admin123"
  });

  const loginHeaders = {
    'Content-Type': 'application/json'
  };

  // Authenticate
  let loginRes = http.post(
    'https://hris.api.lithiaproject.com/api/auth/signin/email',
    loginPayload,
    { headers: loginHeaders }
  );

  // Check if login was successful
  check(loginRes, {
    'login successful': (r) => r.status === 201 || r.status === 200,
  });

  // Extract token from response
  const token = loginRes.json('accessToken');
  
  // Headers for employee API request
  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };

  // Make GET request to employee endpoint
  let employeeRes = http.get(
    'https://hris.api.lithiaproject.com/api/employee',
    { headers: headers }
  );

  // Verify employee response
  check(employeeRes, {
    'employee data retrieved successfully': (r) => r.status === 200,
    'response has data': (r) => r.json('data') !== undefined,
  });

  // Optional: Log number of employees retrieved
  if (employeeRes.status === 200) {
    const employees = employeeRes.json('data');
    if (employees && Array.isArray(employees)) {
      console.log(`Retrieved ${employees.length} employees`);
    }
  }

  sleep(1); // 1 second delay between requests
}