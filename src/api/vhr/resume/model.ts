import { AdvantageModel } from '../adv/model';
import { EducationModel } from '../edu/model';
import { WorkExprModel } from '../work/model';

export interface ResumeModel {
  rsId: number;
  rsName: string;
  rsCandId: number;
  rsCreated: string;
  rsModified: string;
  rsDesc: string;
  rsDefault: boolean;
  rsPublic: boolean;
}

export interface ResumeInfo extends ResumeModel {
  adv?: AdvantageModel;
  edus: EducationModel[];
  workExprs: WorkExprModel[];
}
