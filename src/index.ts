import { ByteArray } from "bytearray-node-as3";
import { CustomDataWrapper } from "./jerakine";
import { ChatServerMessage } from "./dofus";

/**
 * In this example, we test deserialize part of `ChatServerMessage` from hexadecimal packet.
 *
 * For example, we received a packet from Wireshark and, after analyse header,
 * the content of packet is "000006796f6f6f6f6f6684100d0008326778726f6230674264fecb0024600000064a756c6d697800000aa6bb46"
 *
 * With the decoding header, we know the messageId is 6772 and this id is associated to `ChatServerMessage`.
 *
 * Let's go for deserialize.
 */

const message = new CustomDataWrapper(
  new ByteArray(
    Buffer.from(
      "000006796f6f6f6f6f6684100d0008326778726f6230674264fecb0024600000064a756c6d697800000aa6bb46",
      "hex"
    )
  )
);
const packet = new ChatServerMessage();

packet.deserialize(message);
console.log(packet);
