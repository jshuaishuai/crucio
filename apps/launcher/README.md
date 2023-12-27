## 腾讯云IM对接
1、初始化腾讯云IM
  在APP.jsx文件中，调用initChatSDK方法，初始化腾讯云SDK；
2、注册腾讯云用户
  初始化腾讯云SDK后，调用/tencent/genUserSig接口获取用户的秘钥，该接口的传参是userId，如果已经在腾讯云注册过的用户调用该接口直接返回用户秘钥，如果是未注册的用户调用该接口腾讯云会自动注册一个新用户，并返回用户秘钥；
3、登录腾讯云IM
  获取到用户秘钥后，调用userLogin方法登录腾讯云IM，参数是userId及上一步/tencent/genUserSig接口中返回的用户秘钥；
4、设置用户信息
  用户登录腾讯云IM成功后，调用setUserInfo方法给用户设置图像和用户昵称，用于聊天页面显示；
5、匹配成功跳转聊天页面
  跳转聊天页面有2个入口，一个是匹配成功首页会弹窗提醒用户，点击弹窗确定按钮会自动跳转聊天页面；另外一个入口是首页匹配成功后点击右下角的聊天按钮跳转聊天页面；
  跳转方法如下：
  const convID = String(taId); // 匹配对象的userId
  navigation.navigate("Chat2", {
    conversation: {
      conversationID: `c2c_${convID}`,
      showName: res.data.data['userName'], // 匹配对象的用户昵称
      userID: convID,
      groupID: "",
    },
    userID: String(meId), // 登录用户的userId
    initialMessageList: [],
    unMount: (message: V2TimMessage[]) => {},
  });
  6、聊天页面ChatScreen引用的TUIChat组件是腾讯云封装好的UI库，对应文件夹TUIKit，不需要我们开发，chatUtils.js文件封装了腾讯云的一些方法，方便开发者调用；
 
 ## 极光推送对接
 1、初始化激光SDK
  在APP.jsx文件中引用Notification组件，组件中调用JPush.init进行初始化；
2、登录用户绑定设备
  Notification组件中调用/user/bindDevice接口进行用户绑定设备，传参是userId、deviceId（第一步初始化极光SDK时会自动返回一个registerID）及clientType（0表示安卓，1表示ios）；
3、后端根据业务需求给用户推送消息，通过登录用户的userId找到deviceId，然后给deviceId推送消息，用户就会收到推送消息；
