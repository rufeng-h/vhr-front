import { UpdateCandEmailForm } from './model';
import { defHttp } from '/@/utils/http/axios';

enum Api {
  Base = '/api/cand',
  UpdateEmail = '/api/cand/email',
}

export function updateCandEmail(data: UpdateCandEmailForm) {
  return defHttp.put<boolean>({ url: Api.UpdateEmail, data });
}
