import { SERVICE_UNAVAILABLE } from "../exceptions/CommonExceptions"
import { logger } from "../utils/etc/PinoLogger"
import { Exception } from "../utils/types/Exception"

export const withExceptionCatch = (_target: any, _key: string, descriptor: PropertyDescriptor) => {
  const originalMethod = descriptor.value
  
  descriptor.value = async function (...args: any[]) {
    try {
      return await originalMethod.apply(this, args)
    } catch (error) {
      if ((error as Exception).critical) logger.error(error)
      return SERVICE_UNAVAILABLE
    }
  }
  
  return descriptor
}