// ChatScreen.js
import React, { useState, useEffect, useContext, useRef, useMemo } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  StyleSheet,
  Dimensions,
  ScrollView,
  Platform,
  Alert,
  TouchableOpacity,
  Image,
  Modal,
  Keyboard,
  TouchableWithoutFeedback
} from "react-native";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import ImageViewer from "react-native-image-zoom-viewer";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import {
  Avatar,
  Appbar,
  Menu,
  Divider,
  PaperProvider,
  Card,
} from "react-native-paper";
import { Dialog, Button, Icon } from "@rneui/themed";
import { useNavigation } from "@react-navigation/native";
import UserContext from "../../../sdk/context/userContext";
import ShipContext from "../../../sdk/context/shipContext";
import axios from "axios";
import Const from "../../../sdk/const";
import CoupleUserContext from "../../../sdk/context/coupleContext";

const { width, height } = Dimensions.get("window");

const ChatScreen = ({ route }) => {
  const { user, setUser } = useContext(UserContext);
  const { coupleUser, setCoupleUser } = useContext(CoupleUserContext);
  const { meShip, taShip, setMeShip, setTaShip } = useContext(ShipContext);
  const navigation = useNavigation();
  const [messages, setMessages] = useState<{ list: any[] }>({ list: [] });
  const [menuVisible, setMenuVisible] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [myHeadImg, setMyHeadImg] = useState("");
  const [taHeadImg, setTaHeadImg] = useState("");
  const [shipText, setShipText] = useState("确认关系");
  const [modalImages, setModalImages] = useState<any>([]);
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState({ x: 0, y: 0 });
  const [input, setInput] = useState("");
  const [scrollToEnd, setScrollToEnd] = useState(false);
  const [userMatch, setUserMatch] = useState<any>({});
  const flatListRef = useRef(null);

  const [username, setUsername] = useState("");
  const [content, setContent] = useState("");
  const [inputText, setInputText] = useState("");
  const [ws, setWs] = useState<any | null>(null);


  useEffect(() => {
    // 这个是清除session的时候用
    // AsyncStorage.setItem(`user-${coupleUser["userId"]}`, "");
    AsyncStorage.getItem(`crucio-user-cp-${coupleUser["userId"]}`).then(
      (chatdata) => {
        if (chatdata != null) {
          const json = JSON.parse(chatdata);
          setMessages({ list: [...json.list] });
        }
        handleScrollToBottom();
      }
    );

    axios
      .get(
        `${Const.baseURL}/user/images/getHeadPhotoByUserId/${user["userId"]}`
      )
      .then((res) => {
        console.log("我的头像：", res.data.data);
        setMyHeadImg(res.data.data);
      });
    axios
      .get(
        `${Const.baseURL}/user/images/getHeadPhotoByUserId/${coupleUser["userId"]}`
      )
      .then((res) => {
        console.log("TA的头像：", res.data.data);
        setTaHeadImg(res.data.data);
      });
    // 获取matchStatus

    axios
      .get(`${Const.baseURL}/match/getMatchByUserID/${user["userId"]}`)
      .then((res) => {
        if (res.data.code === 400) {
          console.log("获取matchStatus：", JSON.stringify(res.data));
        }
        if (res.data.code === 200) {
          console.log("获取matchStatus结果：", JSON.stringify(res.data));
          setUserMatch(() => {
            return res.data.data;
          });
        }
      })
      .catch((err) => {
        console.log("获取matchStatus失败：", JSON.stringify(err));
        Alert.alert("获取matchStatus失败", "", [
          { text: "确定", onPress: () => console.log("OK Pressed") },
        ]);
      });
  }, []);

  useEffect(() => {
    // 创建WebSocket连接

    if (userMatch["userID1"] && userMatch["userID2"]) {
      console.log(
        "🚀 ~ file: Chat.tsx:58 ~ useEffect ~ userMatch:",
        JSON.stringify(userMatch)
      );
      console.log("🚀 ~ file: Chat.tsx:58 ~ useEffect ~ user:", user["userId"]);
      const socket = new WebSocket(
        `${Const.wsURL}/websocket/${user["userId"]}/${coupleUser["userId"]}`
      );
      setWs(socket);

      return () => {
        handleScrollToBottom();
      };
    }
  }, [userMatch["userID1"], userMatch["userID2"]]);

  useEffect(() => {
    if (ws) {
      // 设置WebSocket事件处理程序
      ws.onopen = () => {
        console.log("WebSocket connected");
      };

      ws.onmessage = (event) => {
        const datastr = event.data;
        const res = JSON.parse(datastr);
        console.log("🚀 ~ file: Chat.tsx:72 ~ socket.onmessage= ~ res:", res);

        if (res.system) {
          // 处理系统消息
        } else {
          // 处理非系统消息

          const currMsg = {
            id: Date.now().toString(),
            msg: {
              type: res.type,
              content: res.message,
            },
            sender: "other",
            timestamp: new Date().toLocaleTimeString(),
          };
          let messageList = messages.list;
          // if (coupleUser["userId"] === res.fromUserId) {
          //   messageList = [...messageList, currMsg];

          // }

          AsyncStorage.getItem(`crucio-user-cp-${coupleUser["userId"]}`).then(
            (chatdata) => {
              console.log(
                "🚀 ~ file: Chat.tsx:89 ~ socket.onmessage= ~ chatdata:",
                chatdata
              );
              if (chatdata != null) {
                const json = JSON.parse(chatdata);
                console.log(
                  "🚀 ~ file: Chat.tsx:92 ~ socket.onmessage= ~ json:",
                  json
                );
                messageList = [...json.list, currMsg];
              } else {
                messageList = [...messageList, currMsg];
              }
              const str = JSON.stringify({ list: messageList });
              AsyncStorage.setItem(
                `crucio-user-cp-${coupleUser["userId"]}`,
                str
              ).then(() => {
                setMessages(() => {
                  return { list: messageList };
                });
              });
            }
          );
        }
        handleScrollToBottom();
      };

      ws.onclose = () => {
        console.log("WebSocket disconnected");
      };
      // 在组件卸载时关闭WebSocket连接
      // return () => {
      //   console.log("chat组件卸载");
      //   ws.close();
      // };
    }
  }, [ws]);

  useEffect(() => {
    if (messages.list.length > 0) {
      handleScrollToBottom();
    }
  }, [messages.list]);

  const handleScrollToBottom = () => {
    flatListRef.current?.scrollToEnd({
      animated: true,
    });
  };

  const sendMessage = async () => {
    if (inputText === "") {
      // Alert.alert("消息不能为空", "", [
      //   { text: "确定", onPress: () => console.log("OK Pressed") },
      // ]);
      console.log("消息不能为空");
      return;
    }

    const message = {
      toUserId: coupleUser["userId"],
      type: "text",
      message: inputText,
    };

    const sendMsg = {
      id: Date.now().toString(),
      msg: {
        type: "text",
        content: inputText,
      },
      sender: "me",
      timestamp: new Date().toLocaleTimeString(),
    };
    let chatdata = await AsyncStorage.getItem(
      `crucio-user-cp-${coupleUser["userId"]}`
    );
    let messageList = messages.list;
    if (chatdata != null) {
      console.log(
        "🚀 ~ file: Chat.tsx:144 ~ sendMessage ~ chatdata:",
        chatdata
      );
      const json = JSON.parse(chatdata);
      console.log("🚀 ~ file: Chat.tsx:147 ~ sendMessage ~ json:", json);
      messageList = [...json.list, sendMsg];
      // setMessages({ list: [...json.list, sendMsg] });
    } else {
      messageList = [...messageList, sendMsg];
    }

    const str = JSON.stringify({ list: messageList });
    console.log("🚀 ~ file: Chat.tsx:245 ~ sendMessage ~ str:", str);

    // setMessages(()=>{return { list: messageList }});
    AsyncStorage.setItem(`crucio-user-cp-${coupleUser["userId"]}`, str)
      .then(() => {
        ws.send(JSON.stringify(message));
        setMessages(() => {
          return { list: messageList };
        });
        setInputText("");
      })
      .then(() => {
        handleScrollToBottom();
      });
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  // useEffect(() => {

  // }, [messages.list]);

  // // 模拟从后端获取数据
  // useEffect(() => {
  //   // 模拟数据
  //   const mockData = [
  //     { id: "1", text: "你好！", sender: "other", timestamp: "10:00 AM" },
  //     { id: "2", text: "你好！", sender: "other", timestamp: "10:00 AM" },
  //     { id: "3", text: "你好！", sender: "other", timestamp: "10:00 AM" },
  //   ];
  //   setMessages({list: mockData});
  // }, []);

  useMemo(() => {
    console.log("当前双方状态", "me:", meShip, "ta:", taShip);
    if (meShip === 1 && taShip === 1) {
      setDialogVisible(false);
      setShipText("已确认关系");
    }
    if (meShip === 0 && taShip === 1) {
      setDialogVisible(true);
      setShipText("确认关系");
    }
    if (meShip === 1 && taShip === 0) {
      setDialogVisible(false);
      setShipText("等待对方确认");
    }
  }, [meShip, taShip]);

  const openMenu = () => setMenuVisible(true);

  const closeMenu = () => setMenuVisible(false);

  const toggleDialog = () => {
    setDialogVisible(!dialogVisible);
  };

  const onSave = async (url) => {
    console.log("准备保存图片...", url);
    if (Platform.OS === "android") {
      console.log("开始保存图片...");
      const storeLocation = FileSystem.documentDirectory;
      console.log("storeLocation", storeLocation);
      let pathName = new Date().getTime() + "文件名.png";
      const permission = await MediaLibrary.requestPermissionsAsync();
      if (permission.status === "granted") {
        let downloadDest = `${storeLocation}${pathName}`;
        try {
          const { uri } = await FileSystem.downloadAsync(url, downloadDest);
          await MediaLibrary.saveToLibraryAsync(uri);
          console.log("图片已保存至相册");
          Alert.alert("图片已保存至相册", "", [
            { text: "确定", onPress: () => console.log("OK Pressed") },
          ]);
        } catch (error) {
          console.log("保存失败", error);
          Alert.alert(error, "", [
            { text: "确定", onPress: () => console.log("OK Pressed") },
          ]);
        }
      }
    }
  };

  const notifyAfterCutLove = async (toId:string) => {
    let data = {"user":{"userId":toId},"message":"对方已断开匹配","theme":"cutLove"};
    const sendData = JSON.stringify(data)
    console.log("断开匹配，发送通知给对方", sendData)
    try {
      await axios.post(`${Const.baseURL}/user/sendMessageToUserOther/${toId}`,
        sendData,
        {
          headers: {
            "Content-Type": "text/plain",
          },
        }
      )
    } catch (error) {
      console.error(error)
    }
  }

  const cutLove = () => {
    console.log("准备开始断开关系，先检查当前用户：", JSON.stringify(user));
    const tempToId = coupleUser["userId"];
    if (user["userId"]) {
      axios
        .delete(`${Const.baseURL}/user/cutLove/${user["userId"]}`)
        .then((res) => {
          console.log("断开关系结果：", JSON.stringify(res.data));
          if (res.data.code === 200) {
            Alert.alert("断开成功", "", [
              { text: "确定", onPress: () => console.log("OK Pressed") },
            ]);

            setUser({ ...user, matchStatus: 0 });
            setCoupleUser({});
            const exId = coupleUser["userId"];
            console.log("lala", exId);
            navigation.navigate("Feedback", { exId: exId });
            notifyAfterCutLove(tempToId);
          } else {
            Alert.alert("断开失败", "", [
              { text: "确定", onPress: () => console.log("OK Pressed") },
            ]);
          }
        });
    }
  };

  const confirmShip = () => {
    console.log("准备开始确认关系，先检查当前用户：", JSON.stringify(user));
    if (user["userId"]) {
      axios
        .put(`${Const.baseURL}/user/confirmShip/${user["userId"]}`)
        .then((res) => {
          console.log("确认关系结果：", JSON.stringify(res.data));
          if (res.data.code === 200) {
            if (taShip === 0) {
              Alert.alert("已发送确认关系请求", "", [
                { text: "确定", onPress: () => console.log("OK Pressed") },
              ]);
            } else {
              Alert.alert("双方已确认关系", "", [
                { text: "确定", onPress: () => console.log("OK Pressed") },
              ]);
            }

            // setShip({ ...ship, "me": 1 });
            setMeShip(1);
          } else {
            Alert.alert("确认失败", "", [
              { text: "确定", onPress: () => console.log("OK Pressed") },
            ]);
          }
        });
    }
  };

  const selectImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
        allowsMultipleSelection: false, // 设置为false，只能选择一个图像文件
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const selectedFile = result.assets[0];
        const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB
        let profileImageSrc = result.assets[0].uri;
        if (selectedFile.fileSize > MAX_FILE_SIZE) {
          Alert.alert("文件大小超过限制", "", [
            { text: "确定", onPress: () => console.log("OK Pressed") },
          ]);
          return;
        }

        let formData = new FormData();

        if (Platform.OS === "android") {
          profileImageSrc = result.assets[0].uri;
        } else {
          profileImageSrc = result.assets[0].uri.replace("file://", "");
        }
        const fileName = profileImageSrc.substring(
          profileImageSrc.lastIndexOf("/") + 1
        );
        console.log("图片位置,", profileImageSrc, fileName);
        let file = {
          uri: profileImageSrc,
          type: "multipart/form-data",
          name: `${fileName}`,
        };

        formData.append("file", file);

        try {
          console.log("开始上传图片...");
          const imgUrl = await axios.post(
            `${Const.baseURL}/user/images/upload/${user["userId"]}`,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );
          console.log("上传图片结果：", JSON.stringify(imgUrl.data));
          if (imgUrl.data.code === 200) {
            console.log("上传图片成功...");
            // 这里写发送图片的逻辑
            const message = {
              toUserId: coupleUser["userId"],
              type: "image",
              message: imgUrl.data.data,
            };
            console.log(
              "🚀 ~ file: Chat.tsx:344 ~ selectImage ~ imgUrl.data.data:",
              imgUrl.data.data
            );
            const sendMsg = {
              id: Date.now().toString(),
              msg: {
                type: "image",
                content: imgUrl.data.data,
              },
              sender: "me",
              timestamp: new Date().toLocaleTimeString(),
            };
            let chatdata = await AsyncStorage.getItem(
              `crucio-user-cp-${coupleUser["userId"]}`
            );
            let messageList = messages.list;
            if (chatdata != null) {
              console.log(
                "🚀 ~ file: Chat.tsx:144 ~ sendMessage ~ chatdata:",
                chatdata
              );
              const json = JSON.parse(chatdata);
              console.log(
                "🚀 ~ file: Chat.tsx:147 ~ sendMessage ~ json:",
                json
              );
              messageList = [...json.list, sendMsg];
              // setMessages({ list: [...json.list, sendMsg] });
            } else {
              messageList = [...messageList, sendMsg];
            }
            const str = JSON.stringify({ list: messageList });
            AsyncStorage.setItem(`crucio-user-cp-${coupleUser["userId"]}`, str)
              .then(() => {
                ws.send(JSON.stringify(message));
                setMessages(() => {
                  return { list: messageList };
                });
                setInputText("");
              })
              .then(() => {
                handleScrollToBottom();
              });
          }
        } catch (error) {
          console.error(error);
          Alert.alert("因网络问题上传图片失败，可以稍后再试", "", [
            { text: "确定", onPress: () => console.log("OK Pressed") },
          ]);
        }
      }
    } catch (error) {
      console.error("选择图像时发生错误:", error);
    }
  };

  const handleImageModal = (url = "") => {
    console.log("点击了图片", url, imageModalVisible);
    if (imageModalVisible) {
      setImageModalVisible(false);
      setModalImages([]);
    } else {
      setModalImages([
        {
          url: url,
          props: {},
        },
      ]);

      setImageModalVisible(true);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
          <View style={styles.container}>
      <Appbar.Header
        style={{ backgroundColor: "#fff", justifyContent: "space-between" }}
      >
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title={coupleUser["userName"] || ""} />
        <Appbar.Action
          icon="dots-vertical"
          onPress={() => {
            setMenuVisible(!menuVisible);
          }}
        />
      </Appbar.Header>
      {menuVisible && (
        <View
          style={{
            backgroundColor: "#fff",
            borderRadius: 10,
            flexDirection: "column",
            position: "absolute",
            top: 120,
            right: 15,
            zIndex: 99,
            alignContent: "flex-start",
          }}
        >
          <Button
            title={shipText}
            onPress={() => {
              confirmShip();
            }}
            titleStyle={{ color: "#000" }}
            buttonStyle={{
              backgroundColor: "#fff",
              marginHorizontal: 10,
              borderRadius: 8,
            }}
          />
          <Divider />
          <Button
            title="断开匹配"
            onPress={() => {
              cutLove();
            }}
            titleStyle={{ color: "#000" }}
            buttonStyle={{
              backgroundColor: "#fff",
              marginHorizontal: 10,
              borderRadius: 8,
            }}
          />
        </View>
      )}
      <Modal visible={imageModalVisible} transparent={true}>
        {/* <TouchableOpacity
                    onPress={() => handleImageModal()}
                  > */}
        <ImageViewer
          imageUrls={modalImages}
          menuContext={{ saveToLocal: "保存到相册", cancel: "取消" }}
          onCancel={() => handleImageModal()}
          saveToLocalByLongPress={true}
          onSave={(url) => onSave(modalImages[0].url)}
          enableSwipeDown={true}
          onClick={() => handleImageModal()}
        />
        {/* </TouchableOpacity> */}
      </Modal>
      <View style={{ flex: 1, marginHorizontal: 3, marginBottom: 0 }}>
        <FlatList
          data={messages.list}
          extraData={scrollToEnd}
          ref={flatListRef}
          renderItem={({ item }) => (
            <View
              style={
                item.sender === "me"
                  ? styles.rightMessageContainer
                  : styles.leftMessageContainer
              }
            >
              {item.sender !== "me" && (
                <Avatar.Image size={40} source={{ uri: taHeadImg }} />
              )}
              <View style={styles.messageContainer}>
                {item.msg.type == "text" && (
                  <View
                    style={{
                      ...styles.message,
                      backgroundColor:
                        item.sender === "me" ? "#BBE8FF" : "#FFF",
                      borderRadius: 8,
                    }}
                  >
                    <Text>{item.msg.content}</Text>
                  </View>
                )}
                {item.msg.type == "image" && (
                  <TouchableOpacity
                    onPress={() => handleImageModal(item.msg.content)}
                  >
                    <Image
                      source={{ uri: item.msg.content || "" }}
                      style={styles.image}
                    />
                  </TouchableOpacity>
                )}
              </View>
              {item.sender === "me" && (
                <Avatar.Image size={40} source={{ uri: myHeadImg }} />
              )}
            </View>
          )}
          keyExtractor={(item) => item.id}
        />
        {content}
      </View>

      <Dialog
        isVisible={dialogVisible}
        onBackdropPress={toggleDialog}
        overlayStyle={{ borderRadius: 10 }}
      >
        <Dialog.Title title="确认关系请求" />
        <Text>{`对方发送了确认关系请求，是否同意？`}</Text>
        <Dialog.Actions>
          <Dialog.Button
            title="同意"
            onPress={() => {
              confirmShip();
              setDialogVisible(false);
            }}
          />
          <Dialog.Button title="拒绝" onPress={() => setDialogVisible(false)} />
        </Dialog.Actions>
      </Dialog>
      <View style={styles.inputContainer}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <TextInput
            style={styles.input}
            value={inputText}
            onChangeText={setInputText}
            placeholder=""
          />
          <Button
            title="发送"
            onPress={sendMessage}
            buttonStyle={{
              backgroundColor: "#3cade6",
              marginHorizontal: 10,
              borderRadius: 8,
            }}
          />
          <Button
            radius={999}
            type="outline"
            size={"sm"}
            buttonStyle={{
              borderColor: "grey",
            }}
            onPress={() => selectImage()}
          >
            <Icon name="add" size={18} />
          </Button>
        </View>
      </View>
    </View>
    </TouchableWithoutFeedback>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    display: "flex",
  },
  message: {
    padding: 10,
    margin: 5,
    marginBottom: 2,
    maxWidth: "100%",
  },
  image: {
    minWidth: 200,
    height: "auto", // To account for the space between
    aspectRatio: 1,
    padding: 10,
    margin: 5,
    marginBottom: 2,
    borderRadius: 8,
  },
  timestamp: {
    fontSize: 10,
    alignSelf: "flex-end",
  },
  inputContainer: {
    flexDirection: "column",
    alignItems: "center",
    // position: "absolute",
    height: 63,
    width: "100%",
    // bottom: 0,
    paddingHorizontal: 10,
    paddingVertical: 10,
    // zIndex: 99,
    backgroundColor: "#fff",
  },
  input: {
    flex: 1,
    padding: 10,
    // marginRight:10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
  },
  leftMessageContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginLeft: 5,
    marginBottom: 10,
  },
  rightMessageContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "flex-end",
    marginRight: 5,
    marginBottom: 10,
  },

  messageContainer: {
    maxWidth: "80%",
  },
});

export default ChatScreen;
