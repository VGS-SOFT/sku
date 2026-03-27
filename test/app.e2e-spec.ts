import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => { await app.close(); });

  it('GET /api/v1/health should return ok', () => {
    return request(app.getHttpServer())
      .get('/api/v1/health')
      .expect(200)
      .expect((res) => {
        expect(res.body.status).toBe('ok');
        expect(res.body.environment).toBeDefined();
      });
  });

  it('GET /api/v1/health/ping should return pong', () => {
    return request(app.getHttpServer())
      .get('/api/v1/health/ping')
      .expect(200);
  });

  it('POST /api/v1/auth/login with invalid credentials returns 401', () => {
    return request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ email: 'wrong@test.com', password: 'wrongpass' })
      .expect(401);
  });

  it('GET /api/v1/skus is public (no auth required)', () => {
    return request(app.getHttpServer())
      .get('/api/v1/skus')
      .expect(200);
  });

  it('POST /api/v1/skus without auth returns 401', () => {
    return request(app.getHttpServer())
      .post('/api/v1/skus')
      .send({ productName: 'Test', categoryId: 1, variants: [] })
      .expect(401);
  });
});
