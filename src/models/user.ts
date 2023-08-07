import {
	CreationOptional,
	DataTypes,
	InferAttributes,
	InferCreationAttributes,
	Model,
} from 'sequelize'
import DataBaseConnection from '../dataBase/sequelizeSingleton'
import { Role, initRole } from './role'

export class User extends Model<
  InferAttributes<User>,
  InferCreationAttributes<User>
> {
  declare id: CreationOptional<number>
  declare username: string
  declare password: string
}

export const initUser = async () => {
	const sequelize = await DataBaseConnection.getSequelizeInstance()

	User.init(
		{
			id: {
				type: DataTypes.INTEGER.UNSIGNED,
				autoIncrement: true,
				primaryKey: true
			},
			username: {
				type: new DataTypes.STRING(150),
				allowNull: false
			},
			password: {
				type: new DataTypes.STRING(250),
				allowNull: false
			},
		},
		{
			sequelize,
			tableName: 'user',
			timestamps: false
		}
	)

	await initRole()

  if (!Role.associations['users']) Role.belongsToMany(User, { through: 'user_role', foreignKey: 'idRole', sourceKey: 'id', as: 'users', timestamps: false })
  if (!User.associations['roles']) User.belongsToMany(Role, { through: 'user_role', foreignKey: 'idUser', sourceKey: 'id', as: 'roles', timestamps: false })
}
