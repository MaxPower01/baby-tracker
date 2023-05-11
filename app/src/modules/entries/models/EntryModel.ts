import  ActivityModel  from "@/modules/activities/models/ActivityModel";
import { SubActivityModel } from "@/modules/activities/models/SubActivityModel";
import dayjs from "dayjs";
import { DocumentData } from "firebase/firestore";

export default class EntryModel {
  private _id: string | null = null;
  public get id(): string | null {
    return this._id;
  }
  public set id(v: string | null) {
    this._id = v;
  }

  private _activity: ActivityModel | null = null;
  public get activity(): ActivityModel | null {
    return this._activity;
  }
  public set activity(v: ActivityModel | null) {
    this._activity = v;
  }

  private _linkedActivities: ActivityModel[] = [];
  public get linkedActivities(): ActivityModel[] {
    return this._linkedActivities;
  }
  public set linkedActivities(v: ActivityModel[]) {
    this._linkedActivities = v;
  }

  private _subActivities: SubActivityModel[] = [];
  public get subActivities(): SubActivityModel[] {
    return this._subActivities;
  }
  public set subActivities(v: SubActivityModel[]) {
    this._subActivities = v;
  }

  private _startDate = new Date();
  public get startDate(): Date {
    return this._startDate;
  }
  public set startDate(v: Date) {
    this._startDate = v;
  }

  private _endDate = new Date();
  public get endDate(): Date {
    return this._endDate;
  }
  public set endDate(v: Date) {
    this._endDate = v;
  }

  public get timestamp(): number {
    return this.startDate.getTime();
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

  private _leftStopwatchLastUpdateTime: number | null = null;
  public get leftStopwatchLastUpdateTime(): number | null {
    return this._leftStopwatchLastUpdateTime;
  }
  public set leftStopwatchLastUpdateTime(v: number | null) {
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

  private _rightStopwatchLastUpdateTime: number | null = null;
  public get rightStopwatchLastUpdateTime(): number | null {
    return this._rightStopwatchLastUpdateTime;
  }
  public set rightStopwatchLastUpdateTime(v: number | null) {
    this._rightStopwatchLastUpdateTime = v;
  }

  public get lastStopwatchUpdateTime(): number | null {
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

  private _note = "";
  public get note(): string {
    return this._note;
  }
  public set note(v: string) {
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

  /**
   * Returns a JSON representation of the object
   * @param params.keepDates If true, dates will be kept as Date objects, otherwise they will be converted to ISO strings
   * @returns A JSON representation of the object
   */
  public toJSON(params?: { keepDates?: boolean }) {
    return {
      id: this.id,
      activity: this.activity?.serialize(),
      linkedActivities: this.linkedActivities?.map((a) => a.serialize()),
      subActivities: this.subActivities?.map((a) => a.serialize()),
      startDate:
        params?.keepDates == true
          ? this.startDate
          : this.startDate.toISOString(),
      endDate:
        params?.keepDates == true ? this.endDate : this.endDate.toISOString(),
      time: this.time,
      leftTime: this.leftTime,
      leftStopwatchIsRunning: this.leftStopwatchIsRunning,
      leftStopwatchLastUpdateTime: this.leftStopwatchLastUpdateTime,
      rightTime: this.rightTime,
      rightStopwatchIsRunning: this.rightStopwatchIsRunning,
      rightStopwatchLastUpdateTime: this.rightStopwatchLastUpdateTime,
      note: this.note?.trim() || null,
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
    if (json.linkedActivities != null)
      entry.linkedActivities = json.linkedActivities?.map((a: any) =>
        ActivityModel.deserialize(a)
      );
    if (json.subActivities != null)
      entry.subActivities = json.subActivities?.map((a: any) =>
        SubActivityModel.deserialize(a)
      );
    if (json.startDate != null) entry.startDate = new Date(json.startDate);
    if (json.endDate != null) entry.endDate = new Date(json.endDate);
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

  public static fromFirestore(data: DocumentData): EntryModel {
    const json = data;
    const { startDate, endDate, ...rest } = json;
    const entry = EntryModel.fromJSON(rest);
    if (startDate != null) entry.startDate = startDate?.toDate();
    if (endDate != null) entry.endDate = endDate?.toDate();
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

  public startLeftStopwatch() {
    this.leftStopwatchIsRunning = true;
    this.leftStopwatchLastUpdateTime = Date.now();
  }

  public startRightStopwatch() {
    this.rightStopwatchIsRunning = true;
    this.rightStopwatchLastUpdateTime = Date.now();
  }

  // public get endDate(): Date {
  //   if (this.time) {
  //     if (this.lastStopwatchUpdateTime != null) {
  //       const lastStopwatchUpdateTimeDate = dayjs(this.lastStopwatchUpdateTime);
  //       // const timeDate = this.startDate.add(this.time, "millisecond");
  //       const timeDate = dayjs(this.startDate).add(this.time, "millisecond");
  //       if (lastStopwatchUpdateTimeDate.isAfter(timeDate)) {
  //         return lastStopwatchUpdateTimeDate.toDate();
  //       }
  //       return timeDate.toDate();
  //     }
  //     // return this.startDate.add(this.time, "millisecond");
  //     return dayjs(this.startDate).add(this.time, "millisecond").toDate();
  //   }
  //   return this.startDate;
  // }

  public setEndDate() {
    if (this.time) {
      if (this.lastStopwatchUpdateTime != null) {
        const lastStopwatchUpdateTimeDate = dayjs(this.lastStopwatchUpdateTime);
        // const timeDate = this.startDate.add(this.time, "millisecond");
        const timeDate = dayjs(this.startDate).add(this.time, "millisecond");
        if (lastStopwatchUpdateTimeDate.isAfter(timeDate)) {
          this.endDate = lastStopwatchUpdateTimeDate.toDate();
        } else {
          this.endDate = timeDate.toDate();
        }
      } else {
        // this.endDate = this.startDate.add(this.time, "millisecond");
        this.endDate = dayjs(this.startDate)
          .add(this.time, "millisecond")
          .toDate();
      }
    } else {
      this.endDate = this.startDate;
    }
  }
}
