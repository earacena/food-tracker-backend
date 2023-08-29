import supertest from 'supertest';
import app from './app';

const api = supertest(app.expressApp);

test('simple app test', async () => {
  const response = await api
    .get('/')
    .expect(200);

  const responseData = JSON.parse(response.text);
  expect(responseData).toStrictEqual({ data: 'Hello World!' });
});
