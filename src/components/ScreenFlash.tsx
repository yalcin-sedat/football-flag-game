// Tam ekran renk flaşı — doğruda yeşil, yanlışta kırmızı
// Her zaman mount'lı kalır (opacity 0); pointerEvents="none" oyunu bloke etmez.
import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { colors } from '../theme/colors';

export type FlashType = 'correct' | 'wrong' | null;

type ScreenFlashProps = {
  flashType: FlashType;
};

export default function ScreenFlash({ flashType }: ScreenFlashProps) {
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (!flashType) return;

    if (flashType === 'correct') {
      // Hafif yeşil pırıltı — doğru ve hoş
      opacity.value = withSequence(
        withTiming(0.22, { duration: 80,  easing: Easing.out(Easing.quad) }),
        withTiming(0,    { duration: 320, easing: Easing.in(Easing.quad) }),
      );
    } else {
      // Güçlü kırmızı flaş — hata hissi
      opacity.value = withSequence(
        withTiming(0.38, { duration: 60,  easing: Easing.out(Easing.quad) }),
        withTiming(0.15, { duration: 80 }),
        withTiming(0,    { duration: 260, easing: Easing.in(Easing.quad) }),
      );
    }
  }, [flashType]);

  const animStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const bgColor = flashType === 'correct' ? colors.neonGreen : colors.neonRed;

  return (
    <Animated.View
      pointerEvents="none"
      style={[styles.overlay, { backgroundColor: bgColor }, animStyle]}
    />
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFill,
    zIndex: 100,
  },
});
