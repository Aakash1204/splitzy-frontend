import { useEffect, useRef, useState } from 'react';
import { router } from 'expo-router';
import {
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
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle, Line, Path, Rect } from 'react-native-svg';

const COLORS = {
  surfaceContainerLowest: '#0e0e13',
  surfaceContainerLow: '#1b1b20',
  surfaceContainer: '#1f1f24',
  surfaceContainerHigh: '#2a292f',
  onSurface: '#e4e1e9',
  onSurfaceVariant: '#cac4d1',
  outline: '#938f9a',
  outlineVariant: '#48454f',
  secondary: '#62dcad',
  secondaryContainerTint: 'rgba(24, 164, 121, 0.2)',
  primary: '#dfd5ff',
  primaryContainer: '#c4b5fd',
  onPrimaryFixed: '#1e0e4e',
};

// Replace `undefined` with loaded font family names if using @expo-google-fonts
const FONTS = {
  displayBold: undefined as string | undefined,
  headlineSemiBold: undefined as string | undefined,
  bodyRegular: undefined as string | undefined,
  labelSemiBold: undefined as string | undefined,
  labelBold: undefined as string | undefined,
};

type FocusableField = 'fullname' | 'username' | 'email' | 'password' | null;

interface RegisterScreenProps {
  onBack?: () => void;
  onRegister?: (data: {
    fullName: string;
    username: string;
    email: string;
    password: string;
  }) => void;
  onLoginPress?: () => void;
}

