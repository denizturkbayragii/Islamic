import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { GradientHero } from '../components/GradientHero';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../hooks/useTheme';
import { useTranslation } from '../hooks/useTranslation';

export function AuthScreen() {
  const { register, login, guest } = useAuth();
  const { colors } = useTheme();
  const { t } = useTranslation();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    setError(null);
    const fn = mode === 'login' ? login : register;
    const result = await fn(email, password);
    if (!result.ok) {
      const map: Record<string, string> = {
        invalid: t('auth.errorInvalid'),
        exists: t('auth.errorExists'),
        not_found: t('auth.errorNotFound'),
        wrong_password: t('auth.errorWrongPassword'),
      };
      setError(map[result.error ?? 'invalid'] ?? t('auth.errorInvalid'));
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.flex, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scroll}>
        <GradientHero>
          <Text style={styles.heroTitle}>{t('auth.welcome')}</Text>
          <Text style={styles.heroSub}>{t('auth.subtitle')}</Text>
        </GradientHero>

        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.tabs}>
            <Pressable onPress={() => setMode('login')} style={[styles.tab, mode === 'login' && { backgroundColor: colors.primary }]}>
              <Text style={{ color: mode === 'login' ? '#fff' : colors.text }}>{t('auth.signIn')}</Text>
            </Pressable>
            <Pressable onPress={() => setMode('register')} style={[styles.tab, mode === 'register' && { backgroundColor: colors.primary }]}>
              <Text style={{ color: mode === 'register' ? '#fff' : colors.text }}>{t('auth.signUp')}</Text>
            </Pressable>
          </View>

          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder={t('auth.email')}
            placeholderTextColor={colors.textSecondary}
            autoCapitalize="none"
            keyboardType="email-address"
            style={[styles.input, { color: colors.text, borderColor: colors.border }]}
          />
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder={t('auth.password')}
            placeholderTextColor={colors.textSecondary}
            secureTextEntry
            style={[styles.input, { color: colors.text, borderColor: colors.border }]}
          />
          {error && <Text style={{ color: colors.error, marginBottom: 8 }}>{error}</Text>}
          <Pressable style={[styles.primaryBtn, { backgroundColor: colors.primary }]} onPress={submit}>
            <Text style={styles.primaryBtnText}>{mode === 'login' ? t('auth.signIn') : t('auth.signUp')}</Text>
          </Pressable>
          <Pressable style={styles.guestBtn} onPress={guest}>
            <Text style={{ color: colors.textSecondary }}>{t('auth.guest')}</Text>
          </Pressable>
        </View>

        <Text style={[styles.guestNote, { color: colors.textSecondary }]}>{t('auth.guestBanner')}</Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  scroll: { padding: 16, paddingBottom: 40 },
  heroTitle: { color: '#fff', fontSize: 26, fontWeight: '800', textAlign: 'center' },
  heroSub: { color: 'rgba(255,255,255,0.9)', textAlign: 'center', marginTop: 8, lineHeight: 22 },
  card: { borderRadius: 16, borderWidth: 1, padding: 16, marginTop: 8 },
  tabs: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  tab: { flex: 1, padding: 12, borderRadius: 10, alignItems: 'center' },
  input: { borderWidth: 1, borderRadius: 12, padding: 14, marginBottom: 12, fontSize: 16 },
  primaryBtn: { padding: 14, borderRadius: 12, alignItems: 'center' },
  primaryBtnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  guestBtn: { alignItems: 'center', marginTop: 16, padding: 8 },
  guestNote: { fontSize: 12, lineHeight: 18, marginTop: 16, textAlign: 'center' },
});
