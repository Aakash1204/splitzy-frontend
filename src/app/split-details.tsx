import { useEffect, useRef, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, Line, Path, Polyline, Rect } from 'react-native-svg';

const COLORS = {
  surfaceContainerLowest: '#0e0e13',
  surfaceContainerLowest80: 'rgba(14, 14, 19, 0.88)',
  surfaceContainer: '#1f1f24',
  surfaceContainerHigh: '#2a292f',
  surfaceContainerHighest: '#35343a',
  onSurface: '#e4e1e9',
  onSurfaceVariant: '#cac4d1',
  primary: '#dfd5ff',
  primary15: 'rgba(223, 213, 255, 0.15)',
  primaryContainer: '#c4b5fd',
  onPrimary: '#332664',
  onPrimaryFixed: '#1e0e4e',
  secondary: '#62dcad',
  secondary10: 'rgba(98, 220, 173, 0.1)',
  secondary15: 'rgba(98, 220, 173, 0.15)',
  tertiary: '#ffced3',
  tertiary15: 'rgba(255, 206, 211, 0.15)',
  error: '#ffb4ab',
};

// Replace `undefined` with loaded font family names if using @expo-google-fonts
const FONTS = {
  headlineSemiBold: undefined as string | undefined,
  numericTable: undefined as string | undefined,
  bodyRegular: undefined as string | undefined,
  bodySemiBold: undefined as string | undefined,
  labelSemiBold: undefined as string | undefined,
  labelBold: undefined as string | undefined,
};

interface ExpenseFeedItem {
  id: string;
  kind: 'expense';
  title: string;
  subtitle: string;
  amountText: string;
  direction: 'lent' | 'owed';
  icon: 'receipt' | 'car' | 'cafe';
  editable?: boolean;
}

interface SettlementFeedItem {
  id: string;
  kind: 'settlement';
  text: string;
  date: string;
}

type FeedItem = ExpenseFeedItem | SettlementFeedItem;

const ROOM_FEED: FeedItem[] = [
  {
    id: 'exp-1',
    kind: 'expense',
    title: 'Beach Shack Dinner',
    subtitle: 'Paid by You • ₹2,000 • Split Equally',
    amountText: '+₹1,500 lent',
    direction: 'lent',
    icon: 'receipt',
    editable: true,
  },
  {
    id: 'exp-2',
    kind: 'expense',
    title: 'Airport Cab',
    subtitle: 'Paid by Amit • ₹1,200 • Exact Split',
    amountText: '-₹300 owed',
    direction: 'owed',
    icon: 'car',
  },
  {
    id: 'set-1',
    kind: 'settlement',
    text: 'Amit paid Priya ₹450 • Settled',
    date: 'Oct 14',
  },
  {
    id: 'exp-3',
    kind: 'expense',
    title: 'Morning Snacks',
    subtitle: 'Paid by Rohan • ₹600 • By Shares',
    amountText: '-₹150 owed',
    direction: 'owed',
    icon: 'cafe',
  },
];

interface RoomDetailScreenProps {
  onBack?: () => void;
  onMorePress?: () => void;
  onAddExpense?: () => void;
  onSettleUp?: () => void;
  onEditExpense?: (expenseId: string) => void;
  onDeleteExpense?: (expenseId: string) => void;
}

