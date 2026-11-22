import { type ComponentRef, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
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
import Svg, {
  Circle,
  Defs,
  Line,
  Path,
  Polyline,
  RadialGradient,
  Rect,
  Stop,
} from 'react-native-svg';

const COLORS = {
  surfaceContainerLowest: '#0e0e13',
  surfaceContainerLowest60: 'rgba(14, 14, 19, 0.6)',
  surfaceContainerLowest80: 'rgba(14, 14, 19, 0.88)',
  surfaceContainerLow: '#1b1b20',
  surfaceContainer: '#1f1f24',
  surfaceContainerHigh: '#2a292f',
  surfaceContainerHighest: '#35343a',
  onSurface: '#e4e1e9',
  onSurfaceVariant: '#cac4d1',
  primary: '#dfd5ff',
  primaryContainer: '#c4b5fd',
  primaryContainer20: 'rgba(196, 181, 253, 0.2)',
  onPrimary: '#332664',
  secondary: '#62dcad',
  secondary15: 'rgba(98, 220, 173, 0.15)',
  secondary20: 'rgba(98, 220, 173, 0.2)',
  secondaryContainer20: 'rgba(24, 164, 121, 0.2)',
  onSecondary: '#003827',
  tertiary: '#ffced3',
};

// Replace `undefined` with loaded font family names if using @expo-google-fonts
const FONTS = {
  displayBold: undefined as string | undefined,
  headlineBold: undefined as string | undefined,
  headlineSemiBold: undefined as string | undefined,
  numericTable: undefined as string | undefined,
  bodyRegular: undefined as string | undefined,
  bodySemiBold: undefined as string | undefined,
  labelSemiBold: undefined as string | undefined,
  labelBold: undefined as string | undefined,
};

export type PaymentMode = 'upi' | 'cash' | 'netbanking';
type RecordStatus = 'idle' | 'recording' | 'settled';

interface SettleUpScreenProps {
  groupName?: string;
  payerName?: string;
  payeeName?: string;
  fullBalance?: number;
  onBack?: () => void;
  onMorePress?: () => void;
  onRecordSettlement?: (payload: {
    amount: number;
    paymentMode: PaymentMode;
  }) => void;
}

export default function SettleUpScreen({
  groupName = 'Goa Trip 2025',
  payerName = 'Amit',
  payeeName = 'Priya',
  fullBalance = 450,
  onBack,
  onMorePress,
  onRecordSettlement,
}: SettleUpScreenProps) {
  const insets = useSafeAreaInsets();

  const [amountInput, setAmountInput] = useState(String(fullBalance));
  const [isEditingAmount, setIsEditingAmount] = useState(false);
  const [paymentMode, setPaymentMode] = useState<PaymentMode>('upi');
  const [recordStatus, setRecordStatus] = useState<RecordStatus>('idle');

  const amountInputRef = useRef<ComponentRef<typeof TextInput>>(null);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  // Ping animation for the dot above the transfer arrow
  const pingScale = useRef(new Animated.Value(1)).current;
  const pingOpacity = useRef(new Animated.Value(0.85)).current;

  // Pulse animation for the amount cursor bar
  const cursorOpacity = useRef(new Animated.Value(1)).current;

  const headerHeight = 64 + insets.top;

  useEffect(() => {
    const pingLoop = Animated.loop(
      Animated.parallel([
        Animated.timing(pingScale, {
          toValue: 2.4,
          duration: 1100,
          useNativeDriver: true,
        }),
        Animated.timing(pingOpacity, {
          toValue: 0,
          duration: 1100,
          useNativeDriver: true,
        }),
      ])
    );

    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(cursorOpacity, {
          toValue: 0.2,
          duration: 550,
          useNativeDriver: true,
        }),
        Animated.timing(cursorOpacity, {
          toValue: 1,
          duration: 550,
          useNativeDriver: true,
        }),
      ])
    );

    pingLoop.start();
    pulseLoop.start();

    return () => {
      pingLoop.stop();
      pulseLoop.stop();
      timersRef.current.forEach(clearTimeout);
    };
  }, [pingScale, pingOpacity, cursorOpacity]);

  const numericAmount = parseFloat(amountInput.replace(/[^0-9.]/g, '')) || 0;
  const isFullBalance = Math.abs(numericAmount - fullBalance) < 0.01;

  const focusAmountEditor = () => {
    setIsEditingAmount(true);
    setTimeout(() => amountInputRef.current?.focus(), 40);
  };

  const handleRecordPress = () => {
    if (recordStatus !== 'idle') return;
    setRecordStatus('recording');

    const t1 = setTimeout(() => {
      setRecordStatus('settled');
      onRecordSettlement?.({ amount: numericAmount, paymentMode });

      const t2 = setTimeout(() => {
        setRecordStatus('idle');
      }, 1800);
      timersRef.current.push(t2);
    }, 900);

    timersRef.current.push(t1);
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
                styles.iconBtn,
                styles.backBtnOffset,
                pressed && styles.pressedScale95,
              ]}
            >
              <Svg
                width={20}
                height={20}
                viewBox="0 0 24 24"
                fill="none"
                stroke={COLORS.onSurface}
                strokeWidth={2.2}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <Polyline points="15 18 9 12 15 6" />
              </Svg>
            </Pressable>
            <Text style={styles.headerTitle} numberOfLines={1}>
              Split Expense Subpage
            </Text>
          </View>

          <View style={styles.headerRight}>
            <Pressable
              accessibilityLabel="More actions"
              accessibilityRole="button"
              onPress={onMorePress}
              style={({ pressed }) => [
                styles.iconBtn,
                pressed && styles.pressedScale95,
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

            <View style={styles.headerAvatar}>
              <Svg
                width={18}
                height={18}
                viewBox="0 0 24 24"
                fill="none"
                stroke={COLORS.onPrimary}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <Path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <Circle cx={12} cy={7} r={4} />
              </Svg>
            </View>
          </View>
        </View>
      </View>

      {/* Main Content */}
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          style={styles.flex}
          contentContainerStyle={[
            styles.scrollContent,
            {
              paddingTop: headerHeight + 8,
              paddingBottom: Math.max(insets.bottom, 24) + 32,
            },
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Group Context Chip Row */}
          <View style={styles.contextRow}>
            <View style={styles.groupChip}>
              <View style={styles.groupDot} />
              <Text style={styles.groupChipText}>{groupName}</Text>
            </View>

            <View style={styles.instantBadge}>
              <Svg
                width={14}
                height={14}
                viewBox="0 0 24 24"
                fill="none"
                stroke={COLORS.tertiary}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <Path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
                <Path d="M3 3v5h5" />
                <Rect x={9} y={11} width={6} height={5} rx={1} />
                <Path d="M10.5 11V9.5a1.5 1.5 0 0 1 3 0V11" />
              </Svg>
              <Text style={styles.instantBadgeText}>INSTANT BALANCE</Text>
            </View>
          </View>

          {/* Visual Settlement Flow Card */}
          <View style={styles.flowCard}>
            {/* Subtle Ambient Corner Glows */}
            <Svg
              width={160}
              height={160}
              viewBox="0 0 160 160"
              style={styles.glowTopRight}
              pointerEvents="none"
            >
              <Defs>
                <RadialGradient id="glowPrimary" cx="50%" cy="50%" r="50%">
                  <Stop
                    offset="0%"
                    stopColor={COLORS.primaryContainer}
                    stopOpacity="0.12"
                  />
                  <Stop
                    offset="100%"
                    stopColor={COLORS.primaryContainer}
                    stopOpacity="0"
                  />
                </RadialGradient>
              </Defs>
              <Circle cx={80} cy={80} r={80} fill="url(#glowPrimary)" />
            </Svg>

            <Svg
              width={160}
              height={160}
              viewBox="0 0 160 160"
              style={styles.glowBottomLeft}
              pointerEvents="none"
            >
              <Defs>
                <RadialGradient id="glowSecondary" cx="50%" cy="50%" r="50%">
                  <Stop
                    offset="0%"
                    stopColor={COLORS.secondary}
                    stopOpacity="0.12"
                  />
                  <Stop
                    offset="100%"
                    stopColor={COLORS.secondary}
                    stopOpacity="0"
                  />
                </RadialGradient>
              </Defs>
              <Circle cx={80} cy={80} r={80} fill="url(#glowSecondary)" />
            </Svg>

            <Text style={styles.flowKicker}>SETTLEMENT TRANSFER</Text>

            <View style={styles.flowPeopleRow}>
              {/* Payer */}
              <View style={styles.personCol}>
                <View style={styles.avatarWrap}>
                  <View style={[styles.personAvatar, styles.payerAvatarBg]}>
                    <Text style={[styles.personInitial, styles.primaryText]}>
                      {payerName.charAt(0).toUpperCase()}
                    </Text>
                  </View>
                  <View style={styles.directionSubBadge}>
                    <Svg
                      width={12}
                      height={12}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke={COLORS.primary}
                      strokeWidth={2.4}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <Line x1={7} y1={17} x2={17} y2={7} />
                      <Polyline points="7 7 17 7 17 17" />
                    </Svg>
                  </View>
                </View>
                <Text style={styles.personName}>{payerName}</Text>
                <Text style={styles.personRole}>Payer</Text>
              </View>

              {/* Center Direction Indicator */}
              <View style={styles.centerFlowCol}>
                <View style={styles.arrowBadgeWrap}>
                  <View style={styles.arrowCircle}>
                    <Svg
                      width={20}
                      height={20}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke={COLORS.secondary}
                      strokeWidth={2.4}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <Line x1={5} y1={12} x2={19} y2={12} />
                      <Polyline points="13 6 19 12 13 18" />
                    </Svg>
                  </View>
                  {/* Animated Ping Dot */}
                  <View style={styles.pingContainer} pointerEvents="none">
                    <Animated.View
                      style={[
                        styles.pingRing,
                        {
                          opacity: pingOpacity,
                          transform: [{ scale: pingScale }],
                        },
                      ]}
                    />
                    <View style={styles.pingCore} />
                  </View>
                </View>
                <Text style={styles.directLabel}>Direct</Text>
              </View>

              {/* Payee */}
              <View style={styles.personCol}>
                <View style={styles.avatarWrap}>
                  <View style={[styles.personAvatar, styles.payeeAvatarBg]}>
                    <Text style={[styles.personInitial, styles.secondaryText]}>
                      {payeeName.charAt(0).toUpperCase()}
                    </Text>
                  </View>
                  <View style={styles.directionSubBadge}>
                    <Svg
                      width={12}
                      height={12}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke={COLORS.secondary}
                      strokeWidth={2.4}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <Line x1={17} y1={7} x2={7} y2={17} />
                      <Polyline points="17 17 7 17 7 7" />
                    </Svg>
                  </View>
                </View>
                <Text style={styles.personName}>{payeeName}</Text>
                <Text style={styles.personRole}>Payee</Text>
              </View>
            </View>

            {/* Footer Strip */}
            <View style={styles.flowFooterStrip}>
              <Svg
                width={16}
                height={16}
                viewBox="0 0 24 24"
                fill="none"
                stroke={COLORS.onSurfaceVariant}
                strokeWidth={1.9}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <Path d="m11 17 2 2a1 1 0 1 0 3-3" />
                <Path d="m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 1 1-3-3l2.81-2.81a5.79 5.79 0 0 1 7.06-.87l.47.28a2 2 0 0 0 1.42.25L21 4" />
                <Path d="m21 3 1 11h-2" />
                <Path d="M3 3 2 14l6.5 6.5a1 1 0 1 0 3-3" />
                <Path d="M3 4h8" />
              </Svg>
              <Text style={styles.flowFooterText}>
                {payerName} pays{' '}
                <Text style={styles.flowFooterStrong}>{payeeName}</Text> in full
              </Text>
            </View>
          </View>

          {/* Settlement Amount Input Card */}
          <View style={styles.amountCard}>
            <View style={styles.amountCardHeader}>
              <Text style={styles.amountKicker}>SETTLEMENT AMOUNT</Text>
              <Pressable
                onPress={focusAmountEditor}
                style={({ pressed }) => [
                  styles.customBtn,
                  pressed && styles.pressedOpacity,
                ]}
              >
                <Svg
                  width={13}
                  height={13}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={COLORS.primary}
                  strokeWidth={2.2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <Path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
                </Svg>
                <Text style={styles.customBtnText}>Custom</Text>
              </Pressable>
            </View>

            {/* Numeric Display / Editor */}
            <Pressable
              onPress={focusAmountEditor}
              style={styles.amountDisplayRow}
            >
              <Text style={styles.amountCurrency}>₹</Text>
              <TextInput
                ref={amountInputRef}
                style={styles.amountInput}
                value={amountInput}
                onChangeText={setAmountInput}
                keyboardType="numeric"
                selectionColor={COLORS.primary}
                onFocus={() => setIsEditingAmount(true)}
                onBlur={() => setIsEditingAmount(false)}
              />
              {!isEditingAmount && (
                <Animated.View
                  style={[styles.amountCursorBar, { opacity: cursorOpacity }]}
                />
              )}
            </Pressable>

            {/* Pill Status Tag */}
            <View style={styles.statusPill}>
              <View style={styles.statusCheckCircle}>
                <Svg
                  width={11}
                  height={11}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={COLORS.onSecondary}
                  strokeWidth={3}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <Polyline points="20 6 9 17 4 12" />
                </Svg>
              </View>
              <Text style={styles.statusPillText}>
                {isFullBalance
                  ? 'Full owed balance selected'
                  : 'Custom partial settlement'}
              </Text>
            </View>

            {/* Payment Mode Quick Selectors */}
            <View style={styles.modeGrid}>
              <Pressable
                onPress={() => setPaymentMode('upi')}
                style={({ pressed }) => [
                  styles.modeCard,
                  paymentMode === 'upi' && styles.modeCardPrimaryActive,
                  pressed && styles.pressedScale95,
                ]}
              >
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
                  <Path d="M3 7V5a2 2 0 0 1 2-2h2" />
                  <Path d="M17 3h2a2 2 0 0 1 2 2v2" />
                  <Path d="M21 17v2a2 2 0 0 1-2 2h-2" />
                  <Path d="M7 21H5a2 2 0 0 1-2-2v-2" />
                  <Rect x={7} y={7} width={3} height={3} />
                  <Rect x={14} y={7} width={3} height={3} />
                  <Rect x={7} y={14} width={3} height={3} />
                  <Path d="M14 14h3v3h-3z" />
                </Svg>
                <Text style={styles.modeLabel}>UPI App</Text>
              </Pressable>

              <Pressable
                onPress={() => setPaymentMode('cash')}
                style={({ pressed }) => [
                  styles.modeCard,
                  paymentMode === 'cash' && styles.modeCardSecondaryActive,
                  pressed && styles.pressedScale95,
                ]}
              >
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
                  <Rect x={2} y={6} width={20} height={12} rx={2} />
                  <Circle cx={12} cy={12} r={2.5} />
                  <Path d="M6 12h.01M18 12h.01" />
                </Svg>
                <Text style={styles.modeLabel}>Cash</Text>
              </Pressable>

              <Pressable
                onPress={() => setPaymentMode('netbanking')}
                style={({ pressed }) => [
                  styles.modeCard,
                  paymentMode === 'netbanking' && styles.modeCardTertiaryActive,
                  pressed && styles.pressedScale95,
                ]}
              >
                <Svg
                  width={20}
                  height={20}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={COLORS.tertiary}
                  strokeWidth={1.9}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <Path d="M3 21h18" />
                  <Path d="M3 10h18" />
                  <Path d="M5 6l7-3 7 3" />
                  <Path d="M6 10v8M10 10v8M14 10v8M18 10v8" />
                </Svg>
                <Text style={styles.modeLabel}>Net Banking</Text>
              </Pressable>
            </View>
          </View>

          {/* Informational Reassurance Note */}
          <View style={styles.reassuranceCard}>
            <View style={styles.reassuranceIconCircle}>
              <Svg width={18} height={18} viewBox="0 0 24 24">
                <Circle cx={12} cy={12} r={10} fill={COLORS.primary} />
                <Line
                  x1={12}
                  y1={16}
                  x2={12}
                  y2={11.5}
                  stroke={COLORS.surfaceContainerLowest}
                  strokeWidth={2.2}
                  strokeLinecap="round"
                />
                <Circle
                  cx={12}
                  cy={8}
                  r={1.2}
                  fill={COLORS.surfaceContainerLowest}
                />
              </Svg>
            </View>
            <Text style={styles.reassuranceText}>
              Recording this payment brings your balance to{' '}
              <Text style={styles.reassuranceStrong}>₹0</Text> without deleting
              any expense history.
            </Text>
          </View>

          {/* Ledger Summary Snapshot */}
          <View style={styles.ledgerCard}>
            <View style={styles.ledgerLeft}>
              <View style={styles.ledgerIconCircle}>
                <Svg
                  width={18}
                  height={18}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={COLORS.tertiary}
                  strokeWidth={1.9}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <Path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1-2-1z" />
                  <Line x1={8} y1={8} x2={16} y2={8} />
                  <Line x1={8} y1={12} x2={16} y2={12} />
                  <Line x1={8} y1={16} x2={12} y2={16} />
                </Svg>
              </View>
              <View>
                <Text style={styles.ledgerTitle}>Calculated Debts</Text>
                <Text style={styles.ledgerSubtitle}>
                  3 shared dinner/cab bills
                </Text>
              </View>
            </View>
            <Text style={styles.ledgerStatus}>Settled</Text>
          </View>

          {/* Bottom CTA Anchor */}
          <View style={styles.ctaSection}>
            <Pressable
              onPress={handleRecordPress}
              style={({ pressed }) => [
                styles.recordButton,
                recordStatus !== 'idle' && styles.pressedScale95,
                pressed && styles.pressedScale98,
              ]}
            >
              {recordStatus === 'recording' && (
                <>
                  <ActivityIndicator size="small" color={COLORS.onSecondary} />
                  <Text style={styles.recordButtonText}>Recording...</Text>
                </>
              )}

              {recordStatus === 'settled' && (
                <>
                  <Svg
                    width={22}
                    height={22}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke={COLORS.onSecondary}
                    strokeWidth={2.2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <Path d="M12 2l2.4 2.4 3.4-.5.5 3.4L20.7 9.7 19.3 12l1.4 2.3-2.4 2.4-.5 3.4-3.4-.5L12 22l-2.4-2.4-3.4.5-.5-3.4-2.4-2.4L4.7 12 3.3 9.7l2.4-2.4.5-3.4 3.4.5L12 2z" />
                    <Polyline points="9 12 11 14 15 10" />
                  </Svg>
                  <Text style={styles.recordButtonText}>Settled!</Text>
                </>
              )}

              {recordStatus === 'idle' && (
                <>
                  <Svg
                    width={22}
                    height={22}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke={COLORS.onSecondary}
                    strokeWidth={2.3}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <Circle cx={12} cy={12} r={10} />
                    <Polyline points="9 12 11.5 14.5 16 9.5" />
                  </Svg>
                  <Text style={styles.recordButtonText}>Record Settlement</Text>
                </>
              )}
            </Pressable>

            <Text style={styles.ctaCaption}>
              Splitzy Ledger • Instant sync enabled
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
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
    backgroundColor: COLORS.surfaceContainerLowest80,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  headerInner: {
    height: 64,
    paddingHorizontal: 20, // px-margin
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backBtnOffset: {
    marginLeft: -4,
  },
  headerTitle: {
    flexShrink: 1,
    fontFamily: FONTS.headlineSemiBold,
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '600',
    color: COLORS.onSurface,
  },
  headerAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Scroll Content
  scrollContent: {
    paddingHorizontal: 20, // px-margin
    gap: 16, // space-y-space-md
  },

  // Group Context Row
  contextRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
    paddingTop: 4,
  },
  groupChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 9999,
    backgroundColor: COLORS.surfaceContainerHigh,
  },
  groupDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.secondary,
  },
  groupChipText: {
    fontFamily: FONTS.labelSemiBold,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.36,
    fontWeight: '600',
    color: COLORS.onSurfaceVariant,
  },
  instantBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 9999,
    backgroundColor: COLORS.surfaceContainer,
  },
  instantBadgeText: {
    fontFamily: FONTS.labelSemiBold,
    fontSize: 10,
    lineHeight: 12,
    letterSpacing: 0.6,
    fontWeight: '600',
    color: COLORS.tertiary,
  },

  // Visual Settlement Flow Card
  flowCard: {
    borderRadius: 16, // rounded-2xl
    padding: 16, // p-space-md
    backgroundColor: COLORS.surfaceContainer,
    alignItems: 'center',
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 14,
    elevation: 6,
  },
  glowTopRight: {
    position: 'absolute',
    top: -52,
    right: -52,
  },
  glowBottomLeft: {
    position: 'absolute',
    bottom: -52,
    left: -52,
  },
  flowKicker: {
    fontFamily: FONTS.labelBold,
    fontSize: 10,
    lineHeight: 12,
    letterSpacing: 1.4,
    fontWeight: '700',
    color: COLORS.onSurfaceVariant,
    marginBottom: 16,
  },
  flowPeopleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    maxWidth: 320,
    gap: 16,
    marginVertical: 4,
  },
  personCol: {
    flex: 1,
    alignItems: 'center',
  },
  avatarWrap: {
    position: 'relative',
    marginBottom: 8,
  },
  personAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  payerAvatarBg: {
    backgroundColor: COLORS.primaryContainer20,
  },
  payeeAvatarBg: {
    backgroundColor: COLORS.secondary20,
  },
  personInitial: {
    fontFamily: FONTS.headlineBold,
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '700',
  },
  directionSubBadge: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: COLORS.surfaceContainerHighest,
    alignItems: 'center',
    justifyContent: 'center',
  },
  personName: {
    fontFamily: FONTS.labelSemiBold,
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '600',
    color: COLORS.onSurface,
  },
  personRole: {
    fontFamily: FONTS.labelBold,
    fontSize: 10,
    lineHeight: 12,
    letterSpacing: 0.4,
    fontWeight: '600',
    color: COLORS.onSurfaceVariant,
    marginTop: 2,
  },
  centerFlowCol: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  arrowBadgeWrap: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.secondary15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pingContainer: {
    position: 'absolute',
    top: -8,
    width: 10,
    height: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pingRing: {
    position: 'absolute',
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.secondary,
  },
  pingCore: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.secondary,
  },
  directLabel: {
    fontFamily: FONTS.labelSemiBold,
    fontSize: 10,
    lineHeight: 12,
    fontWeight: '600',
    color: COLORS.secondary,
    marginTop: 4,
  },
  flowFooterStrip: {
    marginTop: 16,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: COLORS.surfaceContainerLowest60,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  flowFooterText: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 12,
    lineHeight: 16,
    color: COLORS.onSurfaceVariant,
  },
  flowFooterStrong: {
    fontFamily: FONTS.bodySemiBold,
    fontWeight: '600',
    color: COLORS.onSurface,
  },

  // Settlement Amount Card
  amountCard: {
    borderRadius: 16, // rounded-2xl
    padding: 24, // p-space-lg
    backgroundColor: COLORS.surfaceContainer,
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 14,
    elevation: 6,
  },
  amountCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 8,
  },
  amountKicker: {
    fontFamily: FONTS.labelBold,
    fontSize: 10,
    lineHeight: 12,
    letterSpacing: 1.4,
    fontWeight: '600',
    color: COLORS.onSurfaceVariant,
  },
  customBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  customBtnText: {
    fontFamily: FONTS.labelSemiBold,
    fontSize: 10,
    lineHeight: 12,
    letterSpacing: 0.5,
    fontWeight: '600',
    color: COLORS.primary,
  },
  amountDisplayRow: {
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  amountCurrency: {
    fontFamily: FONTS.displayBold,
    fontSize: 32,
    lineHeight: 40,
    fontWeight: '700',
    color: COLORS.primary,
  },
  amountInput: {
    fontFamily: FONTS.displayBold,
    fontSize: 40,
    lineHeight: 48,
    letterSpacing: -1.2,
    fontWeight: '700',
    color: COLORS.onSurface,
    paddingVertical: 0,
    minWidth: 48,
    textAlign: 'center',
  },
  amountCursorBar: {
    width: 2,
    height: 32,
    borderRadius: 2,
    backgroundColor: COLORS.primary,
    marginLeft: 2,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 9999,
    backgroundColor: COLORS.secondaryContainer20,
    marginTop: 4,
  },
  statusCheckCircle: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: COLORS.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusPillText: {
    fontFamily: FONTS.labelSemiBold,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.3,
    fontWeight: '600',
    color: COLORS.secondary,
  },

  // Payment Mode Selectors
  modeGrid: {
    flexDirection: 'row',
    gap: 8,
    width: '100%',
    marginTop: 24,
    paddingTop: 8,
  },
  modeCard: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 6,
    borderRadius: 12,
    backgroundColor: COLORS.surfaceContainerHigh,
    borderWidth: 1,
    borderColor: 'transparent',
    gap: 6,
  },
  modeCardPrimaryActive: {
    borderColor: COLORS.primary,
  },
  modeCardSecondaryActive: {
    borderColor: COLORS.secondary,
  },
  modeCardTertiaryActive: {
    borderColor: COLORS.tertiary,
  },
  modeLabel: {
    fontFamily: FONTS.labelBold,
    fontSize: 10,
    lineHeight: 12,
    letterSpacing: 0.4,
    fontWeight: '700',
    color: COLORS.onSurface,
    textAlign: 'center',
  },

  // Reassurance Card
  reassuranceCard: {
    borderRadius: 16, // rounded-2xl
    padding: 16,
    backgroundColor: COLORS.surfaceContainerLow,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  reassuranceIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.surfaceContainerHighest,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  reassuranceText: {
    flex: 1,
    fontFamily: FONTS.bodyRegular,
    fontSize: 12,
    lineHeight: 19,
    color: COLORS.onSurfaceVariant,
  },
  reassuranceStrong: {
    fontFamily: FONTS.bodySemiBold,
    fontWeight: '600',
    color: COLORS.onSurface,
  },

  // Ledger Summary Card
  ledgerCard: {
    borderRadius: 16, // rounded-2xl
    padding: 16,
    backgroundColor: COLORS.surfaceContainerLow,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  ledgerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  ledgerIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.surfaceContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ledgerTitle: {
    fontFamily: FONTS.labelSemiBold,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '600',
    color: COLORS.onSurface,
  },
  ledgerSubtitle: {
    fontFamily: FONTS.labelBold,
    fontSize: 10,
    lineHeight: 14,
    fontWeight: '600',
    color: COLORS.onSurfaceVariant,
  },
  ledgerStatus: {
    fontFamily: FONTS.numericTable,
    fontSize: 16,
    lineHeight: 20,
    fontWeight: '700',
    color: COLORS.secondary,
  },

  // Bottom CTA
  ctaSection: {
    paddingTop: 8,
  },
  recordButton: {
    width: '100%',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 9999,
    backgroundColor: COLORS.secondary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    shadowColor: COLORS.secondary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.28,
    shadowRadius: 14,
    elevation: 6,
  },
  recordButtonText: {
    fontFamily: FONTS.headlineBold,
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '700',
    color: COLORS.onSecondary,
  },
  ctaCaption: {
    textAlign: 'center',
    fontFamily: FONTS.labelSemiBold,
    fontSize: 10,
    lineHeight: 14,
    letterSpacing: 0.4,
    color: COLORS.onSurfaceVariant,
    marginTop: 8,
  },

  // Color & Press Helpers
  primaryText: {
    color: COLORS.primary,
  },
  secondaryText: {
    color: COLORS.secondary,
  },
  pressedOpacity: {
    opacity: 0.72,
  },
  pressedScale95: {
    transform: [{ scale: 0.95 }],
  },
  pressedScale98: {
    transform: [{ scale: 0.98 }],
    opacity: 0.92,
  },
});