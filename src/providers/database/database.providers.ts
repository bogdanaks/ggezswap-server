import { Sequelize } from 'sequelize-typescript'
import { Games } from 'models/steam/entities/game.entity'

import databaseConfig from 'config/database'

export const databaseProviders = [
  {
    provide: 'SEQUELIZE',
    useFactory: async () => {
      const sequelize = new Sequelize(databaseConfig)
      sequelize.addModels([Games])
      return sequelize
    }
  }
]
