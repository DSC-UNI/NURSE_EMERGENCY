
interface AndroidCustomNotification {
    image: string
  }
  
export interface AndroidConfiguration {
  priority: string,
  ttl: string,
  notification: AndroidCustomNotification
}
