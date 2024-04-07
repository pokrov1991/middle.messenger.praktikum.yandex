import type UserService from '../user-service'
import { type LoginFormModel } from '../../types/user'

export default function logger (
  _target: UserService,
  propertyKey: string,
  descriptor: PropertyDescriptor
): void {
  const originalMethod = descriptor.value
  descriptor.value = function (data: LoginFormModel) {
    console.log(`${propertyKey} send:`, data)
    return originalMethod.call(this, data)
  }
}
