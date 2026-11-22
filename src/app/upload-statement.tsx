import React, { useEffect, useRef, useState } from 'react';
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
  surfaceContainerHigh80: 'rgba(42, 41, 47, 0.8)',
  onSurface: '#e4e1e9',
  onSurfaceVariant: '#cac4d1',
  outline: '#938f9a',
  primary: '#dfd5ff',
  primaryContainer: '#c4b5fd',
  primaryContainer15: 'rgba(196, 181, 253, 0.15)',
  primaryContainer20: 'rgba(196, 181, 253, 0.2)',
  secondary: '#62dcad',
  secondary15: 'rgba(98, 220, 173, 0.15)',
  mintBorder: 'rgba(110, 231, 183, 0.28)',
  mintGlow: 'rgba(110, 231, 183, 0.35)',
  dashedBorder: '#3E3E55',
  cardBorder: '#262636',
  sky300: '#7dd3fc',
  sky300Tint: 'rgba(125, 211, 252, 0.15)',
  amber200: '#fde68a',
  amber200Tint: 'rgba(253, 230, 138, 0.15)',
};

// Replace `undefined` with loaded font family names if using @expo-google-fonts
const FONTS = {
  headlineBold: undefined as string | undefined,
  headlineSemiBold: undefined as string | undefined,
  numericTable: undefined as string | undefined,
  bodyRegular: undefined as string | undefined,
  labelSemiBold: undefined as string | undefined,
  labelBold: undefined as string | undefined,
};

export type BottomNavTab = 'dashboard' | 'split-with' | 'analytics' | 'ai-query';

interface UploadItem {
  id: string;
  fileName: string;
  meta: string;
  statusText: string;
  fileType: 'pdf' | 'image';
}

const RECENT_UPLOADS: UploadItem[] = [
  {
    id: 'hdfc-oct-2026',
    fileName: 'HDFC_Oct_2026.pdf',
    meta: 'Oct 24, 2026 • 2.4 MB',
    statusText: 'PII Redacted ✓ • 48 txns',
    fileType: 'pdf',
  },
  {
    id: 'sbi-sep-2026',
    fileName: 'SBI_Sep_2026.png',
    meta: 'Sep 28, 2026 • 1.1 MB',
    statusText: 'PII Redacted ✓ • 41 txns',
    fileType: 'image',
  },
];

interface BankStatementScreenProps {
  activeNavTab?: BottomNavTab;
  onNavTabPress?: (tab: BottomNavTab) => void;
  onBack?: () => void;
  onInfoPress?: () => void;
  onChooseFile?: () => void;
  onUploadItemPress?: (uploadId: string) => void;
}

