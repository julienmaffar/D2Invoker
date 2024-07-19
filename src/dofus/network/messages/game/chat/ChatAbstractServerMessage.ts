import { CustomDataWrapper } from "../../../../../jerakine";

export abstract class ChatAbstractServerMessage {
  static readonly protocolId: number = 1770;

  channel: number;
  content: string;
  timestamp: number;
  fingerprint: string;

  constructor(
    channel: number = 0,
    content: string = "",
    timestamp: number = 0,
    fingerprint: string = ""
  ) {
    this.channel = channel;
    this.content = content;
    this.timestamp = timestamp;
    this.fingerprint = fingerprint;
  }

  getMessageId(): number {
    return 1770;
  }

  deserialize(input: CustomDataWrapper): void {
    this.channel = input.readByte();

    if (this.channel < 0)
      throw new Error(
        "Forbidden value (" +
          this.channel +
          ") on element of ChatAbstractServerMessage.channel."
      );

    this.content = input.readUTF();

    this.timestamp = input.readInt();
    if (this.timestamp < 0) {
      throw new Error(
        "Forbidden value (" +
          this.timestamp +
          ") on element of ChatAbstractServerMessage.timestamp."
      );
    }

    this.fingerprint = input.readUTF();
  }
}
