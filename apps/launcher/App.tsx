import React, { createContext, useContext, useEffect, useState } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import { V2TimMessage } from "react-native-tim-js";

import { FontAwesome, Ionicons, Entypo, AntDesign } from "@expo/vector-icons";
import UserContext from "./src/sdk/context/userContext";
import CoupleUserContext from "./src/sdk/context/coupleContext";
import PreferenceContext from "./src/sdk/context/preferenceContext";
import PreferenceFoundationContext from "./src/sdk/context/preferenceFoundationContext";
import MetricsContext from "./src/sdk/context/metricsContext";
import UserBlogContext from "./src/sdk/context/blogContext";
import ShipContext from "./src/sdk/context/shipContext";
import Match from "./src/components/Match/Match";
import MYInfo from "./src/components/MYInfo/MYInfo";
import ProfileEdit from "./src/components/MYInfo/ProfileEdit/ProfileEdit";
import AccountAndSecurity from "./src/components/MYInfo/AccountAndSecurity/AccountAndSecurity";
import { NavigationContainer } from "@react-navigation/native";
import LoginByCode from "./src/components/Login/LoginByCode";
import Login from "./src/components/Login/Login";
import RegisterByCode from "./src/components/Register/RegisterByCode";
import Register from "./src/components/Register/Register";
import TAInfo from "./src/components/TAInfo/TAInfo";
import Feedback from "./src/components/TAInfo/Feedback/Feedback";
import PersonalityTest from "./src/components/MYInfo/ProfileEdit/PersonalityTest/PersonalityTest";
import PreferenceBasic from "./src/components/Match/UserPreference/PreferenceTest/PreferenceBasic";
import PreferenceComplex from "./src/components/Match/UserPreference/PreferenceTest/PreferenceComplex";
// import ChatScreen from "./src/components/TAInfo/Chat/Chat";
import RegisterProfile from "./src/components/Register/RegisterProfile";
import axios from "axios";
import Const from "./src/sdk/const";
import setAuthToken from "./src/sdk/utils/authToken";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert, AppState, Platform } from "react-native";
import "./config"
import EditingCard from "./src/components/MYInfo/EditableCard/EditingCard";
import * as Updates from 'expo-updates';
import ChatScreen2 from "./src/containers/chat/ChatScreen";
import Notification from "./src/containers/push/Notification";
import { initChatSDK, setUserInfo, userLogin } from "./src/containers/chat/chatUtils";
import { GestureHandlerRootView } from 'react-native-gesture-handler';



const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function tabBarIcon(name) {
  return ({ color, size }) => (
    <FontAwesome name={name} color={color} size={size} />
  );
}

