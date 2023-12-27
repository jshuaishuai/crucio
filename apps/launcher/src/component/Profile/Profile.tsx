import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from "react-native";
import {
  Button,
  Card,
  Title,
  Paragraph,
  IconButton,
  Appbar,
  Avatar,
  Divider,
} from "react-native-paper";
import ImageCarousel from "../ImageCarousel/ImageCarousel";
import Const from "../../sdk/const";

function findTitleByTarget(target:string) {
    const foundCard = Const.cardList.find((card) => card.target === target);
    if (foundCard) {
      return foundCard.shortTitle;
    }
    return "更多"; // 如果找不到对应的 title，则返回 null 或其他你认为合适的值
  }

const PersonalInfo = ({ info }) => {
  return (
    <View style={styles.personalInfoContainer}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          padding:5
        }}
      >
        <Text
          style={styles.personalInfoText}
        >{`${info.age}岁·${info.height}cm·${info.weight}kg`}</Text>
        <Text style={styles.personalInfoText}>{`${info.identity}`}</Text>
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          padding:5
        }}
      >
        <Text style={styles.personalInfoText}>{`家乡: ${info.hometown}`}</Text>
        <Text style={styles.personalInfoText}>{`现居: ${info.address}`}</Text>
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "flex-start",
          alignItems: "center",
          padding:5
        }}
      >
        <Text
          style={styles.personalInfoText}
        >{`${info.school}·${info.education}`}</Text>
      </View>
    </View>
  );
};

const BoxContainer = ({ title, content, isOwner, onEdit }) => {
  const [editMode, setEditMode] = useState(false);
  const [editContent, setEditContent] = useState(content);

  const handleEdit = () => {
    setEditMode(!editMode);
    if (editMode) {
      onEdit(title, editContent);
    }
  };

  return (
    <View style={styles.boxContainer}>
      <View style={styles.boxTitleContainer}>
        <Text style={styles.boxTitle}>{title}</Text>
        {isOwner && (
          <TouchableOpacity onPress={handleEdit}>
            <Text>{editMode ? "保存" : "编辑"}</Text>
          </TouchableOpacity>
        )}
      </View>
      {editMode ? (
        <TextInput
          style={styles.boxContent}
          onChangeText={setEditContent}
          value={editContent}
        />
      ) : (
        <Text style={styles.boxContent}>{content}</Text>
      )}
    </View>
  );
};

const Profile = ({ profileData, isOwner, onEdit }) => {
  const { images, info, descriptions } = profileData;

  return (
    <View style={styles.container}>
      <ImageCarousel images={images} width="95%" height={800} />
      <PersonalInfo info={info} />
      {descriptions.map((item, index) => (
        <BoxContainer
          key={index}
          title={findTitleByTarget(Object.keys(item)[0])}
          content={item[Object.keys(item)[0]]}
          isOwner={isOwner}
          onEdit={onEdit}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    width: "100%",
    height: "100%",
    padding: 0,
  },
  personalInfoContainer: {
    margin: 10,
    padding: 15,
    backgroundColor: "rgba(220,220,220,0.3)",
    borderRadius: 8,
  },
  personalInfoText: {
    fontSize: 16,
    textAlign: "left",
    marginBottom: 5,
  },
  boxContainer: {
    margin: 10,
    // borderRadius: 8,
    borderWidth:0,
    backgroundColor: "#fff",
  },
  boxTitleContainer: {
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  boxTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  boxContent: {
    margin: 10,
    fontSize: 16,
  },
});

export default Profile;
