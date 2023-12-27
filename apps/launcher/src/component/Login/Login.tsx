import React, { useContext, useEffect, useState } from "react";
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Image,
  Alert,
  Keyboard,
  TouchableWithoutFeedback
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Button } from "@rneui/themed";
import { useNavigation } from "@react-navigation/native";
// import { AuthService } from "../../src/sdk/service/auth";
import { userApi } from "../../sdk/api";
import axios from "axios";
import Icon from "react-native-vector-icons/Feather";
import UserContext from "../../sdk/context/userContext";
import Const from "../../sdk/const";
import setAuthToken from "../../sdk/utils/authToken";
import * as Updates from 'expo-updates';

const Login = () => {
  // const authService = new AuthService()

  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const navigation = useNavigation();
  const { user, setUser } = useContext(UserContext);


  const [tips, setTips] = useState('')
  const [tips2, setTips2] = useState('')

  useEffect(()=>{
    async function autoFetchUpdate(){
        await Updates.fetchUpdateAsync();
        await Updates.reloadAsync();
    }
    async function onFetchUpdateAsync() {
      try {
        const update = await Updates.checkForUpdateAsync();
        setTips(`isAvailable:, ${update.isAvailable} channel: ${Updates.channel} runtimeVersion: ${Updates.runtimeVersion}`)
        if (update.isAvailable) {
          
          Alert.alert("新版本已发布，确认后将自动更新","",[
        { text: "确定", onPress: () => {
          console.log("OK Pressed")
          autoFetchUpdate()
        } },
      ])
        }
      } catch (error) {
        setTips2(`${error}`)
        // You can also add an alert() to see the error message in case of an error when fetching updates.
        Alert.alert("自动更新有误，请到官网下载最新版本", `${error}`, [
        { text: "确定", onPress: () => console.log("OK Pressed") },
      ]);
      }
    }
    if(Platform.OS == "android"){
      // 本地测试可以不跑
      // onFetchUpdateAsync()
    }
  },[])

  const handlePasswordVisible = () => {
    setPasswordVisible(!passwordVisible);
  }

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  const handleLogin = async () => {
    // 邮箱验证
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert("输入错误", "邮箱格式错误", [
        { text: "确定", onPress: () => console.log("OK Pressed") },
      ]);
      return;
    }
    if (email.length == 0 || password.length == 0) {
      Alert.alert("输入错误", "邮箱和密码不能为空", [
        { text: "确定", onPress: () => console.log("OK Pressed") },
      ]);
      return;
    }
    try {
      // TODO: 得加个await，等有返回结果后

      const res = await axios.get(
        `${Const.baseURL}/user/Register/userLogonEmailOfPassword/${email}/${password}`
      );
      // console.log(JSON.stringify(res.data));
      console.log(JSON.stringify(res.data));
      if (res.data.code === 400) {
        Alert.alert(res.data.msg, "", [
          { text: "确定", onPress: () => console.log("OK Pressed") },
        ]);
        return;
      }
      await setUser({ ...res.data["data"], isLogged: 1 });
      // console.log(JSON.stringify(user));
      if (res.data.data && res.data.data.token) {
        setAuthToken(res.data.data.token);
        console.log("Success Login");
        // 处理user的asyncStorage
        await AsyncStorage.setItem(
          "crucio-user",
          JSON.stringify({ ...res.data.data, isLogged: 1 })
        );
        await AsyncStorage.setItem(
          "crucio-user-token",
          res.data.data.token
        );
        if (res.data.data["isAuthed"] === 1) {
          navigation.navigate("BottomTabs");
        } else {
          navigation.navigate("RegisterProfile");
        }
      }
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
      handleLogin();
    } catch (error) {
      console.error(error);
      Alert.alert(`${error}`, "", [
        { text: "确定", onPress: () => console.log("OK Pressed") },
      ]);
      navigation.navigate("Login");
    }
  };

  const validateEmail = (val: string) => {
    setEmail(val);
  };

  return (

    <TouchableWithoutFeedback onPress={dismissKeyboard}>
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
      {/* <View>
        <Text>1.0.11(1)</Text>
        <Text>{tips}</Text>
        <Text>{tips2}</Text>
      </View> */}
      <View><TextInput
        style={styles.input}
        onChangeText={(val) => validateEmail(val)}
        value={email}
        placeholder="请输入邮箱"
      /></View>
      
      <View
        style={{
          marginTop: 20,
          flexDirection: "row",
          alignItems: "center",
          position: "relative",
        }}
      >
        <TextInput
          style={{ ...styles.input }}
          onChangeText={setPassword}
          value={password}
          // allowFontScaling={false}
          placeholder="请输入密码"
          secureTextEntry = {!passwordVisible}
        />
        <Icon name={passwordVisible ? "eye" : "eye-off"} size={20} style={{ position: "absolute", right:12 }} onPress={handlePasswordVisible}/>
      </View>
      <View style={{ marginTop: 20 }}>
        <Button
          title="登录"
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
          title="注册"
          color="#b4dcfc"
          type="outline"
          radius={99}
          size="lg"
          onPress={() => {
            navigation.navigate("Register");
          }}
        />
      </View>
      {/* <View style={{ marginTop: 20 }}>
        <Button
          title="使用验证码登录"
          style={{ marginTop: 20 }}
          color="#b4dcfc"
          type="clear"
          radius={99}
          size="lg"
          onPress={() => {
            navigation.navigate("LoginByCode");
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
    borderRadius: 99,
    flexGrow: 1,
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

export default Login;
