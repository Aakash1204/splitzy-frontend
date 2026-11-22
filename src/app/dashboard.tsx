import React, { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, {
  Circle,
  Defs,
  Line,
  Path,
  RadialGradient,
  Rect,
  Stop,
} from 'react-native-svg';

const COLORS = {
  surfaceContainerLowest: '#0e0e13',
  surfaceContainerLowest85: 'rgba(14, 14, 19, 0.9)',
  surfaceContainerLow: '#1b1b20',
  surfaceContainerLow60: 'rgba(27, 27, 32, 0.6)',
  surfaceContainerLow90: 'rgba(27, 27, 32, 0.94)',
  surfaceContainer: '#1f1f24',
  surfaceContainerHigh: '#2a292f',
  surfaceContainerHighest: '#35343a',
  surfaceBright: '#39383e',
  onSurface: '#e4e1e9',
  onSurfaceVariant: '#cac4d1',
  primary: '#dfd5ff',
  primaryContainer: '#c4b5fd',
  primaryContainer15: 'rgba(196, 181, 253, 0.15)',
  primaryContainer20: 'rgba(196, 181, 253, 0.2)',
  onPrimaryContainer: '#514483',
  secondary: '#62dcad',
  secondary10: 'rgba(98, 220, 173, 0.1)',
  secondary15: 'rgba(98, 220, 173, 0.15)',
  secondary20: 'rgba(98, 220, 173, 0.2)',
  tertiary: '#ffced3',
  tertiary10: 'rgba(255, 206, 211, 0.1)',
  tertiary15: 'rgba(255, 206, 211, 0.15)',
  surfaceTint: '#ccbeff',
  surfaceTint15: 'rgba(204, 190, 255, 0.15)',
};

// Replace `undefined` with loaded font family names if using @expo-google-fonts
const FONTS = {
  numericHero: undefined as string | undefined,
  headlineBold: undefined as string | undefined,
  headlineSemiBold: undefined as string | undefined,
  bodyRegular: undefined as string | undefined,
  labelSemiBold: undefined as string | undefined,
  labelBold: undefined as string | undefined,
};

export type DashboardTab = 'dashboard' | 'split-with' | 'analytics' | 'ai-query';

interface RoomItem {
  id: string;
  name: string;
  subtitle: string;
  badgeText: string;
  type: 'receive' | 'owe';
  icon: 'flight' | 'cottage' | 'restaurant';
}

const ACTIVE_ROOMS: RoomItem[] = [
  {
    id: 'goa-trip',
    name: 'Goa Trip',
    subtitle: '5 members • Last active 2h ago',
    badgeText: 'You get ₹1,800',
    type: 'receive',
    icon: 'flight',
  },
  {
    id: 'flat-402',
    name: 'Flat 402',
    subtitle: '3 flatmates • Rent & utilities',
    badgeText: 'You owe ₹1,250',
    type: 'owe',
    icon: 'cottage',
  },
  {
    id: 'weekend-dinners',
    name: 'Weekend Dinners',
    subtitle: '4 friends • 6 expenses',
    badgeText: 'You get ₹600',
    type: 'receive',
    icon: 'restaurant',
  },
];

interface DashboardScreenProps {
  activeTab?: DashboardTab;
  onTabPress?: (tab: DashboardTab) => void;
  onNotificationsPress?: () => void;
  onProfilePress?: () => void;
  onUploadStatement?: () => void;
  onAskAI?: () => void;
  onRoomPress?: (roomId: string) => void;
}

export default function DashboardScreen({
  activeTab: controlledTab,
  onTabPress,
  onNotificationsPress,
  onProfilePress,
  onUploadStatement,
  onAskAI,
  onRoomPress,
}: DashboardScreenProps) {
  const insets = useSafeAreaInsets();
  const [internalTab, setInternalTab] = useState<DashboardTab>('dashboard');
  const currentTab = controlledTab ?? internalTab;

  const headerHeight = 64 + insets.top;
  const navPaddingBottom = Math.max(insets.bottom, 12);
  const navHeight = 64 + navPaddingBottom;

  const handleTabSelect = (tab: DashboardTab) => {
    setInternalTab(tab);
    onTabPress?.(tab);
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />

      {/* Fixed Top Header */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <View style={styles.headerInner}>
          <View style={styles.brandRow}>
            <View style={styles.brandIconCircle}>
              <Svg
                width={20}
                height={20}
                viewBox="0 0 24 24"
                fill="none"
                stroke={COLORS.primary}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <Path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
                <Path d="M22 12A10 10 0 0 0 12 2v10z" />
              </Svg>
            </View>
            <View>
              <Text style={styles.brandTitle}>Splitzy</Text>
              <Text style={styles.greetingText}>Hi, Priya</Text>
            </View>
          </View>

          <View style={styles.headerActions}>
            <Pressable
              accessibilityLabel="Notifications"
              accessibilityRole="button"
              onPress={onNotificationsPress}
              style={({ pressed }) => [
                styles.notifButton,
                pressed && styles.pressedOpacity,
              ]}
            >
              <Svg
                width={22}
                height={22}
                viewBox="0 0 24 24"
                fill="none"
                stroke={COLORS.onSurfaceVariant}
                strokeWidth={1.9}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <Path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <Path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </Svg>
            </Pressable>

            <Pressable
              accessibilityLabel="Profile"
              accessibilityRole="button"
              onPress={onProfilePress}
              style={({ pressed }) => [
                styles.avatarCircle,
                pressed && styles.pressedScale95,
              ]}
            >
              <Text style={styles.avatarLetter}>P</Text>
            </Pressable>
          </View>
        </View>
      </View>

      {/* Main Scrollable Content */}
      <ScrollView
        style={styles.flex}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: headerHeight + 8,
            paddingBottom: navHeight + 24,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Primary Hero Card: Current Month Expense */}
        <View style={styles.heroWrapper}>
          <View style={styles.heroCard}>
            {/* Subtle Ambient Corner Glow */}
            <Svg
              width={180}
              height={180}
              viewBox="0 0 180 180"
              style={styles.heroGlow}
              pointerEvents="none"
            >
              <Defs>
                <RadialGradient id="heroCornerGlow" cx="50%" cy="50%" r="50%">
                  <Stop offset="0%" stopColor={COLORS.primary} stopOpacity="0.14" />
                  <Stop offset="100%" stopColor={COLORS.primary} stopOpacity="0" />
                </RadialGradient>
              </Defs>
              <Circle cx={90} cy={90} r={90} fill="url(#heroCornerGlow)" />
            </Svg>

            {/* Top Row Inside Hero */}
            <View style={styles.heroTopRow}>
              <Text style={styles.heroLabel}>Current Month Expense</Text>
              <View style={styles.monthPill}>
                <View style={styles.monthIconCircle}>
                  <Svg
                    width={10}
                    height={10}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke={COLORS.primary}
                    strokeWidth={2.2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <Rect x={3} y={4} width={18} height={18} rx={2} ry={2} />
                    <Line x1={16} y1={2} x2={16} y2={6} />
                    <Line x1={8} y1={2} x2={8} y2={6} />
                    <Line x1={3} y1={10} x2={21} y2={10} />
                  </Svg>
                </View>
                <Text style={styles.monthText}>November 2026</Text>
              </View>
            </View>

            {/* High-Impact Currency Display */}
            <View style={styles.currencyRow}>
              <Text style={styles.currencyMajor}>₹18,450</Text>
              <Text style={styles.currencyMinor}>.00</Text>
            </View>

            {/* Context Clarification Tag */}
            <View style={styles.contextTag}>
              <View style={styles.infoIconCircle}>
                <Svg
                  width={12}
                  height={12}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={COLORS.surfaceTint}
                  strokeWidth={2.2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <Circle cx={12} cy={12} r={10} />
                  <Line x1={12} y1={16} x2={12} y2={12} />
                  <Line x1={12} y1={8} x2={12.01} y2={8} />
                </Svg>
              </View>
              <Text style={styles.contextTagText} numberOfLines={1}>
                Includes only your personal split shares
              </Text>
            </View>
          </View>
        </View>

        {/* Side-by-Side Net Balance Summary Cards */}
        <View style={styles.balanceGrid}>
          {/* Left Card: You Owe */}
          <View style={styles.balanceCard}>
            <View style={styles.balanceHeader}>
              <View style={[styles.balanceIconCircle, styles.tertiaryTintBg]}>
                <Svg
                  width={20}
                  height={20}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={COLORS.tertiary}
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <Line x1={7} y1={17} x2={17} y2={7} />
                  <Path d="M7 7h10v10" />
                </Svg>
              </View>
              <View style={[styles.statusBadge, styles.tertiaryBadgeBg]}>
                <Text style={[styles.statusBadgeText, styles.tertiaryText]}>
                  PAYABLE
                </Text>
              </View>
            </View>

            <View style={styles.balanceBody}>
              <Text style={styles.balanceCaption}>YOU OWE</Text>
              <Text style={[styles.balanceAmount, styles.tertiaryText]}>
                ₹1,250
              </Text>
              <Text style={styles.balanceSubtext}>Across 2 rooms</Text>
            </View>
          </View>

          {/* Right Card: You Are Owed */}
          <View style={styles.balanceCard}>
            <View style={styles.balanceHeader}>
              <View style={[styles.balanceIconCircle, styles.secondaryTintBg]}>
                <Svg
                  width={20}
                  height={20}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={COLORS.secondary}
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <Line x1={17} y1={7} x2={7} y2={17} />
                  <Path d="M17 17H7V7" />
                </Svg>
              </View>
              <View style={[styles.statusBadge, styles.secondaryBadgeBg]}>
                <Text style={[styles.statusBadgeText, styles.secondaryText]}>
                  RECEIVABLE
                </Text>
              </View>
            </View>

            <View style={styles.balanceBody}>
              <Text style={styles.balanceCaption}>YOU ARE OWED</Text>
              <Text style={[styles.balanceAmount, styles.secondaryText]}>
                ₹2,400
              </Text>
              <Text style={styles.balanceSubtext}>Across 3 rooms</Text>
            </View>
          </View>
        </View>

        {/* Quick Action Row */}
        <View style={styles.quickActionRow}>
          <Pressable
            onPress={onUploadStatement}
            style={({ pressed }) => [
              styles.quickActionBtn,
              pressed && styles.quickActionBtnPressed,
            ]}
          >
            <View style={styles.uploadIconCircle}>
              <Svg
                width={16}
                height={16}
                viewBox="0 0 24 24"
                fill="none"
                stroke={COLORS.onSurfaceVariant}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <Path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <Path d="M14 2v6h6" />
                <Path d="M12 18v-6" />
                <Path d="M9 15l3-3 3 3" />
              </Svg>
            </View>
            <Text style={styles.quickActionText} numberOfLines={1}>
              Upload Statement
            </Text>
          </Pressable>

          <Pressable
            onPress={onAskAI}
            style={({ pressed }) => [
              styles.quickActionBtn,
              pressed && styles.quickActionBtnPressed,
            ]}
          >
            <View style={styles.aiIconCircle}>
              <SparkleIcon size={16} color={COLORS.primary} />
            </View>
            <Text
              style={[styles.quickActionText, styles.primaryText]}
              numberOfLines={1}
            >
              Ask Splitzy AI
            </Text>
          </Pressable>
        </View>

        {/* Compact Active Rooms Summary List Card */}
        <View style={styles.roomsCard}>
          <View style={styles.roomsHeader}>
            <Text style={styles.roomsTitle}>Active Rooms Summary</Text>
            <View style={styles.roomsCountPill}>
              <Text style={styles.roomsCountText}>3 Rooms</Text>
            </View>
          </View>

          <View style={styles.roomsList}>
            {ACTIVE_ROOMS.map((room) => (
              <Pressable
                key={room.id}
                onPress={() => onRoomPress?.(room.id)}
                style={({ pressed }) => [
                  styles.roomRow,
                  pressed && styles.roomRowPressed,
                ]}
              >
                <View style={styles.roomLeft}>
                  <RoomBadgeIcon type={room.icon} />
                  <View style={styles.roomMeta}>
                    <Text style={styles.roomName} numberOfLines={1}>
                      {room.name}
                    </Text>
                    <Text style={styles.roomSubtitle} numberOfLines={1}>
                      {room.subtitle}
                    </Text>
                  </View>
                </View>

                <View
                  style={[
                    styles.roomAmountPill,
                    room.type === 'receive'
                      ? styles.secondaryTintBg
                      : styles.tertiaryTintBg,
                  ]}
                >
                  <Text
                    style={[
                      styles.roomAmountText,
                      room.type === 'receive'
                        ? styles.secondaryText
                        : styles.tertiaryText,
                    ]}
                  >
                    {room.badgeText}
                  </Text>
                </View>
              </Pressable>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Fixed Bottom Navigation Bar */}
      <View style={[styles.bottomNav, { paddingBottom: navPaddingBottom }]}>
        <View style={styles.bottomNavInner}>
          <NavTabItem
            label="Dashboard"
            active={currentTab === 'dashboard'}
            onPress={() => handleTabSelect('dashboard')}
            icon={(color) => (
              <Svg
                width={21}
                height={21}
                viewBox="0 0 24 24"
                fill="none"
                stroke={color}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <Rect x={3} y={3} width={7} height={9} rx={1.5} />
                <Rect x={14} y={3} width={7} height={5} rx={1.5} />
                <Rect x={14} y={12} width={7} height={9} rx={1.5} />
                <Rect x={3} y={16} width={7} height={5} rx={1.5} />
              </Svg>
            )}
          />

          <NavTabItem
            label="Split With"
            active={currentTab === 'split-with'}
            onPress={() => handleTabSelect('split-with')}
            icon={(color) => (
              <Svg
                width={21}
                height={21}
                viewBox="0 0 24 24"
                fill="none"
                stroke={color}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <Path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <Circle cx={8.5} cy={7} r={4} />
                <Line x1={20} y1={8} x2={20} y2={14} />
                <Line x1={23} y1={11} x2={17} y2={11} />
              </Svg>
            )}
          />

          <NavTabItem
            label="Analytics"
            active={currentTab === 'analytics'}
            onPress={() => handleTabSelect('analytics')}
            icon={(color) => (
              <Svg
                width={21}
                height={21}
                viewBox="0 0 24 24"
                fill="none"
                stroke={color}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <Path d="M3 17l6-6 4 4 7-7" />
                <Path d="M14 8h6v6" />
              </Svg>
            )}
          />

          <NavTabItem
            label="AI Query"
            active={currentTab === 'ai-query'}
            onPress={() => handleTabSelect('ai-query')}
            icon={(color) => <SparkleIcon size={21} color={color} />}
          />
        </View>
      </View>
    </View>
  );
}

/* ---------- Helper Icon Components ---------- */

function SparkleIcon({ size, color }: { size: number; color: string }) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={1.9}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <Path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3z" />
      <Path d="M19 16l.7 1.8L21.5 18.5l-1.8.7L19 21l-.7-1.8-1.8-.7 1.8-.7L19 16z" />
    </Svg>
  );
}

function RoomBadgeIcon({ type }: { type: RoomItem['icon'] }) {
  if (type === 'flight') {
    return (
      <View style={[styles.roomIconCircle, styles.surfaceTintBg]}>
        <Svg
          width={20}
          height={20}
          viewBox="0 0 24 24"
          fill="none"
          stroke={COLORS.surfaceTint}
          strokeWidth={1.9}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <Path d="M17.8 19.2L16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" />
        </Svg>
      </View>
    );
  }

  if (type === 'cottage') {
    return (
      <View style={[styles.roomIconCircle, styles.secondary20Bg]}>
        <Svg
          width={20}
          height={20}
          viewBox="0 0 24 24"
          fill="none"
          stroke={COLORS.secondary}
          strokeWidth={1.9}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <Path d="M3 10.5L12 3l9 7.5" />
          <Path d="M5 9.5V20a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9.5" />
          <Path d="M9 21v-6h6v6" />
        </Svg>
      </View>
    );
  }

  return (
    <View style={[styles.roomIconCircle, styles.primary20Bg]}>
      <Svg
        width={20}
        height={20}
        viewBox="0 0 24 24"
        fill="none"
        stroke={COLORS.primary}
        strokeWidth={1.9}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <Path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
        <Path d="M7 2v20" />
        <Path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3zm0 0v7" />
      </Svg>
    </View>
  );
}

function NavTabItem({
  label,
  active,
  onPress,
  icon,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
  icon: (color: string) => React.ReactNode;
}) {
  const color = active ? COLORS.primaryContainer : COLORS.onSurfaceVariant;
  return (
    <Pressable
      accessibilityRole="tab"
      accessibilityState={{ selected: active }}
      onPress={onPress}
      style={({ pressed }) => [styles.navItem, pressed && styles.pressedOpacity]}
    >
      <View style={styles.navIconWrap}>{icon(color)}</View>
      <Text
        style={[
          styles.navLabel,
          { color },
          active && styles.navLabelActive,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

/* ---------- Styles ---------- */

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  root: {
    flex: 1,
    backgroundColor: COLORS.surfaceContainerLowest,
  },

  // Fixed Header
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 50,
    backgroundColor: COLORS.surfaceContainerLowest85,
  },
  headerInner: {
    height: 64,
    paddingHorizontal: 20, // px-margin
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8, // gap-space-sm
  },
  brandIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primaryContainer15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandTitle: {
    fontFamily: FONTS.headlineBold,
    fontSize: 18,
    lineHeight: 22,
    fontWeight: '700',
    color: COLORS.onSurface,
  },
  greetingText: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 12,
    lineHeight: 14,
    fontWeight: '400',
    color: COLORS.onSurfaceVariant,
    marginTop: 2,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  notifButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.primaryContainer,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.22,
    shadowRadius: 8,
    elevation: 4,
  },
  avatarLetter: {
    fontFamily: FONTS.headlineBold,
    fontSize: 18,
    lineHeight: 22,
    fontWeight: '700',
    color: COLORS.onPrimaryContainer,
  },

  // Main Scroll Content
  scrollContent: {
    paddingHorizontal: 20, // px-margin
    gap: 16, // gap-space-md
  },

  // Hero Card
  heroWrapper: {
    width: '100%',
  },
  heroCard: {
    width: '100%',
    backgroundColor: COLORS.surfaceContainer,
    borderRadius: 24, // rounded-3xl
    padding: 20, // p-5
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  heroGlow: {
    position: 'absolute',
    right: -56,
    bottom: -56,
  },
  heroTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  heroLabel: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
    color: COLORS.onSurfaceVariant,
    flexShrink: 1,
  },
  monthPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 9999,
    backgroundColor: COLORS.surfaceContainerHigh,
  },
  monthIconCircle: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: COLORS.primaryContainer20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  monthText: {
    fontFamily: FONTS.labelSemiBold,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.36,
    fontWeight: '600',
    color: COLORS.primary,
  },
  currencyRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
    marginTop: 16, // mt-4
  },
  currencyMajor: {
    fontFamily: FONTS.numericHero,
    fontSize: 36,
    lineHeight: 44,
    letterSpacing: -1.08,
    fontWeight: '700',
    color: COLORS.onSurface,
  },
  currencyMinor: {
    fontFamily: FONTS.labelSemiBold,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '600',
    color: COLORS.onSurfaceVariant,
  },
  contextTag: {
    marginTop: 14, // mt-3.5
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: COLORS.surfaceContainerLow60,
    borderRadius: 12, // rounded-xl
    paddingHorizontal: 12, // px-3
    paddingVertical: 8, // py-2
  },
  infoIconCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: COLORS.surfaceTint15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contextTagText: {
    flex: 1,
    fontFamily: FONTS.bodyRegular,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.12,
    color: COLORS.onSurfaceVariant,
  },

  // Net Balance Cards
  balanceGrid: {
    flexDirection: 'row',
    gap: 12, // gap-3
    width: '100%',
  },
  balanceCard: {
    flex: 1,
    backgroundColor: COLORS.surfaceContainer,
    borderRadius: 16, // rounded-2xl
    padding: 16, // p-4
    justifyContent: 'space-between',
  },
  balanceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 6,
  },
  balanceIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 9999,
  },
  statusBadgeText: {
    fontFamily: FONTS.labelBold,
    fontSize: 10,
    lineHeight: 12,
    letterSpacing: 0.6,
    fontWeight: '700',
  },
  balanceBody: {
    marginTop: 12, // mt-3
  },
  balanceCaption: {
    fontFamily: FONTS.labelSemiBold,
    fontSize: 10,
    lineHeight: 12,
    letterSpacing: 0.6,
    fontWeight: '600',
    color: COLORS.onSurfaceVariant,
  },
  balanceAmount: {
    fontFamily: FONTS.headlineBold,
    fontSize: 22,
    lineHeight: 28,
    letterSpacing: -0.22,
    fontWeight: '700',
    marginTop: 2,
  },
  balanceSubtext: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 12,
    lineHeight: 16,
    color: COLORS.onSurfaceVariant,
    marginTop: 4,
  },

  // Quick Actions
  quickActionRow: {
    flexDirection: 'row',
    gap: 12, // gap-3
    width: '100%',
  },
  quickActionBtn: {
    flex: 1,
    minHeight: 48,
    backgroundColor: COLORS.surfaceContainer,
    borderRadius: 12, // rounded-xl
    paddingVertical: 12,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  quickActionBtnPressed: {
    backgroundColor: COLORS.surfaceBright,
    transform: [{ scale: 0.97 }],
  },
  uploadIconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.surfaceContainerHigh,
    alignItems: 'center',
    justifyContent: 'center',
  },
  aiIconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.primaryContainer20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickActionText: {
    flexShrink: 1,
    fontFamily: FONTS.labelSemiBold,
    fontSize: 13,
    lineHeight: 18,
    letterSpacing: 0.2,
    fontWeight: '600',
    color: COLORS.onSurface,
  },

  // Active Rooms Card
  roomsCard: {
    width: '100%',
    backgroundColor: COLORS.surfaceContainer,
    borderRadius: 16, // rounded-2xl
    padding: 16, // p-4
  },
  roomsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 12, // pb-3
  },
  roomsTitle: {
    fontFamily: FONTS.headlineBold,
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '700',
    color: COLORS.onSurface,
  },
  roomsCountPill: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 9999,
    backgroundColor: COLORS.primaryContainer15,
  },
  roomsCountText: {
    fontFamily: FONTS.labelSemiBold,
    fontSize: 10,
    lineHeight: 12,
    letterSpacing: 0.5,
    fontWeight: '600',
    color: COLORS.primary,
  },
  roomsList: {
    gap: 10, // gap-2.5
    paddingTop: 4, // pt-1
  },
  roomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10, // p-2.5
    borderRadius: 12, // rounded-xl
    backgroundColor: COLORS.surfaceContainerLow,
    gap: 8,
  },
  roomRowPressed: {
    backgroundColor: COLORS.surfaceContainerHigh,
  },
  roomLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12, // gap-3
  },
  roomIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  roomMeta: {
    flex: 1,
  },
  roomName: {
    fontFamily: FONTS.labelSemiBold,
    fontSize: 14,
    lineHeight: 18,
    letterSpacing: 0.28,
    fontWeight: '600',
    color: COLORS.onSurface,
  },
  roomSubtitle: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 12,
    lineHeight: 16,
    color: COLORS.onSurfaceVariant,
    marginTop: 2,
  },
  roomAmountPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 9999,
  },
  roomAmountText: {
    fontFamily: FONTS.labelBold,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.36,
    fontWeight: '700',
  },

  // Fixed Bottom Navigation
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 50,
    backgroundColor: COLORS.surfaceContainerLow90,
  },
  bottomNavInner: {
    height: 64,
    paddingHorizontal: 8, // px-space-sm
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  navItem: {
    minWidth: 56,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
  navIconWrap: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navLabel: {
    fontFamily: FONTS.labelBold,
    fontSize: 10,
    lineHeight: 12,
    letterSpacing: 0.5,
    fontWeight: '600',
  },
  navLabelActive: {
    fontWeight: '700',
  },

  // Color & Utility Helpers
  primaryText: {
    color: COLORS.primary,
  },
  secondaryText: {
    color: COLORS.secondary,
  },
  tertiaryText: {
    color: COLORS.tertiary,
  },
  tertiaryTintBg: {
    backgroundColor: COLORS.tertiary15,
  },
  tertiaryBadgeBg: {
    backgroundColor: COLORS.tertiary10,
  },
  secondaryTintBg: {
    backgroundColor: COLORS.secondary15,
  },
  secondaryBadgeBg: {
    backgroundColor: COLORS.secondary10,
  },
  secondary20Bg: {
    backgroundColor: COLORS.secondary20,
  },
  surfaceTintBg: {
    backgroundColor: COLORS.surfaceTint15,
  },
  primary20Bg: {
    backgroundColor: COLORS.primaryContainer20,
  },
  pressedOpacity: {
    opacity: 0.72,
  },
  pressedScale95: {
    transform: [{ scale: 0.95 }],
  },
});