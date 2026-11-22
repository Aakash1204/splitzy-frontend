import { useMemo, useState } from 'react';
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
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle, Line, Path, Polyline, Rect } from 'react-native-svg';

const COLORS = {
  surfaceContainerLowest: '#0e0e13',
  surfaceContainerLow: '#1b1b20',
  surfaceContainer: '#1f1f24',
  surfaceContainerHighest: '#35343a',
  surfaceVariant: '#35343a',
  onSurface: '#e4e1e9',
  onSurfaceVariant: '#cac4d1',
  outline: '#938f9a',
  primaryContainer: '#c4b5fd',
  primaryContainer15: 'rgba(196, 181, 253, 0.15)',
  onPrimaryFixed: '#1e0e4e',
  secondary: '#62dcad',
  secondaryContainer: '#18a479',
  secondaryContainer15: 'rgba(24, 164, 121, 0.15)',
  onSecondaryContainer: '#003121',
  tertiary: '#ffced3',
  error: '#ffb4ab',
  errorContainer20: 'rgba(147, 0, 10, 0.2)',
};

// Replace `undefined` with loaded font family names if using @expo-google-fonts
const FONTS = {
  headlineSemiBold: undefined as string | undefined,
  bodyRegular: undefined as string | undefined,
  labelSemiBold: undefined as string | undefined,
  labelBold: undefined as string | undefined,
};

type FocusedField = 'old' | 'new' | 'confirm' | null;

interface SetNewPasswordScreenProps {
  onBack?: () => void;
  onForgotOldPassword?: () => void;
  onUpdatePassword?: (payload: {
    oldPassword: string;
    newPassword: string;
    signOutOtherDevices: boolean;
  }) => void;
  onCancel?: () => void;
}

