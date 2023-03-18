import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';
import Match from '../database/models/Match.model';
import Team from '../database/models/Team.model';

import { Response } from 'superagent';
import { tMock } from './mocks/teams.mock';
import matchFull from './mocks/matchFull.mock';
import lbHome from './mocks/lbHome.mock';
import lbOut from './mocks/lbOut.mock';
import lb from './mocks/lb.mock';
import LeaderboardService from '../services/Leaderboard.service';
import lbFull from './mocks/lbFull.mock';

chai.use(chaiHttp);

const { expect } = chai;

describe('rota get lb', () => {
  let chaiHttpResponse: Response;

  afterEach(()=>{
      sinon.restore()
    })

  it('succeed', async () => {
    sinon.stub(Team, 'findAll').resolves(tMock as Team[]);
    sinon.stub(Match, 'findAll').resolves(matchFull as unknown as Match[]);

    chaiHttpResponse = await chai
      .request(app)
      .get('/leaderboard');

    expect(chaiHttpResponse.status).to.equal(200);
    expect(chaiHttpResponse.body).to.deep.equal(lb);
  })
})

describe('get lb home', () => {
  let chaiHttpResponse: Response;

  afterEach(()=>{
      sinon.restore()
    })

  it('succeed', async () => {    
    sinon.stub(Team, 'findAll').resolves(tMock as Team[]);
    sinon.stub(Match, 'findAll').resolves(matchFull as unknown as Match[]);

    chaiHttpResponse = await chai
      .request(app)
      .get('/leaderboard/home');

    expect(chaiHttpResponse.status).to.equal(200);
    expect(chaiHttpResponse.body).to.deep.equal(lbHome);
  })
})

describe('get lb away', () => {
  let chaiHttpResponse: Response;

  afterEach(()=>{
      sinon.restore()
    })

  it('Success', async () => {    
    sinon.stub(Team, 'findAll').resolves(tMock as Team[]);
    sinon.stub(Match, 'findAll').resolves(matchFull as unknown as Match[]);

    chaiHttpResponse = await chai
      .request(app)
      .get('/leaderboard/away');

    expect(chaiHttpResponse.status).to.equal(200);
    expect(chaiHttpResponse.body).to.deep.equal(lbOut);
  })
})

describe('sort', () => {
  let chaiHttpResponse: Response;

  afterEach(()=>{
      sinon.restore()
    })

  it('check', async () => {
    const seted = lbFull.sort((a, b) => +a.efficiency - +b.efficiency)
    sinon.stub(LeaderboardService, 'getAll').resolves(seted);

    chaiHttpResponse = await chai
      .request(app)
      .get('/leaderboard');

    expect(chaiHttpResponse.status).to.equal(200);
    expect(chaiHttpResponse.body).to.deep.equal(lbFull);
  })

})