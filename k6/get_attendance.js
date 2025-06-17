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
  
  // Headers for attendance API request
  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };

  // Make GET request to attendance endpoint
  let attendanceRes = http.get(
    'https://hris.api.lithiaproject.com/api/attendance',
    { headers: headers }
  );

  // Verify attendance response
  check(attendanceRes, {
    'attendance data retrieved successfully': (r) => r.status === 200,
    'response has data': (r) => r.json('data') !== undefined,
  });

  // Optional: Log attendance data details
  if (attendanceRes.status === 200) {
    const attendanceData = attendanceRes.json('data');
    if (attendanceData && Array.isArray(attendanceData)) {
      console.log(`Retrieved ${attendanceData.length} attendance records`);
    }
  }

  sleep(1); // 1 second delay between requests
}