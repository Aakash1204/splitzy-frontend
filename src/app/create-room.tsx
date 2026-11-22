import { useMemo, useState } from 'react';
import {
  ActivityIndicator,
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
  surfaceContainerLowest80: 'rgba(14, 14, 19, 0.88)',
  surfaceContainer: '#1f1f24',
  surfaceContainerHigh: '#2a292f',
  surfaceContainerHighest: '#35343a',
  onSurface: '#e4e1e9',
  onSurfaceVariant: '#cac4d1',
  outline: '#938f9a',
  outline20: 'rgba(147, 143, 154, 0.2)',
  outline60: 'rgba(147, 143, 154, 0.6)',
  outline70: 'rgba(147, 143, 154, 0.7)',
  primary: '#dfd5ff',
  primary10: 'rgba(223, 213, 255, 0.1)',
  primary15: 'rgba(223, 213, 255, 0.15)',
  primary20: 'rgba(223, 213, 255, 0.2)',
  primaryContainer: '#c4b5fd',
  onPrimary: '#332664',
  secondary: '#62dcad',
  onSecondary: '#003827',
  skyBlue: '#93C5FD',
  butterYellow: '#FDE68A',
  softCoral: '#FDA4AF',
  mint: '#6EE7B7',
};

// Replace `undefined` with loaded font family names if using @expo-google-fonts
const FONTS = {
  headlineBold: undefined as string | undefined,
  headlineSemiBold: undefined as string | undefined,
  bodyRegular: undefined as string | undefined,
  bodySemiBold: undefined as string | undefined,
  labelSemiBold: undefined as string | undefined,
  labelBold: undefined as string | undefined,
};

export type RoomCategory =
  | 'trip'
  | 'home'
  | 'dining'
  | 'event'
  | 'office'
  | 'other';

interface CategoryOption {
  id: RoomCategory;
  label: string;
  color: string;
  badgeBg: string;
}

interface MemberOption {
  username: string;
  initials: string;
  fullName: string;
  color: string;
  badgeBg: string;
  chipBg: string;
}

const CATEGORIES: CategoryOption[] = [
  {
    id: 'trip',
    label: 'Trip',
    color: COLORS.skyBlue,
    badgeBg: 'rgba(147, 197, 253, 0.2)',
  },
  {
    id: 'home',
    label: 'Home',
    color: COLORS.butterYellow,
    badgeBg: 'rgba(253, 230, 138, 0.15)',
  },
  {
    id: 'dining',
    label: 'Dining',
    color: COLORS.softCoral,
    badgeBg: 'rgba(253, 164, 175, 0.15)',
  },
  {
    id: 'event',
    label: 'Event',
    color: COLORS.mint,
    badgeBg: 'rgba(110, 231, 183, 0.15)',
  },
  {
    id: 'office',
    label: 'Office',
    color: COLORS.primary,
    badgeBg: COLORS.primary20,
  },
  {
    id: 'other',
    label: 'Other',
    color: COLORS.outline,
    badgeBg: COLORS.outline20,
  },
];

const SUGGESTED_MEMBERS: MemberOption[] = [
  {
    username: 'amit_k',
    initials: 'AK',
    fullName: 'Amit Kumar',
    color: COLORS.mint,
    badgeBg: 'rgba(110, 231, 183, 0.15)',
    chipBg: 'rgba(110, 231, 183, 0.2)',
  },
  {
    username: 'rohan_m',
    initials: 'RM',
    fullName: 'Rohan Mehta',
    color: COLORS.skyBlue,
    badgeBg: 'rgba(147, 197, 253, 0.15)',
    chipBg: 'rgba(147, 197, 253, 0.2)',
  },
  {
    username: 'neha_s',
    initials: 'NS',
    fullName: 'Neha Sharma',
    color: COLORS.softCoral,
    badgeBg: 'rgba(253, 164, 175, 0.15)',
    chipBg: 'rgba(253, 164, 175, 0.2)',
  },
  {
    username: 'karan_p',
    initials: 'KP',
    fullName: 'Karan Patel',
    color: COLORS.butterYellow,
    badgeBg: 'rgba(253, 230, 138, 0.15)',
    chipBg: 'rgba(253, 230, 138, 0.2)',
  },
  {
    username: 'tanvi_v',
    initials: 'TV',
    fullName: 'Tanvi Verma',
    color: COLORS.primary,
    badgeBg: COLORS.primary20,
    chipBg: COLORS.primary20,
  },
];

