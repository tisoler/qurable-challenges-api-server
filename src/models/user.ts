import {
	CreationOptional,
	DataTypes,
	InferAttributes,
	InferCreationAttributes,
	Model,
} from 'sequelize'
import DataBaseConnection from '../dataBase/sequelizeSingleton'

export class User extends Model<
  InferAttributes<User>,
  InferCreationAttributes<User>
> {
  
  declare id: CreationOptional<number>
  declare userName: string
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
			userName: {
				type: new DataTypes.NUMBER,
				allowNull: false
			},
			password: {
				type: new DataTypes.NUMBER,
				allowNull: false
			},
		},
		{
			sequelize,
			tableName: 'users',
			timestamps: false
		}
	)
}
