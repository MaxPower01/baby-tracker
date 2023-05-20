import ActivityType from "@/modules/activities/enums/ActivityType";
import SubActivityType from "@/modules/activities/enums/SubActivityType";

export default class ActivityModel {
  private _type: ActivityType;
  public get type(): ActivityType {
    return this._type;
  }
  public set type(v: ActivityType) {
    this._type = v;
  }

  private _linkedTypes: ActivityType[] = [];
  public get linkedTypes(): ActivityType[] {
    return this._linkedTypes;
  }
  public set linkedTypes(v: ActivityType[]) {
    this._linkedTypes = v;
  }

  private _subTypes: SubActivityType[] = [];
  public get subTypes(): SubActivityType[] {
    return this._subTypes;
  }
  public set subTypes(v: SubActivityType[]) {
    this._subTypes = v;
  }

  private _typesOrder: ActivityType[] = [
    ActivityType.BreastFeeding,
    ActivityType.BottleFeeding,
    ActivityType.Burp,
    ActivityType.Diaper,
    ActivityType.Poop,
    ActivityType.Urine,
    ActivityType.Sleep,
    ActivityType.Walk,
    ActivityType.Note,
    ActivityType.Play,
    ActivityType.Cry,
    ActivityType.Regurgitation,
    ActivityType.Vomit,
    ActivityType.Fart,
    ActivityType.MilkExtraction,
    ActivityType.CarRide,
    ActivityType.Hiccups,
    ActivityType.Weight,
    ActivityType.Size,
    ActivityType.HeadCircumference,
    ActivityType.Bath,
    ActivityType.NasalHygiene,
    ActivityType.NailCutting,
    ActivityType.Temperature,
    ActivityType.Teeth,
    ActivityType.Symptom,
    ActivityType.Medicine,
    ActivityType.MedicalFollowUp,
    ActivityType.Hospital,
    ActivityType.Vaccine,
    ActivityType.SolidFood,
  ];

  public get order(): number {
    return this._typesOrder.indexOf(this._type);
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
    return this._linkedTypes.length > 0;
  }

  public constructor(type: ActivityType) {
    this._type = type;
    switch (type) {
      case ActivityType.Bath:
        this._name = "Bain";
        this._hasDuration = true;
        this._linkedTypes = [
          ActivityType.Regurgitation,
          ActivityType.Vomit,
          ActivityType.Burp,
          ActivityType.Cry,
          ActivityType.Poop,
          ActivityType.Urine,
        ];
        break;
      case ActivityType.BottleFeeding:
        this._name = "Biberon";
        this._hasDuration = true;
        this._hasVolume = true;
        this._linkedTypes = [
          ActivityType.Regurgitation,
          ActivityType.Vomit,
          ActivityType.Burp,
        ];
        break;
      case ActivityType.BreastFeeding:
        this._name = "Allaitement";
        this._hasDuration = true;
        this._hasSides = true;
        this._linkedTypes = [
          ActivityType.Regurgitation,
          ActivityType.Vomit,
          ActivityType.Burp,
        ];
        break;
      case ActivityType.Burp:
        this._name = "Rot";
        this._linkedTypes = [ActivityType.Regurgitation, ActivityType.Vomit];
        break;
      case ActivityType.CarRide:
        this._name = "Trajet en voiture";
        this._hasDuration = true;
        this._linkedTypes = [
          ActivityType.Regurgitation,
          ActivityType.Vomit,
          ActivityType.Burp,
          ActivityType.Cry,
          ActivityType.Poop,
          ActivityType.Urine,
          ActivityType.Sleep,
          ActivityType.Diaper,
          ActivityType.BreastFeeding,
          ActivityType.Hiccups,
        ];
        break;
      case ActivityType.Cry:
        this._name = "Pleurs";
        this._hasDuration = true;
        this._linkedTypes = [
          ActivityType.Regurgitation,
          ActivityType.Vomit,
          ActivityType.Burp,
          ActivityType.Hiccups,
          ActivityType.Poop,
          ActivityType.Urine,
        ];
        break;
      case ActivityType.Diaper:
        this._name = "Couche";
        this._linkedTypes = [
          ActivityType.Poop,
          ActivityType.Urine,
          ActivityType.Burp,
          ActivityType.Regurgitation,
          ActivityType.Vomit,
        ];
        this._subTypes = [SubActivityType.Meconium];
        break;
      case ActivityType.Hiccups:
        this._name = "Hoquet";
        this._hasDuration = true;
        this._linkedTypes = [
          ActivityType.Regurgitation,
          ActivityType.Vomit,
          ActivityType.Burp,
          ActivityType.Cry,
          ActivityType.Poop,
          ActivityType.Urine,
        ];
        break;
      case ActivityType.Hospital:
        this._name = "Visite à l'hôpital";
        this._linkedTypes = [
          ActivityType.Regurgitation,
          ActivityType.Vomit,
          ActivityType.Burp,
          ActivityType.Cry,
          ActivityType.Poop,
          ActivityType.Urine,
          ActivityType.Sleep,
          ActivityType.Diaper,
          ActivityType.BreastFeeding,
          ActivityType.Hiccups,
        ];
        break;
      case ActivityType.HeadCircumference:
        this._name = "Tour de tête";
        break;
      case ActivityType.MedicalFollowUp:
        this._name = "Suivi médical";
        this._linkedTypes = [
          ActivityType.Regurgitation,
          ActivityType.Vomit,
          ActivityType.Burp,
          ActivityType.Cry,
          ActivityType.Poop,
          ActivityType.Urine,
          ActivityType.Sleep,
          ActivityType.Diaper,
          ActivityType.BreastFeeding,
          ActivityType.Hiccups,
        ];
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
      case ActivityType.NailCutting:
        this._name = "Coupe d'ongles";
        break;
      case ActivityType.NasalHygiene:
        this._name = "Hygiène nasale";
        this._linkedTypes = [
          ActivityType.Regurgitation,
          ActivityType.Vomit,
          ActivityType.Burp,
          ActivityType.Cry,
        ];
        break;
      case ActivityType.Play:
        this._name = "Jeu";
        this._hasDuration = true;
        break;
      case ActivityType.Poop:
        this._name = "Caca";
        this._subTypes = [SubActivityType.Meconium];
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
        this._linkedTypes = [
          ActivityType.Regurgitation,
          ActivityType.Vomit,
          ActivityType.Burp,
          ActivityType.Cry,
          ActivityType.Sleep,
          ActivityType.Diaper,
          ActivityType.Poop,
          ActivityType.Urine,
          ActivityType.BreastFeeding,
          ActivityType.Hiccups,
        ];
        break;
      case ActivityType.Weight:
        this._name = "Poids";
        break;
      case ActivityType.Fart:
        this._name = "Pet";
        break;
      case ActivityType.Symptom:
        this._name = "Symptôme";
        break;
      case ActivityType.Note:
        this._name = "Note";
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
      linkedTypes: this.linkedTypes,
    };
  }

  public static fromJSON(json: any): ActivityModel {
    const activity = new ActivityModel(json.type);
    if (json.name != null) activity.name = json.name;
    if (json.hasDuration != null) activity.hasDuration = json.hasDuration;
    if (json.hasVolume != null) activity.hasVolume = json.hasVolume;
    if (json.hasSides != null) activity.hasSides = json.hasSides;
    if (json.linkedTypes != null) activity.linkedTypes = json.linkedTypes;
    return activity;
  }

  public serialize(): string {
    return JSON.stringify(this.toJSON());
  }

  public static deserialize(json: string): ActivityModel {
    return this.fromJSON(JSON.parse(json));
  }
}
