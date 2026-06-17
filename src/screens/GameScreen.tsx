// Çekirdek oyun ekranı — yeni pivot: dönen hedefe pin/ok saplama.
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
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { LEVELS, LevelConfig } from '../data/levels';
import {
  applySafeHit,
  createLevelState,
  GameState,
  getImpactAngle,
  isLevelComplete,
  willCollideWithPins,
} from '../utils/gameLogic';
import { sounds } from '../utils/sounds';
import { saveHighScoreIfBetter } from '../utils/storage';
import Target from '../components/Target';
import Pin, { PIN_W, PIN_H } from '../components/Pin';
import HUD from '../components/HUD';
import ScreenFlash, { FlashType } from '../components/ScreenFlash';
import LevelUpBanner from '../components/LevelUpBanner';
import SpaceBackground from '../components/SpaceBackground';
import { strings } from '../data/strings';

const { width, height } = Dimensions.get('window');

const TARGET_RADIUS = 115;
const TARGET_CX = width / 2;
const TARGET_CY = height * 0.38;
const PIN_Y_REST = height * 0.78;
const PIN_Y_HIT = TARGET_CY + TARGET_RADIUS + 20;


type Props = {
  onGameOver: (finalScore: number, isNewRecord: boolean) => void;
};

function buildLevelState(level: LevelConfig, previous?: GameState): GameState {
  return {
    ...createLevelState(level.requiredPins, level.initialPins),
    score: previous?.score ?? 0,
    streak: previous?.streak ?? 0,
    lives: previous?.lives ?? 3,
  };
}

