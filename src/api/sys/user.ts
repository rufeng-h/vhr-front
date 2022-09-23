import { defHttp } from '/@/utils/http/axios';
import {
  LoginParams,
  LoginResultModel,
  GetUserInfoModel,
  LoginType,
  SendEmailCodeForm,
  RegisterForm,
  CandPwdModifyForm,
} from './model/userModel';

import { ErrorMessageMode } from '/#/axios';

enum Api {
  LoginByEmailPwd = '/login/email',
  LoginByEmailCode = '/login/emailCode',
  LoginByPhone = '/login/phone',
  Logout = '/logout',
  ValidateEmail = '/validate',
  SendEmailCode = '/emailCode',
  Register = '/register',

  ModifyPwd = '/api/cand/pwd',
  UpdateCand = '/api/cand',

  GetUserInfo = '/getUserInfo',
  GetPermCode = '/getPermCode',
  TestRetry = '/testRetry',
}

/**
 * @description: user login api
 */
export function loginApi(params: LoginParams, mode: ErrorMessageMode = 'modal') {
  let url = '';
  switch (params.loginType) {
    case LoginType.EmailPwd:
      url = Api.LoginByEmailPwd;
      break;
    case LoginType.EmailCode:
      url = Api.LoginByEmailCode;
      break;
    case LoginType.Phone:
      url = Api.LoginByPhone;
      break;
  }
  return defHttp.post<LoginResultModel>(
    {
      url,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}

/**
 * @description: getUserInfo
 */
export function getUserInfo() {
  return defHttp.get<GetUserInfoModel>({ url: Api.GetUserInfo }, { errorMessageMode: 'none' });
}

export function getPermCode() {
  return defHttp.get<string[]>({ url: Api.GetPermCode });
}

export function doLogout() {
  return defHttp.get({ url: Api.Logout });
}

export function testRetry() {
  return defHttp.get(
    { url: Api.TestRetry },
    {
      retryRequest: {
        isOpenRetry: true,
        count: 5,
        waitTime: 1000,
      },
    },
  );
}

export function sendEmailCode(data: SendEmailCodeForm) {
  return defHttp.post({
    url: Api.SendEmailCode,
    data,
  });
}

export function validateEmail(email: string) {
  return defHttp.get({ url: Api.ValidateEmail + `/${email}` });
}

export function register(data: RegisterForm) {
  return defHttp.post({ url: Api.Register, data });
}

export function updateCandidate(data) {
  return defHttp.put({ url: Api.UpdateCand, data });
}

export function updatePwd(data: CandPwdModifyForm) {
  return defHttp.put({ url: Api.ModifyPwd, data });
}

export function uploadAvatar() {}
