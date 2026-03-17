import React, { useEffect } from "react";
import { Image } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  withDelay,
  Easing,
  interpolate,
} from "react-native-reanimated";
import { ImageSourcePropType } from "react-native";

interface FloatingOrbProps {
  source: ImageSourcePropType;
  size: number;
  startX: number;  // 0-1 ekran genişliğine oranı
  startY: number;  // 0-1 ekran yüksekliğine oranı
  delay: number;
  duration: number;
  screenW: number;
  screenH: number;
}

export default function FloatingOrb({
  source, size, startX, startY, delay, duration, screenW, screenH,
}: FloatingOrbProps) {
  const floatY = useSharedValue(0);
  const floatX = useSharedValue(0);
  const scale  = useSharedValue(1);

  useEffect(() => {
    floatY.value = withDelay(delay, withRepeat(
      withSequence(
        withTiming(1, { duration, easing: Easing.inOut(Easing.sin) }),
        withTiming(0, { duration, easing: Easing.inOut(Easing.sin) })
      ), -1, true
    ));
    floatX.value = withDelay(delay + 500, withRepeat(
      withSequence(
        withTiming(1, { duration: duration * 1.3, easing: Easing.inOut(Easing.sin) }),
        withTiming(0, { duration: duration * 1.3, easing: Easing.inOut(Easing.sin) })
      ), -1, true
    ));
    scale.value = withDelay(delay + 200, withRepeat(
      withSequence(
        withTiming(1.07, { duration: duration * 0.8, easing: Easing.inOut(Easing.ease) }),
        withTiming(1,    { duration: duration * 0.8, easing: Easing.inOut(Easing.ease) })
      ), -1, true
    ));
  }, []);

  const animStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: interpolate(floatY.value, [0, 1], [0, -28]) },
      { translateX: interpolate(floatX.value, [0, 1], [0, 10]) },
      { scale: scale.value },
    ],
  }));

  return (
    <Animated.View
      style={[
        {
          position: "absolute",
          left: startX * screenW - size / 2,
          top: startY * screenH - size / 2,
          width: size,
          height: size,
        },
        animStyle,
      ]}
    >
      <Image source={source} style={{ width: size, height: size }} resizeMode="contain" />
    </Animated.View>
  );
}
