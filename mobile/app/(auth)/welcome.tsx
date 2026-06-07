import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '@/constants/theme';

export default function WelcomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>NittoJatra</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.primary },
  text: { color: Colors.white, fontSize: 28, fontWeight: '800' },
});
