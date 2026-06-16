// Uygulama kök navigasyonu — home → game → gameover → home
// [2026-06-16] Agent 2: HomeScreen + GameOverScreen eklendi, ekran tipi genişletildi
// [2026-06-17] Aşama 2c: isNewRecord parametresi eklendi
import 'react-native-gesture-handler';
import React, { useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import HomeScreen    from './src/screens/HomeScreen';
import GameScreen    from './src/screens/GameScreen';
import GameOverScreen from './src/screens/GameOverScreen';

type Screen = 'home' | 'game' | 'gameover';

export default function App() {
  const [screen, setScreen]           = useState<Screen>('home');
  const [finalScore, setFinalScore]   = useState(0);
  const [isNewRecord, setIsNewRecord] = useState(false);

  function handlePlay()                                         { setScreen('game'); }
  function handleGameOver(score: number, newRecord: boolean)   { setFinalScore(score); setIsNewRecord(newRecord); setScreen('gameover'); }
  function handleRestart()               { setScreen('game'); }
  function handleHome()                  { setScreen('home'); }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar style="light" />

      {screen === 'home' && (
        <HomeScreen onPlay={handlePlay} />
      )}

      {screen === 'game' && (
        <GameScreen onGameOver={handleGameOver} />
      )}

      {screen === 'gameover' && (
        <GameOverScreen
          finalScore={finalScore}
          isNewRecord={isNewRecord}
          onRestart={handleRestart}
          onHome={handleHome}
        />
      )}
    </GestureHandlerRootView>
  );
}