export default function RegisterScreen({
  onBack = () => router.back(),
  onRegister,
  onLoginPress = () => router.replace('/login'),
}: RegisterScreenProps) {
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<FocusableField>(null);

  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 0.35,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [pulseAnim]);

  const isUsernameAvailable = username.trim().length >= 3;

  const handleSubmit = () => {
    if (onRegister) {
      onRegister({
        fullName: fullName.trim(),
        username: username.trim(),
        email: email.trim(),
        password,
      });
    } else {
      router.replace('/dashboard');
    }
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
          <View style={styles.container}>
            {/* Top Navigation Bar */}
            <View style={styles.topNav}>
              <Pressable
                accessibilityLabel="Go back"
                accessibilityRole="button"
                onPress={onBack}
                style={({ pressed }) => [
                  styles.backButton,
                  pressed && styles.backButtonPressed,
                ]}
              >
                <Svg
                  width={18}
                  height={18}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={COLORS.onSurface}
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <Path d="M19 12H5" />
                  <Path d="M12 19l-7-7 7-7" />
                </Svg>
              </Pressable>

              <View style={styles.stepPill}>
                <Animated.View
                  style={[styles.pulseDot, { opacity: pulseAnim }]}
                />
                <Text style={styles.stepText}>STEP 1 OF 1</Text>
              </View>
            </View>

            {/* Header Section with Badge & Titles */}
            <View style={styles.headerSection}>
              <View style={styles.badgeContainer}>
                <Svg
                  width={30}
                  height={30}
                  viewBox="0 0 24 24"
                  fill={COLORS.secondary}
                >
                  <Circle cx={9} cy={8} r={4} />
                  <Path d="M9 14c-4.42 0-8 1.79-8 4v2h16v-2c0-2.21-3.58-4-8-4z" />
                  <Path
                    d="M19 8v6M16 11h6"
                    stroke={COLORS.secondary}
                    strokeWidth={2.2}
                    strokeLinecap="round"
                  />
                </Svg>
              </View>

              <Text style={styles.title}>Create Account</Text>
              <Text style={styles.subtitle}>
                Join Splitzy to split &amp; track effortlessly
              </Text>
            </View>

            {/* Main Registration Card */}
            <View style={styles.card}>
              {/* Field 1: Full Name */}
              <View style={styles.fieldGroup}>
                <View style={styles.labelRow}>
                  <Text style={styles.fieldLabel}>Full Name</Text>
                  <Text style={styles.hintLabel}>Legal or preferred</Text>
                </View>
                <View
                  style={[
                    styles.inputBox,
                    focusedField === 'fullname' && styles.inputBoxFocused,
                  ]}
                >
                  <View style={styles.leadingIcon}>
                    <Svg
                      width={20}
                      height={20}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke={COLORS.outline}
                      strokeWidth={1.8}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <Rect x={3} y={4} width={18} height={16} rx={2} />
                      <Circle cx={9} cy={11} r={2} />
                      <Path d="M6.5 16c.5-1.5 1.5-2 2.5-2s2 .5 2.5 2" />
                      <Line x1={14} y1={10} x2={18} y2={10} />
                      <Line x1={14} y1={14} x2={17} y2={14} />
                    </Svg>
                  </View>
                  <TextInput
                    style={styles.textInput}
                    value={fullName}
                    onChangeText={setFullName}
                    placeholder="Priya Sharma"
                    placeholderTextColor={COLORS.outlineVariant}
                    autoCapitalize="words"
                    autoCorrect={false}
                    textContentType="name"
                    selectionColor={COLORS.primaryContainer}
                    onFocus={() => setFocusedField('fullname')}
                    onBlur={() => setFocusedField(null)}
                  />
                </View>
              </View>

              {/* Field 2: Username */}
              <View style={styles.fieldGroup}>
                <View style={styles.labelRow}>
                  <Text style={styles.fieldLabel}>Username</Text>
                  {isUsernameAvailable && (
                    <Text style={styles.availableBadge}>Available</Text>
                  )}
                </View>
                <View
                  style={[
                    styles.inputBox,
                    focusedField === 'username' && styles.inputBoxFocused,
                  ]}
                >
                  <View style={styles.leadingIcon}>
                    <Svg
                      width={20}
                      height={20}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke={COLORS.outline}
                      strokeWidth={1.8}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <Circle cx={12} cy={12} r={4} />
                      <Path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-3.92 7.94" />
                    </Svg>
                  </View>
                  <TextInput
                    style={styles.textInput}
                    value={username}
                    onChangeText={setUsername}
                    placeholder="priya_s"
                    placeholderTextColor={COLORS.outlineVariant}
                    autoCapitalize="none"
                    autoCorrect={false}
                    textContentType="username"
                    selectionColor={COLORS.primaryContainer}
                    onFocus={() => setFocusedField('username')}
                    onBlur={() => setFocusedField(null)}
                  />
                </View>
              </View>

              {/* Field 3: Email */}
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Email</Text>
                <View
                  style={[
                    styles.inputBox,
                    focusedField === 'email' && styles.inputBoxFocused,
                  ]}
                >
                  <View style={styles.leadingIcon}>
                    <Svg
                      width={20}
                      height={20}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke={COLORS.outline}
                      strokeWidth={1.8}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <Rect x={2} y={4} width={20} height={16} rx={2} />
                      <Path d="M22 6l-10 7L2 6" />
                    </Svg>
                  </View>
                  <TextInput
                    style={styles.textInput}
                    value={email}
                    onChangeText={setEmail}
                    placeholder="name@example.com"
                    placeholderTextColor={COLORS.outlineVariant}
                    autoCapitalize="none"
                    autoCorrect={false}
                    keyboardType="email-address"
                    textContentType="emailAddress"
                    selectionColor={COLORS.primaryContainer}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                  />
                </View>
              </View>

              {/* Field 4: Password */}
              <View style={styles.fieldGroup}>
                <View style={styles.labelRow}>
                  <Text style={styles.fieldLabel}>Password</Text>
                  <Text style={styles.hintLabel}>Min. 8 chars</Text>
                </View>
                <View
                  style={[
                    styles.inputBox,
                    focusedField === 'password' && styles.inputBoxFocused,
                  ]}
                >
                  <View style={styles.leadingIcon}>
                    <Svg
                      width={20}
                      height={20}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke={COLORS.outline}
                      strokeWidth={1.8}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <Rect x={3} y={11} width={18} height={11} rx={2} ry={2} />
                      <Path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </Svg>
                  </View>
                  <TextInput
                    style={[styles.textInput, styles.passwordInput]}
                    value={password}
                    onChangeText={setPassword}
                    placeholder="••••••••••••"
                    placeholderTextColor={COLORS.outlineVariant}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                    textContentType="newPassword"
                    selectionColor={COLORS.primaryContainer}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField(null)}
                  />
                  <Pressable
                    accessibilityLabel="Toggle password visibility"
                    accessibilityRole="button"
                    onPress={() => setShowPassword((prev) => !prev)}
                    style={({ pressed }) => [
                      styles.eyeButton,
                      pressed && styles.pressedOpacity,
                    ]}
                  >
                    {showPassword ? (
                      <Svg
                        width={20}
                        height={20}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke={COLORS.outline}
                        strokeWidth={1.8}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <Path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                        <Path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                        <Path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                        <Line x1={2} y1={2} x2={22} y2={22} />
                      </Svg>
                    ) : (
                      <Svg
                        width={20}
                        height={20}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke={COLORS.outline}
                        strokeWidth={1.8}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <Path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                        <Circle cx={12} cy={12} r={3} />
                      </Svg>
                    )}
                  </Pressable>
                </View>
              </View>

              {/* Security / Perks Micro-Banner */}
              <View style={styles.perksRow}>
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
                  <Path d="M9 12l2 2 4-4" />
                </Svg>
                <Text style={styles.perksText}>
                  Zero fees for direct peer-to-peer settlements
                </Text>
              </View>

              {/* Primary Action CTA */}
              <Pressable
                onPress={handleSubmit}
                style={({ pressed }) => [
                  styles.submitButton,
                  pressed && styles.submitButtonPressed,
                ]}
              >
                <Text style={styles.submitButtonText}>Create Account</Text>
                <Svg
                  width={18}
                  height={18}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={COLORS.onPrimaryFixed}
                  strokeWidth={2.2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <Path d="M5 12h14" />
                  <Path d="M12 5l7 7-7 7" />
                </Svg>
              </Pressable>
            </View>

            {/* Bottom Helper Navigation */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>Already have an account? </Text>
              <Pressable
                onPress={onLoginPress}
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
    paddingHorizontal: 20, // px-margin (1.25rem)
    paddingBottom: 32, // pb-8
  },
  container: {
    width: '100%',
  },

  // Top Navigation Bar
  topNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8, // py-2
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.surfaceContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonPressed: {
    backgroundColor: COLORS.surfaceContainerHigh,
    transform: [{ scale: 0.95 }],
  },
  stepPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6, // gap-1.5
    paddingHorizontal: 12, // px-3
    paddingVertical: 4, // py-1
    borderRadius: 9999,
    backgroundColor: COLORS.surfaceContainerLow,
  },
  pulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.secondary,
  },
  stepText: {
    fontFamily: FONTS.labelBold,
    fontSize: 10,
    lineHeight: 12,
    letterSpacing: 0.8, // tracking-wider
    fontWeight: '700',
    color: COLORS.secondary,
  },

  // Header Section
  headerSection: {
    alignItems: 'center',
    marginTop: 12, // mt-3
    marginBottom: 24, // mb-6
  },
  badgeContainer: {
    width: 64,
    height: 64,
    borderRadius: 16, // rounded-2xl
    backgroundColor: COLORS.secondaryContainerTint,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12, // mb-3
  },
  title: {
    fontFamily: FONTS.displayBold,
    fontSize: 32,
    lineHeight: 40,
    letterSpacing: -0.64,
    fontWeight: '700',
    color: COLORS.onSurface,
    textAlign: 'center',
    marginBottom: 4, // mb-1
  },
  subtitle: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400',
    color: COLORS.onSurfaceVariant,
    textAlign: 'center',
    maxWidth: 260,
  },

  // Main Registration Card
  card: {
    backgroundColor: COLORS.surfaceContainerLow,
    borderRadius: 24, // rounded-3xl
    padding: 20, // p-5
    marginBottom: 20, // mb-5
    gap: 14, // gap-3.5
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 10,
  },
  fieldGroup: {
    gap: 6, // gap-1.5
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  fieldLabel: {
    fontFamily: FONTS.labelSemiBold,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.36,
    fontWeight: '600',
    color: COLORS.onSurfaceVariant,
  },
  hintLabel: {
    fontFamily: FONTS.labelBold,
    fontSize: 10,
    lineHeight: 12,
    letterSpacing: 0.5,
    fontWeight: '700',
    color: COLORS.outline,
  },
  availableBadge: {
    fontFamily: FONTS.labelBold,
    fontSize: 10,
    lineHeight: 12,
    letterSpacing: 0.5,
    fontWeight: '700',
    color: COLORS.secondary,
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceContainerLowest,
    borderRadius: 16, // rounded-2xl
    paddingHorizontal: 14, // px-3.5
    paddingVertical: 12, // py-3
  },
  inputBoxFocused: {
    backgroundColor: COLORS.surfaceContainer,
  },
  leadingIcon: {
    marginRight: 10, // mr-2.5
  },
  textInput: {
    flex: 1,
    fontFamily: FONTS.bodyRegular,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400',
    color: COLORS.onSurface,
    paddingVertical: 0,
  },
  passwordInput: {
    letterSpacing: 0.7, // tracking-wider
    paddingRight: 8,
  },
  eyeButton: {
    padding: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Perks Banner
  perksRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10, // gap-2.5
    paddingVertical: 4, // py-1
    paddingHorizontal: 8, // px-2
    marginTop: 2, // mt-0.5
  },
  perksText: {
    flex: 1,
    fontFamily: FONTS.bodyRegular,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.12,
    fontWeight: '400',
    color: COLORS.onSurfaceVariant,
  },

  // Submit CTA
  submitButton: {
    width: '100%',
    marginTop: 8, // mt-2
    paddingVertical: 14, // py-3.5
    paddingHorizontal: 24, // px-6
    borderRadius: 9999,
    backgroundColor: COLORS.primaryContainer,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8, // gap-2
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },
  submitButtonPressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.92,
  },
  submitButtonText: {
    fontFamily: FONTS.headlineSemiBold,
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '600',
    color: COLORS.onPrimaryFixed,
  },

  // Footer
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8, // py-2
  },
  footerText: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400',
    color: COLORS.onSurfaceVariant,
  },
  loginLink: {
    fontFamily: FONTS.labelSemiBold,
    fontSize: 14,
    lineHeight: 18,
    letterSpacing: 0.28,
    fontWeight: '600',
    color: COLORS.primary,
    marginLeft: 4, // ml-1
  },
  pressedOpacity: {
    opacity: 0.75,
  },
});