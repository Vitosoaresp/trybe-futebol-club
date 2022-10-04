import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';
import TeamsModel from '../database/models/TeamsModel';
import { away, leaderBoardAwayMock } from './mocks/leaderBoard/away';
import { home, leaderBoardHomeMock } from './mocks/leaderBoard/home';
import { leaderBoardMock } from './mocks/leaderBoard/leaderBoardHomeAndAway';

import { Response } from 'superagent';

chai.use(chaiHttp);

const { expect } = chai;

describe('/GET leaderboard/home', () => {
  describe('sucess', () => {
    beforeEach(async () => {
      sinon
        .stub(TeamsModel, 'findAll')
        .resolves(home as unknown as TeamsModel[]);
    });

    afterEach(() => {
      (TeamsModel.findAll as sinon.SinonStub).restore();
    });

    it('should return leaderboard in the home matches', async () => {
      const response = await chai.request(app).get('/leaderboard/home').send();
      expect(response.status).to.equal(200);
      expect(response.body).to.deep.equal(leaderBoardHomeMock);
    });
  });

  describe('in case there is an internal problem', () => {
    beforeEach(async () => {
      sinon.stub(TeamsModel, 'findAll').rejects();
    });

    afterEach(() => {
      (TeamsModel.findAll as sinon.SinonStub).restore();
    });

    it('Should return code 500', async () => {
      const response = await chai.request(app).get('/leaderboard/home').send();
      expect(response.status).to.equal(500);
    });
  });
});

describe('/GET leaderboard/away', () => {
  describe('sucess', () => {
    beforeEach(async () => {
      sinon
        .stub(TeamsModel, 'findAll')
        .resolves(away as unknown as TeamsModel[]);
    });

    afterEach(() => {
      (TeamsModel.findAll as sinon.SinonStub).restore();
    });

    it('should return leaderboard in the away matches', async () => {
      const response = await chai.request(app).get('/leaderboard/away').send();
      expect(response.status).to.equal(200);
      expect(response.body).to.deep.equal(leaderBoardAwayMock);
    });
  });

  describe('in case there is an internal problem', () => {
    beforeEach(async () => {
      sinon.stub(TeamsModel, 'findAll').rejects();
    });

    afterEach(() => {
      (TeamsModel.findAll as sinon.SinonStub).restore();
    });

    it('Should return code 500', async () => {
      const response = await chai.request(app).get('/leaderboard/away').send();
      expect(response.status).to.equal(500);
    });
  });
});

describe('/GET leaderboard/', () => {
  describe('sucess', () => {
    beforeEach(async () => {
      sinon
        .stub(TeamsModel, 'findAll')
        .onFirstCall()
        .resolves(home as unknown as TeamsModel[])
        .onSecondCall()
        .resolves(away as unknown as TeamsModel[]);
    });

    afterEach(() => {
      (TeamsModel.findAll as sinon.SinonStub).restore();
    });

    it('should return leaderboard', async () => {
      const response = await chai.request(app).get('/leaderboard').send();
      expect(response.status).to.equal(200);
      expect(response.body).to.deep.equal(leaderBoardMock);
    });
  });

  describe('in case there is an internal problem', () => {
    beforeEach(async () => {
      sinon.stub(TeamsModel, 'findAll').rejects();
    });

    afterEach(() => {
      (TeamsModel.findAll as sinon.SinonStub).restore();
    });

    it('Should return code 500', async () => {
      const response = await chai.request(app).get('/leaderboard').send();
      expect(response.status).to.equal(500);
    });
  });
});
