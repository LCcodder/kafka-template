import { Exception } from "../types/Exception";

export const isException = (target: unknown): target is Exception => {
  return Boolean(target) && typeof (target as Exception)["message"] === 'string'
}