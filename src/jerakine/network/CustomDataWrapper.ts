import { ByteArray } from "bytearray-node-as3";
import { Int64, UInt64 } from "./utils/types";

export class CustomDataWrapper {
  private static readonly INT_SIZE: number = 32;
  private static readonly SHORT_SIZE: number = 16;
  private static readonly SHORT_MIN_VALUE: number = -32768;
  private static readonly SHORT_MAX_VALUE: number = 32767;
  private static readonly UNSIGNED_SHORT_MAX_VALUE: number = 65536;
  private static readonly CHUNCK_BIT_SIZE: number = 7;
  private static readonly MAX_ENCODING_LENGTH: number = Math.ceil(
    CustomDataWrapper.INT_SIZE / CustomDataWrapper.CHUNCK_BIT_SIZE
  );
  private static readonly MASK_10000000: number = 128;
  private static readonly MASK_01111111: number = 127;

  private _data: ByteArray;

  constructor(data: ByteArray) {
    this._data = data;
  }

  setPosition(offset: number) {
    this._data.setPosition(offset);
  }

  getPosition(): number {
    return this._data.getPosition();
  }

  readVarInt(): number {
    let b: number = 0;
    let value: number = 0;
    let offset: number = 0;
    let hasNext: boolean = false;
    while (offset < CustomDataWrapper.INT_SIZE) {
      b = this._data.readByte();
      hasNext =
        (b & CustomDataWrapper.MASK_10000000) ===
        CustomDataWrapper.MASK_10000000;
      if (offset > 0) {
        value += (b & CustomDataWrapper.MASK_01111111) << offset;
      } else {
        value += b & CustomDataWrapper.MASK_01111111;
      }
      offset += CustomDataWrapper.CHUNCK_BIT_SIZE;
      if (!(hasNext && this._data.getBytesAvailable() > 0)) {
        return value;
      }
    }
    throw new Error("Too much data");
  }

  readVarUhInt(): number {
    return this.readVarInt();
  }

  readVarShort(): number {
    let b = 0;
    let value = 0;
    let offset = 0;
    let hasNext = false;

    while (offset < CustomDataWrapper.SHORT_SIZE) {
      b = this._data.readByte() | 0;
      hasNext =
        (b & CustomDataWrapper.MASK_10000000) ===
        CustomDataWrapper.MASK_10000000;
      if (offset > 0) value += (b & CustomDataWrapper.MASK_01111111) << offset;
      else value += b & CustomDataWrapper.MASK_01111111;
      offset += CustomDataWrapper.CHUNCK_BIT_SIZE;

      if (!hasNext)
        if (value > CustomDataWrapper.SHORT_MAX_VALUE)
          value -= CustomDataWrapper.UNSIGNED_SHORT_MAX_VALUE;
      return value;
    }
    throw new Error("Too much data");
  }

  readVarUhShort(): number {
    return this.readVarShort();
  }

  readVarLong(): number {
    return this.readInt64(this._data).toNumber();
  }

  readVarUhLong(): number {
    return this.readUInt64(this._data).toNumber();
  }

  readBytes(bytes: ByteArray, offset: number = 0, length: number = 0): void {
    this._data.readBytes(bytes, offset, length);
  }

  readBoolean(): boolean {
    return this._data.readBoolean();
  }

  readByte(): number {
    return this._data.readByte();
  }

  readUnsignedByte(): number {
    return this._data.readUnsignedByte();
  }

  readShort(): number {
    return this._data.readShort();
  }

  readUnsignedShort(): number {
    return this._data.readUnsignedShort();
  }

  readInt(): number {
    return this._data.readInt();
  }

  readUnsignedInt(): number {
    return this._data.readUnsignedInt();
  }

  readFloat(): number {
    return this._data.readFloat();
  }

  readDouble(): number {
    return this._data.readDouble();
  }

  readMultiByte(length: number, charSet: string): string {
    return this._data.readMultiByte(length, charSet);
  }

  readUTF(): string {
    return this._data.readUTF();
  }

  readUTFBytes(length: number): string {
    return this._data.readUTFBytes(length);
  }

  getBytesAvailable(): number {
    return this._data.getBytesAvailable();
  }

  readObject(): any {
    return this._data.readObject();
  }

  getObjectEncoding(): number {
    return this._data.getObjectEncoding();
  }

  getEndian(): string {
    return this._data.getEndian();
  }

  private readInt64(input: ByteArray): Int64 {
    let b: number = 0;
    const result = new Int64();
    let i: number = 0;
    while (true) {
      b = input.readUnsignedByte();
      if (i === 28) {
        break;
      }
      if (b < 128) {
        result.low |= b << i;
        return result;
      }
      result.low |= (b & 127) << i;
      i += 7;
    }
    if (b >= 128) {
      b &= 127;
      result.low |= b << i;
      result.high = b >>> 4;
      i = 3;
      while (true) {
        b = input.readUnsignedByte();
        if (i < 32) {
          if (b < 128) {
            break;
          }
          result.high |= (b & 127) << i;
        }
        i += 7;
      }
      result.high |= b << i;
      return result;
    }
    result.low |= b << i;
    result.high = b >>> 4;
    return result;
  }

  private readUInt64(input: ByteArray): UInt64 {
    let b: number = 0;
    const result = new UInt64();
    let i: number = 0;
    while (true) {
      b = input.readUnsignedByte();
      if (i === 28) {
        break;
      }
      if (b < 128) {
        result.low |= b << i;
        return result;
      }
      result.low |= (b & 127) << i;
      i += 7;
    }
    if (b >= 128) {
      b &= 127;
      result.low |= b << i;
      result.high = b >>> 4;
      i = 3;
      while (true) {
        b = input.readUnsignedByte();
        if (i < 32) {
          if (b < 128) {
            break;
          }
          result.high |= (b & 127) << i;
        }
        i += 7;
      }
      result.high |= b << i;
      return result;
    }
    result.low |= b << i;
    result.high = b >>> 4;
    return result;
  }
}
