import React, { useState, useEffect, useContext } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";

import Swiper from "react-native-swiper";
import Profile from "../Profile/Profile";
import {
  TextInput,
  Button,
  Appbar,
  IconButton,
  Avatar,
} from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import CoupleUserContext from "../../sdk/context/coupleContext";
import UserContext from "../../sdk/context/userContext";
import Const from "../../sdk/const";
import axios from "axios";
import { V2TimMessage } from "react-native-tim-js";

export const educationList = [
  "高中及以下",
  "专科",
  "本科",
  "研究生",
  "博士及以上",
];

const cardList = [...Const.cardList];

const TAInfo = ({}) => {
  const { user, setUser } = useContext(UserContext);
  const { coupleUser, setCoupleUser } = useContext(CoupleUserContext);
  const [coupleContent, setCoupleContent] = useState([]);
  const [coupleImgs, setCoupleImgs] = useState([]);
  const [matchPeopleNum, setMatchPeopleNum] = useState("暂无匹配用户");
  const [profileData, setProfileData] = useState({
    images: coupleImgs,
    info: {
      age: coupleUser["age"] || 0,
      height: coupleUser["height"] || 0,
      weight: coupleUser["weight"] || 0,
      education: educationList[coupleUser["education"]] || "本科",
      school: coupleUser["school"] || "本科",
      identity: coupleUser["identity"] || "未知职业",
      address:
        coupleUser["addressA"] && coupleUser["addressB"]
          ? `${coupleUser["addressA"]}${coupleUser["addressB"]}`
          : "未知",
      hometown:
        coupleUser["homeTownA"] && coupleUser["homeTownB"]
          ? `${coupleUser["homeTownA"]}${coupleUser["homeTownB"]}`
          : "未知",
    },
    descriptions: coupleContent,
  });
  const navigation = useNavigation();
  const [hasMatch, setHasMatch] = useState(false);

  useEffect(() => {
    console.log("coupleUser ID:", coupleUser["userId"]);
    if (coupleUser["userId"]) {
      axios.get(`${Const.baseURL}/user/getUserById/${coupleUser["userId"]}`).then((res)=>{
        console.log("点击TA获取对方信息:",JSON.stringify(res.data))
        if(res.data["code"] === 200){
          setCoupleUser(()=>{return res.data["data"]})
        }
      })
      axios
        .get(
          `${Const.baseURL}/user/blog/getBlogByUserID/${coupleUser["userId"]}`
        )
        .then((res) => {
          const data = res.data;
          console.log("couple blog 数据：", JSON.stringify(data));
          const tempCoupleContent = [];
          const tempCoupleImgs = [];

          Object.entries(data).forEach(([key, value]) => {
            if (key.includes("content") && value !== null && value !== "") {
              tempCoupleContent.push({ [key]: value });
            }
          });
          setCoupleContent(tempCoupleContent);

          Object.entries(data).forEach(([key, value]) => {
            if (key.includes("photo") && value !== null && value !== "") {
              tempCoupleImgs.push(value);
            }
          });
          setCoupleImgs(tempCoupleImgs);
        });
    } else {
      console.log("没有匹配用户userId");
      // 获取符合用户偏好的人数
      axios
        .get(`${Const.baseURL}/user/getConformUsers/${user["userId"]}`)
        .then((res) => {
          if (res.data["code"] === 200) {
            console.log("res.data:", JSON.stringify(res.data));
            setMatchPeopleNum(res.data["data"]);
          }
          if (res.data["code"] === 400) {
            console.log("res.data:", JSON.stringify(res.data));
            setMatchPeopleNum(res.data["msg"]);
          }
          if (res.data["code"] === 401) {
            return;
          }
        });
    }
  }, []);
  useEffect(() => {
    console.log("coupleUser ID:", coupleUser["userId"]);
    if (coupleUser["userId"]) {
      axios
        .get(
          `${Const.baseURL}/user/blog/getBlogByUserID/${coupleUser["userId"]}`
        )
        .then((res) => {
          const data = res.data;
          console.log("couple blog 数据2：", JSON.stringify(data));
          const tempCoupleContent = [];
          const tempCoupleImgs = [];

          Object.entries(data).forEach(([key, value]) => {
            if (key.includes("content") && value !== null && value !== "") {
              tempCoupleContent.push({ [key]: value });
            }
          });
          setCoupleContent(tempCoupleContent);

          Object.entries(data).forEach(([key, value]) => {
            if (key.includes("photo") && value !== null && value !== "") {
              tempCoupleImgs.push(value);
            }
          });
          setCoupleImgs(tempCoupleImgs);
        });
    } else {
      console.log("没有匹配用户userId");
      // 获取符合用户偏好的人数
      axios
        .get(`${Const.baseURL}/user/getConformUsers/${user["userId"]}`)
        .then((res) => {
          if (res.data["code"] === 200) {
            console.log("res.data:", JSON.stringify(res.data));
            setMatchPeopleNum(res.data["data"]);
          }
          if (res.data["code"] === 400) {
            console.log("res.data:", JSON.stringify(res.data));
            setMatchPeopleNum(res.data["msg"]);
          }
          if (res.data["code"] === 401) {
            return;
          }
        });
    }
  }, [coupleUser["userId"]]);

  useEffect(() => {
    setProfileData({ ...profileData, descriptions: coupleContent });
  }, [coupleContent]);
  useEffect(() => {
    setProfileData({ ...profileData, images: coupleImgs });
  }, [coupleImgs]);

  useEffect(() => {
    const temp = {
      images: coupleImgs,
      info: {
        age: coupleUser["age"] || 0,
        height: coupleUser["height"] || 0,
        weight: coupleUser["weight"] || 0,
        education: educationList[coupleUser["education"]] || "本科",
        school: coupleUser["school"] || "本科",
        identity: coupleUser["identity"] || "未知职业",
        address:
          coupleUser["addressA"] && coupleUser["addressB"]
            ? `${coupleUser["addressA"]}${coupleUser["addressB"]}`
            : "未知",
        hometown:
          coupleUser["homeTownA"] && coupleUser["homeTownB"]
            ? `${coupleUser["homeTownA"]}${coupleUser["homeTownB"]}`
            : "未知",
      },
      descriptions: coupleContent,
    }
    setProfileData(temp);
  },[coupleUser])

  return (
    <View>
      {coupleUser["userId"] ? (
        <ScrollView style={{ height: "100%", backgroundColor: "#fff" }}>
          <Profile profileData={profileData} isOwner={false} />
        </ScrollView>
      ) : (
        <View
          style={{
            height: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {/* <Text>暂无匹配用户</Text> */}
          {/* <Text>给用户的一封信：</Text> */}
          <Text style={{marginHorizontal:20, textAlign: "center"}}>{matchPeopleNum}</Text>
        </View>
      )}

      {/* 聊天按钮 */}
      <TouchableOpacity
        style={styles.chatButton}
        onPress={() => {
          if (coupleUser["userId"]) {
            // 匹配对象成功，跳转至聊天页面
            const convID = String(coupleUser["userId"]);
            navigation.navigate("Chat2", {
              conversation: {
                conversationID: `c2c_${convID}`,
                showName: coupleUser["userName"],
                userID: convID,
                groupID: "",
                type: 1,
              },
              userID: String(user["userId"]),
              initialMessageList: [],
              unMount: (message: V2TimMessage[]) => {},
            });
          } else {
            Alert.alert("暂无匹配用户", "", [
              { text: "确定", onPress: () => console.log("OK Pressed") },
            ]);
          }
        }}
      >
        <IconButton icon="chat" iconColor="#fff" size={24} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  chatButton: {
    position: "absolute",
    right: 20,
    bottom: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#b4dcfc",
    justifyContent: "center",
    alignItems: "center",
    elevation: 10,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});

export default TAInfo;
