import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Modal,
  Image,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { Button } from "@rneui/themed";
import { useNavigation } from "@react-navigation/native";
import Const from "../../sdk/const";
import UserContext from "../../sdk/context/userContext";
import axios from "axios";
import CoupleUserContext from "../../sdk/context/coupleContext";

const images = [
  // Add your image URLs here
  "https://pic.imgdb.cn/item/64959b301ddac507cc18b842.jpg",
  "https://example.com/image2.png",
  "https://example.com/image3.png",
];

const MatchModeSelector = ({ mode, setMode, hideModal }) => {
  const modes = ["灵魂伴侣匹配", "普通匹配"];
  return (
    <Modal animationType="slide" transparent={true} visible={true}>
      <View style={styles.modalView}>
        {modes.map((m, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => {
              setMode(m);
              hideModal();
            }}
          >
            <Text style={mode === m ? styles.selectedMode : styles.mode}>
              {m}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </Modal>
  );
};

const MatchButton = ({ mode }) => {
  const navigation = useNavigation();
  const { user, setUser } = useContext(UserContext);
  const { coupleUser, setCoupleUser } = useContext(CoupleUserContext);
  const [matchStatus, setMatchStatus] = useState(null);

  const match = async () => {
    try {
      console.log("开始匹配...");
      // console.log(user["userId"]);
      const res = await axios.get(
        `${Const.baseURL}/user/getUserMatch/${user["userId"]}`
      );

      //跳转登录页面
      if (res.data.code === 401) {
        setUser({});
        navigation.navigate("Login");
        return;
      }

      if (res.data.code === 400) {
        Alert.alert(res.data.msg, "", [
          { text: "确定", onPress: () => console.log("OK Pressed") },
        ]);
        return;
      }

      console.log(JSON.stringify(res.data));
      setCoupleUser({ ...res.data.data });
      let data = { user: { userId: res.data.data["userId"] } };
      // 给对方发送消息
      console.log("开始给对方发消息", res.data.data["userId"]);
      // axios({
      //   method: "get",
      //   url: `${Const.baseURL}/user/sendMessageToUserOther/${res.data.data["userId"]}?param=${JSON.stringify(data)}`,
      //   // headers: {
      //   //   "Content-Type": "text/plain",
      //   // },
      //   // data: JSON.stringify(data)
      // }).then((res)=>{
      //   console.log(res)
      // }).catch((e)=>{
      //   console.log("发送失败", `${Const.baseURL}/user/sendMessageToUserOther/${res.data.data["userId"]}`, JSON.stringify(data))
      //   console.error(e)
      // })
      // navigation.navigate("ChatScreen");
    } catch (error) {
      console.error(error);
      Alert.alert(`目前还没有找到合适的对象，正在努力寻找...`, "", [
        { text: "确定", onPress: () => console.log("OK Pressed") },
      ]);
    }
  };

  const handleMatchStatus = async (status) => {
    if(status === 1){
      const res = await axios.put(
        `${Const.baseURL}/user/updateUserMatchChoiceAuto/${user["userId"]}`
      );
      if(res.data.code === 200){
        console.log("开启匹配成功")
        Alert.alert("将会在后台持续为你匹配，匹配成功将会通过邮箱联系你。", "", [
          { text: "确定", onPress: () => console.log("OK Pressed") },
        ]);
      }
      if(res.data.code === 400){
        Alert.alert(res.data.msg, "", [
          { text: "确定", onPress: () => console.log("OK Pressed") },
        ]);
        return
      }
      // if(res.data.code === 401){
      //   setUser({});
      //   navigation.navigate("Login");
      //   return
      // }
    }else if(status === 0){
      const res = await axios.put(
        `${Const.baseURL}/user/updateUserMatchChoiceStop/${user["userId"]}`
      );
      if(res.data.code === 200){
        console.log("断开匹配成功")
      }
      if(res.data.code === 400){
        Alert.alert(res.data.msg, "", [
          { text: "确定", onPress: () => console.log("OK Pressed") },
        ]);
        return
      }
      if(res.data.code === 401){
        setUser({});
        navigation.navigate("Login");
        return
      }
    }
    setMatchStatus(status);
  }

  useEffect(() => {
    try {
      async function getMatchStatus (){
        console.log("开始请求getUserMatchStatus", user["userId"])
        const res = await axios.get(
          `${Const.baseURL}/user/getUserMatchChoice/${user["userId"]}`
        );
        console.log("getUserMatchStatus的结果", JSON.stringify(res.data))
        if(res.data.code === 200){
          setMatchStatus(res.data.data);
        }
        if(res.data.code === 400){
          Alert.alert(res.data.msg, "", [
            { text: "确定", onPress: () => console.log("OK Pressed") },
          ]);
          return
        }
        if(res.data.code === 401){
          setUser({});
          navigation.navigate("Login");
          return
        }
      }
      getMatchStatus();
    } catch (error) {
      console.error(error);
    }
  },[])

  return (
    <View style={styles.matchSwitchFatherContainer}>
      <View style={styles.matchSwitchTitleContainer}>
        <Text style={styles.matchSwitchTitle}>匹配状态</Text>
      </View>
<View style={styles.matchSwitchContainer}>
      {/* <TouchableOpacity style={styles.matchButton} onPress={match}>
        <Text style={styles.buttonText}>开始匹配</Text>
      </TouchableOpacity> */}
      <TouchableOpacity style={{...styles.matchSwitch, backgroundColor: matchStatus === 1 ? "#b4dcfc" : "transparent"}} onPress={()=>handleMatchStatus(1)}>
        <Text style={styles.matchSwitchText}>开启匹配</Text>
      </TouchableOpacity>
      <TouchableOpacity style={{...styles.matchSwitch, backgroundColor: matchStatus === 0 ? "#b4dcfc" : "transparent"}} onPress={()=>handleMatchStatus(0)} disabled={matchStatus === 0}>
        <Text style={styles.matchSwitchText}>暂停匹配</Text>
      </TouchableOpacity>
    </View>
    </View>
    
  );
};

const MatchSettingIcon = ({ showModal }) => {
  return (
    <TouchableOpacity style={styles.settingsIcon} onPress={showModal}>
      <Icon name="gear" size={30} color="#000" />
    </TouchableOpacity>
  );
};

const MatchScreen = () => {
  const { user, setUser } = useContext(UserContext);
  const { coupleUser, setCoupleUser } = useContext(CoupleUserContext);
  const [mode, setMode] = useState("灵魂伴侣匹配");
  const [modalVisible, setModalVisible] = useState(false);
  const showModal = () => setModalVisible(true);
  const hideModal = () => setModalVisible(false);
  const [hasMatch, setHasMatch] = useState(false);
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View>
        <View style={styles.header}>
          <Text style={styles.title}>Crucio匹配系统</Text>
          {/* <MatchSettingIcon showModal={showModal} /> */}
        </View>
        {/* {modalVisible && (
          <MatchModeSelector
            mode={mode}
            setMode={setMode}
            hideModal={hideModal}
          />
        )} */}
        <View style={{ marginTop: 20 }}>
          <Button
            style={{ marginHorizontal: 50, marginVertical: 10 }}
            title="基础信息选项"
            radius={99}
            onPress={() => {
              navigation.navigate("PreferenceBasic");
            }}
            titleStyle={{ fontSize: 18 }}
            // buttonStyle={{borderColor:"#b4dcfc"}}
            // type="outline"
            color="#b4dcfc"
            size="lg"
          ></Button>
        </View>

        <View style={{ marginVertical: 10 }}>
          <Button
            style={{ marginHorizontal: 50, marginVertical: 10 }}
            title="恋爱偏好测试"
            radius={99}
            onPress={() => {
              navigation.navigate("PreferenceComplex");
            }}
            titleStyle={{ fontSize: 18 }}
            // type="outline"
            color="#b4dcfc"
            size="lg"
          ></Button>
        </View>

        <Text style={{ fontSize: 15, marginVertical: 20, color: "gray" }}>
          需要完成“基础信息选项”“恋爱偏好测试”“性格与价值观测试”才能开始匹配。
        </Text>
      </View>
      <MatchButton mode={mode} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: "100%",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 35,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  settingsIcon: {
    marginRight: 10,
  },
  modalView: {
    marginTop: "50%",
    backgroundColor: "white",
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  mode: {
    marginBottom: 10,
    fontSize: 18,
  },
  selectedMode: {
    marginBottom: 10,
    fontSize: 18,
    fontWeight: "bold",
  },
  matchButton: {
    backgroundColor: "#b4dcfc",
    padding: 10,
    height: 50,
    borderRadius: 99,
    alignItems: "center",
    justifyContent: "center",
  },
  matchSwitchFatherContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 16,
  },
  matchSwitchContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 16,
  },
  matchSwitchTitleContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  matchSwitchTitle: {
    fontSize: 16,
    color: "gray",
  },
  matchSwitch: {
    borderColor: "#b4dcfc",
    borderWidth: 1,
    padding: 16,
    height: "auto",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    flexGrow: 1,
  },
  matchSwitchText: {
    color: "gray",
    fontSize: 16,
    // fontWeight: "bold",
  },
  buttonText: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
  },
  wrapper: {
    marginTop: 30,
    marginBottom: 30,
  },
  slide: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "transparent",
    width: 200,
    height: 200,
  },
});

export default MatchScreen;
