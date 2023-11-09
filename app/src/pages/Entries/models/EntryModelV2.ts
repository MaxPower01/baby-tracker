export class EntryModelV2 {
  private _id: string;
  public get id(): string {
    return this._id;
  }
  public set id(v: string) {
    this._id = v;
  }

  private _startDate: Date;
  public get startDate(): Date {
    return this._startDate;
  }
  public set startDate(v: Date) {
    this._startDate = v;
  }

  private _startTimestamp: number;
  public get startTimestamp(): number {
    return this._startTimestamp;
  }
  public set startTimestamp(v: number) {
    this._startTimestamp = v;
  }

  private _endDate: Date;
  public get endDate(): Date {
    return this._endDate;
  }
  public set endDate(v: Date) {
    this._endDate = v;
  }

  private _endTimestamp: number;
  public get endTimestamp(): number {
    return this._endTimestamp;
  }
  public set endTimestamp(v: number) {
    this._endTimestamp = v;
  }

  private _totalDuration: number | null;
  public get totalDuration(): number | null {
    return this._totalDuration;
  }
  public set totalDuration(v: number | null) {
    this._totalDuration = v;
  }
}
