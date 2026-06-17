import React, { useMemo } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
  SharedValue,
} from 'react-native-reanimated';
import { Svg, Ellipse, Circle } from 'react-native-svg';

const { width, height } = Dimensions.get('window');

// --- Yıldız verileri (render'da değişmez) ---

type StarDef = {
  x: number;
  y: number;
  size: number;
  color: string;
  twinkleIdx: number | null; // hangi opacity SV kullanacak (null = statik)
  driftIdx: number | null;   // hangi translateY SV kullanacak
};

function buildStars(): StarDef[] {
  // Deterministic pseudo-random (LCG) — her çağrıda aynı seriyi üretir
  let seed = 42;
  const rand = () => {
    seed = (seed * 1664525 + 1013904223) & 0xffffffff;
    return (seed >>> 0) / 0xffffffff;
  };

  const stars: StarDef[] = [];
  const twinkleSlots = 5;
  const driftSlots   = 3;
  let twinkleCount = 0;
  let driftCount   = 0;

  for (let i = 0; i < 38; i++) {
    const x    = rand() * width;
    const y    = rand() * height;
    const size = 1.5 + rand() * 1.5; // 1.5-3px
    const blue = rand() > 0.6;
    const color = blue ? '#a8d8ff' : '#ffffff';

    const canTwinkle = twinkleCount < twinkleSlots && rand() > 0.75;
    const canDrift   = !canTwinkle && driftCount < driftSlots && rand() > 0.85;

    stars.push({
      x, y, size, color,
      twinkleIdx: canTwinkle ? twinkleCount++ : null,
      driftIdx:   canDrift   ? driftCount++   : null,
    });
  }
  return stars;
}

// --- Twinkle hook: 5 shared values ---
function useTwinkle() {
  const v0 = useSharedValue(1);
  const v1 = useSharedValue(1);
  const v2 = useSharedValue(1);
  const v3 = useSharedValue(1);
  const v4 = useSharedValue(1);

  const svs = [v0, v1, v2, v3, v4];

  React.useEffect(() => {
    const durations = [2200, 3100, 2700, 3800, 2500];
    svs.forEach((sv, i) => {
      sv.value = withRepeat(
        withSequence(
          withTiming(0.25, { duration: durations[i] / 2, easing: Easing.inOut(Easing.sin) }),
          withTiming(1,    { duration: durations[i] / 2, easing: Easing.inOut(Easing.sin) }),
        ),
        -1,
        false,
      );
    });
  }, []);

  return svs;
}

// --- Drift hook: 3 shared values ---
function useDrift() {
  const v0 = useSharedValue(0);
  const v1 = useSharedValue(0);
  const v2 = useSharedValue(0);

  const svs = [v0, v1, v2];
  const durations = [9000, 11500, 8200];

  React.useEffect(() => {
    svs.forEach((sv, i) => {
      sv.value = withRepeat(
        withTiming(height, { duration: durations[i], easing: Easing.linear }),
        -1,
        false,
      );
    });
  }, []);

  return svs;
}

// --- Planet rotation: 2 shared values ---
function usePlanetRot() {
  const r0 = useSharedValue(0);
  const r1 = useSharedValue(0);

  React.useEffect(() => {
    r0.value = withRepeat(
      withTiming(360, { duration: 14000, easing: Easing.linear }),
      -1,
      false,
    );
    r1.value = withRepeat(
      withTiming(360, { duration: 18000, easing: Easing.linear }),
      -1,
      false,
    );
  }, []);

  return [r0, r1];
}

// --- Star component ---
type StarProps = {
  def: StarDef;
  twinkleSVs: SharedValue<number>[];
  driftSVs: SharedValue<number>[];
};

function Star({ def, twinkleSVs, driftSVs }: StarProps) {
  const twinkleSV = def.twinkleIdx !== null ? twinkleSVs[def.twinkleIdx] : null;
  const driftSV   = def.driftIdx   !== null ? driftSVs[def.driftIdx]     : null;

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const style = useAnimatedStyle(() => {
    return {
      opacity:   twinkleSV ? twinkleSV.value : 0.7,
      transform: driftSV
        ? [{ translateY: driftSV.value % height }]
        : [],
    };
  });

  return (
    <Animated.View
      style={[
        styles.star,
        {
          left:         def.x - def.size / 2,
          top:          def.y - def.size / 2,
          width:        def.size,
          height:       def.size,
          borderRadius: def.size / 2,
          backgroundColor: def.color,
        },
        style,
      ]}
    />
  );
}

// --- Planet component ---
type PlanetProps = {
  rotSV: SharedValue<number>;
  cx: number;
  cy: number;
  r: number;
  color: string;
};

function Planet({ rotSV, cx, cy, r, color }: PlanetProps) {
  const style = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotSV.value}deg` }],
  }));

  return (
    <Animated.View
      pointerEvents="none"
      style={[{ position: 'absolute', left: cx - r, top: cy - r }, style]}
    >
      <Svg width={r * 2} height={r * 2}>
        <Circle cx={r} cy={r} r={r} fill={color} />
        {/* Halka */}
        <Ellipse
          cx={r}
          cy={r}
          rx={r * 1.55}
          ry={r * 0.35}
          fill="none"
          stroke={color}
          strokeWidth={1.5}
          opacity={0.3}
        />
      </Svg>
    </Animated.View>
  );
}

// --- Ana component ---
export default function SpaceBackground() {
  const stars      = useMemo(buildStars, []);
  const twinkleSVs = useTwinkle();
  const driftSVs   = useDrift();
  const [rot0, rot1] = usePlanetRot();

  return (
    <View style={styles.root} pointerEvents="none">
      {stars.map((def, i) => (
        <Star key={i} def={def} twinkleSVs={twinkleSVs} driftSVs={driftSVs} />
      ))}
      {/* Gezegen 1 — sol üst, biraz taşmış */}
      <Planet rotSV={rot0} cx={-8}        cy={80}          r={20} color="#3d1a6e" />
      {/* Gezegen 2 — sağ alt, biraz taşmış */}
      <Planet rotSV={rot1} cx={width + 5} cy={height - 90} r={13} color="#8b2500" />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    ...StyleSheet.absoluteFill,
    backgroundColor: '#0d0d1a',
    zIndex: -1,
  },
  star: {
    position: 'absolute',
  },
});
