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
}

export function ProfileAvatar({ image, name, tierLabel, showShield }: ProfileAvatarProps) {
  const initial = name.charAt(0).toUpperCase();

  return (
    <View style={styles.wrap}>
      <View style={styles.frame}>
        {image ? (
          <Image source={image} style={styles.avatarImage} contentFit="cover" />
        ) : (
          <LinearGradient colors={[...Gradients.avatar]} style={styles.avatarGradient}>
            <Text style={styles.initial}>{initial}</Text>
          </LinearGradient>
        )}
      </View>
      {tierLabel ? (
        <LinearGradient colors={['#FBBF24', '#F97316']} style={styles.tierPill}>
          <Ionicons name="ribbon" size={12} color={Colors.white} />
          <Text style={styles.tierText}>{tierLabel}</Text>
        </LinearGradient>
      ) : null}
      {showShield ? (
        <View style={styles.shieldBadge}>
          <Ionicons name="shield-checkmark" size={16} color={Colors.white} />
        </View>
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
  frame: {
    width: 124,
    height: 124,
    borderRadius: Radius.card,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.float,
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
    paddingHorizontal: Spacing.base,
    paddingVertical: 7,
    borderRadius: Radius.full,
    borderWidth: 4,
    borderColor: Colors.white,
    marginTop: -12,
    ...Shadows.float,
  },
  tierText: {
    fontFamily: Typography.fonts.black,
    fontSize: Typography.fontSizes.xs,
    color: Colors.white,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    lineHeight: 15,
  },
  shieldBadge: {
    position: 'absolute',
    bottom: 28,
    right: -4,
    width: 36,
    height: 36,
    borderRadius: Radius.md,
    backgroundColor: Colors.primary,
    borderWidth: 4,
    borderColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.float,
  },
});
