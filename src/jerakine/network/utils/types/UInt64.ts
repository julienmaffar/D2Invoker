import { Binary64 } from "./Binary64";

export class UInt64 extends Binary64 {
  constructor(low: number = 0, high: number = 0) {
    super(low, high);
  }

  public static fromNumber(n: number): UInt64 {
    return new UInt64(n, Math.floor(n / 4294967296));
  }

  public static parseUInt64(str: string, radix: number = 0): UInt64 {
    let digit: number = 0;
    let i: number = 0;

    if (radix === 0) {
      if (str.startsWith("0x")) {
        radix = 16;
        i = 2;
      } else {
        radix = 10;
      }
    }

    if (radix < 2 || radix > 36) {
      throw new Error("Invalid radix");
    }

    str = str.toLowerCase();
    let result: UInt64 = new UInt64();

    for (; i < str.length; i++) {
      digit = str.charCodeAt(i);

      if (digit >= Binary64.CHAR_CODE_0 && digit <= Binary64.CHAR_CODE_9) {
        digit -= Binary64.CHAR_CODE_0;
      } else if (
        digit >= Binary64.CHAR_CODE_A &&
        digit <= Binary64.CHAR_CODE_Z
      ) {
        digit -= Binary64.CHAR_CODE_A;
        digit += 10;
      } else {
        throw new Error("Invalid character in string");
      }

      if (digit >= radix) {
        throw new Error("Invalid character for radix");
      }

      result.mul(radix);
      result.add(digit);
    }

    return result;
  }

  set high(value: number) {
    this.internalHigh = value;
  }

  get high(): number {
    return this.internalHigh;
  }

  public toNumber(): number {
    return this.high * 4294967296 + (this.low >>> 0);
  }

  public toString(radix: number = 10): string {
    if (radix < 2 || radix > 36) {
      throw new Error("Invalid radix");
    }

    if (this.high === 0) {
      return this.low.toString(radix);
    }

    let digitChars: string[] = [];
    let copyOfThis: UInt64 = new UInt64(this.low, this.high);

    do {
      const digit: number = copyOfThis.div(radix);
      if (digit < 10) {
        digitChars.push(String.fromCharCode(digit + Binary64.CHAR_CODE_0));
      } else {
        digitChars.push(String.fromCharCode(digit - 10 + Binary64.CHAR_CODE_A));
      }
    } while (copyOfThis.high !== 0);

    return copyOfThis.low.toString(radix) + digitChars.reverse().join("");
  }
}