export default function GameScreen({ onGameOver }: Props) {
  const [levelIdx, setLevelIdx] = useState(0);
  const [isLevelingUp, setIsLevelingUp] = useState(false);
  const [gameState, setGameState] = useState<GameState>(() => buildLevelState(LEVELS[0]));
  const [flash, setFlash] = useState<FlashType>(null);
  const [pinLaunched, setPinLaunched] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const level = LEVELS[levelIdx];
  const levelRef = useRef<LevelConfig>(level);
  const gameStateRef = useRef(gameState);
  // Bu levelde çarpışma/can kaybı oldu mu — perfect level banner kontrolü için
  const levelLostLife = useRef(false);

  const targetRotation = useSharedValue(0);
  const rotationRef = useRef(0);
  const pinY = useSharedValue(PIN_Y_REST);
  const shakeX = useSharedValue(0);
  const targetShakeY = useSharedValue(0);

  useEffect(() => {
    gameStateRef.current = gameState;
  }, [gameState]);

  useEffect(() => {
    levelRef.current = LEVELS[levelIdx];
    levelLostLife.current = false;
    setGameState((previous) => buildLevelState(LEVELS[levelIdx], previous));
  }, [levelIdx]);

  useEffect(() => {
    const directionMultiplier = level.direction === 'clockwise' ? 1 : -1;
    cancelAnimation(targetRotation);
    targetRotation.value = 0;
    if (level.speedPattern === 'switchDirection') {
      targetRotation.value = withRepeat(
        withSequence(
          withTiming(360 * directionMultiplier, {
            duration: level.rotationDuration,
            easing: Easing.inOut(Easing.sin),
          }),
          withTiming(0, {
            duration: level.rotationDuration,
            easing: Easing.inOut(Easing.sin),
          }),
        ),
        -1,
        false,
      );
    } else {
      targetRotation.value = withRepeat(
        withTiming(360 * directionMultiplier, {
          duration: level.rotationDuration,
          easing: Easing.linear,
        }),
        -1,
        false,
      );
    }

    return () => cancelAnimation(targetRotation);
  }, [levelIdx, level.direction, level.rotationDuration, level.speedPattern]);

  useEffect(() => {
    const interval = setInterval(() => {
      rotationRef.current = targetRotation.value % 360;
    }, 16);
    return () => clearInterval(interval);
  }, []);

  const shakeStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shakeX.value }],
  }));

  const targetShakeStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: targetShakeY.value }],
  }));

  const activePinStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: pinY.value - PIN_Y_REST }],
  }));

  const rotatingPinsStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${targetRotation.value}deg` }],
  }));

  function triggerShake() {
    shakeX.value = withSequence(
      withTiming(-9, { duration: 55 }),
      withTiming(8, { duration: 55 }),
      withTiming(-5, { duration: 50 }),
      withTiming(5, { duration: 50 }),
      withTiming(-2, { duration: 45 }),
      withTiming(0, { duration: 45 }),
    );
  }

  function finishGame(finalScore: number) {
    setGameOver(true);
    cancelAnimation(targetRotation);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    sounds.gameover();
    saveHighScoreIfBetter(finalScore).then((isNew) => {
      onGameOver(finalScore, isNew);
    });
  }

  function handleLevelUp(nextIdx: number) {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    sounds.correct();
    if (levelLostLife.current) {
      // Can yandı — banner gösterme, sessizce geç
      pinY.value = height + 100;
      pinY.value = withTiming(PIN_Y_REST, { duration: 280, easing: Easing.out(Easing.cubic) });
      setPinLaunched(false);
      setLevelIdx(nextIdx);
    } else {
      setIsLevelingUp(true);
      setLevelIdx(nextIdx);
    }
  }

  function handleLevelUpDone() {
    // Yeni level için taze pin alttan gelir
    pinY.value = height + 100;
    pinY.value = withTiming(PIN_Y_REST, {
      duration: 280,
      easing: Easing.out(Easing.cubic),
    });
    setIsLevelingUp(false);
    setPinLaunched(false);
  }

  const handleTap = useCallback(() => {
    if (pinLaunched || gameOver || isLevelingUp) return;

    const launchDuration = Math.max(40, 100 - levelIdx * 6);

    setPinLaunched(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    sounds.launch();

    pinY.value = withTiming(PIN_Y_HIT, {
      duration: launchDuration,
      easing: Easing.out(Easing.quad),
    });

    setTimeout(() => {
      const currentLevel = levelRef.current;
      const impactAngle = getImpactAngle(rotationRef.current);
      const collided = willCollideWithPins(
        impactAngle,
        gameStateRef.current.placedPins,
        currentLevel.collisionToleranceDeg,
      );

      if (collided) {
        levelLostLife.current = true;
        const newLives = gameStateRef.current.lives - 1;
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        sounds.wrong();
        triggerShake();
        setFlash('wrong');
        setTimeout(() => setFlash(null), 350);
        if (newLives <= 0) {
          setTimeout(() => finishGame(gameStateRef.current.score), 520);
        } else {
          setGameState((prev) => ({ ...prev, lives: newLives }));
          setTimeout(() => {
            const lvl = levelRef.current;
            setGameState((prev) => ({
              ...prev,
              placedPins: [...lvl.initialPins],
              remainingPins: lvl.requiredPins,
              streak: 0,
            }));
            pinY.value = height + 100;
            pinY.value = withTiming(PIN_Y_REST, { duration: 230, easing: Easing.out(Easing.cubic) });
            setPinLaunched(false);
          }, 600);
        }
        return;
      }

      const newState = applySafeHit(gameStateRef.current, impactAngle);
      setGameState(newState);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      sounds.correct();
      setFlash('correct');
      setTimeout(() => setFlash(null), 350);
      targetShakeY.value = withSequence(
        withTiming(-4, { duration: 40 }),
        withTiming(3,  { duration: 35 }),
        withTiming(-2, { duration: 30 }),
        withTiming(0,  { duration: 30 }),
      );

      // Saplanmış pin hedefe geçti; aktif pini anlık ekran altına gizle
      pinY.value = height + 100;

      const totalRequired = currentLevel.initialPins.length + currentLevel.requiredPins;
      if (isLevelComplete(newState.placedPins, totalRequired)) {
        const nextIdx = levelIdx + 1;
        if (nextIdx < LEVELS.length) {
          handleLevelUp(nextIdx);
        } else {
          finishGame(newState.score);
        }
        return;
      }

      // Yeni pin alttan kayarak yükselir; kullanıcı hemen tekrar dokunabilir
      pinY.value = withTiming(PIN_Y_REST, {
        duration: 230,
        easing: Easing.out(Easing.cubic),
      });
      setPinLaunched(false);
    }, launchDuration);
  }, [gameOver, isLevelingUp, levelIdx, pinLaunched]);

  return (
    <View style={styles.root}>
      <SpaceBackground />
      <Animated.View style={[styles.shakeWrapper, shakeStyle]}>
        <TouchableOpacity
          activeOpacity={1}
          onPress={handleTap}
          style={styles.container}
        >
          <HUD
            lives={gameState.lives}
            level={level.id}
            streak={gameState.streak}
          />

          {/* Target + placed pins share shake wrapper so they move together */}
          <Animated.View pointerEvents="none" style={[styles.targetGroup, targetShakeStyle]}>
            <Target
              rotation={targetRotation}
              radius={TARGET_RADIUS}
              remainingPins={gameState.remainingPins}
            />

            {/* Saplanmış pinler — hedefle birlikte döner */}
            <Animated.View
              pointerEvents="none"
              style={[styles.pinOrbit, { left: 0, top: 0 }, rotatingPinsStyle]}
            >
              {gameState.placedPins.map((angle, index) => (
                <Pin
                  key={`${angle}-${index}`}
                  mode="placed"
                  isObstacle={index < level.initialPins.length}
                  style={pinPositionStyle(angle)}
                />
              ))}
            </Animated.View>
          </Animated.View>

          {/* Aktif pin — tap ile yukarı fırlar */}
          <Animated.View
            pointerEvents="none"
            style={[styles.activePin, activePinStyle]}
          >
            <Pin mode="active" />
          </Animated.View>

          {!pinLaunched && !gameOver && !isLevelingUp && (
            <Text style={styles.hint}>{strings.tapToThrow}</Text>
          )}
        </TouchableOpacity>
      </Animated.View>

      <LevelUpBanner
        level={level.id}
        onDone={handleLevelUpDone}
        visible={isLevelingUp}
      />

      <ScreenFlash flashType={flash} />
    </View>
  );
}

// Saplanmış pinin pinOrbit içindeki mutlak konumu.
// isObstacle bilgisi Pin komponenti tarafından renk için ayrıca alınır.
function pinPositionStyle(angle: number) {
  const rad      = ((angle - 90) * Math.PI) / 180;
  const distance = TARGET_RADIUS + 18;
  const x        = TARGET_RADIUS + Math.cos(rad) * distance;
  const y        = TARGET_RADIUS + Math.sin(rad) * distance;
  return {
    position: 'absolute' as const,
    left:  x - PIN_W / 2,
    top:   y - PIN_H / 2,
    // +180: SVG'deki uç (y=0, üst) hedefe doğru döner
    transform: [{ rotate: `${angle + 180}deg` }],
  };
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
    alignItems: 'center',
    flex: 1,
  },
  target: {
    left: TARGET_CX - TARGET_RADIUS,
    position: 'absolute',
    top: TARGET_CY - TARGET_RADIUS,
  },
  targetGroup: {
    left: TARGET_CX - TARGET_RADIUS,
    position: 'absolute',
    top: TARGET_CY - TARGET_RADIUS,
  },
  pinOrbit: {
    height: TARGET_RADIUS * 2,
    left: TARGET_CX - TARGET_RADIUS,
    position: 'absolute',
    top: TARGET_CY - TARGET_RADIUS,
    width: TARGET_RADIUS * 2,
  },
  placedPin: {
    borderColor: 'rgba(0,0,0,0.35)',
    borderRadius: 4,
    borderWidth: 1,
    height: 68,
    position: 'absolute',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 3,
    width: 5,
  },
  activePin: {
    height: 90,
    left: width / 2 - PIN_W / 2,
    position: 'absolute',
    top: PIN_Y_REST - 36,
    width: PIN_W,
  },
  feedbackWrapper: {
    alignSelf: 'center',
    position: 'absolute',
    top: height * 0.62,
  },
  hint: {
    bottom: 48,
    color: 'rgba(255,255,255,0.48)',
    fontSize: 14,
    position: 'absolute',
  },
});
