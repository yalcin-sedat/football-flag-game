import React from 'react';
import Svg, {
  Circle,
  Defs,
  G,
  LinearGradient,
  Path,
  Polygon,
  Rect,
  Stop,
} from 'react-native-svg';

type IconProps = {
  color?: string;
  secondaryColor?: string;
  size?: number;
};

export function PlayIcon({
  color = '#ffffff',
  secondaryColor = '#00ff88',
  size = 28,
}: IconProps) {
  return (
    <Svg height={size} viewBox="0 0 32 32" width={size}>
      <Circle cx="16" cy="16" fill="none" r="14" stroke={secondaryColor} strokeWidth="3" />
      <Path d="M13 9.5 23 16 13 22.5Z" fill={color} />
    </Svg>
  );
}

export function SettingsIcon({ color = '#ffffff', size = 26 }: IconProps) {
  return (
    <Svg height={size} viewBox="0 0 32 32" width={size}>
      <Path
        d="M18.8 3 20 6.2a11.1 11.1 0 0 1 2.1 1.2l3.3-.6 2.8 4.8-2.3 2.5a10.7 10.7 0 0 1 0 2.4l2.3 2.5-2.8 4.8-3.3-.6a11.1 11.1 0 0 1-2.1 1.2L18.8 29h-5.6L12 25.8a11.1 11.1 0 0 1-2.1-1.2l-3.3.6L3.8 20.4l2.3-2.5a10.7 10.7 0 0 1 0-2.4l-2.3-2.5 2.8-4.8 3.3.6A11.1 11.1 0 0 1 12 6.2L13.2 3Z"
        fill="none"
        stroke={color}
        strokeLinejoin="round"
        strokeWidth="2.7"
      />
      <Circle cx="16" cy="16" fill="none" r="4.2" stroke={color} strokeWidth="2.7" />
    </Svg>
  );
}

export function CoinIcon({ size = 26 }: IconProps) {
  return (
    <Svg height={size} viewBox="0 0 32 32" width={size}>
      <Defs>
        <LinearGradient id="coinGold" x1="7" x2="25" y1="5" y2="27">
          <Stop offset="0" stopColor="#fff27a" />
          <Stop offset="0.55" stopColor="#ffd233" />
          <Stop offset="1" stopColor="#ff9e00" />
        </LinearGradient>
      </Defs>
      <Circle cx="16" cy="16" fill="url(#coinGold)" r="13" stroke="#fff3a3" strokeWidth="2" />
      <Circle cx="16" cy="16" fill="none" r="8.5" stroke="#9b5b00" strokeOpacity="0.45" strokeWidth="2" />
      <Path d="M11 16h10M16 10.8v10.4" stroke="#9b5b00" strokeLinecap="round" strokeWidth="2.3" />
    </Svg>
  );
}

export function GemIcon({ size = 26 }: IconProps) {
  return (
    <Svg height={size} viewBox="0 0 32 32" width={size}>
      <Defs>
        <LinearGradient id="gemBlue" x1="8" x2="25" y1="5" y2="27">
          <Stop offset="0" stopColor="#e7ffff" />
          <Stop offset="0.48" stopColor="#39dfff" />
          <Stop offset="1" stopColor="#2176ff" />
        </LinearGradient>
      </Defs>
      <Path d="M7 10.4 11.2 5h9.6L25 10.4 16 27Z" fill="url(#gemBlue)" stroke="#c7fbff" strokeWidth="1.6" />
      <Path d="M7 10.4h18M11.2 5 16 10.4 20.8 5M16 10.4v16.2" stroke="#ffffff" strokeOpacity="0.55" strokeWidth="1.3" />
    </Svg>
  );
}

