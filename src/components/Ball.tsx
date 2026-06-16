// Bayrak desenli top componenti
// ballY: GameScreen'den gelen shared value (tap → fırlatma → geri dönüş)
// restY: topun dinlenme pozisyonunun Y koordinatı (translateY hesabı için)
import React from 'react';
import { StyleSheet, Text, StyleProp, ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  type SharedValue,
} from 'react-native-reanimated';
import { Country } from '../data/countries';
import { colors } from '../theme/colors';

type BallProps = {
  country: Country;
  ballY: SharedValue<number>;
  restY: number;
  size?: number;
  style?: StyleProp<ViewStyle>;
};

export default function Ball({ country, ballY, restY, size = 72, style }: BallProps) {
  // translateY: ballY değeri restY'den ne kadar saptıysa o kadar yukarı/aşağı
  const animStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: ballY.value - restY }],
  }));

  const half = size / 2;

  return (
    <Animated.View
      style={[
        styles.ball,
        {
          width: size,
          height: size,
          borderRadius: half,
          backgroundColor: country.color,
          // Glow efekti — ülke renginde
          shadowColor: country.color,
        },
        animStyle,
        style,
      ]}
    >
      {/* Bayrak PNG gelince: <Image source={flagImages[country.code]} style={styles.flag} /> */}
      <Text style={styles.code}>{country.code.toUpperCase()}</Text>

      {/* Top yüzeyi parıltısı (sol üst köşe highlight) */}
      <Animated.View style={styles.glare} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  ball: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.65)',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.7,
    shadowRadius: 14,
    elevation: 10,
  },
  code: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: 20,
    letterSpacing: 1.5,
    textShadowColor: 'rgba(0,0,0,0.6)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  // Üst-sol köşe highlight — kürenin yuvarlak hissini arttırır
  glare: {
    position: 'absolute',
    top: 9,
    left: 11,
    width: 20,
    height: 11,
    borderRadius: 7,
    backgroundColor: 'rgba(255,255,255,0.32)',
    transform: [{ rotate: '-30deg' }],
  },
});
