import { type ComponentRef, useEffect, useRef, useState } from 'react';
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
import { SafeAreaView } from 'react-native-safe-area-context';
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
  surfaceContainerLow: '#1b1b20',
  surfaceContainer: '#1f1f24',
  surfaceContainerHigh: '#2a292f',
  surfaceVariant: '#35343a',
  onSurface: '#e4e1e9',
  onSurfaceVariant: '#cac4d1',
  outline: '#938f9a',
  primary: '#dfd5ff',
  primaryContainer: '#c4b5fd',
  primaryContainer15: 'rgba(196, 181, 253, 0.15)',
  primaryFixedDim20: 'rgba(204, 190, 255, 0.2)',
  onPrimaryFixed: '#1e0e4e',
  secondary: '#62dcad',
  secondary15: 'rgba(98, 220, 173, 0.15)',
  secondaryContainer: '#18a479',
  secondaryContainer20: 'rgba(24, 164, 121, 0.2)',
  onSecondaryContainer: '#003121',
  tertiary: '#ffced3',
  tertiaryContainer: '#ffa6b1',
  tertiaryContainer15: 'rgba(255, 166, 177, 0.15)',
  errorContainer20: 'rgba(147, 0, 10, 0.25)',
};

// Replace `undefined` with loaded font family names if using @expo-google-fonts
const FONTS = {
  displayBold: undefined as string | undefined,
  headlineSemiBold: undefined as string | undefined,
  bodyRegular: undefined as string | undefined,
  labelSemiBold: undefined as string | undefined,
  labelBold: undefined as string | undefined,
};

type SendState = 'idle' | 'sending' | 'sent';

interface ResetPasswordScreenProps {
  onBack?: () => void;
  onHelpPress?: () => void;
  onCodeSent?: (payload: { value: string; method: 'email' | 'sms' }) => void;
  onLoginPress?: () => void;
}

const isValidEmail = (val: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());

const isValidPhone = (val: string) =>
  val.replace(/[^0-9]/g, '').length >= 7;

