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
  
  // Headers for company API request
  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };

  // Make GET request to company endpoint
  let companyRes = http.get(
    'https://hris.api.lithiaproject.com/api/company',
    { headers: headers }
  );

  // Verify company response
  check(companyRes, {
    'company data retrieved successfully': (r) => r.status === 200,
    'response has data': (r) => r.json('data') !== undefined,
  });

  // Optional: Log company data details
  if (companyRes.status === 200) {
    const companies = companyRes.json('data');
    if (companies && Array.isArray(companies)) {
      console.log(`Retrieved ${companies.length} companies`);
    }
  }

  sleep(1); // 1 second delay between requests
}