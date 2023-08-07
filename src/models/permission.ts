import {
	CreationOptional,
	DataTypes,
	InferAttributes,
	InferCreationAttributes,
	Model,
} from 'sequelize'
import DataBaseConnection from '../dataBase/sequelizeSingleton'

export class Permission extends Model<
  InferAttributes<Permission>,
  InferCreationAttributes<Permission>
> {
  
  declare id: CreationOptional<number>
  declare description: string
}

export const initPermission = async () => {
	const sequelize = await DataBaseConnection.getSequelizeInstance()

	Permission.init(
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
			tableName: 'permission',
			timestamps: false
		}
	)
}
