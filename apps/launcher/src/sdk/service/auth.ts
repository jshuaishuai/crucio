import { userApi } from "../api";

export class AuthService {
  // setToken(token: string) {
  //   localStorage.setItem('token', token)
  // }

  /**
   * 注册
   * @param params \
   * @returns
   */
  async register(params: userApi.User.RegisterParams, temp: string) {
    try {
      const data = await userApi.postRegisterApi(params, temp);
      // if (data.payload?.token) {
      //   // 将token存储到本地
      //   // this.setToken(data.payload.token)
      //   // MessagePlugin.success('注册成功！')
      // }
      return data
    } catch (error) {}
  }

  /**
   * 接收短信验证码
   */
  async sendCode(code: string) {
    const isSendCode = await userApi.postVerifyApi(code);
    if (isSendCode) {
      console.log("验证码成功！");
    }
    return isSendCode;
  }

  /**
   * 设置用户信息
   */
  async setUser(params: userApi.User.UserSetParams) {
    const res = await userApi.postUserSet(params);
    if (res) {
      console.log("用户信息设置成功！");
    }
    return res;
  }


}
