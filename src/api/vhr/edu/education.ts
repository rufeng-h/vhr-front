import { InsertOrUpdateEduForm } from './model';
import { defHttp } from '/@/utils/http/axios';

export function addEducation(data: InsertOrUpdateEduForm) {
  return defHttp.post({ url: '/api/edu', data });
}

export function updateEducation(data: InsertOrUpdateEduForm) {
  return defHttp.put({ url: '/api/edu', data });
}

export function delEducation(id: number) {
  return defHttp.delete({ url: `/api/edu/${id}` });
}
