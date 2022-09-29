import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';
import UserModel from '../database/models/UserModel';
import { userLoginSend, userMock } from './mocks/User';

import { Response } from 'superagent';

chai.use(chaiHttp);

const { expect } = chai;

describe('/LOGIN', () => {
  before(async () => {
    sinon.stub(UserModel, 'findAll').resolves([userMock] as UserModel[]);
  });

  after(() => {
    (UserModel.findAll as sinon.SinonStub).restore();
  });

  it('Deve fazer login com sucesso', async () => {
    const result: Response = await chai
      .request(app)
      .post('/login')
      .send(userLoginSend);
    expect(result.status).to.equal(201);
  });

  it('Caso não seja passado um email, retorne a mensagem "All fields must be filled"', async () => {
    const result: Response = await chai
      .request(app)
      .post('/login')
      .send({ password: '' });
    expect(result.status).to.equal(400);
  });

  it('Caso o email não seja valido, retorne a mensagem "Incorrect email or password"', async () => {
    const result: Response = await chai
      .request(app)
      .post('/login')
      .send({ ...userLoginSend, email: 'email_invalido' });
    expect(result.status).to.equal(401);
  });
});
