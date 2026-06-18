import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { ImageSourcePropType, StyleSheet, Text, View } from 'react-native';
import { Colors, Gradients, Radius, Shadows, Spacing, Typography } from '@/constants/theme';

interface ProfileAvatarProps {
  image?: ImageSourcePropType;
  name: string;
  tierLabel?: string;
  showShield?: boolean;
  overlay?: boolean;
}

export function ProfileAvatar({ image, name, tierLabel, showShield, overlay }: ProfileAvatarProps) {
  const initial = name.charAt(0).toUpperCase();

  return (
    <View style={[styles.wrap, overlay && styles.wrapOverlay]}>
      <View style={styles.frame}>
        {image ? (
          <Image source={image} style={styles.avatarImage} contentFit="cover" />
        ) : (
          <LinearGradient colors={[...Gradients.avatar]} style={styles.avatarGradient}>
            <Text style={styles.initial}>{initial}</Text>
          </LinearGradient>
        )}
        {showShield ? (
          <View style={styles.shieldBadge}>
            <Ionicons name="shield-checkmark" size={16} color={Colors.white} />
          </View>
        ) : null}
      </View>
      {tierLabel ? (
        <LinearGradient colors={['#FBBF24', '#F97316']} style={styles.tierPill}>
          <Ionicons name="ribbon" size={12} color={Colors.white} />
          <Text style={styles.tierText}>{tierLabel}</Text>
        </LinearGradient>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: -64,
    marginBottom: Spacing.base,
  },
  wrapOverlay: {
    position: 'absolute',
    top: -64,
    left: 0,
    right: 0,
    marginTop: 0,
    marginBottom: 0,
    zIndex: 10,
  },
  frame: {
    width: 124,
    height: 124,
    borderRadius: 32,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.float,
    overflow: 'visible',
  },
  avatarImage: {
    width: 96,
    height: 96,
    borderRadius: 48,
  },
  avatarGradient: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initial: {
    fontFamily: Typography.fonts.black,
    fontSize: Typography.fontSizes.xxl,
    color: Colors.white,
  },
  tierPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 16,
    paddingTop: 7,
    paddingBottom: 8,
    borderRadius: Radius.full,
    borderWidth: 4,
    borderColor: Colors.white,
    marginTop: -8,
    alignSelf: 'center',
    ...Shadows.float,
  },
  tierText: {
    fontFamily: Typography.fonts.black,
    fontSize: 10,
    color: Colors.white,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    lineHeight: 15,
  },
  shieldBadge: {
    position: 'absolute',
    bottom: -6,
    right: -6,
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    borderWidth: 4,
    borderColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.float,
  },
});
