export interface StudentCreateDTO {
  id: number | null;
  name: string;
  ci: string;
  fatherLastname: string;
  motherLastname: string;
  birthDate: Date;
  address: string;
  rude: string;
  email: string;
  classId: number;
  parentId: number[];
}
