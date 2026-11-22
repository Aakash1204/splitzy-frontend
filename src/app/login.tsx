import { useState } from 'react';
import { router } from 'expo-router';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import Svg, { Circle, Line, Path, Rect } from 'react-native-svg';

const COLORS = {
  surfaceContainerLowest: '#0e0e13',
  surfaceContainer: '#1f1f24',
  surface: '#131318',
  surfaceVariant: '#35343a',
  surfaceContainerHigh: '#2a292f',
  onSurface: '#e4e1e9',
  onSurfaceVariant: '#cac4d1',
  outline: '#938f9a',
  primary: '#dfd5ff',
  primaryFixed: '#e7deff',
  primaryContainer: '#c4b5fd',
  onPrimaryContainer: '#514483',
  brandIconBg: '#132d24',
  brandIconStroke: '#6ee7b7',
};

// If you install @expo-google-fonts/space-grotesk & @expo-google-fonts/hanken-grotesk,
// replace `undefined` with your loaded font family names (e.g., 'SpaceGrotesk_700Bold').
const FONTS = {
  displayBold: undefined as string | undefined,
  headlineSemiBold: undefined as string | undefined,
  bodyRegular: undefined as string | undefined,
  labelSemiBold: undefined as string | undefined,
};

interface LoginScreenProps {
  onLogin?: (credentials: { email: string; password: string }) => void;
  onForgotPassword?: () => void;
  onRegister?: () => void;
}

