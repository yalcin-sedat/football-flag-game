// Dönen çark componenti — SVG dilimler + Reanimated rotasyon
// Rotation değeri parent'tan (GameScreen) SharedValue olarak gelir;
// böylece çarpışma anında GameScreen doğrudan rotation'ı okuyabilir.
import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  type SharedValue,
} from 'react-native-reanimated';
import { Svg, G, Path, Circle, Text as SvgText } from 'react-native-svg';
import { Country } from '../data/countries';
import { colors } from '../theme/colors';

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
  const innerR = radius - 6;       // dilim iç kenar (dış çerçeve için boşluk)
  const segmentAngle = 360 / countries.length;

  return (
    <Animated.View style={[{ width: size, height: size }, animStyle, style]}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>

        {/* Arka plan dairesi (koyu zemin) */}
        <Circle cx={cx} cy={cy} r={innerR + 4} fill={colors.surface} />

        {/* Dilimler */}
        {countries.map((country, i) => {
          const startAngle = i * segmentAngle;
          const endAngle   = startAngle + segmentAngle;
          const midAngle   = startAngle + segmentAngle / 2;
          const midRad     = ((midAngle - 90) * Math.PI) / 180;
          // Etiket konumu: yarıçapın %60'ında
          const labelR = innerR * 0.60;
          const lx = cx + labelR * Math.cos(midRad);
          const ly = cy + labelR * Math.sin(midRad);

          return (
            <G key={country.code}>
              {/* Dilim dolgusu — ülke rengi */}
              <Path
                d={describeArc(cx, cy, innerR, startAngle, endAngle)}
                fill={country.color}
                stroke={colors.wheelStroke}
                strokeWidth={3}
              />
              {/* İnce parlak iç kenar */}
              <Path
                d={describeArc(cx, cy, innerR, startAngle, endAngle)}
                fill="none"
                stroke="rgba(255,255,255,0.12)"
                strokeWidth={1}
              />
              {/* ISO kodu — harita PNG asset eklenince <Image> ile değiştirilecek */}
              <SvgText
                x={lx}
                y={ly}
                textAnchor="middle"
                alignmentBaseline="middle"
                fontSize={15}
                fontWeight="bold"
                fill="#fff"
                opacity={0.95}
              >
                {country.code.toUpperCase()}
              </SvgText>
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
        {/* Merkez nokta */}
        <Circle cx={cx} cy={cy} r={5} fill="rgba(255,255,255,0.75)" />
      </Svg>
    </Animated.View>
  );
}
