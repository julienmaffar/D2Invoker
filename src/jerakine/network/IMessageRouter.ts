import { INetworkMessage } from "./INetworkMessage";

export interface IMessageRouter {
  getConnectionId(param1: INetworkMessage): string;
}
