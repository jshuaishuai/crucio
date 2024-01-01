import React, {useContext, useEffect, useMemo, useState} from 'react';
import {TUIChat} from '../../containers/TUIKit';
import { Alert, Text, View } from 'react-native';
import { Dialog, Button } from "@rneui/themed";
import { Divider } from 'react-native-paper';
import ShipContext from '../../sdk/context/shipContext';
import Const from '../../sdk/const';
import UserContext from '../../sdk/context/userContext';
import CoupleUserContext from '../../sdk/context/coupleContext';
import axios from "axios";

const ChatScreen = ({navigation, route}) => {
  const {conversation, userID, unMount, initialMessageList} = route.params;
  console.log('%c [ userID ]-14', 'font-size:13px; background:pink; color:#bf2c9f;', userID)
  const { user, setUser } = useContext(UserContext);
  const { coupleUser, setCoupleUser } = useContext(CoupleUserContext);
  const [menuVisible, setMenuVisible] = useState(false);
  const [shipText, setShipText] = useState("确认关系");
  const [dialogVisible, setDialogVisible] = useState(false);
  const { meShip, taShip, setMeShip, setTaShip } = useContext(ShipContext);

  useEffect(() => {
    navigation.setOptions({
      title: conversation?.showName ?? "",
      headerBackTitleVisible: false,
      headerStyle: {
        backgroundColor: "#EDEDED",
      },
      headerRight: () => {
        return (
          <Button
            title="编辑"
            onPress={() => {
              // console.log("menuVisible===", menuVisible);
              setMenuVisible(!menuVisible);
            }}
            type="clear"
            titleStyle={{ color: "rgba(78, 116, 289, 1)" }}
          />
        );
      },
    });
  }, [conversation?.showName, navigation, menuVisible]);

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

  const toggleDialog = () => {
    setDialogVisible(!dialogVisible);
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

  const notifyAfterCutLove = async (toId: string) => {
    let data = {
      user: { userId: toId },
      message: "对方已断开匹配",
      theme: "cutLove",
    };
    const sendData = JSON.stringify(data);
    console.log("断开匹配，发送通知给对方", sendData);
    try {
      await axios.post(
        `${Const.baseURL}/user/sendMessageToUserOther/${toId}`,
        sendData,
        {
          headers: {
            "Content-Type": "text/plain",
          },
        }
      );
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <TUIChat
        conversation={conversation}
        loginUserID={userID}
        showChatHeader={false}
        unMount={unMount}
        initialMessageList={initialMessageList}
        onMergeMessageTap={() => {}}
      />
      {menuVisible && (
        <View
          style={{
            backgroundColor: "#fff",
            borderRadius: 10,
            flexDirection: "column",
            position: "absolute",
            top: 0,
            right: 0,
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
    </View>
  );
};

export default ChatScreen;
