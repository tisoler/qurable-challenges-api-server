import {
	CreationOptional,
	DataTypes,
	InferAttributes,
	InferCreationAttributes,
	Model,
} from 'sequelize'
import DataBaseConnection from '../dataBase/sequelizeSingleton'
import { Registration, initRegistration } from './registration'

export class Event extends Model<
  InferAttributes<Event>,
  InferCreationAttributes<Event>
> {
  declare id: CreationOptional<number>
  declare name: string
  declare description: string
	declare dateTime: Date
}

export const initEvent = async () => {
	const sequelize = await DataBaseConnection.getSequelizeInstance()

	Event.init(
		{
			id: {
				type: DataTypes.INTEGER.UNSIGNED,
				autoIncrement: true,
				primaryKey: true
			},
			name: {
				type: new DataTypes.STRING(150),
				allowNull: false
			},
			description: {
				type: new DataTypes.STRING(150),
				allowNull: false
			},
			dateTime: {
				type: DataTypes.DATE,
				allowNull: false
			}
		},
		{
			sequelize,
			tableName: 'events',
			timestamps: false
		}
	)

	await initRegistration()

	Event.hasMany(Registration, {
		sourceKey: 'id', foreignKey: 'idEvent', as: 'registrations',
	})
}
