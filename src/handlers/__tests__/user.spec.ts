import bcrypt  from 'bcrypt'
import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'
import jwt from 'jsonwebtoken'
import sinon from 'sinon'
import { Authenticate, AuthenticatePayload, UserData } from '../user'
import * as UserModel from '../../models/user'
import { User } from '../../models/user'

chai.use(chaiAsPromised)
const expect = chai.expect

let USER = {
  id: 1,
  username: 'testAdmin',
  password: '',
  get: (fieldName: string) => {
    if (fieldName === 'roles') return [{
      description: 'admin',
      get: (fieldName: string) => {
        if (fieldName === 'permissions') return [{ description: 'write_event' }, { description: 'write_user' }]
      }
    }]
  }
} as User

describe('user handler - authenticate', () => {
  beforeEach(() => {
    sinon.stub(UserModel, 'initUser').callsFake(() => Promise.resolve())
  })

  afterEach(() => {
    sinon.restore()
  })

  it('Non-existent user', async () => {
    sinon.stub(User, 'findOne').callsFake(() => Promise.resolve(null))

    const loginInfo: AuthenticatePayload = { username: 'testAdmin', password: '98765' }

    expect(await Authenticate(loginInfo)).to.equal(null)
  })

  it('User or password incorrect', async () => {
    sinon.stub(User, 'findOne').callsFake(() => Promise.resolve(USER))

    const salt = await bcrypt.genSalt(10)
    const claveEncriptada = await bcrypt.hash('fakepassword', salt)
    USER.password = claveEncriptada

    const loginInfo: AuthenticatePayload = { username: 'testAdmin', password: 'wrongpassword' }

    await expect(Authenticate(loginInfo)).to.be.rejectedWith('User or password are incorrect')
  })

  it('Valid user, retrieve a valid token', async () => {
    sinon.stub(User, 'findOne').callsFake(() => Promise.resolve(USER))

    const salt = await bcrypt.genSalt(10)
    const claveEncriptada = await bcrypt.hash('fakepassword', salt)
    USER.password = claveEncriptada

    const loginInfo: AuthenticatePayload = { username: 'testAdmin', password: 'fakepassword' }

    const userData: UserData = {
      userId: 1,
      username: 'testAdmin',
      roles: ['admin'],
      scope: ['write_event', 'write_user'],
    }
    process.env.SECRET_TOKEN = 'secret_test'
    const testToken = jwt.sign(userData, process.env.SECRET_TOKEN, {
      expiresIn: '2 days',
    })

    expect(await Authenticate(loginInfo)).to.be.equal(testToken)
  })
})
