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
import { Dialog, CheckBox, ListItem } from "@rneui/themed";
import { useNavigation } from "@react-navigation/native";
import UserContext from "../../../sdk/context/userContext";
import { Appbar, Card, IconButton, Divider } from "react-native-paper";
import axios from "axios";
import Const from "../../../sdk/const";
import AsyncStorage from "@react-native-async-storage/async-storage";


const AccountAndSecurity = () => {
  const { user, setUser } = useContext(UserContext);

  const navigation = useNavigation();
  const [logoutVisible, setLogoutVisible] = useState(false);

  const toggleLogoutDialog = () => {
    setLogoutVisible(!logoutVisible);
  };

  const handleLogout = async () => {
    try {
      const res = await axios.get(`${Const.baseURL}/user/userQuit/${user["userId"]}`);
      
      console.log("🚀 ~ file: AccountAndSecurity.tsx:35 ~ handleLogout ~ res:", JSON.stringify(res?.data))
      if(res.data["code"] === 401){
        Alert.alert("退出登录失败", "请重新登录", [
          {
            text: "确定",
            onPress: () => {
              navigation.navigate("Login");
            },
          },
        ]);
      }
      if(res.data["code"] === 200){
        console.log("退出登录成功");
        setUser({});

        navigation.navigate("Login");
        // 处理退出登录的asyncStorage
        await AsyncStorage.removeItem("crucio-user");
      }
      
    } catch (error) {
      console.log(error);
    }
  }
    return (
      <ScrollView style={styles.container}>
        <Appbar.Header style={styles.appbar}>
          <Appbar.BackAction
            onPress={async () => {
              navigation.navigate("BottomTabs");
            }}
          />
          <Appbar.Content title="账号与安全" />
        </Appbar.Header>

        <TouchableOpacity
          onPress={() => {
            toggleLogoutDialog();
          }}
        >
          <View
            style={{
              ...styles.row,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              {/* <IconButton icon="account-heart" size={20} /> */}
              <Text style={{ marginLeft: 15 }}>退出登录</Text>
            </View>
            <IconButton icon="chevron-right" size={20} />
          </View>
        </TouchableOpacity>

        <Divider />
        <Dialog
          isVisible={logoutVisible}
          onBackdropPress={toggleLogoutDialog}
          overlayStyle={{ borderRadius: 20 }}
        >
          <Dialog.Title title="确定退出登录？" />
          <Dialog.Actions>
            <Dialog.Button
              title="关闭"
              onPress={() => setLogoutVisible(false)}
            />
            <Dialog.Button title="确定" onPress={() => handleLogout()} />
          </Dialog.Actions>
        </Dialog>
      </ScrollView>
    );
  };

const styles = StyleSheet.create({
  appbar: {
    backgroundColor: "white",
    elevation: 2,
  },

  container: {
    backgroundColor: "#fff",
  },
  row: {
    backgroundColor: "fff",
  },
  content: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginLeft: 10,
  },
  leftPanel: {
    justifyContent: "center",
  },
  leftTitle: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 10,
  },
});
export default AccountAndSecurity;
