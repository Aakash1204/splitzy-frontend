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
import Svg, { Circle, Line, Path, Polyline, Rect } from 'react-native-svg';

const COLORS = {
  surfaceContainerLowest: '#0e0e13',
  surfaceContainerLowest85: 'rgba(14, 14, 19, 0.9)',
  surfaceContainerLow: '#1b1b20',
  surfaceContainerLow70: 'rgba(27, 27, 32, 0.7)',
  surfaceContainerLow90: 'rgba(27, 27, 32, 0.94)',
  surfaceContainer: '#1f1f24',
  surfaceContainerHigh: '#2a292f',
  surfaceContainerHigh60: 'rgba(42, 41, 47, 0.6)',
  surfaceVariant: '#35343a',
  onSurface: '#e4e1e9',
  onSurfaceVariant: '#cac4d1',
  primary: '#dfd5ff',
  primaryContainer: '#c4b5fd',
  primaryContainer15: 'rgba(196, 181, 253, 0.15)',
  onPrimaryContainer: '#514483',
  onPrimaryFixed: '#1e0e4e',
  onPrimaryFixed15: 'rgba(30, 14, 78, 0.15)',
  skyBlue: '#93c5fd',
  skyBlue15: 'rgba(147, 197, 253, 0.15)',
  butterYellow: '#fde68a',
  butterYellow15: 'rgba(253, 230, 138, 0.15)',
  softCoral: '#fda4af',
  softCoral15: 'rgba(253, 164, 175, 0.15)',
  mint: '#6ee7b7',
  mint15: 'rgba(110, 231, 183, 0.15)',
};

// Replace `undefined` with loaded font family names if using @expo-google-fonts
const FONTS = {
  headlineBold: undefined as string | undefined,
  headlineSemiBold: undefined as string | undefined,
  bodyRegular: undefined as string | undefined,
  labelSemiBold: undefined as string | undefined,
  labelBold: undefined as string | undefined,
};

export type BottomNavTab = 'dashboard' | 'split-with' | 'analytics' | 'ai-query';
type RoomFilterTab = 'active' | 'archived';

interface SplitRoom {
  id: string;
  name: string;
  meta: string;
  badgeText: string;
  status: 'owed' | 'owe' | 'settled';
  icon: 'plane' | 'home' | 'utensils';
  canArchive?: boolean;
}

const INITIAL_ROOMS: SplitRoom[] = [
  {
    id: 'goa-trip',
    name: 'Goa Trip',
    meta: '4 members • Active',
    badgeText: 'You are owed ₹1,500',
    status: 'owed',
    icon: 'plane',
  },
  {
    id: 'flatmates-402',
    name: 'Flatmates 402',
    meta: '3 members • Monthly',
    badgeText: 'You owe ₹800',
    status: 'owe',
    icon: 'home',
  },
  {
    id: 'friday-dinner',
    name: 'Friday Dinner',
    meta: '2 members • Settled',
    badgeText: 'Settled ₹0',
    status: 'settled',
    icon: 'utensils',
    canArchive: true,
  },
];

interface SplitWithScreenProps {
  activeNavTab?: BottomNavTab;
  onNavTabPress?: (tab: BottomNavTab) => void;
  onNotificationsPress?: () => void;
  onProfilePress?: () => void;
  onNewRoomPress?: () => void;
  onRoomPress?: (roomId: string) => void;
  onArchiveRoom?: (roomId: string) => void;
}

