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
import AsyncStorage from "@react-native-async-storage/async-storage";

const Register = () => {
  // const authService = new AuthService()

  const [userName, setUserName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [passwordAgain, setPasswordAgain] = useState("");
  const navigation = useNavigation();
  const { user, setUser } = useContext(UserContext);

  // const baseURL = "http://localhost:8080/api";

  const handleRegister = async () => {
    let lastFourDigits = phone.slice(-4);
    let userName = `user${lastFourDigits}`;
    if (phone.length !== 11) {
      Alert.alert("输入错误", "手机号必须是11位",[ { text: "确定", onPress: () => console.log("OK Pressed") }]);
      return;
    }
    if (
      phone.length == 0 ||
      password.length == 0 ||
      passwordAgain.length == 0
    ) {
      Alert.alert("输入错误", "手机号和密码不能为空",[ { text: "确定", onPress: () => console.log("OK Pressed") }]);
      return;
    }
    try {
      // TODO: 得加个await，等有返回结果后
      console.log(phone, userName);
      const res = await axios.post(
        `${Const.baseURL}/user/Register/userRegisterOfPassword/${passwordAgain}`,
        {
          phone: phone,
          userName: userName,
          passWord: password,
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
      console.log("111", JSON.stringify(res.data));
      setUser({ ...res.data.data, isLogged: 1 });

      console.log(JSON.stringify(user));
      console.log("Success Register");
      if (res.data.data && res.data.data.token) {
        console.log(
          "🚀 ~ file: RegisterByPassword.tsx:71 ~ handleRegister ~ token:",
          res.data.data.token
        );
        setAuthToken(res.data.data.token);
        // 处理user的asyncStorage
        await AsyncStorage.setItem(
          "crucio-user",
          JSON.stringify({...res.data.data, isLogged: 1})
        );
        console.log("Success Login～");
      }
      navigation.navigate("RegisterProfile");
      // TODO: 调一次登录接口
      // try {
      //   // TODO: 得加个await，等有返回结果后
      //   console.log("注册成功，开始登录")
      //   console.log(phone, userName);
      //   const res = await axios.get(
      //     `${Const.baseURL}/user/userLogonOfPassword/${phone}/${password}`
      //   );
      //   // console.log(JSON.stringify(res.data));
      //   console.log(JSON.stringify(res.data));
      //   await setUser({ ...res.data["data"], isLogged: 1 });
      //   // console.log(JSON.stringify(user));
      //   if (res.data.data && res.data.data.token) {
      //     setAuthToken(res.data.data.token);
      //     console.log("Success Login");
      //   }
      //   navigation.navigate("RegisterProfile")
      // } catch (error) {
      //   Alert.alert("注册错误：", error);
      //   console.error(error);
      //   navigation.navigate("Login");
      // }

      // navigation.navigate("RegisterProfile");
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
      Alert.alert("错误！","",[ { text: "确定", onPress: () => console.log("OK Pressed") }]);
      navigation.navigate("Login");
    }
  };

  const validatePhone = (val: string) => {
    setPhone(val);
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Text style={{ fontSize: 28, fontWeight: "bold" }}>账号注册</Text>
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
          marginVertical: 20,
        }}
      >
        <TextInput
          style={{ ...styles.input }}
          onChangeText={setPassword}
          value={password}
          placeholder="请输入密码"
          textContentType="password"
        />
      </View>
      <View
        style={{
          marginBottom: 20,
        }}
      >
        <TextInput
          style={{ ...styles.input }}
          onChangeText={setPasswordAgain}
          value={passwordAgain}
          placeholder="请确认密码"
          textContentType="password"
        />
      </View>
      <View>
        <Button
          title="确定注册"
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
          title="返回"
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
      {/* <View style={{ marginTop: 20 }}>
      <Button
        title="使用验证码注册"
        style={{ marginTop: 20 }}
        color="#b4dcfc"
        type="clear"
        radius={99}
        size="lg"
        onPress={() => {
          navigation.navigate("RegisterByCode");
        }}
      />
      </View> */}
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

export default Register;
