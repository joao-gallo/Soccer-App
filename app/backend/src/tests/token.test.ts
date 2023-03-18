import * as sinon from 'sinon';
import * as chai from 'chai';
import * as jwt from 'jsonwebtoken';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';

import { Response } from 'superagent';
import { createToken, verifyToken } from '../authentication/jwtFunctions';
import { payload } from './mocks/security.mock'
import { mockJwt, tokenM } from './mocks/user.mocks';

chai.use(chaiHttp);

const { expect } = chai;

describe('jwt', () => {
  let chaiHttpResponse: Response;

  afterEach(()=>{
      sinon.restore()
    })

  it('createToken', async () => {
    sinon.stub(jwt, 'sign').resolves(tokenM);

    const createdToken = await createToken({ id: 1,
      username: 'mock',
      role:'mock',
      email: 'mock@mock.com'})
    expect(createdToken).to.equal(tokenM);
  })

  it('succeed', async () => {
    sinon.stub(jwt, 'verify').resolves(mockJwt);

    const verified = await verifyToken(tokenM)
    expect(verified).to.equal(mockJwt);
  });

  it('fail', async () => {
    const error = 'error'
    sinon.stub(jwt, 'verify').throws(new Error(error));

    const verified = await verifyToken('tokenM')
    expect(verified).to.deep.equal({ isError: true });
  });
});