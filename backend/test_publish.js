const http = require('http');

async function request(options, body) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: data ? JSON.parse(data) : null,
        });
      });
    });

    req.on('error', (err) => reject(err));

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

async function run() {
  try {
    console.log("Logging in as captain...");
    const loginRes = await request({
      hostname: '192.168.0.133',
      port: 3000,
      path: '/api/v1/auth/login',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    }, {
      email: 'captain@nittojatra.com',
      password: 'Demo1234!',
    });

    if (loginRes.statusCode !== 200) {
      console.error("Login failed:", loginRes.statusCode, loginRes.body);
      return;
    }

    const token = loginRes.body.data.accessToken;
    console.log("Logged in successfully. Token obtained.");

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(9, 0, 0, 0);

    console.log("Sending publish request...");
    const publishRes = await request({
      hostname: '192.168.0.133',
      port: 3000,
      path: '/api/v1/rides/publish',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    }, {
      fromName: 'Mirpur Test',
      toName: 'Motijheel Test',
      departureTime: tomorrow.toISOString(),
      serviceType: 'ac',
      totalSeats: 4,
      price: 120,
    });

    console.log("Publish response:", publishRes.statusCode, publishRes.body);

    console.log("Sending GET /rides/my request...");
    const myRidesRes = await request({
      hostname: '192.168.0.133',
      port: 3000,
      path: '/api/v1/rides/my',
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    console.log("GET /rides/my response:", myRidesRes.statusCode, myRidesRes.body);

    console.log("Sending GET /bookings/dashboard request...");
    const dashboardRes = await request({
      hostname: '192.168.0.133',
      port: 3000,
      path: `/api/v1/bookings/dashboard?date=${tomorrow.toISOString().slice(0, 10)}`,
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    console.log("GET /bookings/dashboard response:", dashboardRes.statusCode, dashboardRes.body);
  } catch (e) {
    console.error("Error occurred:", e);
  }
}

run();
