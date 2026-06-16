// Çekirdek oyun ekranı — tüm oyun mantığı burada; görsel componentler ayrı
// [2026-06-16] Refactor: inline SVG/View'lar → Wheel/Ball/HUD/FeedbackMessage componentlerine taşındı
// [2026-06-16] Aşama 2b: ekran titremesi, renk flaşı, haptic + ses altyapısı eklendi
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
import * as Haptics from 'expo-haptics';
import {
  getHitSegment,
  isMatch,
  nextBallTarget,
  updateScore,
  GameState,
} from '../utils/gameLogic';
import { Country, LEVEL_1_COUNTRIES } from '../data/countries';
import { sounds } from '../utils/sounds';
import Wheel from '../components/Wheel';
import Ball from '../components/Ball';
import HUD from '../components/HUD';
import FeedbackMessage, { FeedbackResult } from '../components/FeedbackMessage';
import ScreenFlash, { FlashType } from '../components/ScreenFlash';

const { width, height } = Dimensions.get('window');

// Çark sabitleri
const WHEEL_RADIUS = 130;
const WHEEL_CX = width / 2;
const WHEEL_CY = height * 0.38;
const SEGMENT_COUNT = 4;

// Top sabitleri
const BALL_Y_REST = height * 0.78;   // topun dinlenme Y konumu (merkezi)
const BALL_Y_HIT  = WHEEL_CY + WHEEL_RADIUS + 30; // çarpışma Y eşiği
const LAUNCH_DURATION = 350;          // ms — topun çarka ulaşma süresi

// Çark bir tam tur için kaç ms (yavaş = 4000ms)
const WHEEL_ROTATION_DURATION = 4000;

type Props = {
  onGameOver: (finalScore: number) => void;
};

export default function GameScreen({ onGameOver }: Props) {
  const wheelCountries = LEVEL_1_COUNTRIES;

  // --- State ---
  const [gameState, setGameState] = useState<GameState>({
    score: 0,
    lives: 3,
    combo: 0,
  });
  const [ballCountry, setBallCountry]   = useState<Country>(wheelCountries[0]);
  const [feedback, setFeedback]         = useState<FeedbackResult>({ type: null });
  const [flash, setFlash]               = useState<FlashType>(null);
  const [ballLaunched, setBallLaunched] = useState(false);
  const [gameOver, setGameOver]         = useState(false);

  // --- Çark dönüş açısı (Reanimated shared value) ---
  // Değer 0→360 aralığında sürekli artar; Wheel componenti doğrudan kullanır
  const wheelRotation = useSharedValue(0);

  // JS tarafında anlık rotation'ı okumak için ref (worklet olmayan ortam)
  const rotationRef = useRef(0);

  // Top Y pozisyonu — Ball componenti doğrudan kullanır (translateY = ballY - restY)
  const ballY = useSharedValue(BALL_Y_REST);

  // Ekran titremesi — yanlış vuruşta X ekseninde sallama
  const shakeX = useSharedValue(0);

  // --- Çark dönüşünü başlat ---
  useEffect(() => {
    // Sonsuz döngü: 0→360, sonra tekrar başlar
    wheelRotation.value = withRepeat(
      withTiming(360, {
        duration: WHEEL_ROTATION_DURATION,
        easing: Easing.linear,
      }),
      -1,
      false,
    );
    return () => cancelAnimation(wheelRotation);
  }, []);

  // Rotation değerini JS'e kopyala (çarpışma hesabı için)
  useEffect(() => {
    const interval = setInterval(() => {
      rotationRef.current = wheelRotation.value % 360;
    }, 16); // ~60fps
    return () => clearInterval(interval);
  }, []);

  // Animasyon stili — ekran titremesi
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
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      sounds.correct();
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      sounds.wrong();
      triggerShake();
    }

    setTimeout(() => setFeedback({ type: null }), 1200);
    setTimeout(() => setFlash(null), 500);
  }, []);

  // --- Tap: topu fırlat ---
  // Çarpışma hesabı: top BALL_Y_HIT'e ulaşınca rotation okunur
  const handleTap = useCallback(() => {
    if (ballLaunched || gameOver) return;

    setBallLaunched(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    sounds.launch();

    // Topu yukarı fırlat
    ballY.value = withTiming(BALL_Y_HIT, {
      duration: LAUNCH_DURATION,
      easing: Easing.out(Easing.quad),
    });

    // Çarpışma anında rotation'ı oku
    setTimeout(() => {
      const currentRotation = rotationRef.current;

      // Vurulan dilim index'i hesapla
      const hitIndex   = getHitSegment(currentRotation, SEGMENT_COUNT);
      const hitCountry = wheelCountries[hitIndex];

      // Eşleştirme kontrolü
      const matched = isMatch(hitCountry.code, ballCountry.code);

      // Skor/can güncelleme
      const newState = updateScore(gameState, matched);
      setGameState(newState);

      // Geri bildirim + efektler
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
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
          onGameOver(newState.score);
          return;
        }

        // Yeni hedef bayrak üret
        const next = nextBallTarget(wheelCountries, ballCountry.code);
        setBallCountry(next);
        setBallLaunched(false);
      }, 350);
    }, LAUNCH_DURATION);
  }, [ballLaunched, gameOver, gameState, ballCountry, wheelCountries]);

  return (
    // Dış kapsayıcı: overflow:hidden shake sırasında taşmayı önler
    <View style={styles.root}>
      {/* Shake animasyonu tüm oyun alanına uygulanır */}
      <Animated.View style={[styles.shakeWrapper, shakeStyle]}>
        <TouchableOpacity
          style={styles.container}
          activeOpacity={1}
          onPress={handleTap}
        >
          {/* HUD: Puan, Can, Seviye, Kombo */}
          <HUD score={gameState.score} lives={gameState.lives} combo={gameState.combo} />

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

          {/* Geri bildirim mesajı — her zaman mount'lı, opacity ile gizlenir */}
          <View style={styles.feedbackWrapper} pointerEvents="none">
            <FeedbackMessage result={feedback} />
          </View>

          {/* Dokunma ipucu */}
          {!ballLaunched && !gameOver && (
            <Text style={styles.hint}>Ekrana dokun — fırlat!</Text>
          )}
        </TouchableOpacity>
      </Animated.View>

      {/* Tam ekran renk flaşı — shake dışında, en üstte */}
      <ScreenFlash flashType={flash} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    overflow: 'hidden', // shake sırasında içeriğin taşmasını engeller
  },
  shakeWrapper: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#0d0d1a',
    alignItems: 'center',
  },
  // Çark konumlandırması — Wheel componenti kendi boyutunu bilir
  wheelContainer: {
    position: 'absolute',
    top: WHEEL_CY - WHEEL_RADIUS,
    left: WHEEL_CX - WHEEL_RADIUS,
  },
  // Top konumlandırması — Ball componenti varsayılan boyutu 72; yarısı = 36
  ball: {
    position: 'absolute',
    top: BALL_Y_REST - 36,
    left: width / 2 - 36,
  },
  // Geri bildirim sarmalayıcı — FeedbackMessage içi zaten pointerEvents="none"
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
});
