export interface ICustomDataInput {
  readVarInt(): number;
  readVarUhInt(): number;
  readVarShort(): number;
  readVarUhShort(): number;
  readVarLong(): number;
  readVarUhLong(): number;
}