export default function BankStatementScreen({
  activeNavTab: controlledNavTab,
  onNavTabPress,
  onBack,
  onInfoPress,
  onChooseFile,
  onUploadItemPress,
}: BankStatementScreenProps) {
  const insets = useSafeAreaInsets();
  const [internalNavTab, setInternalNavTab] = useState<BottomNavTab>('analytics');
  const [dropzoneHighlighted, setDropzoneHighlighted] = useState(false);
  const highlightTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const currentNavTab = controlledNavTab ?? internalNavTab;
  const headerHeight = 64 + insets.top;
  const navPaddingBottom = Math.max(insets.bottom, 12);
  const navHeight = 64 + navPaddingBottom;

  useEffect(() => {
    return () => {
      if (highlightTimerRef.current) {
        clearTimeout(highlightTimerRef.current);
      }
    };
  }, []);

  const handleNavSelect = (tab: BottomNavTab) => {
    setInternalNavTab(tab);
    onNavTabPress?.(tab);
  };

  const handlePickFile = () => {
    setDropzoneHighlighted(true);
    if (highlightTimerRef.current) {
      clearTimeout(highlightTimerRef.current);
    }
    highlightTimerRef.current = setTimeout(() => {
      setDropzoneHighlighted(false);
    }, 1200);
    onChooseFile?.();
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
            paddingBottom: navHeight + 28,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Privacy-First Trust Banner Card */}
        <View style={styles.privacyCard}>
          <View style={styles.privacyHeader}>
            <View style={styles.shieldIconCircle}>
              <Svg
                width={20}
                height={20}
                viewBox="0 0 24 24"
                fill="none"
                stroke={COLORS.secondary}
                strokeWidth={2.2}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <Path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <Path d="m9 12 2 2 4-4" />
              </Svg>
            </View>
            <View style={styles.flex}>
              <Text style={styles.privacyTitle}>Privacy-First Processing</Text>
              <Text style={styles.privacyTag}>ZERO-CLOUD EXPOSURE</Text>
            </View>
          </View>

          <Text style={styles.privacyBody}>
            Parsed on-device with automatic PII redaction. Account numbers, IFSC
            codes, and addresses are stripped before AI analysis.
          </Text>
        </View>

        {/* Dashed Upload Dropzone Card */}
        <Pressable
          onPress={handlePickFile}
          style={({ pressed }) => [
            styles.dropzone,
            dropzoneHighlighted && styles.dropzoneHighlighted,
            pressed && styles.pressedScale99,
          ]}
        >
          {/* Lavender Cloud Icon Badge */}
          <View style={styles.cloudBadge}>
            <Svg
              width={32}
              height={32}
              viewBox="0 0 24 24"
              fill="none"
              stroke={COLORS.primaryContainer}
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <Path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
              <Path d="M12 12v9" />
              <Path d="m16 16-4-4-4 4" />
            </Svg>
          </View>

          <Text style={styles.dropzoneTitle}>Upload Bank Statement</Text>
          <Text style={styles.dropzoneSubtitle}>
            Supports PDF or Image (PNG, JPG)
          </Text>

          {/* Pastel Lavender Pill CTA */}
          <Pressable
            onPress={handlePickFile}
            style={({ pressed }) => [
              styles.chooseFileBtn,
              pressed && styles.pressedScale95,
            ]}
          >
            <Svg
              width={16}
              height={16}
              viewBox="0 0 24 24"
              fill="none"
              stroke={COLORS.surfaceContainerLowest}
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <Path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48" />
            </Svg>
            <Text style={styles.chooseFileText}>Choose File</Text>
          </Pressable>

          <View style={styles.dropzoneHintRow}>
            <Svg
              width={14}
              height={14}
              viewBox="0 0 24 24"
              fill="none"
              stroke={COLORS.outline}
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <Circle cx={12} cy={12} r={10} />
              <Line x1={12} y1={16} x2={12} y2={12} />
              <Line x1={12} y1={8} x2={12.01} y2={8} />
            </Svg>
            <Text style={styles.dropzoneHintText}>
              Tap anywhere inside to browse local storage
            </Text>
          </View>
        </Pressable>

        {/* Recent Uploads & Status Section */}
        <View style={styles.recentSection}>
          <View style={styles.recentHeader}>
            <View style={styles.recentTitleRow}>
              <Text style={styles.recentHeading}>RECENT UPLOADS &amp; STATUS</Text>
              <View style={styles.countCircle}>
                <Text style={styles.countCircleText}>
                  {RECENT_UPLOADS.length}
                </Text>
              </View>
            </View>
            <Text style={styles.autoSyncedText}>Auto-Synced</Text>
          </View>

          {RECENT_UPLOADS.map((item) => (
            <Pressable
              key={item.id}
              onPress={() => onUploadItemPress?.(item.id)}
              style={({ pressed }) => [
                styles.uploadCard,
                pressed && styles.uploadCardPressed,
              ]}
            >
              <View style={styles.uploadLeft}>
                <FileTypeBadge fileType={item.fileType} />
                <View style={styles.uploadMetaCol}>
                  <Text style={styles.uploadFileName} numberOfLines={1}>
                    {item.fileName}
                  </Text>
                  <Text style={styles.uploadSubMeta} numberOfLines={1}>
                    {item.meta}
                  </Text>
                  <View style={styles.statusPillWrap}>
                    <View style={styles.statusPill}>
                      <Svg
                        width={12}
                        height={12}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke={COLORS.secondary}
                        strokeWidth={2.5}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <Polyline points="20 6 9 17 4 12" />
                      </Svg>
                      <Text style={styles.statusPillText}>
                        {item.statusText}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>

              <Pressable
                accessibilityLabel={`View parsed analytics for ${item.fileName}`}
                accessibilityRole="button"
                onPress={() => onUploadItemPress?.(item.id)}
                style={({ pressed }) => [
                  styles.uploadArrowBtn,
                  pressed && styles.uploadArrowBtnPressed,
                ]}
              >
                <Svg
                  width={20}
                  height={20}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={COLORS.primaryContainer}
                  strokeWidth={2.2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <Line x1={5} y1={12} x2={19} y2={12} />
                  <Polyline points="12 5 19 12 12 19" />
                </Svg>
              </Pressable>
            </Pressable>
          ))}
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

function FileTypeBadge({ fileType }: { fileType: UploadItem['fileType'] }) {
  if (fileType === 'pdf') {
    return (
      <View style={[styles.fileIconCircle, styles.skyBg]}>
        <Svg
          width={24}
          height={24}
          viewBox="0 0 24 24"
          fill="none"
          stroke={COLORS.sky300}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <Path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
          <Polyline points="14 2 14 8 20 8" />
          <Line x1={9} y1={13} x2={15} y2={13} />
          <Line x1={9} y1={17} x2={13} y2={17} />
        </Svg>
      </View>
    );
  }

  return (
    <View style={[styles.fileIconCircle, styles.amberBg]}>
      <Svg
        width={24}
        height={24}
        viewBox="0 0 24 24"
        fill="none"
        stroke={COLORS.amber200}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <Rect x={3} y={3} width={18} height={18} rx={2} ry={2} />
        <Circle cx={9} cy={9} r={2} />
        <Path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
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
    gap: 20, // gap-y-5
  },

  // Privacy Trust Banner
  privacyCard: {
    width: '100%',
    backgroundColor: COLORS.surfaceContainerLow90,
    borderRadius: 20,
    padding: 16, // p-4
    gap: 14, // gap-3.5
    borderWidth: 1,
    borderColor: COLORS.mintBorder,
    shadowColor: COLORS.secondary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 4,
  },
  privacyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  shieldIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.secondary15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  privacyTitle: {
    fontFamily: FONTS.headlineBold,
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '700',
    color: COLORS.onSurface,
  },
  privacyTag: {
    fontFamily: FONTS.labelSemiBold,
    fontSize: 10,
    lineHeight: 12,
    letterSpacing: 0.8,
    fontWeight: '600',
    color: COLORS.secondary,
    marginTop: 2,
  },
  privacyBody: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 14,
    lineHeight: 22,
    color: COLORS.outline,
  },

  // Dashed Upload Dropzone
  dropzone: {
    width: '100%',
    borderRadius: 24,
    backgroundColor: COLORS.surfaceContainerLow70,
    padding: 24, // p-6
    alignItems: 'center',
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: COLORS.dashedBorder,
  },
  dropzoneHighlighted: {
    borderColor: COLORS.secondary,
    shadowColor: COLORS.secondary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 18,
    elevation: 6,
  },
  cloudBadge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.primaryContainer15,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: COLORS.primaryContainer,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 4,
  },
  dropzoneTitle: {
    fontFamily: FONTS.headlineBold,
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '700',
    color: COLORS.onSurface,
    textAlign: 'center',
    marginBottom: 4,
  },
  dropzoneSubtitle: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.onSurfaceVariant,
    textAlign: 'center',
    marginBottom: 20,
  },
  chooseFileBtn: {
    height: 44,
    paddingHorizontal: 24,
    borderRadius: 9999,
    backgroundColor: COLORS.primaryContainer,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: COLORS.primaryContainer,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.28,
    shadowRadius: 14,
    elevation: 5,
  },
  chooseFileText: {
    fontFamily: FONTS.labelBold,
    fontSize: 14,
    lineHeight: 18,
    letterSpacing: 0.28,
    fontWeight: '700',
    color: COLORS.surfaceContainerLowest,
  },
  dropzoneHintRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 16,
  },
  dropzoneHintText: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.2,
    color: COLORS.outline,
  },

  // Recent Uploads Section
  recentSection: {
    gap: 12, // gap-3
    paddingTop: 4,
  },
  recentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  recentTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  recentHeading: {
    fontFamily: FONTS.labelSemiBold,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.8,
    fontWeight: '600',
    color: COLORS.outline,
  },
  countCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: COLORS.surfaceContainerHigh,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countCircleText: {
    fontFamily: FONTS.numericTable,
    fontSize: 10,
    lineHeight: 12,
    fontWeight: '700',
    color: COLORS.onSurfaceVariant,
  },
  autoSyncedText: {
    fontFamily: FONTS.labelSemiBold,
    fontSize: 10,
    lineHeight: 12,
    letterSpacing: 0.5,
    fontWeight: '600',
    color: COLORS.primaryContainer,
  },

  // Upload Cards
  uploadCard: {
    width: '100%',
    backgroundColor: COLORS.surfaceContainerLow,
    borderRadius: 20,
    padding: 14, // p-3.5
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  uploadCardPressed: {
    backgroundColor: COLORS.surfaceContainer,
  },
  uploadLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  fileIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  skyBg: {
    backgroundColor: COLORS.sky300Tint,
  },
  amberBg: {
    backgroundColor: COLORS.amber200Tint,
  },
  uploadMetaCol: {
    flex: 1,
  },
  uploadFileName: {
    fontFamily: FONTS.headlineSemiBold,
    fontSize: 16,
    lineHeight: 20,
    fontWeight: '600',
    color: COLORS.onSurface,
  },
  uploadSubMeta: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 12,
    lineHeight: 16,
    color: COLORS.outline,
    marginTop: 2,
  },
  statusPillWrap: {
    marginTop: 6,
    flexDirection: 'row',
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 9999,
    backgroundColor: COLORS.secondary15,
  },
  statusPillText: {
    fontFamily: FONTS.labelSemiBold,
    fontSize: 10,
    lineHeight: 12,
    letterSpacing: 0.4,
    fontWeight: '600',
    color: COLORS.secondary,
  },
  uploadArrowBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.surfaceContainerHigh80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadArrowBtnPressed: {
    backgroundColor: COLORS.primaryContainer20,
    transform: [{ scale: 0.95 }],
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

  // Press States
  pressedOpacity: {
    opacity: 0.72,
  },
  pressedScale95: {
    transform: [{ scale: 0.95 }],
  },
  pressedScale99: {
    transform: [{ scale: 0.99 }],
  },
});