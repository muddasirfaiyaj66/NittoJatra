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

describe('Booking flow (e2e)', () => {
  let app: INestApplication;
  let mongoServer: MongoMemoryServer;
  let mongoConnection: Connection;
  let accessToken = '';
  let rideId = '';
  let fromLocationId = '';
  let toLocationId = '';
  let bookingId = '';

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

    for (let attempt = 0; attempt < 20; attempt += 1) {
      const locations = await request(app.getHttpServer()).get(
        '/api/v1/locations',
      );
      if (locations.body.data?.length > 0) {
        break;
      }
      await new Promise((resolve) => setTimeout(resolve, 250));
    }

    await request(app.getHttpServer()).post('/api/v1/auth/register').send({
      fullName: 'Booking User',
      email: 'booking@nittojatra.com',
      phone: '+8801812345678',
      password: 'SecurePass1!',
      gender: 'male',
    });

    const login = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({
        email: 'booking@nittojatra.com',
        password: 'SecurePass1!',
      });

    accessToken = login.body.data.accessToken;
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

  it('searches rides and creates a booking', async () => {
    const locations = await request(app.getHttpServer())
      .get('/api/v1/locations')
      .expect(200);

    const mirpur = locations.body.data.find(
      (l: { nameEn: string }) => l.nameEn === 'Mirpur',
    );
    const motijheel = locations.body.data.find(
      (l: { nameEn: string }) => l.nameEn === 'Motijheel',
    );

    expect(mirpur).toBeDefined();
    expect(motijheel).toBeDefined();

    fromLocationId = mirpur._id;
    toLocationId = motijheel._id;

    const today = new Date().toISOString().slice(0, 10);
    const rides = await request(app.getHttpServer())
      .get('/api/v1/rides/search')
      .query({
        fromLocationId,
        toLocationId,
        date: today,
      })
      .expect(200);

    expect(rides.body.data.length).toBeGreaterThan(0);
    rideId = rides.body.data[0]._id;

    const seats = await request(app.getHttpServer())
      .get(`/api/v1/rides/${rideId}/seats`)
      .expect(200);

    const availableSeat = seats.body.data.seats.find(
      (s: { status: string }) =>
        s.status === 'available' || s.status === 'women-only',
    );
    expect(availableSeat).toBeDefined();

    const booking = await request(app.getHttpServer())
      .post('/api/v1/bookings')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        rideId,
        seats: [availableSeat.seatNumber],
        passengerName: 'Booking User',
        passengerPhone: '+8801812345678',
        passengerEmail: 'booking@nittojatra.com',
        paymentMethod: 'bkash',
      })
      .expect(201);

    bookingId = booking.body.data.bookingId;
    expect(bookingId).toMatch(/^NJ-/);

    const detail = await request(app.getHttpServer())
      .get(`/api/v1/bookings/${bookingId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(detail.body.data.bookingId).toBe(bookingId);

    await request(app.getHttpServer())
      .patch(`/api/v1/bookings/${bookingId}/cancel`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ cancellationReason: 'Changed plans' })
      .expect(200);

    const seatsAfter = await request(app.getHttpServer())
      .get(`/api/v1/rides/${rideId}/seats`)
      .expect(200);

    const released = seatsAfter.body.data.seats.find(
      (s: { seatNumber: string }) => s.seatNumber === availableSeat.seatNumber,
    );
    expect(released.status).not.toBe('booked');
  });
});
