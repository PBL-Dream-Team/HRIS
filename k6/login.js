import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  vus: 10, // virtual users
  duration: '30s', // durasi test
};

export default function () {
  // Request payload
  const payload = JSON.stringify({
    input: "admin@gmail.com",
    password: "admin123"
  });

  // Request headers
  const headers = {
    'Content-Type': 'application/json'
  };

  // Make POST request with payload
  let res = http.post(
    'https://hris.api.lithiaproject.com/api/auth/signin/email',
    payload,
    { headers: headers }
  );

  // Verify response
  check(res, {
    'status was 201': (r) => r.status === 201,
  });

  sleep(3); // delay 1 detik antara request
}
