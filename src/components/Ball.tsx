// Bayrak desenli top componenti
// ballY: GameScreen'den gelen shared value (tap → fırlatma → geri dönüş)
// restY: topun dinlenme pozisyonunun Y koordinatı (translateY hesabı için)
import React from 'react';
import { Image, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  type SharedValue,
} from 'react-native-reanimated';
import { Svg, Path } from 'react-native-svg';
import { Country } from '../data/countries';

// Klasik futbol topu dikiş geometrisi — merkez beşgen + 5 kol + 5 dış yay
// Tüm koordinatlar `s` (top boyutu) üzerinden orantılı hesaplanır
function footballSeams(s: number): { pentagonD: string; armD: string; arcD: string } {
  const c = s / 2;
  const fmt = (v: number) => v.toFixed(1);

  // Beşgen köşeleri: merkez (c,c) etrafında, r ≈ 0.14*s, -90°'den saat yönüyle
  const p: [number, number][] = [
    [c,              c - s * 0.140],
    [c + s * 0.1330, c - s * 0.043],
    [c + s * 0.0823, c + s * 0.114],
    [c - s * 0.0823, c + s * 0.114],
    [c - s * 0.1330, c - s * 0.043],
  ];

  // Her köşeden çevreye uzanan dikiş kolu uç noktaları
  const e: [number, number][] = [
    [c + s * 0.028, c - s * 0.440],
    [c + s * 0.418, c - s * 0.194],
    [c + s * 0.417, c + s * 0.306],
    [c - s * 0.250, c + s * 0.433],
    [c - s * 0.440, c - s * 0.194],
  ];

  // Dış yay kontrol noktaları (komşu kol uçlarını birleştiren altıgen kenar yayları)
  const ctrl: [number, number][] = [
    [s * 0.806, s * 0.028],
    [s * 1.000, s * 0.528],
    [s * 0.583, s * 1.028],
    [s * 0.056, s * 0.750],
    [s * 0.111, s * 0.028],
  ];

  const pentagonD = `M ${p.map(([x, y]) => `${fmt(x)} ${fmt(y)}`).join(' L ')} Z`;

  const armD = p
    .map(([px, py], i) => `M ${fmt(px)} ${fmt(py)} L ${fmt(e[i][0])} ${fmt(e[i][1])}`)
    .join(' ');

  const arcD = e
    .map(([x0, y0], i) => {
      const [x1, y1] = e[(i + 1) % 5];
      const [cx2, cy2] = ctrl[i];
      return `M ${fmt(x0)} ${fmt(y0)} Q ${fmt(cx2)} ${fmt(cy2)} ${fmt(x1)} ${fmt(y1)}`;
    })
    .join(' ');

  return { pentagonD, armD, arcD };
}

// Metro bundler statik require — tüm bayrak asset'leri build-time çözülmeli
const FLAG_IMAGES: Record<string, number> = {
  tr: require('../../assets/flags/tr.png'),
  de: require('../../assets/flags/de.png'),
  fr: require('../../assets/flags/fr.png'),
  br: require('../../assets/flags/br.png'),
  mx: require('../../assets/flags/mx.png'),
  us: require('../../assets/flags/us.png'),
  jp: require('../../assets/flags/jp.png'),
  it: require('../../assets/flags/it.png'),
  ar: require('../../assets/flags/ar.png'),
  es: require('../../assets/flags/es.png'),
  pt: require('../../assets/flags/pt.png'),
  nl: require('../../assets/flags/nl.png'),
  pl: require('../../assets/flags/pl.png'),
  kr: require('../../assets/flags/kr.png'),
};

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
  const flagSource = FLAG_IMAGES[country.code];
  const { pentagonD, armD, arcD } = footballSeams(size);

  return (
    <Animated.View
      style={[
        styles.ball,
        {
          width: size,
          height: size,
          borderRadius: half,
          backgroundColor: flagSource ? 'transparent' : country.color,
          shadowColor: country.color,
        },
        animStyle,
        style,
      ]}
    >
      {/* Bayrak zemini */}
      {flagSource ? (
        <Image
          source={flagSource}
          style={[styles.flag, { borderRadius: half - 3 }]}
          resizeMode="cover"
        />
      ) : null}

      {/* Futbol topu yama/dikiş deseni — bayrağın üstüne yarı saydam SVG overlay */}
      <Svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={styles.seams}
      >
        {/* Merkez siyah beşgen */}
        <Path
          d={pentagonD}
          fill="rgba(0,0,0,0.52)"
          stroke="rgba(0,0,0,0.60)"
          strokeWidth={1.2}
          strokeLinejoin="round"
        />
        {/* Beşgen köşelerinden çevreye dikiş kolları */}
        <Path
          d={armD}
          stroke="rgba(0,0,0,0.48)"
          strokeWidth={1.6}
          fill="none"
          strokeLinecap="round"
        />
        {/* Dış altıgen kenar yayları */}
        <Path
          d={arcD}
          stroke="rgba(0,0,0,0.42)"
          strokeWidth={1.6}
          fill="none"
          strokeLinecap="round"
        />
      </Svg>

      {/* Top yüzeyi parıltısı (sol üst köşe highlight) */}
      <Animated.View style={styles.glare} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  ball: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.65)',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.7,
    shadowRadius: 14,
    elevation: 10,
  },
  flag: {
    width: '100%',
    height: '100%',
  },
  seams: {
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
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
