// Yerel kalıcı veri — AsyncStorage tabanlı; hatalar sessizce atlanır
import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY_HIGH_SCORE = '@flag_striker:high_score';

export async function getHighScore(): Promise<number> {
  try {
    const val = await AsyncStorage.getItem(KEY_HIGH_SCORE);
    return val ? parseInt(val, 10) : 0;
  } catch {
    return 0;
  }
}

// Yeni skor eskisinden yüksekse kaydeder; yeni rekor ise true döner
export async function saveHighScoreIfBetter(score: number): Promise<boolean> {
  try {
    const current = await getHighScore();
    if (score > current) {
      await AsyncStorage.setItem(KEY_HIGH_SCORE, String(score));
      return true;
    }
    return false;
  } catch {
    return false;
  }
}
