import { ActivityModel } from "@/modules/activities/models/ActivityModel";
import dayjs, { Dayjs } from "dayjs";
import { v4 as uuidv4 } from "uuid";

export class EntryModel {
  private _id = uuidv4();
  public get id(): string {
    return this._id;
  }
  public set id(v: string) {
    this._id = v;
  }

  private _activity: ActivityModel | undefined;
  public get activity(): ActivityModel | undefined {
    return this._activity;
  }
  public set activity(v: ActivityModel | undefined) {
    this._activity = v;
  }

  private _subActivities: ActivityModel[] = [];
  public get subActivities(): ActivityModel[] {
    return this._subActivities;
  }
  public set subActivities(v: ActivityModel[]) {
    this._subActivities = v;
  }

  private _startDate = dayjs();
  public get startDate(): Dayjs {
    return this._startDate;
  }
  public set startDate(v: Dayjs) {
    this._startDate = v;
  }

  public get timestamp(): number {
    return this.startDate.unix();
  }

  private _time = 0;
  public get time(): number {
    return this._time;
  }
  public set time(v: number) {
    this._time = v;
  }

  private _leftTime = 0;
  public get leftTime(): number {
    return this._leftTime;
  }
  public set leftTime(v: number) {
    this._leftTime = v;
    this.time = this.leftTime + this.rightTime;
  }

  private _leftStopwatchIsRunning = false;
  public get leftStopwatchIsRunning(): boolean {
    return this._leftStopwatchIsRunning;
  }
  public set leftStopwatchIsRunning(v: boolean) {
    this._leftStopwatchIsRunning = v;
  }

  private _leftStopwatchLastUpdateTime: number | undefined;
  public get leftStopwatchLastUpdateTime(): number | undefined {
    return this._leftStopwatchLastUpdateTime;
  }
  public set leftStopwatchLastUpdateTime(v: number | undefined) {
    this._leftStopwatchLastUpdateTime = v;
  }

  private _rightTime = 0;
  public get rightTime(): number {
    return this._rightTime;
  }
  public set rightTime(v: number) {
    this._rightTime = v;
    this.time = this.leftTime + this.rightTime;
  }

  private _rightStopwatchIsRunning = false;
  public get rightStopwatchIsRunning(): boolean {
    return this._rightStopwatchIsRunning;
  }
  public set rightStopwatchIsRunning(v: boolean) {
    this._rightStopwatchIsRunning = v;
  }

  public get anyStopwatchIsRunning(): boolean {
    return this.leftStopwatchIsRunning || this.rightStopwatchIsRunning;
  }

  private _rightStopwatchLastUpdateTime: number | undefined;
  public get rightStopwatchLastUpdateTime(): number | undefined {
    return this._rightStopwatchLastUpdateTime;
  }
  public set rightStopwatchLastUpdateTime(v: number | undefined) {
    this._rightStopwatchLastUpdateTime = v;
  }

  public get lastStopwatchUpdateTime(): number | undefined {
    if (this.leftStopwatchLastUpdateTime == null) {
      return this.rightStopwatchLastUpdateTime;
    }
    if (this.rightStopwatchLastUpdateTime == null) {
      return this.leftStopwatchLastUpdateTime;
    }
    return Math.max(
      this.leftStopwatchLastUpdateTime,
      this.rightStopwatchLastUpdateTime
    );
  }

  public get endDate(): Dayjs {
    if (this.time) {
      if (this.lastStopwatchUpdateTime != null) {
        const lastStopwatchUpdateTimeDate = dayjs(this.lastStopwatchUpdateTime);
        const timeDate = this.startDate.add(this.time, "millisecond");
        if (lastStopwatchUpdateTimeDate.isAfter(timeDate)) {
          return lastStopwatchUpdateTimeDate;
        }
        return timeDate;
      }
      return this.startDate.add(this.time, "millisecond");
    }
    return this.startDate;
  }

  private _note: string | undefined;
  public get note(): string | undefined {
    return this._note;
  }
  public set note(v: string | undefined) {
    this._note = v;
  }

  private _volume = 0;
  public get volume(): number {
    return this._volume;
  }
  public set volume(v: number) {
    this._volume = v;
  }

  private _leftVolume = 0;
  public get leftVolume(): number {
    return this._leftVolume;
  }
  public set leftVolume(v: number) {
    this._leftVolume = v;
    this.volume = this.leftVolume + this.rightVolume;
  }

