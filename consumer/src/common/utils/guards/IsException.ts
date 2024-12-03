import { Exception } from "../types/Exception";

export const isException = (target: unknown): target is Exception => {
  // @ts-ignore
  return target && typeof (target as Exception)["message"] === 'string'
}