// Level-up banner — floats up from near the pin launch point, fades out in place
// visible=true → slide up + fade in → hold → fade out, then onDone fires
import React, { useEffect } from 'react';
import { Dimensions, StyleSheet, Text } from 'react-native';
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { colors } from '../theme/colors';
import { strings } from '../data/strings';

type LevelUpBannerProps = {
  level: number;
  visible: boolean;
  onDone: () => void;
};

const { width, height } = Dimensions.get('window');
const BANNER_H  = 62;
const TOTAL_MS  = 1450;
// Resting offset (translateY=0 lands here); slides in from +50px below
const RISE_PX   = 50;

export default function LevelUpBanner({ level, visible, onDone }: LevelUpBannerProps) {
  const translateY = useSharedValue(RISE_PX);
  const opacity    = useSharedValue(0);

  useEffect(() => {
    if (!visible) return;

    // Rise from below + fade in → hold → fade out
    translateY.value = withSequence(
      withTiming(0,       { duration: 260, easing: Easing.out(Easing.cubic) }),
      withDelay(930,
        withTiming(RISE_PX, { duration: 260, easing: Easing.in(Easing.cubic) }),
      ),
    );
    opacity.value = withSequence(
      withTiming(1, { duration: 220 }),
      withDelay(930,
        withTiming(0, { duration: 260 }),
      ),
    );

    const timer = setTimeout(() => runOnJS(onDone)(), TOTAL_MS);
    return () => clearTimeout(timer);
  }, [visible, level]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity:   opacity.value,
  }));

  if (!visible) return null;

  return (
    <Animated.View pointerEvents="none" style={[styles.banner, animStyle]}>
      <Text style={styles.text}>
        {strings.levelLabelPrefix} <Text style={styles.num}>{level}</Text>
        {'  '}
        <Text style={styles.emoji}>🎉</Text>
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  banner: {
    position: 'absolute',
    // sit just above the pin launch zone (PIN_Y_REST ≈ height * 0.78)
    top: height * 0.72 - BANNER_H,
    alignSelf: 'center',
    width: width * 0.67,
    height: BANNER_H,
    borderRadius: 14,
    backgroundColor: 'rgba(14,10,30,0.92)',
    borderWidth: 1.5,
    borderColor: colors.neonGold,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.neonGold,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 14,
    elevation: 14,
    zIndex: 50,
  },
  text: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  num: {
    color: colors.neonGold,
    fontWeight: '900',
    textShadowColor: colors.neonGold,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  emoji: {
    fontSize: 16,
  },
});
