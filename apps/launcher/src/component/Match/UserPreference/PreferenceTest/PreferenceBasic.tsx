import React, { useState, useContext, useCallback, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";
import { questionsBasic } from "./PersonalityQuestions";
import PreferenceContext from "../../../../sdk/context/preferenceContext";
import { Button } from "@rneui/themed";
import { Appbar } from "react-native-paper";
import { useNavigation,useIsFocused } from "@react-navigation/native";
import RangeSlider from "rn-range-slider";
import Thumb from "../../../basic/Thumb";
import Rail from "../../../basic/Rail";
import RailSelected from "../../../basic/RailSelected";
import Label from "../../../basic/Label";
import Notch from "../../../basic/Notch";
import UserContext from "../../../../sdk/context/userContext";
import Const from "../../../../sdk/const";
import axios from "axios";
import PreferenceFoundationContext from "../../../../sdk/context/preferenceFoundationContext";

const Questionnaire = () => {
  const navigation = useNavigation();
  const [selectedOptions, setSelectedOptions]: any[] = useState([]);
  const { user, setUser } = useContext(UserContext);
  const [tempUser, setTempUser] = useState({ ...user });
  const { preferenceFoundation, setPreferenceFoundation } = useContext(PreferenceFoundationContext);
  const [finished, setFinished] = useState(true);
  const [tempPreference, setTempPreference] = useState({
    ...preferenceFoundation,
    userId: user["userId"],
  });
  //   年龄
  const renderThumb = useCallback(() => <Thumb />, []);
  const renderRail = useCallback(() => <Rail />, []);
  const renderRailSelected = useCallback(() => <RailSelected />, []);
  const renderLabel = useCallback((value: any) => <Label text={value} />, []);
  const renderNotch = useCallback(() => <Notch />, []);
  const handleValueChange = useCallback((min: number, max: number) => {
    setTempPreference((prev)=>{return { ...prev, ageMin: min, ageMax: max}});
  }, []);

  const isFocused = useIsFocused();

  // 初次渲染时获取上次提交的选项
  useEffect(() => {
    const getPreference = async () => {
      try {
        const res = await axios.get(
          `${Const.baseURL}/user/UserPreference/getUserPreferenceFoundationByUserId/${user["userId"]}`
        );
        // 跳转登录页面
        if (res.data.code === 401) {
          setUser({});
          navigation.navigate("Login");
          return;
        }
        if (res.data.code === 400) {
          return;
        }
        if (res.data.code === 200) {
          console.log("获取用户信息成功");
          const tempAnswersBasic = questionsBasic.filter((question)=>{
            return question["type"] !== "range"
          }).map((question, index) => {
            if (question["type"] === "radio") {
              return res.data.data[question["name"]];
            }
          });
          console.log("当前的信息填写", tempAnswersBasic, JSON.stringify(res.data.data));
          setTempPreference({ ...res.data.data });
          setSelectedOptions(tempAnswersBasic);
        }
      } catch (error) {
        console.error(error);
        Alert.alert(`获取用户信息失败：${error}`,"",[ { text: "确定", onPress: () => console.log("OK Pressed") }]);
      }
    };
    getPreference();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', (e) => {
      if(!finished){
        e.preventDefault();
        Alert.alert("还未提交测试，是否确定退出","",[ { text: "确定", onPress: () => {
          navigation.dispatch(e.data.action);
        } }, { text: "返回", onPress: () => console.log("OK Pressed") }]);
      }
    });

    return unsubscribe;
  }, [navigation, isFocused, finished]);

  const handleOptionSelect = (questionIndex: number, optionId: number) => {
    const key = questionsBasic[questionIndex]["name"];
    const value = optionId
    const updatedOptions: any[] = [...selectedOptions];
    console.log("🚀 ~ file: PreferenceBasic.tsx:103 ~ handleOptionSelect ~ updatedOptions:", updatedOptions)
    updatedOptions[questionIndex] = optionId;
    
    console.log("lala", JSON.stringify({ ...tempPreference, [key]: value }))
    setTempPreference((prev)=>{return { ...prev, [key]: value }});
    setSelectedOptions(updatedOptions);
    setFinished(false);
  };

  const rangeRenderOptions = (questionIndex: number) => {
    return (
      <RangeSlider
        style={styles.slider}
        min={18}
        max={50}
        low={tempPreference["ageMin"]||18}
        high={tempPreference["ageMax"]||50}
        step={1}
        floatingLabel
        renderThumb={renderThumb}
        renderRail={renderRail}
        renderRailSelected={renderRailSelected}
        renderLabel={renderLabel}
        renderNotch={renderNotch}
        onValueChanged={handleValueChange}
      />
    );
  };
  const radioRenderOptions = (questionIndex: number) => {
    return questionsBasic[questionIndex]["options"].map(
      (option, optionIndex) => {
        if (questionsBasic[questionIndex]["type"] === "radio") {
          const isSelected = selectedOptions[questionIndex] === option.optionId;
          return (
            <TouchableOpacity
              key={optionIndex}
              onPress={() => handleOptionSelect(questionIndex, option.optionId)}
              style={{
                padding: 10,
                backgroundColor: isSelected ? "lightblue" : "white",
                borderRadius: 5,
                marginVertical: 5,
              }}
            >
              <Text>{option["value"]}</Text>
            </TouchableOpacity>
          );
        }
      }
    );
  };

  const renderQuestions = () => {
    return questionsBasic.map((question, index) => {
      if (question["type"] === "radio") {
        return (
          <View key={index} style={{ marginVertical: 15 }}>
            <Text style={{ marginBottom: 10 }}>{`${index + 1}、${
              question["text"]
            }`}</Text>
            {radioRenderOptions(index)}
          </View>
        );
      } else if (question["type"] === "range") {
        const ageMin = tempPreference["ageMin"] || 18;
        const ageMax = tempPreference["ageMax"] || 50;
        return (
          <View key={index} style={{ marginVertical: 15 }}>
            <View style={{flexDirection:"row", justifyContent:"space-between"}}>
            <Text style={{ marginBottom: 10 }}>{`${index + 1}、${
              question["text"]
            }`}</Text>
            <Text style={{ marginBottom: 10 }}>{`${ageMin}~${ageMax}`}</Text>
            </View>
            {rangeRenderOptions(index)}
          </View>
        );
      }
    });
  };

  const handleSubmit = async () => {
    //  判断是否完成答卷
    let isFinish;
    console.log(
      "🚀 ~ file: PreferenceBasic.tsx:163 ~ handleSubmit ~ selectedOptions:",
      selectedOptions
    );
    const selectedOptionsActual = selectedOptions.filter(
      (item) => item !== undefined && item !== null && item !== "-1" && item !== -1
    );
    if (selectedOptionsActual.length < questionsBasic.length - 1) {
      isFinish = false;
    } else if (selectedOptionsActual.length === questionsBasic.length - 1) {
      isFinish = true;
    } else {
      isFinish = false; // 设置一个默认值，以防止未覆盖到的情况
    }


    if (isFinish) {
      setFinished(true);
      try {
        // console.log(JSON.stringify(user))
        // 请求体不加 UserPreferenceId
        console.log("准备提交用户信息", JSON.stringify(tempPreference));
        const res = await axios.put(
          `${Const.baseURL}/user/UserPreference/insertUserPreferenceFoundation`,
          {...tempPreference, ageMin: tempPreference["ageMin"]||18, ageMax: tempPreference["ageMax"]||50}
        );
        // 跳转登录页面
        if (res.data.code === 401) {
          setUser({});
          navigation.navigate("Login");
          return;
        }
        if (res.data.code === 400) {
          Alert.alert("提交失败", res.data.msg,[ { text: "确定", onPress: () => console.log("OK Pressed") }]);
          return;
        }

        setPreferenceFoundation({ ...tempPreference });
        console.log("用户信息提交成功");
        console.log(JSON.stringify(preferenceFoundation));
        Alert.alert("用户信息提交成功","",[ { text: "确定", onPress: () => console.log("OK Pressed") }]);
        navigation.navigate("BottomTabs");
      } catch (error) {
        console.error(error);
        Alert.alert(`提交失败：${error}`,"",[ { text: "确定", onPress: () => console.log("OK Pressed") }]);
      }
    } else {
      const undefinedIndices = [];
      for (let i = 0; i < questionsBasic.length-1; i++) {
        console.log(selectedOptions[i])
        if (selectedOptions[i] === undefined || selectedOptions[i] === null || selectedOptions[i] === -1 || selectedOptions[i] === "-1") {
          undefinedIndices.push(i+1);
        }
      }
      console.log("🚀 ~ file: PreferenceBasic.tsx:206 ~ undefinedIndices ~ undefinedIndices:", undefinedIndices)
      Alert.alert("请完成答卷再提交", `未完成题目序号：${undefinedIndices.join("，")}`,[ { text: "确定", onPress: () => console.log("OK Pressed") }]);
    }
  };

  return (
    <View style={{ flex: 1, paddingHorizontal: 15, marginVertical: 5 }}>
      <Appbar.Header
        style={{ ...styles.appbar, justifyContent: "space-between" }}
      >
        <Appbar.BackAction
          onPress={() => {
            // if(finished){
              navigation.navigate("BottomTabs");
            // }else{
            //   Alert.alert("还未提交测试，是否确定退出","",[ { text: "确定", onPress: () => {navigation.navigate("BottomTabs");} }, { text: "返回", onPress: () => console.log("OK Pressed") }]);
            // }

          }}
        />
        <Appbar.Content title="基础信息选项" onPress={() => {}} />
      </Appbar.Header>
      {/* {Object.keys(tempUser).map((key) => {
        return <Text>{`${key}: ${tempUser[key]}`}</Text>;
      })} */}
      {/* {Object.keys(tempPreference).map((key) => {
        return <Text>{`${key}: ${tempPreference[key]}`}</Text>;
      })} */}
      <ScrollView>
        {renderQuestions()}
        <Button
          style={{ marginHorizontal: 50, marginVertical: 10 }}
          title="提交"
          radius={99}
          onPress={handleSubmit}
          color="#b4dcfc"
          size="lg"
        ></Button>
      </ScrollView>
    </View>
  );
};

export default Questionnaire;

const styles = StyleSheet.create({
  appbar: {
    backgroundColor: "transparent",
    elevation: 2,
  },
  slider: {
    marginHorizontal: 10,
  },
});
