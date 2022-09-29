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
  describe('caso passe email e password validos', () => {
    beforeEach(async () => {
      sinon.stub(UserModel, 'findAll').resolves([userMock] as UserModel[]);
    });

    afterEach(() => {
      (UserModel.findAll as sinon.SinonStub).restore();
    });

    it('Deve fazer login com sucesso e retornar um token', async () => {
      const result: Response = await chai
        .request(app)
        .post('/login')
        .send(userLoginSend);
      expect(result.status).to.equal(201);
      expect(result.body).to.have.keys('token');
    });
  });

  describe('caso passem email ou password invalidos', () => {
    beforeEach(async () => {
      sinon.stub(UserModel, 'findAll').resolves([userMock] as UserModel[]);
    });

    afterEach(() => {
      (UserModel.findAll as sinon.SinonStub).restore();
    });

    it('se email não for passado', async () => {
      const result: Response = await chai
        .request(app)
        .post('/login')
        .send({ password: 'test123' });
      expect(result.body).to.have.key('message');
      expect(result.status).to.equal(400);
      expect(result.body).to.have.equal({
        message: 'All fields must be filled',
      });
    });

    it('se password não for passado', async () => {
      const result: Response = await chai
        .request(app)
        .post('/login')
        .send({ email: 'test123@gmail.com' });
      expect(result.status).to.equal(400);
      expect(result.body).to.have.key('message');
      expect(result.body).to.have.equal({
        message: 'All fields must be filled',
      });
    });

    it('Caso o email não seja valido', async () => {
      const result: Response = await chai
        .request(app)
        .post('/login')
        .send({ ...userLoginSend, email: 'email_invalido' });
      expect(result.status).to.equal(401);
      expect(result.body).to.have.key('message');
      expect(result.body).to.have.equals({
        message: 'Incorrect email or password',
      });
    });

    it('Caso a senha esteja incorreta', async () => {
      const result: Response = await chai
        .request(app)
        .post('/login')
        .send({ ...userLoginSend, password: 'senhaqualqur' });
      expect(result.status).to.be.equal(401);
      expect(result.body).to.have.key('message');
      expect(result.body).to.have.equal({
        message: 'Incorrect email or password',
      });
    });
  });
});