  private _rightVolume = 0;
  public get rightVolume(): number {
    return this._rightVolume;
  }
  public set rightVolume(v: number) {
    this._rightVolume = v;
    this.volume = this.leftVolume + this.rightVolume;
  }

  public constructor() {}

  public toJSON() {
    return {
      id: this.id,
      activity: this.activity?.serialize(),
      subActivities: this.subActivities?.map((a) => a.serialize()),
      startDate: this.startDate.toISOString(),
      time: this.time,
      leftTime: this.leftTime,
      leftStopwatchIsRunning: this.leftStopwatchIsRunning,
      leftStopwatchLastUpdateTime: this.leftStopwatchLastUpdateTime,
      rightTime: this.rightTime,
      rightStopwatchIsRunning: this.rightStopwatchIsRunning,
      rightStopwatchLastUpdateTime: this.rightStopwatchLastUpdateTime,
      note: this.note?.trim() || undefined,
      volume: this.volume,
      leftVolume: this.leftVolume,
      rightVolume: this.rightVolume,
    };
  }

  public static fromJSON(json: any): EntryModel {
    const entry = new EntryModel();
    if (json.id != null) entry.id = json.id;
    if (json.activity != null)
      entry.activity = ActivityModel.deserialize(json.activity);
    if (json.subActivities != null)
      entry.subActivities = json.subActivities?.map((a: any) =>
        ActivityModel.deserialize(a)
      );
    if (json.startDate != null) entry.startDate = dayjs(json.startDate);
    if (json.time != null) entry.time = json.time;
    if (json.leftTime != null) entry.leftTime = json.leftTime;
    if (json.leftStopwatchIsRunning != null)
      entry.leftStopwatchIsRunning = json.leftStopwatchIsRunning;
    if (json.leftStopwatchLastUpdateTime != null)
      entry.leftStopwatchLastUpdateTime = json.leftStopwatchLastUpdateTime;
    if (json.rightTime != null) entry.rightTime = json.rightTime;
    if (json.rightStopwatchIsRunning != null)
      entry.rightStopwatchIsRunning = json.rightStopwatchIsRunning;
    if (json.rightStopwatchLastUpdateTime != null)
      entry.rightStopwatchLastUpdateTime = json.rightStopwatchLastUpdateTime;
    if (json.note != null) entry.note = json.note;
    if (json.volume != null) entry.volume = json.volume;
    if (json.leftVolume != null) entry.leftVolume = json.leftVolume;
    if (json.rightVolume != null) entry.rightVolume = json.rightVolume;
    return entry;
  }

  public serialize(): string {
    return JSON.stringify(this.toJSON());
  }

  public static deserialize(json: string): EntryModel {
    return EntryModel.fromJSON(JSON.parse(json));
  }

  public clone(): EntryModel {
    return EntryModel.deserialize(this.serialize());
  }

  /**
   * Returns the time of the given side, optionally up to date (if the stopwatch is running)
   * @param side The side to get the time of
   * @param upToDate Whether to return the time up to date (if the stopwatch is running)
   * @returns The time of the given side
   */
  public getTime({
    side,
    upToDate,
  }: {
    side?: "left" | "right";
    upToDate: boolean;
  }): number {
    if (!side) {
      return (
        this.getTime({ side: "left", upToDate }) +
        this.getTime({ side: "right", upToDate })
      );
    }
    if (side === "left") {
      if (upToDate && this.leftStopwatchIsRunning) {
        const now = Date.now();
        const delta = now - (this.leftStopwatchLastUpdateTime || now);
        return this.leftTime + delta;
      }
      return this.leftTime;
    } else if (side === "right") {
      if (upToDate && this.rightStopwatchIsRunning) {
        const now = Date.now();
        const delta = now - (this.rightStopwatchLastUpdateTime || now);
        return this.rightTime + delta;
      }
      return this.rightTime;
    }
    return 0;
  }

  public updateTime() {
    const {
      anyStopwatchIsRunning,
      leftStopwatchIsRunning,
      rightStopwatchIsRunning,
      leftTime,
      rightTime,
      lastStopwatchUpdateTime,
    } = this;
    if (!anyStopwatchIsRunning) return;
    const now = Date.now();
    const delta = now - (lastStopwatchUpdateTime ?? now);
    const time = leftStopwatchIsRunning ? leftTime : rightTime;
    if (leftStopwatchIsRunning) {
      this.leftTime = time + delta;
      this.leftStopwatchLastUpdateTime = now;
    } else if (rightStopwatchIsRunning) {
      this.rightTime = time + delta;
      this.rightStopwatchLastUpdateTime = now;
    }
  }
}
