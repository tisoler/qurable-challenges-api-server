import {
	CreationOptional,
	DataTypes,
	InferAttributes,
	InferCreationAttributes,
	Model,
} from 'sequelize'
import DataBaseConnection from '../dataBase/sequelizeSingleton'
import { Permission, initPermission } from './permission'

export class Role extends Model<
  InferAttributes<Role>,
  InferCreationAttributes<Role>
> {
  
  declare id: CreationOptional<number>
  declare description: string
}

export const initRole = async () => {
	const sequelize = await DataBaseConnection.getSequelizeInstance()

	Role.init(
		{
			id: {
				type: DataTypes.INTEGER.UNSIGNED,
				autoIncrement: true,
				primaryKey: true
			},
			description: {
				type: new DataTypes.STRING,
				allowNull: false
			},
		},
		{
			sequelize,
			tableName: 'role',
			timestamps: false
		}
	)

  await initPermission()

  if (!Permission.associations['roles']) Permission.belongsToMany(Role, { through: 'role_permission', sourceKey: 'id', foreignKey: 'idPermission', as: 'roles', timestamps: false })
  if (!Role.associations['permissions']) Role.belongsToMany(Permission, { through: 'role_permission', sourceKey: 'id', foreignKey: 'idRole', as: 'permissions', timestamps: false })
}
