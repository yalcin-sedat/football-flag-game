// Ses efekti yöneticisi — expo-audio tabanlı, lazy yükleme + önbellekleme
// expo-audio SDK 56'nın resmi ses paketi (expo-av'ın halefi)
import { createAudioPlayer, setAudioModeAsync } from 'expo-audio';
import type { AudioPlayer } from 'expo-audio';

type SoundName = 'tap' | 'launch' | 'correct' | 'wrong' | 'gameover';

// Metro bundler statik analiz için require'lar build-time çözülmeli
const SOUND_SOURCES: Record<SoundName, number> = {
  tap:      require('../../assets/sounds/tap.mp3'),
  launch:   require('../../assets/sounds/launch.mp3'),
  correct:  require('../../assets/sounds/correct.mp3'),
  wrong:    require('../../assets/sounds/wrong.mp3'),
  gameover: require('../../assets/sounds/gameover.mp3'),
};

const VOLUMES: Record<SoundName, number> = {
  tap:      0.6,
  launch:   0.7,
  correct:  1.0,
  wrong:    0.85,
  gameover: 1.0,
};

// Önbellek — her ses için tek player instance
const cache: Partial<Record<SoundName, AudioPlayer>> = {};

let modeSet = false;
async function ensureAudioMode() {
  if (modeSet) return;
  modeSet = true;
  try {
    await setAudioModeAsync({ playsInSilentMode: true });
  } catch {
    // cihaz desteklemiyorsa sessizce geç
  }
}

async function play(name: SoundName): Promise<void> {
  try {
    await ensureAudioMode();

    if (!cache[name]) {
      const player = createAudioPlayer(SOUND_SOURCES[name]);
      player.volume = VOLUMES[name];
      cache[name] = player;
    }

    const player = cache[name]!;
    // Başa sar ve çal
    await player.seekTo(0);
    player.volume = VOLUMES[name];
    player.play();
  } catch {
    // ses çalamazsa oyunu kesme
  }
}

export const sounds = {
  tap:      () => play('tap'),
  launch:   () => play('launch'),
  correct:  () => play('correct'),
  wrong:    () => play('wrong'),
  gameover: () => play('gameover'),
};
