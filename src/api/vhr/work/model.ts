export interface InsertOrUpdateWorkForm {
  workId?: number;
  workComp: string;
  workInd: string;
  workStart: string;
  workEnd: string;
  workCompSize: string;
  workPosition: string;
  workDesc: string;
  workRsId?: number;
  workCompType: string;
}

export interface WorkExprModel {
  workId: number;
  workComp: string;
  workInd: string;
  workStart: string;
  workEnd: string;
  workCompSize: string;
  workPosition: string;
  workDesc: string;
  workCreated: string;
  workModified: string;
  workRsId: number;
  workCompType: string;
}
