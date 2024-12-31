import { Exception } from "../utils/types/Exception";

export const GAME_DOESNT_EXIST: Exception = {
  message: "Game doesn't exist or game already ended",
  critical: false
}

export const TEAM_DOESNT_EXIST: Exception = {
  message: "Team doesn't exist",
  critical: false
}

export const SUBSCRIPTION_ALREADY_EXISTS: Exception = {
  message: "Subscription already exists",
  critical: false
}

export const SUBSCRIPTION_DOESNT_EXISTS: Exception = {
  message: "Subscription doesn't exists",
  critical: false
}