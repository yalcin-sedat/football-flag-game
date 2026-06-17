import React, { ReactNode, useEffect } from 'react';
import {
  Alert,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import {
  BallBadgeIcon,
  BallCollectionIcon,
  CalendarIcon,
  ChevronIcon,
  CoinIcon,
  FlagRibbonIcon,
  GemIcon,
  GlobeIcon,
  PlayIcon,
  SettingsIcon,
  TrophyIcon,
} from '../components/icons/GameIcons';
import { strings } from '../data/strings';

const homeBackground = require('../../assets/backgrounds/home-background-world.png');

type HomeScreenProps = {
  onPlay: () => void;
};

type LockedMenuKey = 'daily' | 'leaderboard' | 'collection' | 'settings';

const LOCKED_MENU_MESSAGES: Record<LockedMenuKey, string> = {
  collection: strings.karakterler,
  daily: strings.gunlukGorev,
  leaderboard: strings.siralama,
  settings: strings.ayarlar,
};

const menuItems: Array<{
  icon: ReactNode;
  key: LockedMenuKey;
  label: string;
}> = [
  { icon: <CalendarIcon />, key: 'daily', label: strings.gunlukGorev.toUpperCase() },
  { icon: <TrophyIcon />, key: 'leaderboard', label: strings.siralama.toUpperCase() },
  { icon: <BallCollectionIcon />, key: 'collection', label: strings.toplar },
];

export default function HomeScreen({ onPlay }: HomeScreenProps) {
  const { height, width } = useWindowDimensions();
  const compact = height < 760;
  const shellWidth = Math.min(width - 32, 380);
  const titleScale = Math.min(Math.max(width / 390, 0.9), 1.08);
  const menuTop = compact ? height * 0.36 : height * 0.39;
  const buttonHeight = compact ? 56 : 62;

  function handleLockedMenu(key: LockedMenuKey) {
    Alert.alert(LOCKED_MENU_MESSAGES[key], strings.yakinda);
  }

  return (
    <View style={styles.container}>
      <ImageBackground
        source={homeBackground}
        resizeMode="cover"
        style={styles.background}
      >
        <View style={styles.scrim} />
        <View style={styles.vignetteTop} />
        <View style={styles.vignetteBottom} />

        <SafeAreaView style={styles.safeArea}>
          <View style={styles.topBar}>
            <PlayerProgress compact={compact} />

            <View style={styles.topActions}>
              <CurrencyPill icon={<CoinIcon />} value="1.250" />
              <CurrencyPill icon={<GemIcon />} value="85" />
              <TouchableOpacity
                accessibilityLabel={strings.ayarlar}
                accessibilityRole="button"
                activeOpacity={0.82}
                onPress={() => handleLockedMenu('settings')}
                style={styles.settingsButton}
              >
                <SettingsIcon size={25} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={[styles.brand, { marginTop: compact ? 22 : 34 }]}>
            <FlagRibbonIcon size={compact ? 28 : 34} />
            <Text style={[styles.brandKicker, { fontSize: 15 * titleScale }]}>
              {strings.brandKicker}
            </Text>
            <Text style={[styles.brandTitle, { fontSize: 39 * titleScale }]}>
              {strings.brandTitle}
            </Text>
            <View style={styles.brandRule} />
          </View>

          <View
            style={[
              styles.menuShell,
              {
                top: menuTop,
                transform: [{ translateX: -shellWidth / 2 }],
                width: shellWidth,
              },
            ]}
          >
            <View style={styles.shellHeader}>
              <GlobeIcon color="#75f7ff" size={22} />
              <Text style={styles.shellHeaderText}>{strings.worldArena}</Text>
            </View>

            <PrimaryButton height={buttonHeight + 8} onPress={onPlay} />

            <View style={styles.secondaryGrid}>
              {menuItems.map((item, index) => (
                <SecondaryButton
                  delay={160 + index * 140}
                  icon={item.icon}
                  key={item.key}
                  label={item.label}
                  onPress={() => handleLockedMenu(item.key)}
                />
              ))}
            </View>
          </View>
        </SafeAreaView>
      </ImageBackground>
    </View>
  );
}

type PlayerProgressProps = {
  compact: boolean;
};

function PlayerProgress({ compact }: PlayerProgressProps) {
  return (
    <View style={[styles.playerCard, compact && styles.playerCardCompact]}>
      <View style={styles.avatarFrame}>
        <BallBadgeIcon size={compact ? 32 : 37} />
      </View>
      <View style={styles.playerCopy}>
        <Text style={styles.rankText}>{strings.rankStriker}</Text>
        <Text style={styles.levelText}>{strings.levelLabel(25)}</Text>
        <View style={styles.xpTrack}>
          <View style={styles.xpFill} />
        </View>
      </View>
    </View>
  );
}

type CurrencyPillProps = {
  icon: ReactNode;
  value: string;
};

function CurrencyPill({ icon, value }: CurrencyPillProps) {
  return (
    <View style={styles.currencyPill}>
      <View style={styles.currencyIcon}>{icon}</View>
      <Text style={styles.currencyText}>{value}</Text>
    </View>
  );
}

type PrimaryButtonProps = {
  height: number;
  onPress: () => void;
};

function PrimaryButton({ height, onPress }: PrimaryButtonProps) {
  const pulse = usePulse(0);

  const glowStyle = useAnimatedStyle(() => ({
    opacity: 0.18 + pulse.value * 0.34,
    transform: [{ scale: 1 + pulse.value * 0.018 }],
  }));

  return (
    <TouchableOpacity
      accessibilityLabel={strings.oyna}
      accessibilityRole="button"
      activeOpacity={0.82}
      onPress={onPress}
      style={[styles.primaryButton, { height }]}
    >
      <Animated.View pointerEvents="none" style={[styles.primaryGlow, glowStyle]} />
      <View style={styles.primaryIconFrame}>
        <PlayIcon size={32} />
      </View>
      <Text style={styles.primaryButtonText}>{strings.oyna}</Text>
      <View style={styles.primaryChevron}>
        <ChevronIcon color="#001522" size={22} />
      </View>
    </TouchableOpacity>
  );
}

type SecondaryButtonProps = {
  delay: number;
  icon: ReactNode;
  label: string;
  onPress: () => void;
};

function SecondaryButton({ delay, icon, label, onPress }: SecondaryButtonProps) {
  const pulse = usePulse(delay);

  const glowStyle = useAnimatedStyle(() => ({
    opacity: 0.08 + pulse.value * 0.18,
  }));

  return (
    <TouchableOpacity
      accessibilityLabel={label}
      accessibilityRole="button"
      activeOpacity={0.82}
      onPress={onPress}
      style={styles.secondaryButton}
    >
      <Animated.View pointerEvents="none" style={[styles.secondaryGlow, glowStyle]} />
      <View style={styles.secondaryIconFrame}>{icon}</View>
      <Text numberOfLines={1} style={styles.secondaryText}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

function usePulse(delay: number) {
  const pulse = useSharedValue(0);

  useEffect(() => {
    pulse.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(1, { duration: 1050, easing: Easing.inOut(Easing.sin) }),
          withTiming(0, { duration: 1050, easing: Easing.inOut(Easing.sin) }),
        ),
        -1,
        false,
      ),
    );
  }, [delay, pulse]);

  return pulse;
}