export default function SplitWithScreen({
  activeNavTab: controlledNavTab,
  onNavTabPress,
  onNotificationsPress,
  onProfilePress,
  onNewRoomPress,
  onRoomPress,
  onArchiveRoom,
}: SplitWithScreenProps) {
  const insets = useSafeAreaInsets();
  const [internalNavTab, setInternalNavTab] = useState<BottomNavTab>('split-with');
  const [selectedSegment, setSelectedSegment] = useState<RoomFilterTab>('active');
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
            paddingBottom: navHeight + 32,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Page Title & CTA */}
        <View style={styles.titleRow}>
          <View style={styles.titleMeta}>
            <Text style={styles.pageTitle}>Split With</Text>
            <Text style={styles.pageSubtitle}>
              Track &amp; manage shared expenses
            </Text>
          </View>

          <Pressable
            accessibilityLabel="Create New Room"
            accessibilityRole="button"
            onPress={onNewRoomPress}
            style={({ pressed }) => [
              styles.newRoomBtn,
              pressed && styles.pressedScale95,
            ]}
          >
            <Svg
              width={16}
              height={16}
              viewBox="0 0 24 24"
              fill="none"
              stroke={COLORS.onPrimaryFixed}
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <Line x1={12} y1={5} x2={12} y2={19} />
              <Line x1={5} y1={12} x2={19} y2={12} />
            </Svg>
            <Text style={styles.newRoomBtnText}>+ New Room</Text>
          </Pressable>
        </View>

        {/* Segmented Toggle Tabs */}
        <View style={styles.segmentContainer}>
          <Pressable
            accessibilityRole="tab"
            accessibilityState={{ selected: selectedSegment === 'active' }}
            onPress={() => setSelectedSegment('active')}
            style={[
              styles.segmentTab,
              selectedSegment === 'active' && styles.segmentTabActive,
            ]}
          >
            <Text
              style={[
                styles.segmentTabText,
                selectedSegment === 'active' && styles.segmentTabTextActive,
              ]}
            >
              Active Rooms
            </Text>
            <View
              style={[
                styles.segmentCountBadge,
                selectedSegment === 'active'
                  ? styles.segmentCountBadgeActive
                  : styles.segmentCountBadgeInactive,
              ]}
            >
              <Text
                style={[
                  styles.segmentCountText,
                  selectedSegment === 'active'
                    ? styles.segmentCountTextActive
                    : styles.segmentCountTextInactive,
                ]}
              >
                {INITIAL_ROOMS.length}
              </Text>
            </View>
          </Pressable>

          <Pressable
            accessibilityRole="tab"
            accessibilityState={{ selected: selectedSegment === 'archived' }}
            onPress={() => setSelectedSegment('archived')}
            style={[
              styles.segmentTab,
              selectedSegment === 'archived' && styles.segmentTabActive,
            ]}
          >
            <Text
              style={[
                styles.segmentTabText,
                selectedSegment === 'archived' && styles.segmentTabTextActive,
              ]}
            >
              Archived
            </Text>
            <View
              style={[
                styles.segmentCountBadge,
                selectedSegment === 'archived'
                  ? styles.segmentCountBadgeActive
                  : styles.segmentCountBadgeInactive,
              ]}
            >
              <Text
                style={[
                  styles.segmentCountText,
                  selectedSegment === 'archived'
                    ? styles.segmentCountTextActive
                    : styles.segmentCountTextInactive,
                ]}
              >
                0
              </Text>
            </View>
          </Pressable>
        </View>

        {/* Room Cards List */}
        {selectedSegment === 'active' ? (
          <View style={styles.roomList}>
            {INITIAL_ROOMS.map((room) => (
              <Pressable
                key={room.id}
                onPress={() => onRoomPress?.(room.id)}
                style={({ pressed }) => [
                  styles.roomCard,
                  pressed && styles.roomCardPressed,
                ]}
              >
                <View style={styles.roomLeft}>
                  <RoomCategoryBadge type={room.icon} />
                  <View style={styles.roomTextCol}>
                    <Text style={styles.roomName} numberOfLines={1}>
                      {room.name}
                    </Text>
                    <View style={styles.roomMetaRow}>
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
                        <Path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                        <Circle cx={9} cy={7} r={4} />
                        <Path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                        <Path d="M16 3.13a4 4 0 0 1 0 7.75" />
                      </Svg>
                      <Text style={styles.roomMetaText} numberOfLines={1}>
                        {room.meta}
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={styles.roomRight}>
                  <View
                    style={[
                      styles.balancePill,
                      room.status === 'owe' ? styles.coralBg : styles.mintBg,
                    ]}
                  >
                    <Text
                      style={[
                        styles.balancePillText,
                        room.status === 'owe'
                          ? styles.coralText
                          : styles.mintText,
                      ]}
                    >
                      {room.badgeText}
                    </Text>
                  </View>

                  {room.canArchive && (
                    <Pressable
                      accessibilityLabel="Archive Room"
                      accessibilityRole="button"
                      onPress={() => onArchiveRoom?.(room.id)}
                      style={({ pressed }) => [
                        styles.archiveBtn,
                        pressed && styles.archiveBtnPressed,
                      ]}
                    >
                      <Svg
                        width={12}
                        height={12}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke={COLORS.primary}
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <Polyline points="21 8 21 21 3 21 3 8" />
                        <Rect x={1} y={3} width={22} height={5} rx={1} />
                        <Line x1={10} y1={12} x2={14} y2={12} />
                      </Svg>
                      <Text style={styles.archiveBtnText}>Archive</Text>
                    </Pressable>
                  )}
                </View>
              </Pressable>
            ))}
          </View>
        ) : (
          <View style={styles.emptyArchivedBox}>
            <Text style={styles.emptyArchivedTitle}>No archived rooms yet</Text>
            <Text style={styles.emptyArchivedSub}>
              Settled rooms you archive will appear here for reference.
            </Text>
          </View>
        )}

        {/* Subtle Info / Helper Note Banner */}
        <View style={styles.infoBanner}>
          <View style={styles.infoIconCircle}>
            <Svg
              width={14}
              height={14}
              viewBox="0 0 24 24"
              fill="none"
              stroke={COLORS.skyBlue}
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <Circle cx={12} cy={12} r={10} />
              <Line x1={12} y1={16} x2={12} y2={12} />
              <Line x1={12} y1={8} x2={12.01} y2={8} />
            </Svg>
          </View>
          <Text style={styles.infoBannerText}>
            Archived rooms are read-only once all member balances hit ₹0.
            Settled rooms can be safely moved to archive anytime.
          </Text>
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

