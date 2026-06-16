// Çekirdek oyun ekranı — tüm oyun mantığı burada (Aşama 1, bölünmemiş)
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
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { Svg, G, Path, Circle, Text as SvgText } from 'react-native-svg';
import {
  getHitSegment,
  isMatch,
  nextBallTarget,
  updateScore,
  GameState,
} from '../utils/gameLogic';
import { Country, LEVEL_1_COUNTRIES } from '../data/countries';
import { strings } from '../data/strings';

const { width, height } = Dimensions.get('window');

// Çark sabitleri
const WHEEL_RADIUS = 130;
const WHEEL_CX = width / 2;
const WHEEL_CY = height * 0.38;
const SEGMENT_COUNT = 4;

// Top sabitleri
const BALL_Y_REST = height * 0.78;   // topun dinlenme Y konumu
const BALL_Y_HIT = WHEEL_CY + WHEEL_RADIUS + 30; // çarpışma Y eşiği
const LAUNCH_DURATION = 350;          // ms — topun çarka ulaşma süresi

// Çark bir tam tur için kaç ms (yavaş = 4000ms)
const WHEEL_ROTATION_DURATION = 4000;

// SVG pie dilimi için path hesabı
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

type FeedbackType = 'correct' | 'wrong' | null;

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
  const [ballCountry, setBallCountry] = useState<Country>(wheelCountries[0]);
  const [feedback, setFeedback] = useState<{ type: FeedbackType; name?: string }>({ type: null });
  const [ballLaunched, setBallLaunched] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  // --- Çark dönüş açısı (Reanimated shared value) ---
  // Değer 0→360 aralığında sürekli artar; JS'e her frame okunur
  const wheelRotation = useSharedValue(0);

  // JS tarafında anlık rotation'ı okumak için ref (worklet olmayan ortam)
  const rotationRef = useRef(0);

  // Top Y pozisyonu animasyonu
  const ballY = useSharedValue(BALL_Y_REST);

  // --- Çark dönüşünü başlat ---
  useEffect(() => {
    // Sonsuz döngü: 0→360, sonra tekrar başlar (withRepeat)
    wheelRotation.value = withRepeat(
      withTiming(360, {
        duration: WHEEL_ROTATION_DURATION,
        easing: Easing.linear,
      }),
      -1,  // sonsuz tekrar
      false,
    );
    return () => cancelAnimation(wheelRotation);
  }, []);

  // Rotation değerini JS'e kopyala (çarpışma hesabı için)
  // Reanimated 4'te addListener ile JS tarafında takip edilir
  useEffect(() => {
    const interval = setInterval(() => {
      rotationRef.current = wheelRotation.value % 360;
    }, 16); // ~60fps
    return () => clearInterval(interval);
  }, []);

  // --- Animasyon stilleri ---
  const wheelStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${wheelRotation.value}deg` }],
  }));

  const ballStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: ballY.value - BALL_Y_REST }],
  }));

  // --- Geri bildirim mesajını göster ve kısa süre sonra sil ---
  const showFeedback = useCallback((type: FeedbackType, countryName?: string) => {
    setFeedback({ type, name: countryName });
    setTimeout(() => setFeedback({ type: null }), 1200);
  }, []);

  // --- Tap: topu fırlat ---
  // Çarpışma hesabı: top BALL_Y_HIT'e ulaşınca rotation okunur
  const handleTap = useCallback(() => {
    if (ballLaunched || gameOver) return;

    setBallLaunched(true);

    // Topu yukarı fırlat
    ballY.value = withTiming(BALL_Y_HIT, {
      duration: LAUNCH_DURATION,
      easing: Easing.out(Easing.quad),
    });

    // Çarpışma anında rotation'ı oku
    setTimeout(() => {
      const currentRotation = rotationRef.current;

      // Vurulan dilim index'i hesapla
      const hitIndex = getHitSegment(currentRotation, SEGMENT_COUNT);
      const hitCountry = wheelCountries[hitIndex];

      // Eşleştirme kontrolü
      const matched = isMatch(hitCountry.code, ballCountry.code);

      // Skor/can güncelleme
      const newState = updateScore(gameState, matched);
      setGameState(newState);

      // Geri bildirim göster (oyun durmaz)
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

  // --- Çark dilimlerini SVG ile çiz ---
  const segmentAngle = 360 / SEGMENT_COUNT;

  return (
    <TouchableOpacity
      style={styles.container}
      activeOpacity={1}
      onPress={handleTap}
    >
      {/* HUD: Puan ve Can */}
      <View style={styles.hud}>
        <Text style={styles.hudText}>{strings.puan}: {gameState.score}</Text>
        <Text style={styles.hudText}>
          {strings.can}: {'❤️'.repeat(Math.max(0, gameState.lives))}
        </Text>
      </View>

      {/* Combo göstergesi */}
      {gameState.combo >= 3 && (
        <Text style={styles.comboText}>{strings.combo(gameState.combo)}</Text>
      )}

      {/* Dönen çark */}
      <Animated.View style={[styles.wheelContainer, wheelStyle]}>
        <Svg width={WHEEL_RADIUS * 2} height={WHEEL_RADIUS * 2}
          viewBox={`${WHEEL_CX - WHEEL_RADIUS} ${WHEEL_CY - WHEEL_RADIUS} ${WHEEL_RADIUS * 2} ${WHEEL_RADIUS * 2}`}
        >
          {wheelCountries.map((country, i) => {
            const startAngle = i * segmentAngle;
            const endAngle = startAngle + segmentAngle;
            const midAngle = startAngle + segmentAngle / 2;
            const midRad = ((midAngle - 90) * Math.PI) / 180;
            const labelR = WHEEL_RADIUS * 0.62;
            const lx = WHEEL_CX + labelR * Math.cos(midRad);
            const ly = WHEEL_CY + labelR * Math.sin(midRad);

            return (
              <G key={country.code}>
                {/* Dilim arka planı — ülke rengiyle */}
                <Path
                  d={describeArc(WHEEL_CX, WHEEL_CY, WHEEL_RADIUS, startAngle, endAngle)}
                  fill={country.color}
                  stroke="#1a1a2e"
                  strokeWidth={2}
                />
                {/* Ülke kodu (asset yokken placeholder) */}
                <SvgText
                  x={lx}
                  y={ly}
                  textAnchor="middle"
                  alignmentBaseline="middle"
                  fontSize={14}
                  fontWeight="bold"
                  fill="#fff"
                >
                  {country.code.toUpperCase()}
                </SvgText>
              </G>
            );
          })}
          {/* Çark merkezi */}
          <Circle cx={WHEEL_CX} cy={WHEEL_CY} r={18} fill="#1a1a2e" stroke="#fff" strokeWidth={2} />
        </Svg>
      </Animated.View>

      {/* Bayrak desenli top */}
      <Animated.View style={[styles.ball, ballStyle, { backgroundColor: ballCountry.color }]}>
        <Text style={styles.ballText}>{ballCountry.code.toUpperCase()}</Text>
      </Animated.View>

      {/* Geri bildirim mesajı */}
      {feedback.type && (
        <View style={[
          styles.feedback,
          feedback.type === 'correct' ? styles.feedbackCorrect : styles.feedbackWrong,
        ]}>
          <Text style={styles.feedbackText}>
            {feedback.type === 'correct'
              ? `${strings.dogruIsabet}\n${strings.bayrakBilgisi(feedback.name ?? '')}`
              : strings.yanlisBayrak}
          </Text>
        </View>
      )}

      {/* Dokunma ipucu */}
      {!ballLaunched && !gameOver && (
        <Text style={styles.hint}>Ekrana dokun — fırlat!</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0d0d1a',
    alignItems: 'center',
  },
  hud: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 24,
    paddingTop: 56,
    paddingBottom: 8,
  },
  hudText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  comboText: {
    color: '#FFD700',
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 4,
  },
  wheelContainer: {
    position: 'absolute',
    top: WHEEL_CY - WHEEL_RADIUS,
    left: WHEEL_CX - WHEEL_RADIUS,
    width: WHEEL_RADIUS * 2,
    height: WHEEL_RADIUS * 2,
  },
  ball: {
    position: 'absolute',
    top: BALL_Y_REST - 36,
    left: width / 2 - 36,
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#fff',
  },
  ballText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  feedback: {
    position: 'absolute',
    top: height * 0.62,
    alignSelf: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  feedbackCorrect: {
    backgroundColor: 'rgba(0,200,100,0.85)',
  },
  feedbackWrong: {
    backgroundColor: 'rgba(220,50,50,0.85)',
  },
  feedbackText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
  hint: {
    position: 'absolute',
    bottom: 48,
    color: 'rgba(255,255,255,0.4)',
    fontSize: 14,
  },
});
