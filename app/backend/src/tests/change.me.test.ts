import * as sinon from 'sinon';
import * as chai from 'chai';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';
import User from '../database/models/User.model';
import { mockJwt, tokenM, mockOk} from './mocks/user.mocks';
import * as auth from '../authentication/jwtFunctions';

import { Response } from 'superagent';

chai.use(chaiHttp);

const { expect } = chai;

const data = {
  email: 'mock@mock.com',
  password: 'secret_admin',
}

describe('Rota post login', () => {
  let chaiHttpResponse: Response;
  afterEach(()=>{
      (User.findOne as sinon.SinonStub).restore();
      sinon.restore()
    })

  it('Sem Senha', async () => {
    sinon.stub(User, 'findOne').resolves(mockOk as User)

    chaiHttpResponse = await chai
      .request(app)
      .post('/login')
      .send({ email: data.email });

    expect(chaiHttpResponse.status).to.equal(400);
    expect(chaiHttpResponse.body.message).to.equal('All fields must be filled');
  });

  it('Sem email', async () => {
    sinon.stub(User, 'findOne').resolves(mockOk as User)

    chaiHttpResponse = await chai
      .request(app)
      .post('/login')
      .send({ password: data.password });

    expect(chaiHttpResponse.status).to.equal(400);
    expect(chaiHttpResponse.body.message).to.equal('All fields must be filled');
  });

  it('Senha errado', async () => {
    sinon.stub(User, 'findOne').resolves(mockOk as User);
    sinon.stub(bcrypt, 'compareSync').returns(false);

    chaiHttpResponse = await chai
      .request(app)
      .post('/login')
      .send({ ...data, password: 'errado'});

    expect(chaiHttpResponse.status).to.equal(401);
    expect(chaiHttpResponse.body.message).to.equal('Incorrect email or password');
  });

  it('email errado', async () => {
    sinon.stub(User, 'findOne').resolves();

    chaiHttpResponse = await chai
      .request(app)
      .post('/login')
      .send(data);

    expect(chaiHttpResponse.status).to.equal(401);
    expect(chaiHttpResponse.body.message).to.equal('Incorrect email or password');
  });

  it('Certo ', async () => {
    sinon.stub(User, 'findOne').resolves(mockOk as User);
    sinon.stub(bcrypt, 'compareSync').returns(true);
    sinon.stub(auth, 'createToken').returns(tokenM)

    chaiHttpResponse = await chai
      .request(app)
      .post('/login')
      .send(data);

    expect(chaiHttpResponse.status).to.equal(200);
    expect(chaiHttpResponse.body.token).to.equal(tokenM);
  });
});

describe('Rota get validate', () => {
  let chaiHttpResponse: Response;

  afterEach(()=>{
      (User.findOne as sinon.SinonStub).restore();
      sinon.restore()
    })

  it('Certo ', async () => {
    sinon.stub(User, 'findOne').resolves();
    sinon.stub(jwt, 'verify').returns(mockJwt as any);

    chaiHttpResponse = await chai
      .request(app)
      .get('/login/validate').set('Authorization', tokenM);

    expect(chaiHttpResponse.status).to.equal(200);
    expect(chaiHttpResponse.body.role).to.equal(mockJwt.data.role);
  });

  it('sem token', async () => {
    sinon.stub(User, 'findOne').resolves(mockOk as User);

    chaiHttpResponse = await chai
      .request(app)
      .get('/login/validate').set('Authorization', '');

    expect(chaiHttpResponse.status).to.equal(401);
    expect(chaiHttpResponse.body.message).to.equal('Token must be a valid token');
  });

  it('token errado', async () => {
    sinon.stub(User, 'findOne').resolves(mockOk as User);
    sinon.stub(auth, 'verifyToken').returns('mockJwt');

    chaiHttpResponse = await chai
      .request(app)
      .get('/login/validate').set('Authorization', 'errado');

    expect(chaiHttpResponse.status).to.equal(401);
    expect(chaiHttpResponse.body.message).to.equal('Token must be a valid token');
  });
});