import type UserService from '../user-service'
import type ChatService from '../chat-service'

export default function logger (
  _target: UserService | ChatService,
  propertyKey: string,
  descriptor: PropertyDescriptor
): void {
  const originalMethod = descriptor.value
  descriptor.value = function (data: object) {
    console.log(`${propertyKey} send:`, data)
    return originalMethod.call(this, data)
  }
}
