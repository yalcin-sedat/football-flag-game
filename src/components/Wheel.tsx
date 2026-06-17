// Dönen çark componenti — SVG dilimler + Reanimated rotasyon
// Rotation değeri parent'tan (GameScreen) SharedValue olarak gelir;
// böylece çarpışma anında GameScreen doğrudan rotation'ı okuyabilir.
import React from 'react';
import { Image, StyleProp, View, ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  type SharedValue,
} from 'react-native-reanimated';
import { Svg, G, Path, Circle } from 'react-native-svg';
import { Country } from '../data/countries';
import { colors } from '../theme/colors';

// Metro bundler statik require — tüm harita asset'leri build-time çözülmeli
const MAP_IMAGES: Record<string, number> = {
  tr: require('../../assets/maps/tr.png'),
  de: require('../../assets/maps/de.png'),
  fr: require('../../assets/maps/fr.png'),
  br: require('../../assets/maps/br.png'),
  mx: require('../../assets/maps/mx.png'),
  us: require('../../assets/maps/us.png'),
  jp: require('../../assets/maps/jp.png'),
  it: require('../../assets/maps/it.png'),
  ar: require('../../assets/maps/ar.png'),
  es: require('../../assets/maps/es.png'),
  pt: require('../../assets/maps/pt.png'),
  nl: require('../../assets/maps/nl.png'),
  pl: require('../../assets/maps/pl.png'),
  kr: require('../../assets/maps/kr.png'),
};

type WheelProps = {
  countries: Country[];
  rotation: SharedValue<number>;
  radius?: number;
  style?: StyleProp<ViewStyle>;
};

// SVG pie dilimi path hesabı — merkez (cx,cy), yarıçap r, açı aralığı derece cinsinden
function describeArc(
  cx: number, cy: number, r: number,
  startAngle: number, endAngle: number,
): string {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const x1 = cx + r * Math.sin(toRad(startAngle));
  const y1 = cy - r * Math.cos(toRad(startAngle));
  const x2 = cx + r * Math.sin(toRad(endAngle));
  const y2 = cy - r * Math.cos(toRad(endAngle));
  const largeArc = endAngle - startAngle > 180 ? 1 : 0;
  return `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`;
}

export default function Wheel({ countries, rotation, radius = 130, style }: WheelProps) {
  // Animasyon stili — rotation shared value'su ile döner
  const animStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  const size = radius * 2;
  const cx = radius;
  const cy = radius;
  const innerR = radius - 6;
  const segmentAngle = 360 / countries.length;
  // Harita ikonunun dilim içindeki konumu: yarıçapın %60'ı
  const labelR = innerR * 0.60;
  // Harita ikon boyutu: segment sayısına göre küçülür
  const mapSize = countries.length <= 4 ? 44 : countries.length <= 6 ? 36 : 28;

  return (
    <Animated.View style={[{ width: size, height: size }, animStyle, style]}>
      {/* SVG: sadece dilimler ve çerçeve — metin/ikon yok */}
      <Svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{ position: 'absolute' }}
      >
        {/* Arka plan dairesi */}
        <Circle cx={cx} cy={cy} r={innerR + 4} fill={colors.surface} />

        {/* Dilimler */}
        {countries.map((country, i) => {
          const startAngle = i * segmentAngle;
          const endAngle   = startAngle + segmentAngle;

          return (
            <G key={country.code}>
              <Path
                d={describeArc(cx, cy, innerR, startAngle, endAngle)}
                fill={country.color}
                stroke={colors.wheelStroke}
                strokeWidth={3}
              />
              <Path
                d={describeArc(cx, cy, innerR, startAngle, endAngle)}
                fill="none"
                stroke="rgba(255,255,255,0.12)"
                strokeWidth={1}
              />
            </G>
          );
        })}

        {/* Dış çerçeve halkası */}
        <Circle
          cx={cx} cy={cy} r={innerR + 2}
          fill="none"
          stroke="rgba(255,255,255,0.2)"
          strokeWidth={2}
        />

        {/* Merkez kapağı */}
        <Circle
          cx={cx} cy={cy} r={22}
          fill={colors.wheelCenter}
          stroke="rgba(255,255,255,0.55)"
          strokeWidth={2.5}
        />
        <Circle cx={cx} cy={cy} r={5} fill="rgba(255,255,255,0.75)" />
      </Svg>

      {/* Harita rozetleri — 3D küre efekti: renkli zemin daire + gölge + üst ışık + beyaz silüet */}
      {countries.map((country, i) => {
        const midAngle = i * segmentAngle + segmentAngle / 2;
        const midRad   = ((midAngle - 90) * Math.PI) / 180;
        const lx = cx + labelR * Math.cos(midRad);
        const ly = cy + labelR * Math.sin(midRad);
        const mapSource = MAP_IMAGES[country.code];
        if (!mapSource) return null;

        const badgeSize = mapSize + 10;
        const half      = badgeSize / 2;
        const iconSize  = Math.round(mapSize * 0.72);

        return (
          // Dış View: gölge için (overflow:hidden gölgeyi keser, bu yüzden ayrı katman)
          <View
            key={country.code}
            style={{
              position: 'absolute',
              left: lx - half,
              top:  ly - half,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.55,
              shadowRadius: 3,
              elevation: 5,
            }}
          >
            {/* İç View: yuvarlak kırpma + ülke renk zemini */}
            <View style={{
              width:  badgeSize,
              height: badgeSize,
              borderRadius: half,
              backgroundColor: country.color,
              overflow: 'hidden',
              borderWidth: 1.5,
              borderColor: 'rgba(255,255,255,0.50)',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              {/* Üst yarı parlak highlight — 3D küre hissi */}
              <View style={{
                position: 'absolute',
                top: 0, left: 0, right: 0,
                height: half,
                backgroundColor: 'rgba(255,255,255,0.22)',
                borderTopLeftRadius: half,
                borderTopRightRadius: half,
              }} />
              <Image
                source={mapSource}
                style={{
                  width:  iconSize,
                  height: iconSize,
                  tintColor: 'rgba(255,255,255,0.96)',
                }}
                resizeMode="contain"
              />
            </View>
          </View>
        );
      })}
    </Animated.View>
  );
}
