import { StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/constants/theme';

export default function BookingsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.text}>Bookings</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.background },
  text: { color: Colors.textPrimary, fontSize: 22, fontWeight: '700' },
});
