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
  declare idUser: number
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
			idUser: {
				type: new DataTypes.NUMBER,
				allowNull: false
			},
			idEvent: {
				type: new DataTypes.NUMBER,
				allowNull: false
			},
			date: {
				type: new DataTypes.DATE,
				allowNull: false
			},
		},
		{
			sequelize,
			tableName: 'registrations',
			timestamps: false
		}
	)
}
