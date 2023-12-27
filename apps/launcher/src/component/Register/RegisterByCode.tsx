import React, { useContext, useState } from "react";
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from "react-native";

import { Button } from "@rneui/themed";
import { useNavigation } from "@react-navigation/native";
// import { AuthService } from "../../src/sdk/service/auth";
import { userApi } from "../../sdk/api";
import axios from "axios";
import Icon from "react-native-vector-icons/FontAwesome";
import UserContext from "../../sdk/context/userContext";
import Const from "../../sdk/const";
import setAuthToken from "../../sdk/utils/authToken";

const RegisterByCode = () => {
  // const authService = new AuthService()

  const [userName, setUserName] = useState("");
  const [phone, setPhone] = useState("");
  const [verifyCode, setVerifyCode] = useState("");
  const navigation = useNavigation();
  const { user, setUser } = useContext(UserContext);

  // const baseURL = "http://localhost:8080/api";

  const handleRegister = async () => {
    let lastFourDigits = phone.slice(-4);
    let userName = `user${lastFourDigits}`;
    if (phone.length == 0 || verifyCode.length == 0) {
      Alert.alert("输入错误", "手机号和验证码不能为空",[ { text: "确定", onPress: () => console.log("OK Pressed") }]);
      return;
    }
    try {
      // TODO: 得加个await，等有返回结果后
      console.log(phone, userName);
      const res = await axios.post(
        `${Const.baseURL}/user/Register/userRegisterVerify/${verifyCode}`,
        {
          phone: phone,
          userName: userName,
        }
      );

      //跳转登录页面
      if (res.data.code === 401) {
        setUser({});
        Alert.alert(res.data.msg,"",[ { text: "确定", onPress: () => console.log("OK Pressed") }]);
        navigation.navigate("Login");
        return;
      }

      if (res.data.code === 400) {
        setUser({});
        Alert.alert(res.data.msg,"",[ { text: "确定", onPress: () => console.log("OK Pressed") }]);
        return;
      }
      // console.log(res.data.data["userId"]);
      setUser({ ...res.data.data, isLogged: 1 });
      if (res.data.data && res.data.data.token) {
        setAuthToken(res.data.data.token);
        console.log("Success Login～");
      }
      console.log(JSON.stringify(user));
      navigation.navigate("RegisterProfile");
      console.log("Success Register");
    } catch (error) {
      Alert.alert("注册错误：", `${error}`,[ { text: "确定", onPress: () => console.log("OK Pressed") }]);
      console.error(error);
      navigation.navigate("Login");
    }
  };

  const handleSubmit = async () => {
    try {
      handleRegister();
    } catch (error) {
      console.error(error);
      Alert.alert(`${error}`,"",[ { text: "确定", onPress: () => console.log("OK Pressed") }]);
      navigation.navigate("Login");
    }
  };

  // 获取验证码
  const handleGetVerifyCode = async () => {
    try {
      setUser({ ...user, phone: phone });

      await axios.get(
        `${Const.baseURL}/user/Register/userRegisterSendSMS/${phone}`
      );
      console.log("发送注册验证码...");
      Alert.alert("验证码已发送","",[ { text: "确定", onPress: () => console.log("OK Pressed") }]);
    } catch (error) {
      console.error(error);
      Alert.alert("验证码发送失败，请检查手机号后再次重试发送","",[ { text: "确定", onPress: () => console.log("OK Pressed") }]);
    }
  };

  const validatePhone = (val: string) => {
    setPhone(val);
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          source={require("../../../image/icon/logo.png")}
          style={{ width: 150, height: 50 }}
        />
      </View>
      {/* <TextInput
        style={styles.input}
        onChangeText={setUserName}
        value={userName}
        placeholder="用户昵称"
      /> */}
      <TextInput
        style={styles.input}
        onChangeText={(val) => validatePhone(val)}
        value={phone}
        placeholder="请输入手机号"
        keyboardType="numeric"
      />
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginVertical: 20,
        }}
      >
        <TextInput
          style={{ ...styles.input, width: 260 }}
          onChangeText={setVerifyCode}
          value={verifyCode}
          placeholder="请输入验证码"
          keyboardType="numeric"
        />
        <Button
          title="获取验证码"
          radius={99}
          onPress={() => {
            handleGetVerifyCode();
          }}
          type="outline"
          color="#b4dcfc"
          size="lg"
        ></Button>
      </View>
      <View>
        <Button
          title="注册"
          color="#b4dcfc"
          radius={99}
          size="lg"
          onPress={() => {
            handleSubmit();
          }}
        />
      </View>
      <View style={{ marginTop: 20 }}>
        <Button
          title="登录"
          style={{ marginTop: 20 }}
          color="#b4dcfc"
          type="outline"
          radius={99}
          size="lg"
          onPress={() => {
            navigation.navigate("Login");
          }}
        />
      </View>
      <View style={{ marginTop: 20 }}>
        <Button
          title="使用密码注册"
          style={{ marginTop: 20 }}
          color="#b4dcfc"
          type="clear"
          radius={99}
          size="lg"
          onPress={() => {
            navigation.navigate("Register");
          }}
        />
      </View>
      {/* <View style={styles.buttonGroup}>
        <TouchableOpacity style={styles.button} onPress={() => {}}>
          <Icon name="wechat" size={20} color="#1DA1F2" />
          <Text style={styles.buttonText}>微信登录</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => {}}>
          <Icon name="unlock-alt" size={20} color="#1DA1F2" />
          <Text style={styles.buttonText}>密码登录</Text>
        </TouchableOpacity>
      </View> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
    backgroundColor: "#FAFAFA", // Instagram-like background color
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#262626", // Slightly darker text
    marginTop: 16,
  },
  input: {
    height: 50,
    borderColor: "gray",
    borderWidth: 1,
    padding: 10,
    borderRadius: 99,
  },
  buttonGroup: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 16,
  },
  buttonText: {
    marginLeft: 8,
    color: "black",
    fontWeight: "600", // Slightly bolder text for button
  },
});

export default RegisterByCode;
