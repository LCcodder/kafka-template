import { Exception } from "../utils/types/Exception";

export const USER_NOT_FOUND: Exception = {
  message: "User not found",
  critical: false
} as const

export const USER_ALREADY_REGISTERED: Exception = {
  message: "User already registered",
  critical: false
}