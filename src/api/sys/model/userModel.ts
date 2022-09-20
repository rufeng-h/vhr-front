/**
 * @description: Login interface parameters
 */
export interface LoginParams {
  email?: string;
  code?: string;
  phone?: string;
  password?: string;
  userType: string;
  loginType: LoginType;
}

export interface RoleInfo {
  roleName: string;
  value: string;
}

export enum LoginType {
  EmailPwd = 1,
  EmailCode = 2,
  Phone = 3,
}

/**
 * @description: Login interface return value
 */
export interface LoginResultModel {
  userId: string | number;
  token: string;
  role: RoleInfo;
}

/**
 * @description: Get user information return value
 */
export interface GetUserInfoModel {
  roles: RoleInfo[];
  // 用户id
  userId: string | number;
  // 用户名
  username: string;
  // 头像
  avatar: string;
  // 介绍
  desc?: string;
}

export interface SendEmailCodeForm {
  email: string;
  userType: string;
}

export interface RegisterForm {
  username: string;
  password: string;
  email: string;
  phone: string;
  idCard: string;
  emailCode: string;
}
