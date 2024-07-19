import { CustomDataWrapper } from "../../../../../jerakine";
import { ChatAbstractServerMessage } from "./ChatAbstractServerMessage";

export class ChatServerMessage extends ChatAbstractServerMessage {
  static readonly protocolId: number = 6772;

  senderId: number;
  senderName: string;
  prefix: string;
  senderAccountId: number;

  constructor(
    channel: number = 0,
    content: string = "",
    timestamp: number = 0,
    fingerprint: string = "",
    senderId: number = 0,
    senderName: string = "",
    prefix: string = "",
    senderAccountId: number = 0
  ) {
    super(channel, content, timestamp, fingerprint);
    this.senderId = senderId;
    this.senderName = senderName;
    this.prefix = prefix;
    this.senderAccountId = senderAccountId;
  }

  deserialize(input: CustomDataWrapper): void {
    super.deserialize(input);

    this.senderAccountId = input.readDouble();
    if (this.senderId < -9007199254740992 || this.senderId > 9007199254740992) {
      throw new Error(
        "Forbidden value (" +
          this.senderId +
          ") on element of ChatServerMessage.senderId."
      );
    }

    this.senderName = input.readUTF();
    this.prefix = input.readUTF();

    this.senderAccountId = input.readInt();
    if (this.senderAccountId < 0) {
      throw new Error(
        "Forbidden value (" +
          this.senderAccountId +
          ") on element of ChatServerMessage.senderAccountId."
      );
    }
  }

  getMessageId(): number {
    return 6772;
  }
}