export default function LoginScreen({
  onLogin,
  onForgotPassword = () => router.push('/forgot-password'),
  onRegister = () => router.push('/register'),
}: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<'email' | 'password' | null>(null);

  const handleSubmit = () => {
    if (onLogin) {
      onLogin({ email, password });
    } else {
      router.replace('/dashboard');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle="light-content"
      />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.mainWrapper}>
            {/* Top Section: Visual Presence & Geometric Identifier */}
            <View style={styles.headerSection}>
              <View style={styles.logoOuterBox}>
                <View style={styles.logoInnerBox}>
                  <Svg
                    width={20}
                    height={20}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke={COLORS.brandIconStroke}
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <Rect x={3} y={11} width={18} height={11} rx={2} ry={2} />
                    <Path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    <Circle cx={12} cy={16} r={1.5} fill={COLORS.brandIconStroke} />
                    <Path d="M12 17.5v2" />
                  </Svg>
                </View>
              </View>

              <Text style={styles.brandTitle}>Splitzy</Text>
              <Text style={styles.brandSubtitle}>
                Log in to split &amp; track effortlessly
              </Text>
            </View>

            {/* Center Card: Elevated Surface Deck */}
            <View style={styles.card}>
              {/* Input 1: Email or Username */}
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Email or Username</Text>
                <View
                  style={[
                    styles.inputBox,
                    focusedField === 'email' && styles.inputBoxFocused,
                  ]}
                >
                  <View style={styles.inputIconBadge}>
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
                      <Path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <Circle cx={12} cy={7} r={4} />
                    </Svg>
                  </View>

                  <TextInput
                    style={styles.textInput}
                    value={email}
                    onChangeText={setEmail}
                    placeholder="name@example.com"
                    placeholderTextColor={COLORS.outline}
                    autoCapitalize="none"
                    autoCorrect={false}
                    autoComplete="username"
                    keyboardType="email-address"
                    textContentType="username"
                    selectionColor={COLORS.primaryContainer}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                  />
                </View>
              </View>

              {/* Input 2: Password */}
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Password</Text>
                <View
                  style={[
                    styles.inputBox,
                    focusedField === 'password' && styles.inputBoxFocused,
                  ]}
                >
                  <View style={styles.inputIconBadge}>
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
                  </View>

                  <TextInput
                    style={[
                      styles.textInput,
                      !showPassword && styles.passwordMaskedInput,
                    ]}
                    value={password}
                    onChangeText={setPassword}
                    placeholder="••••••••••••"
                    placeholderTextColor={COLORS.outline}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                    autoComplete="current-password"
                    textContentType="password"
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
                      pressed && styles.pressedScale95,
                    ]}
                  >
                    {showPassword ? (
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
                        stroke={COLORS.onSurfaceVariant}
                        strokeWidth={2}
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

              {/* Forgot Password */}
              <View style={styles.forgotWrapper}>
                <Pressable
                  onPress={onForgotPassword}
                  style={({ pressed }) => [pressed && styles.pressedScale95]}
                >
                  <Text style={styles.forgotText}>Forgot Password?</Text>
                </Pressable>
              </View>

              {/* Primary Action: Full-width Pill Lavender Button */}
              <View style={styles.submitWrapper}>
                <Pressable
                  onPress={handleSubmit}
                  style={({ pressed }) => [
                    styles.submitButton,
                    pressed && styles.pressedScale98,
                  ]}
                >
                  <Text style={styles.submitButtonText}>Log In</Text>
                </Pressable>
              </View>
            </View>

            {/* Bottom Navigation Deck */}
            <View style={styles.footerSection}>
              <Text style={styles.footerText}>Don&apos;t have an account? </Text>
              <Pressable
                onPress={onRegister}
                style={({ pressed }) => [pressed && styles.pressedScale95]}
              >
                <Text style={styles.registerLink}>Register</Text>
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
    paddingVertical: 16, // py-space-md (1rem)
  },
  mainWrapper: {
    flex: 1,
    justifyContent: 'space-between',
    width: '100%',
  },

  // Top Header
  headerSection: {
    alignItems: 'center',
    marginTop: 8, // mt-space-sm
    marginBottom: 24, // mb-space-lg
  },
  logoOuterBox: {
    width: 64,
    height: 64,
    borderRadius: 22,
    backgroundColor: COLORS.surfaceContainer,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16, // mb-space-md
    // shadow-lg shadow-primary-container/20
    shadowColor: COLORS.primaryContainer,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 8,
  },
  logoInnerBox: {
    width: 40,
    height: 40,
    borderRadius: 16,
    backgroundColor: COLORS.brandIconBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandTitle: {
    fontFamily: FONTS.displayBold,
    fontSize: 32,
    lineHeight: 40,
    letterSpacing: -0.64,
    fontWeight: '700',
    color: COLORS.onSurface,
    textAlign: 'center',
  },
  brandSubtitle: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400',
    color: COLORS.onSurfaceVariant,
    marginTop: 4,
    textAlign: 'center',
  },

  // Center Card
  card: {
    width: '100%',
    backgroundColor: COLORS.surfaceContainer,
    borderRadius: 24, // rounded-3xl
    padding: 24, // p-6
    gap: 20, // space-y-5
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 10,
  },
  fieldGroup: {
    gap: 6, // space-y-1.5
  },
  fieldLabel: {
    fontFamily: FONTS.labelSemiBold,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.36,
    fontWeight: '600',
    color: COLORS.onSurfaceVariant,
    paddingHorizontal: 4, // px-1
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56, // h-14
    backgroundColor: COLORS.surface,
    borderRadius: 16, // rounded-2xl
    paddingHorizontal: 16, // px-4
  },
  inputBoxFocused: {
    backgroundColor: COLORS.surfaceVariant,
  },
  inputIconBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.surfaceContainerHigh,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12, // mr-3
  },
  textInput: {
    flex: 1,
    fontFamily: FONTS.bodyRegular,
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '400',
    color: COLORS.onSurface,
    paddingVertical: 0,
  },
  passwordMaskedInput: {
    fontSize: 13,
    letterSpacing: 1.5, // tracking-widest
  },
  eyeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 4,
  },

  // Forgot Password
  forgotWrapper: {
    alignItems: 'flex-end',
    marginTop: -4, // -mt-1
    marginBottom: 4, // mb-1
    paddingHorizontal: 4, // px-1
  },
  forgotText: {
    fontFamily: FONTS.labelSemiBold,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.36,
    fontWeight: '600',
    color: COLORS.primary,
  },

  // Submit Button
  submitWrapper: {
    paddingTop: 8, // pt-2
  },
  submitButton: {
    width: '100%',
    height: 56, // h-14
    borderRadius: 9999,
    backgroundColor: COLORS.primaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.primaryContainer,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 6,
  },
  submitButtonText: {
    fontFamily: FONTS.headlineSemiBold,
    fontSize: 18,
    lineHeight: 24,
    letterSpacing: 0.45, // tracking-wide
    fontWeight: '600',
    color: COLORS.onPrimaryContainer,
  },

  // Footer
  footerSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24, // mt-space-lg
    marginBottom: 4, // mb-space-xs
    paddingVertical: 8, // py-space-sm
  },
  footerText: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400',
    color: COLORS.onSurfaceVariant,
  },
  registerLink: {
    fontFamily: FONTS.labelSemiBold,
    fontSize: 14,
    lineHeight: 18,
    letterSpacing: 0.28,
    fontWeight: '600',
    color: COLORS.primary,
    marginLeft: 4, // ml-1
  },

  // Press States
  pressedScale95: {
    transform: [{ scale: 0.95 }],
    opacity: 0.85,
  },
  pressedScale98: {
    transform: [{ scale: 0.98 }],
    opacity: 0.92,
  },
});