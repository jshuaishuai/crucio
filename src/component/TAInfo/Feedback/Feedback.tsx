import React, { useState, useContext, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  TextInput,
} from "react-native";
import { Rating, AirbnbRating } from "react-native-ratings";
import questions from "./FeedbackQuestions";
import PreferenceContext from "../../../sdk/context/preferenceContext";
import { Button } from "@rneui/themed";
import { Appbar } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import RangeSlider from "rn-range-slider";
import Thumb from "../../basic/Thumb";
import Rail from "../../basic/Rail";
import RailSelected from "../../basic/RailSelected";
import Label from "../../basic/Label";
import Notch from "../../basic/Notch";
import UserContext from "../../../sdk/context/userContext";
import CoupleUserContext from "../../../sdk/context/coupleContext";
import Const from "../../../sdk/const";
import axios from "axios";

const Feedback = ({ route }) => {
  const { exId } = route.params;
  const navigation = useNavigation();
  const [selectedOptions, setSelectedOptions]: any[] = useState([]);
  const [selectedCheckboxOptions, setSelectedCheckboxOptions]: any[] = useState(
    []
  );
  const { user, setUser } = useContext(UserContext);
  const { coupleUser, setCoupleUser } = useContext(CoupleUserContext);
  const [tempUser, setTempUser] = useState({ ...user });
  // const { preference, setPreference } = useContext(PreferenceContext);
  const [tempFeedback, setTempFeedback] = useState({
    userId: user["userId"],
    user2Id: exId,
  });

  const handleOptionSelect = (questionIndex: number, optionIndex: number) => {
    const key = questions[questionIndex]["name"];
    const value = questions[questionIndex]["options"][optionIndex]["optionId"];
    const updatedOptions: any[] = [...selectedOptions];
    updatedOptions[questionIndex] = optionIndex;
    setSelectedOptions(updatedOptions);

    setTempFeedback({ ...tempFeedback, [key]: value });
  };

  const inputRenderOptions = (questionIndex: number) => {
    return (
      <View
        style={{
          borderColor: "#000000",
          borderWidth: 1,
          height: 100,
          borderRadius: 8,
        }}
      >
        <TextInput
          editable
          defaultValue=""
          multiline
          numberOfLines={4}
          maxLength={300}
          placeholder="请填写..."
          style={{ padding: 10 }}
          value={tempFeedback["supplementQ"] || ""}
          onChangeText={(value) => {
            setTempFeedback({ ...tempFeedback, supplementQ: value });
          }}
        />
      </View>
    );
  };

  const ratingRenderOptions = (questionIndex: number) => {
    return (
      <AirbnbRating
        count={10}
        reviews={[
          "非常不满意",
          "非常不满意",
          "非常不满意",
          "满意",
          "满意",
          "满意",
          "满意",
          "满意",
          "非常满意",
          "非常满意",
        ]}
        defaultRating={10}
        size={20}
        reviewSize={15}
        reviewColor="lightblue"
        selectedColor="lightblue"
        ratingContainerStyle={{ margin: 0, width: "100%" }}
        onFinishRating={(rating) => {
          setTempFeedback({ ...tempFeedback, overallPoint: rating });
        }}
      />
    );
  };

  const handleCheckboxOptionSelect = (
    questionIndex: number,
    optionIndex: number
  ) => {
    const key = questions[questionIndex]["name"];
    const value = questions[questionIndex]["options"][optionIndex]["value"];
    const updatedOptions: any[] = [...selectedCheckboxOptions];

    // 检查当前选项是否已选择
    const isOptionSelected = updatedOptions.includes(value);

    if (isOptionSelected) {
      // 如果已选择，则从已选择的选项中移除该选项
      updatedOptions.splice(updatedOptions.indexOf(value), 1);
    } else {
      // 如果未选择，则添加该选项到已选择的选项中
      updatedOptions.push(value);
    }

    setSelectedCheckboxOptions(updatedOptions);

    setTempFeedback((prevTempFeedback) => ({
      ...prevTempFeedback,
      [key]: updatedOptions.join(","),
    }));
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
  const checkboxRenderOptions = (questionIndex: number) => {
    return questions[questionIndex]["options"].map((option, optionIndex) => {
      if (questions[questionIndex]["type"] === "checkbox") {
        const value = questions[questionIndex]["options"][optionIndex]["value"];
        const isSelected = selectedCheckboxOptions.includes(value); // 检查选项是否已选择
        return (
          <TouchableOpacity
            key={optionIndex}
            onPress={() =>
              handleCheckboxOptionSelect(questionIndex, optionIndex)
            }
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
      } else if (question["type"] === "rating") {
        return (
          <View key={index} style={{ marginVertical: 15 }}>
            <Text style={{ marginBottom: 10 }}>{`${index + 1}、${
              question["text"]
            }`}</Text>
            {ratingRenderOptions(index)}
          </View>
        );
      } else if (question["type"] === "checkbox") {
        return (
          <View key={index} style={{ marginVertical: 15 }}>
            <Text style={{ marginBottom: 10 }}>{`${index + 1}、${
              question["text"]
            }`}</Text>
            {checkboxRenderOptions(index)}
          </View>
        );
      } else if (question["type"] === "input") {
        return (
          <View key={index} style={{ marginVertical: 15 }}>
            <Text style={{ marginBottom: 10 }}>{`${index + 1}、${
              question["text"]
            }`}</Text>
            {inputRenderOptions(index)}
          </View>
        );
      }
    });
  };

  const handleSubmit = async () => {
    try {
      // console.log(JSON.stringify(user))
      //   请求体不加 UserPreferenceId
      const res = await axios.post(
        `${Const.baseURL}/user/feedback/insertFeedBack`,
        tempFeedback
      );
      //跳转登录页面
      if (res.data.code === 401) {
        setUser({});
        navigation.navigate("Login");
      }

      // setFeedback({ ...tempFeedback });
      console.log("用户反馈提交成功");
      Alert.alert("用户反馈提交成功","",[ { text: "确定", onPress: () => console.log("OK Pressed") }]);
      navigation.navigate("BottomTabs");
    } catch (error) {
      console.error(error);
      Alert.alert(`提交失败：${error}`,"",[ { text: "确定", onPress: () => console.log("OK Pressed") }]);
    }
  };

  return (
    <View style={{ flex: 1, paddingHorizontal: 15, marginVertical: 5 }}>
      <Appbar.Header
        style={{ ...styles.appbar, justifyContent: "space-between" }}
      >
        <Appbar.BackAction
          onPress={() => {
            navigation.navigate("BottomTabs");
          }}
        />
        <Appbar.Content title="反馈" onPress={() => {}} />
      </Appbar.Header>
      {/* {Object.keys(selectedOptions).map((key) => {
        return <Text>{`${key}`}</Text>;
      })} */}
      {/* {Object.keys(tempFeedback).map((key) => {
        return <Text>{`${key}: ${tempFeedback[key]}`}</Text>;
      })} */}
      {/* <Text>{JSON.stringify(tempFeedback)}</Text> */}
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

export default Feedback;

const styles = StyleSheet.create({
  appbar: {
    backgroundColor: "transparent",
    elevation: 2,
  },
  slider: {
    marginHorizontal: 10,
  },
});
