// End to end test

const request = require('supertest');
const express = require('express');
const { sync } = require('../server/controllers/syncMenu');
const { pool } = require('../database/pgPool');

const app = express();
app.get('/trigger-sync', sync);

describe('GET /trigger-sync', () => {
  let server;

  beforeAll((done) => {
    server = app.listen(() => {
      console.log('Server started');
      done();
    });
  });

  afterAll((done) => {
    server.close(async () => {
      console.log('Server closed');
      await pool.end();
      console.log('Pool closed');
      done();
    });
  });

  it('should trigger menu sync and return status 200', async () => {
    const res = await request(server).get('/trigger-sync');
    expect(res.statusCode).toEqual(200);
    expect(res.text).toEqual('Menu synchronization complete!');
  });
});