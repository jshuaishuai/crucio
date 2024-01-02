import { useEffect, useState } from 'react';
import { TencentImSDKPlugin, V2TimUserFullInfo } from 'react-native-tim-js';

export const useLoginUser = (loginUserID: string) => {
  console.log('%c [ loginUserID ]-5', 'font-size:13px; background:pink; color:#bf2c9f;', loginUserID)
  const [userInfo, setUserInfo] = useState<V2TimUserFullInfo>();
  useEffect(() => {
    TencentImSDKPlugin.v2TIMManager
      .getUsersInfo([loginUserID])
      .then((response) => {
        const { code, data } = response;
        if (code === 0 && data) {
          setUserInfo(data[0]);
        }
      });
  }, [loginUserID]);
  return userInfo;
};
