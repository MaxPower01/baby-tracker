import dayjs, { Dayjs } from "dayjs";
import { v4 as uuidv4 } from "uuid";
import { ActivityModel } from "../../activities/models/ActivityModel";

export class EntryModel {
  private _id: string;
  public get id(): string {
    return this._id;
  }
  public set id(v: string) {
    this._id = v;
  }

  private _activity: ActivityModel;
  public get activity(): ActivityModel {
    return this._activity;
  }
  public set activity(v: ActivityModel) {
    this._activity = v;
  }

  private _subActivities: ActivityModel[] = [];
  public get subActivities(): ActivityModel[] {
    return this._subActivities;
  }
  public set subActivities(v: ActivityModel[]) {
    this._subActivities = v;
  }

  private _startDate: Dayjs;
  public get startDate(): Dayjs {
    return this._startDate;
  }
  public set startDate(v: Dayjs) {
    this._startDate = v;
  }

  public get timestamp(): number {
    return this.startDate.unix();
  }

  private _time: number | undefined;
  public get time(): number | undefined {
    return this._time;
  }
  public set time(v: number | undefined) {
    this._time = v;
  }

  private _leftTime: number | undefined;
  public get leftTime(): number | undefined {
    return this._leftTime;
  }
  public set leftTime(v: number | undefined) {
    this._leftTime = v;
  }

  private _rightTime: number | undefined;
  public get rightTime(): number | undefined {
    return this._rightTime;
  }
  public set rightTime(v: number | undefined) {
    this._rightTime = v;
  }

  private _note: string | undefined;
  public get note(): string | undefined {
    return this._note;
  }
  public set note(v: string | undefined) {
    this._note = v;
  }

  public constructor(params: {
    id?: string;
    activity: ActivityModel;
    subActivities?: ActivityModel[];
    startDate?: Dayjs | null;
    time?: number;
    leftTime?: number;
    rightTime?: number;
    note?: string;
  }) {
    this._id = params.id || uuidv4();
    this._activity = params.activity;
    this._subActivities = params.subActivities || [];
    this._startDate = params.startDate || dayjs();
    this._time = params.time;
    this._leftTime = params.leftTime;
    this._rightTime = params.rightTime;
    this._note = params.note;
  }

  public toJSON() {
    return {
      id: this.id,
      activity: this.activity.serialize(),
      subActivities: this.subActivities?.map((a) => a.serialize()),
      startDate: this.startDate.toISOString(),
      time: this.time,
      leftTime: this.leftTime,
      rightTime: this.rightTime,
      note: this.note,
    };
  }

  public static fromJSON(json: any): EntryModel {
    const entry = new EntryModel({
      activity: ActivityModel.deserialize(json.activity),
    });
    if (json.id != null) entry.id = json.id;
    if (json.subActivities != null)
      entry.subActivities = json.subActivities?.map((a: any) =>
        ActivityModel.deserialize(a)
      );
    if (json.startDate != null) entry.startDate = dayjs(json.startDate);
    if (json.time != null) entry.time = json.time;
    if (json.leftTime != null) entry.leftTime = json.leftTime;
    if (json.rightTime != null) entry.rightTime = json.rightTime;
    if (json.note != null) entry.note = json.note;
    return entry;
  }

  public serialize(): string {
    return JSON.stringify(this.toJSON());
  }

  public static deserialize(json: string): EntryModel {
    return EntryModel.fromJSON(JSON.parse(json));
  }
}
