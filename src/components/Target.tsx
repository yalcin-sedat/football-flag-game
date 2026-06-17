// Dönen hedef diski — sade arcade SVG, ülke dilimi yok
// rotation: GameScreen'den gelen SharedValue; GameScreen rotasyonu yönetir.
import React, { useEffect } from 'react';
import { StyleProp, Text, ViewStyle } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';
import { Svg, Circle, Line } from 'react-native-svg';
import { colors } from '../theme/colors';

type TargetProps = {
  rotation: SharedValue<number>;
  radius?: number;
  remainingPins?: number;
  style?: StyleProp<ViewStyle>;
};

export default function Target({ rotation, radius = 130, remainingPins, style }: TargetProps) {
  const animStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  // rotation.value * -1 ile negatif değerlerde "--180deg" hatası önlenir
  const counterStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value * -1}deg` }],
  }));

  // İsabetli atışta sayıya kısa pulse
  const numScale = useSharedValue(1);
  useEffect(() => {
    if (remainingPins === undefined) return;
    numScale.value = withSequence(
      withTiming(1.5, { duration: 80,  easing: Easing.out(Easing.quad) }),
      withTiming(1,   { duration: 160, easing: Easing.in(Easing.quad) }),
    );
  }, [remainingPins]);

  const numScaleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: numScale.value }],
  }));

  const size    = radius * 2;
  const c       = radius;
  const r       = radius - 4;
  const centerR = Math.round(r * 0.38); // iç yardımcı halkayla aynı yarıçap

  const ticks = Array.from({ length: 24 }, (_, i) => {
    const angleDeg = i * 15 - 90;
    const rad = (angleDeg * Math.PI) / 180;
    const isMajor = i % 2 === 0;
    const r1 = r - 2;
    const r2 = r - (isMajor ? 14 : 7);
    return {
      x1: c + r1 * Math.cos(rad),
      y1: c + r1 * Math.sin(rad),
      x2: c + r2 * Math.cos(rad),
      y2: c + r2 * Math.sin(rad),
      stroke: isMajor ? 'rgba(255,255,255,0.42)' : 'rgba(255,255,255,0.18)',
      strokeWidth: isMajor ? 2 : 1,
    };
  });

  return (
    <Animated.View style={[{ width: size, height: size }, animStyle, style]}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <Circle cx={c} cy={c} r={r} fill="#141428" />
        <Circle cx={c} cy={c} r={r}
          fill="none" stroke={colors.neonBlue} strokeWidth={2.5} opacity={0.88} />
        <Circle cx={c} cy={c} r={r * 0.68}
          fill="none" stroke="rgba(0,212,255,0.18)" strokeWidth={1.5} />
        <Circle cx={c} cy={c} r={centerR}
          fill="none" stroke="rgba(0,212,255,0.28)" strokeWidth={1.5} />
        {ticks.map((t, i) => (
          <Line
            key={i}
            x1={t.x1} y1={t.y1}
            x2={t.x2} y2={t.y2}
            stroke={t.stroke}
            strokeWidth={t.strokeWidth}
          />
        ))}
        <Circle cx={c} cy={c} r={centerR} fill="#0d1133" />
        <Circle cx={c} cy={c} r={centerR}
          fill="none" stroke={colors.neonBlue} strokeWidth={1.5} opacity={0.75} />
      </Svg>

      {/* Sayı: disk dönüşünü iptal eden katman + isabetli atışta pulse */}
      {remainingPins !== undefined && (
        <Animated.View
          pointerEvents="none"
          style={[{
            position: 'absolute',
            width: size,
            height: size,
            alignItems: 'center',
            justifyContent: 'center',
          }, counterStyle]}
        >
          <Animated.View style={numScaleStyle}>
            <Text style={{
              color: remainingPins === 0 ? '#00ffcc' : '#ffffff',
              fontSize: remainingPins >= 10 ? centerR * 0.72 : centerR * 0.88,
              fontWeight: 'bold',
              lineHeight: centerR * 1.1,
            }}>
              {remainingPins}
            </Text>
          </Animated.View>
        </Animated.View>
      )}
    </Animated.View>
  );
}
