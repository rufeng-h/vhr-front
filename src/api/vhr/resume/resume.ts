import { defHttp } from '/@/utils/http/axios';
enum Api {
  Base = '/api/resume',
}
export function listResume(candId: number) {
  return defHttp.get({ url: Api.Base, params: { candId } });
}

export function getResume(rsId: number) {
  return defHttp.get({ url: Api.Base + `/${rsId}` });
}
