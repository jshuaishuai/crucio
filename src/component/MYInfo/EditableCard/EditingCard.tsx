import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Image,
  StyleSheet,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Appbar, Card, IconButton, Divider } from "react-native-paper";

import { Button as EButton } from "@rneui/themed";
import axios from "axios";
import UserContext from "../../../sdk/context/userContext";
import Const from "../../../sdk/const";
export default function EditingCard({route}) {
  const { user, setUser } = useContext(UserContext);
  const navigation = useNavigation();
  const [isCardEdited, setIsCardEdited] = useState(false);
  const { cardId, title, content, cardRoute, cards, setCards, setEditing } = route.params;
  const [editableContent, setEditableContent] = useState(content || "");


  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', (e) => {
      if(content !== editableContent){
        e.preventDefault();
        Alert.alert("还未提交，是否确定退出","",[ { text: "确定", onPress: () => {
          navigation.dispatch(e.data.action);
        } }, { text: "取消", onPress: () => console.log("OK Pressed") }]);
      }
    });

    return unsubscribe;
  }, [navigation, editableContent]);

  const handleSave = async ({ route }) => {
    const onSave = (newContent: any) => {
      // 更新卡片内容的逻辑
      const updatedCards = cards.map((c) =>
        c.id === cardId ? { ...c, content: newContent } : c
      );
      setCards(updatedCards);
    };

    console.log("开始更新content", route, user["userId"]);
    const updateContentRes = await axios.put(
      `${Const.baseURL}/user/blog/${route}/${user["userId"]}`,
      editableContent,
      {
        headers: {
          "Content-Type": "text/plain",
        },
      }
    );
    if (updateContentRes.data.code === 200) {
      console.log("更新content成功");
      setEditableContent("");
      onSave(editableContent);
      navigation.goBack();
    } else if (updateContentRes.data.code === 401) {
      setUser({});
      navigation.navigate("Login");
    } else if (updateContentRes.data.code === 400) {
      Alert.alert(updateContentRes.data.msg, "", [
        { text: "确定", onPress: () => console.log("OK Pressed") },
      ]);
    }
  };

  const handleChangeContent = (value) => {
    setEditableContent(value);

  };

  const handleBackPress = () => {
      navigation.goBack();
 
  };

  return (
    <ScrollView style={styles.container}>
      <KeyboardAvoidingView 
      behavior="padding"
      keyboardVerticalOffset={Platform.OS == "ios" ? 150 : 0}
      >
    <Appbar.Header style={styles.appbar}>
      <Appbar.BackAction
        onPress={async () => {
          handleBackPress();
        }}
      />
      <Appbar.Content title="编辑资料" />
    </Appbar.Header>
        <View>
          <View>
            <Text style={styles.cardTitle}>{title}</Text>
            <TextInput
              style={styles.input}
              value={editableContent}
              onChangeText={handleChangeContent}
              // numberOfLines={20}
              keyboardType="default"
              maxLength={600}
              multiline={true}
              textAlignVertical="top"
            />
          </View>
        </View>
        <View style={{ marginHorizontal: 20, marginVertical: 10 }}>
          <EButton
            style={{ marginHorizontal: 50, marginVertical: 10 }}
            title="确定"
            radius={99}
            onPress={() => {
              if (editableContent.length <= 0) {
                Alert.alert("内容不能为空", "", [
                  {
                    text: "确定",
                    onPress: () => console.log("OK Pressed"),
                  },
                ]);
              } else {
                handleSave({ route: cardRoute });
              }
            }}
            color="#b4dcfc"
            size="lg"
          ></EButton>
        </View>
        <View style={{ marginHorizontal: 20, marginVertical: 10 }}>
          <EButton
            style={{ marginHorizontal: 50, marginVertical: 10 }}
            title="返回"
            radius={99}
            onPress={() => {
              handleBackPress();
            }}
            type="outline"
            color="#b4dcfc"
            size="lg"
          ></EButton>
        </View>
        </KeyboardAvoidingView>
      </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    // flex: 1,
  },
  profileContainer: {
    flex: 1,
    backgroundColor: "#f4f5fa",
  },
  appbar: {
    backgroundColor: "white",
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    margin: 10,
    padding: 10,
  },
  input: {
    height: 350,
    marginBottom: 12,
    marginHorizontal: 12,
    borderRadius: 10,
    fontSize: 16,
    padding: 10,
    backgroundColor: "#f4f5fa",
  },
  profileCard: {
    margin: 10,
    backgroundColor: "#fff",
    elevation: 4,
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileEdit: {
    marginTop: 5,
    padding: 0,
  },
  infoCard: {
    marginHorizontal: 10,
    marginBottom: 10,
    backgroundColor: "#fff",
    elevation: 2,
  },
  otherCard: {
    marginHorizontal: 10,
    marginVertical: 10,
    backgroundColor: "#fff",
    elevation: 2,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flex: 1,
  },
});