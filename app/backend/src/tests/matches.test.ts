import * as sinon from 'sinon';
import * as chai from 'chai';
import * as Jwt from 'jsonwebtoken';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';
import MatchesModel from '../database/models/MatchesModel';
import TeamsModel from '../database/models/TeamsModel';
import User from '../database/models/UserModel';

import matchesMock from './mocks/Matches';
import matchesFinishedMock from './mocks/MatchesOnlyFinished';
import matchesInProgress from './mocks/MatchesInProgress';
import { newMatchesDTO, newMatchesInProgressMock } from './mocks/CreateMatches';
import { userLoginSend, userMock } from './mocks/User';
import { teamsMock } from './mocks/Teams';

import { Response } from 'superagent';
import { IMatches } from '../interfaces/IMatches';

chai.use(chaiHttp);

const { expect } = chai;

describe('/GET matches', () => {
  describe('All matches', () => {
    beforeEach(async () => {
      sinon
        .stub(MatchesModel, 'findAll')
        .resolves(matchesMock as MatchesModel[]);
    });

    afterEach(() => {
      (MatchesModel.findAll as sinon.SinonStub).restore();
    });

    it('should return all matches', async () => {
      const response: Response = await chai.request(app).get('/matches').send();
      expect(response.status).to.equal(200);
      expect(response.body).to.be.a('array');
      expect(response.body[0]).to.have.keys(Object.keys(matchesMock[0]));
    });
  });
  describe('All matches only finished', () => {
    beforeEach(async () => {
      sinon
        .stub(MatchesModel, 'findAll')
        .resolves(matchesFinishedMock as MatchesModel[]);
    });

    afterEach(() => {
      (MatchesModel.findAll as sinon.SinonStub).restore();
    });

    it('should return all matches finished', async () => {
      const response: Response = await chai
        .request(app)
        .get('/matches?inProgress=false')
        .send();
      const matches = response.body as IMatches[];
      expect(response.status).to.equal(200);
      expect(response.body).to.be.a('array');
      expect(response.body[0]).to.have.keys(
        Object.keys(matchesFinishedMock[0]),
      );
      matches.forEach((value) => {
        expect(value.inProgress).to.eql(false);
      });
    });
  });
  describe('All matches inProgress', () => {
    beforeEach(async () => {
      sinon
        .stub(MatchesModel, 'findAll')
        .resolves(matchesInProgress as MatchesModel[]);
    });

    afterEach(() => {
      (MatchesModel.findAll as sinon.SinonStub).restore();
    });

    it('should return all matches inProgress', async () => {
      const response: Response = await chai
        .request(app)
        .get('/matches?inProgress=true')
        .send();
      const matches = response.body as IMatches[];
      expect(response.status).to.equal(200);
      expect(response.body).to.be.a('array');
      expect(response.body[0]).to.have.keys(Object.keys(matchesInProgress[0]));
      matches.forEach((value) => {
        expect(value.inProgress).to.eql(true);
      });
    });
  });
  describe('there is an internal problem', () => {
    beforeEach(async () => {
      sinon.stub(MatchesModel, 'findAll').rejects();
    });

    afterEach(() => {
      (MatchesModel.findAll as sinon.SinonStub).restore();
    });

    it('Should return "Internal Error!"', async () => {
      const response = await chai.request(app).get('/matches').send();
      expect(response.status).to.equal(500);
    });
  });
});

