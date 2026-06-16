// Level atlama banner'ı — ekran ortasında belirip kaybolan animasyonlu kart
// visible prop true olduğunda tetiklenir; 1400ms sonra onDone çağrılır.
import React, { useEffect } from 'react';
import { StyleSheet, Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
  withDelay,
  runOnJS,
  Easing,
} from 'react-native-reanimated';
import { colors } from '../theme/colors';

type LevelUpBannerProps = {
  level: number;
  visible: boolean;
  onDone: () => void;
};

const TOTAL_DURATION = 1400; // ms — oyun bu süre donar

export default function LevelUpBanner({ level, visible, onDone }: LevelUpBannerProps) {
  const opacity = useSharedValue(0);
  const scale   = useSharedValue(0.5);

  useEffect(() => {
    if (!visible) return;

    // Hızlı giriş → tutma → çıkış
    opacity.value = withSequence(
      withTiming(1,   { duration: 200, easing: Easing.out(Easing.quad) }),
      withDelay(900,
        withTiming(0, { duration: 300, easing: Easing.in(Easing.quad) }),
      ),
    );
    scale.value = withSequence(
      withTiming(1.05, { duration: 220, easing: Easing.out(Easing.back(1.6)) }),
      withTiming(1,    { duration: 100 }),
      withDelay(780,
        withTiming(0.8, { duration: 300, easing: Easing.in(Easing.quad) }),
      ),
    );

    // Animasyon bitince oyunu devam ettir
    const timer = setTimeout(() => runOnJS(onDone)(), TOTAL_DURATION);
    return () => clearTimeout(timer);
  }, [visible, level]);

  const animStyle = useAnimatedStyle(() => ({
    opacity:   opacity.value,
    transform: [{ scale: scale.value }],
  }));

  if (!visible) return null;

  return (
    <Animated.View pointerEvents="none" style={[styles.container, animStyle]}>
      <Text style={styles.sub}>TEBRİKLER</Text>
      <Text style={styles.title}>SEVİYE {level}</Text>
      <Text style={styles.desc}>Çark hızlandı!</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    alignSelf: 'center',
    top: '38%',
    paddingHorizontal: 36,
    paddingVertical: 22,
    borderRadius: 20,
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.neonGold,
    alignItems: 'center',
    shadowColor: colors.neonGold,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 12,
    zIndex: 50,
  },
  sub: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 3,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  title: {
    color: colors.neonGold,
    fontSize: 38,
    fontWeight: '900',
    letterSpacing: 4,
    textShadowColor: colors.neonGold,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 14,
  },
  desc: {
    color: colors.neonBlue,
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 1.5,
    marginTop: 6,
  },
});
