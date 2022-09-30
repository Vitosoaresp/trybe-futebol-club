import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';
import MatchesModel from '../database/models/MatchesModel';
import TeamsModel from '../database/models/TeamsModel';

import matchesMock from './mocks/Matches';
import matchesFinishedMock from './mocks/MatchesOnlyFinished';
import matchesInProgress from './mocks/MatchesInProgress';
import { newMatchesDTO, newMatchesInProgressMock } from './mocks/CreateMatches';

import { Response } from 'superagent';
import { IMatches } from '../interfaces/IMatches';
import { teamsMock } from './mocks/Teams';

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
    });

    afterEach(() => {
      (MatchesModel.create as sinon.SinonStub).restore();
      (TeamsModel.findByPk as sinon.SinonStub).restore();
    });

    it('should return new match', async () => {
      const response: Response = await chai
        .request(app)
        .post('/matches')
        .send(newMatchesDTO);
      expect(response.status).to.equal(201);
      expect(response.body).to.have.keys(Object.keys(newMatchesInProgressMock));
    });
  });
});
