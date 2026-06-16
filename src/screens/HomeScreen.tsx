// Ana menü ekranı — neon arcade stadyum atmosferi
import React, { useEffect } from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { Svg, Line, Circle, Ellipse, Defs, RadialGradient, Stop, Rect } from 'react-native-svg';
import { colors } from '../theme/colors';
import { strings } from '../data/strings';

const { width, height } = Dimensions.get('window');

type HomeScreenProps = {
  onPlay: () => void;
};

// Menü buton yapılandırması
const MENU_ITEMS = [
  { key: 'play',      label: () => strings.oyna,        primary: true },
  { key: 'daily',     label: () => strings.gunlukGorev, primary: false },
  { key: 'leaderboard', label: () => strings.siralama,  primary: false },
  { key: 'settings',  label: () => strings.ayarlar,     primary: false },
];

export default function HomeScreen({ onPlay }: HomeScreenProps) {
  // Logo nefes alma (pulse) animasyonu
  const logoGlow = useSharedValue(0.6);
  // Küçük hareketli nokta / parıltı efekti için
  const sparkleOpacity = useSharedValue(0);

  useEffect(() => {
    // Logo neon pulsing
    logoGlow.value = withRepeat(
      withSequence(
        withTiming(1,   { duration: 900,  easing: Easing.inOut(Easing.sin) }),
        withTiming(0.5, { duration: 900,  easing: Easing.inOut(Easing.sin) }),
      ),
      -1,
      false,
    );
    // Parıltı yanıp sönme
    sparkleOpacity.value = withRepeat(
      withSequence(
        withTiming(1,   { duration: 600 }),
        withTiming(0.2, { duration: 600 }),
      ),
      -1,
      false,
    );
  }, []);

  const logoStyle = useAnimatedStyle(() => ({
    textShadowRadius: 18 + logoGlow.value * 14,
    opacity: 0.85 + logoGlow.value * 0.15,
  }));

  const sparkleStyle = useAnimatedStyle(() => ({
    opacity: sparkleOpacity.value,
  }));

  function handleMenu(key: string) {
    if (key === 'play') onPlay();
    // Diğer ekranlar Aşama 3'te açılacak
  }

  return (
    <View style={styles.container}>
      {/* SVG arka plan — stadyum çizgileri */}
      <StadiumBackground />

      {/* Logo alanı */}
      <View style={styles.logoArea}>
        {/* Üst neon çizgi */}
        <Animated.View style={[styles.neonLine, sparkleStyle]} />

        <Text style={styles.logoSub}>⚽  BAYRAK  ⚽</Text>

        <Animated.Text style={[styles.logoTitle, logoStyle]}>
          FLAG
        </Animated.Text>
        <Animated.Text style={[styles.logoTitle, styles.logoTitleAccent, logoStyle]}>
          STRIKER
        </Animated.Text>

        <Animated.View style={[styles.neonLine, styles.neonLineBottom, sparkleStyle]} />
      </View>

      {/* Menü butonları */}
      <View style={styles.menuArea}>
        {MENU_ITEMS.map((item) => (
          <TouchableOpacity
            key={item.key}
            style={[styles.button, item.primary && styles.buttonPrimary]}
            onPress={() => handleMenu(item.key)}
            activeOpacity={0.75}
          >
            <Text style={[styles.buttonText, item.primary && styles.buttonTextPrimary]}>
              {item.label()}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Alt versiyon notu */}
      <Text style={styles.version}>v1.0 · Flag Striker</Text>
    </View>
  );
}

// SVG stadyum arka planı — saha çizgileri + projektör ışıkları
function StadiumBackground() {
  const fieldY = height * 0.72;
  const fieldW = width * 0.85;
  const fieldH = height * 0.18;
  const cx = width / 2;

  return (
    <Svg
      style={StyleSheet.absoluteFill}
      width={width}
      height={height}
      pointerEvents="none"
    >
      {/* Zemin gradient simülasyonu (koyu mavi → yeşil saha tonu) */}
      <Rect x={0} y={fieldY} width={width} height={height - fieldY}
        fill="rgba(0,60,20,0.25)" />

      {/* Saha dış çerçevesi */}
      <Rect
        x={(width - fieldW) / 2} y={fieldY + 8}
        width={fieldW} height={fieldH}
        fill="none"
        stroke="rgba(0,255,136,0.18)"
        strokeWidth={1.5}
        rx={4}
      />

      {/* Saha orta çizgisi */}
      <Line
        x1={(width - fieldW) / 2} y1={fieldY + 8 + fieldH / 2}
        x2={(width + fieldW) / 2} y2={fieldY + 8 + fieldH / 2}
        stroke="rgba(0,255,136,0.12)"
        strokeWidth={1}
      />

      {/* Orta daire */}
      <Circle
        cx={cx} cy={fieldY + 8 + fieldH / 2}
        r={fieldH * 0.38}
        fill="none"
        stroke="rgba(0,255,136,0.12)"
        strokeWidth={1}
      />

      {/* Sol projektör */}
      <Line
        x1={width * 0.08} y1={0}
        x2={width * 0.38} y2={height * 0.55}
        stroke="rgba(0,212,255,0.06)"
        strokeWidth={30}
      />
      {/* Sağ projektör */}
      <Line
        x1={width * 0.92} y1={0}
        x2={width * 0.62} y2={height * 0.55}
        stroke="rgba(0,212,255,0.06)"
        strokeWidth={30}
      />

      {/* Üst dekoratif neon noktalı şerit */}
      {[0.15, 0.3, 0.5, 0.7, 0.85].map((xRatio, i) => (
        <Circle
          key={i}
          cx={width * xRatio}
          cy={height * 0.06}
          r={2}
          fill={i === 2 ? colors.neonGold : colors.neonBlue}
          opacity={0.5}
        />
      ))}
    </Svg>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoArea: {
    alignItems: 'center',
    marginBottom: 44,
  },
  neonLine: {
    width: 180,
    height: 2,
    borderRadius: 1,
    backgroundColor: colors.neonBlue,
    shadowColor: colors.neonBlue,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 6,
    marginVertical: 10,
  },
  neonLineBottom: {
    backgroundColor: colors.neonGreen,
    shadowColor: colors.neonGreen,
  },
  logoSub: {
    color: colors.textMuted,
    fontSize: 13,
    letterSpacing: 4,
    fontWeight: '600',
    marginBottom: 6,
  },
  logoTitle: {
    color: colors.neonBlue,
    fontSize: 52,
    fontWeight: '900',
    letterSpacing: 6,
    textShadowColor: colors.neonBlue,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 18,
    lineHeight: 56,
  },
  logoTitleAccent: {
    color: colors.neonGreen,
    textShadowColor: colors.neonGreen,
    fontSize: 44,
    letterSpacing: 8,
  },
  menuArea: {
    width: '78%',
    gap: 12,
  },
  button: {
    borderWidth: 1.5,
    borderColor: 'rgba(0,212,255,0.35)',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: 'rgba(0,212,255,0.06)',
  },
  buttonPrimary: {
    borderColor: colors.neonGreen,
    backgroundColor: 'rgba(0,255,136,0.14)',
    shadowColor: colors.neonGreen,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 8,
  },
  buttonText: {
    color: colors.textDim,
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 1,
  },
  buttonTextPrimary: {
    color: colors.neonGreen,
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  version: {
    position: 'absolute',
    bottom: 24,
    color: colors.textMuted,
    fontSize: 11,
    letterSpacing: 1,
  },
});
