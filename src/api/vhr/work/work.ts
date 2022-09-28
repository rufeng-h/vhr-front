import { InsertOrUpdateWorkForm } from './model';
import { defHttp } from '/@/utils/http/axios';

enum Api {
  Base = '/api/work',
}
export function addWorkExpr(data: InsertOrUpdateWorkForm) {
  return defHttp.post({ url: Api.Base, data });
}

export function updateWorkExpr(data: InsertOrUpdateWorkForm) {
  return defHttp.put({ url: Api.Base, data });
}

export function delWorkExpr(id: number) {
  return defHttp.delete({ url: `${Api.Base}/${id}` });
}
