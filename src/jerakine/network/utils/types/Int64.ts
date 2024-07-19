import { Binary64 } from "./Binary64";

export class Int64 extends Binary64 {
  constructor(low: number = 0, high: number = 0) {
    super(low, high);
  }

  static fromNumber(n: number): Int64 {
    return new Int64(n, Math.floor(n / 4294967296));
  }

  static parseInt64(str: string, radix: number = 0): Int64 {
    let digit: number = 0;
    const negative = str.search(/^\-/) === 0;
    let i = negative ? 1 : 0;

    if (radix === 0) {
      if (str.search(/^\-?0x/) === 0) {
        radix = 16;
        i += 2;
      } else radix = 10;
    }

    if (radix < 2 || radix > 36) {
      // TODO: add ArgumentError Class
      // throw new ArgumentError();
    }

    str = str.toLowerCase();
    let result = new Int64();
    for (result; i < str.length; ) {
      digit = str.charCodeAt(i);
      if (digit >= Binary64.CHAR_CODE_0 && digit <= Binary64.CHAR_CODE_9)
        digit -= Binary64.CHAR_CODE_0;
      else {
        if (!(digit >= Binary64.CHAR_CODE_A && digit <= Binary64.CHAR_CODE_Z)) {
          // TODO: add ArgumentError Class
          // throw new ArgumentError();
        }
        digit -= Binary64.CHAR_CODE_A;
        digit += 10;
      }

      if (digit >= radix) {
        // TODO: add ArgumentError Class
        // throw new ArgumentError();
      }
      result.mul(radix);
      result.add(digit);
      i++;
    }

    if (negative) {
      result.bitwiseNot();
      result.add(1);
    }
    return result;
  }

  static make(low: number, high: number): Int64 {
    return new Int64(low, high);
  }

  static shl(a: Int64, b: number): Int64 {
    b &= 63;
    if (b === 0) return a.copy();
    else if (b < 32)
      return Int64.make((a.high << b) | (a.low >>> (32 - b)), a.low << b);
    else return Int64.make(a.low << (b - 32), 0);
  }

  static shr(a: Int64, b: number): Int64 {
    b &= 63;
    if (b === 0) return a.copy();
    else if (b < 32)
      return Int64.make(a.high >> b, (a.high << (32 - b)) | (a.low >>> b));
    else return Int64.make(a.high >> 31, a.high >> (b - 32));
  }

  static ushr(a: Int64, b: number): Int64 {
    b &= 63;
    if (b === 0) return a.copy();
    else if (b < 32)
      return Int64.make(a.high >>> b, (a.high << (32 - b)) | (a.low >>> b));
    else return Int64.make(0, a.high >>> (b - 32));
  }

  static xor(a: Int64, b: Int64): Int64 {
    return Int64.make(a.high ^ b.high, a.low ^ b.low);
  }

  static and(a: Int64, b: Int64): Int64 {
    return Int64.make(a.high & b.high, a.low & b.low);
  }

  static flip(a: Int64): Int64 {
    const i = Int64.xor(a, Int64.fromNumber(-1));
    i.add(1);
    return i;
  }

  set high(value: number) {
    this.internalHigh = value;
  }

  get high(): number {
    return this.internalHigh;
  }

  toNumber(): number {
    return this.high * 4294967296 + this.low;
  }

  toString(radix: number = 10): string {
    let digit = 0;

    if (radix < 2 || radix > 36) {
      // TODO: add ArgumentError Class
      // throw new ArgumentError();
    }

    switch (this.high) {
      case 0:
        return this.low.toString(radix);

      case -1:
        if ((this.low & 2147483648) === 0)
          return ((this.low | 2147483648) - 2147483648).toString(radix);
        return this.low.toString(radix);

      default:
        if (this.low === 0 && this.high === 0) return "0";
        const digitChars = [];
        const copyOfThis = new Int64(this.low, this.high);
        if (this.high < 0) {
          copyOfThis.bitwiseNot();
          copyOfThis.add(1);
        }

        do {
          digit = copyOfThis.div(radix);
          if (digit < 10) digitChars.push(digit + Binary64.CHAR_CODE_0);
          else digitChars.push(digit - 10 + Binary64.CHAR_CODE_A);
        } while (copyOfThis.high !== 0);

        if (this.high < 0)
          return (
            "-" + copyOfThis.low.toString(radix) + digitChars.reverse().join("")
          );
        return copyOfThis.low.toString(radix) + digitChars.reverse().join("");
    }
  }

  copy(): Int64 {
    return Int64.make(this.low, this.high);
  }
}
