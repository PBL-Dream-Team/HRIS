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
  
  // Headers for letter API request
  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };

  // Make GET request to letter endpoint
  let letterRes = http.get(
    'https://hris.api.lithiaproject.com/api/letter',
    { headers: headers }
  );

  // Verify letter response
  check(letterRes, {
    'letter data retrieved successfully': (r) => r.status === 200,
    'response has data': (r) => r.json('data') !== undefined,
  });

  // Optional: Log letter data details
  if (letterRes.status === 200) {
    const letterData = letterRes.json('data');
    if (letterData && Array.isArray(letterData)) {
      console.log(`Retrieved ${letterData.length} letter records`);
    }
  }

  sleep(1); // 1 second delay between requests
}