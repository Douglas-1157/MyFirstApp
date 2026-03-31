import { ReactElement } from "react";
import type { SharedValue } from "react-native-reanimated"; 

export interface BlurCarouselProps<T> {
  data: T[];
  renderItem: (info: { item: T; index: number }) => ReactElement;
  horizontalSpacing?: number;
  itemWidth?: number;
  spacing?: number;
}

export interface BlurCarouselItemProps<T> extends Omit<BlurCarouselProps<T>, 'data'> {
  item: T;
  index: number;
  scrollX: SharedValue<number>;
}