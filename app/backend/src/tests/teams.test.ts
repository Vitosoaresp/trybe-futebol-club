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
      const response: Response = await chai.request(app).post('/login');
      expect(response.status).to.equal(200);
      expect(response.body).to.have.equals(teamsMock);
    });
  });
});
