// HUD — lives hearts (left) + level (center)
import React from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';
import { strings } from '../data/strings';

type HUDProps = {
  lives: number;       // 0-3; filled = red, empty = gray
  level?: number;
  streak?: number;     // accepted but not displayed
};

function Hearts({ lives }: { lives: number }) {
  return (
    <View style={styles.heartsRow}>
      {[1, 2, 3].map((i) => (
        <Text
          key={i}
          style={[styles.heart, i <= lives ? styles.heartFull : styles.heartEmpty]}
        >
          ♥
        </Text>
      ))}
    </View>
  );
}

export default function HUD({ lives, level = 1 }: HUDProps) {
  return (
    <View style={styles.container}>
      {/* Left: lives hearts */}
      <View style={styles.block}>
        <Hearts lives={lives} />
      </View>

      {/* Center: level */}
      <View style={[styles.block, styles.center]}>
        <Text style={styles.levelText}>{strings.levelLabel(level)}</Text>
      </View>

      {/* Right: empty spacer for layout balance */}
      <View style={styles.block} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    width: '100%',
    paddingHorizontal: 20,
    paddingTop: 52,
    paddingBottom: 8,
  },
  block: {
    flex: 1,
    alignItems: 'flex-start',
  },
  center: {
    alignItems: 'center',
  },
  heartsRow: {
    flexDirection: 'row',
    gap: 4,
  },
  heart: {
    fontSize: 22,
  },
  heartFull: {
    color: '#ff3366',
  },
  heartEmpty: {
    color: 'rgba(255,255,255,0.18)',
  },
  levelText: {
    color: colors.neonBlue,
    fontFamily: Platform.OS === 'ios' ? 'AvenirNext-Heavy' : 'sans-serif-condensed',
    fontSize: 17,
    fontWeight: '900',
    letterSpacing: 3.5,
    marginTop: 10,
  },
});
