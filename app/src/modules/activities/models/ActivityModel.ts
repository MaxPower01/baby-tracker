import ActivityType from "@/modules/activities/enums/ActivityType";
import EntryModel from "@/modules/entries/models/EntryModel";
import SubActivityType from "@/modules/activities/enums/SubActivityType";
import { formatStopwatchTime } from "@/utils/utils";

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

  private _previousEntryLabelPrefix: string;
  public get previousEntryLabelPrefix(): string {
    return this._previousEntryLabelPrefix;
  }
  public set previousEntryLabelPrefix(v: string) {
    this._previousEntryLabelPrefix = v;
  }

  public constructor(type: ActivityType) {
    this._type = type;
    this._name = this.getNameFor(type);
    this._previousEntryLabelPrefix = this.getPreviousEntryLabelPrefixFor(type);
    this._linkedTypes = this.getLinkedTypesFor(type);
    this._subTypes = this.getSubTypesFor(type);
    switch (type) {
      case ActivityType.Bath:
        this._hasDuration = true;
        break;
      case ActivityType.BottleFeeding:
        this._hasDuration = true;
        this._hasVolume = true;
        break;
      case ActivityType.BreastFeeding:
        this._hasDuration = true;
        this._hasSides = true;
        break;
      case ActivityType.Burp:
        break;
      case ActivityType.CarRide:
        this._hasDuration = true;
        break;
      case ActivityType.Cry:
        this._hasDuration = true;
        break;
      case ActivityType.Diaper:
        break;
      case ActivityType.Hiccups:
        this._hasDuration = true;
        break;
      case ActivityType.Hospital:
        break;
      case ActivityType.HeadCircumference:
        break;
      case ActivityType.MedicalFollowUp:
        break;
      case ActivityType.Medicine:
        break;
      case ActivityType.MilkExtraction:
        this._hasDuration = true;
        this._hasVolume = true;
        this._hasSides = true;
        break;
      case ActivityType.NailCutting:
        break;
      case ActivityType.NasalHygiene:
        break;
      case ActivityType.Play:
        this._hasDuration = true;
        break;
      case ActivityType.Poop:
        break;
      case ActivityType.Size:
        break;
      case ActivityType.Sleep:
        this._hasDuration = true;
        break;
      case ActivityType.SolidFood:
        break;
      case ActivityType.Regurgitation:
        break;
      case ActivityType.Temperature:
        break;
      case ActivityType.Teeth:
        break;
      case ActivityType.Urine:
        break;
      case ActivityType.Vaccine:
        break;
      case ActivityType.Vomit:
        break;
      case ActivityType.Walk:
        this._hasDuration = true;
        break;
      case ActivityType.Weight:
        break;
      case ActivityType.Fart:
        break;
      case ActivityType.Symptom:
        break;
      case ActivityType.Note:
        break;
      default:
        break;
    }
  }

  public getNameFor(type: ActivityType): string {
    switch (type) {
      case ActivityType.Bath:
        return "Bain";
      case ActivityType.BottleFeeding:
        return "Biberon";
      case ActivityType.BreastFeeding:
        return "Allaitement";
      case ActivityType.Burp:
        return "Rot";
      case ActivityType.CarRide:
        return "Trajet en voiture";
      case ActivityType.Cry:
        return "Pleurs";
      case ActivityType.Diaper:
        return "Couche";
      case ActivityType.Hiccups:
        return "Hoquet";
      case ActivityType.Hospital:
        return "Visite à l'hôpital";
      case ActivityType.HeadCircumference:
        return "Tour de tête";
      case ActivityType.MedicalFollowUp:
        return "Suivi médical";
      case ActivityType.Medicine:
        return "Médicament";
      case ActivityType.MilkExtraction:
        return "Extraction de lait";
      case ActivityType.NailCutting:
        return "Coupe d'ongles";
      case ActivityType.NasalHygiene:
        return "Hygiène nasale";
      case ActivityType.Play:
        return "Jeu";
      case ActivityType.Poop:
        return "Caca";
      case ActivityType.Size:
        return "Taille";
      case ActivityType.Sleep:
        return "Sommeil";
      case ActivityType.SolidFood:
        return "Nourriture solide";
      case ActivityType.Regurgitation:
        return "Régurgitation";
      case ActivityType.Temperature:
        return "Température";
      case ActivityType.Teeth:
        return "Dents";
      case ActivityType.Urine:
        return "Pipi";
      case ActivityType.Vaccine:
        return "Vaccin";
      case ActivityType.Vomit:
        return "Vomi";
      case ActivityType.Walk:
        return "Marche";
      case ActivityType.Weight:
        return "Poids";
      case ActivityType.Fart:
        return "Pet";
      case ActivityType.Symptom:
        return "Symptôme";
      case ActivityType.Note:
        return "Note";
      default:
        return "_";
    }
  }

  getPreviousEntryLabelPrefixFor(type: ActivityType): string {
    switch (type) {
      case ActivityType.Bath:
        return "Depuis le bain précédent:";
      case ActivityType.BottleFeeding:
        return "Depuis le biberon précédent:";
      case ActivityType.BreastFeeding:
        return "Depuis l'allaitement précédent:";
      case ActivityType.Burp:
        return "Depuis le rot précédent:";
      case ActivityType.CarRide:
        return "Depuis le trajet en voiture précédent:";
      case ActivityType.Cry:
        return "Depuis les pleurs précédents:";
      case ActivityType.Diaper:
        return "Depuis la couche précédente:";
      case ActivityType.Hiccups:
        return "Depuis le hoquet précédent:";
      case ActivityType.Hospital:
        return "Depuis la visite à l'hôpital précédente:";
      case ActivityType.HeadCircumference:
        return "Depuis le tour de tête précédent:";
      case ActivityType.MedicalFollowUp:
        return "Depuis le suivi médical précédent:";
      case ActivityType.Medicine:
        return "Depuis le médicament précédent:";
      case ActivityType.MilkExtraction:
        return "Depuis l'extraction de lait précédente:";
      case ActivityType.NailCutting:
        return "Depuis la coupe d'ongles précédente:";
      case ActivityType.NasalHygiene:
        return "Depuis l'hygiène nasale précédente:";
      case ActivityType.Play:
        return "Depuis le jeu précédent:";
      case ActivityType.Poop:
        return "Depuis le caca précédent:";
      case ActivityType.Size:
        return "Depuis la taille précédente:";
      case ActivityType.Sleep:
        return "Depuis le sommeil précédent:";
      case ActivityType.SolidFood:
        return "Depuis la nourriture solide précédente:";
      case ActivityType.Regurgitation:
        return "Depuis la régurgitation précédente:";
      case ActivityType.Temperature:
        return "Depuis la température précédente:";
      case ActivityType.Teeth:
        return "Depuis la dent précédente:";
      case ActivityType.Urine:
        return "Depuis le pipi précédent:";
      case ActivityType.Vaccine:
        return "Depuis le vaccin précédent:";
      case ActivityType.Vomit:
        return "Depuis le vomi précédent:";
      case ActivityType.Walk:
        return "Depuis la marche précédente:";
      case ActivityType.Weight:
        return "Depuis le poids précédent:";
      case ActivityType.Fart:
        return "Depuis le pet précédent:";
      case ActivityType.Symptom:
        return "Depuis le symptôme précédent:";
      case ActivityType.Note:
        return "Depuis la note précédente:";
      default:
        return "";
    }
  }

  getLastEntryTitle(lastEntry: EntryModel, now?: Date): string {
    if (lastEntry == null) return "";
    if (lastEntry.anyStopwatchIsRunning) return "En cours";
    if (now == null) now = new Date();
    const time =
      lastEntry.time > 0
        ? formatStopwatchTime(lastEntry.time, true, lastEntry.time < 1000 * 60)
        : null;
    if (time != null) {
      return time;
    }
    return "";
  }

  getLastEntrySubtitle(lastEntry: EntryModel, now?: Date): string {
    if (lastEntry == null || lastEntry.anyStopwatchIsRunning) return "";
    if (now == null) now = new Date();
    const diff = now.getTime() - lastEntry.endDate.getTime();
    if (diff < 1000 * 60) {
      return "À l'instant";
    }
    return `Il y a ${formatStopwatchTime(diff, true, false)}`;
  }

  getLinkedTypesFor(type: ActivityType): ActivityType[] {
    switch (type) {
      case ActivityType.Bath:
        return [
          ActivityType.Regurgitation,
          ActivityType.Vomit,
          ActivityType.Burp,
          ActivityType.Cry,
          ActivityType.Poop,
          ActivityType.Urine,
        ];
      case ActivityType.BottleFeeding:
        return [
          ActivityType.Regurgitation,
          ActivityType.Vomit,
          ActivityType.Burp,
        ];
      case ActivityType.BreastFeeding:
        return [
          ActivityType.Regurgitation,
          ActivityType.Vomit,
          ActivityType.Burp,
        ];
      case ActivityType.Burp:
        return [ActivityType.Regurgitation, ActivityType.Vomit];
      case ActivityType.CarRide:
        return [
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
      case ActivityType.Cry:
        return [
          ActivityType.Regurgitation,
          ActivityType.Vomit,
          ActivityType.Burp,
          ActivityType.Hiccups,
          ActivityType.Poop,
          ActivityType.Urine,
        ];
      case ActivityType.Diaper:
        return [
          ActivityType.Poop,
          ActivityType.Urine,
          ActivityType.Burp,
          ActivityType.Regurgitation,
          ActivityType.Vomit,
        ];
      case ActivityType.Hiccups:
        return [
          ActivityType.Regurgitation,
          ActivityType.Vomit,
          ActivityType.Burp,
          ActivityType.Cry,
        ];
      case ActivityType.Hospital:
        return [
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
      case ActivityType.HeadCircumference:
        break;
      case ActivityType.MedicalFollowUp:
        return [
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
      case ActivityType.Medicine:
        break;
      case ActivityType.MilkExtraction:
        break;
      case ActivityType.NailCutting:
        break;
      case ActivityType.NasalHygiene:
        return [
          ActivityType.Regurgitation,
          ActivityType.Vomit,
          ActivityType.Burp,
          ActivityType.Cry,
        ];
      case ActivityType.Play:
        break;
      case ActivityType.Poop:
        break;
      case ActivityType.Size:
        break;
      case ActivityType.Sleep:
        break;
      case ActivityType.SolidFood:
        break;
      case ActivityType.Regurgitation:
        break;
      case ActivityType.Temperature:
        break;
      case ActivityType.Teeth:
        break;
      case ActivityType.Urine:
        break;
      case ActivityType.Vaccine:
        break;
      case ActivityType.Vomit:
        break;
      case ActivityType.Walk:
        return [
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
      case ActivityType.Weight:
        break;
      case ActivityType.Fart:
        break;
      case ActivityType.Symptom:
        break;
      case ActivityType.Note:
        break;
      default:
        break;
    }

    return [];
  }

  getSubTypesFor(type: ActivityType): SubActivityType[] {
    switch (type) {
      case ActivityType.Bath:
        break;
      case ActivityType.BottleFeeding:
        return [
          SubActivityType.FormulaMilk,
          SubActivityType.BreastMilk,
          SubActivityType.AdaptedCowMilk,
          SubActivityType.GoatMilk,
        ];
      case ActivityType.BreastFeeding:
        break;
      case ActivityType.Burp:
        break;
      case ActivityType.CarRide:
        break;
      case ActivityType.Cry:
        break;
      case ActivityType.Diaper:
        break;
      case ActivityType.Hiccups:
        break;
      case ActivityType.Hospital:
        break;
      case ActivityType.HeadCircumference:
        break;
      case ActivityType.MedicalFollowUp:
        break;
      case ActivityType.Medicine:
        break;
      case ActivityType.MilkExtraction:
        break;
      case ActivityType.NailCutting:
        break;
      case ActivityType.NasalHygiene:
        return [SubActivityType.SalineSolution, SubActivityType.NasalAspirator];
      case ActivityType.Play:
        break;
      case ActivityType.Poop:
        return [SubActivityType.Meconium];
      case ActivityType.Size:
        break;
      case ActivityType.Sleep:
        return [
          SubActivityType.Crib,
          SubActivityType.Cradle,
          SubActivityType.Bed,
          SubActivityType.Swing,
        ];
      case ActivityType.SolidFood:
        break;
      case ActivityType.Regurgitation:
        break;
      case ActivityType.Temperature:
        break;
      case ActivityType.Teeth:
        break;
      case ActivityType.Urine:
        break;
      case ActivityType.Vaccine:
        break;
      case ActivityType.Vomit:
        break;
      case ActivityType.Walk:
        break;
      case ActivityType.Weight:
        break;
      case ActivityType.Fart:
        break;
      case ActivityType.Symptom:
        break;
      case ActivityType.Note:
        break;
      default:
        break;
    }

    return [];
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
