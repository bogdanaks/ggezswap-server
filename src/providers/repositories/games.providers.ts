import { Games } from 'models/steam/entities/game.entity'

import { Repositories } from 'config/repositories'

export const gamesProviders = [
  {
    provide: Repositories.GAMES_REPOSITORY,
    useValue: Games,
  },
]
