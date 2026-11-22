import { useState } from 'react';
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
import Svg, { Circle, Line, Path, Polyline } from 'react-native-svg';

const COLORS = {
  surfaceContainerLowest: '#0e0e13',
  surfaceContainerLowest80: 'rgba(14, 14, 19, 0.88)',
  surfaceContainerLow: '#1b1b20',
  surfaceContainer: '#1f1f24',
  surfaceContainerHigh: '#2a292f',
  onSurface: '#e4e1e9',
  onSurfaceVariant: '#cac4d1',
  outline: '#938f9a',
  primary: '#dfd5ff',
  primary10: 'rgba(223, 213, 255, 0.1)',
  primary15: 'rgba(223, 213, 255, 0.15)',
  primaryContainer: '#c4b5fd',
  primaryContainer15: 'rgba(196, 181, 253, 0.15)',
  primaryContainer20: 'rgba(196, 181, 253, 0.2)',
  onPrimary: '#332664',
  onPrimaryContainer: '#514483',
  secondary: '#62dcad',
  secondaryContainer20: 'rgba(24, 164, 121, 0.2)',
  mint15: 'rgba(110, 231, 183, 0.15)',
  skyBlue: '#93C5FD',
  error: '#ffb4ab',
  errorContainer25: 'rgba(147, 0, 10, 0.25)',
};

// Replace `undefined` with loaded font family names if using @expo-google-fonts
const FONTS = {
  numericHero: undefined as string | undefined,
  numericTable: undefined as string | undefined,
  headlineSemiBold: undefined as string | undefined,
  headlineBold: undefined as string | undefined,
  bodyRegular: undefined as string | undefined,
  bodySemiBold: undefined as string | undefined,
  labelSemiBold: undefined as string | undefined,
  labelBold: undefined as string | undefined,
};

export type SplitMethod = 'equal' | 'exact' | 'percent' | 'shares';

const SPLIT_METHODS: { id: SplitMethod; label: string }[] = [
  { id: 'equal', label: 'Equal' },
  { id: 'exact', label: 'Exact ₹' },
  { id: 'percent', label: 'Percent %' },
  { id: 'shares', label: 'Shares' },
];

interface AddExpenseScreenProps {
  roomName?: string;
  onBack?: () => void;
  onClose?: () => void;
  onMorePress?: () => void;
  onPaidByPress?: () => void;
  onSave?: (payload: {
    title: string;
    totalAmount: number;
    splitMethod: SplitMethod;
    shares: { priya: number; amit: number };
  }) => void;
}

const parseAmount = (raw: string): number => {
  const cleaned = raw.replace(/[^0-9.]/g, '');
  const parsed = parseFloat(cleaned);
  return Number.isFinite(parsed) ? parsed : 0;
};

const formatINR = (amount: number): string => {
  return Math.round(amount).toLocaleString('en-IN');
};

