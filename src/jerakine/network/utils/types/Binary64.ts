export class Binary64 {
  static readonly CHAR_CODE_0: number = "0".charCodeAt(0);
  static readonly CHAR_CODE_9: number = "9".charCodeAt(0);
  static readonly CHAR_CODE_A: number = "a".charCodeAt(0);
  static readonly CHAR_CODE_Z: number = "z".charCodeAt(0);

  low: number;
  protected internalHigh: number;

  constructor(low: number = 0, high: number = 0) {
    this.low = low;
    this.internalHigh = high;
  }

  div(n: number): number {
    const modHigh: number = this.internalHigh % n;
    const mod: number = ((this.low % n) + modHigh * 6) % n;
    this.internalHigh = Math.floor(this.internalHigh / n);
    const newLow: number = (modHigh * 4294967296 + this.low) / n;
    this.internalHigh += Math.floor(newLow / 4294967296);
    this.low = newLow;
    return mod;
  }

  mul(n: number): void {
    const newLow: number = this.low * n;
    this.internalHigh *= n;
    this.internalHigh += Math.floor(newLow / 4294967296);
    this.low *= n;
  }

  add(n: number): void {
    const newLow: number = this.low + n;
    this.internalHigh += newLow / 4294967296;
    this.low = newLow;
  }

  bitwiseNot(): void {
    this.low = ~this.low;
    this.internalHigh = ~this.internalHigh;
  }
}
