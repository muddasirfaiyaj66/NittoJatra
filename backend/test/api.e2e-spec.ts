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
      const locations = await request(app.getHttpServer()).get(
        '/api/v1/locations',
      );
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
        .send({
          fullName: 'Updated API User',
          vehicleModel: 'Tesla Model 3',
          vehiclePlate: 'Dhaka Metro-HA-12-3456',
          emergencyContact: '+8801799999999',
          emergencyContactEmail: 'emergency-test@nittojatra.com',
        })
        .expect(200);

      expect(res.body.data.fullName).toBe('Updated API User');
      expect(res.body.data.vehicleModel).toBe('Tesla Model 3');
      expect(res.body.data.vehiclePlate).toBe('Dhaka Metro-HA-12-3456');
      expect(res.body.data.emergencyContact).toBe('+8801799999999');
      expect(res.body.data.emergencyContactEmail).toBe('emergency-test@nittojatra.com');

      // Verify persistence via GET /me
      const getRes = await request(app.getHttpServer())
        .get('/api/v1/users/me')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(getRes.body.data.fullName).toBe('Updated API User');
      expect(getRes.body.data.vehicleModel).toBe('Tesla Model 3');
      expect(getRes.body.data.emergencyContactEmail).toBe('emergency-test@nittojatra.com');
    });

    it('PATCH /api/v1/users/me rejects invalid phone format', async () => {
      await request(app.getHttpServer())
        .patch('/api/v1/users/me')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ phone: '12345' })
        .expect(400);
    });

    it('PATCH /api/v1/users/me rejects invalid email format', async () => {
      await request(app.getHttpServer())
        .patch('/api/v1/users/me')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ emergencyContactEmail: 'not-an-email' })
        .expect(400);
    });

    it('PATCH /api/v1/users/me accepts null for optional fields', async () => {
      const res = await request(app.getHttpServer())
        .patch('/api/v1/users/me')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          emergencyContact: null,
          emergencyContactEmail: null,
        })
        .expect(200);

      expect(res.body.data.emergencyContact).toBeNull();
      expect(res.body.data.emergencyContactEmail).toBeNull();
    });

    it('PATCH /api/v1/users/me accepts empty string for optional email', async () => {
      const res = await request(app.getHttpServer())
        .patch('/api/v1/users/me')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          emergencyContactEmail: '',
        })
        .expect(200);

      expect(res.body.data.emergencyContactEmail).toBe('');
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

    it('PATCH /api/v1/operators/:id rejects non-admin', async () => {
      await request(app.getHttpServer())
        .patch(`/api/v1/operators/${operatorId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ name: 'Hacked Op' })
        .expect(403);
    });

    it('DELETE /api/v1/operators/:id rejects non-admin', async () => {
      await request(app.getHttpServer())
        .delete(`/api/v1/operators/${operatorId}`)
        .set('Authorization', `Bearer ${accessToken}`)
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

    it('PATCH /api/v1/routes/:id rejects non-admin', async () => {
      await request(app.getHttpServer())
        .patch(`/api/v1/routes/${routeId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ basePrice: 99 })
        .expect(403);
    });

    it('DELETE /api/v1/routes/:id rejects non-admin', async () => {
      await request(app.getHttpServer())
        .delete(`/api/v1/routes/${routeId}`)
        .set('Authorization', `Bearer ${accessToken}`)
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

    it('GET /api/v1/rides/search by location names', async () => {
      const today = new Date().toISOString().slice(0, 10);
      const res = await request(app.getHttpServer())
        .get('/api/v1/rides/search')
        .query({
          fromName: 'Mirpur',
          toName: 'Motijheel',
          date: today,
        })
        .expect(200);

      expect(res.body.data.length).toBeGreaterThan(0);
    });

    it('GET /api/v1/rides/search resolves UIU and DIU aliases', async () => {
      const today = new Date().toISOString().slice(0, 10);
      const res = await request(app.getHttpServer())
        .get('/api/v1/rides/search')
        .query({
          fromName: 'United International University',
          toName: 'Daffodil International University',
          date: today,
        })
        .expect(200);

      expect(res.body.data.length).toBeGreaterThan(0);
      expect(res.body.data[0].route.fromLocation.nameEn).toBe('UIU');
      expect(res.body.data[0].route.toLocation.nameEn).toBe('DIU');
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

    it('POST /api/v1/rides/publish allows demo captain', async () => {
      const loginRes = await request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({ email: 'captain@nittojatra.com', password: 'Demo1234!' })
        .expect(200);

      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(9, 0, 0, 0);

      const res = await request(app.getHttpServer())
        .post('/api/v1/rides/publish')
        .set('Authorization', `Bearer ${loginRes.body.data.accessToken}`)
        .send({
          fromName: 'Mirpur',
          toName: 'Motijheel',
          departureTime: tomorrow.toISOString(),
          serviceType: 'ac',
          totalSeats: 4,
          price: 120,
        })
        .expect(201);

      expect(res.body.data.route.fromLocation.nameEn).toBe('Mirpur');
      expect(res.body.data.totalSeats).toBe(4);
      expect(res.body.data.price).toBe(120);
      expect(res.body.data.driverUserId).toBe(loginRes.body.data.user._id);
    });

    it('GET /api/v1/rides/my returns driver-owned rides', async () => {
      const loginRes = await request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({ email: 'captain@nittojatra.com', password: 'Demo1234!' })
        .expect(200);

      const res = await request(app.getHttpServer())
        .get('/api/v1/rides/my')
        .set('Authorization', `Bearer ${loginRes.body.data.accessToken}`)
        .expect(200);

      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
      expect(
        res.body.data.every(
          (ride: any) => ride.driverUserId === loginRes.body.data.user._id,
        ),
      ).toBe(true);
    });

    it('GET /api/v1/rides/my rejects missing token', async () => {
      await request(app.getHttpServer()).get('/api/v1/rides/my').expect(401);
    });

    it('POST /api/v1/rides/publish creates custom locations', async () => {
      const loginRes = await request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({ email: 'captain@nittojatra.com', password: 'Demo1234!' })
        .expect(200);

      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(10, 30, 0, 0);

      const res = await request(app.getHttpServer())
        .post('/api/v1/rides/publish')
        .set('Authorization', `Bearer ${loginRes.body.data.accessToken}`)
        .send({
          fromName: 'Banani Block C',
          toName: 'Gulshan Avenue',
          departureTime: tomorrow.toISOString(),
          serviceType: 'non-ac',
          totalSeats: 6,
          price: 95,
        })
        .expect(201);

      expect(res.body.data.route.fromLocation.nameEn).toBe('Banani Block C');
      expect(res.body.data.route.toLocation.nameEn).toBe('Gulshan Avenue');
    });

    it('POST /api/v1/rides/publish rejects rider token', async () => {
      await request(app.getHttpServer())
        .post('/api/v1/rides/publish')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          fromName: 'Mirpur',
          toName: 'Motijheel',
          departureTime: new Date().toISOString(),
          serviceType: 'ac',
          totalSeats: 4,
          price: 120,
        })
        .expect(403);
    });

    it('PATCH /api/v1/rides/:id rejects non-admin', async () => {
      await request(app.getHttpServer())
        .patch(`/api/v1/rides/${rideId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ price: 99 })
        .expect(403);
    });

    it('DELETE /api/v1/rides/:id rejects non-admin', async () => {
      await request(app.getHttpServer())
        .delete(`/api/v1/rides/${rideId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(403);
    });
  });

  describe('Bookings', () => {
    let seatNumber = '';

    it('POST /api/v1/bookings rejects missing token', async () => {
      await request(app.getHttpServer())
        .post('/api/v1/bookings')
        .send({
          rideId: '000000000000000000000000',
          seats: ['A1'],
          passengerName: 'Ghost',
          passengerPhone: '+8801700000000',
          passengerEmail: 'ghost@example.com',
          paymentMethod: 'bkash',
        })
        .expect(401);
    });

    it('GET /api/v1/bookings/dashboard rejects missing token', async () => {
      await request(app.getHttpServer())
        .get('/api/v1/bookings/dashboard')
        .expect(401);
    });

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

    it('Messages — list, read, and send', async () => {
      const listRes = await request(app.getHttpServer())
        .get('/api/v1/messages/conversations')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(Array.isArray(listRes.body.data)).toBe(true);
      expect(listRes.body.data.length).toBeGreaterThan(0);
      expect(listRes.body.data[0].bookingRef).toBe(bookingId);

      const conversationId = listRes.body.data[0]._id;

      const byBookingRes = await request(app.getHttpServer())
        .get(`/api/v1/messages/conversations/booking/${bookingId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(byBookingRes.body.data._id).toBe(conversationId);

      const messagesRes = await request(app.getHttpServer())
        .get(`/api/v1/messages/conversations/${conversationId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(messagesRes.body.data.data.length).toBeGreaterThan(0);

      const sendRes = await request(app.getHttpServer())
        .post(`/api/v1/messages/conversations/${conversationId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ body: 'Hello captain, I am ready for pickup.' })
        .expect(201);

      expect(sendRes.body.data.body).toBe(
        'Hello captain, I am ready for pickup.',
      );
      expect(sendRes.body.data.senderRole).toBe('rider');
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

  describe('Demo accounts', () => {
    it('POST /api/v1/auth/login demo rider', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({ email: 'rider@nittojatra.com', password: 'Demo1234!' })
        .expect(200);

      expect(res.body.data.accessToken).toBeDefined();
      expect(res.body.data.user.email).toBe('rider@nittojatra.com');
    });

    it('POST /api/v1/auth/login demo captain', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({ email: 'captain@nittojatra.com', password: 'Demo1234!' })
        .expect(200);

      expect(res.body.data.accessToken).toBeDefined();
      expect(res.body.data.user.role).toBe('operator');
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

    it('DELETE /api/v1/users/me deactivates account', async () => {
      await request(app.getHttpServer())
        .delete('/api/v1/users/me')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(userId).toBeTruthy();
    });

    it('POST /api/v1/auth/logout', async () => {
      await request(app.getHttpServer())
        .post('/api/v1/auth/logout')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);
    });
  });
});
