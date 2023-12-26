import React, { useState, useContext } from "react";
import { StyleSheet, View, Alert } from "react-native";
import {
  Card,
  IconButton,
  Title,
  TextInput,
  Paragraph,
  Button,
  Appbar,
  Divider,
} from "react-native-paper";
import Const from "../../../sdk/const";
import axios from "axios";
import UserContext from "../../../sdk/context/userContext";
import { useNavigation } from "@react-navigation/native";

function EditableCard({
  title,
  shortTitle,
  cardId,
  target,
  route,
  deleteRoute,
  content,
  editing,
  setEditing,
  handleRemoveCard,
  cards,
  setCards,
}) {
  const { user, setUser } = useContext(UserContext);
  const navigation = useNavigation();
  // const [isEditing, setIsEditing] = useState(false);
 
  
  return (
    <Card style={styles.infoCard}>
      <Card.Content>
        <Title>{shortTitle}</Title>

        <Paragraph>{content}</Paragraph>
        <Button
          mode="text"
          style={{
            position: "absolute",
            top: 5,
            right: 5,
            borderRadius: 99,
            margin: 3,
            color: "#808080",

            zIndex: 999,
          }}
          onPress={() => {
            Alert.alert("确定删除该卡片吗？", "", [
              {
                text: "确定",
                onPress: () => {
                  handleRemoveCard(cardId, deleteRoute);
                },
              },
              { text: "取消", onPress: () => console.log("OK Pressed") },
            ]);
          }}
          textColor="#808080"
        >
          删除
        </Button>
      </Card.Content>
      <Card.Actions style={{ justifyContent: "flex-end" }}>
        <Button
          icon={"pencil"}
          mode="text"
          onPress={() => {
            navigation.navigate("EditingCard", {cardId, title, content ,cardRoute:route, cards, setCards, setEditing})
          }}
          textColor="#808080"
        >
          编辑
        </Button>
      </Card.Actions>
    </Card>
  );
}

const styles = StyleSheet.create({
  infoCard: {
    marginHorizontal: 10,
    marginBottom: 10,
    elevation: 2,
    backgroundColor: "#fff",
  },
});

export default EditableCard;