export function BallBadgeIcon({ size = 38 }: IconProps) {
  return (
    <Svg height={size} viewBox="0 0 48 48" width={size}>
      <Circle cx="24" cy="24" fill="#f6fbff" r="19" stroke="#00d4ff" strokeWidth="2" />
      <Path d="M24 12 32 18.2 29 28H19l-3-9.8Z" fill="#101724" />
      <Path d="M24 12v-6M32 18.2l5.8-4.4M29 28l5.2 7M19 28l-5.2 7M16 18.2l-5.8-4.4" stroke="#101724" strokeOpacity="0.55" strokeWidth="2" />
      <Path d="M10 27c3 7.5 10.5 11.5 18.4 9.6" stroke="#e3343a" strokeLinecap="round" strokeWidth="4" />
      <Path d="M13 15c6.4-5.4 15.2-5.1 21.4.4" stroke="#1f7fff" strokeLinecap="round" strokeWidth="4" />
      <Path d="M9.5 22.2c1.7-1 3.6-1.9 5.5-2.6" stroke="#00a651" strokeLinecap="round" strokeWidth="4" />
      <Path d="M32.6 35.4c1.4-1.2 2.6-2.8 3.5-4.7" stroke="#ffd233" strokeLinecap="round" strokeWidth="4" />
    </Svg>
  );
}

export function TrophyIcon({ color = '#ffd233', size = 25 }: IconProps) {
  return (
    <Svg height={size} viewBox="0 0 32 32" width={size}>
      <Path d="M10 5h12v5.5c0 5.2-2.1 8.2-6 9.2-3.9-1-6-4-6-9.2Z" fill="none" stroke={color} strokeLinejoin="round" strokeWidth="2.6" />
      <Path d="M10 8H5.8c0 5 1.8 7.7 5.2 8.2M22 8h4.2c0 5-1.8 7.7-5.2 8.2M16 20v4.5M11.5 27h9" stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.6" />
    </Svg>
  );
}

export function CalendarIcon({ color = '#75f7ff', size = 24 }: IconProps) {
  return (
    <Svg height={size} viewBox="0 0 32 32" width={size}>
      <Rect fill="none" height="22" rx="4" stroke={color} strokeWidth="2.5" width="24" x="4" y="6" />
      <Path d="M9 4v6M23 4v6M5 13h22" stroke={color} strokeLinecap="round" strokeWidth="2.5" />
      <Circle cx="11" cy="18" fill={color} r="1.6" />
      <Circle cx="16" cy="18" fill={color} r="1.6" />
      <Circle cx="21" cy="18" fill={color} r="1.6" />
      <Circle cx="11" cy="23" fill={color} r="1.6" />
      <Circle cx="16" cy="23" fill={color} r="1.6" />
    </Svg>
  );
}

export function GlobeIcon({ color = '#75f7ff', size = 24 }: IconProps) {
  return (
    <Svg height={size} viewBox="0 0 32 32" width={size}>
      <Circle cx="16" cy="16" fill="none" r="12" stroke={color} strokeWidth="2.5" />
      <Path d="M4 16h24M16 4c3 3.2 4.4 7.1 4.4 12S19 24.8 16 28M16 4c-3 3.2-4.4 7.1-4.4 12S13 24.8 16 28" stroke={color} strokeLinecap="round" strokeWidth="2.2" />
    </Svg>
  );
}

export function BallCollectionIcon({ color = '#75f7ff', size = 24 }: IconProps) {
  return (
    <Svg height={size} viewBox="0 0 32 32" width={size}>
      <Circle cx="16" cy="16" fill="none" r="12" stroke={color} strokeWidth="2.5" />
      <Path d="M16 7.5 21 11l-1.8 5.8h-6.4L11 11ZM12.8 16.8 8 20.2M19.2 16.8l4.8 3.4M11 11 7.2 9M21 11l3.8-2M16 7.5V4.3M10.2 25.1l2.6-8.3M21.8 25.1l-2.6-8.3" stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
    </Svg>
  );
}

export function ChevronIcon({ color = '#ffffff', size = 18 }: IconProps) {
  return (
    <Svg height={size} viewBox="0 0 20 20" width={size}>
      <Path d="m7 4 6 6-6 6" fill="none" stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
    </Svg>
  );
}

export function FlagRibbonIcon({ size = 34 }: IconProps) {
  return (
    <Svg height={size} viewBox="0 0 48 48" width={size}>
      <Path d="M10 8h23l5 5-5 5H10Z" fill="#00d4ff" />
      <Path d="M10 18h27l-6 6 6 6H10Z" fill="#00ff88" />
      <Path d="M10 30h21l5 5-5 5H10Z" fill="#ffd233" />
      <Path d="M10 8v32" stroke="#ffffff" strokeLinecap="round" strokeWidth="3" />
    </Svg>
  );
}
