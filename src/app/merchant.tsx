import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
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
  Line,
  Path,
  Polygon,
  Polyline,
  Rect,
} from 'react-native-svg';

const COLORS = {
  surfaceContainerLowest: '#0e0e13',
  surfaceContainerLowest85: 'rgba(14, 14, 19, 0.9)',
  surfaceContainerLow: '#1b1b20',
  surfaceContainerLow90: 'rgba(27, 27, 32, 0.94)',
  surfaceContainer: '#1f1f24',
  surfaceContainerHigh: '#2a292f',
  onSurface: '#e4e1e9',
  onSurfaceVariant: '#cac4d1',
  primary: '#dfd5ff',
  primaryContainer: '#c4b5fd',
  primaryContainer15: 'rgba(196, 181, 253, 0.15)',
  primaryContainer20: 'rgba(196, 181, 253, 0.2)',
  onPrimaryContainer: '#514483',
  primaryFixed: '#e7deff',
  primaryFixed15: 'rgba(231, 222, 255, 0.15)',
  primaryFixed20: 'rgba(231, 222, 255, 0.2)',
  secondary: '#62dcad',
  secondary15: 'rgba(98, 220, 173, 0.15)',
  secondaryFixed20: 'rgba(128, 249, 200, 0.2)',
  tertiaryContainer: '#ffa6b1',
  tertiaryContainer15: 'rgba(255, 166, 177, 0.15)',
  tertiaryContainer20: 'rgba(255, 166, 177, 0.2)',
  tertiaryFixed: '#ffd9dc',
  tertiaryFixed15: 'rgba(255, 217, 220, 0.15)',
  tertiaryFixed20: 'rgba(255, 217, 220, 0.2)',
};

// Replace `undefined` with loaded font family names if using @expo-google-fonts
const FONTS = {
  headlineBold: undefined as string | undefined,
  headlineSemiBold: undefined as string | undefined,
  numericTable: undefined as string | undefined,
  bodyRegular: undefined as string | undefined,
  bodySemiBold: undefined as string | undefined,
  labelSemiBold: undefined as string | undefined,
  labelBold: undefined as string | undefined,
};

export type BottomNavTab = 'dashboard' | 'split-with' | 'analytics' | 'ai-query';
type AnalyticsSegment = 'overview' | 'merchants';
type MerchantSortMode = 'spend' | 'visits';

interface MerchantItem {
  id: string;
  name: string;
  visits: number;
  amount: number;
  amountFormatted: string;
  icon: 'restaurant' | 'shopping_bag' | 'coffee' | 'car' | 'ticket';
  rankBg: string;
  rankColor: string;
  iconBg: string;
  iconColor: string;
}

const MERCHANTS: MerchantItem[] = [
  {
    id: 'swiggy',
    name: 'Swiggy',
    visits: 18,
    amount: 7840,
    amountFormatted: '₹7,840',
    icon: 'restaurant',
    rankBg: COLORS.primaryContainer20,
    rankColor: COLORS.primaryContainer,
    iconBg: COLORS.tertiaryFixed15,
    iconColor: COLORS.tertiaryFixed,
  },
  {
    id: 'blinkit',
    name: 'Blinkit',
    visits: 22,
    amount: 5620,
    amountFormatted: '₹5,620',
    icon: 'shopping_bag',
    rankBg: COLORS.primaryFixed20,
    rankColor: COLORS.primaryFixed,
    iconBg: COLORS.primaryFixed15,
    iconColor: COLORS.primaryFixed,
  },
  {
    id: 'blue-tokai',
    name: 'Blue Tokai',
    visits: 14,
    amount: 3500,
    amountFormatted: '₹3,500',
    icon: 'coffee',
    rankBg: COLORS.tertiaryFixed20,
    rankColor: COLORS.tertiaryFixed,
    iconBg: COLORS.tertiaryFixed15,
    iconColor: COLORS.tertiaryFixed,
  },
  {
    id: 'uber',
    name: 'Uber',
    visits: 11,
    amount: 2950,
    amountFormatted: '₹2,950',
    icon: 'car',
    rankBg: COLORS.secondaryFixed20,
    rankColor: COLORS.secondary,
    iconBg: COLORS.secondary15,
    iconColor: COLORS.secondary,
  },
  {
    id: 'bookmyshow',
    name: 'BookMyShow',
    visits: 3,
    amount: 1800,
    amountFormatted: '₹1,800',
    icon: 'ticket',
    rankBg: COLORS.tertiaryContainer20,
    rankColor: COLORS.tertiaryContainer,
    iconBg: COLORS.tertiaryContainer15,
    iconColor: COLORS.tertiaryContainer,
  },
];

