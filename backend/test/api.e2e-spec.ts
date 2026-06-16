import {
  INestApplication,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Connection, connect } from 'mongoose';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { HttpExceptionFilter } from '../src/common/filters/http-exception.filter';
import { TransformInterceptor } from '../src/common/interceptors/transform.interceptor';

describe('NittoJatra REST API (e2e)', () => {
  let app: INestApplication;
  let mongoServer: MongoMemoryServer;
  let mongoConnection: Connection;

  const user = {
    fullName: 'API Test User',
    email: 'api-test@nittojatra.com',
    phone: '+8801733333333',
    password: 'SecurePass1!',
    gender: 'male',
  };

  let accessToken = '';
  let refreshToken = '';
  let userId = '';
  let locationId = '';
  let fromLocationId = '';
  let toLocationId = '';
  let operatorId = '';
  let routeId = '';
  let rideId = '';
  let bookingId = '';

  async function waitForSeed() {
    for (let attempt = 0; attempt < 20; attempt += 1) {
      const locations = await request(app.getHttpServer()).get('/api/v1/locations');
      if (locations.body.data?.length > 0) {
        return;
      }
      await new Promise((resolve) => setTimeout(resolve, 250));
    }
    throw new Error('Database seed did not complete in time');
  }

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    process.env.MONGODB_URI = mongoServer.getUri();
    process.env.JWT_ACCESS_SECRET = 'test-access-secret-min-32-characters';
    process.env.JWT_REFRESH_SECRET = 'test-refresh-secret-min-32-characters';
    process.env.JWT_ACCESS_EXPIRES_IN = '15m';
    process.env.JWT_REFRESH_EXPIRES_IN = '7d';
    process.env.BCRYPT_ROUNDS = '4';

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' });
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    app.useGlobalFilters(new HttpExceptionFilter());
    app.useGlobalInterceptors(new TransformInterceptor());
    await app.init();

    mongoConnection = (await connect(mongoServer.getUri())).connection;
    await waitForSeed();
  });

  afterAll(async () => {
    if (mongoConnection) {
      await mongoConnection.close();
    }
    if (mongoServer) {
      await mongoServer.stop();
    }
    if (app) {
      await app.close();
    }
  });

  describe('Health', () => {
    it('GET /api/v1/health', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/v1/health')
        .expect(200);

      expect(res.body.data.status).toBe('ok');
      expect(res.body.data.mongo).toBe('up');
    });
  });

  describe('Auth', () => {
    it('POST /api/v1/auth/register', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send(user)
        .expect(201);

      expect(res.body.success).toBe(true);
      expect(res.body.data.accessToken).toBeDefined();
      expect(res.body.data.refreshToken).toBeDefined();
      expect(res.body.data.user.email).toBe(user.email);
      accessToken = res.body.data.accessToken;
      refreshToken = res.body.data.refreshToken;
      userId = res.body.data.user._id;
    });

    it('POST /api/v1/auth/login', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({ email: user.email, password: user.password })
        .expect(200);

      expect(res.body.data.accessToken).toBeDefined();
      accessToken = res.body.data.accessToken;
      refreshToken = res.body.data.refreshToken;
    });

    it('POST /api/v1/auth/login rejects invalid password', async () => {
      await request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({ email: user.email, password: 'WrongPass1!' })
        .expect(401);
    });
  });

  describe('Users', () => {
    it('GET /api/v1/users/me', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/v1/users/me')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(res.body.data.email).toBe(user.email);
    });

    it('GET /api/v1/users/me rejects missing token', async () => {
      await request(app.getHttpServer()).get('/api/v1/users/me').expect(401);
    });

    it('PATCH /api/v1/users/me', async () => {
      const res = await request(app.getHttpServer())
        .patch('/api/v1/users/me')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ fullName: 'Updated API User' })
        .expect(200);

      expect(res.body.data.fullName).toBe('Updated API User');
    });

    it('PATCH /api/v1/users/me/password', async () => {
      await request(app.getHttpServer())
        .patch('/api/v1/users/me/password')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          currentPassword: user.password,
          newPassword: 'NewSecure1!',
          confirmNewPassword: 'NewSecure1!',
        })
        .expect(200);

      user.password = 'NewSecure1!';

      const login = await request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({ email: user.email, password: user.password })
        .expect(200);

      accessToken = login.body.data.accessToken;
      refreshToken = login.body.data.refreshToken;
    });
  });

  describe('Locations', () => {
    it('GET /api/v1/locations', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/v1/locations')
        .expect(200);

      expect(res.body.data.length).toBeGreaterThan(0);
      locationId = res.body.data[0]._id;
    });

    it('GET /api/v1/locations/search', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/v1/locations/search')
        .query({ q: 'Mirpur' })
        .expect(200);

      expect(res.body.data.length).toBeGreaterThan(0);
      fromLocationId = res.body.data[0]._id;

      const toRes = await request(app.getHttpServer())
        .get('/api/v1/locations/search')
        .query({ q: 'Motijheel' })
        .expect(200);

      toLocationId = toRes.body.data[0]._id;
    });

    it('GET /api/v1/locations/:id', async () => {
      const res = await request(app.getHttpServer())
        .get(`/api/v1/locations/${locationId}`)
        .expect(200);

      expect(res.body.data._id).toBe(locationId);
    });
  });

  describe('Operators', () => {
    it('GET /api/v1/operators', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/v1/operators')
        .expect(200);

      expect(res.body.data.length).toBeGreaterThan(0);
      operatorId = res.body.data[0]._id;
    });

    it('GET /api/v1/operators/:id', async () => {
      const res = await request(app.getHttpServer())
        .get(`/api/v1/operators/${operatorId}`)
        .expect(200);

      expect(res.body.data._id).toBe(operatorId);
    });

    it('POST /api/v1/operators rejects non-admin', async () => {
      await request(app.getHttpServer())
        .post('/api/v1/operators')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          name: 'Test Op',
          code: 'TEST',
          brandColor: '#000000',
          primaryType: 'ac',
          serviceTypes: ['ac'],
        })
        .expect(403);
    });
  });

  describe('Routes', () => {
    it('GET /api/v1/routes', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/v1/routes')
        .expect(200);

      expect(res.body.data.length).toBeGreaterThan(0);
      routeId = res.body.data[0]._id;
      if (!toLocationId) {
        toLocationId = res.body.data[0].toLocation._id;
      }
      if (!fromLocationId) {
        fromLocationId = res.body.data[0].fromLocation._id;
      }
    });

    it('GET /api/v1/routes/search', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/v1/routes/search')
        .query({ fromId: fromLocationId, toId: toLocationId })
        .expect(200);

      expect(res.body.data.fromLocation._id).toBe(fromLocationId);
    });

    it('GET /api/v1/routes/:id', async () => {
      const res = await request(app.getHttpServer())
        .get(`/api/v1/routes/${routeId}`)
        .expect(200);

      expect(res.body.data._id).toBe(routeId);
    });

    it('POST /api/v1/routes rejects non-admin', async () => {
      await request(app.getHttpServer())
        .post('/api/v1/routes')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          fromLocation: fromLocationId,
          toLocation: toLocationId,
          distanceKm: 10,
          estimatedMinutes: 30,
          basePrice: 25,
        })
        .expect(403);
    });
  });

  describe('Rides', () => {
    it('GET /api/v1/rides/search', async () => {
      const today = new Date().toISOString().slice(0, 10);
      const res = await request(app.getHttpServer())
        .get('/api/v1/rides/search')
        .query({
          fromLocationId,
          toLocationId,
          date: today,
        })
        .expect(200);

      expect(res.body.data.length).toBeGreaterThan(0);
      rideId = res.body.data[0]._id;
    });

    it('GET /api/v1/rides/today', async () => {
      const today = new Date().toISOString().slice(0, 10);
      const res = await request(app.getHttpServer())
        .get('/api/v1/rides/today')
        .query({ date: today })
        .expect(200);

      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
    });

    it('GET /api/v1/rides/:id', async () => {
      const res = await request(app.getHttpServer())
        .get(`/api/v1/rides/${rideId}`)
        .expect(200);

      expect(res.body.data._id).toBe(rideId);
    });

    it('GET /api/v1/rides/:id/seats', async () => {
      const res = await request(app.getHttpServer())
        .get(`/api/v1/rides/${rideId}/seats`)
        .expect(200);

      expect(res.body.data.seats.length).toBeGreaterThan(0);
    });

    it('POST /api/v1/rides rejects non-admin', async () => {
      await request(app.getHttpServer())
        .post('/api/v1/rides')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          route: routeId,
          operator: operatorId,
          departureTime: new Date().toISOString(),
          serviceType: 'ac',
          totalSeats: 32,
          price: 30,
        })
        .expect(403);
    });
  });

  describe('Bookings', () => {
    let seatNumber = '';

    it('POST /api/v1/bookings', async () => {
      const seats = await request(app.getHttpServer())
        .get(`/api/v1/rides/${rideId}/seats`)
        .expect(200);

      const available = seats.body.data.seats.find(
        (s: { status: string }) =>
          s.status === 'available' || s.status === 'women-only',
      );
      expect(available).toBeDefined();
      seatNumber = available.seatNumber;

      const res = await request(app.getHttpServer())
        .post('/api/v1/bookings')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          rideId,
          seats: [seatNumber],
          passengerName: user.fullName,
          passengerPhone: user.phone,
          passengerEmail: user.email,
          paymentMethod: 'bkash',
          promoCode: 'NITTO10',
        })
        .expect(201);

      expect(res.body.data.bookingId).toMatch(/^NJ-/);
      bookingId = res.body.data.bookingId;
    });

    it('GET /api/v1/bookings/dashboard', async () => {
      const today = new Date().toISOString().slice(0, 10);
      const res = await request(app.getHttpServer())
        .get('/api/v1/bookings/dashboard')
        .set('Authorization', `Bearer ${accessToken}`)
        .query({ date: today, page: 1, limit: 50 })
        .expect(200);

      expect(res.body.data.data.length).toBeGreaterThan(0);
    });

    it('GET /api/v1/bookings', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/v1/bookings')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(res.body.data.data.length).toBeGreaterThan(0);
    });

    it('GET /api/v1/bookings/:bookingId', async () => {
      const res = await request(app.getHttpServer())
        .get(`/api/v1/bookings/${bookingId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(res.body.data.bookingId).toBe(bookingId);
    });

    it('PATCH /api/v1/bookings/:bookingId/confirm-payment', async () => {
      const res = await request(app.getHttpServer())
        .patch(`/api/v1/bookings/${bookingId}/confirm-payment`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(res.body.data.paymentStatus).toBe('paid');
    });

    it('PATCH /api/v1/bookings/:bookingId/cancel', async () => {
      const res = await request(app.getHttpServer())
        .patch(`/api/v1/bookings/${bookingId}/cancel`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ cancellationReason: 'Test cancellation' })
        .expect(200);

      expect(res.body.data.status).toBe('cancelled');
    });
  });

  describe('Auth refresh & logout', () => {
    it('POST /api/v1/auth/refresh', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/v1/auth/refresh')
        .set('Authorization', `Bearer ${refreshToken}`)
        .expect(200);

      expect(res.body.data.accessToken).toBeDefined();
      accessToken = res.body.data.accessToken;
      refreshToken = res.body.data.refreshToken;
    });

    it('POST /api/v1/auth/logout', async () => {
      await request(app.getHttpServer())
        .post('/api/v1/auth/logout')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);
    });

    it('DELETE /api/v1/users/me deactivates account', async () => {
      const login = await request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({ email: user.email, password: user.password })
        .expect(200);

      const token = login.body.data.accessToken;

      await request(app.getHttpServer())
        .delete('/api/v1/users/me')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(userId).toBeTruthy();
    });
  });
});
