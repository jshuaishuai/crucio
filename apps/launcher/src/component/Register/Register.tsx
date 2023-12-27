import React, { useContext, useState, useEffect, useMemo } from "react";
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  Keyboard,
  TouchableWithoutFeedback
} from "react-native";

import { Button } from "@rneui/themed";
import { useNavigation } from "@react-navigation/native";
// import { AuthService } from "../../src/sdk/service/auth";
import { userApi } from "../../sdk/api";
import axios from "axios";
import Icon from "react-native-vector-icons/Feather";
import UserContext from "../../sdk/context/userContext";
import Const from "../../sdk/const";
import setAuthToken from "../../sdk/utils/authToken";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Register = () => {
  // const authService = new AuthService()

  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [emailValid, setEmailValid] = useState(false);
  const [emailValidMsg, setEmailValidMsg] = useState("");
  const [password, setPassword] = useState("");
  const [passwordAgain, setPasswordAgain] = useState("");
  const [verifyCode, setVerifyCode] = useState("");
  const [count, setCount] = useState(0);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [passwordAgainVisible, setPasswordAgainVisible] = useState(false);
  const navigation = useNavigation();
  const { user, setUser } = useContext(UserContext);

  // const baseURL = "http://localhost:8080/api";

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  useEffect(() => {
    let interval = null;
    if (count > 0) {
      interval = setInterval(() => {
        setCount((count) => count - 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [count]);

  const handlePasswordVisible = () => {
    setPasswordVisible(!passwordVisible);
  }

  const handlePasswordAgainVisible = () => {
    setPasswordAgainVisible(!passwordAgainVisible);
  }

  const handleRegister = async () => {
    let lastFourDigits = email.slice(0, 4);
    let userName = `user${lastFourDigits}`;
    // 邮箱验证
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert("输入错误", "邮箱格式错误", [
        { text: "确定", onPress: () => console.log("OK Pressed") },
      ]);
      return;
    }
    if (
      email.length == 0 ||
      password.length == 0 ||
      passwordAgain.length == 0 ||
      verifyCode.length == 0
    ) {
      Alert.alert("输入错误", "邮箱、密码和验证码不能为空", [
        { text: "确定", onPress: () => console.log("OK Pressed") },
      ]);
      return;
    }
    // 检查两次密码是否一致
    if (password !== passwordAgain) {
      Alert.alert("输入错误", "两次密码不一致", [
        { text: "确定", onPress: () => console.log("OK Pressed") },
      ]);
      return;
    }
    try {
      // TODO: 得加个await，等有返回结果后
      console.log("开始注册", email, userName, password);
      const res = await axios.post(
        `${Const.baseURL}/user/Register/userRegisterEmailVerify/${verifyCode}`,
        {
          email: email,
          userName: userName,
          passWord: password,
        }
      );

      //跳转登录页面
      if (res.data.code === 401) {
        setUser({});
        Alert.alert(res.data.msg, "", [
          { text: "确定", onPress: () => console.log("OK Pressed") },
        ]);
        navigation.navigate("Login");
        return;
      }
      if (res.data.code === 400) {
        setUser({});
        Alert.alert(res.data.msg, "", [
          { text: "确定", onPress: () => console.log("OK Pressed") },
        ]);
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
          JSON.stringify({ ...res.data.data, isLogged: 1 })
        );
        await AsyncStorage.setItem(
          "crucio-user-token",
          res.data.data.token
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
      Alert.alert("注册错误：", `${error}`, [
        { text: "确定", onPress: () => console.log("OK Pressed") },
      ]);
      console.error(error);
      navigation.navigate("Login");
    }
  };

  const handleSubmit = async () => {
    try {
      handleRegister();
    } catch (error) {
      console.error(error);
      Alert.alert("错误！", "", [
        { text: "确定", onPress: () => console.log("OK Pressed") },
      ]);
      navigation.navigate("Login");
    }
  };

  const handleEmailValid = async (val: string) => {
    if(val.length === 0){
      setEmailValid(false);
      setEmailValidMsg("");
      return;
    }
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(val)) {
      setEmailValid(false);
      setEmailValidMsg("邮箱格式错误");
      return;
    }
    try {
      const res = await axios.get(
        `${Const.baseURL}/user/Register/verifyUserEmail/${val}`
      );
      if(res.data.code === 200){    
        setEmailValid(true);
        setEmailValidMsg(res.data.data);
      }
      if(res.data.code === 400){
        setEmailValid(false);
        setEmailValidMsg(res.data.msg);
        return
      }
      if(res.data.code === 401){
        Alert.alert("鉴权失败", "", [
          { text: "确定", onPress: () => console.log("OK Pressed") },
        ]);
        return
      }
    } catch (error) {
      console.error(error);
    }
  }



  // 获取验证码
  const handleGetVerifyCode = async () => {
    if(email.length === 0){
      Alert.alert("输入错误", "邮箱不能为空", [
        { text: "确定", onPress: () => console.log("OK Pressed") },
      ]);
      return
    }
    try {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        Alert.alert("输入错误", "邮箱格式错误", [
          { text: "确定", onPress: () => console.log("OK Pressed") },
        ]);
        return;
      }
      setUser({ ...user, email: email });

      console.log("发送注册验证码...");
      Alert.alert("验证码已发送", "", [
        { text: "确定", onPress: () => console.log("OK Pressed") },
      ]);
      setCount(180); 
      axios.get(
        `${Const.baseURL}/user/Register/userRegisterSendEmail/${email}`
      );
      

    } catch (error) {
      console.error(error);
      Alert.alert("验证码发送失败，请检查邮箱后再次重试发送", "", [
        { text: "确定", onPress: () => console.log("OK Pressed") },
      ]);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
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
      <View style={{}}>
        <TextInput
          style={styles.input}
          onChangeText={(val) => {
            setEmail(val);
            handleEmailValid(val)
          }}
          value={email}
          placeholder="请输入邮箱"
        />
        {emailValid ? <Text style={{color:"green", paddingLeft:10}}>{emailValidMsg}</Text> : <Text style={{color:"red",paddingLeft:10}}>{emailValidMsg}</Text>}
      </View>
      <View
        style={{
          marginTop: 15,
          marginBottom: 20,
          flexDirection: "row",
          alignItems: "center",
          position: "relative",
        }}
      >
        <TextInput
          style={{ ...styles.input }}
          onChangeText={setPassword}
          value={password}
          placeholder="请输入密码"
          secureTextEntry={!passwordVisible}
          textContentType="password"
        />
        <Icon name={passwordVisible ? "eye" : "eye-off"} size={20} style={{ position: "absolute", right:12 }} onPress={handlePasswordVisible}/>
      </View>
      <View
        style={{
          marginBottom: 20,
          flexDirection: "row",
          alignItems: "center",
          position: "relative",
        }}
      >
        <TextInput
          style={{ ...styles.input }}
          onChangeText={setPasswordAgain}
          value={passwordAgain}
          placeholder="请确认密码"
          secureTextEntry={!passwordAgainVisible}
          textContentType="password"
        />
        <Icon name={passwordAgainVisible ? "eye" : "eye-off"} size={20} style={{ position: "absolute", right:12 }} onPress={handlePasswordAgainVisible}/>
      </View>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          marginBottom: 20,
          gap: 10,
        }}
      >
        <TextInput
          style={{ ...styles.input, width: 150 }}
          onChangeText={setVerifyCode}
          value={verifyCode}
          placeholder="请输入验证码"
          keyboardType="numeric"
        />
        <Button
          title={count <= 0 ? "获取验证码" : `${count}s`}
          radius={99}
          onPress={() => {
            handleGetVerifyCode();
          }}
          disabled={!emailValid || count > 0  }
          type="outline"
          color="#b4dcfc"
          size="lg"
          containerStyle={{ flexGrow: 1 }}
        ></Button>
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
    </TouchableWithoutFeedback>

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
    flexGrow: 1,
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