interface MerchantsAlertsScreenProps {
  activeNavTab?: BottomNavTab;
  onNavTabPress?: (tab: BottomNavTab) => void;
  onBack?: () => void;
  onInfoPress?: () => void;
  onUploadPress?: () => void;
  onSwitchToOverview?: () => void;
  onReviewAlert?: (alertId: string) => void;
  onMerchantPress?: (merchantId: string) => void;
}

export default function MerchantsAlertsScreen({
  activeNavTab: controlledNavTab,
  onNavTabPress,
  onBack,
  onInfoPress,
  onUploadPress,
  onSwitchToOverview,
  onReviewAlert,
  onMerchantPress,
}: MerchantsAlertsScreenProps) {
  const insets = useSafeAreaInsets();
  const [internalNavTab, setInternalNavTab] = useState<BottomNavTab>('analytics');
  const [segment, setSegment] = useState<AnalyticsSegment>('merchants');
  const [sortMode, setSortMode] = useState<MerchantSortMode>('spend');

  const pulseAnim = useRef(new Animated.Value(1)).current;

  const currentNavTab = controlledNavTab ?? internalNavTab;
  const headerHeight = 64 + insets.top;
  const navPaddingBottom = Math.max(insets.bottom, 12);
  const navHeight = 64 + navPaddingBottom;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 0.3,
          duration: 850,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 850,
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [pulseAnim]);

  const sortedMerchants = useMemo(() => {
    return [...MERCHANTS].sort((a, b) =>
      sortMode === 'spend' ? b.amount - a.amount : b.visits - a.visits
    );
  }, [sortMode]);

  const handleNavSelect = (tab: BottomNavTab) => {
    setInternalNavTab(tab);
    onNavTabPress?.(tab);
  };

  const handleSegmentPress = (next: AnalyticsSegment) => {
    setSegment(next);
    if (next === 'overview') {
      onSwitchToOverview?.();
    }
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />

      {/* Fixed Top Header */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <View style={styles.headerInner}>
          <View style={styles.headerLeft}>
            <Pressable
              accessibilityLabel="Go back"
              accessibilityRole="button"
              onPress={onBack}
              style={({ pressed }) => [
                styles.headerIconBtn,
                styles.backBtnOffset,
                pressed && styles.pressedOpacity,
              ]}
            >
              <Svg
                width={22}
                height={22}
                viewBox="0 0 24 24"
                fill="none"
                stroke={COLORS.onSurface}
                strokeWidth={2.2}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <Line x1={19} y1={12} x2={5} y2={12} />
                <Polyline points="12 19 5 12 12 5" />
              </Svg>
            </Pressable>
            <Text style={styles.headerTitle}>Bank Statement</Text>
          </View>

          <Pressable
            accessibilityLabel="Statement Information"
            accessibilityRole="button"
            onPress={onInfoPress}
            style={({ pressed }) => [
              styles.headerIconBtn,
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
              <Circle cx={12} cy={12} r={10} />
              <Line x1={12} y1={16} x2={12} y2={12} />
              <Line x1={12} y1={8} x2={12.01} y2={8} />
            </Svg>
          </Pressable>
        </View>
      </View>

      {/* Main Scrollable Content */}
      <ScrollView
        style={styles.flex}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: headerHeight + 8,
            paddingBottom: navHeight + 32,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Top App Header Contextual Block */}
        <View style={styles.pageHeaderRow}>
          <View>
            <Text style={styles.kickerLabel}>SPLITZY INSIGHTS</Text>
            <Text style={styles.pageTitle}>Analytics</Text>
          </View>

          <Pressable
            accessibilityLabel="Upload Bank Statement"
            accessibilityRole="button"
            onPress={onUploadPress}
            style={({ pressed }) => [
              styles.uploadCircleBtn,
              pressed && styles.pressedScale95,
            ]}
          >
            <Svg
              width={20}
              height={20}
              viewBox="0 0 24 24"
              fill="none"
              stroke={COLORS.onSurface}
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <Path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <Polyline points="14 2 14 8 20 8" />
              <Line x1={12} y1={18} x2={12} y2={12} />
              <Polyline points="9 15 12 12 15 15" />
            </Svg>
          </Pressable>
        </View>

        {/* Segmented Switcher */}
        <View style={styles.segmentTrack}>
          <Pressable
            accessibilityRole="tab"
            accessibilityState={{ selected: segment === 'overview' }}
            onPress={() => handleSegmentPress('overview')}
            style={[
              styles.segmentBtn,
              segment === 'overview' && styles.segmentBtnActive,
            ]}
          >
            <Text
              style={[
                styles.segmentBtnText,
                segment === 'overview' && styles.segmentBtnTextActive,
              ]}
            >
              Overview
            </Text>
          </Pressable>

          <Pressable
            accessibilityRole="tab"
            accessibilityState={{ selected: segment === 'merchants' }}
            onPress={() => handleSegmentPress('merchants')}
            style={[
              styles.segmentBtn,
              segment === 'merchants' && styles.segmentBtnActive,
            ]}
          >
            <Text
              style={[
                styles.segmentBtnText,
                segment === 'merchants' && styles.segmentBtnTextActive,
              ]}
            >
              Merchants &amp; Alerts
            </Text>
          </Pressable>
        </View>

        {/* Section 1: Smart Alerts */}
        <View style={styles.alertsSection}>
          <View style={styles.alertsHeaderRow}>
            <View style={styles.alertsTitleGroup}>
              <View style={styles.alertsBellBadge}>
                <Svg
                  width={18}
                  height={18}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={COLORS.tertiaryFixed}
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <Path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                  <Path d="M13.73 21a2 2 0 0 1-3.46 0" />
                  <Path d="M2 8c0-2.2.7-4.3 2-6" />
                  <Path d="M22 8a10 10 0 0 0-2-6" />
                </Svg>
              </View>
              <Text style={styles.sectionTitle}>Smart Alerts</Text>
            </View>

            <View style={styles.unresolvedPill}>
              <Animated.View
                style={[styles.unresolvedDot, { opacity: pulseAnim }]}
              />
              <Text style={styles.unresolvedText}>3 UNRESOLVED</Text>
            </View>
          </View>

          {/* Alert Card 1: Double Charge */}
          <View style={styles.alertCard}>
            <View
              style={[
                styles.alertAccentBar,
                { backgroundColor: COLORS.tertiaryContainer },
              ]}
            />
            <View style={styles.alertContentRow}>
              <View style={[styles.alertIconCircle, styles.tertiaryContainer15Bg]}>
                <Svg
                  width={19}
                  height={19}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={COLORS.tertiaryContainer}
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <Rect x={9} y={9} width={13} height={13} rx={2} ry={2} />
                  <Path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </Svg>
              </View>
              <View style={styles.flex}>
                <Text style={styles.alertTitle}>Possible Double Charge</Text>
                <Text style={styles.alertDescription}>
                  Swiggy • <Text style={styles.alertStrong}>₹420</Text> charged
                  twice within 10 mins on Oct 14
                </Text>
              </View>
            </View>

            <View style={styles.alertFooterRight}>
              <Pressable
                onPress={() => onReviewAlert?.('double-charge')}
                style={({ pressed }) => [
                  styles.alertActionPill,
                  pressed && styles.alertActionPillPressed,
                ]}
              >
                <Text style={styles.alertActionText}>Review</Text>
              </Pressable>
            </View>
          </View>

          {/* Alert Card 2: Category Spike */}
          <View style={styles.alertCard}>
            <View
              style={[
                styles.alertAccentBar,
                { backgroundColor: COLORS.tertiaryFixed },
              ]}
            />
            <View style={styles.alertContentRow}>
              <View style={[styles.alertIconCircle, styles.tertiaryFixed15Bg]}>
                <Svg
                  width={19}
                  height={19}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={COLORS.tertiaryFixed}
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <Polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                  <Polyline points="17 6 23 6 23 12" />
                </Svg>
              </View>
              <View style={styles.flex}>
                <Text style={styles.alertTitle}>Category Spike Detected</Text>
                <Text style={styles.alertDescription}>
                  Food Delivery is up{' '}
                  <Text style={styles.alertSpikePercent}>48%</Text> vs. your
                  3-month average
                </Text>
              </View>
            </View>

            <View style={styles.alertFooterRight}>
              <View style={styles.trendingBadge}>
                <Svg
                  width={13}
                  height={13}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={COLORS.tertiaryFixed}
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <Path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z" />
                  <Polyline points="3 20 8 15 12 18 20 10" />
                </Svg>
                <Text style={styles.trendingBadgeText}>TRENDING</Text>
              </View>
            </View>
          </View>

          {/* Alert Card 3: Unusually Large Transaction */}
          <View style={styles.alertCard}>
            <View
              style={[
                styles.alertAccentBar,
                { backgroundColor: COLORS.tertiaryContainer },
              ]}
            />
            <View style={styles.alertContentRow}>
              <View style={[styles.alertIconCircle, styles.tertiaryContainer15Bg]}>
                <Svg
                  width={19}
                  height={19}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={COLORS.tertiaryContainer}
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <Polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                </Svg>
              </View>
              <View style={styles.flex}>
                <Text style={styles.alertTitle}>
                  Unusually Large Transaction
                </Text>
                <Text style={styles.alertDescription}>
                  <Text style={styles.alertStrongNumeric}>₹14,500</Text> at
                  Electronics Store (3.1× your usual spend)
                </Text>
              </View>
            </View>

            <View style={styles.alertFooterRight}>
              <Pressable
                onPress={() => onReviewAlert?.('large-txn')}
                style={({ pressed }) => [
                  styles.alertActionPill,
                  pressed && styles.alertActionPillPressed,
                ]}
              >
                <Text style={styles.alertActionText}>Verify</Text>
              </Pressable>
            </View>
          </View>
        </View>

        {/* Section 2: Top 5 Merchants Leaderboard */}
        <View style={styles.leaderboardCard}>
          <View style={styles.leaderboardHeader}>
            <View style={styles.leaderboardTitleRow}>
              <View style={styles.greenDot} />
              <Text style={styles.leaderboardTitle}>Top 5 Merchants</Text>
            </View>

            <View style={styles.sortToggleTrack}>
              <Pressable
                onPress={() => setSortMode('spend')}
                style={[
                  styles.sortPill,
                  sortMode === 'spend' && styles.sortPillActive,
                ]}
              >
                <Text
                  style={[
                    styles.sortPillText,
                    sortMode === 'spend' && styles.sortPillTextActive,
                  ]}
                >
                  By Spend
                </Text>
              </Pressable>

              <Pressable
                onPress={() => setSortMode('visits')}
                style={[
                  styles.sortPill,
                  sortMode === 'visits' && styles.sortPillActive,
                ]}
              >
                <Text
                  style={[
                    styles.sortPillText,
                    sortMode === 'visits' && styles.sortPillTextActive,
                  ]}
                >
                  By Visits
                </Text>
              </Pressable>
            </View>
          </View>

          <View style={styles.merchantList}>
            {sortedMerchants.map((merchant, index) => (
              <Pressable
                key={merchant.id}
                onPress={() => onMerchantPress?.(merchant.id)}
                style={({ pressed }) => [
                  styles.merchantRow,
                  pressed && styles.merchantRowPressed,
                ]}
              >
                <View style={styles.merchantLeft}>
                  <View
                    style={[
                      styles.rankPill,
                      { backgroundColor: merchant.rankBg },
                    ]}
                  >
                    <Text
                      style={[styles.rankText, { color: merchant.rankColor }]}
                    >
                      #{index + 1}
                    </Text>
                  </View>

                  <View
                    style={[
                      styles.merchantIconCircle,
                      { backgroundColor: merchant.iconBg },
                    ]}
                  >
                    <MerchantIcon
                      type={merchant.icon}
                      color={merchant.iconColor}
                    />
                  </View>

                  <View style={styles.flex}>
                    <Text style={styles.merchantName} numberOfLines={1}>
                      {merchant.name}
                    </Text>
                    <Text style={styles.merchantVisits}>
                      {merchant.visits} visits
                    </Text>
                  </View>
                </View>

                <Text style={styles.merchantAmount}>
                  {merchant.amountFormatted}
                </Text>
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
            active={currentNavTab === 'dashboard'}
            onPress={() => handleNavSelect('dashboard')}
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
            active={currentNavTab === 'split-with'}
            onPress={() => handleNavSelect('split-with')}
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
            active={currentNavTab === 'analytics'}
            onPress={() => handleNavSelect('analytics')}
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
            active={currentNavTab === 'ai-query'}
            onPress={() => handleNavSelect('ai-query')}
            icon={(color) => (
              <Svg
                width={21}
                height={21}
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
            )}
          />
        </View>
      </View>
    </View>
  );
}

/* ---------- Helper Icon Components ---------- */

function MerchantIcon({
  type,
  color,
}: {
  type: MerchantItem['icon'];
  color: string;
}) {
  switch (type) {
    case 'restaurant':
      return (
        <Svg
          width={20}
          height={20}
          viewBox="0 0 24 24"
          fill="none"
          stroke={color}
          strokeWidth={1.9}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <Path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
          <Path d="M7 2v20" />
          <Path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3zm0 0v7" />
        </Svg>
      );
    case 'shopping_bag':
      return (
        <Svg
          width={20}
          height={20}
          viewBox="0 0 24 24"
          fill="none"
          stroke={color}
          strokeWidth={1.9}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <Path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
          <Line x1={3} y1={6} x2={21} y2={6} />
          <Path d="M16 10a4 4 0 0 1-8 0" />
        </Svg>
      );
    case 'coffee':
      return (
        <Svg
          width={20}
          height={20}
          viewBox="0 0 24 24"
          fill="none"
          stroke={color}
          strokeWidth={1.9}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <Path d="M17 8h1a4 4 0 1 1 0 8h-1" />
          <Path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z" />
          <Line x1={6} y1={2} x2={6} y2={4} />
          <Line x1={10} y1={2} x2={10} y2={4} />
          <Line x1={14} y1={2} x2={14} y2={4} />
        </Svg>
      );
    case 'car':
      return (
        <Svg
          width={20}
          height={20}
          viewBox="0 0 24 24"
          fill="none"
          stroke={color}
          strokeWidth={1.9}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <Path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9L18 10l-2-4H8L6 10l-2.5 1.1C2.7 11.3 2 12.1 2 13v3c0 .6.4 1 1 1h2" />
          <Circle cx={7} cy={17} r={2} />
          <Path d="M9 17h6" />
          <Circle cx={17} cy={17} r={2} />
        </Svg>
      );
    case 'ticket':
    default:
      return (
        <Svg
          width={20}
          height={20}
          viewBox="0 0 24 24"
          fill="none"
          stroke={color}
          strokeWidth={1.9}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <Path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
          <Path d="M13 5v2M13 17v2M13 11v2" />
        </Svg>
      );
  }
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
      <View style={[styles.navIconWrap, active && styles.navIconWrapActive]}>
        {icon(color)}
      </View>
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
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerIconBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backBtnOffset: {
    marginLeft: -8,
  },
  headerTitle: {
    fontFamily: FONTS.headlineBold,
    fontSize: 18,
    lineHeight: 22,
    fontWeight: '700',
    color: COLORS.onSurface,
  },

  // Main Scroll Content
  scrollContent: {
    paddingHorizontal: 20, // px-margin
  },

  // Page Header Contextual Block
  pageHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 16,
  },
  kickerLabel: {
    fontFamily: FONTS.labelBold,
    fontSize: 10,
    lineHeight: 12,
    letterSpacing: 0.8,
    fontWeight: '700',
    color: COLORS.primaryContainer,
  },
  pageTitle: {
    fontFamily: FONTS.headlineBold,
    fontSize: 28,
    lineHeight: 34,
    letterSpacing: -0.56,
    fontWeight: '700',
    color: COLORS.onSurface,
  },
  uploadCircleBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.surfaceContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Segmented Switcher
  segmentTrack: {
    width: '100%',
    backgroundColor: COLORS.surfaceContainerLow,
    padding: 4,
    borderRadius: 9999,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 24, // mb-6
  },
  segmentBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 9999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentBtnActive: {
    backgroundColor: COLORS.primaryContainer,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
  segmentBtnText: {
    fontFamily: FONTS.labelSemiBold,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.36,
    fontWeight: '600',
    color: COLORS.onSurfaceVariant,
  },
  segmentBtnTextActive: {
    fontFamily: FONTS.labelBold,
    fontWeight: '700',
    color: COLORS.onPrimaryContainer,
  },

  // Smart Alerts Section
  alertsSection: {
    marginBottom: 28, // mb-7
    gap: 12, // gap-3
  },
  alertsHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  alertsTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  alertsBellBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.tertiaryFixed15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    fontFamily: FONTS.headlineSemiBold,
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '600',
    color: COLORS.onSurface,
  },
  unresolvedPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 9999,
    backgroundColor: COLORS.surfaceContainerHigh,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  unresolvedDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.tertiaryContainer,
  },
  unresolvedText: {
    fontFamily: FONTS.labelBold,
    fontSize: 10,
    lineHeight: 12,
    letterSpacing: 0.6,
    fontWeight: '700',
    color: COLORS.onSurfaceVariant,
  },

  // Alert Cards
  alertCard: {
    position: 'relative',
    backgroundColor: COLORS.surfaceContainer,
    borderRadius: 16, // rounded-2xl
    padding: 16, // p-4
    gap: 12,
    overflow: 'hidden',
  },
  alertAccentBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 6, // w-1.5
  },
  alertContentRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    paddingLeft: 4,
  },
  alertIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  alertTitle: {
    fontFamily: FONTS.labelSemiBold,
    fontSize: 14,
    lineHeight: 18,
    letterSpacing: 0.2,
    fontWeight: '600',
    color: COLORS.onSurface,
  },
  alertDescription: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 12,
    lineHeight: 17,
    color: COLORS.onSurfaceVariant,
    marginTop: 2,
  },
  alertStrong: {
    fontFamily: FONTS.bodySemiBold,
    fontWeight: '600',
    color: COLORS.onSurface,
  },
  alertStrongNumeric: {
    fontFamily: FONTS.numericTable,
    fontWeight: '700',
    color: COLORS.onSurface,
  },
  alertSpikePercent: {
    fontFamily: FONTS.numericTable,
    fontWeight: '700',
    color: COLORS.tertiaryFixed,
  },
  alertFooterRight: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingTop: 2,
  },
  alertActionPill: {
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 9999,
    backgroundColor: COLORS.surfaceContainerHigh,
  },
  alertActionPillPressed: {
    backgroundColor: COLORS.tertiaryContainer20,
    transform: [{ scale: 0.95 }],
  },
  alertActionText: {
    fontFamily: FONTS.labelSemiBold,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.36,
    fontWeight: '600',
    color: COLORS.tertiaryContainer,
  },
  trendingBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 9999,
    backgroundColor: COLORS.surfaceContainerHigh,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  trendingBadgeText: {
    fontFamily: FONTS.labelBold,
    fontSize: 10,
    lineHeight: 12,
    letterSpacing: 0.6,
    fontWeight: '700',
    color: COLORS.tertiaryFixed,
  },

  // Top 5 Merchants Leaderboard
  leaderboardCard: {
    backgroundColor: COLORS.surfaceContainer,
    borderRadius: 24, // rounded-3xl
    padding: 20, // p-5
  },
  leaderboardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 20, // mb-5
  },
  leaderboardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexShrink: 1,
  },
  greenDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.secondary,
  },
  leaderboardTitle: {
    fontFamily: FONTS.headlineBold,
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '700',
    color: COLORS.onSurface,
  },
  sortToggleTrack: {
    backgroundColor: COLORS.surfaceContainerLow,
    padding: 2,
    borderRadius: 9999,
    flexDirection: 'row',
    alignItems: 'center',
  },
  sortPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 9999,
  },
  sortPillActive: {
    backgroundColor: COLORS.primaryContainer,
  },
  sortPillText: {
    fontFamily: FONTS.labelSemiBold,
    fontSize: 10,
    lineHeight: 12,
    letterSpacing: 0.4,
    fontWeight: '600',
    color: COLORS.onSurfaceVariant,
  },
  sortPillTextActive: {
    fontWeight: '700',
    color: COLORS.onPrimaryContainer,
  },

  // Merchant Rows
  merchantList: {
    gap: 12, // gap-3
  },
  merchantRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 16, // rounded-2xl
    backgroundColor: COLORS.surfaceContainerLow,
    gap: 10,
  },
  merchantRowPressed: {
    backgroundColor: COLORS.surfaceContainerHigh,
  },
  merchantLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  rankPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 9999,
  },
  rankText: {
    fontFamily: FONTS.numericTable,
    fontSize: 10,
    lineHeight: 12,
    fontWeight: '700',
  },
  merchantIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  merchantName: {
    fontFamily: FONTS.bodySemiBold,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
    color: COLORS.onSurface,
  },
  merchantVisits: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 12,
    lineHeight: 16,
    color: COLORS.onSurfaceVariant,
  },
  merchantAmount: {
    fontFamily: FONTS.numericTable,
    fontSize: 16,
    lineHeight: 20,
    fontWeight: '700',
    color: COLORS.onSurface,
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
    paddingHorizontal: 8,
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
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navIconWrapActive: {
    backgroundColor: COLORS.primaryContainer15,
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

  // Color & Press Helpers
  tertiaryContainer15Bg: {
    backgroundColor: COLORS.tertiaryContainer15,
  },
  tertiaryFixed15Bg: {
    backgroundColor: COLORS.tertiaryFixed15,
  },
  pressedOpacity: {
    opacity: 0.72,
  },
  pressedScale95: {
    transform: [{ scale: 0.95 }],
  },
});