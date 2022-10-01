import * as sinon from 'sinon';
import * as chai from 'chai';
import * as Jwt from 'jsonwebtoken';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';
import UserModel from '../database/models/UserModel';
import TokenHelper from '../helpers/tokenHelper';
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
      expect(result.status).to.equal(200);
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
      expect(result.status).to.eql(400);
      expect(result.body.message).to.have.eql('All fields must be filled');
    });

    it('se password não for passado', async () => {
      const result: Response = await chai
        .request(app)
        .post('/login')
        .send({ email: 'test123@gmail.com' });
      expect(result.status).to.equal(400);
      expect(result.body).to.have.key('message');
      expect(result.body.message).to.have.eql('All fields must be filled');
    });

    it('Caso o email não seja valido', async () => {
      const result: Response = await chai
        .request(app)
        .post('/login')
        .send({ ...userLoginSend, email: 'email_invalido' });
      expect(result.status).to.equal(401);
      expect(result.body).to.have.key('message');
      expect(result.body.message).to.have.equals('Incorrect email or password');
    });

    it('Caso a senha esteja incorreta', async () => {
      const result: Response = await chai
        .request(app)
        .post('/login')
        .send({ ...userLoginSend, password: 'senhaqualqur' });
      expect(result.status).to.be.equal(401);
      expect(result.body).to.have.key('message');
      expect(result.body.message).to.have.equal('Incorrect email or password');
    });
  });
  describe('caso aconteça algum problema interno', () => {
    beforeEach(async () => {
      sinon.stub(UserModel, 'findAll').rejects();
    });

    afterEach(() => {
      (UserModel.findAll as sinon.SinonStub).restore();
    });

    it('Deve retornar "Internal Error!"', async () => {
      const response = await chai
        .request(app)
        .post('/login')
        .send(userLoginSend);
      expect(response.status).to.equal(500);
      expect(response.body).to.be.have.key('message');
      expect(response.body.message).to.equal('Internal Error!');
    });
  });
});

describe('/LOGIN/VALIDATE', () => {
  describe('Sucesso caso passe um token', () => {
    beforeEach(async () => {
      sinon.stub(UserModel, 'findAll').resolves([userMock] as UserModel[]);
      sinon.stub(Jwt, 'verify').resolves({ email: userMock.email });
    });

    afterEach(() => {
      (UserModel.findAll as sinon.SinonStub).restore();
      (Jwt.verify as sinon.SinonStub).restore();
    });

    it('deve retornar o tipo do usuario', async () => {
      const getToken: Response = await chai
        .request(app)
        .post('/login')
        .send(userLoginSend);
      const { token } = getToken.body;

      const response = await chai
        .request(app)
        .get('/login/validate')
        .auth(token, { type: 'bearer' })
        .send();
      expect(response.status).to.equal(200);
      expect(response.body).to.have.key('role');
      expect(response.body.role).to.equal('admin');
    });
  });
  describe('caso o token não seja valido', () => {
    beforeEach(async () => {
      sinon.stub(UserModel, 'findAll').resolves([userMock] as UserModel[]);
    });

    afterEach(() => {
      (UserModel.findAll as sinon.SinonStub).restore();
    });

    it('deve retornar "Invalid token"', async () => {
      const response = await chai
        .request(app)
        .get('/login/validate')
        .auth('fakeToken', { type: 'bearer' })
        .send();
      expect(response.status).to.equal(401);
      expect(response.body).to.have.key('message');
      expect(response.body.message).to.equal('Invalid token');
    });

    it('deve retornar "Token not found"', async () => {
      const response = await chai.request(app).get('/login/validate').send();
      expect(response.status).to.equal(401);
      expect(response.body).to.have.key('message');
      expect(response.body.message).to.equal('Token not found');
    });
  });
});
