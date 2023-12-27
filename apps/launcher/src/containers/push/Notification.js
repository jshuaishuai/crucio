import { useCallback, useEffect, useRef, useState } from 'react';
import { Platform, AppState } from 'react-native';
import JPush from 'jpush-react-native';
import axios from "axios";
import Const from "../../../src/sdk/const";

type Props = {
  userId: String,
};

const Notification = (props: Props) => {
  const { userId } = props;
  const appState = useRef(AppState.currentState);
  const [registerId, setRegisterlId] = useState();

  // 获取deviceToken
  const getRegistrationID = useCallback(() => {
    JPush.getRegistrationID(({ registerID }) => {
      setRegisterlId(registerID);
    });
  }, []);

  // 远程消息回调
  const notificationCallback = useCallback((result) => {
    // 点击通知栏消息时跳转消息中心页面
    if (result.notificationEventType === "notificationOpened") {
      console.log("点击消息===");
    }
  }, []);

  useEffect(() => {
    JPush.setLoggerEnable(true);
    // 初始化
    JPush.init({
      appKey: "ebae1fea7f785ba3d5ff8869",
      channel: "developer-default",
      production: 0, // 开发环境0，生产环境1
    });

    // 获取deviceToken
    getRegistrationID();

    // 连接极光推送服务监听
    JPush.addConnectEventListener(({ connectEnable }) => {
      if (connectEnable) {
        getRegistrationID();
      }
    });

    // 接收极光推送消息监听
    JPush.addNotificationListener(notificationCallback);

    // 监听app状态
    AppState.addEventListener("change", (nextAppState) => {
      console.log("AppState changed:", appState, nextAppState);
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        JPush.setBadge({ badge: 0, appBadge: 0 });
      }
      appState.current = nextAppState;
    });
  }, [getRegistrationID, notificationCallback]);

  useEffect(() => {
    // 登录用户绑定app的registerId
    if (userId && registerId) {
      console.log("开始绑定用户id===", userId, registerId);
      axios
        .post(`${Const.baseURL}/user/bindDevice`, {
          userId,
          deviceId: registerId,
          clientType: Platform.OS === "android" ? 0 : 1, // 0-安卓 1-ios
        })
        .then((response) => {
          const data = response?.data;
          console.log("绑定用户结果：", data);
          if (data.code === 200) {
            console.log("[极光]请求成功");
          } else {
            console.log("[极光]请求失败", data?.msg);
          }
        })
        .catch((e) => console.log("绑定用户设备错误===", e));;
    }
  }, [userId, registerId]);

  return null;
};

export default Notification;
