import SubActivityType from "../enums/SubActivityType";

export class SubActivityModel {
  private _type: SubActivityType;
  public get type(): SubActivityType {
    return this._type;
  }
  public set type(v: SubActivityType) {
    this._type = v;
  }
  private _name: string;
  public get name(): string {
    return this._name;
  }
  public set name(v: string) {
    this._name = v;
  }

  public constructor(type: SubActivityType) {
    this._type = type;
    switch (type) {
      case SubActivityType.Meconium:
        this._name = "Méconium";
        break;
      default:
        this._name = "_";
        break;
    }
  }

  public toJSON(): any {
    return {
      type: this.type,
      name: this.name,
    };
  }

  public static fromJSON(json: any): SubActivityModel {
    const subActivity = new SubActivityModel(json.type);
    if (json.name != null) subActivity.name = json.name;
    return subActivity;
  }

  public serialize(): string {
    return JSON.stringify(this.toJSON());
  }

  public static deserialize(json: string): SubActivityModel {
    return this.fromJSON(JSON.parse(json));
  }
}
