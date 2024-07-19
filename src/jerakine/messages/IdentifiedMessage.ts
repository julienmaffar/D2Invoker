import { Message } from "./Message";

export interface IdentifiedMessage extends Message {
  getMessageId(): number;
}