function RoomCategoryBadge({ type }: { type: SplitRoom['icon'] }) {
  if (type === 'plane') {
    return (
      <View style={[styles.roomIconBox, styles.skyBlueBg]}>
        <Svg
          width={24}
          height={24}
          viewBox="0 0 24 24"
          fill="none"
          stroke={COLORS.skyBlue}
          strokeWidth={1.8}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <Path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.3c.4-.2.6-.6.5-1.1z" />
        </Svg>
      </View>
    );
  }

  if (type === 'home') {
    return (
      <View style={[styles.roomIconBox, styles.butterYellowBg]}>
        <Svg
          width={24}
          height={24}
          viewBox="0 0 24 24"
          fill="none"
          stroke={COLORS.butterYellow}
          strokeWidth={1.8}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <Path d="M3 10.5 12 3l9 7.5" />
          <Path d="M5 9v11a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9" />
          <Path d="M10 21v-7a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v7" />
        </Svg>
      </View>
    );
  }

  return (
    <View style={[styles.roomIconBox, styles.coralBg]}>
      <Svg
        width={24}
        height={24}
        viewBox="0 0 24 24"
        fill="none"
        stroke={COLORS.softCoral}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <Path d="M18 2v6a3 3 0 0 1-3 3 3 3 0 0 1-3-3V2" />
        <Path d="M15 2v19" />
        <Path d="M5 2v5a3 3 0 0 0 3 3h0a3 3 0 0 0 3-3V2" />
        <Path d="M8 10v11" />
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
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
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

  // Main Content
  scrollContent: {
    paddingHorizontal: 20, // px-margin
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 20, // mb-5
  },
  titleMeta: {
    flex: 1,
  },
  pageTitle: {
    fontFamily: FONTS.headlineBold,
    fontSize: 22,
    lineHeight: 28,
    letterSpacing: -0.22,
    fontWeight: '700',
    color: COLORS.onSurface,
  },
  pageSubtitle: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 12,
    lineHeight: 16,
    color: COLORS.onSurfaceVariant,
    marginTop: 2,
  },
  newRoomBtn: {
    backgroundColor: COLORS.primaryContainer,
    borderRadius: 9999,
    paddingHorizontal: 16, // px-4
    paddingVertical: 8, // py-2
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6, // gap-1.5
    shadowColor: COLORS.primaryContainer,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 5,
  },
  newRoomBtnText: {
    fontFamily: FONTS.labelBold,
    fontSize: 14,
    lineHeight: 18,
    letterSpacing: 0.28,
    fontWeight: '700',
    color: COLORS.onPrimaryFixed,
  },

  // Segmented Tabs
  segmentContainer: {
    borderRadius: 16, // rounded-2xl
    backgroundColor: COLORS.surfaceContainer,
    padding: 6, // p-1.5
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8, // gap-2
    marginBottom: 20, // mb-5
  },
  segmentTab: {
    flex: 1,
    borderRadius: 12, // rounded-xl
    paddingHorizontal: 12,
    paddingVertical: 10, // py-2.5
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  segmentTabActive: {
    backgroundColor: COLORS.primaryContainer,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 4,
    elevation: 2,
  },
  segmentTabText: {
    fontFamily: FONTS.labelSemiBold,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.36,
    fontWeight: '600',
    color: COLORS.onSurfaceVariant,
  },
  segmentTabTextActive: {
    fontFamily: FONTS.labelBold,
    fontWeight: '700',
    color: COLORS.onPrimaryFixed,
  },
  segmentCountBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentCountBadgeActive: {
    backgroundColor: COLORS.onPrimaryFixed15,
  },
  segmentCountBadgeInactive: {
    backgroundColor: COLORS.surfaceContainerHigh,
  },
  segmentCountText: {
    fontSize: 11,
    lineHeight: 13,
  },
  segmentCountTextActive: {
    fontWeight: '700',
    color: COLORS.onPrimaryFixed,
  },
  segmentCountTextInactive: {
    fontWeight: '600',
    color: COLORS.onSurfaceVariant,
  },

  // Room Cards
  roomList: {
    gap: 8, // gap-space-sm
    marginBottom: 20, // mb-5
  },
  roomCard: {
    backgroundColor: COLORS.surfaceContainerLow,
    borderRadius: 16, // rounded-2xl
    padding: 16, // p-4
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  roomCardPressed: {
    backgroundColor: COLORS.surfaceContainerHigh60,
  },
  roomLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14, // gap-3.5
  },
  roomIconBox: {
    width: 48,
    height: 48,
    borderRadius: 16, // rounded-2xl
    alignItems: 'center',
    justifyContent: 'center',
  },
  roomTextCol: {
    flex: 1,
  },
  roomName: {
    fontFamily: FONTS.headlineBold,
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '700',
    color: COLORS.onSurface,
  },
  roomMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  roomMetaText: {
    flex: 1,
    fontFamily: FONTS.bodyRegular,
    fontSize: 12,
    lineHeight: 16,
    color: COLORS.onSurfaceVariant,
  },
  roomRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexShrink: 0,
  },
  balancePill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 9999,
  },
  balancePillText: {
    fontFamily: FONTS.labelSemiBold,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.24,
    fontWeight: '600',
  },
  archiveBtn: {
    backgroundColor: COLORS.surfaceContainerHigh,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 9999,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  archiveBtnPressed: {
    backgroundColor: COLORS.surfaceVariant,
    transform: [{ scale: 0.95 }],
  },
  archiveBtnText: {
    fontFamily: FONTS.labelSemiBold,
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '600',
    color: COLORS.primary,
  },

  // Empty Archived State
  emptyArchivedBox: {
    backgroundColor: COLORS.surfaceContainerLow,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 20,
  },
  emptyArchivedTitle: {
    fontFamily: FONTS.headlineSemiBold,
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '600',
    color: COLORS.onSurface,
  },
  emptyArchivedSub: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 12,
    lineHeight: 18,
    color: COLORS.onSurfaceVariant,
    textAlign: 'center',
    marginTop: 4,
  },

  // Info Banner
  infoBanner: {
    borderRadius: 12, // rounded-xl
    padding: 14, // p-3.5
    backgroundColor: COLORS.surfaceContainerLow70,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10, // gap-2.5
  },
  infoIconCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: COLORS.skyBlue15,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  infoBannerText: {
    flex: 1,
    fontFamily: FONTS.bodyRegular,
    fontSize: 12,
    lineHeight: 19,
    color: COLORS.onSurfaceVariant,
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
    width: 32,
    height: 28,
    borderRadius: 9999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navIconWrapActive: {
    backgroundColor: COLORS.primaryContainer15,
    shadowColor: COLORS.primaryContainer,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 4,
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
  skyBlueBg: {
    backgroundColor: COLORS.skyBlue15,
  },
  butterYellowBg: {
    backgroundColor: COLORS.butterYellow15,
  },
  coralBg: {
    backgroundColor: COLORS.softCoral15,
  },
  coralText: {
    color: COLORS.softCoral,
  },
  mintBg: {
    backgroundColor: COLORS.mint15,
  },
  mintText: {
    color: COLORS.mint,
  },
  pressedOpacity: {
    opacity: 0.72,
  },
  pressedScale95: {
    transform: [{ scale: 0.95 }],
  },
});