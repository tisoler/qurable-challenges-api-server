import {
	CreationOptional,
	DataTypes,
	InferAttributes,
	InferCreationAttributes,
	Model,
} from 'sequelize'
import DataBaseConnection from '../dataBase/sequelizeSingleton'

export class Registration extends Model<
  InferAttributes<Registration>,
  InferCreationAttributes<Registration>
> {
  
  declare id: CreationOptional<number>
  declare fullname: string
  declare idEvent: number
  declare date: Date
}

export const initRegistration = async () => {
	const sequelize = await DataBaseConnection.getSequelizeInstance()

	Registration.init(
		{
			id: {
				type: DataTypes.INTEGER.UNSIGNED,
				autoIncrement: true,
				primaryKey: true
			},
			fullname: {
				type: new DataTypes.STRING,
				allowNull: false
			},
			idEvent: {
				type: DataTypes.INTEGER.UNSIGNED,
				allowNull: false
			},
			date: {
				type: new DataTypes.DATE,
				allowNull: true
			},
		},
		{
			sequelize,
			tableName: 'registration',
			timestamps: false
		}
	)
}
