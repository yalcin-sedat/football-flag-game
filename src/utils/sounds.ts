// Ses efekti yöneticisi — expo-av ile CC0 sesler
// assets/sounds/ klasörüne eklenecek dosyalar:
//   tap.mp3       — top dokunma
//   launch.mp3    — fırlatma
//   correct.mp3   — doğru eşleşme
//   wrong.mp3     — yanlış eşleşme
//   gameover.mp3  — oyun bitti
// Dosya yoksa hata VERMEZ, sessizce devam eder.
import { Audio } from 'expo-av';

type SoundName = 'tap' | 'launch' | 'correct' | 'wrong' | 'gameover';

const soundFiles: Record<SoundName, ReturnType<typeof require> | null> = {
  tap:      tryRequire('../../../assets/sounds/tap.mp3'),
  launch:   tryRequire('../../../assets/sounds/launch.mp3'),
  correct:  tryRequire('../../../assets/sounds/correct.mp3'),
  wrong:    tryRequire('../../../assets/sounds/wrong.mp3'),
  gameover: tryRequire('../../../assets/sounds/gameover.mp3'),
};

// require() derleme zamanında değerlendirilir; dosya yoksa hata atar.
// Çalışma ortamında null döner — try/catch ile yakalanır.
function tryRequire(path: string) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    return require(path);
  } catch {
    return null;
  }
}

// Yüklenmiş ses nesneleri önbelleği
const cache: Partial<Record<SoundName, Audio.Sound>> = {};

async function play(name: SoundName, volume = 1.0): Promise<void> {
  const file = soundFiles[name];
  if (!file) return; // asset henüz yok — sessiz devam

  try {
    // Önbellekte varsa tekrar kullan
    let sound = cache[name];
    if (!sound) {
      const { sound: s } = await Audio.Sound.createAsync(file, { volume });
      cache[name] = s;
      sound = s;
    }
    await sound.setPositionAsync(0);
    await sound.setVolumeAsync(volume);
    await sound.playAsync();
  } catch {
    // Ses çalarken hata — oyunu engelleme
  }
}

export const sounds = {
  tap:      () => play('tap',      0.6),
  launch:   () => play('launch',   0.7),
  correct:  () => play('correct',  1.0),
  wrong:    () => play('wrong',    0.85),
  gameover: () => play('gameover', 1.0),
};
