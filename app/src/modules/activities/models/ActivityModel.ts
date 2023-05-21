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

  private _previousEntryLabelPrefix: string;
  public get previousEntryLabelPrefix(): string {
    return this._previousEntryLabelPrefix;
  }
  public set previousEntryLabelPrefix(v: string) {
    this._previousEntryLabelPrefix = v;
  }

  public constructor(type: ActivityType) {
    this._type = type;
    switch (type) {
      case ActivityType.Bath:
        this._name = "Bain";
        //this._previousEntryLabelPrefix = "Dernier bain il y a";
        // this._previousEntryLabelPrefix = "Bain précédent il y a";
        this._previousEntryLabelPrefix = "Depuis le bain précédent:";
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
        //this._previousEntryLabelPrefix = "Dernier biberon il y a";
        // this._previousEntryLabelPrefix = "Biberon précédent il y a";
        this._previousEntryLabelPrefix = "Depuis le biberon précédent:";
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
        //this._previousEntryLabelPrefix = "Dernier allaitement il y a";
        // this._previousEntryLabelPrefix = "Allaitement précédent il y a";
        this._previousEntryLabelPrefix = "Depuis le dernier allaitement:";
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
        //this._previousEntryLabelPrefix = "Dernier rot il y a";
        // this._previousEntryLabelPrefix = "Rot précédent il y a";
        this._previousEntryLabelPrefix = "Depuis le dernier rot:";
        this._linkedTypes = [ActivityType.Regurgitation, ActivityType.Vomit];
        break;
      case ActivityType.CarRide:
        this._name = "Trajet en voiture";
        //this._previousEntryLabelPrefix = "Dernier trajet en voiture il y a";
        // this._previousEntryLabelPrefix = "Trajet en voiture précédent il y a";
        this._previousEntryLabelPrefix = "Depuis le dernier trajet en voiture:";
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
        //this._previousEntryLabelPrefix = "Derniers pleurs il y a";
        // this._previousEntryLabelPrefix = "Pleurs précédents il y a";
        this._previousEntryLabelPrefix = "Depuis les derniers pleurs:";
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
        //this._previousEntryLabelPrefix = "Dernière couche il y a";
        // this._previousEntryLabelPrefix = "Couche précédente il y a";
        this._previousEntryLabelPrefix = "Depuis la dernière couche:";
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
        //this._previousEntryLabelPrefix = "Dernier hoquet il y a";
        // this._previousEntryLabelPrefix = "Hoquet précédent il y a";
        this._previousEntryLabelPrefix = "Depuis le dernier hoquet:";
        this._hasDuration = true;
        this._linkedTypes = [
          ActivityType.Regurgitation,
          ActivityType.Vomit,
          ActivityType.Burp,
          ActivityType.Cry,
        ];
        break;
      case ActivityType.Hospital:
        this._name = "Visite à l'hôpital";
        //this._previousEntryLabelPrefix = "Dernière visite à l'hôpital il y a";
        // this._previousEntryLabelPrefix = "Visite à l'hôpital précédente il y a";
        this._previousEntryLabelPrefix =
          "Depuis la dernière visite à l'hôpital:";
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
        //this._previousEntryLabelPrefix = "Dernier tour de tête mesuré il y a";
        // this._previousEntryLabelPrefix = "Tour de tête précédent mesuré il y a";
        this._previousEntryLabelPrefix =
          "Depuis le dernier tour de tête mesuré:";
        break;
      case ActivityType.MedicalFollowUp:
        this._name = "Suivi médical";
        //this._previousEntryLabelPrefix = "Dernier suivi médical il y a";
        // this._previousEntryLabelPrefix = "Suivi médical précédent il y a";
        this._previousEntryLabelPrefix = "Depuis le dernier suivi médical:";
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
        //this._previousEntryLabelPrefix = "Dernier médicament donné il y a";
        // this._previousEntryLabelPrefix = "Médicament précédent donné il y a";
        this._previousEntryLabelPrefix = "Depuis le dernier médicament donné:";
        break;
      case ActivityType.MilkExtraction:
        this._name = "Extraction de lait";
        //this._previousEntryLabelPrefix = "Dernière extraction de lait il y a";
        // this._previousEntryLabelPrefix = "Extraction de lait précédente il y a";
        this._previousEntryLabelPrefix =
          "Depuis la dernière extraction de lait:";
        this._hasDuration = true;
        this._hasVolume = true;
        this._hasSides = true;
        break;
      case ActivityType.NailCutting:
        this._name = "Coupe d'ongles";
        //this._previousEntryLabelPrefix = "Dernière coupe d'ongles il y a";
        // this._previousEntryLabelPrefix = "Coupe d'ongles précédente il y a";
        this._previousEntryLabelPrefix = "Depuis la dernière coupe d'ongles:";
        break;
      case ActivityType.NasalHygiene:
        this._name = "Hygiène nasale";
        //this._previousEntryLabelPrefix = "Dernière hygiène nasale il y a";
        // this._previousEntryLabelPrefix = "Hygiène nasale précédente il y a";
        this._previousEntryLabelPrefix = "Depuis la dernière hygiène nasale:";
        this._linkedTypes = [
          ActivityType.Regurgitation,
          ActivityType.Vomit,
          ActivityType.Burp,
          ActivityType.Cry,
        ];
        break;
      case ActivityType.Play:
        this._name = "Jeu";
        //this._previousEntryLabelPrefix = "Dernier jeu il y a";
        // this._previousEntryLabelPrefix = "Jeu précédent il y a";
        this._previousEntryLabelPrefix = "Depuis le dernier jeu:";
        this._hasDuration = true;
        break;
      case ActivityType.Poop:
        this._name = "Caca";
        //this._previousEntryLabelPrefix = "Dernier caca il y a";
        // this._previousEntryLabelPrefix = "Caca précédent il y a";
        this._previousEntryLabelPrefix = "Depuis le dernier caca:";
        this._subTypes = [SubActivityType.Meconium];
        break;
      case ActivityType.Size:
        this._name = "Taille";
        //this._previousEntryLabelPrefix = "Dernière taille mesurée il y a";
        // this._previousEntryLabelPrefix = "Taille précédente mesurée il y a";
        this._previousEntryLabelPrefix = "Depuis la dernière taille mesurée:";
        break;
      case ActivityType.Sleep:
        this._name = "Sommeil";
        //this._previousEntryLabelPrefix = "Dernier sommeil il y a";
        // this._previousEntryLabelPrefix = "Sommeil précédent il y a";
        this._previousEntryLabelPrefix = "Depuis le dernier sommeil:";
        this._hasDuration = true;
        this._subTypes = [
          SubActivityType.Crib,
          SubActivityType.Cradle,
          SubActivityType.Bed,
        ];
        break;
      case ActivityType.SolidFood:
        this._name = "Nourriture solide";
        //this._previousEntryLabelPrefix = "Dernière nourriture solide il y a";
        // this._previousEntryLabelPrefix = "Nourriture solide précédente il y a";
        this._previousEntryLabelPrefix =
          "Depuis la dernière nourriture solide:";
        break;
      case ActivityType.Regurgitation:
        this._name = "Régurgitation";
        //this._previousEntryLabelPrefix = "Dernière régurgitation il y a";
        // this._previousEntryLabelPrefix = "Régurgitation précédente il y a";
        this._previousEntryLabelPrefix = "Depuis la dernière régurgitation:";
        break;
      case ActivityType.Temperature:
        this._name = "Température";
        //this._previousEntryLabelPrefix = "Dernière température prise il y a";
        // this._previousEntryLabelPrefix = "Température précédente prise il y a";
        this._previousEntryLabelPrefix =
          "Depuis la dernière température prise:";
        break;
      case ActivityType.Teeth:
        this._name = "Dents";
        //this._previousEntryLabelPrefix = "Dernière dent apparue il y a";
        // this._previousEntryLabelPrefix = "Dent précédente apparue il y a";
        this._previousEntryLabelPrefix = "Depuis la dernière dent apparue:";
        break;
      case ActivityType.Urine:
        this._name = "Pipi";
        //this._previousEntryLabelPrefix = "Dernier pipi il y a";
        // this._previousEntryLabelPrefix = "Pipi précédent il y a";
        this._previousEntryLabelPrefix = "Depuis le dernier pipi:";
        break;
      case ActivityType.Vaccine:
        this._name = "Vaccin";
        //this._previousEntryLabelPrefix = "Dernier vaccin il y a";
        // this._previousEntryLabelPrefix = "Vaccin précédent il y a";
        this._previousEntryLabelPrefix = "Depuis le dernier vaccin:";
        break;
      case ActivityType.Vomit:
        this._name = "Vomi";
        //this._previousEntryLabelPrefix = "Dernier vomi il y a";
        // this._previousEntryLabelPrefix = "Vomi précédent il y a";
        this._previousEntryLabelPrefix = "Depuis le dernier vomi:";
        break;
      case ActivityType.Walk:
        this._name = "Marche";
        //this._previousEntryLabelPrefix = "Dernière marche il y a";
        // this._previousEntryLabelPrefix = "Marche précédente il y a";
        this._previousEntryLabelPrefix = "Depuis la dernière marche:";
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
        //this._previousEntryLabelPrefix = "Dernier poids il y a";
        // this._previousEntryLabelPrefix = "Poids précédent il y a";
        this._previousEntryLabelPrefix = "Depuis le dernier poids:";
        break;
      case ActivityType.Fart:
        this._name = "Pet";
        //this._previousEntryLabelPrefix = "Dernier pet il y a";
        // this._previousEntryLabelPrefix = "Pet précédent il y a";
        this._previousEntryLabelPrefix = "Depuis le dernier pet:";
        break;
      case ActivityType.Symptom:
        this._name = "Symptôme";
        //this._previousEntryLabelPrefix = "Dernier symptôme il y a";
        // this._previousEntryLabelPrefix = "Symptôme précédent il y a";
        this._previousEntryLabelPrefix = "Depuis le dernier symptôme:";
        break;
      case ActivityType.Note:
        this._name = "Note";
        //this._previousEntryLabelPrefix = "Dernière note il y a";
        // this._previousEntryLabelPrefix = "Note précédente il y a";
        this._previousEntryLabelPrefix = "Depuis la dernière note:";
        break;
      default:
        this._name = "_";
        //this._previousEntryLabelPrefix = "_";
        // this._previousEntryLabelPrefix = "_";
        this._previousEntryLabelPrefix = "_";
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
