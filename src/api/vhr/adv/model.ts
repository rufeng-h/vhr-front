export interface AdvantageModel {
  advId: number;
  advContent: string;
  advCreated: string;
  advModified: string;
}

export interface InsertOrUpdateAdvForm {
  advCandId?: number;
  advId?: number;
  advContent: string;
  advRsId?: number;
}
