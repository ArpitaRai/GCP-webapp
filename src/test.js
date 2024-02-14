import * as chai from 'chai';
import supertest from 'supertest';
import app from './app.js';
import sequelize from './config/db-config.js';

const { expect } = chai;
const request = supertest(app);

describe('User API Endpoint Tests', () => {
  const userSelfEndpoint = '/v1/user/self';
  const postUserEndpoint = '/v1/user';
  const testUserEmail = 'testuser2@gmail.com';
  const testUserPassword = 'password';
  let authCredentials;

  const ensureUsersTableExists = async () => {
    try {
      await sequelize.authenticate();
      await sequelize.sync({ force: true }); // Force synchronization to clean the database
      console.log('Table "users" exists or has been created successfully');
    } catch (error) {
      console.error('Error ensuring the existence of the "users" table:', error);
      throw error;
    }
  };

  beforeEach(async () => {
    // Ensure a clean state before each test
    await ensureUsersTableExists();

    // Create a test account
    const createUserResponse = await request.post(postUserEndpoint)
      .send({
        first_name: 'John',
        last_name: 'Doe',
        username: testUserEmail,
        password: testUserPassword,
      });

    // Get the authentication credentials for later use
    authCredentials = Buffer.from(`${testUserEmail}:${testUserPassword}`).toString('base64');
  });

  it('should create an account and validate its existence', async () => {
    try {
      const response = await request.get(userSelfEndpoint)
        .set('Authorization', `Basic ${authCredentials}`)
        .expect(200);

      expect(response.body.username).to.equal(testUserEmail);
      expect(response.body).to.have.property('id');
      expect(response.body.first_name).to.equal('John');
      expect(response.body.last_name).to.equal('Doe');
      expect(response.body).to.have.property('account_created');
      expect(response.body).to.have.property('account_updated');
    } catch (error) {
      console.error("Error during the creation of a user account:", error);
      throw error; // Re-throw the error to fail the test
    }
  });

  it('should update the account and validate the update', async () => {
    const updateResponse = await request.put(userSelfEndpoint)
      .send({
        first_name: 'UpdatedJohn',
        last_name: 'UpdatedDoe',
        password: testUserPassword,
      })
      .set('Authorization', `Basic ${authCredentials}`)
      .expect(204);

    const getResponse = await request.get(userSelfEndpoint)
      .set('Authorization', `Basic ${authCredentials}`)
      .expect(200);

    expect(getResponse.body.username).to.equal(testUserEmail);
    expect(getResponse.body.first_name).to.equal('UpdatedJohn');
    expect(getResponse.body.last_name).to.equal('UpdatedDoe');
  });

  after(() => {
    // Exit the process after the tests are completed
    process.exit(0);
  });
});
