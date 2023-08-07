import bcrypt  from 'bcrypt'
import jwt from 'jsonwebtoken'
import { User, initUser } from "../models/user"
import { Role } from '../models/role'
import { Permission } from '../models/permission'

export interface UserData {
  userId: number,
  username: string,
  roles: string[],
  scope: string[],
}

export interface AuthenticatePayload {
  username: string,
  password: string
}

export const Authenticate = async (payload: AuthenticatePayload): Promise<string | null> => {
	await initUser()

	const user = await User.findOne({
    attributes: [
      'id',
      'username',
      'password',
    ],
    include: [
      {
        model: Role,
        attributes: ['id', 'description'],
        as: 'roles',
        include: [
          {
            model: Permission,
            attributes: ['id', 'description'],
            as: 'permissions',
          },
        ],
      },
    ],
    where: { username: payload.username },
  })

  if (!user) {
    console.log(`User not found, username: ${payload.username}.`)
    return null
  }

  const esAutenticacionValida = await bcrypt.compare(payload.password, user.password)
  if (!esAutenticacionValida) {
    throw new Error('User or password are incorrect')
  }

  const roles = user.get('roles') as Role[] || []
  const permissions = roles?.map(r => r.get('permissions'))?.flat() as Permission[] || []
  const rolesPermissions = { roles: roles.map(r => r.description), scope: permissions.map(p => p.description) }

  const tokenData: UserData = {
    userId: user.id,
    username: user.username,
    ...rolesPermissions,
  }

  const token = jwt.sign(tokenData, process.env.SECRET_TOKEN || '', {
    expiresIn: '2 days',
  })

  return token
}
