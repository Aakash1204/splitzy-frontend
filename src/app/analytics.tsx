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
  G,
  Line,
  LinearGradient,
  Path,
  Polyline,
  Rect,
  Stop,
} from 'react-native-svg';

const COLORS = {
  surfaceContainerLowest: '#0e0e13',
  surfaceContainerLowest85: 'rgba(14, 14, 19, 0.9)',
  surfaceContainerLow: '#1b1b20',
  surfaceContainerLow90: 'rgba(27, 27, 32, 0.94)',
  surfaceContainer: '#1f1f24',
  surfaceContainerHigh: '#2a292f',
  surfaceContainerHighest: '#35343a',
  surfaceVariant: '#35343a',
  surface: '#131318',
  onSurface: '#e4e1e9',
  onSurfaceVariant: '#cac4d1',
  primary: '#dfd5ff',
  primaryContainer: '#c4b5fd',
  primaryContainer15: 'rgba(196, 181, 253, 0.15)',
  onPrimaryFixed: '#1e0e4e',
  secondary: '#62dcad',
  secondary10: 'rgba(98, 220, 173, 0.1)',
  secondary15: 'rgba(98, 220, 173, 0.15)',
  secondary20: 'rgba(98, 220, 173, 0.2)',
  secondaryContainer15: 'rgba(24, 164, 121, 0.15)',
  tertiaryContainer: '#ffa6b1',
  tertiaryContainer15: 'rgba(255, 166, 177, 0.15)',
  tertiaryFixedDim: '#ffb2bb',
  skyBlue: '#93c5fd',
  mint: '#6ee7b7',
  butterYellow: '#fde68a',
};

// Replace `undefined` with loaded font family names if using @expo-google-fonts
const FONTS = {
  displayBold: undefined as string | undefined,
  headlineBold: undefined as string | undefined,
  headlineSemiBold: undefined as string | undefined,
  numericTable: undefined as string | undefined,
  bodyRegular: undefined as string | undefined,
  labelSemiBold: undefined as string | undefined,
  labelBold: undefined as string | undefined,
};

export type BottomNavTab = 'dashboard' | 'split-with' | 'analytics' | 'ai-query';
type AnalyticsSegment = 'overview' | 'merchants';
type TrendRange = '3M' | '6M' | '12M';

const CATEGORY_LEGEND = [
  { id: 'food', label: 'Food', percent: '32%', color: COLORS.primaryContainer },
  { id: 'rent', label: 'Rent/Bills', percent: '28%', color: COLORS.skyBlue },
  { id: 'travel', label: 'Travel', percent: '18%', color: COLORS.mint },
  { id: 'shopping', label: 'Shopping', percent: '14%', color: COLORS.tertiaryContainer },
];

const TREND_MONTHS = ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'];

const TREND_POINTS = [
  { x: 20, y: 68 },
  { x: 76, y: 38 },
  { x: 132, y: 60 },
  { x: 188, y: 32 },
  { x: 244, y: 64 },
];

const CURVE_PATH =
  'M 20 68 C 45 68, 55 38, 76 38 C 98 38, 110 60, 132 60 C 154 60, 168 32, 188 32 C 210 32, 222 64, 244 64 C 268 64, 280 48, 300 48';

const AREA_PATH = `${CURVE_PATH} L 300 120 L 20 120 Z`;

interface AnalyticsScreenProps {
  activeNavTab?: BottomNavTab;
  onNavTabPress?: (tab: BottomNavTab) => void;
  onBack?: () => void;
  onInfoPress?: () => void;
  onUploadPress?: () => void;
  onCategoryDetailsPress?: () => void;
}

