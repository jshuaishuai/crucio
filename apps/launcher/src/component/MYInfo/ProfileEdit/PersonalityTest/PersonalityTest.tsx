import React, { useState, useContext, useCallback, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";
import questions from "./PersonalityQuestions";
import MetricsContext from "../../../../sdk/context/metricsContext";
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

const Questionnaire = () => {
  const navigation = useNavigation();
  const [selectedOptions, setSelectedOptions]: any[] = useState([]);
  const { user, setUser } = useContext(UserContext);
  const [tempUser, setTempUser] = useState({ ...user });
  const { metrics, setMetrics } = useContext(MetricsContext);
  const [finished, setFinished] = useState(true);
  const [tempMetrics, setTempMetrics] = useState({
    ...metrics,
    userId: user["userId"],
  });
  const [tempAnswerList, setTempAnswerList] = useState({});
  //   年龄
  const renderThumb = useCallback(() => <Thumb />, []);
  const renderRail = useCallback(() => <Rail />, []);
  const renderRailSelected = useCallback(() => <RailSelected />, []);
  const renderLabel = useCallback((value: any) => <Label text={value} />, []);
  const renderNotch = useCallback(() => <Notch />, []);
  const handleValueChange = useCallback((min: number, max: number) => {
    setTempMetrics({ ...tempMetrics, ageMin: min, ageMax: max });
  }, []);

  const isFocused = useIsFocused();

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
    const key = questions[questionIndex]["name"];
    const value = questions[questionIndex]["options"][optionIndex]["optionId"];
    const updatedOptions: any[] = [...selectedOptions];
    updatedOptions[questionIndex] = optionIndex;
    setSelectedOptions(updatedOptions);
    setTempAnswerList({
      ...tempAnswerList,
      [questionIndex]: { key: key, value: value },
    });
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
    return questions[questionIndex]["options"].map((option, optionIndex) => {
      if (questions[questionIndex]["type"] === "radio") {
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
    });
  };

  const renderQuestions = () => {
    return questions.map((question, index) => {
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
    const result = {};
    console.log("tempAnswerList: ", JSON.stringify(tempAnswerList));

    for (const key in tempAnswerList) {
      const item = tempAnswerList[key];
      const { key: itemKey, value } = item;

      if (result.hasOwnProperty(itemKey)) {
        result[itemKey] = value;
        // 累加开关
        // result[itemKey] += value;
      } else {
        result[itemKey] = value;
      }
      // 第二道题赋分两种情况
      // if(item === "1"){
      //   if (result.hasOwnProperty("intellectual")) {
      //     result["intellectual"] += value;
      //   } else {
      //     result["intellectual"] = value;
      //   }
      // }
    }
    console.log("tempMetrics adn result: ", JSON.stringify({
      ...tempMetrics,
      ...result,
    }));
    //  判断是否完成答卷
    let isFinish;
    const selectedOptionsActual = selectedOptions.filter(item => item !== undefined);
    if (selectedOptionsActual.length < questions.length) {
      isFinish = false;
    } else if (selectedOptionsActual.length === questions.length) {
      isFinish = true;
    } else {
      isFinish = false; // 设置一个默认值，以防止未覆盖到的情况
    }

    if (isFinish) {
      setFinished(true);
      try {
        // console.log(JSON.stringify(user))
        //   请求体不加 metricId
        const res = await axios.put(
          `${Const.baseURL}/user/info/insertMetrics`,
          {
            ...tempMetrics,
            ...result,
          }
        );
        //跳转登录页面
        console.log(
          "🚀 ~ file: PersonalityTest.tsx:142 ~ handleSubmit ~ res:",
          JSON.stringify(res.data)
        );
        if (res.data.code === 401) {
          setUser({});
          navigation.navigate("Login");
          return;
        }
        if (res.data.code === 400) {
          Alert.alert("提交失败", res.data.msg,[ { text: "确定", onPress: () => console.log("OK Pressed") }]);
          return;
        }

        await setTempMetrics({ ...tempMetrics, ...result });
        await setMetrics({ ...tempMetrics });
        console.log("用户信息提交成功");
        console.log(JSON.stringify(metrics));
        Alert.alert("用户信息提交成功","",[ { text: "确定", onPress: () => console.log("OK Pressed") }]);
        navigation.navigate("BottomTabs");
      } catch (error) {
        console.error(error);
        Alert.alert(`提交失败：${error}`,"",[ { text: "确定", onPress: () => console.log("OK Pressed") }]);
      }
    } else {
      const undefinedIndices = [];
      for (let i = 0; i < questions.length; i++) {
        console.log(selectedOptions[i])
        if (selectedOptions[i] === undefined) {
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
        <Appbar.Content title="用户特质选项" onPress={() => {}} />
      </Appbar.Header>
      {/* {Object.keys(tempUser).map((key) => {
        return <Text>{`${key}: ${tempUser[key]}`}</Text>;
      })} */}
      {/* {Object.keys(tempAnswerList).map((key) => {
        return <Text>{`${key}: ${JSON.stringify(tempAnswerList[key])}`}</Text>;
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