describe('/POST', () => {
  describe('Sucess create match', () => {
    beforeEach(async () => {
      sinon
        .stub(MatchesModel, 'create')
        .resolves(newMatchesInProgressMock as MatchesModel);
      sinon
        .stub(TeamsModel, 'findByPk')
        .onFirstCall()
        .resolves(teamsMock[0] as TeamsModel)
        .onSecondCall()
        .resolves(teamsMock[1] as TeamsModel);
      sinon.stub(User, 'findAll').resolves([userMock] as User[]);
      sinon.stub(Jwt, 'verify').returns();
    });

    afterEach(() => {
      (MatchesModel.create as sinon.SinonStub).restore();
      (TeamsModel.findByPk as sinon.SinonStub).restore();
      (User.findAll as sinon.SinonStub).restore();
      (Jwt.verify as sinon.SinonStub).restore();
    });

    it('should return new match', async () => {
      const login = await chai.request(app).post('/login').send(userLoginSend);
      const { token } = login.body;

      const response: Response = await chai
        .request(app)
        .post('/matches')
        .auth(token, { type: 'bearer' })
        .send(newMatchesDTO);
      expect(response.status).to.equal(201);
      expect(response.body).to.have.keys(Object.keys(newMatchesInProgressMock));
    });
  });

  describe('in case there is an internal problem when trying to create a match', () => {
    beforeEach(async () => {
      sinon.stub(MatchesModel, 'create').rejects();
      sinon.stub(TeamsModel, 'findByPk').rejects();
      sinon.stub(Jwt, 'verify').resolves();
    });

    afterEach(() => {
      (MatchesModel.create as sinon.SinonStub).restore();
      (TeamsModel.findByPk as sinon.SinonStub).restore();
      (Jwt.verify as sinon.SinonStub).restore();
    });

    it('Should return "Internal Error!"', async () => {
      const response = await chai
        .request(app)
        .post('/matches')
        .auth('fakeToken', { type: 'bearer' })
        .send(newMatchesDTO);
      expect(response.status).to.equal(500);
    });
  });

  describe("case don't pass a token", () => {
    beforeEach(async () => {
      sinon.stub(Jwt, 'verify').rejects();
    });

    afterEach(() => {
      (Jwt.verify as sinon.SinonStub).restore();
    });

    it('Should return "Token must be a valid token"', async () => {
      const response = await chai
        .request(app)
        .post('/matches')
        .send(newMatchesDTO);
      expect(response.status).to.equal(401);
      expect(response.body.message).to.equal('Token must be a valid token');
    });
  });

  describe('case pass a token invalid', () => {
    it('Should return "Token must be a valid token"', async () => {
      const response = await chai
        .request(app)
        .post('/matches')
        .auth('invalid', { type: 'bearer' })
        .send();
      expect(response.status).to.equal(401);
      expect(response.body.message).to.equal('Token must be a valid token');
    });
  });

  describe('if you try to create a match with the same teams', () => {
    beforeEach(async () => {
      sinon.stub(Jwt, 'verify').returns();
    });

    afterEach(() => {
      (Jwt.verify as sinon.SinonStub).restore();
    });

    it('should return message "It is not possible to create a match with two equal teams"', async () => {
      const response = await chai
        .request(app)
        .post('/matches')
        .auth('token', { type: 'bearer' })
        .send({ ...newMatchesDTO, awayTeam: 1 });

      expect(response.status).to.equal(401);
      expect(response.body).to.have.key('message');
      expect(response.body.message).to.be.equal(
        'It is not possible to create a match with two equal teams',
      );
    });
  });

  describe("if you try to create a match with a team that doesn't exist", () => {
    beforeEach(async () => {
      sinon.stub(Jwt, 'verify').returns();
      sinon.stub(TeamsModel, 'findByPk').resolves(undefined);
    });

    afterEach(() => {
      (Jwt.verify as sinon.SinonStub).restore();
      (TeamsModel.findByPk as sinon.SinonStub).restore();
    });

    it('should return message "There is no team with such id!"', async () => {
      const response = await chai
        .request(app)
        .post('/matches')
        .auth('token', { type: 'bearer' })
        .send({ ...newMatchesDTO, awayTeam: 99999 });

      expect(response.status).to.equal(404);
      expect(response.body).to.have.key('message');
      expect(response.body.message).to.be.equal(
        'There is no team with such id!',
      );
    });
  });
});

describe('/PATCH', () => {
  const awayTeamGoals = 1;
  const homeTeamGoals = 2;

  describe('update inProgress to false', () => {
    beforeEach(async () => {
      sinon.stub(MatchesModel, 'update').resolves();
    });

    afterEach(() => {
      (MatchesModel.update as sinon.SinonStub).restore();
    });

    it('Should return message "Finished"', async () => {
      const response = await chai
        .request(app)
        .patch('/matches/2/finish')
        .send();
      expect(response.status).to.equal(200);
      expect(response.body).to.be.have.key('message');
      expect(response.body.message).to.equal('Finished');
    });
  });

  describe('in case there is an internal problem updating a match in progress to false', () => {
    beforeEach(async () => {
      sinon.stub(MatchesModel, 'update').rejects();
    });

    afterEach(() => {
      (MatchesModel.update as sinon.SinonStub).restore();
    });

    it('Should return code 500', async () => {
      const response = await chai
        .request(app)
        .patch('/matches/2/finish')
        .send();
      expect(response.status).to.equal(500);
    });
  });

  describe('update goals', () => {
    beforeEach(async () => {
      sinon.stub(MatchesModel, 'update').resolves();
    });

    afterEach(() => {
      (MatchesModel.update as sinon.SinonStub).restore();
    });

    it('Should return message "Updated goals"', async () => {
      const response = await chai
        .request(app)
        .patch('/matches/2')
        .send({ awayTeamGoals, homeTeamGoals });
      expect(response.status).to.equal(200);
      expect(response.body).to.be.have.key('message');
      expect(response.body.message).to.equal('Updated goals');
    });
  });

  describe('in case there is an internal problem when updating match goals', () => {
    beforeEach(async () => {
      sinon.stub(MatchesModel, 'update').rejects();
    });

    afterEach(() => {
      (MatchesModel.update as sinon.SinonStub).restore();
    });

    it('Should return code 500', async () => {
      const response = await chai
        .request(app)
        .patch('/matches/2')
        .send({ awayTeamGoals, homeTeamGoals });
      expect(response.status).to.equal(500);
    });
  });
});