export default function SetNewPasswordScreen({
  onBack,
  onForgotOldPassword,
  onUpdatePassword,
  onCancel,
}: SetNewPasswordScreenProps) {
  const [oldPassword, setOldPassword] = useState('SuperSecret2024!');
  const [newPassword, setNewPassword] = useState('Splitzy#Vault2025');
  const [confirmPassword, setConfirmPassword] = useState('Splitzy#Vault2025');

  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);

  const [focusedField, setFocusedField] = useState<FocusedField>(null);
  const [signOutOtherDevices, setSignOutOtherDevices] = useState(true);

  const checks = useMemo(() => {
    const hasMinLength = newPassword.length >= 8;
    const hasNumber = /\d/.test(newPassword);
    const hasSpecial = /[^A-Za-z0-9]/.test(newPassword);
    const isExtraLong = newPassword.length >= 18;
    const score =
      (hasMinLength ? 1 : 0) +
      (hasNumber ? 1 : 0) +
      (hasSpecial ? 1 : 0) +
      (isExtraLong ? 1 : 0);

    let label = 'Weak Password';
    if (score >= 4) label = 'Very Strong';
    else if (score === 3) label = 'Strong Password';
    else if (score === 2) label = 'Fair Password';

    return { hasMinLength, hasNumber, hasSpecial, score, label };
  }, [newPassword]);

  const passwordsMatch =
    confirmPassword.length > 0 && newPassword === confirmPassword;
  const passwordsMismatch =
    confirmPassword.length > 0 && newPassword !== confirmPassword;

  const handleUpdate = () => {
    onUpdatePassword?.({
      oldPassword,
      newPassword,
      signOutOtherDevices,
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Top Bar Navigation */}
          <View style={styles.topBar}>
            <Pressable
              accessibilityLabel="Go back"
              accessibilityRole="button"
              onPress={onBack}
              style={({ pressed }) => [
                styles.backBtn,
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
                <Line x1={19} y1={12} x2={5} y2={12} />
                <Polyline points="12 19 5 12 12 5" />
              </Svg>
            </Pressable>

            <View style={styles.vaultBadge}>
              <Svg
                width={16}
                height={16}
                viewBox="0 0 24 24"
                fill="none"
                stroke={COLORS.primaryContainer}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <Path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <Polyline points="9 12 11 14 15 10" />
              </Svg>
              <Text style={styles.vaultBadgeText}>Security Vault</Text>
            </View>
          </View>

          {/* Hero Header Section */}
          <View style={styles.heroSection}>
            <View style={styles.heroIconWrap}>
              <View style={styles.heroIconCircle}>
                <Svg
                  width={28}
                  height={28}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={COLORS.primaryContainer}
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <Path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
                  <Path d="M3 3v5h5" />
                  <Rect
                    x={9}
                    y={11}
                    width={6}
                    height={5}
                    rx={1}
                    fill={COLORS.primaryContainer}
                  />
                  <Path d="M10.5 11V9.5a1.5 1.5 0 0 1 3 0V11" />
                </Svg>
              </View>

              <View style={styles.heroSubBadge}>
                <Svg width={13} height={13} viewBox="0 0 24 24">
                  <Path
                    d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3z"
                    fill={COLORS.onSecondaryContainer}
                  />
                </Svg>
              </View>
            </View>

            <Text style={styles.heroTitle}>Set New Password</Text>
            <Text style={styles.heroSubtitle}>
              Safeguard your communal splits, shared ledgers, and verified
              payment rails.
            </Text>
          </View>

          {/* Form Fields Card Deck */}
          <View style={styles.formDeck}>
            {/* Field 1: Old Password */}
            <View style={styles.fieldCard}>
              <View style={styles.fieldHeaderRow}>
                <View style={styles.fieldLabelGroup}>
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
                    <Circle cx={7.5} cy={15.5} r={4.5} />
                    <Path d="m21 2-9.6 9.6" />
                    <Path d="m15.5 7.5 3 3L22 7l-3-3" />
                  </Svg>
                  <Text style={styles.fieldLabel}>
                    Old Password <Text style={styles.requiredStar}>*</Text>
                  </Text>
                </View>

                <Pressable
                  onPress={onForgotOldPassword}
                  style={({ pressed }) => [pressed && styles.pressedOpacity]}
                >
                  <Text style={styles.forgotLink}>Forgot old password?</Text>
                </Pressable>
              </View>

              <View
                style={[
                  styles.inputWell,
                  focusedField === 'old' && styles.inputWellFocused,
                ]}
              >
                <TextInput
                  style={styles.textInput}
                  value={oldPassword}
                  onChangeText={setOldPassword}
                  placeholder="Enter current password"
                  placeholderTextColor={COLORS.outline}
                  secureTextEntry={!showOld}
                  autoCapitalize="none"
                  autoCorrect={false}
                  selectionColor={COLORS.primaryContainer}
                  onFocus={() => setFocusedField('old')}
                  onBlur={() => setFocusedField(null)}
                />
                <Pressable
                  accessibilityLabel="Toggle old password visibility"
                  accessibilityRole="button"
                  onPress={() => setShowOld((prev) => !prev)}
                  style={({ pressed }) => [
                    styles.eyeBtn,
                    pressed && styles.pressedScale90,
                  ]}
                >
                  <EyeToggleIcon
                    visible={showOld}
                    color={
                      showOld ? COLORS.primaryContainer : COLORS.onSurfaceVariant
                    }
                  />
                </Pressable>
              </View>
            </View>

            {/* Field 2: New Password with Strength Indicators */}
            <View style={[styles.fieldCard, styles.newPasswordCard]}>
              <View style={styles.fieldLabelGroup}>
                <Svg
                  width={16}
                  height={16}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={COLORS.secondary}
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <Path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </Svg>
                <Text style={styles.fieldLabel}>
                  New Password <Text style={styles.requiredStar}>*</Text>
                </Text>
              </View>

              <View
                style={[
                  styles.inputWell,
                  focusedField === 'new' && styles.inputWellFocused,
                ]}
              >
                <TextInput
                  style={styles.textInput}
                  value={newPassword}
                  onChangeText={setNewPassword}
                  placeholder="Create new password"
                  placeholderTextColor={COLORS.outline}
                  secureTextEntry={!showNew}
                  autoCapitalize="none"
                  autoCorrect={false}
                  selectionColor={COLORS.primaryContainer}
                  onFocus={() => setFocusedField('new')}
                  onBlur={() => setFocusedField(null)}
                />
                <Pressable
                  accessibilityLabel="Toggle new password visibility"
                  accessibilityRole="button"
                  onPress={() => setShowNew((prev) => !prev)}
                  style={({ pressed }) => [
                    styles.eyeBtn,
                    pressed && styles.pressedScale90,
                  ]}
                >
                  <EyeToggleIcon
                    visible={showNew}
                    color={
                      showNew ? COLORS.primaryContainer : COLORS.onSurfaceVariant
                    }
                  />
                </Pressable>
              </View>

              {/* Segmented Strength Meter */}
              <View style={styles.strengthBlock}>
                <View style={styles.strengthHeader}>
                  <Text style={styles.entropyLabel}>ENTROPY SCORE</Text>
                  <View style={styles.strengthStatusRow}>
                    <View
                      style={[
                        styles.strengthDot,
                        {
                          backgroundColor:
                            checks.score >= 3
                              ? COLORS.secondary
                              : COLORS.tertiary,
                        },
                      ]}
                    />
                    <Text
                      style={[
                        styles.strengthStatusText,
                        {
                          color:
                            checks.score >= 3
                              ? COLORS.secondary
                              : COLORS.tertiary,
                        },
                      ]}
                    >
                      {checks.label}
                    </Text>
                  </View>
                </View>

                <View style={styles.strengthSegmentsRow}>
                  {[1, 2, 3, 4].map((segment) => (
                    <View
                      key={segment}
                      style={[
                        styles.strengthSegment,
                        segment <= checks.score
                          ? checks.score >= 3
                            ? styles.segmentActiveStrong
                            : styles.segmentActiveWarn
                          : styles.segmentInactive,
                      ]}
                    />
                  ))}
                </View>
              </View>

              {/* Live Requirement Checklist Tags */}
              <View style={styles.checklistWrap}>
                <RequirementChip
                  label="8+ characters"
                  met={checks.hasMinLength}
                />
                <RequirementChip
                  label="Contains number"
                  met={checks.hasNumber}
                />
                <RequirementChip
                  label="Special symbol (@#$)"
                  met={checks.hasSpecial}
                />
              </View>
            </View>

            {/* Field 3: Retype New Password */}
            <View style={styles.fieldCard}>
              <View style={styles.fieldHeaderRow}>
                <View style={styles.fieldLabelGroup}>
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
                    <Rect x={3} y={11} width={18} height={11} rx={2} ry={2} />
                    <Path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </Svg>
                  <Text style={styles.fieldLabel}>
                    Retype New Password{' '}
                    <Text style={styles.requiredStar}>*</Text>
                  </Text>
                </View>

                {passwordsMatch && (
                  <View style={styles.matchPill}>
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
                      <Path d="M18 6 7 17l-5-5" />
                      <Path d="m22 10-7.5 7.5L13 16" />
                    </Svg>
                    <Text style={styles.matchPillText}>Match</Text>
                  </View>
                )}

                {passwordsMismatch && (
                  <View style={styles.mismatchPill}>
                    <Text style={styles.mismatchPillText}>Mismatch</Text>
                  </View>
                )}
              </View>

              <View
                style={[
                  styles.inputWell,
                  focusedField === 'confirm' && styles.inputWellFocused,
                ]}
              >
                <TextInput
                  style={styles.textInput}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder="Repeat new password"
                  placeholderTextColor={COLORS.outline}
                  secureTextEntry={!showConfirm}
                  autoCapitalize="none"
                  autoCorrect={false}
                  selectionColor={COLORS.primaryContainer}
                  onFocus={() => setFocusedField('confirm')}
                  onBlur={() => setFocusedField(null)}
                />
                <Pressable
                  accessibilityLabel="Toggle confirm password visibility"
                  accessibilityRole="button"
                  onPress={() => setShowConfirm((prev) => !prev)}
                  style={({ pressed }) => [
                    styles.eyeBtn,
                    pressed && styles.pressedScale90,
                  ]}
                >
                  <EyeToggleIcon
                    visible={showConfirm}
                    color={
                      showConfirm
                        ? COLORS.primaryContainer
                        : COLORS.onSurfaceVariant
                    }
                  />
                </Pressable>
              </View>
            </View>

            {/* Security Session Toggle Card */}
            <View style={styles.toggleCard}>
              <View style={styles.toggleLeft}>
                <View style={styles.deviceIconCircle}>
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
                    <Rect x={5} y={2} width={14} height={20} rx={2} />
                    <Line x1={9} y1={9} x2={15} y2={15} />
                    <Line x1={15} y1={9} x2={9} y2={15} />
                  </Svg>
                </View>
                <View style={styles.flex}>
                  <Text style={styles.toggleTitle}>
                    Sign out of other devices
                  </Text>
                  <Text style={styles.toggleSubtitle}>
                    Recommended if your credentials were exposed
                  </Text>
                </View>
              </View>

              <Pressable
                accessibilityRole="switch"
                accessibilityState={{ checked: signOutOtherDevices }}
                onPress={() => setSignOutOtherDevices((prev) => !prev)}
                style={[
                  styles.switchTrack,
                  signOutOtherDevices
                    ? styles.switchTrackOn
                    : styles.switchTrackOff,
                ]}
              >
                <View style={styles.switchThumb} />
              </Pressable>
            </View>

            {/* Security Encryption Info Badge */}
            <View style={styles.encryptionBanner}>
              <View style={styles.encryptionIconCircle}>
                <Svg
                  width={18}
                  height={18}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={COLORS.primaryContainer}
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <Rect x={3} y={11} width={18} height={11} rx={2} ry={2} />
                  <Path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  <Line x1={12} y1={14.5} x2={12} y2={18.5} />
                  <Line x1={10} y1={16.5} x2={14} y2={16.5} />
                </Svg>
              </View>
              <Text style={styles.encryptionText}>
                <Text style={styles.encryptionStrong}>
                  PII-Protected Ledger
                </Text>{' '}
                • 256-bit AES cryptographic zero-knowledge protocols keep
                communal group tabs encrypted.
              </Text>
            </View>
          </View>

          {/* Footer CTAs */}
          <View style={styles.footer}>
            <Pressable
              onPress={handleUpdate}
              style={({ pressed }) => [
                styles.updateBtn,
                pressed && styles.pressedScale98,
              ]}
            >
              <Text style={styles.updateBtnText}>Update Password</Text>
              <Svg
                width={20}
                height={20}
                viewBox="0 0 24 24"
                fill="none"
                stroke={COLORS.onPrimaryFixed}
                strokeWidth={2.3}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <Line x1={5} y1={12} x2={19} y2={12} />
                <Polyline points="12 5 19 12 12 19" />
              </Svg>
            </Pressable>

            <Pressable
              onPress={onCancel ?? onBack}
              style={({ pressed }) => [
                styles.cancelBtn,
                pressed && styles.pressedScale95,
              ]}
            >
              <Text style={styles.cancelBtnText}>
                Cancel and return to profile
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

/* ---------- Helper Components ---------- */

function EyeToggleIcon({
  visible,
  color,
}: {
  visible: boolean;
  color: string;
}) {
  if (visible) {
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
        <Path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
        <Circle cx={12} cy={12} r={3} />
      </Svg>
    );
  }

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
      <Path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
      <Path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
      <Path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
      <Line x1={2} y1={2} x2={22} y2={22} />
    </Svg>
  );
}

function RequirementChip({ label, met }: { label: string; met: boolean }) {
  return (
    <View
      style={[
        styles.reqChip,
        met ? styles.reqChipMet : styles.reqChipUnmet,
      ]}
    >
      <Svg
        width={13}
        height={13}
        viewBox="0 0 24 24"
        fill="none"
        stroke={met ? COLORS.secondary : COLORS.outline}
        strokeWidth={2.2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <Circle cx={12} cy={12} r={10} />
        {met && <Polyline points="9 12 11.5 14.5 16 9.5" />}
      </Svg>
      <Text
        style={[
          styles.reqChipText,
          met ? styles.reqChipTextMet : styles.reqChipTextUnmet,
        ]}
      >
        {label}
      </Text>
    </View>
  );
}

/* ---------- Styles ---------- */

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.surfaceContainerLowest,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20, // px-margin
    paddingBottom: 28,
  },

  // Top Bar
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    marginBottom: 16,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.surfaceContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  vaultBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 9999,
    backgroundColor: COLORS.surfaceContainer,
  },
  vaultBadgeText: {
    fontFamily: FONTS.labelSemiBold,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.36,
    fontWeight: '600',
    color: COLORS.onSurfaceVariant,
  },

  // Hero Header
  heroSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  heroIconWrap: {
    position: 'relative',
    marginBottom: 12,
  },
  heroIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primaryContainer15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroSubBadge: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.secondaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroTitle: {
    fontFamily: FONTS.headlineSemiBold,
    fontSize: 22,
    lineHeight: 28,
    letterSpacing: -0.22,
    fontWeight: '600',
    color: COLORS.onSurface,
    textAlign: 'center',
    marginBottom: 4,
  },
  heroSubtitle: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 12,
    lineHeight: 17,
    color: COLORS.onSurfaceVariant,
    textAlign: 'center',
    maxWidth: 280,
  },

  // Form Deck
  formDeck: {
    gap: 16,
  },
  fieldCard: {
    backgroundColor: COLORS.surfaceContainerLow,
    borderRadius: 12, // rounded-xl
    padding: 16, // p-4
    gap: 10,
  },
  newPasswordCard: {
    gap: 12,
  },
  fieldHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  fieldLabelGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  fieldLabel: {
    fontFamily: FONTS.labelSemiBold,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.36,
    fontWeight: '600',
    color: COLORS.onSurface,
  },
  requiredStar: {
    color: COLORS.tertiary,
  },
  forgotLink: {
    fontFamily: FONTS.labelBold,
    fontSize: 10,
    lineHeight: 12,
    letterSpacing: 0.5,
    fontWeight: '700',
    color: COLORS.primaryContainer,
  },
  inputWell: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceContainerLowest,
    borderRadius: 8, // rounded-lg
    paddingLeft: 14,
    paddingRight: 10,
    paddingVertical: 11,
  },
  inputWellFocused: {
    backgroundColor: COLORS.surfaceContainer,
  },
  textInput: {
    flex: 1,
    fontFamily: FONTS.bodyRegular,
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.onSurface,
    paddingVertical: 0,
  },
  eyeBtn: {
    padding: 4,
    marginLeft: 6,
  },

  // Strength Meter
  strengthBlock: {
    gap: 6,
    paddingTop: 4,
  },
  strengthHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  entropyLabel: {
    fontFamily: FONTS.labelBold,
    fontSize: 10,
    lineHeight: 12,
    letterSpacing: 0.7,
    fontWeight: '700',
    color: COLORS.onSurfaceVariant,
  },
  strengthStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  strengthDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  strengthStatusText: {
    fontFamily: FONTS.labelBold,
    fontSize: 10,
    lineHeight: 12,
    letterSpacing: 0.4,
    fontWeight: '700',
  },
  strengthSegmentsRow: {
    flexDirection: 'row',
    gap: 6,
    height: 6,
    width: '100%',
  },
  strengthSegment: {
    flex: 1,
    borderRadius: 9999,
  },
  segmentActiveStrong: {
    backgroundColor: COLORS.secondary,
  },
  segmentActiveWarn: {
    backgroundColor: COLORS.tertiary,
  },
  segmentInactive: {
    backgroundColor: COLORS.surfaceVariant,
  },

  // Requirement Checklist
  checklistWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    paddingTop: 4,
  },
  reqChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 9999,
  },
  reqChipMet: {
    backgroundColor: COLORS.secondaryContainer15,
  },
  reqChipUnmet: {
    backgroundColor: COLORS.surfaceContainer,
  },
  reqChipText: {
    fontFamily: FONTS.labelBold,
    fontSize: 10,
    lineHeight: 12,
    letterSpacing: 0.4,
    fontWeight: '700',
  },
  reqChipTextMet: {
    color: COLORS.secondary,
  },
  reqChipTextUnmet: {
    color: COLORS.outline,
  },

  // Match / Mismatch Pill
  matchPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.secondaryContainer15,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 9999,
  },
  matchPillText: {
    fontFamily: FONTS.labelBold,
    fontSize: 10,
    lineHeight: 12,
    letterSpacing: 0.4,
    fontWeight: '700',
    color: COLORS.secondary,
  },
  mismatchPill: {
    backgroundColor: COLORS.errorContainer20,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 9999,
  },
  mismatchPillText: {
    fontFamily: FONTS.labelBold,
    fontSize: 10,
    lineHeight: 12,
    letterSpacing: 0.4,
    fontWeight: '700',
    color: COLORS.error,
  },

  // Session Toggle Card
  toggleCard: {
    backgroundColor: COLORS.surfaceContainerLow,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  toggleLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  deviceIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.surfaceContainer,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  toggleTitle: {
    fontFamily: FONTS.labelSemiBold,
    fontSize: 14,
    lineHeight: 18,
    letterSpacing: 0.2,
    fontWeight: '600',
    color: COLORS.onSurface,
  },
  toggleSubtitle: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 12,
    lineHeight: 16,
    color: COLORS.onSurfaceVariant,
    marginTop: 2,
  },
  switchTrack: {
    width: 48,
    height: 28,
    borderRadius: 9999,
    padding: 2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  switchTrackOn: {
    backgroundColor: COLORS.primaryContainer,
    justifyContent: 'flex-end',
  },
  switchTrackOff: {
    backgroundColor: COLORS.surfaceVariant,
    justifyContent: 'flex-start',
  },
  switchThumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.surfaceContainerLowest,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.25,
    shadowRadius: 2,
    elevation: 2,
  },

  // Encryption Info Banner
  encryptionBanner: {
    backgroundColor: COLORS.surfaceContainer,
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  encryptionIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.surfaceContainerHighest,
    alignItems: 'center',
    justifyContent: 'center',
  },
  encryptionText: {
    flex: 1,
    fontFamily: FONTS.bodyRegular,
    fontSize: 12,
    lineHeight: 17,
    color: COLORS.onSurfaceVariant,
  },
  encryptionStrong: {
    fontFamily: FONTS.labelSemiBold,
    fontWeight: '600',
    color: COLORS.onSurface,
  },

  // Footer CTAs
  footer: {
    marginTop: 32,
    alignItems: 'center',
    gap: 12,
  },
  updateBtn: {
    width: '100%',
    backgroundColor: COLORS.primaryContainer,
    paddingVertical: 16,
    borderRadius: 9999,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.28,
    shadowRadius: 12,
    elevation: 6,
  },
  updateBtnText: {
    fontFamily: FONTS.headlineSemiBold,
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '600',
    color: COLORS.onPrimaryFixed,
  },
  cancelBtn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 9999,
  },
  cancelBtnText: {
    fontFamily: FONTS.labelSemiBold,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.36,
    fontWeight: '600',
    color: COLORS.onSurfaceVariant,
  },

  // Press States
  pressedOpacity: {
    opacity: 0.7,
  },
  pressedScale90: {
    transform: [{ scale: 0.9 }],
  },
  pressedScale95: {
    transform: [{ scale: 0.95 }],
  },
  pressedScale98: {
    transform: [{ scale: 0.98 }],
    opacity: 0.92,
  },
});