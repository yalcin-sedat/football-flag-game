// Oyun Bitti ekranı — final skor, yeni rekor rozeti, butonlar
// [2026-06-17] Aşama 2c: isNewRecord prop + AsyncStorage yüksek skor gösterimi
import React, { useEffect, useState } from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { getHighScore } from '../utils/storage';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import { colors } from '../theme/colors';
import { strings } from '../data/strings';

const { width } = Dimensions.get('window');

type GameOverScreenProps = {
  finalScore: number;
  isNewRecord?: boolean;
  onRestart: () => void;
  onHome: () => void;
};

export default function GameOverScreen({ finalScore, isNewRecord = false, onRestart, onHome }: GameOverScreenProps) {
  const [highScore, setHighScore] = useState(0);

  useEffect(() => {
    getHighScore().then(setHighScore);
  }, []);
  // Giriş animasyonları — sıralı fade-in
  const titleOpacity  = useSharedValue(0);
  const titleY        = useSharedValue(-24);
  const scoreOpacity  = useSharedValue(0);
  const scoreScale    = useSharedValue(0.6);
  const btnOpacity    = useSharedValue(0);

  useEffect(() => {
    // Başlık
    titleOpacity.value = withTiming(1, { duration: 400, easing: Easing.out(Easing.quad) });
    titleY.value       = withTiming(0, { duration: 400, easing: Easing.out(Easing.quad) });
    // Skor — gecikmeli
    scoreOpacity.value = withDelay(350,
      withTiming(1, { duration: 400, easing: Easing.out(Easing.quad) }),
    );
    scoreScale.value = withDelay(350,
      withSequence(
        withTiming(1.15, { duration: 300, easing: Easing.out(Easing.back(1.5)) }),
        withTiming(1,    { duration: 200, easing: Easing.in(Easing.quad) }),
      ),
    );
    // Butonlar
    btnOpacity.value = withDelay(700,
      withTiming(1, { duration: 350, easing: Easing.out(Easing.quad) }),
    );
  }, []);

  const titleStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
    transform: [{ translateY: titleY.value }],
  }));
  const scoreStyle = useAnimatedStyle(() => ({
    opacity: scoreOpacity.value,
    transform: [{ scale: scoreScale.value }],
  }));
  const btnStyle = useAnimatedStyle(() => ({
    opacity: btnOpacity.value,
  }));

  return (
    <View style={styles.container}>
      {/* Başlık */}
      <Animated.Text style={[styles.title, titleStyle]}>
        {strings.oyunBitti}
      </Animated.Text>

      {/* Skor kartı */}
      <Animated.View style={[styles.scoreCard, scoreStyle]}>
        {isNewRecord && (
          <View style={styles.newRecordBadge}>
            <Text style={styles.newRecordText}>🏆 {strings.yeniRekor}</Text>
          </View>
        )}
        <Text style={styles.scoreLabel}>{strings.finalSkor}</Text>
        <Text style={styles.scoreValue}>{finalScore}</Text>
        {!isNewRecord && highScore > 0 && (
          <Text style={styles.highScoreText}>{strings.enYuksek(highScore)}</Text>
        )}
      </Animated.View>

      {/* Butonlar */}
      <Animated.View style={[styles.buttons, btnStyle]}>
        <TouchableOpacity style={styles.btnPrimary} onPress={onRestart} activeOpacity={0.75}>
          <Text style={styles.btnPrimaryText}>{strings.tekrarOyna}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.btnSecondary} onPress={onHome} activeOpacity={0.75}>
          <Text style={styles.btnSecondaryText}>{strings.anaMenue}</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 32,
  },
  title: {
    color: colors.neonRed,
    fontSize: 42,
    fontWeight: '900',
    letterSpacing: 4,
    textShadowColor: colors.neonRed,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 16,
  },
  scoreCard: {
    width: width * 0.6,
    backgroundColor: colors.surface,
    borderRadius: 20,
    paddingVertical: 28,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255,215,0,0.35)',
    shadowColor: colors.neonGold,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  scoreLabel: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  scoreValue: {
    color: colors.neonGold,
    fontSize: 56,
    fontWeight: '900',
  },
  newRecordBadge: {
    backgroundColor: 'rgba(255,215,0,0.15)',
    borderWidth: 1,
    borderColor: colors.neonGold,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 5,
    marginBottom: 10,
  },
  newRecordText: {
    color: colors.neonGold,
    fontSize: 13,
    fontWeight: 'bold',
    letterSpacing: 1.5,
  },
  highScoreText: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
    letterSpacing: 0.5,
  },
  buttons: {
    width: width * 0.72,
    gap: 14,
  },
  btnPrimary: {
    backgroundColor: 'rgba(0,255,136,0.14)',
    borderWidth: 1.5,
    borderColor: colors.neonGreen,
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
    shadowColor: colors.neonGreen,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.45,
    shadowRadius: 10,
    elevation: 6,
  },
  btnPrimaryText: {
    color: colors.neonGreen,
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  btnSecondary: {
    backgroundColor: 'rgba(0,212,255,0.07)',
    borderWidth: 1,
    borderColor: 'rgba(0,212,255,0.3)',
    borderRadius: 14,
    paddingVertical: 13,
    alignItems: 'center',
  },
  btnSecondaryText: {
    color: colors.textDim,
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 1,
  },
});
