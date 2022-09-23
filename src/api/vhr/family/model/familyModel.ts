export interface Family {
  fmId: number;
  fmCandId: number;
  fmRelation: string;
  fmName: string;
  fmCompany: string;
  fmPosition: string;
  fmCreated: string;
}

// export type InsertOrUpdateFamilyForm = Partial<Omit<Family, 'fmCreated'>>;
export interface InsertOrUpdateFamilyForm {
  fmId?: number;
  fmCandId: number;
  fmRelation: string;
  fmName: string;
  fmCompany: string;
  fmPosition: string;
}
