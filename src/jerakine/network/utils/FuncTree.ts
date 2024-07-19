import { ICustomDataInput } from "../ICustomDataInput";

export class FuncTree {
  private _func: Function | null;
  private _parent: FuncTree | null;
  private _children: FuncTree[] | null;
  private _input: ICustomDataInput | null;
  private _current: FuncTree | null;
  private _index: number = 0;

  constructor(parent: FuncTree | null = null, func: Function | null = null) {
    this._func = func;
    this._parent = parent;
    this._children = null;
    this._input = null;
    this._current = null;
  }

  get children(): FuncTree[] | null {
    return this._children;
  }

  setRoot(input: ICustomDataInput): void {
    this._input = input;
    this._current = this;
  }

  addChild(func: Function): FuncTree {
    const child = new FuncTree(this, func);
    if (!this._children) this._children = [];
    this._children.push(child);
    return child;
  }

  next(): boolean {
    if (
      this._current === null ||
      this._input === null ||
      this._current._func === null
    )
      return false;
    this._current._func(this._input);

    if (this.goDown()) return true;
    return this.goUp();
  }

  private goUp(): boolean {
    if (this._current === null) return false;

    while (true) {
      this._current = this._current!._parent;
      if (
        this._current &&
        this._current._index !== this._current._children?.length
      )
        break;
      if (this._current && this._current._parent === null) return false;
    }

    this._current = this._current._children![this._current._index++];
    return true;
  }

  goDown(): boolean {
    if (this._current === null) return false;
    if (this._current._children === null) return false;
    if (
      this._current &&
      this._current._index === this._current._children?.length
    )
      return false;

    this._current = this._current._children[this._current._index++];
    return true;
  }
}
