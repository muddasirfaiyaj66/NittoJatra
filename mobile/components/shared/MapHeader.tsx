import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { ImageBackground, Pressable, StyleSheet, View, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Gradients, Radius, Shadows, Spacing } from '@/constants/theme';

/** Figma basemap asset — dark Dhaka-style map from NittoJatra-APP file */
const BASEMAP_URI =
  'https://www.figma.com/api/mcp/asset/30df4cb9-94eb-44fd-affe-298013b7d9d8';

interface MapHeaderProps {
  height?: number;
  onBack?: () => void;
  children?: React.ReactNode;
  style?: ViewStyle;
  /** Use Figma basemap image when true (Find screen) */
  useBasemap?: boolean;
}

/** Figma decorative map header — basemap image or stylized route overlay */
export function MapHeader({ height = 490, onBack, children, style, useBasemap = false }: MapHeaderProps) {
  const content = (
    <>
      {!useBasemap && (
        <>
          <View style={styles.roadMain} />
          <View style={styles.roadSecondary} />
          <View style={styles.roadAccent} />
          <View style={[styles.pin, styles.pinOrigin]}>
            <View style={styles.pinInner} />
          </View>
          <View style={[styles.pin, styles.pinDest]}>
            <Ionicons name="location" size={20} color={Colors.purple500} />
          </View>
          <View style={styles.labelDhaka} />
          <View style={styles.labelBaridhara} />
        </>
      )}

      <SafeAreaView edges={['top']} style={styles.overlay}>
        {onBack ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Go back"
            onPress={onBack}
            style={styles.backBtn}
          >
            <Ionicons name="arrow-back" size={20} color={Colors.textPrimary} />
          </Pressable>
        ) : null}
        {children}
      </SafeAreaView>
    </>
  );

  if (useBasemap) {
    return (
      <ImageBackground
        source={{ uri: BASEMAP_URI }}
        style={[styles.container, { height }, style]}
        imageStyle={styles.basemapImage}
        resizeMode="cover"
      >
        {content}
      </ImageBackground>
    );
  }

  return (
    <LinearGradient colors={[...Gradients.navyHeader]} style={[styles.container, { height }, style]}>
      {content}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    backgroundColor: '#1A2332',
  },
  basemapImage: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
  },
  backBtn: {
    width: 48,
    height: 48,
    borderRadius: Radius.full,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.sm,
    ...Shadows.float,
  },
  roadMain: {
    position: 'absolute',
    top: 180,
    left: 20,
    width: 320,
    height: 4,
    backgroundColor: '#14B8A6',
    opacity: 0.85,
    transform: [{ rotate: '8deg' }],
    borderRadius: 2,
  },
  roadSecondary: {
    position: 'absolute',
    top: 220,
    left: 60,
    width: 240,
    height: 2,
    backgroundColor: '#334155',
    opacity: 0.7,
    transform: [{ rotate: '-5deg' }],
    borderRadius: 1,
  },
  roadAccent: {
    position: 'absolute',
    top: 140,
    right: 30,
    width: 120,
    height: 3,
    backgroundColor: '#F59E0B',
    opacity: 0.6,
    transform: [{ rotate: '45deg' }],
    borderRadius: 2,
  },
  pin: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pinOrigin: {
    top: 160,
    left: 80,
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: Colors.primaryGradStart,
    backgroundColor: Colors.white,
  },
  pinInner: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.primaryGradStart,
  },
  pinDest: {
    top: 200,
    right: 90,
  },
  labelDhaka: {
    position: 'absolute',
    top: 100,
    left: 140,
    width: 60,
    height: 14,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 4,
  },
  labelBaridhara: {
    position: 'absolute',
    top: 250,
    right: 50,
    width: 80,
    height: 12,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 4,
  },
});
