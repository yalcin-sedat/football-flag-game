// HUD (Heads-Up Display) — puan, can ve seviye göstergesi
// Skor değişince scale ile "zıplayan" küçük animasyon için Reanimated kullanılır.
import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { colors } from '../theme/colors';
import { strings } from '../data/strings';

type HUDProps = {
  score: number;
  lives: number;
  combo: number;
  level?: number;
};

const MAX_LIVES = 3;

export default function HUD({ score, lives, combo, level = 1 }: HUDProps) {
  // Puan değişince skor rakamı kısa scale animasyonu yapar
  const scoreScale = useSharedValue(1);

  useEffect(() => {
    if (score > 0) {
      scoreScale.value = withSequence(
        withTiming(1.35, { duration: 100, easing: Easing.out(Easing.quad) }),
        withTiming(1,    { duration: 150, easing: Easing.in(Easing.quad) }),
      );
    }
  }, [score]);

  const scoreStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scoreScale.value }],
  }));

  return (
    <View style={styles.container}>
      {/* Sol: Puan */}
      <View style={styles.block}>
        <Text style={styles.label}>{strings.puan}</Text>
        <Animated.Text style={[styles.scoreValue, scoreStyle]}>
          {score}
        </Animated.Text>
      </View>

      {/* Orta: Seviye + Combo */}
      <View style={[styles.block, styles.center]}>
        <Text style={styles.levelText}>SEVİYE {level}</Text>
        {combo >= 3 && (
          <Text style={styles.comboText}>{strings.combo(combo)}</Text>
        )}
        {combo >= 10 && (
          <Text style={styles.fireText}>{strings.yaniyorsun}</Text>
        )}
      </View>

      {/* Sağ: Can kalpleri */}
      <View style={[styles.block, styles.right]}>
        <Text style={styles.label}>{strings.can}</Text>
        <View style={styles.hearts}>
          {Array.from({ length: MAX_LIVES }).map((_, i) => (
            <Text
              key={i}
              style={[styles.heart, i < lives ? styles.heartFull : styles.heartEmpty]}
            >
              ♥
            </Text>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    width: '100%',
    paddingHorizontal: 20,
    paddingTop: 52,
    paddingBottom: 8,
  },
  block: {
    flex: 1,
    alignItems: 'flex-start',
  },
  center: {
    alignItems: 'center',
  },
  right: {
    alignItems: 'flex-end',
  },
  label: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  scoreValue: {
    color: colors.neonGold,
    fontSize: 30,
    fontWeight: 'bold',
  },
  levelText: {
    color: colors.neonBlue,
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 1.5,
  },
  comboText: {
    color: colors.neonGold,
    fontSize: 15,
    fontWeight: 'bold',
    marginTop: 4,
  },
  fireText: {
    color: colors.neonOrange,
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 2,
  },
  hearts: {
    flexDirection: 'row',
    gap: 4,
    marginTop: 3,
  },
  heart: {
    fontSize: 22,
  },
  heartFull: {
    color: colors.heartFull,
  },
  heartEmpty: {
    color: colors.heartEmpty,
  },
});
