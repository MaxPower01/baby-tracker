import { ActivityType } from "../../../lib/enums";

export class ActivityModel {
  private _type: ActivityType;
  public get type(): ActivityType {
    return this._type;
  }
  public set type(v: ActivityType) {
    this._type = v;
  }

  private _order: number;
  public get order(): number {
    return this._order;
  }
  public set order(v: number) {
    this._order = v;
  }

  private _name: string;
  public get name(): string {
    return this._name;
  }
  public set name(v: string) {
    this._name = v;
  }

  private _hasDuration = false;
  public get hasDuration(): boolean {
    return this._hasDuration;
  }
  public set hasDuration(v: boolean) {
    this._hasDuration = v;
  }

  private _hasVolume = false;
  public get hasVolume(): boolean {
    return this._hasVolume;
  }
  public set hasVolume(v: boolean) {
    this._hasVolume = v;
  }

  private _hasSides = false;
  public get hasSides(): boolean {
    return this._hasSides;
  }
  public set hasSides(v: boolean) {
    this._hasSides = v;
  }

  public constructor(type: ActivityType) {
    this._type = type;
    switch (type) {
      case ActivityType.Bath:
        this._order = 100;
        this._name = "Bain";
        this._hasDuration = true;
        break;
      case ActivityType.BottleFeeding:
        this._order = 10;
        this._name = "Biberon";
        this._hasDuration = true;
        this._hasVolume = true;
        break;
      case ActivityType.BreastFeeding:
        this._order = 20;
        this._name = "Allaitement";
        this._hasDuration = true;
        this._hasSides = true;
        break;
      case ActivityType.Cry:
        this._order = 80;
        this._name = "Pleurs";
        this._hasDuration = true;
        break;
      case ActivityType.Diaper:
        this._order = 50;
        this._name = "Couche";
        break;
      case ActivityType.HeadCircumference:
        this._order = 150;
        this._name = "Circonférence de la tête";
        break;
      case ActivityType.HospitalVisit:
        this._order = 190;
        this._name = "Visite à l'hôpital";
        break;
      case ActivityType.Medicine:
        this._order = 170;
        this._name = "Médicament";
        break;
      case ActivityType.MilkExtraction:
        this._order = 30;
        this._name = "Extraction de lait";
        this._hasDuration = true;
        this._hasVolume = true;
        this._hasSides = true;
        break;
      case ActivityType.Play:
        this._order = 90;
        this._name = "Jeu";
        this._hasDuration = true;
        break;
      case ActivityType.Poop:
        this._order = 40;
        this._name = "Caca";
        break;
      case ActivityType.Size:
        this._order = 130;
        this._name = "Taille";
        break;
      case ActivityType.Sleep:
        this._order = 70;
        this._name = "Sommeil";
        this._hasDuration = true;
        break;
      case ActivityType.SolidFood:
        this._order = 120;
        this._name = "Nourriture solide";
        break;
      case ActivityType.Temperature:
        this._order = 160;
        this._name = "Température";
        break;
      case ActivityType.Teeth:
        this._order = 200;
        this._name = "Dents";
        break;
      case ActivityType.Urine:
        this._order = 60;
        this._name = "Pipi";
        break;
      case ActivityType.Vaccine:
        this._order = 180;
        this._name = "Vaccin";
        break;
      case ActivityType.Walk:
        this._order = 110;
        this._name = "Marche";
        this._hasDuration = true;
        break;
      case ActivityType.Weight:
        this._order = 140;
        this._name = "Poids";
        break;
      default:
        this._order = 0;
        this._name = "_";
        break;
    }
  }

  public toJSON(): any {
    return {
      type: this._type,
      order: this._order,
      name: this._name,
      hasDuration: this._hasDuration,
      hasVolume: this._hasVolume,
    };
  }

  public static fromJSON(json: any): ActivityModel {
    const activity = new ActivityModel(json.type);
    activity._order = json.order;
    activity._name = json.name;
    activity._hasDuration = json.hasDuration;
    activity._hasVolume = json.hasVolume;
    return activity;
  }

  public serialize(): string {
    return JSON.stringify(this.toJSON());
  }

  public static deserialize(json: string): ActivityModel {
    return this.fromJSON(JSON.parse(json));
  }
}
