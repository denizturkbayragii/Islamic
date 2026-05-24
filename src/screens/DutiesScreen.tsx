import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Card } from '../components/Card';
import { useTheme } from '../hooks/useTheme';
import { calculateSadaqaSuggested, calculateZakat } from '../services/zakat';

function NumInput({
  label,
  value,
  onChange,
  colors,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  colors: ReturnType<typeof useTheme>['colors'];
}) {
  return (
    <View style={styles.field}>
      <Text style={{ color: colors.textSecondary, marginBottom: 4 }}>{label}</Text>
      <TextInput
        keyboardType="decimal-pad"
        value={value}
        onChangeText={onChange}
        style={[styles.input, { color: colors.text, borderColor: colors.border, backgroundColor: colors.surface }]}
        placeholder="0"
        placeholderTextColor={colors.textSecondary}
      />
    </View>
  );
}

export function DutiesScreen() {
  const { colors } = useTheme();
  const [cash, setCash] = useState('10000');
  const [gold, setGold] = useState('0');
  const [silver, setSilver] = useState('0');
  const [investments, setInvestments] = useState('0');
  const [debts, setDebts] = useState('0');
  const [goldPrice, setGoldPrice] = useState('75');
  const [income, setIncome] = useState('3000');
  const [sadaqaPct, setSadaqaPct] = useState('2.5');

  const zakat = calculateZakat({
    cash: parseFloat(cash) || 0,
    goldGrams: parseFloat(gold) || 0,
    silverGrams: parseFloat(silver) || 0,
    investments: parseFloat(investments) || 0,
    businessAssets: 0,
    debts: parseFloat(debts) || 0,
    goldPricePerGram: parseFloat(goldPrice) || 75,
    silverPricePerGram: 1,
    nisabBasis: 'gold',
  });

  const sadaqa = calculateSadaqaSuggested(parseFloat(income) || 0, parseFloat(sadaqaPct) || 0);

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={styles.content}>
      <Text style={[styles.heading, { color: colors.text }]}>Zakat Calculator</Text>
      <Text style={[styles.note, { color: colors.textSecondary }]}>
        Estimates based on 2.5% of qualifying wealth above nisab (85g gold standard). Consult a scholar for your situation.
      </Text>

      <NumInput label="Cash & savings" value={cash} onChange={setCash} colors={colors} />
      <NumInput label="Gold (grams)" value={gold} onChange={setGold} colors={colors} />
      <NumInput label="Silver (grams)" value={silver} onChange={setSilver} colors={colors} />
      <NumInput label="Investments" value={investments} onChange={setInvestments} colors={colors} />
      <NumInput label="Debts to subtract" value={debts} onChange={setDebts} colors={colors} />
      <NumInput label="Gold price per gram" value={goldPrice} onChange={setGoldPrice} colors={colors} />

      <Card>
        <Row label="Total wealth" value={`$${zakat.totalWealth.toFixed(2)}`} colors={colors} />
        <Row label="Nisab threshold" value={`$${zakat.nisabThreshold.toFixed(2)}`} colors={colors} />
        <Row label="Zakat obligatory?" value={zakat.isObligatory ? 'Yes' : 'No'} colors={colors} />
        <Text style={[styles.zakatDue, { color: colors.primary }]}>
          Zakat due: ${zakat.zakatDue.toFixed(2)}
        </Text>
      </Card>

      <Text style={[styles.heading, { color: colors.text, marginTop: 24 }]}>Sadaqa Planner</Text>
      <NumInput label="Monthly income" value={income} onChange={setIncome} colors={colors} />
      <NumInput label="Suggested % for charity" value={sadaqaPct} onChange={setSadaqaPct} colors={colors} />
      <Card>
        <Text style={[styles.zakatDue, { color: colors.accent }]}>
          Suggested monthly sadaqa: ${sadaqa.toFixed(2)}
        </Text>
      </Card>
    </ScrollView>
  );
}

function Row({
  label,
  value,
  colors,
}: {
  label: string;
  value: string;
  colors: ReturnType<typeof useTheme>['colors'];
}) {
  return (
    <View style={styles.row}>
      <Text style={{ color: colors.textSecondary }}>{label}</Text>
      <Text style={{ color: colors.text, fontWeight: '600' }}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, paddingBottom: 40 },
  heading: { fontSize: 20, fontWeight: '700' },
  note: { fontSize: 13, marginVertical: 12, lineHeight: 20 },
  field: { marginBottom: 12 },
  input: { borderWidth: 1, borderRadius: 10, padding: 12, fontSize: 16 },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8 },
  zakatDue: { fontSize: 22, fontWeight: '700', marginTop: 12, textAlign: 'center' },
});
