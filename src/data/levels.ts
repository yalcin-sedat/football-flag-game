// Level tanımları — her level ülke kümesi, çark hızı ve geçiş eşiğini belirler
import { Country, GROUP_A_COUNTRIES } from './countries';

export type LevelConfig = {
  id: number;
  countries: Country[];
  rotationDuration: number; // ms — tam bir dönüş süresi (küçüldükçe hızlanır)
  scoreToAdvance: number | null; // null = son level
};

export const LEVELS: LevelConfig[] = [
  {
    id: 1,
    countries: GROUP_A_COUNTRIES.slice(0, 4), // 4 dilim — kolay başlangıç
    rotationDuration: 4000,
    scoreToAdvance: 10,
  },
  {
    id: 2,
    countries: GROUP_A_COUNTRIES.slice(0, 6), // 6 dilim — orta zorluk
    rotationDuration: 3200,
    scoreToAdvance: 25,
  },
  {
    id: 3,
    countries: GROUP_A_COUNTRIES,             // 8 dilim — tüm Grup A
    rotationDuration: 2600,
    scoreToAdvance: null,
  },
];
