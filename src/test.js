import * as chai from 'chai';
import supertest from 'supertest';
import app from './app.js';
import sequelize from './config/db-config.js';

const { expect } = chai;
const request = supertest(app);



describe('/v1/user endpoint', () => {
  const getUserEndpoint = '/v1/user/self';
  const getPostUserEndpoint = '/v1/user';
  const basicAuthUsername = 'testuser2@gmail.com';
  const basicAuthPassword = 'password'
  let authToken = Buffer.from(`${basicAuthUsername}:${basicAuthPassword}`).toString('base64');;
  const ensureUsersTableExists = async () => {
    try {
      await sequelize.authenticate();
      await sequelize.sync();
      console.log('Table "users" exists or has been created successfully');
    } catch (error) {
      console.error('Error ensuring "users" table existence:', error);
      throw error;
    }
  };
  before(async () => {
    await ensureUsersTableExists();
  })
  it('should create an account and validate its existence', async () => {
    try {
;
      const user = await request.post(getPostUserEndpoint)
        .send({
          first_name: 'John',
          last_name: 'Doe',
          userName: basicAuthUsername,
          password: basicAuthPassword,
        });

      const response = await request.get(getUserEndpoint)
        .set('Authorization', `Basic ${authToken}`)
        .expect(200);
    
      expect(response.body.username).to.equal('testuser2@gmail.com');
      expect(response.body).to.have.property('id');
    } catch (error) {
      console.error("Error during user creation:", error);
      throw error; // Re-throw the error to fail the test
    }
    
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

  after(async () => {
    try {
      await sequelize.close();
      console.log('Sequelize connection closed successfully');
    } catch (error) {
      console.error('Error closing Sequelize connection:', error);
    }
  });
});