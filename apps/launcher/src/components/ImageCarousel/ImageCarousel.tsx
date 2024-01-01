import React, { useState, useRef, useEffect } from "react";
import {
  Text,
  View,
  Image,
  FlatList,
  Dimensions,
  TouchableOpacity,
} from "react-native";

const windowWidth = Dimensions.get("window").width;
const height = (4 * windowWidth) / 3;

export default function ImageCarousel({ images, width }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const carousel = useRef(null);

  const changeActiveIndex = ({ viewableItems }) => {
    setActiveIndex(viewableItems[0].index);
  };

  const onViewRef = React.useRef(changeActiveIndex);
  const viewConfigRef = React.useRef({ viewAreaCoveragePercentThreshold: 50 });

  const scrollToIndex = (index) => {
    carousel.current.scrollToIndex({ index });
  };

  return (
    <View>
      <FlatList
        ref={carousel}
        horizontal
        pagingEnabled
        data={images}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => (
          <View
            style={{
              width: windowWidth,
              height: height,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Image
              source={{ uri: item }}
              style={{ width: width, height: "100%", borderRadius: 10 }}
              resizeMode="cover"
            />
          </View>
        )}
        onScrollToIndexFailed={() => {}}
        onViewableItemsChanged={onViewRef.current}
        viewabilityConfig={viewConfigRef.current}
      />

      <View style={{ flexDirection: "row", justifyContent: "center" }}>
        {images.map((image, index) => (
          <TouchableOpacity key={index} onPress={() => scrollToIndex(index)}>
            <Text
              style={{
                fontSize: 18,
                color: activeIndex === index ? "#b4dcfc" : "#808080",
              }}
            >
              ●
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
