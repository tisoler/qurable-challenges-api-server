import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'
import jwt from 'jsonwebtoken'
import { Response } from 'express'
import verifyToken, { RequestWithUser } from '../tokenChecker'
import sinon from 'sinon'
import { UserData } from '../../handlers/user'

chai.use(chaiAsPromised)
const expect = chai.expect

const RESPONSE = {
  status: () => ({
    json: (errorObject: Record<string, any>) => (errorObject)
  })
} as unknown as Response

describe('tokenChecker - verifyToken', () => {
  it('request without token in header', async () => {
    const request = {
      header: () => '',
    } as unknown as RequestWithUser

    const next = () => {}

    expect(verifyToken(request, RESPONSE, next)).to.deep.equal({ error: 'Access denied' })
  })

  it('invalid token', async () => {
    const request = {
      header: (name: string) => {
        if (name === 'auth-token') return 'notValidToken'
      },
    } as unknown as RequestWithUser

    const next = () => {}

    expect(verifyToken(request, RESPONSE, next)).to.deep.equal({error: 'token is not valid'})
  })

  it('valid token', async () => {
    const userData: UserData = {
      userId: 1,
      username: 'user test',
      roles: ['user'],
      scope: ['write_event'],
    }

    process.env.SECRET_TOKEN = 'secret_test'
    const token = jwt.sign(userData, process.env.SECRET_TOKEN, {
      expiresIn: '2 days',
    })

    const request = {
      header: (name: string) => {
        if (name === 'auth-token') return token
      },
    } as unknown as RequestWithUser

    const next = () => {}

    verifyToken(request, RESPONSE, next)

    expect(request.user?.userId).to.equal(userData.userId)
    expect(request.user?.username).to.equal(userData.username)
    expect(request.user?.roles).to.deep.equal(userData.roles)
    expect(request.user?.scope).to.deep.equal(userData.scope)
  })
})
