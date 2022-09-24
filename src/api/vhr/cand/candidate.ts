import { UpdateCandEmailForm, UpdateCandInfoForm } from './model';
import { defHttp } from '/@/utils/http/axios';

enum Api {
  Base = '/api/cand',
  UpdateEmail = '/api/cand/email',
  UploadAvatar = '/api/cand/uploadAvatar',
}

export function updateCandEmail(data: UpdateCandEmailForm) {
  return defHttp.put<boolean>({ url: Api.UpdateEmail, data });
}

export function updateCandInfo(data: UpdateCandInfoForm) {
  return defHttp.put<boolean>({ url: Api.Base, data });
}

export function uploadCandAvatar({ file, name, filename }) {
  return defHttp.uploadFile<string>(
    { url: Api.UploadAvatar },
    { file, name, filename },
    { errorMessageMode: 'message' },
  );
}
