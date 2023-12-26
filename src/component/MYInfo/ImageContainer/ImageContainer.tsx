import React from "react";
import { View, Image, TouchableOpacity, StyleSheet, Text } from "react-native";
import { IconButton } from "react-native-paper";

function ImageContainer({ images, onSelectImage, onRemoveImage }) {
  console.log("curr images:", images);
  const renderImage = (image, index) => {
    if (!image || image == "") {
      // <Image key={index} source={require("../../../../image/pic/TAInfo1.jpg")} style={styles.image} />
      return (
        <TouchableOpacity
          style={styles.imagePlaceholder}
          onPress={() => onSelectImage(index)}
        >
          {index === 0 && (
            <Text
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                backgroundColor: "gray",
                color: "#fff",
                borderRadius: 8,
                paddingHorizontal: 5,
                paddingBottom: 5,
                margin: 0,
                textAlign: "center",
              }}
            >
              头像
            </Text>
          )}
          <IconButton icon="plus" size={30} iconColor="#808080" />
        </TouchableOpacity>
      );
    } else {
      return (
        <TouchableOpacity
          style={styles.imagePlaceholder}
          onPress={() => onSelectImage(index)}
        >
          <Image
            key={index}
            source={{ uri: image || "" }}
            style={styles.image}
          />
          {index === 0 && (
            <Text
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                backgroundColor: "gray",
                color: "#fff",
                borderRadius: 8,
                paddingHorizontal: 5,
                paddingBottom: 5,
                margin: 0,
                textAlign: "center",
              }}
            >
              头像
            </Text>
          )}
          {/* 删除 */}
          {index !== 0 && (
            <IconButton
              icon="close"
              size={12}
              iconColor="#fff"
              style={{
                position: "absolute",
                width: 20,
                height: 20,
                top: 0,
                right: 0,
                backgroundColor: "#808080",
                borderRadius: 99,
                margin: 3,
              }}
              onPress={() => onRemoveImage(index)}
            />
          )}
        </TouchableOpacity>
      );
    }
  };

  return (
    <View style={styles.container}>
      {images.map((img, idx) => renderImage(img, idx))}

      {/* {images.length < 6 && (
        <TouchableOpacity
          style={styles.imagePlaceholder}
          onPress={onSelectImage}
        >
          <IconButton icon="plus" size={30} iconColor="#808080" />
        </TouchableOpacity>
      )} */}

      {/* Fill the remaining spots with blank views if there are fewer than 6 images */}
      {/* {Array.from({ length: 6 - images.length }).map((_, idx) => (
        <View key={idx + images.length} style={styles.image} />
      ))} */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    marginVertical: 10,
    height: "auto",
  },
  image: {
    width: "99%",
    height: "99%", // To account for the space between
    aspectRatio: 3 / 4,
    borderRadius: 8,
    position: "relative",
  },
  imagePlaceholder: {
    width: "32%",
    height: "42.6%",
    aspectRatio: 3 / 4,
    marginBottom: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#e5e1e1", // a light gray placeholder color
    borderRadius: 8,
  },
});

export default ImageContainer;