interface CreateRoomScreenProps {
  onBack?: () => void;
  onMorePress?: () => void;
  onCreateRoom?: (payload: {
    roomName: string;
    category: RoomCategory;
    members: string[];
  }) => void;
}

export default function CreateRoomScreen({
  onBack,
  onMorePress,
  onCreateRoom,
}: CreateRoomScreenProps) {
  const insets = useSafeAreaInsets();

  const [roomName, setRoomName] = useState('Manali Backpackers 2025');
  const [selectedCategory, setSelectedCategory] = useState<RoomCategory>('trip');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [selectedUsernames, setSelectedUsernames] = useState<string[]>([
    'amit_k',
    'rohan_m',
    'neha_s',
  ]);
  const [submitState, setSubmitState] = useState<'idle' | 'loading' | 'created'>(
    'idle'
  );

  const headerHeight = 64 + insets.top;

  const selectedMembers = useMemo(
    () =>
      selectedUsernames
        .map((uname) => SUGGESTED_MEMBERS.find((m) => m.username === uname))
        .filter((m): m is MemberOption => Boolean(m)),
    [selectedUsernames]
  );

  const filteredMembers = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return SUGGESTED_MEMBERS;
    return SUGGESTED_MEMBERS.filter(
      (m) =>
        m.fullName.toLowerCase().includes(q) ||
        m.username.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const toggleMember = (username: string) => {
    setSelectedUsernames((prev) =>
      prev.includes(username)
        ? prev.filter((u) => u !== username)
        : [...prev, username]
    );
  };

  const removeMember = (username: string) => {
    setSelectedUsernames((prev) => prev.filter((u) => u !== username));
  };

  const handleCreateRoom = () => {
    if (submitState !== 'idle') return;
    setSubmitState('loading');
    setTimeout(() => {
      setSubmitState('created');
      onCreateRoom?.({
        roomName: roomName.trim(),
        category: selectedCategory,
        members: selectedUsernames,
      });
    }, 700);
  };

  const totalMembersCount = selectedUsernames.length + 1; // +1 for creator

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
              paddingTop: headerHeight + 12,
              paddingBottom: Math.max(insets.bottom, 24) + 32,
            },
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Room Name Card */}
          <View style={styles.roomNameCard}>
            <View style={styles.labelRow}>
              <Text style={styles.uppercaseLabel}>ROOM NAME</Text>
              <Text style={styles.requiredLabel}>Required</Text>
            </View>

            <View style={styles.roomInputBox}>
              <View style={styles.folderIconCircle}>
                <Svg
                  width={18}
                  height={18}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={COLORS.primary}
                  strokeWidth={1.9}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <Path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                  <Path d="M12 11l.9 1.8 2 .3-1.45 1.4.35 2-1.8-.95-1.8.95.35-2L9.1 13.1l2-.3L12 11z" />
                </Svg>
              </View>

              <TextInput
                style={styles.roomInput}
                value={roomName}
                onChangeText={setRoomName}
                placeholder="e.g., Manali Trip, Apartment Bills"
                placeholderTextColor={COLORS.outline60}
                selectionColor={COLORS.primary}
              />

              {roomName.length > 0 && (
                <Pressable
                  accessibilityLabel="Clear room name"
                  accessibilityRole="button"
                  onPress={() => setRoomName('')}
                  style={({ pressed }) => [
                    styles.clearBtn,
                    pressed && styles.pressedOpacity,
                  ]}
                >
                  <Svg
                    width={16}
                    height={16}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke={COLORS.outline}
                    strokeWidth={2.2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <Line x1={18} y1={6} x2={6} y2={18} />
                    <Line x1={6} y1={6} x2={18} y2={18} />
                  </Svg>
                </Pressable>
              )}
            </View>
          </View>

          {/* Category & Icon Selector */}
          <View style={styles.sectionBlock}>
            <View style={styles.sectionHeaderRow}>
              <View style={styles.flex}>
                <Text style={styles.sectionTitle}>Select Category</Text>
                <Text style={styles.sectionSubtitle}>
                  Sets the default icon for your shared room
                </Text>
              </View>
              <Text style={styles.customizableText}>Customizable</Text>
            </View>

            <View style={styles.categoryGrid}>
              {CATEGORIES.map((cat) => {
                const isSelected = selectedCategory === cat.id;
                return (
                  <Pressable
                    key={cat.id}
                    onPress={() => setSelectedCategory(cat.id)}
                    style={({ pressed }) => [
                      styles.categoryCard,
                      isSelected
                        ? styles.categoryCardSelected
                        : styles.categoryCardDefault,
                      pressed && styles.pressedScale95,
                    ]}
                  >
                    <View
                      style={[
                        styles.categoryIconCircle,
                        { backgroundColor: cat.badgeBg },
                      ]}
                    >
                      <CategoryIcon id={cat.id} color={cat.color} />
                    </View>
                    <Text
                      style={[
                        styles.categoryLabel,
                        isSelected && styles.categoryLabelSelected,
                      ]}
                    >
                      {cat.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* Add Members Section */}
          <View style={[styles.sectionBlock, styles.membersSection]}>
            <View style={styles.membersHeaderRow}>
              <View style={styles.membersTitleGroup}>
                <Text style={styles.sectionTitle}>Add Members</Text>
                <View style={styles.addedCountPill}>
                  <Text style={styles.addedCountText}>
                    {selectedUsernames.length} added
                  </Text>
                </View>
              </View>
              <Text style={styles.uppercaseLabel}>UNLIMITED</Text>
            </View>

            {/* Search Bar */}
            <View
              style={[
                styles.searchBar,
                searchFocused && styles.searchBarFocused,
              ]}
            >
              <Svg
                width={20}
                height={20}
                viewBox="0 0 24 24"
                fill="none"
                stroke={COLORS.outline}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <Circle cx={11} cy={11} r={8} />
                <Line x1={21} y1={21} x2={16.65} y2={16.65} />
              </Svg>
              <TextInput
                style={styles.searchInput}
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Search by username, name, or email..."
                placeholderTextColor={COLORS.outline70}
                autoCapitalize="none"
                autoCorrect={false}
                selectionColor={COLORS.primary}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
              />
            </View>

            {/* Selected Members Removable Chips */}
            {selectedMembers.length > 0 && (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.chipsScrollContent}
              >
                {selectedMembers.map((member) => (
                  <View key={member.username} style={styles.memberChip}>
                    <View
                      style={[
                        styles.chipAvatar,
                        { backgroundColor: member.chipBg },
                      ]}
                    >
                      <Text
                        style={[styles.chipAvatarText, { color: member.color }]}
                      >
                        {member.initials}
                      </Text>
                    </View>
                    <Text style={styles.chipHandle}>@{member.username}</Text>
                    <Pressable
                      accessibilityLabel={`Remove ${member.fullName}`}
                      accessibilityRole="button"
                      onPress={() => removeMember(member.username)}
                      style={({ pressed }) => [
                        styles.chipCloseBtn,
                        pressed && styles.pressedOpacity,
                      ]}
                    >
                      <Svg
                        width={14}
                        height={14}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke={COLORS.outline}
                        strokeWidth={2.2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <Line x1={18} y1={6} x2={6} y2={18} />
                        <Line x1={6} y1={6} x2={18} y2={18} />
                      </Svg>
                    </Pressable>
                  </View>
                ))}
              </ScrollView>
            )}

            {/* Suggested / Search Results Deck */}
            <View style={styles.resultsDeck}>
              {filteredMembers.map((member) => {
                const isAdded = selectedUsernames.includes(member.username);
                return (
                  <View key={member.username} style={styles.memberRow}>
                    <View style={styles.memberInfo}>
                      <View
                        style={[
                          styles.memberAvatar,
                          { backgroundColor: member.badgeBg },
                        ]}
                      >
                        <Text
                          style={[
                            styles.memberAvatarText,
                            { color: member.color },
                          ]}
                        >
                          {member.initials}
                        </Text>
                      </View>
                      <View style={styles.flex}>
                        <Text style={styles.memberName} numberOfLines={1}>
                          {member.fullName}
                        </Text>
                        <Text style={styles.memberHandle} numberOfLines={1}>
                          @{member.username}
                        </Text>
                      </View>
                    </View>

                    <Pressable
                      onPress={() => toggleMember(member.username)}
                      style={({ pressed }) => [
                        styles.memberToggleBtn,
                        isAdded
                          ? styles.memberToggleAdded
                          : styles.memberToggleAdd,
                        pressed && styles.pressedScale95,
                      ]}
                    >
                      {isAdded ? (
                        <>
                          <Text style={styles.memberToggleAddedText}>
                            Added
                          </Text>
                          <Svg
                            width={15}
                            height={15}
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke={COLORS.primary}
                            strokeWidth={2.4}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <Polyline points="20 6 9 17 4 12" />
                          </Svg>
                        </>
                      ) : (
                        <>
                          <Svg
                            width={15}
                            height={15}
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke={COLORS.primary}
                            strokeWidth={2.4}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <Line x1={12} y1={5} x2={12} y2={19} />
                            <Line x1={5} y1={12} x2={19} y2={12} />
                          </Svg>
                          <Text style={styles.memberToggleAddText}>Add</Text>
                        </>
                      )}
                    </Pressable>
                  </View>
                );
              })}

              {filteredMembers.length === 0 && (
                <Text style={styles.noResultsText}>
                  No matching members found
                </Text>
              )}
            </View>
          </View>

          {/* Bottom Launcher Module */}
          <View style={styles.launcherModule}>
            <Pressable
              onPress={handleCreateRoom}
              style={({ pressed }) => [
                styles.submitButton,
                submitState === 'created' && styles.submitButtonCreated,
                pressed && styles.pressedScale98,
              ]}
            >
              {submitState === 'loading' && (
                <>
                  <ActivityIndicator size="small" color={COLORS.onPrimary} />
                  <Text style={styles.submitButtonText}>
                    Setting up room...
                  </Text>
                </>
              )}

              {submitState === 'created' && (
                <>
                  <Svg
                    width={20}
                    height={20}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke={COLORS.onSecondary}
                    strokeWidth={2.2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <Circle cx={12} cy={12} r={10} />
                    <Polyline points="9 12 11.5 14.5 16 9.5" />
                  </Svg>
                  <Text
                    style={[
                      styles.submitButtonText,
                      styles.submitButtonTextCreated,
                    ]}
                  >
                    Room Created!
                  </Text>
                </>
              )}

              {submitState === 'idle' && (
                <>
                  <Text style={styles.submitButtonText}>
                    Create Room ({totalMembersCount} Members)
                  </Text>
                  <Svg
                    width={20}
                    height={20}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke={COLORS.onPrimary}
                    strokeWidth={2.2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <Line x1={5} y1={12} x2={19} y2={12} />
                    <Polyline points="12 5 19 12 12 19" />
                  </Svg>
                </>
              )}
            </Pressable>

            <Text style={styles.launcherNote}>
              All members will be notified and can start adding expenses
              immediately.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

/* ---------- Helper Category Icons ---------- */

function CategoryIcon({ id, color }: { id: RoomCategory; color: string }) {
  switch (id) {
    case 'trip':
      return (
        <Svg
          width={22}
          height={22}
          viewBox="0 0 24 24"
          fill="none"
          stroke={color}
          strokeWidth={1.9}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <Path d="M2 22h20" />
          <Path d="M6.36 17.4 4 17l-2-4 1.1-.55a2 2 0 0 1 1.8 0l.17.1a2 2 0 0 0 1.8 0L8 12 5 6l.9-.45a2 2 0 0 1 2.09.2l4.02 3a2 2 0 0 0 2.1.2l4.19-2.06a2.41 2.41 0 0 1 1.73-.17L21 7a1.4 1.4 0 0 1 .87 1.99l-.38.76c-.23.46-.6.84-1.07 1.08L7.58 17.2a2 2 0 0 1-1.22.18Z" />
        </Svg>
      );
    case 'home':
      return (
        <Svg
          width={22}
          height={22}
          viewBox="0 0 24 24"
          fill="none"
          stroke={color}
          strokeWidth={1.9}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <Path d="M3 10.5L12 3l9 7.5" />
          <Path d="M5 9.5V20a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9.5" />
          <Path d="M9 21v-6h6v6" />
        </Svg>
      );
    case 'dining':
      return (
        <Svg
          width={22}
          height={22}
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
    case 'event':
      return (
        <Svg
          width={22}
          height={22}
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
    case 'office':
      return (
        <Svg
          width={22}
          height={22}
          viewBox="0 0 24 24"
          fill="none"
          stroke={color}
          strokeWidth={1.9}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <Rect x={2} y={7} width={20} height={14} rx={2} />
          <Path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
        </Svg>
      );
    case 'other':
    default:
      return (
        <Svg
          width={22}
          height={22}
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
    gap: 16, // gap-space-md
  },

  // Room Name Card
  roomNameCard: {
    backgroundColor: COLORS.surfaceContainer,
    padding: 16, // p-4
    borderRadius: 20,
    gap: 8, // gap-space-sm
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  uppercaseLabel: {
    fontFamily: FONTS.labelBold,
    fontSize: 10,
    lineHeight: 12,
    letterSpacing: 0.6,
    fontWeight: '700',
    color: COLORS.outline,
  },
  requiredLabel: {
    fontFamily: FONTS.labelBold,
    fontSize: 10,
    lineHeight: 12,
    letterSpacing: 0.5,
    fontWeight: '700',
    color: COLORS.primary,
  },
  roomInputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: COLORS.surfaceContainerLowest,
    paddingHorizontal: 14, // px-3.5
    paddingVertical: 12, // py-3
    borderRadius: 12, // rounded-xl
  },
  folderIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.primary10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  roomInput: {
    flex: 1,
    fontFamily: FONTS.bodyRegular,
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.onSurface,
    paddingVertical: 0,
  },
  clearBtn: {
    padding: 4,
  },

  // Category Section
  sectionBlock: {
    gap: 8, // gap-space-sm
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
    gap: 8,
  },
  sectionTitle: {
    fontFamily: FONTS.headlineSemiBold,
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '600',
    color: COLORS.onSurface,
  },
  sectionSubtitle: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 12,
    lineHeight: 16,
    color: COLORS.onSurfaceVariant,
    marginTop: 2,
  },
  customizableText: {
    fontFamily: FONTS.labelSemiBold,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.36,
    fontWeight: '600',
    color: COLORS.secondary,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 10,
  },
  categoryCard: {
    width: '31.5%',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12, // p-3
    borderRadius: 18,
    gap: 6, // gap-1.5
  },
  categoryCardDefault: {
    backgroundColor: COLORS.surfaceContainer,
  },
  categoryCardSelected: {
    backgroundColor: COLORS.primary15,
    shadowColor: COLORS.primaryContainer,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.22,
    shadowRadius: 12,
    elevation: 4,
  },
  categoryIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryLabel: {
    fontFamily: FONTS.labelSemiBold,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.36,
    fontWeight: '600',
    color: COLORS.onSurfaceVariant,
  },
  categoryLabelSelected: {
    color: COLORS.primary,
  },

  // Add Members Section
  membersSection: {
    paddingTop: 4, // pt-1
  },
  membersHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  membersTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  addedCountPill: {
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 9999,
    backgroundColor: COLORS.primary15,
  },
  addedCountText: {
    fontFamily: FONTS.labelBold,
    fontSize: 10,
    lineHeight: 12,
    letterSpacing: 0.5,
    fontWeight: '700',
    color: COLORS.primary,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: COLORS.surfaceContainer,
    paddingHorizontal: 14, // px-3.5
    paddingVertical: 12, // py-3
    borderRadius: 12, // rounded-xl
  },
  searchBarFocused: {
    backgroundColor: COLORS.surfaceContainerHigh,
  },
  searchInput: {
    flex: 1,
    fontFamily: FONTS.bodyRegular,
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.onSurface,
    paddingVertical: 0,
  },

  // Removable Chips
  chipsScrollContent: {
    gap: 8,
    paddingVertical: 4,
  },
  memberChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 9999,
    backgroundColor: COLORS.surfaceContainer,
  },
  chipAvatar: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipAvatarText: {
    fontSize: 10,
    fontWeight: '700',
  },
  chipHandle: {
    fontFamily: FONTS.labelBold,
    fontSize: 10,
    lineHeight: 12,
    letterSpacing: 0.4,
    fontWeight: '700',
    color: COLORS.onSurface,
  },
  chipCloseBtn: {
    marginLeft: 2,
    padding: 2,
  },

  // Results Deck
  resultsDeck: {
    backgroundColor: COLORS.surfaceContainer,
    borderRadius: 20,
    padding: 8, // p-2
    gap: 4, // gap-1
  },
  memberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10, // p-2.5
    borderRadius: 12, // rounded-xl
    gap: 8,
  },
  memberInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12, // gap-3
  },
  memberAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  memberAvatarText: {
    fontFamily: FONTS.labelBold,
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '700',
  },
  memberName: {
    fontFamily: FONTS.bodySemiBold,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
    color: COLORS.onSurface,
  },
  memberHandle: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 12,
    lineHeight: 16,
    color: COLORS.outline,
  },
  memberToggleBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 9999,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  memberToggleAdded: {
    backgroundColor: COLORS.primary10,
  },
  memberToggleAdd: {
    backgroundColor: COLORS.surfaceContainerHighest,
  },
  memberToggleAddedText: {
    fontFamily: FONTS.labelSemiBold,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.36,
    fontWeight: '600',
    color: COLORS.primary,
  },
  memberToggleAddText: {
    fontFamily: FONTS.labelSemiBold,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.36,
    fontWeight: '600',
    color: COLORS.onSurface,
  },
  noResultsText: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 13,
    color: COLORS.outline,
    textAlign: 'center',
    paddingVertical: 16,
  },

  // Bottom Launcher
  launcherModule: {
    marginTop: 12, // mt-4
    paddingTop: 8, // pt-2
    gap: 10, // gap-2.5
  },
  submitButton: {
    width: '100%',
    paddingVertical: 16, // py-4
    paddingHorizontal: 24, // px-6
    borderRadius: 9999,
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: COLORS.primaryContainer,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 6,
  },
  submitButtonCreated: {
    backgroundColor: COLORS.secondary,
    shadowColor: COLORS.secondary,
  },
  submitButtonText: {
    fontFamily: FONTS.headlineSemiBold,
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '600',
    color: COLORS.onPrimary,
  },
  submitButtonTextCreated: {
    color: COLORS.onSecondary,
  },
  launcherNote: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 12,
    lineHeight: 16,
    color: COLORS.outline,
    textAlign: 'center',
    paddingHorizontal: 16,
  },

  // Press States
  pressedOpacity: {
    opacity: 0.72,
  },
  pressedScale95: {
    transform: [{ scale: 0.95 }],
  },
  pressedScale98: {
    transform: [{ scale: 0.98 }],
  },
});