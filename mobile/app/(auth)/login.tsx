import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '@/constants/theme';

export default function LoginScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Login</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.background },
  text: { color: Colors.textPrimary, fontSize: 22, fontWeight: '700' },
});
