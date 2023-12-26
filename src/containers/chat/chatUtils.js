import {TencentImSDKPlugin, LogLevelEnum} from 'react-native-tim-js';

// 测试APPId:1600013312
export const initChatSDK = APPId => {
  // 初始化腾讯云IM
  return TencentImSDKPlugin.v2TIMManager
    .initSDK(
      APPId, // Replace 0 with the SDKAppID of your IM application when integrating
      LogLevelEnum.V2TIM_LOG_DEBUG, // Log
      {
        onConnecting: () => {
          console.log('连接中...');
        },
        onConnectSuccess: () => {
          console.log('连接成功！！！');
        },
        onConnectFailed: res => {
          console.log('连接失败！！！', res);
        },
        onKickedOffline: () => {
          console.log('链接中断！！！');
        },
        onUserSigExpired: () => {
          console.log('用户签名过期！！！');
        },
        onSelfInfoUpdated: res => {
          console.log('用户信息更新！！！', res);
        },
        onUserStatusChanged: res => {
          console.log('用户状态更新！！！', res);
        },
      },
      true,
    )
    .then(res => res);
};

// 用户2: user02   eJwtzFELgjAYheH-sttCPpebKXQxSJCoQAyiy2QzPmMxNy0j*u8t9fI8L5wPOe3L4KksSQkNgCzHjVI9Oqxx5N4pC3QuTt6vxqAkacgBIKRJFE9FDQat8s4Yoz5N2qH*WwwQcb7m4fyCN3-8bnvmmmorzrosVvWw0Mkhv*xsRnV7lFHz4lknmioXotiQ7w9LnDGe
// 用户1: user01   eJwtzL0OgjAYheF76WzIR6UFSRwYdNGoKMbZ2FY--KulII3x3q3AeJ43OR9SLHdBIw1JCQ2AjLqNQj4sKuy4rqSBcCiVuB61RkHSkANASCdR3BfZajTSO2OM*tSrxfvfYoCIU8b58IJnf7xqL8qdNhnIUizW27y4Pd98jG5fu3LmeNJkViVziodXPiXfH1dFMko_
export const userLogin = (userId, userSig) => {
  // 用户登录，用户签名由后端实时生成，前端通过接口去获取
  return TencentImSDKPlugin.v2TIMManager.login(String(userId), userSig).then(res => {
    if (res.code === 0) {
      console.log(`用户${userId}登录成功！！！`);
    } else {
      console.log(`用户${userId}登录失败:`, res.data);
    }
    return res;
  });
};

export const sendMessageToReceiver = (text, receiverId) => {
  //发送消息
  return TencentImSDKPlugin.v2TIMManager
    .getMessageManager()
    .createTextMessage(text)
    .then(res => {
      const id = res?.data?.id; // The message creation ID
      return TencentImSDKPlugin.v2TIMManager
        .getMessageManager()
        .sendMessage({
          id, // Pass in the message creation ID to
          receiver: receiverId,
        })
        .then(result => {
          if (result.code === 0) {
            console.log('消息发送成功！！！');
          } else {
            console.log('消息发送失败！！！');
          }
          return result;
        });
    });
};

export const setUserInfo = (params) => {
  return TencentImSDKPlugin.v2TIMManager
    .setSelfInfo({
      userID: params.userID,
      nickName: params.nickName,
      faceUrl: params.faceUrl,
      selfSignature: params.selfSignature,
      gender: params.gender,
      allowType: params.allowType,
      customInfo: params.customInfo,
      role: params.role,
      level: params.level,
      birthday: params.birthday,
    })
    .then((res) => res);
};
