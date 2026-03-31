import { Dimensions, Platform, StyleSheet, View } from "react-native";
import React from "react";
import { BlurCarouselItemProps, BlurCarouselProps } from "./types";
import { BlurView, type BlurViewProps } from "expo-blur";
import Animated, {
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  Extrapolation,
  useAnimatedProps,
} from "react-native-reanimated";

const AnimatedBlurView = Animated.createAnimatedComponent<BlurViewProps>(BlurView);
const { width: SCREEN_WIDTH } = Dimensions.get("window");

const PAGE_WIDTH = SCREEN_WIDTH;
const CARD_WIDTH = SCREEN_WIDTH * 0.88; 
const CARD_GAP = 10;

const CarouselItem = <ItemT,>({
  item,
  index,
  scrollX,
  renderItem,
}: BlurCarouselItemProps<ItemT>) => {
    
  const animatedStyle = useAnimatedStyle(() => {
    const inputRange = [(index - 1) * PAGE_WIDTH, index * PAGE_WIDTH, (index + 1) * PAGE_WIDTH];
    return {
      transform: [{ scale: interpolate(scrollX.value, inputRange, [0.9, 1, 0.9], Extrapolation.CLAMP) }],
      opacity: interpolate(scrollX.value, inputRange, [0.8, 1, 0.8], Extrapolation.CLAMP),
    };
  });

  const animatedBlurProps = useAnimatedProps(() => {
    const blurVal = interpolate(
      scrollX.value,
      [(index - 1) * PAGE_WIDTH, index * PAGE_WIDTH, (index + 1) * PAGE_WIDTH],
      [10, 0, 10],
      Extrapolation.CLAMP
    );
    return { intensity: blurVal };
  });

  return (
    <Animated.View style={[styles.itemContainer, animatedStyle, { width: PAGE_WIDTH }]}>
      <View style={{ width: CARD_WIDTH, paddingHorizontal: CARD_GAP }}>
        {renderItem({ item, index })}
        
        {Platform.OS === "ios" && (
          <AnimatedBlurView
            style={[StyleSheet.absoluteFillObject, styles.blurOverlay, { marginHorizontal: CARD_GAP }]}
            tint="light"
            animatedProps={animatedBlurProps}
          />
        )}
      </View>
    </Animated.View>
  );
};

const BlurCarousel = <ItemT,>({
  data,
  renderItem,
}: BlurCarouselProps<ItemT>) => {
  const scrollX = useSharedValue<number>(0);

  const onScroll = useAnimatedScrollHandler({
    onScroll: (event) => { scrollX.value = event.contentOffset.x; },
  });

  return (
    <View style={styles.wrapper}>
      <Animated.FlatList
        data={data}
        horizontal
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        pagingEnabled={true} 
        snapToAlignment="center"
        decelerationRate="fast"
        disableIntervalMomentum={true}
        
        // Espaçamento vertical para a sombra não bater no limite da lista
        contentContainerStyle={styles.flatListContent}
        
        // Garante que o Android não "esconda" a sombra que sai do card
        style={styles.flatList} 

        renderItem={({ item, index }) => (
          <CarouselItem 
            item={item} 
            index={index} 
            scrollX={scrollX} 
            renderItem={renderItem} 
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    overflow: 'visible',
    width: SCREEN_WIDTH,
  },
  flatList: {
    overflow: 'visible',
    flexGrow: 0,
  },
  itemContainer: { 
    justifyContent: "center", 
    alignItems: "center",
    overflow: 'visible', 
  },
  flatListContent: {
    // Aumentamos o respiro embaixo para a sombra sumir suavemente
    paddingVertical: 40, 
  },
  blurOverlay: { borderRadius: 28 },
});

export { BlurCarousel };