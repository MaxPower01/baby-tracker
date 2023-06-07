import SubActivityType from "@/modules/activities/enums/SubActivityType";

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
      case SubActivityType.Crib:
        this._name = "Bassinette";
        break;
      case SubActivityType.Moise:
        this._name = "Moïse";
        break;
      case SubActivityType.Cradle:
        this._name = "Berceau";
        break;
      case SubActivityType.Bed:
        this._name = "Lit";
        break;
      case SubActivityType.FormulaMilk:
        this._name = "Lait maternisé";
        break;
      case SubActivityType.BreastMilk:
        this._name = "Lait maternel";
        break;
      case SubActivityType.AdaptedCowMilk:
        this._name = "Lait de vache adapté";
        break;
      case SubActivityType.GoatMilk:
        this._name = "Lait de chèvre";
        break;
      case SubActivityType.Swing:
        this._name = "Balançoire";
        break;
      case SubActivityType.SalineSolution:
        this._name = "Solution saline";
        break;
      case SubActivityType.NasalAspirator:
        this._name = "Aspirateur nasal";
        break;
      case SubActivityType.PlayMat:
        this._name = "Tapis d'éveil";
        break;
      case SubActivityType.Pool:
        this._name = "Piscine";
        break;
      case SubActivityType.Beach:
        this._name = "Plage";
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
