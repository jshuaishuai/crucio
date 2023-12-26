import React, { useState, useContext, useCallback, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";
import { questionsComplex } from "./PersonalityQuestions";
import PreferenceContext from "../../../../sdk/context/preferenceContext";
import { Button } from "@rneui/themed";
import { Appbar } from "react-native-paper";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import RangeSlider from "rn-range-slider";
import Thumb from "../../../basic/Thumb";
import Rail from "../../../basic/Rail";
import RailSelected from "../../../basic/RailSelected";
import Label from "../../../basic/Label";
import Notch from "../../../basic/Notch";
import UserContext from "../../../../sdk/context/userContext";
import Const from "../../../../sdk/const";
import axios from "axios";
import questions from "../../../TAInfo/Feedback/FeedbackQuestions";

const Questionnaire = () => {
  const navigation = useNavigation();
  const [selectedOptions, setSelectedOptions]: any[] = useState([]);
  const { user, setUser } = useContext(UserContext);
  const [tempUser, setTempUser] = useState({ ...user });
  const { preference, setPreference } = useContext(PreferenceContext);
  const [finished, setFinished] = useState(true);
  const [tempPreference, setTempPreference] = useState({
    ...preference,
    userId: user["userId"],
  });
  //   年龄
  const renderThumb = useCallback(() => <Thumb />, []);
  const renderRail = useCallback(() => <Rail />, []);
  const renderRailSelected = useCallback(() => <RailSelected />, []);
  const renderLabel = useCallback((value: any) => <Label text={value} />, []);
  const renderNotch = useCallback(() => <Notch />, []);
  const handleValueChange = useCallback((min: number, max: number) => {
    setTempPreference({ ...tempPreference, ageMin: min, ageMax: max });
  }, []);

  const isFocused = useIsFocused();

  const questionsLength = user["gender"] == 1 ? questionsComplex.length - 1 : questionsComplex.length


  // 初次渲染时获取上次提交的选项
  useEffect(() => {
    const getPreference = async () => {
      try {
        const res = await axios.get(
          `${Const.baseURL}/user/UserPreference/getUserPreferenceChoiceByUserId/${user["userId"]}`
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
          const tempAnswersComplexChoice = questionsComplex.filter((question)=>{
            return question["type"] !== "range"
          }).map((question, index) => {
            if (question["type"] === "radio") {
              return res.data.data[question["name"]];
            }
          });
          const tempAnswersComplex = questionsComplex.filter((question)=>{
            return question["type"] !== "range"
          }).map((question, index) => {
            if (question["type"] === "radio") {
              return question["options"].findIndex((option) => {
                return option["optionId"] === tempAnswersComplexChoice[index];
              });
            }
          });
          console.log("🚀 ~ file: PreferenceBasic.tsx:72 ~ tempAnswersBasic ~ tempAnswersBasic:", tempAnswersComplex)
          setTempPreference({ ...res.data.data });
          setSelectedOptions(tempAnswersComplex);
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

  const handleOptionSelect = (questionIndex: number, optionIndex: number) => {
    const key = questionsComplex[questionIndex]["name"];
    const value =
      questionsComplex[questionIndex]["options"][optionIndex]["optionId"];
    const updatedOptions: any[] = [...selectedOptions];
    updatedOptions[questionIndex] = optionIndex;
    setSelectedOptions(updatedOptions);

    setTempPreference({ ...tempPreference, [key]: value });
    setFinished(false);
  };

  const rangeRenderOptions = (questionIndex: number) => {
    return (
      <RangeSlider
        style={styles.slider}
        min={18}
        max={50}
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
    return questionsComplex[questionIndex]["options"].map(
      (option, optionIndex) => {
        if (questionsComplex[questionIndex]["type"] === "radio") {
          const isSelected = selectedOptions[questionIndex] === optionIndex;
          return (
            <TouchableOpacity
              key={optionIndex}
              onPress={() => handleOptionSelect(questionIndex, optionIndex)}
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
    return questionsComplex.filter((question, index)=>{
      // 当用户为男时，跳过question["name"]=male的问题
      if(user["gender"] == 1 && question["name"] == "male"){
        return false
      }
      return true
    }).map((question, index) => {
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
        return (
          <View key={index} style={{ marginVertical: 15 }}>
            <Text style={{ marginBottom: 10 }}>{`${index + 1}、${
              question["text"]
            }`}</Text>
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
    console.log("真正选项", selectedOptionsActual)
    if (selectedOptionsActual.length < questionsLength) {
      isFinish = false;
    } else if (selectedOptionsActual.length === questionsLength) {
      isFinish = true;
    } else {
      isFinish = true; // 设置一个默认值，以防止未覆盖到的情况
    }

    if (isFinish) {
      setFinished(true);
      try {
        // console.log(JSON.stringify(user))
        //   请求体不加 UserPreferenceId


        
        const res = await axios.put(
          `${Const.baseURL}/user/UserPreference/insertUserPreference`,
          {...tempPreference, male: user["gender"] == 1 ? 4 : tempPreference["male"]}
        );
        //跳转登录页面
        if (res.data.code === 401) {
          setUser({});
          navigation.navigate("Login");
          return;
        }
        if (res.data.code === 400) {
          Alert.alert("提交失败", res.data.msg,[ { text: "确定", onPress: () => console.log("OK Pressed") }]);
          return;
        }

        setPreference({ ...tempPreference });
        console.log("用户信息提交成功");
        console.log(JSON.stringify(preference));
        Alert.alert("用户信息提交成功","",[ { text: "确定", onPress: () => console.log("OK Pressed") }]);
        navigation.navigate("BottomTabs");
      } catch (error) {
        console.error(error);
        Alert.alert(`提交失败：${error}`,"",[ { text: "确定", onPress: () => console.log("OK Pressed") }]);
      }
    } else {
      const undefinedIndices = [];
      for (let i = 0; i < questionsLength; i++) {
        console.log(selectedOptions[i])
        if (selectedOptions[i] === undefined || selectedOptions[i] === null || selectedOptions[i] === -1 || selectedOptions[i] === "-1") {
          undefinedIndices.push(i+1);
        }
      }
      Alert.alert(
        "请完成答卷再提交",
        `未完成题目序号：${undefinedIndices.join("，")}`,[ { text: "确定", onPress: () => console.log("OK Pressed") }]);
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
        <Appbar.Content title="恋爱偏好测试" onPress={() => {}} />
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
