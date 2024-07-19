import { IdentifiedMessage } from "../messages/IdentifiedMessage";
import { QueueableMessage } from "../messages/QueueableMessage";
import { ICustomDataInput } from "./ICustomDataInput";
import { ICustomDataOutput } from "./ICustomDataOutput";
import { FuncTree } from "./utils";

export interface INetworkMessage extends IdentifiedMessage, QueueableMessage {
  pack(param1: ICustomDataOutput): void;
  unpack(param1: ICustomDataInput, param2: number): void;
  unpackAsync(param1: ICustomDataInput, param2: number): FuncTree;
  get isInitialized(): boolean;
  get unpacked(): boolean;
  set unpacked(param1: boolean);
}