export default function AddExpenseScreen({
  roomName = 'Goa Trip',
  onBack,
  onClose,
  onMorePress,
  onPaidByPress,
  onSave,
}: AddExpenseScreenProps) {
  const insets = useSafeAreaInsets();

  const [title, setTitle] = useState('Dinner at Thalassa');
  const [totalInput, setTotalInput] = useState('1,000');
  const [splitMethod, setSplitMethod] = useState<SplitMethod>('exact');
  const [priyaInput, setPriyaInput] = useState('600');
  const [amitInput, setAmitInput] = useState('400');

  const headerHeight = 64 + insets.top;

  const totalAmount = parseAmount(totalInput);
  const priyaShare = parseAmount(priyaInput);
  const amitShare = parseAmount(amitInput);
  const allocated = priyaShare + amitShare;
  const isBalanced = Math.abs(allocated - totalAmount) < 0.01;

  const handleSave = () => {
    onSave?.({
      title: title.trim(),
      totalAmount,
      splitMethod,
      shares: {
        priya: priyaShare,
        amit: amitShare,
      },
    });
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
              paddingTop: headerHeight + 4,
              paddingBottom: Math.max(insets.bottom, 24) + 32,
            },
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Context Row */}
          <View style={styles.contextRow}>
            <View style={styles.contextLeft}>
              <Pressable
                accessibilityLabel="Close"
                accessibilityRole="button"
                onPress={onClose ?? onBack}
                style={({ pressed }) => [
                  styles.closeCircleBtn,
                  pressed && styles.pressedScale95,
                ]}
              >
                <Svg
                  width={18}
                  height={18}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={COLORS.onSurface}
                  strokeWidth={2.2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <Line x1={18} y1={6} x2={6} y2={18} />
                  <Line x1={6} y1={6} x2={18} y2={18} />
                </Svg>
              </Pressable>
              <Text style={styles.screenTitle}>Add Expense</Text>
            </View>

            <View style={styles.roomPill}>
              <Svg
                width={15}
                height={15}
                viewBox="0 0 24 24"
                fill="none"
                stroke={COLORS.skyBlue}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <Path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.3c.4-.2.6-.6.5-1.1z" />
              </Svg>
              <Text style={styles.roomPillText}>{roomName}</Text>
            </View>
          </View>

          {/* Expense Title & Amount Hero Card */}
          <View style={styles.heroCard}>
            {/* Expense Title Input Well */}
            <View style={styles.fieldGroup}>
              <Text style={styles.uppercaseLabel}>EXPENSE TITLE</Text>
              <View style={styles.titleInputWell}>
                <View style={styles.receiptIconCircle}>
                  <Svg
                    width={16}
                    height={16}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke={COLORS.primary}
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
                <TextInput
                  style={styles.titleInput}
                  value={title}
                  onChangeText={setTitle}
                  placeholder="e.g. Dinner, Cab, Groceries"
                  placeholderTextColor={COLORS.outline}
                  selectionColor={COLORS.primary}
                />
              </View>
            </View>

            {/* Prominent Hero Amount Box */}
            <View style={styles.amountHeroBox}>
              <Text style={styles.amountHeroLabel}>TOTAL BILL AMOUNT</Text>
              <View style={styles.amountRow}>
                <Text style={styles.currencySymbol}>₹</Text>
                <TextInput
                  style={styles.amountInput}
                  value={totalInput}
                  onChangeText={setTotalInput}
                  keyboardType="numeric"
                  selectionColor={COLORS.primary}
                />
              </View>
            </View>

            {/* Paid By Pill Selector */}
            <Pressable
              onPress={onPaidByPress}
              style={({ pressed }) => [
                styles.paidByBtn,
                pressed && styles.paidByBtnPressed,
              ]}
            >
              <View style={styles.paidByLeft}>
                <View style={styles.payerIconCircle}>
                  <Svg
                    width={14}
                    height={14}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke={COLORS.primary}
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <Path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <Circle cx={12} cy={7} r={4} />
                  </Svg>
                </View>
                <Text style={styles.paidByText}>
                  Paid by <Text style={styles.paidByStrong}>You (Priya)</Text>
                </Text>
              </View>
              <Svg
                width={18}
                height={18}
                viewBox="0 0 24 24"
                fill="none"
                stroke={COLORS.onSurfaceVariant}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <Polyline points="6 9 12 15 18 9" />
              </Svg>
            </Pressable>
          </View>

          {/* Split Method Selector */}
          <View style={styles.splitMethodSection}>
            <View style={styles.splitMethodHeader}>
              <Text style={styles.uppercaseLabel}>SPLIT METHOD</Text>
              <Text style={styles.customSplitLabel}>
                {splitMethod === 'equal' ? 'Equal Split' : 'Custom Split'}
              </Text>
            </View>

            <View style={styles.segmentTrack}>
              {SPLIT_METHODS.map((method) => {
                const isSelected = splitMethod === method.id;
                return (
                  <Pressable
                    key={method.id}
                    accessibilityRole="tab"
                    accessibilityState={{ selected: isSelected }}
                    onPress={() => setSplitMethod(method.id)}
                    style={[
                      styles.segmentBtn,
                      isSelected && styles.segmentBtnActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.segmentBtnText,
                        isSelected && styles.segmentBtnTextActive,
                      ]}
                      numberOfLines={1}
                    >
                      {method.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* Participant Breakdown Card */}
          <View style={styles.breakdownCard}>
            <View style={styles.breakdownHeader}>
              <View style={styles.flex}>
                <Text style={styles.breakdownTitle}>Split Breakdown</Text>
                <Text style={styles.breakdownSubtitle}>
                  Assign exact amounts per member
                </Text>
              </View>
              <View style={styles.peopleCountPill}>
                <Text style={styles.peopleCountText}>2 People</Text>
              </View>
            </View>

            {/* Participants List */}
            <View style={styles.participantsList}>
              {/* Participant 1: You (Priya) */}
              <View style={styles.participantRow}>
                <View style={styles.participantLeft}>
                  <View
                    style={[
                      styles.participantAvatar,
                      styles.primaryContainer15Bg,
                    ]}
                  >
                    <Text
                      style={[
                        styles.participantAvatarText,
                        styles.primaryContainerText,
                      ]}
                    >
                      P
                    </Text>
                  </View>
                  <View style={styles.flex}>
                    <View style={styles.participantNameRow}>
                      <Text style={styles.participantName}>You (Priya)</Text>
                      <View style={styles.payerTag}>
                        <Text style={styles.payerTagText}>Payer</Text>
                      </View>
                    </View>
                    <Text style={styles.participantSubtext}>Your share</Text>
                  </View>
                </View>

                <View style={styles.shareInputBox}>
                  <Text style={[styles.shareCurrency, styles.primaryText]}>
                    ₹
                  </Text>
                  <TextInput
                    style={styles.shareInput}
                    value={priyaInput}
                    onChangeText={setPriyaInput}
                    keyboardType="numeric"
                    selectionColor={COLORS.primary}
                  />
                </View>
              </View>

              {/* Participant 2: Amit */}
              <View style={styles.participantRow}>
                <View style={styles.participantLeft}>
                  <View style={[styles.participantAvatar, styles.mint15Bg]}>
                    <Text
                      style={[
                        styles.participantAvatarText,
                        styles.secondaryText,
                      ]}
                    >
                      A
                    </Text>
                  </View>
                  <View style={styles.flex}>
                    <Text style={styles.participantName}>Amit</Text>
                    <Text style={styles.participantSubtext}>
                      Owes you ₹{formatINR(amitShare)}
                    </Text>
                  </View>
                </View>

                <View style={styles.shareInputBox}>
                  <Text style={[styles.shareCurrency, styles.secondaryText]}>
                    ₹
                  </Text>
                  <TextInput
                    style={styles.shareInput}
                    value={amitInput}
                    onChangeText={setAmitInput}
                    keyboardType="numeric"
                    selectionColor={COLORS.secondary}
                  />
                </View>
              </View>
            </View>

            {/* Validation & Info Footer */}
            <View style={styles.validationFooter}>
              <View
                style={[
                  styles.statusBanner,
                  isBalanced
                    ? styles.statusBannerBalanced
                    : styles.statusBannerUnbalanced,
                ]}
              >
                <View style={styles.statusBannerLeft}>
                  <Svg
                    width={18}
                    height={18}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke={isBalanced ? COLORS.secondary : COLORS.error}
                    strokeWidth={2.1}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <Circle cx={12} cy={12} r={10} />
                    {isBalanced ? (
                      <Polyline points="9 12 11.5 14.5 16 9.5" />
                    ) : (
                      <>
                        <Line x1={12} y1={8} x2={12} y2={12} />
                        <Line x1={12} y1={16} x2={12.01} y2={16} />
                      </>
                    )}
                  </Svg>
                  <Text
                    style={[
                      styles.statusAllocatedText,
                      isBalanced ? styles.secondaryText : styles.errorText,
                    ]}
                  >
                    ₹{formatINR(allocated)} of ₹{formatINR(totalAmount)}{' '}
                    allocated
                  </Text>
                </View>

                <Text
                  style={[
                    styles.statusRightLabel,
                    isBalanced ? styles.secondaryText : styles.errorText,
                  ]}
                >
                  {isBalanced ? 'BALANCED' : 'CHECK'}
                </Text>
              </View>

              <View style={styles.helperInsightRow}>
                <Svg
                  width={16}
                  height={16}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={COLORS.onSurfaceVariant}
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={styles.helperInfoIcon}
                >
                  <Circle cx={12} cy={12} r={10} />
                  <Line x1={12} y1={16} x2={12} y2={12} />
                  <Line x1={12} y1={8} x2={12.01} y2={8} />
                </Svg>
                <Text style={styles.helperInsightText}>
                  Only your ₹{formatINR(priyaShare)} share will be added to your
                  Monthly Expense.
                </Text>
              </View>
            </View>
          </View>

          {/* Bottom Save Button */}
          <View style={styles.saveWrapper}>
            <Pressable
              onPress={handleSave}
              style={({ pressed }) => [
                styles.saveButton,
                pressed && styles.pressedScale98,
              ]}
            >
              <Text style={styles.saveButtonText}>Save Expense</Text>
              <Svg
                width={20}
                height={20}
                viewBox="0 0 24 24"
                fill="none"
                stroke={COLORS.onPrimaryContainer}
                strokeWidth={2.3}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <Line x1={5} y1={12} x2={19} y2={12} />
                <Polyline points="12 5 19 12 12 19" />
              </Svg>
            </Pressable>
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

  // Scroll Layout
  scrollContent: {
    paddingHorizontal: 20, // px-margin
  },

  // Context Row
  contextRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 4,
    paddingBottom: 16,
  },
  contextLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  closeCircleBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.surfaceContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  screenTitle: {
    fontFamily: FONTS.headlineSemiBold,
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '600',
    color: COLORS.onSurface,
  },
  roomPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 9999,
    backgroundColor: COLORS.surfaceContainer,
  },
  roomPillText: {
    fontFamily: FONTS.labelSemiBold,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.36,
    fontWeight: '600',
    color: COLORS.onSurface,
  },

  // Hero Card
  heroCard: {
    backgroundColor: COLORS.surfaceContainer,
    borderRadius: 16, // rounded-2xl
    padding: 20, // p-5
    marginBottom: 20, // mb-5
    gap: 16, // gap-4
  },
  fieldGroup: {
    gap: 6,
  },
  uppercaseLabel: {
    fontFamily: FONTS.labelBold,
    fontSize: 10,
    lineHeight: 12,
    letterSpacing: 0.6,
    fontWeight: '700',
    color: COLORS.onSurfaceVariant,
  },
  titleInputWell: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: COLORS.surfaceContainerLowest,
  },
  receiptIconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.primary10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleInput: {
    flex: 1,
    fontFamily: FONTS.bodyRegular,
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.onSurface,
    paddingVertical: 0,
  },

  // Amount Hero Box
  amountHeroBox: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 8,
    backgroundColor: COLORS.surfaceContainerLow,
    borderRadius: 12,
  },
  amountHeroLabel: {
    fontFamily: FONTS.labelBold,
    fontSize: 10,
    lineHeight: 12,
    letterSpacing: 0.6,
    fontWeight: '700',
    color: COLORS.onSurfaceVariant,
    marginBottom: 4,
  },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
    gap: 4,
  },
  currencySymbol: {
    fontFamily: FONTS.numericHero,
    fontSize: 36,
    lineHeight: 44,
    fontWeight: '700',
    color: COLORS.primaryContainer,
  },
  amountInput: {
    fontFamily: FONTS.numericHero,
    fontSize: 36,
    lineHeight: 44,
    letterSpacing: -1.08,
    fontWeight: '700',
    color: COLORS.onSurface,
    minWidth: 72,
    textAlign: 'center',
    paddingVertical: 0,
  },

  // Paid By Selector
  paidByBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: COLORS.surfaceContainerLowest,
  },
  paidByBtnPressed: {
    backgroundColor: COLORS.surfaceContainerHigh,
    transform: [{ scale: 0.99 }],
  },
  paidByLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  payerIconCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.primary15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  paidByText: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.onSurface,
  },
  paidByStrong: {
    fontFamily: FONTS.bodySemiBold,
    fontWeight: '600',
    color: COLORS.primary,
  },

  // Split Method Selector
  splitMethodSection: {
    gap: 8,
    marginBottom: 20, // mb-5
  },
  splitMethodHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 2,
  },
  customSplitLabel: {
    fontFamily: FONTS.labelBold,
    fontSize: 10,
    lineHeight: 12,
    letterSpacing: 0.5,
    fontWeight: '700',
    color: COLORS.primary,
  },
  segmentTrack: {
    flexDirection: 'row',
    gap: 6,
    padding: 4,
    backgroundColor: COLORS.surfaceContainer,
    borderRadius: 12,
  },
  segmentBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
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
    fontWeight: '600',
    color: COLORS.onSurfaceVariant,
  },
  segmentBtnTextActive: {
    fontFamily: FONTS.labelBold,
    fontWeight: '700',
    color: COLORS.onPrimaryContainer,
  },

  // Breakdown Card
  breakdownCard: {
    backgroundColor: COLORS.surfaceContainer,
    borderRadius: 16, // rounded-2xl
    padding: 20, // p-5
    marginBottom: 24, // mb-6
    gap: 16, // gap-4
  },
  breakdownHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 8,
  },
  breakdownTitle: {
    fontFamily: FONTS.headlineSemiBold,
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '600',
    color: COLORS.onSurface,
  },
  breakdownSubtitle: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 12,
    lineHeight: 16,
    color: COLORS.onSurfaceVariant,
    marginTop: 2,
  },
  peopleCountPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 9999,
    backgroundColor: COLORS.surfaceContainerHigh,
  },
  peopleCountText: {
    fontFamily: FONTS.labelSemiBold,
    fontSize: 10,
    lineHeight: 12,
    letterSpacing: 0.5,
    fontWeight: '600',
    color: COLORS.primary,
  },

  // Participants
  participantsList: {
    gap: 10,
  },
  participantRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 12,
    backgroundColor: COLORS.surfaceContainerLowest,
    gap: 10,
  },
  participantLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  participantAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  participantAvatarText: {
    fontFamily: FONTS.headlineSemiBold,
    fontSize: 18,
    lineHeight: 22,
    fontWeight: '600',
  },
  participantNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  participantName: {
    fontFamily: FONTS.bodySemiBold,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
    color: COLORS.onSurface,
  },
  payerTag: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    backgroundColor: COLORS.primaryContainer20,
  },
  payerTagText: {
    fontFamily: FONTS.labelBold,
    fontSize: 10,
    lineHeight: 12,
    fontWeight: '700',
    color: COLORS.primaryContainer,
  },
  participantSubtext: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 12,
    lineHeight: 16,
    color: COLORS.onSurfaceVariant,
  },
  shareInputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: COLORS.surfaceContainerHigh,
  },
  shareCurrency: {
    fontFamily: FONTS.labelSemiBold,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '600',
  },
  shareInput: {
    width: 48,
    textAlign: 'right',
    fontFamily: FONTS.numericTable,
    fontSize: 16,
    lineHeight: 20,
    fontWeight: '700',
    color: COLORS.onSurface,
    paddingVertical: 0,
  },

  // Validation Footer
  validationFooter: {
    paddingTop: 8,
    gap: 8,
  },
  statusBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    gap: 8,
  },
  statusBannerBalanced: {
    backgroundColor: COLORS.secondaryContainer20,
  },
  statusBannerUnbalanced: {
    backgroundColor: COLORS.errorContainer25,
  },
  statusBannerLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusAllocatedText: {
    fontFamily: FONTS.labelSemiBold,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.3,
    fontWeight: '600',
  },
  statusRightLabel: {
    fontFamily: FONTS.labelBold,
    fontSize: 10,
    lineHeight: 12,
    letterSpacing: 0.6,
    fontWeight: '700',
  },
  helperInsightRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    paddingHorizontal: 4,
    paddingTop: 4,
  },
  helperInfoIcon: {
    marginTop: 2,
  },
  helperInsightText: {
    flex: 1,
    fontFamily: FONTS.bodyRegular,
    fontSize: 12,
    lineHeight: 18,
    color: COLORS.onSurfaceVariant,
  },

  // Save Button
  saveWrapper: {
    paddingTop: 4,
    paddingBottom: 8,
  },
  saveButton: {
    width: '100%',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 9999,
    backgroundColor: COLORS.primaryContainer,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  saveButtonText: {
    fontFamily: FONTS.headlineBold,
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '700',
    color: COLORS.onPrimaryContainer,
  },

  // Color & Press Helpers
  primaryText: {
    color: COLORS.primary,
  },
  primaryContainerText: {
    color: COLORS.primaryContainer,
  },
  secondaryText: {
    color: COLORS.secondary,
  },
  errorText: {
    color: COLORS.error,
  },
  primaryContainer15Bg: {
    backgroundColor: COLORS.primaryContainer15,
  },
  mint15Bg: {
    backgroundColor: COLORS.mint15,
  },
  pressedScale95: {
    transform: [{ scale: 0.95 }],
  },
  pressedScale98: {
    transform: [{ scale: 0.98 }],
    opacity: 0.92,
  },
});