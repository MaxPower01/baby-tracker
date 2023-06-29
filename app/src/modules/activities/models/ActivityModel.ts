import ActivityType from "@/modules/activities/enums/ActivityType";
import EntryModel from "@/modules/entries/models/EntryModel";
import SubActivityType from "@/modules/activities/enums/SubActivityType";
import formatStopwatchTime from "@/utils/formatStopwatchTime";
import { isNullOrWhiteSpace } from "@/utils/utils";

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

  private _addNewEntryLabel: string;
  public get addNewEntryLabel(): string {
    return this._addNewEntryLabel;
  }
  public set addNewEntryLabel(v: string) {
    this._addNewEntryLabel = v;
  }

  private _filterEntriesLabel: string;
  public get filterEntriesLabel(): string {
    return this._filterEntriesLabel;
  }
  public set filterEntriesLabel(v: string) {
    this._filterEntriesLabel = v;
  }

  private _order = 0;
  public get order(): number {
    return this._order;
  }
  public set order(v: number) {
    this._order = v;
  }

  private _hasWeight = false;
  public get hasWeight(): boolean {
    return this._hasWeight;
  }
  public set hasWeight(v: boolean) {
    this._hasWeight = v;
  }

  private _hasLength = false;
  public get hasLength(): boolean {
    return this._hasLength;
  }
  public set hasLength(v: boolean) {
    this._hasLength = v;
  }

  public constructor(type: ActivityType) {
    this._type = type;
    this._name = this.getName(type);
    this._previousEntryLabelPrefix = this.getPreviousEntryLabelPrefix(type);
    this._addNewEntryLabel = this.getAddNewEntryLabel(type);
    this._filterEntriesLabel = this.getFilterEntriesLabel(type);
    this._linkedTypes = this.getLinkedTypes(type);
    this._subTypes = this.getSubTypes(type);
    this._hasDuration = this.getHasDuration(type);
    this._hasVolume = this.getHasVolume(type);
    this._hasSides = this.getHasSides(type);
    this._hasWeight = this.getHasWeight(type);
    this._hasLength = this.getHasLength(type);
  }

  private getHasWeight(type: ActivityType): boolean {
    switch (type) {
      case ActivityType.Weight:
        return true;
      default:
        return false;
    }
  }

  private getHasLength(type: ActivityType): boolean {
    switch (type) {
      case ActivityType.Size:
      case ActivityType.HeadCircumference:
        return true;
      default:
        return false;
    }
  }

  public getName(type: ActivityType): string {
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
      case ActivityType.BabyMash:
        return "Purée";
      case ActivityType.VitaminsAndSupplements:
        return "Vitamines et suppléments";
      case ActivityType.AwakeTime:
        return "Temps éveillé";
      case ActivityType.Activity:
        return "Activité";
      case ActivityType.BabyCare:
        return "Soins du bébé";
      case ActivityType.BabyToilet:
        return "Petit pot";
      case ActivityType.BellyTime:
        return "Temps sur le ventre";
      default:
        return "_";
    }
  }

  getPreviousEntryLabelPrefix(type: ActivityType): string {
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
      case ActivityType.BabyMash:
        return "Depuis la purée précédente:";
      case ActivityType.VitaminsAndSupplements:
        return "Depuis les vitamines et suppléments précédents:";
      case ActivityType.AwakeTime:
        return "Depuis le temps éveillé précédent:";
      case ActivityType.Activity:
        return "Depuis l'activité précédente:";
      case ActivityType.BabyCare:
        return "Depuis les soins du bébé précédents:";
      case ActivityType.BabyToilet:
        return "Depuis le petit pot précédent:";
      case ActivityType.BellyTime:
        return "Depuis le temps sur le ventre précédent:";
      default:
        return "";
    }
  }

  getAddNewEntryLabel(type: ActivityType): string {
    switch (type) {
      case ActivityType.Bath:
        return "Ajouter un bain";
      case ActivityType.BottleFeeding:
        return "Ajouter un biberon";
      case ActivityType.BreastFeeding:
        return "Ajouter un allaitement";
      case ActivityType.Burp:
        return "Ajouter un rot";
      case ActivityType.CarRide:
        return "Ajouter un trajet en voiture";
      case ActivityType.Cry:
        return "Ajouter des pleurs";
      case ActivityType.Diaper:
        return "Ajouter une couche";
      case ActivityType.Hiccups:
        return "Ajouter un hoquet";
      case ActivityType.Hospital:
        return "Ajouter une visite à l'hôpital";
      case ActivityType.HeadCircumference:
        return "Ajouter un tour de tête";
      case ActivityType.MedicalFollowUp:
        return "Ajouter un suivi médical";
      case ActivityType.Medicine:
        return "Ajouter un médicament";
      case ActivityType.MilkExtraction:
        return "Ajouter une extraction de lait";
      case ActivityType.NailCutting:
        return "Ajouter une coupe d'ongles";
      case ActivityType.NasalHygiene:
        return "Ajouter une hygiène nasale";
      case ActivityType.Play:
        return "Ajouter un jeu";
      case ActivityType.Poop:
        return "Ajouter un caca";
      case ActivityType.Size:
        return "Ajouter une taille";
      case ActivityType.Sleep:
        return "Ajouter un sommeil";
      case ActivityType.SolidFood:
        return "Ajouter une nourriture solide";
      case ActivityType.Regurgitation:
        return "Ajouter une régurgitation";
      case ActivityType.Temperature:
        return "Ajouter une température";
      case ActivityType.Teeth:
        return "Ajouter une dent";
      case ActivityType.Urine:
        return "Ajouter un pipi";
      case ActivityType.Vaccine:
        return "Ajouter un vaccin";
      case ActivityType.Vomit:
        return "Ajouter un vomi";
      case ActivityType.Walk:
        return "Ajouter une marche";
      case ActivityType.Weight:
        return "Ajouter un poids";
      case ActivityType.Fart:
        return "Ajouter un pet";
      case ActivityType.Symptom:
        return "Ajouter un symptôme";
      case ActivityType.Note:
        return "Ajouter une note";
      case ActivityType.BabyMash:
        return "Ajouter une purée";
      case ActivityType.VitaminsAndSupplements:
        return "Ajouter des vitamines et suppléments";
      case ActivityType.AwakeTime:
        return "Ajouter un temps éveillé";
      case ActivityType.Activity:
        return "Ajouter une activité";
      case ActivityType.BabyCare:
        return "Ajouter des soins du bébé";
      case ActivityType.BabyToilet:
        return "Ajouter un petit pot";
      case ActivityType.BellyTime:
        return "Ajouter un temps sur le ventre";
      default:
        return "";
    }
  }

  getFilterEntriesLabel(type: ActivityType): string {
    switch (type) {
      case ActivityType.Bath:
        return "Afficher seulement les bains";
      case ActivityType.BottleFeeding:
        return "Afficher seulement les biberons";
      case ActivityType.BreastFeeding:
        return "Afficher seulement les allaitements";
      case ActivityType.Burp:
        return "Afficher seulement les rots";
      case ActivityType.CarRide:
        return "Afficher seulement les trajets en voiture";
      case ActivityType.Cry:
        return "Afficher seulement les pleurs";
      case ActivityType.Diaper:
        return "Afficher seulement les couches";
      case ActivityType.Hiccups:
        return "Afficher seulement les hoquets";
      case ActivityType.Hospital:
        return "Afficher seulement les visites à l'hôpital";
      case ActivityType.HeadCircumference:
        return "Afficher seulement les tours de tête";
      case ActivityType.MedicalFollowUp:
        return "Afficher seulement les suivis médicaux";
      case ActivityType.Medicine:
        return "Afficher seulement les médicaments";
      case ActivityType.MilkExtraction:
        return "Afficher seulement les extractions de lait";
      case ActivityType.NailCutting:
        return "Afficher seulement les coupes d'ongles";
      case ActivityType.NasalHygiene:
        return "Afficher seulement les hygiènes nasales";
      case ActivityType.Play:
        return "Afficher seulement les jeux";
      case ActivityType.Poop:
        return "Afficher seulement les cacas";
      case ActivityType.Size:
        return "Afficher seulement les tailles";
      case ActivityType.Sleep:
        return "Afficher seulement les sommeils";
      case ActivityType.SolidFood:
        return "Afficher seulement les nourritures solides";
      case ActivityType.Regurgitation:
        return "Afficher seulement les régurgitations";
      case ActivityType.Temperature:
        return "Afficher seulement les températures";
      case ActivityType.Teeth:
        return "Afficher seulement les dents";
      case ActivityType.Urine:
        return "Afficher seulement les pipis";
      case ActivityType.Vaccine:
        return "Afficher seulement les vaccins";
      case ActivityType.Vomit:
        return "Afficher seulement les vomis";
      case ActivityType.Walk:
        return "Afficher seulement les marches";
      case ActivityType.Weight:
        return "Afficher seulement les poids";
      case ActivityType.Fart:
        return "Afficher seulement les pets";
      case ActivityType.Symptom:
        return "Afficher seulement les symptômes";
      case ActivityType.Note:
        return "Afficher seulement les notes";
      case ActivityType.BabyMash:
        return "Afficher seulement les purées";
      case ActivityType.VitaminsAndSupplements:
        return "Afficher seulement les vitamines et suppléments";
      case ActivityType.AwakeTime:
        return "Afficher seulement les temps éveillés";
      case ActivityType.Activity:
        return "Afficher seulement les activités";
      case ActivityType.BabyCare:
        return "Afficher seulement les soins du bébé";
      case ActivityType.BabyToilet:
        return "Afficher seulement les petits pots";
      case ActivityType.BellyTime:
        return "Afficher seulement les temps sur le ventre";
      default:
        return "";
    }
  }

  getLastEntryTitle({
    lastEntry,
    now,
    lastEntryIsLinkedActivity,
  }: {
    lastEntry: EntryModel;
    now?: Date;
    lastEntryIsLinkedActivity?: boolean;
  }): string {
    if (lastEntry == null) return "";
    if (lastEntry.anyStopwatchIsRunning) return "En cours";
    if (lastEntryIsLinkedActivity) return lastEntry.activity?.name ?? "";
    if (now == null) now = new Date();
    let result = "";
    const time =
      lastEntry.time > 0 ? formatStopwatchTime(lastEntry.time, false) : null;

    if (lastEntry.activity?.type == ActivityType.BreastFeeding) {
      if (lastEntry.leftTime > 0 && lastEntry.rightTime == 0) {
        result += "Gauche";
      } else if (lastEntry.leftTime == 0 && lastEntry.rightTime > 0) {
        result += "Droite";
      }
    } else if (lastEntry.activity?.type == ActivityType.BottleFeeding) {
      if (lastEntry.volume != null) {
        result += `${lastEntry.volume} ml`;
      }
    }

    if (time != null) {
      if (!isNullOrWhiteSpace(result)) result += " • ";
      result += `${time}`;
    }
    return result.trim();
  }

  getLastEntrySubtitle({
    lastEntry,
    now,
    lastEntryIsLinkedActivity,
  }: {
    lastEntry: EntryModel;
    now?: Date;
    lastEntryIsLinkedActivity?: boolean;
  }): string {
    if (lastEntry == null || lastEntry.anyStopwatchIsRunning) return "";
    if (now == null) now = new Date();
    const diff = now.getTime() - lastEntry.endDate.getTime();
    if (diff < 1000 * 60) {
      return "À l'instant";
    }
    return `Il y a ${formatStopwatchTime(diff, true, false)}`;
  }

  getLinkedTypes(type: ActivityType): ActivityType[] {
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
      case ActivityType.Vaccine:
        return [
          ActivityType.Regurgitation,
          ActivityType.Vomit,
          ActivityType.Burp,
          ActivityType.Cry,
          ActivityType.Poop,
          ActivityType.Urine,
          ActivityType.Sleep,
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
          ActivityType.Cry,
          ActivityType.Poop,
          ActivityType.Urine,
          ActivityType.Sleep,
          ActivityType.Fart,
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
      case ActivityType.NasalHygiene:
        return [
          ActivityType.Regurgitation,
          ActivityType.Vomit,
          ActivityType.Burp,
          ActivityType.Cry,
        ];
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
      case ActivityType.BellyTime:
        return [ActivityType.Cry];
      default:
        return [];
    }
  }

  getSubTypes(type: ActivityType): SubActivityType[] {
    switch (type) {
      case ActivityType.BottleFeeding:
        return [
          SubActivityType.FormulaMilk,
          SubActivityType.BreastMilk,
          SubActivityType.AdaptedCowMilk,
          SubActivityType.GoatMilk,
        ];
      case ActivityType.NasalHygiene:
        return [SubActivityType.SalineSolution, SubActivityType.NasalAspirator];
      case ActivityType.Poop:
        return [SubActivityType.Meconium];
      case ActivityType.Sleep:
        return [
          SubActivityType.Crib,
          SubActivityType.Cradle,
          SubActivityType.Bed,
          SubActivityType.Swing,
          SubActivityType.Moise,
          SubActivityType.CarSeat,
        ];
      case ActivityType.Play:
        return [SubActivityType.PlayMat];
      case ActivityType.Activity:
        return [SubActivityType.Pool, SubActivityType.Beach];
      default:
        return [];
    }
  }

  getHasDuration(type: ActivityType): boolean {
    switch (type) {
      case ActivityType.Bath:
      case ActivityType.BottleFeeding:
      case ActivityType.BreastFeeding:
      case ActivityType.CarRide:
      case ActivityType.Cry:
      case ActivityType.Hiccups:
      case ActivityType.MilkExtraction:
      case ActivityType.Play:
      case ActivityType.Sleep:
      case ActivityType.AwakeTime:
      case ActivityType.Activity:
      case ActivityType.Walk:
      case ActivityType.BellyTime:
        return true;
      default:
        return false;
    }
  }

  getHasSides(type: ActivityType): boolean {
    switch (type) {
      case ActivityType.BreastFeeding:
        return true;
      case ActivityType.MilkExtraction:
        return true;
      default:
        return false;
    }
  }

  getHasVolume(type: ActivityType): boolean {
    switch (type) {
      case ActivityType.BottleFeeding:
        return true;
      case ActivityType.MilkExtraction:
        return true;
      default:
        return false;
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
