import { AbstractMethodCallError } from "../utils";
import { ICustomDataInput } from "./ICustomDataInput";
import { ICustomDataOutput } from "./ICustomDataOutput";
import { INetworkMessage } from "./INetworkMessage";
import { FuncTree } from "./utils";

export class NetworkMessage implements INetworkMessage {
  private static GLOBAL_INSTANCE_ID: number = 0;
  static readonly BIT_RIGHT_SHIFT_LEN_PACKET_ID: number = 2;
  static readonly BIT_MASK: number = 3;
  static HASH_FUNCTION: Function;

  private _instance_id;
  receptionTime: number = 0;
  sourceConnection: string = "";
  _unpacked: boolean = false;

  constructor() {
    this._instance_id = ++NetworkMessage.GLOBAL_INSTANCE_ID;
  }

  private static computeTypeLen(len: number): number {
    if (len > 65535) return 3;
    if (len > 255) return 2;
    if (len > 0) return 1;
    return 0;
  }

  private static subComputeStaticHeader(
    msgId: number,
    typeLen: number
  ): number {
    return (msgId << NetworkMessage.BIT_RIGHT_SHIFT_LEN_PACKET_ID) | typeLen;
  }

  get isInitialized(): boolean {
    throw new AbstractMethodCallError();
  }

  get unpacked(): boolean {
    return this._unpacked;
  }

  set unpacked(value: boolean) {
    this._unpacked = value;
  }

  writePacket(output: ICustomDataOutput, id: number, data: ByteArray): void {
    var high: uint = 0;
    var low: uint = 0;
    var typeLen: uint = computeTypeLen(data.length);
    output.writeShort(subComputeStaticHeader(id, typeLen));
    output.writeUnsignedInt(this._instance_id);
    switch (typeLen) {
      case 0:
        return;
      case 1:
        output.writeByte(data.length);
        break;
      case 2:
        output.writeShort(data.length);
        break;
      case 3:
        high = uint((data.length >> 16) & 255);
        low = uint(data.length & 65535);
        output.writeByte(high);
        output.writeShort(low);
    }
    output.writeBytes(data, 0, data.length);
  }

  getMessageId(): number {
    throw new AbstractMethodCallError();
  }

  reset(): void {
    throw new AbstractMethodCallError();
  }

  pack(output: ICustomDataOutput): void {
    throw new AbstractMethodCallError();
  }

  unpack(input: ICustomDataInput, length: number): void {
    throw new AbstractMethodCallError();
  }

  unpackAsync(input: ICustomDataInput, length: number): FuncTree {
    throw new AbstractMethodCallError();
  }

  readExternal(input: IDataInput): void {
    throw new AbstractMethodCallError();
  }

  writeExternal(output: IDataOutput): void {
    throw new AbstractMethodCallError();
  }
}
