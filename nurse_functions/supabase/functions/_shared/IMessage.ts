import { AndroidConfiguration } from "./IAndroid.ts";
import { Notification } from "./INotification.ts";

export interface Message {
  topic?: string | string[],
  token?: string,
  notification: Notification,
  data?: object,
  android: AndroidConfiguration
}
  