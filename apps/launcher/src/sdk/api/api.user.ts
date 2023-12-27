import axios from "./axios";
export namespace User {
  // 注册用户传入参数
  export interface RegisterParams {
    userName: string;
    phone: number;
    password?: string;
    photo?: any;
    identity?: string;
    gender?: number;
    age?: number;
    address?: string;
    height?: number;
    education?: number;
    sex?: number;
    beauty?: number;
    isAuthed?: number;
    isLogged?: number;
    matchStatus?: number;
    isTested?: number;
  }

  // 注册用户验证参数
  export interface VerifyParams {
    Phone: string;
  }

  // 注册用户首次传信息传入参数
  export interface UserSetParams {
    userName: string;
    phone: number;
    password: string;
    photo: any;
    identity: string;
    gender: number;
    age: number;
    address: string;
    height: number;
    education: number;
    sex: number;
    beauty: number;
    isAuthed: number;
    isLogged: number;
    matchStatus: number;
    isTested: number;
  }

  // 注册登录用户返回参数
  export interface RegisterResponse {}

  // 获取验证码返回参数
  export interface VerifyResponse {}

  // 更新用户信息返回参数
  export interface UserSetResponse {
    status: number;
    message: string;
    error: string;
    payload: string;
  }
}

// 注册用户 {{url}}/api/user/Register
export const postRegisterApi = (params: User.RegisterParams, temp: string) => {
  return axios.post<User.RegisterResponse>(
    `/user/Register/userRegisterVerify/${temp}`,
    params
  );
};

// 验证码 {{url}}/api/verify
export const postVerifyApi = (phone: string) => {
  return axios.post<User.VerifyResponse>(
    `/user/Register/userRegisterSendSMS/${phone}`
  );
};

// 注册用户首次完善信息 {{url}}/api/user/Register
export const postUserSet = (params: User.UserSetParams) => {
  return axios.post<User.UserSetResponse>(`/user/Register/userSet`, params);
};
