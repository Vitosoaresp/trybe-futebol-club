import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';
import TeamsModel from '../database/models/TeamsModel';
import { teamMock, teamsMock } from './mocks/Teams';

import { Response } from 'superagent';

chai.use(chaiHttp);

const { expect } = chai;

describe('/GET teams', () => {
  describe('All teams', () => {
    beforeEach(async () => {
      sinon.stub(TeamsModel, 'findAll').resolves(teamsMock as TeamsModel[]);
    });

    afterEach(() => {
      (TeamsModel.findAll as sinon.SinonStub).restore();
    });

    it('should return all times', async () => {
      const response: Response = await chai.request(app).get('/teams').send();
      expect(response.status).to.equal(200);
      expect(response.body).to.be.a('array');
      expect(response.body[0]).to.have.keys('id', 'teamName');
      expect(response.body[0].id).to.eql(teamsMock[0].id);
      expect(response.body[0].teamName).to.eql(teamsMock[0].teamName);
    });
  });

  describe('there is an internal problem', () => {
    beforeEach(async () => {
      sinon.stub(TeamsModel, 'findAll').rejects();
    });

    afterEach(() => {
      (TeamsModel.findAll as sinon.SinonStub).restore();
    });

    it('Should return "Internal Error!"', async () => {
      const response = await chai.request(app).get('/teams').send();
      expect(response.status).to.equal(500);
    });
  });

  describe('Find team by PK', () => {
    beforeEach(async () => {
      sinon.stub(TeamsModel, 'findByPk').resolves(teamMock as TeamsModel);
    });

    afterEach(() => {
      (TeamsModel.findByPk as sinon.SinonStub).restore();
    });

    it('should return a specific team', async () => {
      const response: Response = await chai.request(app).get('/teams/1').send();
      expect(response.status).to.equal(200);
      expect(response.body).to.have.keys('id', 'teamName');
      expect(response.body.id).to.eql(teamMock.id);
      expect(response.body.teamName).to.eql(teamMock.teamName);
    });
  });
  describe('case the team id does not exist', () => {
    beforeEach(async () => {
      sinon.stub(TeamsModel, 'findByPk').resolves();
    });

    afterEach(() => {
      (TeamsModel.findByPk as sinon.SinonStub).restore();
    });

    it('should return array an empty array', async () => {
      const response: Response = await chai
        .request(app)
        .get('/teams/9999')
        .send();
      expect(response.status).to.equal(200);
      expect(response.body).to.be.a('array');
      expect(response.body).to.have.length(0);
    });
  });
  describe('there is an internal problem', () => {
    beforeEach(async () => {
      sinon.stub(TeamsModel, 'findByPk').rejects();
    });

    afterEach(() => {
      (TeamsModel.findByPk as sinon.SinonStub).restore();
    });

    it('Should return "Internal Error!"', async () => {
      const response = await chai.request(app).get('/teams/1').send();
      expect(response.status).to.equal(500);
    });
  });
});
