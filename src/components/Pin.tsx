// Pin / ok komponenti — alttan fırlayan ve hedefe saplanan pin görseli.
// İki mod:
//   'active'  → alttan yukarı fırlatılacak pin; GameScreen Animated.View ile sarar.
//   'placed'  → hedefe saplanmış pin; GameScreen mutlak konumu hesaplayıp style ile iletir.
// Bounding box sabitleri (PIN_W, PIN_H) GameScreen pozisyon hesabında kullanılır.
import React from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import { Svg, Path, Rect } from 'react-native-svg';

// Bounding box — tüm pin görseli bu kutu içine sığar
export const PIN_W = 10;
export const PIN_H = 72;

// SVG renkleri
const BLADE_USER     = '#e8f4ff'; // kullanıcı pini bıçağı — gümüş/beyaz
const BLADE_OBS      = '#ff9ab8'; // engel pini bıçağı — açık pembe
const HANDLE_USER    = '#FFD700'; // kullanıcı tutacağı — neon altın
const HANDLE_OBS     = '#ff3355'; // engel tutacağı — neon kırmızı

// Tek pin SVG şekli: sivri uç (y=0) + bıçak gövdesi + renkli tutacak (y≈44-64)
// 'active' modda uç yukarıya (hedefe doğru) bakar.
// 'placed' modda GameScreen `rotate(angle+180)` uygular → uç hedefe doğru döner.
function PinSVG({ isObstacle }: { isObstacle: boolean }) {
  const W  = PIN_W; // 14
  const H  = PIN_H; // 64
  const cx = W / 2; // 7 — merkez x
  const bw = 2.5;   // bıçak yarı genişliği → bıçak = 5px

  const bladeColor  = isObstacle ? BLADE_OBS  : BLADE_USER;
  const handleColor = isObstacle ? HANDLE_OBS : HANDLE_USER;

  return (
    <Svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
      {/* Bıçak: sivri uç (cx,0) → iki yana (cx±bw, 14) → alt kenar (cx±bw, 44) */}
      <Path
        d={`M ${cx} 0 L ${cx + bw} 14 L ${cx + bw} 44 L ${cx - bw} 44 L ${cx - bw} 14 Z`}
        fill={bladeColor}
      />
      {/* Bıçak yüzey parıltısı (dikey şerit) */}
      <Path
        d={`M ${cx} 3 L ${cx + 1.5} 14 L ${cx + 1.5} 38 L ${cx} 40 Z`}
        fill="rgba(255,255,255,0.28)"
      />
      {/* Bıçak → tutacak geçiş trapezi (8px genişlikten 14px'e) */}
      <Path
        d={`M ${cx - bw} 42 L 0 47 L ${W} 47 L ${cx + bw} 42 Z`}
        fill={handleColor}
      />
      {/* Tutacak gövdesi */}
      <Rect x={0} y={46} width={W} height={H - 46} rx={4} fill={handleColor} />
      {/* Tutacak parıltısı */}
      <Rect x={2} y={49} width={3} height={H - 56} rx={1.5} fill="rgba(255,255,255,0.28)" />
    </Svg>
  );
}

type PinProps = {
  mode: 'active' | 'placed';
  isObstacle?: boolean;
  // 'placed' modda GameScreen mutlak konum + rotasyon hesaplayıp buraya iletir
  style?: StyleProp<ViewStyle>;
};

export default function Pin({ mode, isObstacle = false, style }: PinProps) {
  // Her iki modda da aynı görsel; fark konum ve rotasyondadır (GameScreen yönetir).
  return (
    <View style={[{ width: PIN_W, height: PIN_H }, style]}>
      <PinSVG isObstacle={isObstacle} />
    </View>
  );
}
