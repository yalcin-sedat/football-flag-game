// Çekirdek oyun ekranı — tüm oyun mantığı burada; görsel componentler ayrı
// [2026-06-16] Refactor: inline SVG/View'lar → Wheel/Ball/HUD/FeedbackMessage
// [2026-06-16] Aşama 2b: ekran titremesi, renk flaşı, haptic + ses
// [2026-06-17] Aşama 2c: dinamik level sistemi, level geçiş animasyonu, yüksek skor
// [2026-06-17] Aşama 2c+: Level 4 countdown timer desteği
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, {
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import {
  getHitSegment,
  isMatch,
  nextBallTarget,
  updateScore,
  GameState,
} from '../utils/gameLogic';
import { sounds } from '../utils/sounds';
import { saveHighScoreIfBetter } from '../utils/storage';
import { LEVELS, LevelConfig } from '../data/levels';
import Wheel from '../components/Wheel';
import Ball from '../components/Ball';
import HUD from '../components/HUD';
import FeedbackMessage, { FeedbackResult } from '../components/FeedbackMessage';
import ScreenFlash, { FlashType } from '../components/ScreenFlash';
import LevelUpBanner from '../components/LevelUpBanner';

const { width, height } = Dimensions.get('window');

// Çark sabitleri (konum değişmez; boyut/içerik level'a göre değişir)
const WHEEL_RADIUS = 130;
const WHEEL_CX = width / 2;
const WHEEL_CY = height * 0.38;

// Top sabitleri
const BALL_Y_REST    = height * 0.78;
const BALL_Y_HIT     = WHEEL_CY + WHEEL_RADIUS + 30;
const LAUNCH_DURATION = 350;

type Props = {
  onGameOver: (finalScore: number, isNewRecord: boolean) => void;
};

export default function GameScreen({ onGameOver }: Props) {
  // --- Level state ---
  const [levelIdx, setLevelIdx]           = useState(0);
  const [isLevelingUp, setIsLevelingUp]   = useState(false);
  const levelRef = useRef<LevelConfig>(LEVELS[0]);

  const level         = LEVELS[levelIdx];
  const wheelCountries = level.countries;
  const segmentCount   = level.countries.length;

  // --- Oyun state ---
  const [gameState, setGameState]         = useState<GameState>({ score: 0, lives: 3, combo: 0 });
  const [ballCountry, setBallCountry]     = useState(wheelCountries[0]);
  const [feedback, setFeedback]           = useState<FeedbackResult>({ type: null });
  const [flash, setFlash]                 = useState<FlashType>(null);
  const [ballLaunched, setBallLaunched]   = useState(false);
  const [gameOver, setGameOver]           = useState(false);

  // --- Countdown timer (sadece timeLimitSeconds olan levellar için) ---
  const [timeLeft, setTimeLeft]           = useState<number | null>(null);

  // --- Animasyon shared value'ları ---
  const wheelRotation  = useSharedValue(0);
  const rotationRef    = useRef(0);
  const ballY          = useSharedValue(BALL_Y_REST);
  const shakeX         = useSharedValue(0);

  // gameState'in her zaman güncel kopyası — timer callback'lerinde stale closure önler
  const gameStateRef = useRef(gameState);
  useEffect(() => { gameStateRef.current = gameState; }, [gameState]);

  // --- Çark dönüşünü level hızına göre başlat / yeniden başlat ---
  useEffect(() => {
    levelRef.current = LEVELS[levelIdx];
    cancelAnimation(wheelRotation);
    wheelRotation.value = 0; // sıfırla — hız değişince tutarlı başlangıç

    wheelRotation.value = withRepeat(
      withTiming(360, {
        duration: levelRef.current.rotationDuration,
        easing: Easing.linear,
      }),
      -1,
      false,
    );

    return () => cancelAnimation(wheelRotation);
  }, [levelIdx]);

  // Rotation değerini JS'e kopyala (çarpışma hesabı için)
  useEffect(() => {
    const interval = setInterval(() => {
      rotationRef.current = wheelRotation.value % 360;
    }, 16);
    return () => clearInterval(interval);
  }, []);

  // Level değişince top ülkesini sıfırla
  useEffect(() => {
    setBallCountry(LEVELS[levelIdx].countries[0]);
  }, [levelIdx]);

  // Level değişince timer'ı başlat (timeLimitSeconds yoksa null — timer gösterilmez)
  useEffect(() => {
    const limit = LEVELS[levelIdx].timeLimitSeconds;
    setTimeLeft(limit !== undefined ? limit : null);
  }, [levelIdx]);

  // Countdown — her saniye bir azalt
  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0 || gameOver) return;
    const timer = setTimeout(
      () => setTimeLeft((t) => (t !== null ? t - 1 : null)),
      1000,
    );
    return () => clearTimeout(timer);
  }, [timeLeft, gameOver]);

  // Süre doldu → game over (gameStateRef ile stale closure'dan kaçın)
  useEffect(() => {
    if (timeLeft !== 0 || gameOver) return;
    const finalState = gameStateRef.current;
    setGameOver(true);
    cancelAnimation(wheelRotation);
    sounds.gameover();
    saveHighScoreIfBetter(finalState.score).then((isNew) => {
      onGameOver(finalState.score, isNew);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft]);

  // --- Animasyon stilleri ---
  const shakeStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shakeX.value }],
  }));

  // --- Yanlış vuruş titremesi ---
  function triggerShake() {
    shakeX.value = withSequence(
      withTiming(-9, { duration: 55 }),
      withTiming( 8, { duration: 55 }),
      withTiming(-5, { duration: 50 }),
      withTiming( 5, { duration: 50 }),
      withTiming(-2, { duration: 45 }),
      withTiming( 0, { duration: 45 }),
    );
  }

  // --- Geri bildirim + efektler ---
  const showFeedback = useCallback((type: 'correct' | 'wrong', countryName?: string) => {
    setFeedback({ type, countryName });
    setFlash(type);

    if (type === 'correct') {
      sounds.correct();
    } else {
      sounds.wrong();
      triggerShake();
    }

    setTimeout(() => setFeedback({ type: null }), 1200);
    setTimeout(() => setFlash(null), 500);
  }, []);

  // --- Level atlama ---
  function handleLevelUp(nextIdx: number) {
    setIsLevelingUp(true);
    sounds.correct(); // kısa sevinç sesi
    // LevelUpBanner.onDone() çağrıldığında oyun devam eder (aşağıda)
    setLevelIdx(nextIdx);
  }

  function handleLevelUpDone() {
    setIsLevelingUp(false);
    setBallLaunched(false);
  }

  // --- Tap: topu fırlat ---
  const handleTap = useCallback(() => {
    if (ballLaunched || gameOver || isLevelingUp) return;

    setBallLaunched(true);
    sounds.launch();

    // Topu yukarı fırlat
    ballY.value = withTiming(BALL_Y_HIT, {
      duration: LAUNCH_DURATION,
      easing: Easing.out(Easing.quad),
    });

    // Çarpışma anında rotation'ı oku
    setTimeout(() => {
      const currentRotation = rotationRef.current;
      const hitIndex   = getHitSegment(currentRotation, segmentCount);
      const hitCountry = wheelCountries[hitIndex];
      const matched    = isMatch(hitCountry.code, ballCountry.code);
      const newState   = updateScore(gameState, matched);
      setGameState(newState);

      showFeedback(matched ? 'correct' : 'wrong', hitCountry.name);

      // Topu geri döndür
      ballY.value = withTiming(BALL_Y_REST, {
        duration: 300,
        easing: Easing.in(Easing.quad),
      });

      setTimeout(() => {
        // Oyun bitti mi?
        if (newState.lives <= 0) {
          setGameOver(true);
          cancelAnimation(wheelRotation);
          sounds.gameover();
          // Yüksek skoru kaydet; sonuçla birlikte üst component'e bildir
          saveHighScoreIfBetter(newState.score).then((isNew) => {
            onGameOver(newState.score, isNew);
          });
          return;
        }

        // Level atlama kontrolü
        const currentLevel = levelRef.current;
        const nextIdx = levelIdx + 1;
        if (
          currentLevel.scoreToAdvance !== null &&
          newState.score >= currentLevel.scoreToAdvance &&
          nextIdx < LEVELS.length
        ) {
          handleLevelUp(nextIdx);
          return;
        }

        // Devam — yeni hedef bayrak üret
        const next = nextBallTarget(wheelCountries, ballCountry.code);
        setBallCountry(next);
        setBallLaunched(false);
      }, 350);
    }, LAUNCH_DURATION);
  }, [ballLaunched, gameOver, isLevelingUp, gameState, ballCountry, wheelCountries, segmentCount, levelIdx]);

  return (
    <View style={styles.root}>
      {/* Shake animasyonu tüm oyun alanına uygulanır */}
      <Animated.View style={[styles.shakeWrapper, shakeStyle]}>
        <TouchableOpacity
          style={styles.container}
          activeOpacity={1}
          onPress={handleTap}
        >
          {/* HUD: Puan, Can, Seviye, Kombo */}
          <HUD
            score={gameState.score}
            lives={gameState.lives}
            combo={gameState.combo}
            level={level.id}
          />

          {/* Dönen çark — rotation SharedValue Wheel'e geçirilir */}
          <Wheel
            countries={wheelCountries}
            rotation={wheelRotation}
            radius={WHEEL_RADIUS}
            style={styles.wheelContainer}
          />

          {/* Bayrak desenli top — ballY SharedValue Ball'a geçirilir */}
          <Ball
            country={ballCountry}
            ballY={ballY}
            restY={BALL_Y_REST}
            style={styles.ball}
          />

          {/* Geri bildirim mesajı — her zaman mount'lı */}
          <View style={styles.feedbackWrapper} pointerEvents="none">
            <FeedbackMessage result={feedback} />
          </View>

          {/* Countdown timer — sadece timeLimitSeconds olan levellar */}
          {timeLeft !== null && (
            <Text style={[styles.timer, timeLeft <= 10 && styles.timerUrgent]}>
              {timeLeft}
            </Text>
          )}

          {/* Dokunma ipucu */}
          {!ballLaunched && !gameOver && !isLevelingUp && (
            <Text style={styles.hint}>Ekrana dokun — fırlat!</Text>
          )}
        </TouchableOpacity>
      </Animated.View>

      {/* Level atlama banner'ı — shake'in dışında, ortada */}
      <LevelUpBanner
        level={level.id}
        visible={isLevelingUp}
        onDone={handleLevelUpDone}
      />

      {/* Tam ekran renk flaşı */}
      <ScreenFlash flashType={flash} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    overflow: 'hidden',
  },
  shakeWrapper: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#0d0d1a',
    alignItems: 'center',
  },
  wheelContainer: {
    position: 'absolute',
    top: WHEEL_CY - WHEEL_RADIUS,
    left: WHEEL_CX - WHEEL_RADIUS,
  },
  ball: {
    position: 'absolute',
    top: BALL_Y_REST - 36,
    left: width / 2 - 36,
  },
  feedbackWrapper: {
    position: 'absolute',
    top: height * 0.62,
    alignSelf: 'center',
  },
  hint: {
    position: 'absolute',
    bottom: 48,
    color: 'rgba(255,255,255,0.4)',
    fontSize: 14,
  },
  timer: {
    position: 'absolute',
    top: height * 0.55,
    color: '#FFD700',
    fontSize: 40,
    fontWeight: 'bold',
  },
  timerUrgent: {
    color: '#FF4444',
  },
});
