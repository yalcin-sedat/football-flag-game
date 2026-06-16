import 'react-native-gesture-handler';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import GameScreen from './src/screens/GameScreen';
import { strings } from './src/data/strings';

type Screen = 'game' | 'gameover';

export default function App() {
  const [screen, setScreen] = useState<Screen>('game');
  const [finalScore, setFinalScore] = useState(0);

  function handleGameOver(score: number) {
    setFinalScore(score);
    setScreen('gameover');
  }

  function handleRestart() {
    setScreen('game');
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar style="light" />
      {screen === 'game' ? (
        <GameScreen onGameOver={handleGameOver} />
      ) : (
        // Game Over ekranı — Agent 2 bunu stilleyecek, şimdilik sade
        <View style={styles.gameOver}>
          <Text style={styles.gameOverTitle}>{strings.oyunBitti}</Text>
          <Text style={styles.gameOverScore}>{strings.puan}: {finalScore}</Text>
          <TouchableOpacity style={styles.button} onPress={handleRestart}>
            <Text style={styles.buttonText}>{strings.tekrarOyna}</Text>
          </TouchableOpacity>
        </View>
      )}
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  gameOver: {
    flex: 1,
    backgroundColor: '#0d0d1a',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
  },
  gameOverTitle: {
    color: '#fff',
    fontSize: 36,
    fontWeight: 'bold',
  },
  gameOverScore: {
    color: '#FFD700',
    fontSize: 24,
  },
  button: {
    backgroundColor: '#E30A17',
    paddingHorizontal: 40,
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 12,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