function BottomTabs() {
  const { user, setUser } = useContext(UserContext);
  const { coupleUser, setCoupleUser } = useContext(CoupleUserContext);
  const { meShip, taShip, setMeShip, setTaShip } = useContext(ShipContext);
  // const [hasMatch, setHasMatch] = useState(false);
  const size = 24;
  const color = "gray";

  useEffect(() => {
    console.log("首次进入---开始查找是否有匹配用户...", user);
    axios
      .get(`${Const.baseURL}/user/determineToMatchPages/${user["userId"]}`)
      .then((res) => {
        console.log("开始获取TA的信息", res.data);
        if (res.data.data) {
          // setHasMatch(true);
          setCoupleUser({ ...res.data.data });
          console.log(JSON.stringify(res.data.data));
          let taId = res.data.data["userId"];
          let meId = user["userId"];
          console.log("开始检查我的「确认关系」状态...");
          axios
            .get(`${Const.baseURL}/match/oppositePartyStatus/${taId}`)
            .then((res) => {
              console.log("我是否想确认关系：", res.data.data);
              if (res.data.data == true) {
                // setShip({ ...ship, "me": 1 });
                setMeShip(1);
              } else {
                setMeShip(0);
                // setShip({ ...ship, "me": 0 });
              }
              axios
                .get(`${Const.baseURL}/match/oppositePartyStatus/${meId}`)
                .then((res) => {
                  console.log("TA是否想确认关系：", res.data.data);
                  if (res.data.data == true) {
                    // setShip({ ...ship, "ta": 1 });
                    setTaShip(1);
                  } else {
                    // setShip({ ...ship, "ta": 0 });
                    setTaShip(0);
                  }
                })
                .catch((err) => {
                  console.log(err);
                });
            })
            .catch((err) => {
              console.log(err);
            });
        } else {
          setCoupleUser({});
          // setHasMatch(false);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    if (taShip === 1 && meShip === 1) {
      console.log("双方想确认关系");
    } else if (taShip === 1 && meShip === 0) {
      console.log("他确认关系");
    } else if (taShip === 0 && meShip === 1) {
      console.log("你想确认关系");
    } else if (taShip === 0 && meShip === 0) {
      console.log("无关系");
    }
  }, [taShip, meShip]);

  return (
    <>
      {user["isLogged"] == 1 ? (
        <Tab.Navigator
          initialRouteName="匹配"
          tabBarOptions={{
            activeTintColor: "#1DA1F2",
          }}
          screenOptions={{
            unmountOnBlur: true
          }}
        >
          <Tab.Screen
            name="TA"
            component={TAInfo}
            options={{
              tabBarIcon: () => (
                // <Ionicons name="meh" size={size} color={color} />
                <AntDesign name="meh" size={size} color={color} />
              ),
            }}
          />
          <Tab.Screen
            name="匹配"
            component={Match}
            options={{
              tabBarIcon: () => (
                <Entypo name="circle" size={size} color={color} />
              ),
              headerShown: coupleUser["userId"] ? false : true,
            }}
          />

          <Tab.Screen
            name="我"
            component={MYInfo}
            options={{
              tabBarIcon: () => (
                <Ionicons name="person" size={size} color={color} />
              ),
            }}
          />
        </Tab.Navigator>
      ) : (
        <Stack.Navigator
          initialRouteName={Login}
          // initialRouteName={user["isLogged"] == 1 ? BottomTabs : Login}
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="Login" component={Login} />

          <Stack.Screen name="Register" component={Register} />
          <Stack.Screen name="LoginByCode" component={LoginByCode} />
          <Stack.Screen name="RegisterByCode" component={RegisterByCode} />
          <Stack.Screen name="RegisterProfile" component={RegisterProfile} />
        </Stack.Navigator>
      )}
    </>
  );
}

function MainPage() {
  const { user, setUser } = useContext(UserContext);
  const { coupleUser, setCoupleUser } = useContext(CoupleUserContext);
  const [systemWs, setSystemWs] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    // 监听AppState的状态变化
    // const handleAppStateChange = (nextAppState) => {
    //   console.log('AppState changed:', nextAppState);
    // };


    // AppState.addEventListener('change', handleAppStateChange);
    AsyncStorage.getItem("crucio-user")
      .then((res) => {
        if (res) {
          console.log(
            "🚀 ~ file: App.jsx:60 ~ AsyncStorage.getItem ~ res:",
            res
          );
          setUser(() => {
            return JSON.parse(res);
          });
          console.log(JSON.parse(res).token);
          AsyncStorage.getItem("crucio-user-token").then((res) => {
            if (res) {
              console.log("当前token", res);
              setAuthToken(res);
            }
          }).catch((err) => {
            console.log("获取token失败")
            console.error(err)
          });
          console.log(JSON.parse(res).isAuthed, JSON.parse(res).isLogged);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  useEffect(() => {
    if (user["isLogged"] === 1) {
      if (user["isAuthed"] === 1) {
        navigation.navigate("BottomTabs");
      } else {
        navigation.navigate("RegisterProfile");
      }
    }
  }, [user["isAuthed"], user["isLogged"]]);

  useEffect(() => {
    if (user["userId"]) {
      console.log("开始监听系统通知");
      const socket = new WebSocket(
        `${Const.wsURL}/SystemEndPoint/${user["userId"]}`
      );
      setSystemWs(socket);
    } else {
      console.log("结束监听系统通知");
    }
  }, [user["userId"]]);

  useEffect(() => {
    if (systemWs) {
      // 设置WebSocket事件处理程序
      systemWs.onopen = () => {
        console.log("System WebSocket connected");
      };

      systemWs.onmessage = (event) => {
        const datastr = event.data;
        console.log(datastr);

        // 监听信息，再调查询匹配用户的接口
        if (datastr === "已经成功为您匹配到一位适配对象") {
          Alert.alert("已匹配到新用户", "", [
            {
              text: "确定",
              onPress: () => {
                axios
                  .get(
                    `${Const.baseURL}/user/determineToMatchPages/${user["userId"]}`
                  )
                  .then((res) => {
                    console.log("开始获取TA的信息", res.data);
                    if (res.data.data) {
                      // setHasMatch(true);
                      setCoupleUser({ ...res.data.data });
                      console.log(JSON.stringify(res.data.data));
                      let taId = res.data.data["userId"];
                      let meId = user["userId"];
                      console.log("开始检查我的「确认关系」状态...");
                      axios
                        .get(
                          `${Const.baseURL}/match/oppositePartyStatus/${taId}`
                        )
                        .then((res) => {
                          console.log("我是否想确认关系：", res.data.data);
                          if (res.data.data == true) {
                            // setShip({ ...ship, "me": 1 });
                            setMeShip(1);
                          } else {
                            setMeShip(0);
                            // setShip({ ...ship, "me": 0 });
                          }
                          axios
                            .get(
                              `${Const.baseURL}/match/oppositePartyStatus/${meId}`
                            )
                            .then((res) => {
                              console.log("TA是否想确认关系：", res.data.data);
                              if (res.data.data == true) {
                                // setShip({ ...ship, "ta": 1 });
                                setTaShip(1);
                              } else {
                                // setShip({ ...ship, "ta": 0 });
                                setTaShip(0);
                              }
                            })
                            .catch((err) => {
                              console.log(err);
                            });
                        })
                        .catch((err) => {
                          console.log(err);
                        });

                      // 匹配对象成功，跳转至聊天页面
                      const convID = String(taId);
                      navigation.navigate("Chat2", {
                        conversation: {
                          conversationID: `c2c_${convID}`,
                          showName: res.data.data['userName'],
                          userID: convID,
                          groupID: "",
                          type: 1,
                        },
                        userID: String(meId),
                        initialMessageList: [],
                        unMount: (message: V2TimMessage[]) => { },
                      });
                    } else {
                      setCoupleUser({});
                      // setHasMatch(false);
                    }
                  })
                  .catch((err) => {
                    console.log(err);
                  });
              },
            },
          ]);
        } else {
          const res = JSON.parse(datastr);
          if (res["theme"] === "cutLove") {
            Alert.alert(res["message"], "", [
              {
                text: "确定",
                onPress: () => {
                  setCoupleUser({});
                  console.log("确定");
                },
              },
            ]);
          }
        }

        // if (datastr !== "已经成功为您匹配到一位适配对象") {
        //   const res = JSON.parse(datastr);
        //   if (res.system) {
        //     // 处理系统消息
        //   } else {
        //     // 处理非系统消息
        //     if (res.user) {
        //       Alert.alert("已匹配到新用户", "", [
        //         {
        //           text: "确定",
        //           onPress: () => {
        //             const id = res.user.userId;
        //             console.log("hi", id);
        //             // 根据id获取用户信息
        //             try {
        //               axios
        //                 .get(`${Const.baseURL}/user/getUserById/${id}`)
        //                 .then((res) => {
        //                   // const {...data } = res.data.data;
        //                   if (res.data["code"] === 200) {
        //                     console.log("success get couple user");
        //                     setCoupleUser({ ...res.data.data });
        //                   }
        //                   if (res.data["code"] === 400) {
        //                     console.log("fail to get couple user");
        //                   }
        //                   if (res.data["code"] === 401) {
        //                     console.log("no access to get couple user");
        //                   }
        //                 })
        //                 .catch((e) => {
        //                   console.error(e);
        //                 });
        //             } catch (error) {
        //               console.error(error);
        //             }
        //           },
        //         },
        //       ]);
        //     }
        //   }
        // }
      };

      systemWs.onclose = () => {
        console.log("System WebSocket disconnected");
      };
      // 在组件卸载时关闭WebSocket连接
      // return () => {
      //   socket.close();
      // };
    }
  }, [systemWs]);

  return (
    <Stack.Navigator
      initialRouteName={BottomTabs}
      // initialRouteName={user["isLogged"] == 1 ? BottomTabs : Login}
      screenOptions={{ headerShown: false }}
    >
      {user["isLogged"] == 1 ? (
        <>
          <Stack.Screen name="BottomTabs" component={BottomTabs} />
          <Stack.Screen name="ProfileEdit" component={ProfileEdit} />
          <Stack.Screen name="EditingCard" component={EditingCard} />
          <Stack.Screen
            name="AccountAndSecurity"
            component={AccountAndSecurity}
          />
          <Stack.Screen name="TAInfo" component={TAInfo} />
          <Stack.Screen
            name="Feedback"
            component={Feedback}
            initialParams={{ exId: null }}
          />
          {/* <Stack.Screen name="ChatScreen" component={ChatScreen} /> */}
          <Stack.Screen name="MYInfo" component={MYInfo} />
          <Stack.Screen name="Match" component={Match} />

          <Stack.Screen name="PersonalityTest" component={PersonalityTest} />

          {/* 用户偏好测试 */}
          <Stack.Screen name="PreferenceBasic" component={PreferenceBasic} />
          <Stack.Screen
            name="PreferenceComplex"
            component={PreferenceComplex}
          />

          {/* 用户注册问题 */}
          <Stack.Screen name="RegisterProfile" component={RegisterProfile} />
          {/* IM聊天页面*/}
          <Stack.Screen
            name="Chat2"
            component={ChatScreen2}
            options={{ headerShown: true }}
          />
        </>
      ) : (
        <>
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="LoginByCode" component={LoginByCode} />
          <Stack.Screen name="Register" component={Register} />
          <Stack.Screen name="RegisterByCode" component={RegisterByCode} />
        </>
      )}
    </Stack.Navigator>
  );
}
export default function App() {
  // const baseURL = `http://localhost:8080/api/`
  const [user, setUser] = useState({});
  const [coupleUser, setCoupleUser] = useState({});
  const [meShip, setMeShip] = useState(0);
  const [taShip, setTaShip] = useState(0);
  // const [user, setUser] = useState({ userId: 1 });
  const [preference, setPreference] = useState({});
  const [preferenceFoundation, setPreferenceFoundation] = useState({});
  const [metrics, setMetrics] = useState({});
  const [userBlog, setUserBlog] = useState({});

  useEffect(() => {

    async function autoFetchUpdate() {
      await Updates.fetchUpdateAsync();
      await Updates.reloadAsync();
    }
    async function onFetchUpdateAsync() {
      try {
        const update = await Updates.checkForUpdateAsync();
        if (update.isAvailable) {

          Alert.alert("新版本已发布，确认后将自动更新", "", [
            {
              text: "确定", onPress: () => {
                console.log("OK Pressed")
                autoFetchUpdate()
              }
            },
          ])
        }
      } catch (error) {
        // You can also add an alert() to see the error message in case of an error when fetching updates.
        Alert.alert("自动更新有误，请到官网下载最新版本", `${error}`, [
          { text: "确定", onPress: () => console.log("OK Pressed") },
        ]);
      }
    }
    if (Platform.OS == "android") {
      // 本地测试可以不跑
      onFetchUpdateAsync()
    }

    if (user.userId) {
      try {
        axios
          .get(`${Const.baseURL}/user/getUserById/${user["userId"]}`)
          .then((res) => {
            setUser({ ...res.data.data });
          });
      } catch (error) {
        console.error(error);
      }
    }
  }, []);

  useEffect(() => {
    // 腾讯云IM初始化
    initChatSDK(1600013312).then((res) => {
      console.log("腾讯云IM初始化结果：", res);
      // 如果用户是登录状态，先去获取腾讯云IM用户的UserSig直接登录，如果用户非登录状态，等用户登录后会重新走该方法进行IM登录
      if (user.userId) {
        try {
          axios
            .get(
              `${Const.baseURL}/tencent/genUserSig?userid=${user["userId"]}&expire=3600`
            )
            .then((res) => {
              const data = res.data;
              if (data.code === 200) {
                // 直接登录腾讯云IM;
                userLogin(user["userId"], data.data).then((result) => {
                  console.log("腾讯云IM用户登录结果：", result);
                  if (result.code === 0) {
                    // 获取用户信息
                    axios
                      .get(
                        `${Const.baseURL}/user/blog/getBlogByUserID/${user["userId"]}`
                      )
                      .then((res) => {
                        const userInfo = res.data;
                        if (userInfo) {
                          // 给用户设置昵称和头像
                          setUserInfo({
                            userID: user["userId"],
                            nickName: user["userName"],
                            faceUrl: userInfo.photo1,
                          });
                        }
                      });
                  }
                });
              } else {
                console.error(data.msg);
              }
            })
            .catch((e) => console.log("获取用户UserSig错误===", e));
        } catch (error) {
          console.error(error);
        }
      }
    });
  }, [user["userId"]]);

  // TODO: 要改初始值（空）

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <UserBlogContext.Provider value={{ userBlog, setUserBlog }}>
        <ShipContext.Provider value={{ meShip, taShip, setMeShip, setTaShip }}>
          <CoupleUserContext.Provider value={{ coupleUser, setCoupleUser }}>
            <MetricsContext.Provider value={{ metrics, setMetrics }}>
              <PreferenceFoundationContext.Provider
                value={{ preferenceFoundation, setPreferenceFoundation }}
              >
                <PreferenceContext.Provider
                  value={{ preference, setPreference }}
                >
                  {/* <GestureHandlerRootView> */}

                    <NavigationContainer>
                      <MainPage />
                      <Notification userId={user.userId} />
                    </NavigationContainer>
                  {/* </GestureHandlerRootView> */}

                </PreferenceContext.Provider>
              </PreferenceFoundationContext.Provider>
            </MetricsContext.Provider>
          </CoupleUserContext.Provider>
        </ShipContext.Provider>
      </UserBlogContext.Provider>
    </UserContext.Provider>
  );
}
