import React, { useState, useEffect, useContext, useMemo } from "react";
import {
  View,
  Image,
  StyleSheet,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Platform,
  Linking,
  KeyboardAvoidingView,
  Keyboard,
  TouchableWithoutFeedback
} from "react-native";
import { Button as EButton } from "@rneui/themed";
import * as Clipboard from 'expo-clipboard';

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
import { useNavigation } from "@react-navigation/native";
import ImageContainer from "./ImageContainer/ImageContainer";
import * as ImagePicker from "expo-image-picker";
import EditableCard from "./EditableCard/EditableCard";
import { Dialog, CheckBox, ListItem } from "@rneui/themed";
import { color } from "@rneui/base";
import UserContext from "../../sdk/context/userContext";
import questionsSample from "./ProfileEdit/PersonalityTest/PersonalityQuestions";
import axios from "axios";
import Const from "../../sdk/const";

const cardList = [...Const.cardList];

export default function MyInfo() {
  const { user, setUser } = useContext(UserContext);
  const [avatarUrl, setAvatarUrl] = useState("/image/MyInfo/user-128.jpeg");
  const [cardListVisible, setCardListVisible] = useState(false);
  const [contactVisible, setContactVisible] = useState(false);
  const [shareVisible, setShareVisible] = useState(false);
  const [checked, setChecked] = useState(0);
  const [hasBlog, setHasBlog] = useState(false);
  // const [cardIsEditing, setCardIsEditing] = useState(false);

  const [userImages, setUserImages] = useState([]);

  // 获取导航器对象
  const navigation = useNavigation();
  const [copyTips, setCopyTips] = useState("");

  const [editing, setEditing] = useState(false);

  const [cards, setCards] = useState([cardList[0], cardList[1]]);



  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  const toggleDialog = () => {
    setCardListVisible(!cardListVisible);
  };
  const toggleContactDialog = () => {
    setContactVisible(!contactVisible);
  };

  const toggleShareDialog = () => {
    setShareVisible(!shareVisible);
  };


  useEffect(() => {
    console.log("userId", user["userId"]);
    axios
      .get(`${Const.baseURL}/user/blog/getBlogByUserID/${user["userId"]}`)
      .then((res) => {
        //跳转登录页面
        if (res.data.code === 401) {
          setUser({});
          navigation.navigate("Login");
        }

        const data = res.data;
        console.log("blogData", JSON.stringify(data));
        const filteredKeys = Object.keys(data).filter((key) =>
          key.includes("content")
        );
        console.log(
          "🚀 ~ file: MYInfo.tsx:93 ~ .then ~ filteredKeys:",
          filteredKeys
        );
        const tempCards = [];
        // cardList.forEach((obj) => {
        //   if (filteredKeys.includes(obj.target) && ) {
        //     obj.content = data[obj.target] || "编辑你的内容...";
        //   }
        // });
        filteredKeys.forEach((key) => {
          const card = cardList.find(
            (item) => item.target === key && data[key] !== null
          );
          if (card) {
            card.content = data[key] || "";
            tempCards.push(card);
          }
        });
        console.log("cards", cards);
        setCards([...tempCards]);

        const photoKeys = Object.keys(data).filter((key) =>
          key.includes("photo")
        );
        photoKeys.sort();
        console.log("photoKeys:", photoKeys);
        let photoUrls: string[] = [];
        photoKeys.forEach((item) => {
          photoUrls.push(data[item]);
        });
        console.log("photoUrls:", photoUrls);
        setAvatarUrl(photoUrls[0]);
        setUserImages([...photoUrls]);

        setHasBlog(true);
      })
      .catch((err) => {
        console.log(err);
        axios
          .post(`${Const.baseURL}/user/blog/insertBlog`, {
            userID: user["userId"],
          })
          .then((res) => {
            //跳转登录页面
            if (res.data.code === 401) {
              setUser({});
              navigation.navigate("Login");
              return;
            }

            if (res.data.code === 400) {
              Alert.alert(res.data.msg, "", [
                { text: "确定", onPress: () => console.log("OK Pressed") },
              ]);
            }

            console.log(res);
            console.log("首次增加blog成功");
            setHasBlog(true);
          })
          .catch((err) => {
            console.log(err);
            console.log("首次增加blog失败");
          });
      });
  }, []);

  const handleAddCard = async (
    id: string,
    title: string,
    shortTitle: string,
    target: string,
    route: string,
    deleteRoute: string,
    content: string
  ) => {
    const newCard = {
      id,
      title,
      shortTitle,
      target,
      route,
      deleteRoute,
      content,
    };

    try {
      if (hasBlog) {
        console.log(
          "该用户有blog表，开始put content...",
          route,
          user["userId"]
        );

        const updateContentRes = await axios.put(
          `${Const.baseURL}/user/blog/${route}/${user["userId"]}`,
          "heiqi2023",
          {
            headers: {
              "Content-Type": "text/plain",
            },
          }
        );
        console.log(JSON.stringify(updateContentRes.data));
        if (updateContentRes.data.code === 200) {
          console.log("更新content成功");
          setCards([...cards, newCard]);
        } else if (updateContentRes.data.code === 401) {
          setUser({});
          navigation.navigate("Login");
        } else if (updateContentRes.data.code === 400) {
          Alert.alert(updateContentRes.data.msg, "", [
            { text: "确定", onPress: () => console.log("OK Pressed") },
          ]);
        }
      } else {
        Alert.alert("未发现用户数据", "", [
          { text: "确定", onPress: () => console.log("OK Pressed") },
        ]);
      }
    } catch (error) {
      console.error(error);
      Alert.alert(`${error}`, "", [
        { text: "确定", onPress: () => console.log("OK Pressed") },
      ]);
    }
  };

  const handleRemoveCard = async (id: string, deleteRoute: string) => {
    console.log("开始删除卡片", id, deleteRoute);
    try {
      const updateContentRes = await axios.delete(
        `${Const.baseURL}/user/blog/${deleteRoute}/${user["userId"]}`
      );
      console.log("删除卡片的响应结果", JSON.stringify(updateContentRes.data));
      if (updateContentRes.data.code === 200) {
        console.log("删除content成功");
        const updatedCards = cards.filter((c) => c.id !== id);
        setCards(updatedCards);
      } else if (updateContentRes.data.code === 401) {
        setUser({});
        navigation.navigate("Login");
        return
      } else if (updateContentRes.data.code === 400) {
        Alert.alert(updateContentRes.data.msg, "", [
          { text: "确定", onPress: () => console.log("OK Pressed") },
        ]);
        return
      }
    } catch (error) {
      console.error(error);
      Alert.alert(`${error}`, "", [
        { text: "确定", onPress: () => console.log("OK Pressed") },
      ]);
    }
  }

  const selectImage = async (index: number) => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [3, 4],
        quality: 0.8,
        allowsMultipleSelection: false, // 设置为false，只能选择一个图像文件
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const selectedFile = result.assets[0];
        const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB
        let profileImageSrc = result.assets[0].uri;
        if (selectedFile.fileSize > MAX_FILE_SIZE) {
          Alert.alert("文件大小超过限制", "", [
            { text: "确定", onPress: () => console.log("OK Pressed") },
          ]);
          return;
        }

        let formData = new FormData();

        if (Platform.OS === "android") {
          profileImageSrc = result.assets[0].uri;
        } else {
          profileImageSrc = result.assets[0].uri.replace("file://", "");
        }
        const fileName = profileImageSrc.substring(
          profileImageSrc.lastIndexOf("/") + 1
        );
        console.log("图片位置,", profileImageSrc, fileName);
        let file = {
          uri: profileImageSrc,
          type: "multipart/form-data",
          name: `${fileName}`,
        };

        formData.append("file", file);

        try {
          const photo1Res = await axios.put(
            `${Const.baseURL}/user/blog/updatePhoto${index + 1}/${
              user["userId"]
            }`,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );
          if (photo1Res.data.code === 200) {
            console.log("上传图片成功...");
            userImages[index] = result.assets[0].uri;
            console.log("curr userImages:", userImages);
            setUserImages([...userImages]);
            if (index == 0) {
              setAvatarUrl(result.assets[0].uri);
            }
          } else if (photo1Res.data.code === 401) {
            setUser({});
            navigation.navigate("Login");
            return
          } else if (photo1Res.data.code === 400) {
            Alert.alert(photo1Res.data.msg, "", [
              { text: "确定", onPress: () => console.log("OK Pressed") },
            ]);
            return
          }
        } catch (error) {
          console.error(error);
          Alert.alert("因网络问题上传图片失败，可以稍后再试", "", [
            { text: "确定", onPress: () => console.log("OK Pressed") },
          ]);
        }
      }

      console.log(result.assets[0].uri);
      console.log(JSON.stringify(result.assets[0]));
    } catch (error) {
      console.error("选择图像时发生错误:", error);
    }
  };

  // 删除照片
  const onRemoveImage = async (index: number) => {
    try {
      const photo1Res = await axios.delete(
        `${Const.baseURL}/user/blog/deletePhoto${index + 1}ByUserID/${
          user["userId"]
        }`
      );
      if (photo1Res.data.code === 200) {
        console.log("删除图片成功...");
        userImages[index] = "";
        setUserImages([...userImages]);
      } else if (photo1Res.data.code === 401) {
        setUser({});
        navigation.navigate("Login");
        return;
      } else if (photo1Res.data.code === 400) {
        Alert.alert(photo1Res.data.msg, "", [
          { text: "确定", onPress: () => console.log("OK Pressed") },
        ]);
      }
    } catch (error) {
      console.error(error);
      Alert.alert("删除图片失败，请稍后手动删除", "", [
        { text: "确定", onPress: () => console.log("OK Pressed") },
      ]);
    }
  };

  const copyToClipboard = async (value:string) => {
    await Clipboard.setStringAsync(value);
    setCopyTips("复制成功！");
  };

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <View style={styles.container}>
      <ScrollView>
        <View style={styles.profileContainer}>
          <Card style={styles.profileCard}>
            <Card.Content style={styles.profileHeader}>
              <Avatar.Image size={60} source={{ uri: avatarUrl }} />
              <View style={{ marginLeft: 10 }}>
                <Title style={{ marginLeft: 10, padding: 0 }}>
                  {user["userName"] || "User"}
                </Title>
                <Button
                  icon={"pencil"}
                  mode="text"
                  // compact
                  style={styles.profileEdit}
                  textColor="#808080"
                  onPress={() => navigation.navigate("ProfileEdit")}
                >
                  编辑
                </Button>
              </View>
            </Card.Content>
          </Card>
          <ImageContainer
            images={userImages}
            onSelectImage={selectImage}
            onRemoveImage={onRemoveImage}
          />

          {/* TODO: 这里的需要同步到数据库 */}
          {cards.map((card) => (
            <EditableCard
              key={card.id}
              title={card.title}
              shortTitle={card.shortTitle}
              cardId={card.id}
              target={card.target}
              route={card.route}
              deleteRoute={card.deleteRoute}
              content={card.content}
              editing={editing}
              setEditing={setEditing}
              handleRemoveCard={handleRemoveCard}
              cards={cards}
              setCards={setCards}
            />
          ))}

          <Button
            icon="plus"
            mode="text"
            onPress={() => toggleDialog()}
            textColor="#808080"
            // style={{ position: "absolute", top: 260, right: 5 }}
          >
            添加
          </Button>

          <Dialog
            isVisible={cardListVisible}
            onBackdropPress={toggleDialog}
            overlayStyle={{ borderRadius: 20 }}
          >
            <Dialog.Title title="选择一个问题" />
            {cardList
              .filter((item) => {
                return !cards.some((card) => card.target === item.target);
              })
              .map((l, i) => (
                <CheckBox
                  key={i}
                  title={l.title}
                  containerStyle={{ backgroundColor: "white", borderWidth: 0 }}
                  checkedIcon="dot-circle-o"
                  uncheckedIcon="circle-o"
                  checked={checked === parseInt(l["id"], 10) - 1}
                  onPress={() => setChecked(parseInt(l["id"], 10) - 1)}
                />
              ))}

            <Dialog.Actions>
              <Dialog.Button
                title="确定"
                onPress={() => {
                  console.log(`Option ${checked} was selected!`);
                  handleAddCard(
                    cardList[checked].id,
                    cardList[checked].title,
                    cardList[checked].shortTitle,
                    cardList[checked].target,
                    cardList[checked].route,
                    cardList[checked].deleteRoute,
                    cardList[checked].content
                  );
                  toggleDialog();
                }}
              />
              <Dialog.Button title="取消" onPress={toggleDialog} />
            </Dialog.Actions>
          </Dialog>
          <Card style={styles.otherCard}>
            <Card.Content>
              <TouchableOpacity
                onPress={() => navigation.navigate("PersonalityTest")}
              >
                <View
                  style={{
                    ...styles.row,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <IconButton icon="account-heart" size={20} />
                    <Text>性格与价值观测试</Text>
                  </View>
                  <IconButton icon="chevron-right" size={20} />
                </View>
              </TouchableOpacity>

              <Divider />

              {/* <View
              style={{
                ...styles.row,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <IconButton icon="certificate" size={20} />
                <Text>学历认证</Text>
              </View>
              <IconButton icon="chevron-right" size={20} />
            </View> */}

              <TouchableOpacity onPress={() => toggleContactDialog()}>
                <View style={styles.row}>
                  <View style={{ ...styles.row, justifyContent: "flex-start" }}>
                    <IconButton icon="headset" size={20} />
                    <Text>客服与反馈</Text>
                  </View>

                  <IconButton icon="chevron-right" size={20} />
                </View>
              </TouchableOpacity>
              <Divider />
              <TouchableOpacity onPress={() => toggleShareDialog()}>
                {/* onPress={() => Linking.openURL("http://crucio.cn/index.html")} */}
                {/* > */}
                <View style={styles.row}>
                  <View style={{ ...styles.row, justifyContent: "flex-start" }}>
                    <IconButton icon="share-variant" size={20} />
                    <Text>推荐给他人</Text>
                  </View>

                  <IconButton icon="chevron-right" size={20} />
                </View>
              </TouchableOpacity>
              <Divider />
              <TouchableOpacity
                onPress={() => navigation.navigate("AccountAndSecurity")}
              >
                <View style={styles.row}>
                  <View style={{ ...styles.row, justifyContent: "flex-start" }}>
                    <IconButton icon="account" size={20} />
                    <Text>账号与安全</Text>
                  </View>

                  <IconButton icon="chevron-right" size={20} />
                </View>
              </TouchableOpacity>
              <Divider />
            </Card.Content>
          </Card>
          <Dialog
            isVisible={contactVisible}
            onBackdropPress={toggleContactDialog}
            overlayStyle={{ borderRadius: 20 }}
          >
            <Dialog.Title title="联系方式" />
            <Text selectable={true}>微信：A782262776</Text>
            <Text selectable={true}>QQ群：311390979</Text>
            <Text selectable={true}>邮箱：crucio2023@163.com</Text>
            <Dialog.Actions>
              <Dialog.Button
                title="关闭"
                onPress={() => setContactVisible(false)}
              />
            </Dialog.Actions>
          </Dialog>
          <Dialog
            isVisible={shareVisible}
            onBackdropPress={toggleShareDialog}
            overlayStyle={{ borderRadius: 20 }}
          >
            <Dialog.Title title="分享" />
            <Text selectable={true}>产品主页：https://crucio.cn</Text>
            <Text style={{color:"green"}}>{copyTips}</Text>
            <Dialog.Actions>
              <Dialog.Button
                title="复制"
                onPress={() => copyToClipboard("https://crucio.cn")}
              />
              <Dialog.Button
                title="关闭"
                onPress={() => {
                  setShareVisible(false)
                  setCopyTips("")}}
              />
            </Dialog.Actions>
          </Dialog>
        </View>
      </ScrollView>
      {/* {editing ? (
        
        <View
          style={{
            position: "absolute",
            zIndex: 99,
            width: "100%",
            height: "100%",
            backgroundColor: "#fff",
          }}
          // behavior="position" keyboardVerticalOffset = {120} // 可根据需要调整键盘垂直偏移量
        >
          <ScrollView>
          <View>
            <View>
              <Text style={styles.cardTitle}>{editCardTitle}</Text>
              <TextInput
                style={styles.input}
                value={editableContent}
                onChangeText={handleChangeContent}
                // numberOfLines={20}
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
                  handleSave({ route: editRoute });
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
          </ScrollView>
        </View>
        
      ) : null} */}
      {/* 弹窗 */}
    </View>
    </TouchableWithoutFeedback>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
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
