import React, { useState, useContext, useEffect } from "react";
import {
  ScrollView,
  StyleSheet,
  TextInput,
  Switch,
  View,
  Text,
  TouchableOpacity,
  TouchableHighlight,
  Alert,
} from "react-native";
import { Button, CheckBox } from "@rneui/themed";

import { Appbar, Card, IconButton, Divider } from "react-native-paper";
import { Picker } from "@react-native-picker/picker";
import { useNavigation } from "@react-navigation/native";
import UserContext from "../../../sdk/context/userContext";
import axios from "axios";
import Const from "../../../sdk/const";

interface IForm {
  [key: string]: any;
}

export default function ProfileEdit() {
  //   const [user, setUser] = useState<IForm>({
  //     nickName: "小明",
  //     gender: 0,
  //     date: "2000-12-31",
  //     height: 190,
  //     address: "xxx11",
  //     education: "xxx", // 教育程度
  //     sex: 1, // 性取向
  //   });

  const { user, setUser } = useContext(UserContext);

  // 个人设置view控制
  const [isAddressShow, setIsAddressShow] = useState(false);
  const [isEducationShow, setIsEducationShow] = useState(false);
  const [currAddress, setCurrAddress] = useState(user["address"]);
  const [currEducation, setCurrEducation] = useState(user["education"]);

  const navigation = useNavigation();
  const questionsSample = [
    { id: 1, type: "sport", text: "你喜欢户外活动吗？" },
    { id: 2, type: "reading", text: "你喜欢阅读吗？" },
    { id: 3, type: "sport", text: "你经常运动吗？" },
    { id: 4, type: "sport", text: "你喜欢户外活动吗？" },
    { id: 5, type: "reading", text: "你喜欢阅读吗？" },
  ];
  const username = "exampleUser";
  // const baseUrl = `http://localhost:8080/api`;

  //   useEffect( () => {
  //     if (user.userId) {
  //       try {
  //         axios.get(`${Const.baseURL}user/getUserById/${user["userId"]}`).then((res)=>{
  //             setUser({...res.data.data})
  //           })
  //       } catch (error) {
  //         console.error(error)
  //       }
  //     }
  //   }, []);

  const handleSubmit = async () => {
    try {
      // TODO: 得加个await，等有返回结果后
      // console.log(JSON.stringify(user))
      const res = await axios.put(
        `${Const.baseURL}/user/Register/userSet`,
        user
      );
      //跳转登录页面
      if (res.data.code === 401) {
        setUser({});
        navigation.navigate("Login");
      }

      console.log("用户信息提交成功");
      Alert.alert("用户信息提交成功","",[ { text: "确定", onPress: () => console.log("OK Pressed") }]);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Appbar.Header style={styles.appbar}>
        <Appbar.BackAction
          onPress={async () => {
            await handleSubmit();
            navigation.navigate("BottomTabs");
          }}
        />
        <Appbar.Content title="编辑资料" />
      </Appbar.Header>
      {/* {Object.keys(user).map((key) => {
        return <Text>{`${key}: ${user[key]}`}</Text>;
      })} */}

      <View style={[styles.row]}>
        <View style={styles.content}>
          <View style={styles.leftPanel}>
            <View style={styles.leftTitle}>
              <Text
                style={{
                  fontSize: 15,
                  color: "#262626",
                }}
              >
                昵称
              </Text>
            </View>
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              placeholder={user["userName"]}
              onChangeText={(value) => {
                setUser({ ...user, userName: value });
              }}
            />
          </View>
        </View>
      </View>
      <Divider />
      <View style={[styles.row]}>
        <View style={styles.content}>
          <View style={styles.leftPanel}>
            <View style={styles.leftTitle}>
              <Text
                style={{
                  fontSize: 15,
                  color: "#262626",
                }}
              >
                性别
              </Text>
            </View>
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              defaultValue={user["gender"] == 0 ? "男" : "女"}
              editable={false}
              onChangeText={(value) => {}}
            />
          </View>
        </View>
      </View>
      <Divider />
      <View style={[styles.row]}>
        <View style={styles.content}>
          <View style={styles.leftPanel}>
            <View style={styles.leftTitle}>
              <Text
                style={{
                  fontSize: 15,
                  color: "#262626",
                }}
              >
                生日
              </Text>
            </View>
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              defaultValue={user["date"]}
              editable={false}
              underlineColorAndroid={"white"}
              onChangeText={(value) => {}}
            />
          </View>
        </View>
      </View>
      <Divider />
      <View style={[styles.row]}>
        <View style={styles.content}>
          <View style={styles.leftPanel}>
            <View style={styles.leftTitle}>
              <Text
                style={{
                  fontSize: 15,
                  color: "#262626",
                }}
              >
                身高
              </Text>
            </View>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <TextInput
              style={styles.textInput}
              defaultValue={`${user["height"]}`}
              //   editable={false}
              underlineColorAndroid={"white"}
              keyboardType="numeric"
              onChangeText={(value) => {
                setUser({ ...user, height: parseInt(value, 10) });
              }}
            />
            <Text style={{ marginRight: 10, marginLeft: 5 }}>厘米</Text>
          </View>
        </View>
      </View>
      <Divider />

      {/* 地址 */}
      <TouchableHighlight
        onPress={() => setIsAddressShow(!isAddressShow)}
        underlayColor="#E6E6E6"
      >
        <View style={[styles.row]}>
          <View style={styles.content}>
            <View style={styles.leftPanel}>
              <View style={styles.leftTitle}>
                <Text
                  style={{
                    fontSize: 15,
                    color: "#262626",
                  }}
                >
                  地址
                </Text>
              </View>
            </View>

            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text>{user["address"]}</Text>
              <IconButton icon="chevron-right" size={20} />
            </View>
          </View>
        </View>
      </TouchableHighlight>

      <Divider />

      {/* 教育程度 */}
      <TouchableHighlight
        onPress={() => setIsEducationShow(!isEducationShow)}
        underlayColor="#E6E6E6"
      >
        <View style={[styles.row]}>
          <View style={styles.content}>
            <View style={styles.leftPanel}>
              <View style={styles.leftTitle}>
                <Text
                  style={{
                    fontSize: 15,
                    color: "#262626",
                  }}
                >
                  教育程度
                </Text>
              </View>
            </View>

            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text>{user["education"]}</Text>
              <IconButton icon="chevron-right" size={20} />
            </View>
          </View>
        </View>
      </TouchableHighlight>
      <Divider />

      {/* 性取向 */}
      {/* <View style={[styles.row]}>
        <View style={styles.content}>
          <View style={styles.leftPanel}>
            <View style={styles.leftTitle}>
              <Text
                style={{
                  fontSize: 15,
                  color: "#262626",
                }}
              >
                性取向
              </Text>
            </View>
          </View>

          <View style={styles.inputContainer}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-end",
                padding: 0,
                margin: 0,
              }}
            >
              <CheckBox
                title="男"
                checked={user["sex"] == 0}
                onPress={() => setUser({ ...user, sex: 0 })}
                checkedIcon="dot-circle-o"
                uncheckedIcon="circle-o"
                containerStyle={{ paddingHorizontal: 0, marginHorizontal: 0 }}
              />
              <CheckBox
                title="女"
                checked={user["sex"] == 1}
                onPress={() => setUser({ ...user, sex: 1 })}
                checkedIcon="dot-circle-o"
                uncheckedIcon="circle-o"
                containerStyle={{ paddingHorizontal: 0, marginHorizontal: 0 }}
              />
            </View>
          </View>
        </View>
      </View>
      <Divider /> */}

      {/* 弹窗 */}

      {isAddressShow ? (
        <View
          style={{
            position: "absolute",
            zIndex: 99,
            width: "100%",
            height: "100%",
            backgroundColor: "#fff",
          }}
        >
          <Appbar.Header
            style={{ ...styles.appbar, justifyContent: "space-between" }}
          >
            <Appbar.Content title="填写地址" onPress={() => {}} />
          </Appbar.Header>
          <TextInput
            multiline
            numberOfLines={4}
            style={{ ...styles.input, width: "auto", margin: 20 }}
            onChangeText={(value) => setCurrAddress(value)}
            value={currAddress}
            placeholder="请输入地址"
          />

          <Button
            style={{ marginHorizontal: 50, marginVertical: 10 }}
            title="确定"
            radius={99}
            onPress={() => {
              setUser({ ...user, address: currAddress });
              setIsAddressShow(false);
            }}
            color="#b4dcfc"
            size="lg"
          ></Button>
          <Button
            style={{ marginHorizontal: 50, marginVertical: 10 }}
            title="取消"
            radius={99}
            onPress={() => {
              setIsAddressShow(false);
            }}
            type="outline"
            color="#b4dcfc"
            size="lg"
          ></Button>
        </View>
      ) : null}
      {isEducationShow ? (
        <View
          style={{
            position: "absolute",
            zIndex: 99,
            width: "100%",
            height: "100%",
            backgroundColor: "#fff",
          }}
        >
          <Appbar.Header
            style={{ ...styles.appbar, justifyContent: "space-between" }}
          >
            <Appbar.Content title="选择" onPress={() => {}} />
          </Appbar.Header>
          <Picker
            selectedValue={currEducation}
            onValueChange={(itemValue) => setCurrEducation(itemValue)}
            style={{ marginTop: 20 }}
          >
            <Picker.Item label="小学" value="小学" />
            <Picker.Item label="初中" value="初中" />
            <Picker.Item label="高中" value="高中" />
            <Picker.Item label="本科" value="本科" />
            <Picker.Item label="研究生" value="研究生" />
            <Picker.Item label="博士" value="博士" />
          </Picker>
          <Button
            style={{ marginHorizontal: 50, marginVertical: 10 }}
            title="确定"
            radius={99}
            onPress={() => {
              setUser({ ...user, education: currEducation });
              setIsEducationShow(false);
            }}
            color="#b4dcfc"
            size="lg"
          ></Button>
          <Button
            style={{ marginHorizontal: 50, marginVertical: 10 }}
            title="取消"
            radius={99}
            onPress={() => {
              setIsEducationShow(false);
            }}
            type="outline"
            color="#b4dcfc"
            size="lg"
          ></Button>
        </View>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  appbar: {
    backgroundColor: "white",
    elevation: 2,
  },
  editButtonContainer: {
    position: "absolute",
    top: 5, // 您可以调整这些值以获得理想的位置
    right: 5,
    zIndex: 1,
  },
  editButton: {
    backgroundColor: "transparent", // 透明背景
    elevation: 0, // 移除阴影
  },
  card: {
    margin: 15,
    borderRadius: 10,
    backgroundColor: "#fff",
  },
  cardContent: {
    paddingVertical: 20,
  },

  container: {
    backgroundColor: "#fff",
  },
  row: {
    backgroundColor: "fff",
  },
  input: {
    height: 100,
    fontSize: 16,
    borderColor: "gray",
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
  },
  content: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginLeft: 10,
  },
  lastLine: {
    borderBottomWidth: 1,
    borderBottomColor: "#E6E6E6",
  },
  leftPanel: {
    justifyContent: "center",
  },
  leftTitle: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 10,
  },
  subTitle: {},
  inputContainer: {
    height: 52,
    flex: 1,
    marginRight: 15,
  },
  textInput: {
    height: 49,
    fontSize: 14,
    textAlign: "right",
    color: "#262626",
  },
  group: {},
  sectionHeader: {
    height: 40,
    justifyContent: "center",
    backgroundColor: "#E6E6E6",
  },
  switch: {
    flex: 1,
    height: 49,
    flexDirection: "row",
    alignItems: "center",
    marginRight: 10,
    justifyContent: "flex-end",
  },
  view: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
});