export default function RoomDetailScreen({
  onBack,
  onMorePress,
  onAddExpense,
  onSettleUp,
  onEditExpense,
  onDeleteExpense,
}: RoomDetailScreenProps) {
  const insets = useSafeAreaInsets();
  const [showArchiveToast, setShowArchiveToast] = useState(false);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const headerHeight = 64 + insets.top;

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) {
        clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

  const handleLockedArchivePress = () => {
    setShowArchiveToast(true);
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
    }
    toastTimerRef.current = setTimeout(() => {
      setShowArchiveToast(false);
    }, 2800);
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
      <ScrollView
        style={styles.flex}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: headerHeight + 12,
            paddingBottom: Math.max(insets.bottom, 24) + 32,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Room Summary Header Card */}
        <View style={styles.roomCard}>
          <View style={styles.roomCardLeft}>
            <View style={styles.roomFlightIcon}>
              <Svg
                width={22}
                height={22}
                viewBox="0 0 24 24"
                fill="none"
                stroke={COLORS.primary}
                strokeWidth={1.9}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <Path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.3c.4-.2.6-.6.5-1.1z" />
              </Svg>
            </View>
            <View style={styles.flex}>
              <Text style={styles.roomTitle} numberOfLines={1}>
                Goa Trip
              </Text>
              <Text style={styles.roomMembersCount}>4 members</Text>
            </View>
          </View>

          <Pressable
            accessibilityLabel="Archive room (locked)"
            accessibilityRole="button"
            onPress={handleLockedArchivePress}
            style={({ pressed }) => [
              styles.archiveLockedBtn,
              pressed && styles.pressedScale95,
            ]}
          >
            <Svg
              width={18}
              height={18}
              viewBox="0 0 24 24"
              fill="none"
              stroke={COLORS.onSurfaceVariant}
              strokeWidth={1.9}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <Polyline points="21 8 21 21 3 21 3 8" />
              <Rect x={1} y={3} width={22} height={5} rx={1} />
              <Line x1={10} y1={12} x2={14} y2={12} />
            </Svg>
            <Svg
              width={14}
              height={14}
              viewBox="0 0 24 24"
              fill="none"
              stroke={COLORS.onSurfaceVariant}
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <Rect x={3} y={11} width={18} height={11} rx={2} ry={2} />
              <Path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </Svg>
          </Pressable>
        </View>

        {/* Locked Archive Toast Banner */}
        {showArchiveToast && (
          <View style={styles.archiveToast}>
            <Svg
              width={18}
              height={18}
              viewBox="0 0 24 24"
              fill="none"
              stroke={COLORS.primary}
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <Circle cx={12} cy={12} r={10} />
              <Line x1={12} y1={16} x2={12} y2={12} />
              <Line x1={12} y1={8} x2={12.01} y2={8} />
            </Svg>
            <Text style={styles.archiveToastText}>
              Settle all balances to ₹0 to archive this room.
            </Text>
          </View>
        )}

        {/* Net Position & Actions Card */}
        <View style={styles.netPositionCard}>
          <View style={styles.netPositionHeader}>
            <Text style={styles.uppercaseLabel}>YOUR NET POSITION</Text>
            <Text style={styles.netPositionAmount}>You are owed ₹1,500</Text>
          </View>

          <View style={styles.actionRow}>
            <Pressable
              onPress={onAddExpense}
              style={({ pressed }) => [
                styles.addExpenseBtn,
                pressed && styles.pressedScale95,
              ]}
            >
              <Svg
                width={18}
                height={18}
                viewBox="0 0 24 24"
                fill="none"
                stroke={COLORS.onPrimaryFixed}
                strokeWidth={2.4}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <Line x1={12} y1={5} x2={12} y2={19} />
                <Line x1={5} y1={12} x2={19} y2={12} />
              </Svg>
              <Text style={styles.addExpenseText}>Add Expense</Text>
            </Pressable>

            <Pressable
              onPress={onSettleUp}
              style={({ pressed }) => [
                styles.settleUpBtn,
                pressed && styles.pressedScale95,
              ]}
            >
              <Svg
                width={18}
                height={18}
                viewBox="0 0 24 24"
                fill="none"
                stroke={COLORS.secondary}
                strokeWidth={2.1}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <Circle cx={12} cy={12} r={10} />
                <Polyline points="9 12 11.5 14.5 16 9.5" />
              </Svg>
              <Text style={styles.settleUpText}>Settle Up</Text>
            </Pressable>
          </View>
        </View>

        {/* Expenses & Settlements Feed */}
        <View style={styles.feedSection}>
          <View style={styles.feedHeader}>
            <Text style={styles.uppercaseLabel}>EXPENSES &amp; SETTLEMENTS</Text>
            <Text style={styles.feedMonthLabel}>Oct 2024</Text>
          </View>

          {ROOM_FEED.map((item) => {
            if (item.kind === 'settlement') {
              return (
                <View key={item.id} style={styles.settlementRow}>
                  <View style={styles.settlementLeft}>
                    <Svg width={18} height={18} viewBox="0 0 24 24">
                      <Circle cx={12} cy={12} r={10} fill={COLORS.secondary} />
                      <Polyline
                        points="8.5 12.2 11 14.7 15.8 9.7"
                        fill="none"
                        stroke={COLORS.surfaceContainerLowest}
                        strokeWidth={2.3}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </Svg>
                    <Text style={styles.settlementText} numberOfLines={1}>
                      {item.text}
                    </Text>
                  </View>
                  <Text style={styles.settlementDate}>{item.date}</Text>
                </View>
              );
            }

            return (
              <View key={item.id} style={styles.expenseCard}>
                <View style={styles.expenseLeft}>
                  <ExpenseIconBadge type={item.icon} />
                  <View style={styles.flex}>
                    <Text style={styles.expenseTitle} numberOfLines={1}>
                      {item.title}
                    </Text>
                    <Text style={styles.expenseSubtitle} numberOfLines={1}>
                      {item.subtitle}
                    </Text>
                  </View>
                </View>

                <View style={styles.expenseRight}>
                  <Text
                    style={[
                      styles.expenseAmount,
                      item.direction === 'lent'
                        ? styles.secondaryText
                        : styles.tertiaryText,
                    ]}
                  >
                    {item.amountText}
                  </Text>

                  {item.editable && (
                    <View style={styles.expenseActions}>
                      <Pressable
                        accessibilityLabel="Edit expense"
                        accessibilityRole="button"
                        onPress={() => onEditExpense?.(item.id)}
                        style={({ pressed }) => [
                          styles.miniActionBtn,
                          pressed && styles.pressedScale90,
                        ]}
                      >
                        <Svg
                          width={14}
                          height={14}
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke={COLORS.onSurfaceVariant}
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <Path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
                        </Svg>
                      </Pressable>

                      <Pressable
                        accessibilityLabel="Delete expense"
                        accessibilityRole="button"
                        onPress={() => onDeleteExpense?.(item.id)}
                        style={({ pressed }) => [
                          styles.miniActionBtn,
                          pressed && styles.pressedScale90,
                        ]}
                      >
                        <Svg
                          width={14}
                          height={14}
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke={COLORS.onSurfaceVariant}
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <Polyline points="3 6 5 6 21 6" />
                          <Path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                          <Path d="M10 11v6M14 11v6" />
                          <Path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                        </Svg>
                      </Pressable>
                    </View>
                  )}
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

/* ---------- Helper Icon Badge ---------- */

function ExpenseIconBadge({ type }: { type: ExpenseFeedItem['icon'] }) {
  if (type === 'receipt') {
    return (
      <View style={[styles.expenseIconCircle, styles.primary15Bg]}>
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
          <Path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1-2-1z" />
          <Line x1={8} y1={8} x2={16} y2={8} />
          <Line x1={8} y1={12} x2={16} y2={12} />
          <Line x1={8} y1={16} x2={12} y2={16} />
        </Svg>
      </View>
    );
  }

  if (type === 'car') {
    return (
      <View style={[styles.expenseIconCircle, styles.secondary15Bg]}>
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
          <Path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9L18 10l-2-4H8L6 10l-2.5 1.1C2.7 11.3 2 12.1 2 13v3c0 .6.4 1 1 1h2" />
          <Circle cx={7} cy={17} r={2} />
          <Path d="M9 17h6" />
          <Circle cx={17} cy={17} r={2} />
        </Svg>
      </View>
    );
  }

  return (
    <View style={[styles.expenseIconCircle, styles.tertiary15Bg]}>
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
        <Path d="M17 8h1a4 4 0 1 1 0 8h-1" />
        <Path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z" />
        <Line x1={6} y1={2} x2={6} y2={4} />
        <Line x1={10} y1={2} x2={10} y2={4} />
        <Line x1={14} y1={2} x2={14} y2={4} />
      </Svg>
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

  // Main Content
  scrollContent: {
    paddingHorizontal: 20, // px-margin
    gap: 16, // gap-4
  },

  // Room Summary Card
  roomCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.surfaceContainer,
    borderRadius: 12, // rounded-xl
    padding: 16, // p-4
    gap: 12,
  },
  roomCardLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  roomFlightIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.primary15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  roomTitle: {
    fontFamily: FONTS.headlineSemiBold,
    fontSize: 22,
    lineHeight: 28,
    letterSpacing: -0.22,
    fontWeight: '600',
    color: COLORS.onSurface,
  },
  roomMembersCount: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 12,
    lineHeight: 16,
    color: COLORS.onSurfaceVariant,
  },
  archiveLockedBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 9999,
    backgroundColor: COLORS.surfaceContainerHigh,
    opacity: 0.45,
  },

  // Archive Toast
  archiveToast: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: COLORS.surfaceContainerHighest,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.28,
    shadowRadius: 8,
    elevation: 5,
  },
  archiveToastText: {
    flex: 1,
    fontFamily: FONTS.bodyRegular,
    fontSize: 12,
    lineHeight: 16,
    color: COLORS.onSurface,
  },

  // Net Position Card
  netPositionCard: {
    backgroundColor: COLORS.surfaceContainer,
    borderRadius: 12, // rounded-xl
    padding: 20, // p-5
    gap: 16, // gap-4
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.24,
    shadowRadius: 10,
    elevation: 5,
  },
  netPositionHeader: {
    gap: 4,
  },
  uppercaseLabel: {
    fontFamily: FONTS.labelBold,
    fontSize: 10,
    lineHeight: 12,
    letterSpacing: 0.6,
    fontWeight: '700',
    color: COLORS.onSurfaceVariant,
  },
  netPositionAmount: {
    fontFamily: FONTS.headlineSemiBold,
    fontSize: 22,
    lineHeight: 28,
    letterSpacing: -0.22,
    fontWeight: '600',
    color: COLORS.secondary,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12, // gap-3
  },
  addExpenseBtn: {
    flex: 1,
    backgroundColor: COLORS.primaryContainer,
    borderRadius: 9999,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  addExpenseText: {
    fontFamily: FONTS.labelSemiBold,
    fontSize: 14,
    lineHeight: 18,
    letterSpacing: 0.28,
    fontWeight: '600',
    color: COLORS.onPrimaryFixed,
  },
  settleUpBtn: {
    flex: 1,
    backgroundColor: COLORS.secondary15,
    borderRadius: 9999,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  settleUpText: {
    fontFamily: FONTS.labelSemiBold,
    fontSize: 14,
    lineHeight: 18,
    letterSpacing: 0.28,
    fontWeight: '600',
    color: COLORS.secondary,
  },

  // Expenses & Settlements Feed
  feedSection: {
    gap: 10, // gap-2.5
  },
  feedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  feedMonthLabel: {
    fontFamily: FONTS.labelBold,
    fontSize: 10,
    lineHeight: 12,
    letterSpacing: 0.5,
    fontWeight: '700',
    color: COLORS.onSurfaceVariant,
  },
  expenseCard: {
    backgroundColor: COLORS.surfaceContainer,
    borderRadius: 12, // rounded-xl
    padding: 16, // p-4
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  expenseLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  expenseIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  expenseTitle: {
    fontFamily: FONTS.bodySemiBold,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
    color: COLORS.onSurface,
  },
  expenseSubtitle: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 12,
    lineHeight: 16,
    color: COLORS.onSurfaceVariant,
  },
  expenseRight: {
    alignItems: 'flex-end',
    gap: 6,
    flexShrink: 0,
  },
  expenseAmount: {
    fontFamily: FONTS.numericTable,
    fontSize: 16,
    lineHeight: 20,
    letterSpacing: -0.16,
    fontWeight: '600',
  },
  expenseActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  miniActionBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.surfaceContainerHigh,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Settlement Row
  settlementRow: {
    backgroundColor: COLORS.secondary10,
    borderRadius: 12, // rounded-xl
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  settlementLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  settlementText: {
    flex: 1,
    fontFamily: FONTS.bodySemiBold,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '600',
    color: COLORS.secondary,
  },
  settlementDate: {
    fontFamily: FONTS.labelBold,
    fontSize: 10,
    lineHeight: 12,
    letterSpacing: 0.5,
    fontWeight: '700',
    color: COLORS.onSurfaceVariant,
  },

  // Color & Press Helpers
  primary15Bg: {
    backgroundColor: COLORS.primary15,
  },
  secondary15Bg: {
    backgroundColor: COLORS.secondary15,
  },
  tertiary15Bg: {
    backgroundColor: COLORS.tertiary15,
  },
  secondaryText: {
    color: COLORS.secondary,
  },
  tertiaryText: {
    color: COLORS.tertiary,
  },
  pressedScale95: {
    transform: [{ scale: 0.95 }],
  },
  pressedScale90: {
    transform: [{ scale: 0.9 }],
  },
});