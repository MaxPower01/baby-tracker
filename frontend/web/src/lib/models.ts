import { ActivityType } from "./enums";

export class Activity {
  private _activityType: ActivityType;
  public get activityType(): ActivityType {
    return this._activityType;
  }
  public set activityType(v: ActivityType) {
    this._activityType = v;
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

  public constructor(activityType: ActivityType) {
    this._activityType = activityType;
    switch (activityType) {
      case ActivityType.Bath:
        this._order = 100;
        this._name = "Bain";
        break;
      case ActivityType.BottleFeeding:
        this._order = 20;
        this._name = "Biberon";
        break;
      case ActivityType.BreastFeeding:
        this._order = 10;
        this._name = "Allaitement";
        break;
      case ActivityType.Cry:
        this._order = 80;
        this._name = "Pleurs";
        break;
      case ActivityType.Diaper:
        this._order = 30;
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
        this._order = 60;
        this._name = "Extraction de lait";
        break;
      case ActivityType.Play:
        this._order = 90;
        this._name = "Jeu";
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
        this._order = 50;
        this._name = "Pipi";
        break;
      case ActivityType.Vaccine:
        this._order = 180;
        this._name = "Vaccin";
        break;
      case ActivityType.Walk:
        this._order = 110;
        this._name = "Marche";
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
}
