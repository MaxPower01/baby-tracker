import { StopwatchAction } from "@/components/Stopwatch/types/StopwatchAction";

export class Stopwatch {
  private _side: "left" | "right" | null;
  public get side(): "left" | "right" | null {
    return this._side;
  }
  public set side(v: "left" | "right" | null) {
    this._side = v;
  }

  private _isRunning: boolean;
  public get isRunning(): boolean {
    return this._isRunning;
  }
  public set isRunning(v: boolean) {
    this._isRunning = v;
  }

  private _duration: number | null;
  public get duration(): number | null {
    return this._duration;
  }
  public set duration(v: number | null) {
    this._duration = v;
  }

  private _actions: StopwatchAction[];
  public get actions(): StopwatchAction[] {
    return this._actions;
  }
  public set actions(v: StopwatchAction[]) {
    this._actions = v;
  }

  public get startDate(): Date | null {
    if (this._actions.length === 0) {
      return null;
    }
    return this._actions[0].date;
  }

  public get endDate(): Date | null {
    if (this._actions.length <= 1) {
      return null;
    }
    const lastAction = this._actions[this._actions.length - 1];
    return lastAction.type === "stop" ? lastAction.date : null;
  }

  constructor() {
    this._side = null;
    this._isRunning = false;
    this._duration = null;
    this._actions = [];
  }

  public toJSON(): object {
    return {
      side: this._side,
      isRunning: this._isRunning,
      duration: this._duration,
      actions: this._actions.map((action) => {
        return {
          type: action.type,
          date: action.date.toISOString(),
        };
      }),
    };
  }

  public serialize(): string {
    return JSON.stringify(this.toJSON());
  }

  public static fromJSON(json: any): Stopwatch {
    const stopwatch = new Stopwatch();
    stopwatch._side = json["side"];
    stopwatch._isRunning = json["isRunning"];
    stopwatch._duration = json["duration"];
    stopwatch._actions = json["actions"].map((action: any) => {
      return {
        type: action["type"],
        date: new Date(action["date"]),
      };
    });
    return stopwatch;
  }

  public static deserialize(serialized: string): Stopwatch {
    return Stopwatch.fromJSON(JSON.parse(serialized));
  }
}
