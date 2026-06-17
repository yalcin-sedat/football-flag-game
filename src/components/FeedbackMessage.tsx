// Doğru/yanlış geri bildirim mesajı — fade-in → bekle → fade-out
// Oyunu DURDURMAZ; pointerEvents="none" ile dokunmayı engellemiyor.
// Component her zaman mount'lı kalır (opacity ile gizlenir) — fade-out animasyonu tamamlanabilsin.
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { colors } from '../theme/colors';
import { strings } from '../data/strings';

export type FeedbackResult = {
  type: 'correct' | 'wrong' | null;
  countryName?: string;
};

type FeedbackMessageProps = {
  result: FeedbackResult;
};

export default function FeedbackMessage({ result }: FeedbackMessageProps) {
  const opacity = useSharedValue(0);
  const scale   = useSharedValue(0.8);

  // Son gösterilen sonucu tut — fade-out sırasında içerik kaybolmasın
  const [displayed, setDisplayed] = useState<FeedbackResult>({ type: null });

  useEffect(() => {
    if (!result.type) return;

    // İçeriği göstermeden önce güncelle
    setDisplayed(result);

    // Hızlı gir → bekle → yavaş çık
    opacity.value = withSequence(
      withTiming(1,   { duration: 140, easing: Easing.out(Easing.quad) }),
      withTiming(1,   { duration: 750 }),
      withTiming(0,   { duration: 310, easing: Easing.in(Easing.quad) }),
    );
    // Fırlama scale efekti
    scale.value = withSequence(
      withTiming(1.06, { duration: 140, easing: Easing.out(Easing.back(1.4)) }),
      withTiming(1,    { duration: 100 }),
      withTiming(1,    { duration: 700 }),
      withTiming(0.92, { duration: 310 }),
    );
  }, [result.type, result.countryName]);

  const animStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  const isCorrect = displayed.type === 'correct';

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.container,
        isCorrect ? styles.correct : styles.wrong,
        animStyle,
      ]}
    >
      <Text style={styles.text}>
        {isCorrect
          ? `${strings.pinSaplandi}\n${displayed.countryName ?? ''}`
          : strings.carpisma}
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
  },
  correct: {
    backgroundColor: colors.correct,
    borderColor: colors.correctBorder,
    shadowColor: '#00ff88',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 12,
    elevation: 8,
  },
  wrong: {
    backgroundColor: colors.wrong,
    borderColor: colors.wrongBorder,
    shadowColor: '#ff3355',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 12,
    elevation: 8,
  },
  text: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 23,
  },
});
