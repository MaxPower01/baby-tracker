export default interface Baby {
  id: string;
  name: string;
  sex: string;
  birthDate: Date;
  parents: string[];
  birthWeight?: number;
  birthSize?: number;
  birthHeadCircumference?: number;
  avatar?: string;
}