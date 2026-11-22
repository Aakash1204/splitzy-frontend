import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, Line, Path, Polyline, Rect } from 'react-native-svg';

const COLORS = {
  surfaceContainerLowest: '#0e0e13',
  surfaceContainerLowest85: 'rgba(14, 14, 19, 0.9)',
  surfaceContainerLow: '#1b1b20',
  surfaceContainerLow90: 'rgba(27, 27, 32, 0.94)',
  surfaceContainer: '#1f1f24',
  surfaceContainerHigh: '#2a292f',
  onSurface: '#e4e1e9',
  onSurfaceVariant: '#cac4d1',
  outline: '#938f9a',
  primary: '#dfd5ff',
  primaryContainer: '#c4b5fd',
  primaryContainer15: 'rgba(196, 181, 253, 0.15)',
  primaryContainer20: 'rgba(196, 181, 253, 0.2)',
  primaryFixedDim: '#ccbeff',
  secondary: '#62dcad',
  secondary10: 'rgba(98, 220, 173, 0.1)',
  secondaryContainer20: 'rgba(24, 164, 121, 0.2)',
  tertiary: '#ffced3',
  tertiaryContainer: '#ffa6b1',
  tertiaryContainer15: 'rgba(255, 166, 177, 0.15)',
};

// Replace `undefined` with loaded font family names if using @expo-google-fonts
const FONTS = {
  headlineBold: undefined as string | undefined,
  headlineSemiBold: undefined as string | undefined,
  numericTable: undefined as string | undefined,
  bodyRegular: undefined as string | undefined,
  bodyMedium: undefined as string | undefined,
  labelSemiBold: undefined as string | undefined,
  labelBold: undefined as string | undefined,
};

export type BottomNavTab = 'dashboard' | 'split-with' | 'analytics' | 'ai-query';

const SUGGESTED_PROMPTS = [
  {
    id: 'top-merchants',
    label: 'Top 5 merchants this month',
    icon: 'storefront' as const,
    color: COLORS.tertiary,
  },
  {
    id: 'duplicates',
    label: 'Any duplicate charges?',
    icon: 'copy' as const,
    color: COLORS.primaryContainer,
  },
  {
    id: 'savings-rate',
    label: 'My net savings rate',
    icon: 'savings' as const,
    color: COLORS.secondary,
  },
];

interface AskSplitzyAIScreenProps {
  activeNavTab?: BottomNavTab;
  onNavTabPress?: (tab: BottomNavTab) => void;
  onBack?: () => void;
  onSettingsPress?: () => void;
  onSendQuery?: (query: string) => void;
  onMicPress?: () => void;
}