export default function ResetPasswordScreen({
  onBack,
  onHelpPress,
  onCodeSent,
  onLoginPress,
}: ResetPasswordScreenProps) {
  const [contactValue, setContactValue] = useState('');
  const [isSmsMode, setIsSmsMode] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [hasErrorFlash, setHasErrorFlash] = useState(false);
  const [sendState, setSendState] = useState<SendState>('idle');

  const inputRef = useRef<ComponentRef<typeof TextInput>>(null);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    return () => {
      timersRef.current.forEach(clearTimeout);
    };
  }, []);

  const isInputValid = isSmsMode
    ? isValidPhone(contactValue)
    : isValidEmail(contactValue);

  const handleClear = () => {
    setContactValue('');
    setSendState('idle');
    inputRef.current?.focus();
  };

  const handleToggleMethod = () => {
    setIsSmsMode((prev) => !prev);
    setContactValue('');
    setSendState('idle');
    setHasErrorFlash(false);
  };

  const handleSendCode = () => {
    if (sendState !== 'idle') return;

    if (!contactValue.trim() || !isInputValid) {
      setHasErrorFlash(true);
      const t = setTimeout(() => setHasErrorFlash(false), 1200);
      timersRef.current.push(t);
      return;
    }

    setSendState('sending');
    const t = setTimeout(() => {
      setSendState('sent');
      onCodeSent?.({
        value: contactValue.trim(),
        method: isSmsMode ? 'sms' : 'email',
      });
    }, 700);
    timersRef.current.push(t);
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
          {/* Top App Bar Navigation */}
          <View style={styles.topBar}>
            <Pressable
              accessibilityLabel="Go back to Login"
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
                stroke={COLORS.onSurfaceVariant}
                strokeWidth={2.2}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <Line x1={19} y1={12} x2={5} y2={12} />
                <Polyline points="12 19 5 12 12 5" />
              </Svg>
            </Pressable>

            <Pressable
              accessibilityLabel="Help and support"
              accessibilityRole="button"
              onPress={onHelpPress}
              style={({ pressed }) => [
                styles.helpBtn,
                pressed && styles.pressedScale95,
              ]}
            >
              <Svg
                width={16}
                height={16}
                viewBox="0 0 24 24"
                fill="none"
                stroke={COLORS.primary}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <Circle cx={12} cy={12} r={10} />
                <Path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                <Line x1={12} y1={17} x2={12.01} y2={17} />
              </Svg>
              <Text style={styles.helpBtnText}>Help</Text>
            </Pressable>
          </View>

          {/* Content Flow Wrapper */}
          <View style={styles.contentWrapper}>
            {/* Header Hero Section */}
            <View style={styles.heroSection}>
              <View style={styles.heroBadgeWrap}>
                <Svg
                  width={96}
                  height={96}
                  viewBox="0 0 96 96"
                  style={styles.heroAmbientGlow}
                  pointerEvents="none"
                >
                  <Defs>
                    <RadialGradient id="resetGlow" cx="50%" cy="50%" r="50%">
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
                    </RadialGradient>
                  </Defs>
                  <Circle cx={48} cy={48} r={48} fill="url(#resetGlow)" />
                </Svg>

                <View style={styles.heroBadgeCircle}>
                  <Svg
                    width={30}
                    height={30}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke={COLORS.primary}
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
                      fill={COLORS.primary}
                    />
                    <Path d="M10.5 11V9.5a1.5 1.5 0 0 1 3 0V11" />
                  </Svg>
                </View>
              </View>

              <Text style={styles.heroTitle}>Reset Password</Text>
              <Text style={styles.heroSubtitle}>
                {isSmsMode
                  ? "Enter the phone number linked to your Splitzy account. We'll text you a 6-digit verification code."
                  : "Enter the email associated with your Splitzy account. We'll send you a 6-digit verification code."}
              </Text>
            </View>

            {/* Main Card Container */}
            <View style={styles.card}>
              {/* Input Group */}
              <View style={styles.fieldGroup}>
                <View style={styles.labelRow}>
                  <Text style={styles.fieldLabel}>
                    {isSmsMode ? 'Registered Phone' : 'Registered Email'}{' '}
                    <Text style={styles.requiredStar}>*</Text>
                  </Text>

                  {isInputValid && (
                    <View style={styles.validFeedback}>
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
                        <Circle cx={12} cy={12} r={10} />
                        <Polyline points="9 12 11.5 14.5 16 9.5" />
                      </Svg>
                      <Text style={styles.validFeedbackText}>
                        {isSmsMode ? 'Valid phone' : 'Valid email'}
                      </Text>
                    </View>
                  )}
                </View>

                <View
                  style={[
                    styles.inputContainer,
                    isFocused && styles.inputContainerFocused,
                    hasErrorFlash && styles.inputContainerError,
                  ]}
                >
                  <View style={styles.leadingIcon}>
                    {isSmsMode ? (
                      <Svg
                        width={20}
                        height={20}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke={
                          isInputValid
                            ? COLORS.secondary
                            : COLORS.onSurfaceVariant
                        }
                        strokeWidth={1.9}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <Rect x={5} y={2} width={14} height={20} rx={2} ry={2} />
                        <Line x1={12} y1={18} x2={12.01} y2={18} />
                      </Svg>
                    ) : (
                      <Svg
                        width={20}
                        height={20}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke={
                          isInputValid
                            ? COLORS.secondary
                            : COLORS.onSurfaceVariant
                        }
                        strokeWidth={1.9}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <Rect x={2} y={4} width={20} height={16} rx={2} />
                        <Path d="M22 6l-10 7L2 6" />
                      </Svg>
                    )}
                  </View>

                  <TextInput
                    ref={inputRef}
                    style={styles.textInput}
                    value={contactValue}
                    onChangeText={(text) => {
                      setContactValue(text);
                      if (sendState === 'sent') setSendState('idle');
                    }}
                    placeholder={
                      isSmsMode ? '+1 (555) 019-2834' : 'alex.doe@example.com'
                    }
                    placeholderTextColor={COLORS.outline}
                    keyboardType={isSmsMode ? 'phone-pad' : 'email-address'}
                    autoCapitalize="none"
                    autoCorrect={false}
                    autoComplete={isSmsMode ? 'tel' : 'email'}
                    textContentType={
                      isSmsMode ? 'telephoneNumber' : 'emailAddress'
                    }
                    selectionColor={COLORS.primaryContainer}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                  />

                  {contactValue.length > 0 && (
                    <Pressable
                      accessibilityLabel="Clear input"
                      accessibilityRole="button"
                      onPress={handleClear}
                      style={({ pressed }) => [
                        styles.clearBtn,
                        pressed && styles.pressedOpacity,
                      ]}
                    >
                      <Svg
                        width={15}
                        height={15}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke={COLORS.onSurfaceVariant}
                        strokeWidth={2.3}
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

              {/* Security / Trust Indicator */}
              <View style={styles.trustRow}>
                <View style={styles.trustLeft}>
                  <View style={styles.trustIconCircle}>
                    <Svg width={13} height={13} viewBox="0 0 24 24">
                      <Path
                        d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3z"
                        fill={COLORS.secondary}
                      />
                      <Polyline
                        points="9 12 11 14 15 10"
                        fill="none"
                        stroke={COLORS.surfaceContainerLowest}
                        strokeWidth={2.4}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </Svg>
                  </View>
                  <Text style={styles.trustLabel}>
                    PII-Protected Splitzy Ledger
                  </Text>
                </View>
                <Text style={styles.trustRightText}>Fast Verification</Text>
              </View>

              {/* Primary Action CTA */}
              <Pressable
                disabled={sendState !== 'idle'}
                onPress={handleSendCode}
                style={({ pressed }) => [
                  styles.submitBtn,
                  pressed && sendState === 'idle' && styles.pressedScale98,
                ]}
              >
                {sendState === 'sending' && (
                  <>
                    <ActivityIndicator
                      size="small"
                      color={COLORS.onPrimaryFixed}
                    />
                    <Text style={styles.submitBtnText}>Sending Code...</Text>
                  </>
                )}

                {sendState === 'sent' && (
                  <>
                    <Text style={styles.submitBtnText}>Code Sent</Text>
                    <Svg
                      width={20}
                      height={20}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke={COLORS.onPrimaryFixed}
                      strokeWidth={2.5}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <Polyline points="20 6 9 17 4 12" />
                    </Svg>
                  </>
                )}

                {sendState === 'idle' && (
                  <>
                    <Text style={styles.submitBtnText}>Send Reset Code</Text>
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
                  </>
                )}
              </Pressable>

              {/* Dynamic Micro-Feedback Toast */}
              {sendState === 'sent' && (
                <View style={styles.toastBanner}>
                  <View style={styles.toastCheckCircle}>
                    <Svg
                      width={14}
                      height={14}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke={COLORS.onSecondaryContainer}
                      strokeWidth={2.6}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <Polyline points="20 6 9 17 4 12" />
                    </Svg>
                  </View>
                  <Text style={styles.toastText}>
                    Code dispatched! Check your{' '}
                    {isSmsMode ? 'messages' : 'inbox or spam folder'}.
                  </Text>
                </View>
              )}
            </View>

            {/* Secondary Alternatives Flow */}
            <View style={styles.secondarySection}>
              <Pressable
                onPress={handleToggleMethod}
                style={({ pressed }) => [
                  styles.methodSwitcherBtn,
                  pressed && styles.methodSwitcherBtnPressed,
                ]}
              >
                <View style={styles.smsIconCircle}>
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
                    <Path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    <Line x1={8} y1={10} x2={16} y2={10} />
                    <Line x1={8} y1={13} x2={13} y2={13} />
                  </Svg>
                </View>
                <Text style={styles.methodSwitcherText}>
                  {isSmsMode
                    ? 'Use Email verification instead'
                    : 'Try SMS verification instead'}
                </Text>
              </Pressable>

              {/* Splitzy Tip Micro-Card */}
              <View style={styles.tipCard}>
                <View style={styles.tipIconCircle}>
                  <Svg
                    width={18}
                    height={18}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke={COLORS.tertiary}
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <Path d="M9 18h6" />
                    <Path d="M10 22h4" />
                    <Path d="M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2z" />
                  </Svg>
                </View>
                <View style={styles.flex}>
                  <Text style={styles.tipTitle}>Splitzy Tip</Text>
                  <Text style={styles.tipBody}>
                    Need urgent access to settle an open group tab? Your squad
                    admins can regenerate an instant receipt link for you
                    anytime.
                  </Text>
                </View>
              </View>
            </View>

            {/* Bottom Return Link */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>Remember your password? </Text>
              <Pressable
                onPress={onLoginPress ?? onBack}
                style={({ pressed }) => [pressed && styles.pressedOpacity]}
              >
                <Text style={styles.loginLink}>Log In</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

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
    paddingBottom: 32,
  },

  // Top App Bar
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8, // py-space-sm
    marginBottom: 16, // mb-space-md
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.surfaceContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  helpBtn: {
    height: 36,
    paddingHorizontal: 14,
    borderRadius: 9999,
    backgroundColor: COLORS.surfaceContainer,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  helpBtnText: {
    fontFamily: FONTS.labelSemiBold,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.36,
    fontWeight: '600',
    color: COLORS.onSurfaceVariant,
  },

  // Content Wrapper
  contentWrapper: {
    width: '100%',
    maxWidth: 448,
    alignSelf: 'center',
  },

  // Hero Section
  heroSection: {
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 24, // mb-space-lg
  },
  heroBadgeWrap: {
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  heroAmbientGlow: {
    position: 'absolute',
  },
  heroBadgeCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.primaryContainer15,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.primaryContainer,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 5,
  },
  heroTitle: {
    fontFamily: FONTS.displayBold,
    fontSize: 32,
    lineHeight: 40,
    letterSpacing: -0.64,
    fontWeight: '700',
    color: COLORS.onSurface,
    textAlign: 'center',
    marginBottom: 8,
  },
  heroSubtitle: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 14,
    lineHeight: 22,
    color: COLORS.onSurfaceVariant,
    textAlign: 'center',
    maxWidth: 310,
  },

  // Main Card
  card: {
    backgroundColor: COLORS.surfaceContainer,
    borderRadius: 24, // rounded-3xl
    padding: 20, // p-5
    gap: 16, // gap-4
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.32,
    shadowRadius: 20,
    elevation: 10,
  },
  fieldGroup: {
    gap: 6,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  fieldLabel: {
    fontFamily: FONTS.labelSemiBold,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.36,
    fontWeight: '600',
    color: COLORS.onSurfaceVariant,
  },
  requiredStar: {
    color: COLORS.tertiaryContainer,
    fontWeight: '700',
  },
  validFeedback: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  validFeedbackText: {
    fontFamily: FONTS.labelBold,
    fontSize: 10,
    lineHeight: 12,
    letterSpacing: 0.5,
    fontWeight: '700',
    color: COLORS.secondary,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56, // h-14
    borderRadius: 16, // rounded-2xl
    backgroundColor: COLORS.surfaceContainerLowest,
    paddingHorizontal: 14,
    gap: 10,
  },
  inputContainerFocused: {
    backgroundColor: COLORS.surfaceContainerLow,
  },
  inputContainerError: {
    backgroundColor: COLORS.errorContainer20,
  },
  leadingIcon: {
    width: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textInput: {
    flex: 1,
    fontFamily: FONTS.bodyRegular,
    fontSize: 16,
    lineHeight: 22,
    color: COLORS.onSurface,
    paddingVertical: 0,
  },
  clearBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.surfaceVariant,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Security / Trust Row
  trustRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: COLORS.surfaceContainerLow,
    gap: 8,
  },
  trustLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexShrink: 1,
  },
  trustIconCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: COLORS.secondary15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trustLabel: {
    fontFamily: FONTS.labelBold,
    fontSize: 10,
    lineHeight: 12,
    letterSpacing: 0.4,
    fontWeight: '700',
    color: COLORS.onSurfaceVariant,
  },
  trustRightText: {
    fontFamily: FONTS.labelSemiBold,
    fontSize: 10,
    lineHeight: 12,
    letterSpacing: 0.4,
    fontWeight: '600',
    color: COLORS.secondary,
  },

  // Primary CTA
  submitBtn: {
    width: '100%',
    height: 56, // h-14
    marginTop: 4,
    borderRadius: 9999,
    backgroundColor: COLORS.primaryContainer,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5,
  },
  submitBtnText: {
    fontFamily: FONTS.headlineSemiBold,
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '600',
    color: COLORS.onPrimaryFixed,
  },

  // Toast Banner
  toastBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    borderRadius: 16,
    backgroundColor: COLORS.secondaryContainer20,
  },
  toastCheckCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.secondaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toastText: {
    flex: 1,
    fontFamily: FONTS.bodyRegular,
    fontSize: 12,
    lineHeight: 16,
    color: COLORS.onSurface,
  },

  // Secondary Flow
  secondarySection: {
    alignItems: 'center',
    marginTop: 24, // mt-6
    gap: 12, // gap-3
  },
  methodSwitcherBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 9999,
    backgroundColor: COLORS.surfaceContainer,
  },
  methodSwitcherBtnPressed: {
    backgroundColor: COLORS.surfaceContainerHigh,
    transform: [{ scale: 0.95 }],
  },
  smsIconCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.primaryFixedDim20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  methodSwitcherText: {
    fontFamily: FONTS.labelSemiBold,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.36,
    fontWeight: '600',
    color: COLORS.onSurfaceVariant,
  },
  tipCard: {
    width: '100%',
    padding: 16,
    borderRadius: 16, // rounded-2xl
    backgroundColor: COLORS.surfaceContainerLow,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginTop: 8,
  },
  tipIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.tertiaryContainer15,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  tipTitle: {
    fontFamily: FONTS.labelSemiBold,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.36,
    fontWeight: '600',
    color: COLORS.onSurface,
    marginBottom: 2,
  },
  tipBody: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 12,
    lineHeight: 19,
    color: COLORS.onSurfaceVariant,
  },

  // Bottom Link
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 32, // mt-8
  },
  footerText: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.onSurfaceVariant,
  },
  loginLink: {
    fontFamily: FONTS.labelBold,
    fontSize: 14,
    lineHeight: 18,
    letterSpacing: 0.28,
    fontWeight: '700',
    color: COLORS.primary,
    marginLeft: 4,
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
    opacity: 0.92,
  },
});