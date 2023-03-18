import * as sinon from 'sinon';
import * as chai from 'chai';
import * as jwt from 'jsonwebtoken';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';
import Match from '../database/models/Match.model';

import { Response } from 'superagent';
import { mCreate, mMock, mCreated, mEqual } from './mocks/match.mock';
import { payload } from './mocks/security.mock'
import { tokenM } from './mocks/user.mocks';
import { tMock } from './mocks/teams.mock';
import Team from '../database/models/Team.model';

chai.use(chaiHttp);

const { expect } = chai;

describe('get matches', () => {
  let chaiHttpResponse: Response;

  afterEach(()=>{
      sinon.restore()
    })

  it('succeed', async () => {
    sinon.stub(Match, 'findAll').resolves(mMock as unknown as Match[]);

    chaiHttpResponse = await chai
      .request(app)
      .get('/matches');

    expect(chaiHttpResponse.status).to.equal(200);
    expect(chaiHttpResponse.body).to.deep.equal(mMock);
  })
});

describe(' match in progress', () => {
  let chaiHttpResponse: Response;

  afterEach(()=>{
      sinon.restore()
    })

  it('in progresss error', async () => {
    const negative = mMock.filter((m) => m.inProgress === false);
    sinon.stub(Match, 'findAll').resolves(negative as unknown as Match[]);

    chaiHttpResponse = await chai
      .request(app)
      .get('/matches?inProgress=false');

    expect(chaiHttpResponse.status).to.equal(200);
    expect(chaiHttpResponse.body).to.deep.equal(negative);
  })

  it('inprogress ok', async () => {
    const ok = mMock.filter((m) => m.inProgress === true);
    sinon.stub(Match, 'findAll').resolves(ok as unknown as Match[]);

    chaiHttpResponse = await chai
      .request(app)
      .get('/matches?inProgress=false');

    expect(chaiHttpResponse.status).to.equal(200);
    expect(chaiHttpResponse.body).to.deep.equal(ok);
  })
});

describe('id', () => {
  let chaiHttpResponse: Response;

  afterEach(()=>{
      sinon.restore()
    })

  it('succeed', async () => {
    sinon.stub(Match, 'update').resolves([1]);

    chaiHttpResponse = await chai
      .request(app)
      .patch('/matches/1/finish');

      expect(chaiHttpResponse.status).to.equal(200);
      expect(chaiHttpResponse.body.message).to.equal('Finished');


  })

  it('fail', async () => {
    sinon.stub(Match, 'update').resolves([0]);

    chaiHttpResponse = await chai
      .request(app)
      .patch('/matches/555/finish');

    expect(chaiHttpResponse.status).to.equal(400);
    expect(chaiHttpResponse.body.message).to.equal('Match does not exist');
  })
});

describe('matches', () => {
  let chaiHttpResponse: Response;

  afterEach(()=>{
      sinon.restore()
    })

  it('token out', async () => {
    sinon.stub(jwt, 'verify').resolves(payload);

    chaiHttpResponse = await chai
      .request(app)
      .post('/matches').send(mEqual);

    expect(chaiHttpResponse.status).to.equal(401);
    expect(chaiHttpResponse.body.message).to.equal('Token must be a valid token');
  })

  it('token invalid', async () => {
    sinon.stub(jwt, 'verify').throws(new Error('error'));

    chaiHttpResponse = await chai
      .request(app)
      .post('/matches').send(mEqual).set('Authorization', 'tokenM');

    expect(chaiHttpResponse.status).to.equal(401);
    expect(chaiHttpResponse.body.message).to.equal('Token must be a valid token');
  })

  it('equals', async () => {
    sinon.stub(jwt, 'verify').resolves(payload);

    chaiHttpResponse = await chai
      .request(app)
      .post('/matches').send(mEqual).set('Authorization', tokenM);

    expect(chaiHttpResponse.status).to.equal(422);
    expect(chaiHttpResponse.body.message).to.equal('It is not possible to create a match with two equal teams');
  })

  it('home team error', async () => {
    sinon.stub(Match, 'findByPk')
      .onFirstCall().resolves()
      .onSecondCall().resolves(tMock[1] as Team);
    sinon.stub(jwt, 'verify').resolves(payload);

    chaiHttpResponse = await chai
      .request(app)
      .post('/matches').send(mCreate).set('Authorization', tokenM);

    expect(chaiHttpResponse.status).to.equal(404);
    expect(chaiHttpResponse.body.message).to.equal('There is no team with such id!');
  })

  it('away team error', async () => {
    sinon.stub(Match, 'findByPk')
      .onFirstCall().resolves(tMock[0] as Team)
      .onSecondCall().resolves();
    sinon.stub(jwt, 'verify').resolves(payload);

    chaiHttpResponse = await chai
      .request(app)
      .post('/matches').send(mCreate).set('Authorization', tokenM);

    expect(chaiHttpResponse.status).to.equal(404);
    expect(chaiHttpResponse.body.message).to.equal('There is no team with such id!');
  })

  it('succeed', async () => {
    sinon.stub(Match, 'findByPk')
      .onFirstCall().resolves(tMock[0] as Team)
      .onSecondCall().resolves(tMock[1] as Team);
    sinon.stub(jwt, 'verify').resolves(payload);
    sinon.stub(Match, 'create').resolves(mCreated as Match);

    chaiHttpResponse = await chai
      .request(app)
      .post('/matches').send(mCreate).set('Authorization', tokenM);

    expect(chaiHttpResponse.status).to.equal(201);
    expect(chaiHttpResponse.body).to.deep.equal(mCreated);
  })
});

describe('matches id', () => {
  let chaiHttpResponse: Response;

  afterEach(()=>{
    sinon.restore()
  });

  it('fail', async () => {
    sinon.stub(jwt, 'verify').resolves(payload);
    sinon.stub(Match, 'update').resolves([0]);

    chaiHttpResponse = await chai
      .request(app)
      .patch('/matches/555').send({
        homeTeamGoals: 3,
        awayTeamGoals: 1
      }).set('Authorization', tokenM);

    expect(chaiHttpResponse.status).to.equal(400);
    expect(chaiHttpResponse.body.message).to.equal('Match does not exist');
  });

  it('succeed', async () => {
    sinon.stub(jwt, 'verify').resolves(payload);
    sinon.stub(Match, 'update').resolves([1]);

    chaiHttpResponse = await chai
      .request(app)
      .patch('/matches/555').send({
        homeTeamGoals: 3,
        awayTeamGoals: 1
      }).set('Authorization', tokenM);

    expect(chaiHttpResponse.status).to.equal(200);
    expect(chaiHttpResponse.body).to.deep.equal({
      homeTeamGoals: 3,
      awayTeamGoals: 1,
      decoded: {},
    });
  });
});