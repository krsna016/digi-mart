import request from 'supertest';
import app from '../src/app'; // Assumed Express app entry point

describe('Product API Endpoints', () => {
  it('should fetch all products successfully', async () => {
    const res = await request(app).get('/api/products');
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body.data)).toBeTruthy();
  });

  it('should return 404 for non-existent product', async () => {
    const res = await request(app).get('/api/products/999999');
    expect(res.statusCode).toEqual(404);
  });
});

describe('Authentication Flow', () => {
  it('should reject unauthenticated checkout requests', async () => {
    const res = await request(app).post('/api/checkout').send({ cart: [] });
    expect(res.statusCode).toEqual(401);
  });
});
