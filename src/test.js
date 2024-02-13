import * as chai from 'chai';
import supertest from 'supertest';
import app from './app.js';

const { expect } = chai;
const request = supertest(app);

describe('/v1/user endpoint', () => {
  const getUserEndpoint = '/v1/user/self';
  const getPostUserEndpoint = '/v1/user';
  const basicAuthUsername = 'testuser2@gmail.com';
  const basicAuthPassword = 'password'
  let authToken = Buffer.from(`${basicAuthUsername}:${basicAuthPassword}`).toString('base64');;

  it('should create an account and validate its existence', async () => {
    const user = await request.post(getPostUserEndpoint)
      .send({
        first_name: 'John',
        last_name: 'Doe',
        userName: basicAuthUsername,
        password: basicAuthPassword,
    });  
    console.log("user response of post::" ,user);
    const response = await request.get(getUserEndpoint)
    .set('Authorization', `Basic ${authToken}`)
    .expect(200);
  
    expect(response.body.username).to.equal('testuser2@gmail.com');
    expect(response.body).to.have.property('id');
  });
  


  it('should update the account and validate the update', async () => {
    const updateResponse = await request.put(getUserEndpoint)
    .send({
        first_name: 'UpdatedJohn',
        last_name: 'UpdatedDoe',
        password: basicAuthPassword,
    })
    .set('Authorization', `Basic ${authToken}`)
    .expect(204);

const getResponse = await request.get(getUserEndpoint)
    .set('Authorization', `Basic ${authToken}`)
    .expect(200);

expect(getResponse.body.username).to.equal('testuser2@gmail.com');
expect(getResponse.body.first_name).to.equal('UpdatedJohn');
expect(getResponse.body.last_name).to.equal('UpdatedDoe');
  });
});