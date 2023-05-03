import { ActivityType } from "../../../lib/enums";

export class ActivityModel {
  private _type: ActivityType;
  public get type(): ActivityType {
    return this._type;
  }
  public set type(v: ActivityType) {
    this._type = v;
  }

  private _subTypes: ActivityType[] = [];
  public get subTypes(): ActivityType[] {
    return this._subTypes;
  }
  public set subTypes(v: ActivityType[]) {
    this._subTypes = v;
  }

  private _orderedTypes: ActivityType[] = [
    ActivityType.BreastFeeding,
    ActivityType.BottleFeeding,
    ActivityType.Sleep,
    //
    ActivityType.Diaper,
    ActivityType.Poop,
    ActivityType.Urine,
    //
    ActivityType.Cry,
    ActivityType.Regurgitation,
    ActivityType.Vomit,
    //
    ActivityType.Burp,
    ActivityType.Walk,
    ActivityType.Play,
    //
    ActivityType.Bath,
    ActivityType.Weight,
    ActivityType.Size,
    //
    ActivityType.Temperature,
    ActivityType.SolidFood,
    ActivityType.MilkExtraction,
    //
    ActivityType.Medicine,
    ActivityType.Vaccine,
    ActivityType.Teeth,
    //
    ActivityType.HospitalVisit,
  ];

  public get order(): number {
    return this._orderedTypes.indexOf(this._type);
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

  public get hasSubTypes(): boolean {
    return this._subTypes.length > 0;
  }

  public constructor(type: ActivityType) {
    this._type = type;
    switch (type) {
      case ActivityType.Bath:
        this._name = "Bain";
        this._hasDuration = true;
        break;
      case ActivityType.BottleFeeding:
        this._name = "Biberon";
        this._hasDuration = true;
        this._hasVolume = true;
        break;
      case ActivityType.BreastFeeding:
        this._name = "Allaitement";
        this._hasDuration = true;
        this._hasSides = true;
        this._subTypes = [
          ActivityType.Regurgitation,
          ActivityType.Vomit,
          ActivityType.Burp,
        ];
        break;
      case ActivityType.Burp:
        this._name = "Rot";
        break;
      case ActivityType.Cry:
        this._name = "Pleurs";
        this._hasDuration = true;
        break;
      case ActivityType.Diaper:
        this._name = "Couche";
        this._subTypes = [ActivityType.Poop, ActivityType.Urine];
        break;
      case ActivityType.HospitalVisit:
        this._name = "Visite à l'hôpital";
        break;
      case ActivityType.Medicine:
        this._name = "Médicament";
        break;
      case ActivityType.MilkExtraction:
        this._name = "Extraction de lait";
        this._hasDuration = true;
        this._hasVolume = true;
        this._hasSides = true;
        break;
      case ActivityType.Play:
        this._name = "Jeu";
        this._hasDuration = true;
        break;
      case ActivityType.Poop:
        this._name = "Caca";
        break;
      case ActivityType.Size:
        this._name = "Taille";
        break;
      case ActivityType.Sleep:
        this._name = "Sommeil";
        this._hasDuration = true;
        break;
      case ActivityType.SolidFood:
        this._name = "Nourriture solide";
        break;
      case ActivityType.Regurgitation:
        this._name = "Régurgitation";
        break;
      case ActivityType.Temperature:
        this._name = "Température";
        break;
      case ActivityType.Teeth:
        this._name = "Dents";
        break;
      case ActivityType.Urine:
        this._name = "Pipi";
        break;
      case ActivityType.Vaccine:
        this._name = "Vaccin";
        break;
      case ActivityType.Vomit:
        this._name = "Vomi";
        break;
      case ActivityType.Walk:
        this._name = "Marche";
        this._hasDuration = true;
        break;
      case ActivityType.Weight:
        this._name = "Poids";
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
      hasDuration: this.hasDuration,
      hasVolume: this.hasVolume,
      hasSides: this.hasSides,
      subTypes: this.subTypes,
    };
  }

  public static fromJSON(json: any): ActivityModel {
    const activity = new ActivityModel(json.type);
    if (json.name != null) activity.name = json.name;
    if (json.hasDuration != null) activity.hasDuration = json.hasDuration;
    if (json.hasVolume != null) activity.hasVolume = json.hasVolume;
    if (json.hasSides != null) activity.hasSides = json.hasSides;
    if (json.subTypes != null) activity.subTypes = json.subTypes;
    return activity;
  }

  public serialize(): string {
    return JSON.stringify(this.toJSON());
  }

  public static deserialize(json: string): ActivityModel {
    return this.fromJSON(JSON.parse(json));
  }
}