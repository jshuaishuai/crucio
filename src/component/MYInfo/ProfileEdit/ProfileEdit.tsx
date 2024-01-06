import React, { useState, useContext, useEffect } from "react";
import {
  ScrollView,
  StyleSheet,
  TextInput,
  Switch,
  View,
  Text,
  TouchableOpacity,
  TouchableHighlight,
  Alert,
} from "react-native";
import { Button, CheckBox } from "@rneui/themed";
import moment from 'moment';
import { DatePicker } from '@ant-design/react-native'
import { Appbar, Card, IconButton, Divider } from "react-native-paper";
import { Picker } from "@react-native-picker/picker";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import UserContext from "../../../sdk/context/userContext";
import axios from "axios";
import Const from "../../../sdk/const";
import { educationList, industryList, addressList, heightList, weightList } from "../../../sdk/const/dataList";

interface IForm {
  [key: string]: any;
}

export default function ProfileEdit() {
  const { user, setUser } = useContext(UserContext);
  const [tempUser, setTempUser] = useState({ ...user });

  // 个人设置view控制
  const [isAddressShow, setIsAddressShow] = useState(false);
  const [isHomeTownShow, setIsHomeTownShow] = useState(false);
  const [isEducationShow, setIsEducationShow] = useState(false);
  const [isIndustryShow, setIsIndustryShow] = useState(false);
  const [isHeightShow, setIsHeightShow] = useState(false);
  const [isWeightShow, setIsWeightShow] = useState(false);
  const [currAddressA, setCurrAddressA] = useState(user["addressA"] || addressList[0].province);
  const [currAddressB, setCurrAddressB] = useState(user["addressB"] || addressList[0]?.cities[0]);
  const [currHomeTownA, setCurrHomeTownA] = useState(user["homeTownA"] || addressList[0].province);
  const [currHomeTownB, setCurrHomeTownB] = useState(user["homeTownB"] || addressList[0]?.cities[0]);
  const [currEducation, setCurrEducation] = useState(user["education"] || 1);
  const [currIndustry, setCurrIndustry] = useState(user["identity"] || industryList[0]);
  const [currHeight, setCurrHeight] = useState(heightList[70]);
  const [currWeight, setCurrWeight] = useState(weightList[30]);
  const [finished, setFinished] = useState(true);

  const navigation = useNavigation();
  const isFocused = useIsFocused();


  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', (e) => {
      if (!finished) {
        e.preventDefault();
        Alert.alert("还未提交，是否确定退出", "", [{
          text: "确定", onPress: () => {
            navigation.dispatch(e.data.action);
          }
        }, { text: "返回", onPress: () => console.log("OK Pressed") }]);
      }
    });

    return unsubscribe;
  }, [navigation, isFocused, finished]);

  // 处理省份选择变化
  const handleProvinceChange = (province) => {
    setCurrAddressA(province);
    const tempAddressB = addressList.find((item) => item.province === province)?.cities[0];
    setCurrAddressB(tempAddressB);
  };

  // 处理城市选择变化
  const handleCityChange = (city) => {
    setCurrAddressB(city);
  };
  // 处理家乡省份选择变化
  const handleHometownProvinceChange = (province) => {
    setCurrHomeTownA(province);
    const tempHomeTownB = addressList.find((item) => item.province === province)?.cities[0];
    setCurrHomeTownB(tempHomeTownB);
  };

  // 处理家乡城市选择变化
  const handleHometownCityChange = (city) => {
    setCurrHomeTownB(city);
  };

  //   useEffect( () => {
  //     if (user.userId) {
  //       try {
  //         axios.get(`${Const.baseURL}user/getUserById/${user["userId"]}`).then((res)=>{
  //             setUser({...res.data.data})
  //           })
  //       } catch (error) {
  //         console.error(error)
  //       }
  //     }
  //   }, []);

  const handleSubmit = async () => {
    if (!tempUser["userName"]) {
      Alert.alert("昵称不能为空", "", [
        { text: "确定", onPress: () => console.log("OK Pressed") },
      ]);
      return;
    }
    // if (!tempUser["weChat"]) {
    //   Alert.alert("微信号不能为空", "", [
    //     { text: "确定", onPress: () => console.log("OK Pressed") },
    //   ]);
    //   return;
    // }
    try {
      // TODO: 得加个await，等有返回结果后
      // console.log(JSON.stringify(user));
      const res = await axios.put(
        `${Const.baseURL}/user/Register/userSet`,
        tempUser
      );
      // await axios.put(`${Const.baseURL}/user/Register/userSet`, user);
      console.log("用户信息提交成功: " + JSON.stringify(res.data));
      if (res.data.code === 401) {
        setUser({});
        navigation.navigate("Login");
        return
      }

      if (res.data.code === 400) {
        Alert.alert(res.data.msg, "", [{ text: "确定", onPress: () => console.log("OK Pressed") }]);
        return;
      }
      if (res.data.code === 200) {
        setFinished(true)
        setUser({ ...tempUser });
        navigation.navigate("BottomTabs");
      }


    } catch (error) {
      console.error(error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Appbar.Header style={styles.appbar}>
        <Appbar.BackAction
          onPress={async () => {
            navigation.navigate("BottomTabs");
          }}
        />
        <Appbar.Content title="编辑资料" />
      </Appbar.Header>
      {/* {Object.keys(user).map((key) => {
        return <Text>{`${key}: ${user[key]}`}</Text>;
      })} */}

      <View style={[styles.row]}>
        <View style={styles.content}>
          <View style={styles.leftPanel}>
            <View style={styles.leftTitle}>
              <Text
                style={{
                  fontSize: 15,
                  color: "#262626",
                }}
              >
                昵称
              </Text>
            </View>
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              defaultValue={tempUser["userName"]}
              underlineColorAndroid={"white"}
              onChangeText={(value) => {
                setTempUser({ ...tempUser, userName: value });
                setFinished(false)
              }}
              placeholder="请填写昵称"
            />
          </View>
        </View>
      </View>
      <Divider />

      {/* 微信 */}
      {/* <TouchableHighlight
        // onPress={() => setIsEducationShow(!isEducationShow)}
        underlayColor="#E6E6E6"
      >
        <View style={[styles.row]}>
          <View style={styles.content}>
            <View style={styles.leftPanel}>
              <View style={styles.leftTitle}>
                <Text
                  style={{
                    fontSize: 15,
                    color: "#262626",
                  }}
                >
                  微信号
                </Text>
              </View>
            </View>

            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <TextInput
                style={{ ...styles.textInput, marginRight: 20 }}
                defaultValue={`${tempUser["weChat"] || ""}`}
                //   editable={false}
                placeholder="请填写微信号"
                underlineColorAndroid={"white"}
                onChangeText={(value) => {
                  setTempUser({ ...tempUser, weChat: value });
                  setFinished(false)
                }}
              />
            </View>
          </View>
        </View>
      </TouchableHighlight>
      <Divider /> */}

      <View style={[styles.row]}>
        <View style={styles.content}>
          <View style={styles.leftPanel}>
            <View style={styles.leftTitle}>
              <Text
                style={{
                  fontSize: 15,
                  color: "#262626",
                }}
              >
                性别
              </Text>
            </View>
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              placeholder={tempUser["gender"] == 0 ? "女" : "男"}
              editable={false}
              onChangeText={(value) => { }}
            />
          </View>
        </View>
      </View>
      <Divider />
      <View style={[styles.row]}>
        <View style={styles.content}>
          <View style={styles.leftPanel}>
            <View style={styles.leftTitle}>
              <Text
                style={{
                  fontSize: 15,
                  color: "#262626",
                }}
              >
                生日
              </Text>
            </View>
          </View>
          <DatePicker
            mode="date"
            title="请选择"
            onChange={(value) => {
              setTempUser({ ...tempUser, birthDay: moment(value).format('YYYY-MM-DD') });
            }}
            format="YYYY-MM-DD">
            <Text style={styles.inputContainer}>{tempUser["birthDay"]}</Text>
          </DatePicker>
        </View>
      </View>
      <Divider />

      {/* 身高 */}
      <TouchableHighlight
        onPress={() => setIsHeightShow(!isHeightShow)}
        underlayColor="#E6E6E6"
      >
        <View style={[styles.row]}>
          <View style={styles.content}>
            <View style={styles.leftPanel}>
              <View style={styles.leftTitle}>
                <Text
                  style={{
                    fontSize: 15,
                    color: "#262626",
                  }}
                >
                  身高
                </Text>
              </View>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center", marginRight: 15 }}>
              {/* <TextInput
              style={styles.textInput}
              defaultValue={`${tempUser["height"]}`}
              //   editable={false}
              underlineColorAndroid={"white"}
              keyboardType="numeric"
              onChangeText={(value) => {
                setTempUser({ ...tempUser, height: parseInt(value, 10) });
              }}
            /> */}
              <Text>{`${tempUser["height"] || "待填写"} 厘米`}</Text>
            </View>
          </View>
        </View>
      </TouchableHighlight>
      <Divider />

      {/* 体重 */}
      <TouchableHighlight
        onPress={() => setIsWeightShow(!isWeightShow)}
        underlayColor="#E6E6E6"
      >
        <View style={[styles.row]}>
          <View style={styles.content}>
            <View style={styles.leftPanel}>
              <View style={styles.leftTitle}>
                <Text
                  style={{
                    fontSize: 15,
                    color: "#262626",
                  }}
                >
                  体重
                </Text>
              </View>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center", marginRight: 15 }}>
              {/* <TextInput
              style={styles.textInput}
              defaultValue={`${tempUser["weight"]}`}
              //   editable={false}
              underlineColorAndroid={"white"}
              keyboardType="numeric"
              onChangeText={(value) => {
                setTempUser({ ...tempUser, weight: parseInt(value, 10) });
              }}
            /> */}
              <Text>{`${tempUser["weight"] || "待填写"}kg`}</Text>
            </View>
          </View>
        </View>
      </TouchableHighlight>
      <Divider />

      {/* 地址 */}
      <TouchableHighlight
        onPress={() => setIsAddressShow(!isAddressShow)}
        underlayColor="#E6E6E6"
      >
        <View style={[styles.row]}>
          <View style={styles.content}>
            <View style={styles.leftPanel}>
              <View style={styles.leftTitle}>
                <Text
                  style={{
                    fontSize: 15,
                    color: "#262626",
                  }}
                >
                  所在城市
                </Text>
              </View>
            </View>

            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text>{`${tempUser["addressA"] || "待填写"} ${tempUser["addressB"] || ""
                }`}</Text>
              <IconButton icon="chevron-right" size={20} />
            </View>
          </View>
        </View>
      </TouchableHighlight>

      <Divider />
      {/* 家乡 */}
      <TouchableHighlight
        onPress={() => setIsHomeTownShow(!isHomeTownShow)}
        underlayColor="#E6E6E6"
      >
        <View style={[styles.row]}>
          <View style={styles.content}>
            <View style={styles.leftPanel}>
              <View style={styles.leftTitle}>
                <Text
                  style={{
                    fontSize: 15,
                    color: "#262626",
                  }}
                >
                  家乡
                </Text>
              </View>
            </View>

            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text>{`${tempUser["homeTownA"] || "待填写"} ${tempUser["homeTownB"] || ""
                }`}</Text>
              <IconButton icon="chevron-right" size={20} />
            </View>
          </View>
        </View>
      </TouchableHighlight>

      <Divider />

      {/* 毕业院校 */}
      <TouchableHighlight
        // onPress={() => setIsEducationShow(!isEducationShow)}
        underlayColor="#E6E6E6"
      >
        <View style={[styles.row]}>
          <View style={styles.content}>
            <View style={styles.leftPanel}>
              <View style={styles.leftTitle}>
                <Text
                  style={{
                    fontSize: 15,
                    color: "#262626",
                  }}
                >
                  毕业院校
                </Text>
              </View>
            </View>

            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <TextInput
                style={{ ...styles.textInput, marginRight: 20 }}
                defaultValue={`${tempUser["school"] || ""}`}
                //   editable={false}
                placeholder="请填写学校"
                underlineColorAndroid={"white"}
                onChangeText={(value) => {
                  setTempUser({ ...tempUser, school: value });
                  setFinished(false)
                }}
              />
            </View>
          </View>
        </View>
      </TouchableHighlight>
      <Divider />
      {/* 最高学历 */}
      <TouchableHighlight
        onPress={() => setIsEducationShow(!isEducationShow)}
        underlayColor="#E6E6E6"
      >
        <View style={[styles.row]}>
          <View style={styles.content}>
            <View style={styles.leftPanel}>
              <View style={styles.leftTitle}>
                <Text
                  style={{
                    fontSize: 15,
                    color: "#262626",
                  }}
                >
                  最高学历
                </Text>
              </View>
            </View>

            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text>{educationList[tempUser["education"] - 1] || "待填写"}</Text>
              <IconButton icon="chevron-right" size={20} />
            </View>
          </View>
        </View>
      </TouchableHighlight>
      <Divider />
      {/* TODO: 行业/职业 */}
      <TouchableHighlight
        onPress={() => setIsIndustryShow(!isIndustryShow)}
        underlayColor="#E6E6E6"
      >
        <View style={[styles.row]}>
          <View style={styles.content}>
            <View style={styles.leftPanel}>
              <View style={styles.leftTitle}>
                <Text
                  style={{
                    fontSize: 15,
                    color: "#262626",
                  }}
                >
                  行业/职业
                </Text>
              </View>
            </View>

            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text>{tempUser["identity"] || "待填写"}</Text>
              <IconButton icon="chevron-right" size={20} />
            </View>
          </View>
        </View>
      </TouchableHighlight>
      <Divider />
      <View style={{ marginHorizontal: 20, marginVertical: 20 }}>
        <Button
          style={{ marginHorizontal: 50, marginVertical: 10 }}
          title="完成编辑"
          radius={99}
          onPress={async () => {
            await handleSubmit();

          }}
          color="#b4dcfc"
          size="lg"
        ></Button>
      </View>

      {/* 弹窗 */}

      {isAddressShow ? (
        <View
          style={{
            position: "absolute",
            zIndex: 99,
            width: "100%",
            height: "100%",
            backgroundColor: "#fff",
          }}
        >
          <Appbar.Header
            style={{ ...styles.appbar, justifyContent: "space-between" }}
          >
            <Appbar.Content title="填写地址" onPress={() => { }} />
          </Appbar.Header>

          <View style={styles.pickerFatherContainer}>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={currAddressA}
                onValueChange={handleProvinceChange}
              >
                {addressList.map((item) => (
                  <Picker.Item
                    key={item.province}
                    label={item.province}
                    value={item.province}
                  />
                ))}
              </Picker>
            </View>
            {currAddressA && (
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={currAddressB}
                  onValueChange={handleCityChange}
                >
                  {addressList
                    .find((item) => item.province === currAddressA)
                    ?.cities.map((city) => (
                      <Picker.Item key={city} label={city} value={city} />
                    ))}
                </Picker>
              </View>
            )}
          </View>
          <View style={{ marginHorizontal: 20 }}>
            <Button
              style={{ marginHorizontal: 50, marginVertical: 10 }}
              title="确定"
              radius={99}
              onPress={() => {
                setTempUser({
                  ...tempUser,
                  addressA: currAddressA,
                  addressB: currAddressB,
                });
                setIsAddressShow(false);
                setFinished(false)
              }}
              color="#b4dcfc"
              size="lg"
            ></Button>
          </View>
          <View style={{ marginHorizontal: 20, marginVertical: 10 }}>
            <Button
              style={{ marginHorizontal: 50, marginVertical: 10 }}
              title="取消"
              radius={99}
              onPress={() => {
                setIsAddressShow(false);
              }}
              type="outline"
              color="#b4dcfc"
              size="lg"
            ></Button>
          </View>
        </View>
      ) : null}
      {isHomeTownShow ? (
        <View
          style={{
            position: "absolute",
            zIndex: 99,
            width: "100%",
            height: "100%",
            backgroundColor: "#fff",
          }}
        >
          <Appbar.Header
            style={{ ...styles.appbar, justifyContent: "space-between" }}
          >
            <Appbar.Content title="填写地址" onPress={() => { }} />
          </Appbar.Header>

          <View style={styles.pickerFatherContainer}>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={currHomeTownA}
                onValueChange={handleHometownProvinceChange}
              >
                {addressList.map((item) => (
                  <Picker.Item
                    key={item.province}
                    label={item.province}
                    value={item.province}
                  />
                ))}
              </Picker>
            </View>
            {currHomeTownA && (
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={currHomeTownB}
                  onValueChange={handleHometownCityChange}
                >
                  {addressList
                    .find((item) => item.province === currHomeTownA)
                    ?.cities.map((city) => (
                      <Picker.Item key={city} label={city} value={city} />
                    ))}
                </Picker>
              </View>
            )}
          </View>
          <View style={{ marginHorizontal: 20 }}>
            <Button
              style={{ marginHorizontal: 50, marginVertical: 10 }}
              title="确定"
              radius={99}
              onPress={() => {
                setTempUser({
                  ...tempUser,
                  homeTownA: currHomeTownA,
                  homeTownB: currHomeTownB,
                });
                setIsHomeTownShow(false);
                setFinished(false)
              }}
              color="#b4dcfc"
              size="lg"
            ></Button>
          </View>
          <View style={{ marginHorizontal: 20, marginVertical: 10 }}>
            <Button
              style={{ marginHorizontal: 50, marginVertical: 10 }}
              title="取消"
              radius={99}
              onPress={() => {
                setIsHomeTownShow(false);
              }}
              type="outline"
              color="#b4dcfc"
              size="lg"
            ></Button>
          </View>
        </View>
      ) : null}
      {isEducationShow ? (
        <View
          style={{
            position: "absolute",
            zIndex: 99,
            width: "100%",
            height: "100%",
            backgroundColor: "#fff",
          }}
        >
          <Appbar.Header
            style={{ ...styles.appbar, justifyContent: "space-between" }}
          >
            <Appbar.Content title="选择" onPress={() => { }} />
          </Appbar.Header>
          <Picker
            selectedValue={currEducation}
            onValueChange={(itemValue) => setCurrEducation(itemValue)}
            style={{ marginTop: 20 }}
          >
            {/* <Picker.Item label="无教育经历" value={0} /> */}
            <Picker.Item label="高中及以下" value={1} />
            <Picker.Item label="专科" value={2} />
            <Picker.Item label="本科" value={3} />
            <Picker.Item label="研究生" value={4} />
            <Picker.Item label="博士及以上" value={5} />
          </Picker>
          <View style={{ marginHorizontal: 20 }}>
            <Button
              style={{ marginHorizontal: 50, marginVertical: 10 }}
              title="确定"
              radius={99}
              onPress={() => {
                setTempUser({ ...tempUser, education: currEducation });
                setIsEducationShow(false);
                setFinished(false)
              }}
              color="#b4dcfc"
              size="lg"
            ></Button>
          </View>
          <View style={{ marginHorizontal: 20, marginVertical: 10 }}>
            <Button
              style={{ marginHorizontal: 50, marginVertical: 10 }}
              title="取消"
              radius={99}
              onPress={() => {
                setIsEducationShow(false);
              }}
              type="outline"
              color="#b4dcfc"
              size="lg"
            ></Button>
          </View>
        </View>
      ) : null}
      {isIndustryShow ? (
        <View
          style={{
            position: "absolute",
            zIndex: 99,
            width: "100%",
            height: "100%",
            backgroundColor: "#fff",
          }}
        >
          <Appbar.Header
            style={{ ...styles.appbar, justifyContent: "space-between" }}
          >
            <Appbar.Content title="选择" onPress={() => { }} />
          </Appbar.Header>
          <Picker
            selectedValue={currIndustry}
            onValueChange={(itemValue) => setCurrIndustry(itemValue)}
            style={{ marginTop: 20 }}
          >
            {industryList.map((item, index) => {
              return <Picker.Item label={item} value={item} key={index} />;
            })}
          </Picker>
          <View style={{ marginHorizontal: 20 }}>
            <Button
              style={{ marginHorizontal: 50, marginVertical: 10 }}
              title="确定"
              radius={99}
              onPress={() => {
                setTempUser({ ...tempUser, identity: currIndustry });
                setIsIndustryShow(false);
                setFinished(false)
              }}
              color="#b4dcfc"
              size="lg"
            ></Button>
          </View>
          <View style={{ marginHorizontal: 20, marginVertical: 10 }}>
            <Button
              style={{ marginHorizontal: 50, marginVertical: 10 }}
              title="取消"
              radius={99}
              onPress={() => {
                setIsIndustryShow(false);
              }}
              type="outline"
              color="#b4dcfc"
              size="lg"
            ></Button>
          </View>
        </View>
      ) : null}
      {
        isHeightShow ? (
          <View
            style={{
              position: "absolute",
              zIndex: 99,
              width: "100%",
              height: "100%",
              backgroundColor: "#fff",
            }}
          >
            <Appbar.Header
              style={{ ...styles.appbar, justifyContent: "space-between" }}
            >
              <Appbar.Content title="选择height" onPress={() => { }} />
            </Appbar.Header>
            <Picker
              selectedValue={currHeight}
              onValueChange={(itemValue) => setCurrHeight(itemValue)}
              style={{ marginTop: 20 }}
            >
              {heightList.map((item, index) => {
                return <Picker.Item label={`${item}`} value={item} key={`height-${index}`} />;
              })}
            </Picker>
            <View style={{ marginHorizontal: 20 }}>
              <Button
                style={{ marginHorizontal: 50, marginVertical: 10 }}
                title="确定"
                radius={99}
                onPress={() => {
                  setTempUser({ ...tempUser, height: currHeight });
                  setIsHeightShow(false);
                  setFinished(false)
                }}
                color="#b4dcfc"
                size="lg"
              ></Button>
            </View>
            <View style={{ marginHorizontal: 20, marginVertical: 10 }}>
              <Button
                style={{ marginHorizontal: 50, marginVertical: 10 }}
                title="取消"
                radius={99}
                onPress={() => {
                  setIsHeightShow(false);
                }}
                type="outline"
                color="#b4dcfc"
                size="lg"
              ></Button>
            </View>
          </View>
        ) : null
      }
      {
        isWeightShow ? (
          <View
            style={{
              position: "absolute",
              zIndex: 99,
              width: "100%",
              height: "100%",
              backgroundColor: "#fff",
            }}
          >
            <Appbar.Header
              style={{ ...styles.appbar, justifyContent: "space-between" }}
            >
              <Appbar.Content title="选择" onPress={() => { }} />
            </Appbar.Header>
            <Picker
              selectedValue={currWeight}
              onValueChange={(itemValue) => setCurrWeight(itemValue)}
              style={{ marginTop: 20 }}
            >
              {weightList.map((item, index) => {
                return <Picker.Item label={`${item}`} value={item} key={`weight=${index}`} />;
              })}
            </Picker>
            <View style={{ marginHorizontal: 20 }}>
              <Button
                style={{ marginHorizontal: 50, marginVertical: 10 }}
                title="确定"
                radius={99}
                onPress={() => {
                  setTempUser({ ...tempUser, weight: currWeight });
                  setIsWeightShow(false);
                  setFinished(false)
                }}
                color="#b4dcfc"
                size="lg"
              ></Button>
            </View>
            <View style={{ marginHorizontal: 20, marginVertical: 10 }}>
              <Button
                style={{ marginHorizontal: 50, marginVertical: 10 }}
                title="取消"
                radius={99}
                onPress={() => {
                  setIsWeightShow(false);
                }}
                type="outline"
                color="#b4dcfc"
                size="lg"
              ></Button>
            </View>
          </View>
        ) : null
      }
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  appbar: {
    backgroundColor: "white",
    elevation: 2,
  },
  editButtonContainer: {
    position: "absolute",
    top: 5, // 您可以调整这些值以获得理想的位置
    right: 5,
    zIndex: 1,
  },
  editButton: {
    backgroundColor: "transparent", // 透明背景
    elevation: 0, // 移除阴影
  },
  card: {
    margin: 15,
    borderRadius: 10,
    backgroundColor: "#fff",
  },
  cardContent: {
    paddingVertical: 20,
  },

  container: {
    backgroundColor: "#fff",
  },
  row: {
    backgroundColor: "fff",
    height: 48,
    justifyContent: "center",
  },
  input: {
    height: 100,
    fontSize: 16,
    borderColor: "gray",
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
  },
  content: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginLeft: 10,
  },
  lastLine: {
    borderBottomWidth: 1,
    borderBottomColor: "#E6E6E6",
  },
  leftPanel: {
    justifyContent: "center",
  },
  leftTitle: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 10,
  },
  subTitle: {},
  inputContainer: {
    height: 52,
    flex: 1,
    marginRight: 15,
  },
  textInput: {
    height: 49,
    fontSize: 14,
    textAlign: "right",
    color: "#262626",
  },
  group: {},
  sectionHeader: {
    height: 40,
    justifyContent: "center",
    backgroundColor: "#E6E6E6",
  },
  switch: {
    flex: 1,
    height: 49,
    flexDirection: "row",
    alignItems: "center",
    marginRight: 10,
    justifyContent: "flex-end",
  },
  view: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  pickerFatherContainer: {
    flexDirection: "row",
    alignItems: "center",
    margin: 20,
  },
  pickerContainer: {
    flex: 1,
  },
  picker: {
    width: "100%",
  },
});