export default function AskSplitzyAIScreen({
  activeNavTab: controlledNavTab,
  onNavTabPress,
  onBack,
  onSettingsPress,
  onSendQuery,
  onMicPress,
}: AskSplitzyAIScreenProps) {
  const insets = useSafeAreaInsets();
  const [internalNavTab, setInternalNavTab] = useState<BottomNavTab>('ai-query');
  const [queryText, setQueryText] = useState('');

  const currentNavTab = controlledNavTab ?? internalNavTab;
  const headerHeight = 64 + insets.top;
  const navPaddingBottom = Math.max(insets.bottom, 12);
  const navHeight = 64 + navPaddingBottom;

  const handleNavSelect = (tab: BottomNavTab) => {
    setInternalNavTab(tab);
    onNavTabPress?.(tab);
  };

  const handleSend = () => {
    const trimmed = queryText.trim();
    if (!trimmed) return;
    onSendQuery?.(trimmed);
    setQueryText('');
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
            <Text style={styles.headerTitle}>Ask Splitzy Ai</Text>
          </View>

          <Pressable
            accessibilityLabel="AI Assistant Settings"
            accessibilityRole="button"
            onPress={onSettingsPress}
            style={({ pressed }) => [
              styles.headerIconBtn,
              pressed && styles.pressedOpacity,
            ]}
          >
            <Svg
              width={20}
              height={20}
              viewBox="0 0 24 24"
              fill={COLORS.onSurfaceVariant}
            >
              <Circle cx={12} cy={5} r={1.8} />
              <Circle cx={12} cy={12} r={1.8} />
              <Circle cx={12} cy={19} r={1.8} />
            </Svg>
          </Pressable>
        </View>
      </View>

      {/* Main Scrollable Chat Area */}
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          style={styles.flex}
          contentContainerStyle={[
            styles.scrollContent,
            {
              paddingTop: headerHeight + 4,
              paddingBottom: navHeight + 24,
            },
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Top Context & Privacy Indicator Banner */}
          <View style={styles.contextBanner}>
            <View style={styles.contextLeft}>
              <View style={styles.assistantIconCircle}>
                <SparkleIcon size={18} color={COLORS.primaryContainer} />
              </View>
              <View>
                <Text style={styles.assistantTitle}>Ledger Assistant</Text>
                <View style={styles.syncRow}>
                  <View style={styles.syncDot} />
                  <Text style={styles.syncText}>LIVE LEDGER SYNC</Text>
                </View>
              </View>
            </View>

            <View style={styles.piiPill}>
              <Svg
                width={14}
                height={14}
                viewBox="0 0 24 24"
                fill="none"
                stroke={COLORS.secondary}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <Path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <Polyline points="9 12 11 14 15 10" />
              </Svg>
              <Text style={styles.piiText}>PII Redacted</Text>
            </View>
          </View>

          {/* Chat History Stream */}
          <View style={styles.chatStream}>
            {/* User Message 1 */}
            <View style={styles.userMessageGroup}>
              <View style={styles.userBubble}>
                <Text style={styles.userBubbleText}>
                  How much did I spend on food delivery last month?
                </Text>
              </View>
              <Text style={styles.timestampText}>10:24 AM</Text>
            </View>

            {/* AI Response 1 */}
            <View style={styles.aiMessageGroup}>
              <View style={styles.aiBubble}>
                <View style={styles.aiHeader}>
                  <View style={styles.aiIdentity}>
                    <View style={styles.aiSmallBadge}>
                      <SparkleIcon size={13} color={COLORS.primaryContainer} />
                    </View>
                    <Text style={styles.aiName}>Splitzy AI</Text>
                  </View>
                  <Text style={styles.timestampText}>10:24 AM</Text>
                </View>

                <Text style={styles.aiAnswerText}>
                  Last month, you spent{' '}
                  <Text style={styles.highlightPrimary}>₹7,840</Text> across 18
                  food delivery orders.
                </Text>

                {/* Embedded Breakdown Module */}
                <View style={styles.embeddedCard}>
                  <View style={styles.embeddedHeader}>
                    <Text style={styles.embeddedKicker}>MERCHANT SHARE</Text>
                    <Text style={styles.embeddedMonth}>June 2024</Text>
                  </View>

                  {/* Proportional Segment Track */}
                  <View style={styles.proportionTrack}>
                    <View style={styles.proportionPrimary} />
                    <View style={styles.proportionSecondary} />
                  </View>

                  {/* Merchant List */}
                  <View style={styles.merchantBreakdownList}>
                    <View style={styles.merchantBreakdownRow}>
                      <View style={styles.merchantBreakdownLeft}>
                        <View
                          style={[
                            styles.merchantMiniIcon,
                            styles.tertiaryContainer15Bg,
                          ]}
                        >
                          <Svg
                            width={15}
                            height={15}
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke={COLORS.tertiaryContainer}
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <Path d="M4 11h16a1 1 0 0 1 1 1v.5c0 1.5-1.5 2.5-3 2.5H6c-1.5 0-3-1-3-2.5V12a1 1 0 0 1 1-1Z" />
                            <Path d="M5 11C5 7.5 8 5 12 5s7 2.5 7 6" />
                            <Path d="M5 15v2a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-2" />
                          </Svg>
                        </View>
                        <View>
                          <Text style={styles.merchantMiniName}>Swiggy</Text>
                          <Text style={styles.merchantMiniSub}>
                            12 deliveries
                          </Text>
                        </View>
                      </View>
                      <Text style={styles.merchantMiniAmount}>₹5,240</Text>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.merchantBreakdownRow}>
                      <View style={styles.merchantBreakdownLeft}>
                        <View
                          style={[
                            styles.merchantMiniIcon,
                            styles.primaryContainer15Bg,
                          ]}
                        >
                          <Svg
                            width={15}
                            height={15}
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke={COLORS.primaryContainer}
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <Path d="M12 2L2 20c5.5 2.5 14.5 2.5 20 0L12 2z" />
                            <Circle cx={12} cy={12} r={1} fill={COLORS.primaryContainer} />
                            <Circle cx={9.5} cy={16} r={1} fill={COLORS.primaryContainer} />
                            <Circle cx={14.5} cy={15.5} r={1} fill={COLORS.primaryContainer} />
                          </Svg>
                        </View>
                        <View>
                          <Text style={styles.merchantMiniName}>Zomato</Text>
                          <Text style={styles.merchantMiniSub}>
                            6 deliveries
                          </Text>
                        </View>
                      </View>
                      <Text style={styles.merchantMiniAmount}>₹2,600</Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>

            {/* User Message 2 */}
            <View style={styles.userMessageGroup}>
              <View style={styles.userBubble}>
                <Text style={styles.userBubbleText}>
                  Compare my Q1 and Q2 travel spend
                </Text>
              </View>
              <Text style={styles.timestampText}>10:26 AM</Text>
            </View>

            {/* AI Response 2 */}
            <View style={styles.aiMessageGroup}>
              <View style={styles.aiBubble}>
                <View style={styles.aiHeader}>
                  <View style={styles.aiIdentity}>
                    <View style={styles.aiSmallBadge}>
                      <SparkleIcon size={13} color={COLORS.primaryContainer} />
                    </View>
                    <Text style={styles.aiName}>Splitzy AI</Text>
                  </View>
                  <Text style={styles.timestampText}>Just now</Text>
                </View>

                <Text style={styles.aiAnswerText}>
                  Your Q2 travel spend decreased by{' '}
                  <Text style={styles.highlightSecondary}>18%</Text> compared to
                  Q1.
                </Text>

                {/* Compact Comparison Widget */}
                <View style={styles.embeddedCard}>
                  <View style={styles.comparisonHeader}>
                    <View style={styles.comparisonTitleGroup}>
                      <View style={styles.flightMiniBadge}>
                        <Svg
                          width={15}
                          height={15}
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke={COLORS.secondary}
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <Path d="M2 22h20" />
                          <Path d="M6.36 17.4 4 17l-2-4 1.1-.55a2 2 0 0 1 1.8 0l.17.1a2 2 0 0 0 1.8 0L8 12 5 6l.9-.45a2 2 0 0 1 2.09.2l4.02 3a2 2 0 0 0 2.1.2l4.19-2.06a2.41 2.41 0 0 1 1.73-.17L21 7a1.4 1.4 0 0 1 .87 1.99l-.38.76c-.23.46-.6.84-1.07 1.08L7.58 17.2a2 2 0 0 1-1.22.18Z" />
                        </Svg>
                      </View>
                      <Text style={styles.comparisonTitle} numberOfLines={1}>
                        Quarterly Flight &amp; Transit
                      </Text>
                    </View>

                    <View style={styles.deltaBadge}>
                      <Svg
                        width={12}
                        height={12}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke={COLORS.secondary}
                        strokeWidth={2.3}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <Polyline points="23 18 13.5 8.5 8.5 13.5 1 6" />
                        <Polyline points="17 18 23 18 23 12" />
                      </Svg>
                      <Text style={styles.deltaBadgeText}>-18%</Text>
                    </View>
                  </View>

                  {/* Comparative Value Bars */}
                  <View style={styles.quarterBars}>
                    <View style={styles.quarterBarItem}>
                      <View style={styles.quarterLabelRow}>
                        <Text style={styles.quarterLabel}>Q1 (Jan - Mar)</Text>
                        <Text style={styles.quarterValue}>₹14,200</Text>
                      </View>
                      <View style={styles.quarterTrack}>
                        <View style={styles.q1Fill} />
                      </View>
                    </View>

                    <View style={styles.quarterBarItem}>
                      <View style={styles.quarterLabelRow}>
                        <Text style={styles.quarterLabel}>Q2 (Apr - Jun)</Text>
                        <Text style={styles.quarterValue}>₹11,640</Text>
                      </View>
                      <View style={styles.quarterTrack}>
                        <View style={styles.q2Fill} />
                      </View>
                    </View>
                  </View>

                  {/* Delta Summary Pill */}
                  <View style={styles.deltaSummaryPill}>
                    <Text style={styles.deltaSummaryLabel}>
                      Net Differential
                    </Text>
                    <Text style={styles.deltaSummaryValue}>Saved ₹2,560</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>

          {/* Interactive Suggested Prompts Rail */}
          <View style={styles.suggestionsSection}>
            <Text style={styles.suggestionsKicker}>SUGGESTED INQUIRIES</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.suggestionsRail}
            >
              {SUGGESTED_PROMPTS.map((item) => (
                <Pressable
                  key={item.id}
                  onPress={() => setQueryText(item.label)}
                  style={({ pressed }) => [
                    styles.suggestionChip,
                    pressed && styles.suggestionChipPressed,
                  ]}
                >
                  <SuggestionIcon type={item.icon} color={item.color} />
                  <Text style={styles.suggestionText}>{item.label}</Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>

          {/* Input Deck */}
          <View style={styles.inputDeck}>
            <View style={styles.inputLeft}>
              <SparkleIcon size={20} color={COLORS.primaryContainer} />
              <TextInput
                style={styles.queryInput}
                value={queryText}
                onChangeText={setQueryText}
                placeholder="Ask anything about your expenses..."
                placeholderTextColor={COLORS.outline}
                returnKeyType="send"
                onSubmitEditing={handleSend}
                selectionColor={COLORS.primaryContainer}
              />
            </View>

            <View style={styles.inputActions}>
              <Pressable
                accessibilityLabel="Use Microphone"
                accessibilityRole="button"
                onPress={onMicPress}
                style={({ pressed }) => [
                  styles.micButton,
                  pressed && styles.pressedScale90,
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
                  <Path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                  <Path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                  <Line x1={12} y1={19} x2={12} y2={22} />
                </Svg>
              </Pressable>

              <Pressable
                accessibilityLabel="Send Query"
                accessibilityRole="button"
                onPress={handleSend}
                style={({ pressed }) => [
                  styles.sendButton,
                  pressed && styles.pressedScale90,
                ]}
              >
                <Svg
                  width={20}
                  height={20}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={COLORS.surfaceContainerLowest}
                  strokeWidth={2.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <Line x1={12} y1={19} x2={12} y2={5} />
                  <Polyline points="5 12 12 5 19 12" />
                </Svg>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

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

function SuggestionIcon({
  type,
  color,
}: {
  type: 'storefront' | 'copy' | 'savings';
  color: string;
}) {
  if (type === 'storefront') {
    return (
      <Svg
        width={15}
        height={15}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <Path d="M3 9l1.5-5h15L21 9" />
        <Path d="M3 9a3 3 0 0 0 6 0 3 3 0 0 0 6 0 3 3 0 0 0 6 0" />
        <Path d="M5 12v8h14v-8" />
      </Svg>
    );
  }

  if (type === 'copy') {
    return (
      <Svg
        width={15}
        height={15}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <Rect x={9} y={9} width={13} height={13} rx={2} ry={2} />
        <Path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
      </Svg>
    );
  }

  return (
    <Svg
      width={15}
      height={15}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <Path d="M19 5c-1.5 0-2.8 1.4-3 2-3.5-1.5-11-.3-11 5 0 1.8 0 3 2 4.5V20h4v-2h3v2h4v-4c1-.5 1.7-1 2-2h2v-4h-2c0-1-.5-1.5-1-2V5z" />
      <Circle cx={15} cy={10} r={1} fill={color} />
    </Svg>
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
    gap: 16, // gap-space-md
  },

  // Context Banner
  contextBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
    gap: 8,
  },
  contextLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  assistantIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.primaryContainer20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  assistantTitle: {
    fontFamily: FONTS.headlineSemiBold,
    fontSize: 18,
    lineHeight: 22,
    fontWeight: '600',
    color: COLORS.onSurface,
  },
  syncRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  syncDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.secondary,
  },
  syncText: {
    fontFamily: FONTS.labelBold,
    fontSize: 10,
    lineHeight: 12,
    letterSpacing: 0.7,
    fontWeight: '700',
    color: COLORS.secondary,
  },
  piiPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 9999,
    backgroundColor: COLORS.surfaceContainerHigh,
  },
  piiText: {
    fontFamily: FONTS.labelSemiBold,
    fontSize: 10,
    lineHeight: 12,
    letterSpacing: 0.4,
    fontWeight: '600',
    color: COLORS.onSurfaceVariant,
  },

  // Chat Stream
  chatStream: {
    gap: 16,
    width: '100%',
  },
  userMessageGroup: {
    alignItems: 'flex-end',
    alignSelf: 'flex-end',
    maxWidth: '85%',
    gap: 4,
  },
  userBubble: {
    backgroundColor: COLORS.primaryContainer,
    borderRadius: 24,
    borderTopRightRadius: 4,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  userBubbleText: {
    fontFamily: FONTS.bodyMedium,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
    color: COLORS.surfaceContainerLowest,
  },
  timestampText: {
    fontFamily: FONTS.labelBold,
    fontSize: 10,
    lineHeight: 12,
    letterSpacing: 0.4,
    fontWeight: '700',
    color: COLORS.outline,
    paddingHorizontal: 4,
  },

  // AI Message Bubble
  aiMessageGroup: {
    alignItems: 'flex-start',
    alignSelf: 'flex-start',
    width: '94%',
    gap: 6,
  },
  aiBubble: {
    width: '100%',
    backgroundColor: COLORS.surfaceContainer,
    borderRadius: 24,
    borderTopLeftRadius: 4,
    padding: 16,
    gap: 12,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.24,
    shadowRadius: 10,
    elevation: 4,
  },
  aiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  aiIdentity: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  aiSmallBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.primaryContainer20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  aiName: {
    fontFamily: FONTS.labelSemiBold,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.36,
    fontWeight: '600',
    color: COLORS.onSurface,
  },
  aiAnswerText: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 14,
    lineHeight: 22,
    color: COLORS.onSurface,
  },
  highlightPrimary: {
    fontFamily: FONTS.numericTable,
    fontWeight: '700',
    color: COLORS.primary,
  },
  highlightSecondary: {
    fontFamily: FONTS.numericTable,
    fontWeight: '700',
    color: COLORS.secondary,
  },

  // Embedded Cards inside AI Bubbles
  embeddedCard: {
    backgroundColor: COLORS.surfaceContainerLowest,
    borderRadius: 16, // rounded-2xl
    padding: 14, // p-3.5
    gap: 12,
  },
  embeddedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  embeddedKicker: {
    fontFamily: FONTS.labelBold,
    fontSize: 10,
    lineHeight: 12,
    letterSpacing: 0.7,
    fontWeight: '700',
    color: COLORS.onSurfaceVariant,
  },
  embeddedMonth: {
    fontFamily: FONTS.labelBold,
    fontSize: 10,
    lineHeight: 12,
    letterSpacing: 0.4,
    fontWeight: '700',
    color: COLORS.primary,
  },
  proportionTrack: {
    width: '100%',
    height: 8,
    borderRadius: 9999,
    backgroundColor: COLORS.surfaceContainerHigh,
    overflow: 'hidden',
    flexDirection: 'row',
  },
  proportionPrimary: {
    width: '66.8%',
    height: '100%',
    backgroundColor: COLORS.tertiaryContainer,
  },
  proportionSecondary: {
    width: '33.2%',
    height: '100%',
    backgroundColor: COLORS.primaryContainer,
  },
  merchantBreakdownList: {
    gap: 8,
    paddingTop: 4,
  },
  merchantBreakdownRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  merchantBreakdownLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  merchantMiniIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  merchantMiniName: {
    fontFamily: FONTS.labelSemiBold,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '600',
    color: COLORS.onSurface,
  },
  merchantMiniSub: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 12,
    lineHeight: 16,
    color: COLORS.onSurfaceVariant,
  },
  merchantMiniAmount: {
    fontFamily: FONTS.numericTable,
    fontSize: 16,
    lineHeight: 20,
    fontWeight: '700',
    color: COLORS.onSurface,
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: COLORS.surfaceContainerHigh,
  },

  // Q1 vs Q2 Comparison Widget
  comparisonHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  comparisonTitleGroup: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  flightMiniBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.secondaryContainer20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  comparisonTitle: {
    flexShrink: 1,
    fontFamily: FONTS.labelSemiBold,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '600',
    color: COLORS.onSurface,
  },
  deltaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.secondary10,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 9999,
  },
  deltaBadgeText: {
    fontFamily: FONTS.labelBold,
    fontSize: 10,
    lineHeight: 12,
    fontWeight: '700',
    color: COLORS.secondary,
  },
  quarterBars: {
    gap: 10,
    paddingTop: 4,
  },
  quarterBarItem: {
    gap: 4,
  },
  quarterLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  quarterLabel: {
    fontFamily: FONTS.labelSemiBold,
    fontSize: 10,
    lineHeight: 14,
    fontWeight: '500',
    color: COLORS.onSurfaceVariant,
  },
  quarterValue: {
    fontFamily: FONTS.numericTable,
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '700',
    color: COLORS.onSurface,
  },
  quarterTrack: {
    width: '100%',
    height: 8,
    borderRadius: 9999,
    backgroundColor: COLORS.surfaceContainerHigh,
    overflow: 'hidden',
  },
  q1Fill: {
    width: '100%',
    height: '100%',
    borderRadius: 9999,
    backgroundColor: COLORS.primaryFixedDim,
  },
  q2Fill: {
    width: '82%',
    height: '100%',
    borderRadius: 9999,
    backgroundColor: COLORS.secondary,
  },
  deltaSummaryPill: {
    marginTop: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.surfaceContainer,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  deltaSummaryLabel: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 12,
    lineHeight: 16,
    color: COLORS.onSurfaceVariant,
  },
  deltaSummaryValue: {
    fontFamily: FONTS.labelBold,
    fontSize: 10,
    lineHeight: 14,
    fontWeight: '700',
    color: COLORS.secondary,
  },

  // Suggested Inquiries Rail
  suggestionsSection: {
    gap: 8,
    marginTop: 8,
  },
  suggestionsKicker: {
    fontFamily: FONTS.labelBold,
    fontSize: 10,
    lineHeight: 12,
    letterSpacing: 0.7,
    fontWeight: '700',
    color: COLORS.outline,
    paddingHorizontal: 4,
  },
  suggestionsRail: {
    gap: 8,
    paddingBottom: 4,
  },
  suggestionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 9999,
    backgroundColor: COLORS.surfaceContainer,
  },
  suggestionChipPressed: {
    backgroundColor: COLORS.surfaceContainerHigh,
    transform: [{ scale: 0.95 }],
  },
  suggestionText: {
    fontFamily: FONTS.labelSemiBold,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '600',
    color: COLORS.onSurfaceVariant,
  },

  // Input Deck
  inputDeck: {
    width: '100%',
    backgroundColor: COLORS.surfaceContainer,
    borderRadius: 9999,
    padding: 6,
    paddingLeft: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    marginTop: 4,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.28,
    shadowRadius: 12,
    elevation: 6,
  },
  inputLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  queryInput: {
    flex: 1,
    fontFamily: FONTS.bodyRegular,
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.onSurface,
    paddingVertical: 6,
  },
  inputActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  micButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.primaryContainer,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
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
  primaryContainer15Bg: {
    backgroundColor: COLORS.primaryContainer15,
  },
  pressedOpacity: {
    opacity: 0.72,
  },
  pressedScale90: {
    transform: [{ scale: 0.9 }],
  },
});