export default function AnalyticsScreen({
  activeNavTab: controlledNavTab,
  onNavTabPress,
  onBack,
  onInfoPress,
  onUploadPress,
  onCategoryDetailsPress,
}: AnalyticsScreenProps) {
  const insets = useSafeAreaInsets();
  const [internalNavTab, setInternalNavTab] = useState<BottomNavTab>('analytics');
  const [segment, setSegment] = useState<AnalyticsSegment>('overview');
  const [trendRange, setTrendRange] = useState<TrendRange>('6M');

  const currentNavTab = controlledNavTab ?? internalNavTab;
  const headerHeight = 64 + insets.top;
  const navPaddingBottom = Math.max(insets.bottom, 12);
  const navHeight = 64 + navPaddingBottom;

  const handleNavSelect = (tab: BottomNavTab) => {
    setInternalNavTab(tab);
    onNavTabPress?.(tab);
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
                pressed && styles.pressedScale97,
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
              pressed && styles.pressedScale97,
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
            paddingTop: headerHeight + 4,
            paddingBottom: navHeight + 28,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Page Header Bar */}
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
              styles.uploadActionBtn,
              pressed && styles.pressedScale95,
            ]}
          >
            <Svg
              width={22}
              height={22}
              viewBox="0 0 24 24"
              fill="none"
              stroke={COLORS.primaryContainer}
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
            onPress={() => setSegment('overview')}
            style={({ pressed }) => [
              styles.segmentBtn,
              segment === 'overview' && styles.segmentBtnActive,
              pressed && styles.pressedScale97,
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
            onPress={() => setSegment('merchants')}
            style={({ pressed }) => [
              styles.segmentBtn,
              segment === 'merchants' && styles.segmentBtnActive,
              pressed && styles.pressedScale97,
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

        {/* Card 1: Monthly Cash Flow & Net Savings Rate */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardHeaderLeft}>
              <View style={[styles.cardIconCircle, styles.secondary15Bg]}>
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
                  <Polyline points="17 2 21 6 17 10" />
                  <Line x1={3} y1={6} x2={21} y2={6} />
                  <Polyline points="7 22 3 18 7 14" />
                  <Line x1={21} y1={18} x2={3} y2={18} />
                </Svg>
              </View>
              <View>
                <Text style={styles.cardTitle}>Monthly Cash Flow</Text>
                <Text style={styles.cardSubtitle}>October 2024</Text>
              </View>
            </View>

            <View style={styles.surplusBadge}>
              <Text style={styles.surplusBadgeText}>Surplus</Text>
            </View>
          </View>

          {/* Dual Horizontal Bars */}
          <View style={styles.barsGroup}>
            {/* Income */}
            <View style={styles.barItem}>
              <View style={styles.barLabelRow}>
                <Text style={styles.barLabel}>Income</Text>
                <Text style={styles.barIncomeValue}>₹65,000</Text>
              </View>
              <View style={styles.barTrack}>
                <View style={[styles.barFill, styles.barFillIncome]} />
              </View>
            </View>

            {/* Expenses */}
            <View style={styles.barItem}>
              <View style={styles.barLabelRow}>
                <Text style={styles.barLabel}>Expenses</Text>
                <Text style={styles.barExpenseValue}>₹38,400</Text>
              </View>
              <View style={styles.barTrack}>
                <View style={[styles.barFill, styles.barFillExpense]} />
              </View>
            </View>
          </View>

          {/* Savings Rate Highlight Badge */}
          <View style={styles.savingsBanner}>
            <View style={styles.savingsLeft}>
              <View style={styles.savingsIconBox}>
                <Svg
                  width={18}
                  height={18}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={COLORS.secondary}
                  strokeWidth={2.2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <Polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                  <Polyline points="17 6 23 6 23 12" />
                </Svg>
              </View>
              <View style={styles.flex}>
                <View style={styles.savingsHeadlineRow}>
                  <Text style={styles.savingsLabel}>NET SAVINGS RATE</Text>
                  <Text style={styles.savingsPercent}>40.9%</Text>
                </View>
                <Text style={styles.savingsSubtext}>
                  ₹26,600 saved this month
                </Text>
              </View>
            </View>

            <Svg
              width={18}
              height={18}
              viewBox="0 0 24 24"
              fill="none"
              stroke={COLORS.secondary}
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <Path d="M12 2l2.4 2.4 3.4-.5.5 3.4L20.7 9.7 19.3 12l1.4 2.3-2.4 2.4-.5 3.4-3.4-.5L12 22l-2.4-2.4-3.4.5-.5-3.4-2.4-2.4L4.7 12 3.3 9.7l2.4-2.4.5-3.4 3.4.5L12 2z" />
              <Polyline points="9 12 11 14 15 10" />
            </Svg>
          </View>
        </View>

        {/* Card 2: Category Breakdown Donut */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardHeaderLeft}>
              <View style={[styles.cardIconCircle, styles.primary15Bg]}>
                <Svg
                  width={20}
                  height={20}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={COLORS.primaryContainer}
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <Circle cx={12} cy={12} r={9} />
                  <Circle cx={12} cy={12} r={4} />
                  <Line x1={12} y1={3} x2={12} y2={8} />
                  <Line x1={15.5} y1={14} x2={19.8} y2={16.5} />
                </Svg>
              </View>
              <View>
                <Text style={styles.cardTitle}>Category Breakdown</Text>
                <Text style={styles.cardSubtitle}>5 Active Buckets</Text>
              </View>
            </View>

            <Pressable
              accessibilityLabel="Details"
              accessibilityRole="button"
              onPress={onCategoryDetailsPress}
              style={({ pressed }) => [
                styles.chevronBtn,
                pressed && styles.pressedScale97,
              ]}
            >
              <Svg
                width={20}
                height={20}
                viewBox="0 0 24 24"
                fill="none"
                stroke={COLORS.onSurfaceVariant}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <Polyline points="9 18 15 12 9 6" />
              </Svg>
            </Pressable>
          </View>

          {/* Clean SVG Donut Chart */}
          <View style={styles.donutWrapper}>
            <Svg width={208} height={208} viewBox="0 0 200 200">
              <G rotation={-90} origin="100, 100">
                {/* Background Track */}
                <Circle
                  cx={100}
                  cy={100}
                  r={70}
                  fill="none"
                  stroke={COLORS.surfaceContainerHigh}
                  strokeWidth={20}
                />
                {/* Food 32% */}
                <Circle
                  cx={100}
                  cy={100}
                  r={70}
                  fill="none"
                  stroke={COLORS.primaryContainer}
                  strokeWidth={20}
                  strokeLinecap="round"
                  strokeDasharray={[140.74, 299.08]}
                  strokeDashoffset={0}
                />
                {/* Rent/Bills 28% */}
                <Circle
                  cx={100}
                  cy={100}
                  r={70}
                  fill="none"
                  stroke={COLORS.skyBlue}
                  strokeWidth={20}
                  strokeLinecap="round"
                  strokeDasharray={[123.15, 316.67]}
                  strokeDashoffset={-144.74}
                />
                {/* Travel 18% */}
                <Circle
                  cx={100}
                  cy={100}
                  r={70}
                  fill="none"
                  stroke={COLORS.mint}
                  strokeWidth={20}
                  strokeLinecap="round"
                  strokeDasharray={[79.16, 360.66]}
                  strokeDashoffset={-271.89}
                />
                {/* Shopping 14% */}
                <Circle
                  cx={100}
                  cy={100}
                  r={70}
                  fill="none"
                  stroke={COLORS.tertiaryContainer}
                  strokeWidth={20}
                  strokeLinecap="round"
                  strokeDasharray={[61.57, 378.25]}
                  strokeDashoffset={-355.05}
                />
                {/* Other 8% */}
                <Circle
                  cx={100}
                  cy={100}
                  r={70}
                  fill="none"
                  stroke={COLORS.butterYellow}
                  strokeWidth={20}
                  strokeLinecap="round"
                  strokeDasharray={[35.18, 404.64]}
                  strokeDashoffset={-420.62}
                />
              </G>
            </Svg>

            {/* Center Text Inside Donut */}
            <View style={styles.donutCenter} pointerEvents="none">
              <Text style={styles.donutCenterKicker}>TOTAL</Text>
              <Text style={styles.donutCenterAmount}>₹38,400</Text>
              <Text style={styles.donutCenterStatus}>In Budget</Text>
            </View>
          </View>

          {/* Category Legend Grid */}
          <View style={styles.legendGrid}>
            {CATEGORY_LEGEND.map((item) => (
              <View key={item.id} style={styles.legendHalfPill}>
                <View style={styles.legendLeft}>
                  <View
                    style={[styles.legendDot, { backgroundColor: item.color }]}
                  />
                  <Text style={styles.legendLabel} numberOfLines={1}>
                    {item.label}
                  </Text>
                </View>
                <Text style={styles.legendPercent}>{item.percent}</Text>
              </View>
            ))}

            {/* Full-width 5th Bucket */}
            <View style={styles.legendFullPill}>
              <View style={styles.legendLeft}>
                <View
                  style={[
                    styles.legendDot,
                    { backgroundColor: COLORS.butterYellow },
                  ]}
                />
                <Text style={styles.legendLabel} numberOfLines={1}>
                  Other Utilities &amp; Subscriptions
                </Text>
              </View>
              <Text style={styles.legendPercent}>8%</Text>
            </View>
          </View>
        </View>

        {/* Card 3: Month-over-Month Spending Trends */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardHeaderLeft}>
              <View style={[styles.cardIconCircle, styles.tertiary15Bg]}>
                <Svg
                  width={20}
                  height={20}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={COLORS.tertiaryContainer}
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <Polyline points="3 17 9 11 13 15 21 7" />
                  <Circle cx={3} cy={17} r={1.5} fill={COLORS.tertiaryContainer} />
                  <Circle cx={9} cy={11} r={1.5} fill={COLORS.tertiaryContainer} />
                  <Circle cx={13} cy={15} r={1.5} fill={COLORS.tertiaryContainer} />
                  <Circle cx={21} cy={7} r={1.5} fill={COLORS.tertiaryContainer} />
                </Svg>
              </View>
              <View>
                <Text style={styles.cardTitle}>Spending Trends</Text>
                <Text style={styles.cardSubtitle}>
                  Trailing {trendRange === '3M' ? '3' : trendRange === '6M' ? '6' : '12'} Months
                </Text>
              </View>
            </View>

            {/* Timeframe Toggle Pills */}
            <View style={styles.rangeToggleTrack}>
              {(['3M', '6M', '12M'] as TrendRange[]).map((range) => {
                const isActive = trendRange === range;
                return (
                  <Pressable
                    key={range}
                    onPress={() => setTrendRange(range)}
                    style={({ pressed }) => [
                      styles.rangePill,
                      isActive && styles.rangePillActive,
                      pressed && styles.pressedScale97,
                    ]}
                  >
                    <Text
                      style={[
                        styles.rangePillText,
                        isActive && styles.rangePillTextActive,
                      ]}
                    >
                      {range}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* Chart Visual */}
          <View style={styles.trendChartContainer}>
            <View style={styles.trendCanvas}>
              {/* Y-Axis Guidelines */}
              <View style={styles.yAxisLayer} pointerEvents="none">
                {['₹50k', '₹35k', '₹20k'].map((label) => (
                  <View key={label} style={styles.yAxisRow}>
                    <Text style={styles.yAxisLabel}>{label}</Text>
                    <View style={styles.yAxisRule} />
                  </View>
                ))}
              </View>

              {/* SVG Bezier Curve & Gradient Fill */}
              <Svg
                width="100%"
                height={144}
                viewBox="0 0 320 120"
                preserveAspectRatio="none"
                style={styles.trendSvg}
              >
                <Defs>
                  <LinearGradient
                    id="lavenderTrendGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <Stop
                      offset="0%"
                      stopColor={COLORS.primaryContainer}
                      stopOpacity="0.32"
                    />
                    <Stop
                      offset="100%"
                      stopColor={COLORS.primaryContainer}
                      stopOpacity="0"
                    />
                  </LinearGradient>
                </Defs>

                <Path d={AREA_PATH} fill="url(#lavenderTrendGradient)" />
                <Path
                  d={CURVE_PATH}
                  fill="none"
                  stroke={COLORS.primaryContainer}
                  strokeWidth={3}
                  strokeLinecap="round"
                />

                {TREND_POINTS.map((pt, idx) => (
                  <Circle
                    key={idx}
                    cx={pt.x}
                    cy={pt.y}
                    r={3.5}
                    fill={COLORS.surfaceContainer}
                    stroke={COLORS.primaryContainer}
                    strokeWidth={2}
                  />
                ))}

                {/* Active Month Dot (Oct) with Soft Halo */}
                <Circle
                  cx={300}
                  cy={48}
                  r={10}
                  fill={COLORS.primaryContainer}
                  fillOpacity={0.28}
                />
                <Circle cx={300} cy={48} r={5} fill={COLORS.primaryContainer} />
                <Circle cx={300} cy={48} r={2.5} fill={COLORS.surface} />
              </Svg>

              {/* Active Tooltip Badge */}
              <View style={styles.trendTooltip}>
                <Text style={styles.trendTooltipText}>₹38.4k</Text>
              </View>
            </View>

            {/* X-Axis Month Labels */}
            <View style={styles.xAxisRow}>
              {TREND_MONTHS.map((month, idx) => {
                const isOct = idx === TREND_MONTHS.length - 1;
                return (
                  <Text
                    key={month}
                    style={[styles.xAxisLabel, isOct && styles.xAxisLabelActive]}
                  >
                    {month}
                  </Text>
                );
              })}
            </View>
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

/* ---------- Helper Components ---------- */

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
    gap: 16, // space-y-space-md
  },

  // Page Header Row
  pageHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 4,
  },
  kickerLabel: {
    fontFamily: FONTS.labelSemiBold,
    fontSize: 10,
    lineHeight: 12,
    letterSpacing: 0.8,
    fontWeight: '600',
    color: COLORS.onSurfaceVariant,
  },
  pageTitle: {
    fontFamily: FONTS.displayBold,
    fontSize: 32,
    lineHeight: 40,
    letterSpacing: -0.64,
    fontWeight: '700',
    color: COLORS.onSurface,
  },
  uploadActionBtn: {
    width: 48,
    height: 48,
    borderRadius: 16, // rounded-2xl
    backgroundColor: COLORS.surfaceContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Segmented Switcher
  segmentTrack: {
    width: '100%',
    backgroundColor: COLORS.surfaceContainerLowest,
    padding: 4,
    borderRadius: 9999,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  segmentBtn: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 9999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentBtnActive: {
    backgroundColor: COLORS.primaryContainer,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  segmentBtnText: {
    fontFamily: FONTS.labelSemiBold,
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '500',
    color: COLORS.onSurfaceVariant,
  },
  segmentBtnTextActive: {
    fontFamily: FONTS.headlineBold,
    fontWeight: '700',
    color: COLORS.onPrimaryFixed,
  },

  // Shared Card Shell
  card: {
    width: '100%',
    backgroundColor: COLORS.surfaceContainer,
    borderRadius: 24, // rounded-3xl
    padding: 20, // p-5
    gap: 16, // gap-4
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  cardIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    fontFamily: FONTS.headlineBold,
    fontSize: 18,
    lineHeight: 20,
    fontWeight: '700',
    color: COLORS.onSurface,
  },
  cardSubtitle: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 12,
    lineHeight: 16,
    color: COLORS.onSurfaceVariant,
    marginTop: 2,
  },
  surplusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 9999,
    backgroundColor: COLORS.secondary10,
  },
  surplusBadgeText: {
    fontFamily: FONTS.labelBold,
    fontSize: 10,
    lineHeight: 12,
    letterSpacing: 0.5,
    fontWeight: '700',
    color: COLORS.secondary,
  },

  // Cash Flow Bars
  barsGroup: {
    gap: 12,
    paddingTop: 4,
  },
  barItem: {
    gap: 6,
  },
  barLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  barLabel: {
    fontFamily: FONTS.labelSemiBold,
    fontSize: 12,
    lineHeight: 16,
    color: COLORS.onSurfaceVariant,
  },
  barIncomeValue: {
    fontFamily: FONTS.numericTable,
    fontSize: 16,
    lineHeight: 20,
    fontWeight: '700',
    color: COLORS.onSurface,
  },
  barExpenseValue: {
    fontFamily: FONTS.numericTable,
    fontSize: 16,
    lineHeight: 20,
    fontWeight: '700',
    color: COLORS.tertiaryFixedDim,
  },
  barTrack: {
    width: '100%',
    height: 10,
    borderRadius: 9999,
    backgroundColor: COLORS.surfaceContainerHighest,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 9999,
  },
  barFillIncome: {
    width: '100%',
    backgroundColor: COLORS.secondary,
  },
  barFillExpense: {
    width: '59.07%',
    backgroundColor: COLORS.tertiaryContainer,
  },

  // Savings Rate Banner
  savingsBanner: {
    width: '100%',
    backgroundColor: COLORS.secondaryContainer15,
    borderRadius: 16, // rounded-2xl
    padding: 14, // p-3.5
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  savingsLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  savingsIconBox: {
    width: 36,
    height: 36,
    borderRadius: 12, // rounded-xl
    backgroundColor: COLORS.secondary20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  savingsHeadlineRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
  },
  savingsLabel: {
    fontFamily: FONTS.labelSemiBold,
    fontSize: 10,
    lineHeight: 12,
    letterSpacing: 0.5,
    fontWeight: '600',
    color: COLORS.onSurfaceVariant,
  },
  savingsPercent: {
    fontFamily: FONTS.numericTable,
    fontSize: 16,
    lineHeight: 20,
    fontWeight: '700',
    color: COLORS.secondary,
  },
  savingsSubtext: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 12,
    lineHeight: 16,
    color: COLORS.onSurfaceVariant,
    marginTop: 2,
  },

  // Donut Card
  chevronBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  donutWrapper: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  donutCenter: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  donutCenterKicker: {
    fontFamily: FONTS.labelSemiBold,
    fontSize: 10,
    lineHeight: 12,
    letterSpacing: 0.8,
    fontWeight: '600',
    color: COLORS.onSurfaceVariant,
  },
  donutCenterAmount: {
    fontFamily: FONTS.headlineBold,
    fontSize: 28,
    lineHeight: 34,
    letterSpacing: -0.56,
    fontWeight: '700',
    color: COLORS.onSurface,
  },
  donutCenterStatus: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 12,
    lineHeight: 16,
    color: COLORS.secondary,
  },

  // Category Legend Grid
  legendGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 10,
    paddingTop: 8,
  },
  legendHalfPill: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 8,
    borderRadius: 12,
    backgroundColor: COLORS.surfaceContainerLow,
    gap: 6,
  },
  legendFullPill: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 8,
    borderRadius: 12,
    backgroundColor: COLORS.surfaceContainerLow,
    gap: 8,
  },
  legendLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendLabel: {
    flexShrink: 1,
    fontFamily: FONTS.labelSemiBold,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '600',
    color: COLORS.onSurface,
  },
  legendPercent: {
    fontFamily: FONTS.numericTable,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '700',
    color: COLORS.onSurface,
  },

  // Spending Trends Card
  rangeToggleTrack: {
    backgroundColor: COLORS.surfaceContainerLowest,
    padding: 2,
    borderRadius: 9999,
    flexDirection: 'row',
    alignItems: 'center',
  },
  rangePill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 9999,
  },
  rangePillActive: {
    backgroundColor: COLORS.primaryContainer,
  },
  rangePillText: {
    fontFamily: FONTS.labelBold,
    fontSize: 10,
    lineHeight: 12,
    letterSpacing: 0.4,
    fontWeight: '600',
    color: COLORS.onSurfaceVariant,
  },
  rangePillTextActive: {
    fontWeight: '700',
    color: COLORS.onPrimaryFixed,
  },
  trendChartContainer: {
    gap: 8,
    paddingTop: 8,
  },
  trendCanvas: {
    position: 'relative',
    width: '100%',
    height: 176,
    justifyContent: 'flex-end',
  },
  yAxisLayer: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    justifyContent: 'space-between',
    opacity: 0.4,
  },
  yAxisRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  yAxisLabel: {
    fontFamily: FONTS.numericTable,
    fontSize: 12,
    lineHeight: 16,
    color: COLORS.onSurfaceVariant,
  },
  yAxisRule: {
    flex: 1,
    height: 1,
    marginLeft: 8,
    backgroundColor: COLORS.surfaceVariant,
  },
  trendSvg: {
    zIndex: 10,
  },
  trendTooltip: {
    position: 'absolute',
    right: 0,
    top: -4,
    zIndex: 20,
    backgroundColor: COLORS.primaryContainer,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  trendTooltipText: {
    fontFamily: FONTS.numericTable,
    fontSize: 10,
    lineHeight: 14,
    fontWeight: '700',
    color: COLORS.onPrimaryFixed,
  },
  xAxisRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 6,
    paddingHorizontal: 6,
  },
  xAxisLabel: {
    fontFamily: FONTS.labelSemiBold,
    fontSize: 10,
    lineHeight: 12,
    fontWeight: '500',
    color: COLORS.onSurfaceVariant,
  },
  xAxisLabelActive: {
    fontWeight: '700',
    color: COLORS.primaryContainer,
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
  secondary15Bg: {
    backgroundColor: COLORS.secondary15,
  },
  primary15Bg: {
    backgroundColor: COLORS.primaryContainer15,
  },
  tertiary15Bg: {
    backgroundColor: COLORS.tertiaryContainer15,
  },
  pressedOpacity: {
    opacity: 0.72,
  },
  pressedScale95: {
    transform: [{ scale: 0.95 }],
  },
  pressedScale97: {
    transform: [{ scale: 0.97 }],
  },
});