const styles = StyleSheet.create({
  avatarFrame: {
    alignItems: 'center',
    backgroundColor: 'rgba(0, 212, 255, 0.08)',
    borderColor: '#ffd233',
    borderRadius: 24,
    borderWidth: 1.5,
    height: 46,
    justifyContent: 'center',
    marginRight: 10,
    width: 46,
  },
  background: {
    flex: 1,
    height: '100%',
    width: '100%',
  },
  brand: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  brandKicker: {
    color: '#75f7ff',
    fontWeight: '900',
    letterSpacing: 0,
    marginTop: 3,
    textShadowColor: '#001b2f',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  brandRule: {
    backgroundColor: '#00ff88',
    borderRadius: 2,
    height: 4,
    marginTop: 5,
    shadowColor: '#00ff88',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 10,
    width: 126,
  },
  brandTitle: {
    color: '#ffffff',
    fontWeight: '900',
    letterSpacing: 0,
    lineHeight: 43,
    textShadowColor: '#00d4ff',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 16,
  },
  container: {
    backgroundColor: '#02050d',
    flex: 1,
  },
  currencyIcon: {
    alignItems: 'center',
    height: 25,
    justifyContent: 'center',
    marginRight: 5,
    width: 25,
  },
  currencyPill: {
    alignItems: 'center',
    backgroundColor: 'rgba(2, 12, 29, 0.82)',
    borderColor: 'rgba(117, 247, 255, 0.28)',
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: 'row',
    minWidth: 82,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  currencyText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0,
  },
  levelText: {
    color: '#75f7ff',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0,
    marginTop: 1,
  },
  menuShell: {
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: 'rgba(1, 12, 28, 0.72)',
    borderColor: 'rgba(0, 212, 255, 0.28)',
    borderRadius: 24,
    borderWidth: 1,
    left: '50%',
    padding: 13,
    position: 'absolute',
    shadowColor: '#00d4ff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.28,
    shadowRadius: 22,
  },
  playerCard: {
    alignItems: 'center',
    backgroundColor: 'rgba(2, 12, 29, 0.82)',
    borderColor: 'rgba(0, 212, 255, 0.36)',
    borderRadius: 17,
    borderWidth: 1,
    flexDirection: 'row',
    minHeight: 60,
    paddingLeft: 7,
    paddingRight: 12,
    shadowColor: '#00d4ff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.32,
    shadowRadius: 10,
  },
  playerCardCompact: {
    minHeight: 54,
    transform: [{ scale: 0.94 }],
  },
  playerCopy: {
    width: 94,
  },
  primaryButton: {
    alignItems: 'center',
    alignSelf: 'stretch',
    backgroundColor: '#00b963',
    borderColor: '#7dffb7',
    borderRadius: 19,
    borderWidth: 2,
    flexDirection: 'row',
    justifyContent: 'center',
    overflow: 'hidden',
    shadowColor: '#00ff88',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 18,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 29,
    fontWeight: '900',
    letterSpacing: 0,
    textShadowColor: 'rgba(0,0,0,0.36)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 3,
  },
  primaryChevron: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 15,
    height: 30,
    justifyContent: 'center',
    position: 'absolute',
    right: 18,
    width: 30,
  },
  primaryGlow: {
    backgroundColor: '#89ffd2',
    bottom: -10,
    left: 30,
    position: 'absolute',
    right: 30,
    shadowColor: '#00ff88',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 24,
    top: -10,
  },
  primaryIconFrame: {
    alignItems: 'center',
    backgroundColor: 'rgba(0, 23, 37, 0.42)',
    borderColor: 'rgba(255,255,255,0.78)',
    borderRadius: 19,
    borderWidth: 1,
    height: 42,
    justifyContent: 'center',
    left: 16,
    position: 'absolute',
    width: 48,
  },
  rankText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0,
  },
  safeArea: {
    flex: 1,
  },
  scrim: {
    backgroundColor: 'rgba(0, 5, 16, 0.24)',
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  secondaryButton: {
    alignItems: 'center',
    backgroundColor: 'rgba(1, 28, 52, 0.9)',
    borderColor: 'rgba(0, 212, 255, 0.58)',
    borderRadius: 16,
    borderWidth: 1,
    flex: 1,
    height: 72,
    justifyContent: 'center',
    minWidth: 0,
    overflow: 'hidden',
    paddingHorizontal: 5,
    shadowColor: '#00d4ff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
  },
  secondaryGlow: {
    backgroundColor: '#00d4ff',
    bottom: -18,
    left: 8,
    position: 'absolute',
    right: 8,
    top: -18,
  },
  secondaryGrid: {
    flexDirection: 'row',
    gap: 9,
    marginTop: 11,
  },
  secondaryIconFrame: {
    alignItems: 'center',
    height: 28,
    justifyContent: 'center',
    marginBottom: 5,
    width: 28,
  },
  secondaryText: {
    color: '#effcff',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0,
    textAlign: 'center',
  },
  settingsButton: {
    alignItems: 'center',
    backgroundColor: 'rgba(0, 212, 255, 0.2)',
    borderColor: 'rgba(117, 247, 255, 0.36)',
    borderRadius: 20,
    borderWidth: 1,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  shellHeader: {
    alignItems: 'center',
    alignSelf: 'stretch',
    borderColor: 'rgba(117, 247, 255, 0.18)',
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
    paddingVertical: 8,
  },
  shellHeaderText: {
    color: '#bdfbff',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0,
    marginLeft: 7,
  },
  topActions: {
    alignItems: 'flex-end',
    gap: 7,
  },
  topBar: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingTop: 8,
  },
  vignetteBottom: {
    backgroundColor: 'rgba(0, 7, 17, 0.26)',
    bottom: 0,
    height: '26%',
    left: 0,
    position: 'absolute',
    right: 0,
  },
  vignetteTop: {
    backgroundColor: 'rgba(0, 5, 16, 0.34)',
    height: '33%',
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  xpFill: {
    backgroundColor: '#75f7ff',
    borderRadius: 3,
    height: '100%',
    width: '68%',
  },
  xpTrack: {
    backgroundColor: 'rgba(0, 19, 45, 0.92)',
    borderColor: 'rgba(0, 212, 255, 0.46)',
    borderRadius: 4,
    borderWidth: 1,
    height: 8,
    marginTop: 5,
    overflow: 'hidden',
  },
});
