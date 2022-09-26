export interface InsertOrUpdateEduForm {
  eduId?: number;
  eduEducation: string;
  eduSchool: string;
  eduMajor: string;
  eduMajorDesc: string;
  eduStartDate: string;
  eduEndDate: string;
  eduRsId?: number;
}

export interface EducationModel {
  eduId: number;
  eduSchool: string;
  eduEducation: string;
  eduMajor: string;
  eduMajorDesc: string;
  eduStartDate: string;
  eduEndDate?: string;
  eduRsId: number;
  eduCandId: number;
  eduCreated: string;
  eduModified: string;
}
