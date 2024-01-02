import React, { useContext, useState, useId } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  StyleSheet,
  TouchableOpacity,
  Button,
  Alert,
  Modal,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  ScrollView,

} from "react-native";
import { launchImageLibrary } from "react-native-image-picker";
import * as ImagePicker from "expo-image-picker";
// import DatePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from "@react-navigation/native";
import { heightList, weightList } from "../../sdk/const/dataList";
import moment from 'moment'
import { CheckBox, Input } from "@rneui/themed";
import axios from "axios";
import Const from "../../sdk/const";
import UserContext from "../../sdk/context/userContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

const options = {
  title: "Select photo",
  storageOptions: {
    skipBackup: true,
    path: "images",
  },
};

// const baseUrl = "http://localhost:8080/api";

function RegisterProfile() {
  const navigation = useNavigation();
  const { user, setUser } = useContext(UserContext);

  const [step, setStep] = useState(1);
  const [nickname, setNickname] = useState("");
  const [weChat, setWeChat] = useState("");
  const [gender, setGender] = useState(1);
  const [isShowDate, setIsShowDate] = useState(false);
  //  const [selectedGenderIndex, setGenderIndex] = useState(0);
  // const [year, setYear] = useState("");
  // const [month, setMonth] = useState("");
  // const [day, setDay] = useState("");
  // const [birthday, setBirthday] = useState(new Date("2000-01-01"));
  const [height, setHeight] = useState(170);
  const [weight, setWeight] = useState(60);
  const [profileImageSrc, setProfileImageSrc] = useState("");
  const [show, setShow] = useState(false);
  const [date, setDate] = useState(new Date("2000-01-01"));
  const [tempDate, setTempDate] = useState(new Date("2000-01-01"));
  const heightRange = Array.from({ length: 81 }, (_, i) => i + 140);
  const nextStep = () => {
    if (step < 6) {
      setStep(step + 1);
    } else {
      // Send data to the backend
      // ...
      setStep(step + 1);
    }
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      // Send data to the backend
      // ...
      setStep(step - 1);
    }
  };

  const showDatepicker = () => {
    setShow(true);
  };

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setShow(false);
    setDate(currentDate);
  };

  const onChangeIOS = (event, selectedDate) => {
    const currentDate = selectedDate;
    // setShow(false);
    setTempDate(currentDate);
  }

  function validateWeChatNumber(wechatNumber) {
    // 正则表达式匹配规则
    var regex = /^[a-zA-Z][-_a-zA-Z0-9]{5,19}$/;
  
    // 使用正则表达式进行匹配
    var isValid = regex.test(wechatNumber);
  
    return isValid;
  }

  const calculateAge = (birthDate: any) => {
    const currentDate = new Date();
    const birthDateObj = new Date(birthDate);
    let age = currentDate.getFullYear() - birthDateObj.getFullYear();

    // 检查当前日期是否已经过了生日
    const currentMonth = currentDate.getMonth();
    const birthMonth = birthDateObj.getMonth();

    if (currentMonth < birthMonth) {
      age--;
    } else if (currentMonth === birthMonth) {
      const currentDay = currentDate.getDate();
      const birthDay = birthDateObj.getDate();

      if (currentDay < birthDay) {
        age--;
      }
    }

    return age;
  };

  const handleSubmit = async () => {
    let birthday = moment(date).format('YYYY-MM-DD');

    let age = calculateAge(birthday);
    console.log(birthday, height, weight);
    console.log("weChat:", weChat);
    console.log("typeof birthday:", typeof birthday);
    let params = {
      userId: user["userId"],
      userName: nickname,
      photo: "",
      identity: "",
      gender: gender,
      // birthDay: new Date(birthday),
      birthDay: birthday,
      weChat: weChat,
      age: age,
      address: "",
      height: height,
      weight: weight,
      education: "",
      beauty: null,
      isAuthed: 1,
      isLogged: 1,
      // matchStatus: 0,
      // isTested: 0,
    };
    console.log(JSON.stringify(params));
    try {
      // TODO: 得加个await，等有返回结果后
      const res = await axios.put(
        `${Const.baseURL}/user/Register/userSet`,
        params
      );

      // 跳转登录页面
      if (res.data.code === 401) {
        setUser({});
        navigation.navigate("Login");
        return;
      }

      if (res.data.code === 400) {
        Alert.alert(res.data.msg,"",[ { text: "确定", onPress: () => console.log("OK Pressed") }]);
        return;
      }

      setUser({ ...user, ...params });
      await AsyncStorage.setItem("crucio-user", JSON.stringify(res.data.data));
      console.log(JSON.stringify(user));
      console.log("用户信息提交成功");

      try {
        console.log("开始创建blog...");
        const addBlogres = await axios.post(
          `${Const.baseURL}/user/blog/insertBlog`,
          {
            userID: user["userId"],
          }
        );
        console.log(
          "🚀 ~ file: RegisterProfile.tsx:138 ~ handleSubmit ~ addBlogres:",
          JSON.stringify(addBlogres.data)
        );

        //跳转登录页面
        if (addBlogres.data.code === 401) {
          setUser({});
          navigation.navigate("Login");
        }

        if (addBlogres.data.code === 400) {
          Alert.alert(addBlogres.data.msg,"",[ { text: "确定", onPress: () => console.log("OK Pressed") }]);
          return;
        }

        if (addBlogres.data.code === 200) {
          console.log("创建博客成功");

          // 图片为空直接跳过
          if (profileImageSrc === "") {
            navigation.navigate("BottomTabs");
            return;
          }

          let formData = new FormData();
          let imgSrc = profileImageSrc;
          if (Platform.OS === "android") {
            imgSrc = profileImageSrc;
          } else {
            imgSrc = profileImageSrc.replace("file://", "");
          }

          const fileName = profileImageSrc.substring(
            profileImageSrc.lastIndexOf("/") + 1
          );
          console.log("图片位置,", imgSrc, fileName);
          let file = {
            uri: imgSrc,
            type: "multipart/form-data",
            name: `${fileName}`,
          };
          formData.append("file", file);
          try {
            const photo1Res = await axios.put(
              `${Const.baseURL}/user/blog/updatePhoto1/${user["userId"]}`,
              formData,
              {
                headers: {
                  "Content-Type": "multipart/form-data",
                },
              }
            );
            //跳转登录页面
            if (photo1Res.data.code === 401) {
              setUser({});
              navigation.navigate("Login");
            }

            if (photo1Res.data.code === 200) {
              console.log("上传图片成功...");
              navigation.navigate("BottomTabs");
            }
          } catch {
            console.error(error);
            Alert.alert("因网络问题上传图片失败，可以稍后再试","",[ { text: "确定", onPress: () => console.log("OK Pressed") }]);
          }
        }
      } catch (error) {
        console.error(error);
      }
    } catch (error) {
      // navigation.navigate("Login");
      console.error(error);
    }
  };

  const chooseImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [3, 4],
        quality: 0.8,
        allowsMultipleSelection: false, // 设置为false，只能选择一个图像文件
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB

        if (file.fileSize > MAX_FILE_SIZE) {
          Alert.alert("文件大小超过限制","",[ { text: "确定", onPress: () => console.log("OK Pressed") }]);
          return;
        }

        setProfileImageSrc(file.uri);
      }

      console.log(result.assets[0].uri);
      console.log(JSON.stringify(result.assets[0]));
    } catch (error) {
      console.error("选择图像时发生错误:", error);
    }
  };

  return (
  <TouchableWithoutFeedback onPress={dismissKeyboard}>
    <ScrollView style={{flex:1,backgroundColor:"#fff"}} contentContainerStyle={{justifyContent:"center", paddingVertical:50}}>
    <View style={styles.container}>
      <Text style={styles.header}>创建您的档案</Text>

      {step === 1 && (
        <View style={styles.subContainer}>
          <Text>您的昵称是:</Text>
          <TextInput
            style={{ ...styles.input, marginTop: 10 }}
            onChangeText={setNickname}
            value={nickname}
            placeholder="昵称"
          />
          <View
            style={{
              flexDirection: "row",
              position: "relative",
              justifyContent: "flex-end",
            }}
          >
            <TouchableOpacity style={styles.nextBtn} onPress={()=>{
              if(nickname === "") {
                Alert.alert("请填写昵称","",[ { text: "确定", onPress: () => console.log("OK Pressed") }]);
                return;
              }
              nextStep()
            }}>
              <Text
                style={{ fontSize: 20, color: "white", textAlign: "center" }}
              >
                下一步
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {step === 2 && (
        <View style={styles.subContainer}>
          <Text style={styles.subHeader}>个人信息:</Text>
          <Text style={{marginBottom: 20, color:"gray"}}>提示：注册之后性别、生日无法修改</Text>
          <View style={{ flexDirection: "column" }}>
            <View style={styles.column}>
              <Text>您的性别：</Text>
              {/* <Picker
                selectedValue={gender}
                onValueChange={(itemValue) => setGender(itemValue)}
              >
                <Picker.Item label="男" value="男" />
                <Picker.Item label="女" value="女" />
              </Picker> */}
              <View style={styles.row}>
                <CheckBox
                  checked={gender === 1}
                  title="男"
                  onPress={() => setGender(1)}
                  checkedIcon="dot-circle-o"
                  uncheckedIcon="circle-o"
                />
                <CheckBox
                  checked={gender === 0}
                  title="女"
                  onPress={() => setGender(0)}
                  checkedIcon="dot-circle-o"
                  uncheckedIcon="circle-o"
                />
              </View>
            </View>

            <View style={styles.column}>
              
              
              {/* <Text style={{marginRight:15}}>{moment(date).format('YYYY-MM-DD')}</Text> */}
              
                {Platform.OS === "android" && (
                  <View style={{ ...styles.row, alignItems:"center" }}>
                  <Text style={{marginRight:15}}>您的生日：{moment(date).format('YYYY-MM-DD')}</Text>
                <Button onPress={showDatepicker} title="选择日期" />
                {show && (
                  <DateTimePicker
                  style={{marginLeft:0}}
                  testID="dateTimePicker"
                  value={date}
                  mode="date"
                  maximumDate={new Date()}
                  minimumDate={new Date("1970-01-01")}
                  is24Hour={false}
                  display="spinner"
                  locale="zh-CN" // 设置为中文语言代码
                  onChange={onChange}
                  />
                )} 
                  </View>
                  
                )}
                {Platform.OS === "ios"  && (
             
<View style={{ ...styles.row, alignItems:"center" }}>
                  <Text>您的生日：</Text>
                  <Text style={{ padding:8}}>{moment(date).format('YYYY-MM-DD')}</Text>
                  <Button onPress={showDatepicker} title="选择日期" />
                  <Modal
        animationType="slide"
        transparent={true}
        visible={show}
        onRequestClose={() => setShow(false)}
      >
                <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={{...styles.row, justifyContent: "space-between"}}>
            <View>
              <Button
              title="取消"
              onPress={() => {
                // 处理选择的值
                setTempDate(date);
                setShow(false);
              }}
            />
            </View>
            <View>
              <Button
              title="确认"
              onPress={() => {
                // 处理选择的值
                setDate(tempDate);
                setShow(false);
              }}
            />
            </View>
            </View>
                  <DateTimePicker
                  style={{height: 300, width: "100%"}}
                  textColor="black"
                    testID="dateTimePicker"
                    value={date}
                    mode="date"
                    maximumDate={new Date()}
                    minimumDate={new Date("1970-01-01")}
                    is24Hour={false}
                    display="spinner"
                    locale="zh-CN" // 设置为中文语言代码
                    onChange={onChangeIOS}
                  />
                  </View>
                  </View>
                  </Modal>
                </View>
                  
                )}
                {/* <TextInput
                  style={{ ...styles.input, width: 60 }}
                  onChangeText={setYear}
                  value={year}
                  placeholder=""
                  keyboardType="numeric"
                />
                <Text style={{ marginHorizontal: 10 }}>年</Text>
                <TextInput
                  style={{ ...styles.input, width: 60 }}
                  onChangeText={setMonth}
                  value={month}
                  placeholder=""
                  keyboardType="numeric"
                />
                <Text style={{ marginHorizontal: 10 }}>月</Text>
                <TextInput
                  style={{ ...styles.input, width: 60 }}
                  onChangeText={setDay}
                  value={day}
                  placeholder=""
                  keyboardType="numeric"
                />
                <Text style={{ marginHorizontal: 10 }}>日</Text> */}
              {/* </View> */}
              {/* <DatePicker
                style={{width: 200}}
                value={birthday}
                mode="date"
                dateFormat="dayofweek day month"
                minDate={new Date("1900-01-01")}
                maxDate={new Date("2023-01-01")}
                confirmBtnText="确定"
                cancelBtnText="取消"
                onDateChange={(date) => setBirthday(date)}
              /> */}
            </View>

            <View style={styles.column}>
              <Text>您的身高:</Text>
              <View style={{ ...styles.row, alignItems: "center" }}>
                {/* <TextInput
                  style={{ ...styles.input, width: 120 }}
                  onChangeText={(value) => setHeight(value)}
                  value={height}
                  placeholder="请输入身高"
                  keyboardType="numeric"
                /> */}
                <Picker
                  selectedValue={height}
                  onValueChange={(itemValue) => setHeight(itemValue)}
                  style={{width: 120}}
                >
                  {heightList.map((item, index) => {
                    return <Picker.Item label={`${item}`} value={item} key={`height-${index}`} />;
                  })}
                </Picker>
                <Text style={{ marginLeft: Platform.OS == "android" ? 0 :10 }}>厘米</Text>
              </View>

              {/* <Picker
                selectedValue={height}
                onValueChange={(itemValue) => setHeight(itemValue)}
              >
                {heightRange.map((value) => (
                  <Picker.Item
                    key={value}
                    label={String(value)}
                    value={value}
                  />
                ))}
              </Picker> */}
            </View>
            <View style={styles.column}>
              <Text>您的体重:</Text>
              <View style={{ ...styles.row, alignItems: "center" }}>
                
                {/* <TextInput
                  style={{ ...styles.input, width: 120 }}
                  onChangeText={(value) => setWeight(value)}
                  value={weight}
                  placeholder="请输入体重"
                  keyboardType="numeric"
                /> */}
                
                <Picker
                  selectedValue={weight}
                  onValueChange={(itemValue) => setWeight(itemValue)}
                  style={{width: 120}}
                >
                  {weightList.map((item, index) => {
                    return <Picker.Item label={`${item}`} value={item} key={`weight=${index}`} />;
                  })}
                </Picker>
                <Text style={{ marginLeft: Platform.OS == "android" ? 0 :10 }}>kg</Text>
              </View>
            </View>
          </View>
          <View
            style={{
              flexDirection: "row",
              position: "relative",
              justifyContent: "flex-end",
              gap: 10,
            }}
          >
            <TouchableOpacity style={styles.prevBtn} onPress={prevStep}>
              <Text
                style={{ fontSize: 20, color: "#b4dcfc", textAlign: "center" }}
              >
                上一步
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.nextBtn}
              onPress={() => {
                // const selectedYear = parseInt(year, 10);
                // const selectedMonth = parseInt(month, 10);
                // const selectedDay = parseInt(day, 10);
                // 验证年份是否在1970后
                // const currentYear = new Date().getFullYear();
                // if (selectedYear < 1970 || selectedYear > currentYear) {
                //   Alert.alert("请选择合法的年份","",[ { text: "确定", onPress: () => console.log("OK Pressed") }]);
                //   return;
                // }

                // 验证月份和日期是否在真实范围内
                // const selectedDate = new Date(
                //   selectedYear,
                //   selectedMonth - 1,
                //   selectedDay
                // );
                // if (
                //   selectedDate.getFullYear() !== selectedYear ||
                //   selectedDate.getMonth() !== selectedMonth - 1 ||
                //   selectedDate.getDate() !== selectedDay
                // ) {
                //   Alert.alert("请选择合法的月份和日期","",[ { text: "确定", onPress: () => console.log("OK Pressed") }]);
                //   return;
                // }

                // 验证身高是否在100-230之间并且是整数
                // const selectedHeight = parseInt(height, 10);
                // const heightRegex = /^\d+$/;
                // console.log(selectedHeight, !heightRegex.test(height))
                // if(height === "") {
                //   Alert.alert("请填写身高","",[ { text: "确定", onPress: () => console.log("OK Pressed") }]);
                //   return;
                // }
                // if (!heightRegex.test(height) || selectedHeight < 100 || selectedHeight > 230) {
                //   Alert.alert("身高请选择100-230之间的整数","",[ { text: "确定", onPress: () => console.log("OK Pressed") }]);
                //   return;
                // }


                // 验证体重是否在30-120之间并且是整数
                // const selectedWeight = parseInt(weight, 10);
                // const weightRegex = /^\d+$/;
                // if(weight === "") {
                //   Alert.alert("请填写体重","",[ { text: "确定", onPress: () => console.log("OK Pressed") }]);
                //   return;
                // }
                // if (!weightRegex.test(weight) || selectedWeight < 30 || selectedWeight > 120) {
                //   Alert.alert("体重请选择30-120之间的整数","",[ { text: "确定", onPress: () => console.log("OK Pressed") }]);
                //   return;
                // }
                nextStep();
              }}
            >
              <Text
                style={{ fontSize: 20, color: "white", textAlign: "center" }}
              >
                下一步
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {step === 3 && (
        <View style={styles.subContainer}>
          <Text>上传您的个人照片:</Text>
          {/* <Image style={styles.profileImage} source={profileImageSrc} /> */}
          <Button title="选择图片" onPress={chooseImage} />
          <View
            style={{
              flexDirection: "row",
              position: "relative",
              justifyContent: "flex-end",
              gap: 10,
            }}
          >
            <TouchableOpacity style={styles.prevBtn} onPress={prevStep}>
              <Text
                style={{ fontSize: 20, color: "#b4dcfc", textAlign: "center" }}
              >
                上一步
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.nextBtn} onPress={nextStep}>
              <Text
                style={{ fontSize: 20, color: "white", textAlign: "center" }}
              >
                下一步
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Other steps similar to the previous ones */}
      {/* {step === 4 && (
        <View style={styles.subContainer}>
          <Text>您的微信号是:</Text>
          <TextInput
            style={{ ...styles.input, marginTop: 10 }}
            onChangeText={setWeChat}
            value={weChat}
            placeholder="微信号"
          />
          <Text style={{color:"gray", marginTop: 5}}>因为我们聊天系统目前还不稳定，可能存在消息丢失的情况，我们鼓励你和对方在微信上交流。</Text>
          <View
            style={{
              flexDirection: "row",
              position: "relative",
              justifyContent: "flex-end",
              gap: 10,
            }}
          >
                       <TouchableOpacity style={styles.prevBtn} onPress={prevStep}>
              <Text
                style={{ fontSize: 20, color: "#b4dcfc", textAlign: "center" }}
              >
                上一步
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.nextBtn} onPress={()=>{
              if(weChat === "") {
                Alert.alert("请填写微信号","",[ { text: "确定", onPress: () => console.log("OK Pressed") }]);
                return;
              }
              // if(!validateWeChatNumber(weChat)) {
              //   Alert.alert("请填写正确的微信号","微信号的格式规则是以字母开头，长度为6-20个字符，可包含字母、数字、下划线和减号。",[ { text: "确定", onPress: () => console.log("OK Pressed") }]);
              //   return;
              // }
              nextStep()
            }}>
              <Text
                style={{ fontSize: 20, color: "white", textAlign: "center" }}
              >
                下一步
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )} */}

      {step === 4 && (
        <View style={styles.subContainer}>
          <Text>恭喜您完成了注册，完成Crucio的性格测试后即可开始匹配！</Text>
          <View
            style={{
              flexDirection: "row",
              position: "relative",
              justifyContent: "flex-end",
              gap: 10,
            }}
          >
            <TouchableOpacity style={styles.prevBtn} onPress={prevStep}>
              <Text
                style={{ fontSize: 20, color: "#b4dcfc", textAlign: "center" }}
              >
                上一步
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.nextBtn} onPress={handleSubmit}>
              <Text
                style={{ fontSize: 20, color: "white", textAlign: "center" }}
              >
                提交
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
    </ScrollView>
  </TouchableWithoutFeedback>

  );
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
  },
  subContainer: {
    flexDirection: "column",
    width: "100%",
    marginBottom: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 16,
  },
  header: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 20,
  },
  subHeader: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginVertical: 10,
  },
  column: {
    width: "100%",
    marginVertical: 10,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    padding: 10,
    borderRadius: 99,
  },
  prevBtn: {
    display: "flex",
    justifyContent: "center",
    itemAlign: "center",
    marginTop: 50,
    backgroundColor: "#fff",
    padding: 10,
    width: 120,
    height: 50,
    borderRadius: 99,
    borderColor: "#b4dcfc",
    borderWidth: 1,
    // position: "absolute",
    right: 20,
    bottom: 20,
  },
  nextBtn: {
    marginTop: 50,
    backgroundColor: "#b4dcfc",
    padding: 10,
    width: 120,
    height: 50,
    borderRadius: 99,
    // position: "absolute",
    right: 20,
    bottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
  },
});

export default RegisterProfile;
