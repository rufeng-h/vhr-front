import { InsertOrUpdateAdvForm } from './model';
import { defHttp } from '/@/utils/http/axios';
enum Api {
  Base = '/api/adv',
}
export function addAdvantage(data: InsertOrUpdateAdvForm) {
  return defHttp.post({ url: Api.Base, data });
}

export function updateAdvantage(data: InsertOrUpdateAdvForm) {
  return defHttp.put<boolean>({ url: Api.Base, data });
}
