import React, {memo} from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  ViewStyle,
} from 'react-native';

import Typography from './Typography';
import {COLORS, SIZES} from '@constants/theme';

interface ShopButtonProps {
  title: string;
  onPress: () => void;
  isLoading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'outline';
  style?: ViewStyle;
}

const ShopButton = memo(
  ({
    title,
    onPress,
    isLoading = false,
    disabled = false,
    variant = 'primary',
    style,
  }: ShopButtonProps) => {
    const isOutline = variant === 'outline';

    return (
      <Pressable
        onPress={onPress}
        disabled={disabled || isLoading}
        style={({pressed}) => [
          styles.base,
          isOutline
            ? styles.outline
            : styles.primary,
          pressed && styles.pressed,
          (disabled || isLoading) && styles.disabled,
          style,
        ]}>
        {isLoading ? (
          <ActivityIndicator
            color={
              isOutline
                ? COLORS.primary
                : COLORS.surface
            }
          />
        ) : (
          <Typography
            variant="button"
            color={
              isOutline
                ? COLORS.primary
                : COLORS.surface
            }>
            {title}
          </Typography>
        )}
      </Pressable>
    );
  },
);

ShopButton.displayName = 'ShopButton';

const styles = StyleSheet.create({
  base: {
    minHeight: SIZES.buttonHeight,
    borderRadius: SIZES.radiusMd,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SIZES.lg,
  },
  primary: {
    backgroundColor: COLORS.primary,
  },
  outline: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  pressed: {
    opacity: 0.75,
  },
  disabled: {
    opacity: 0.5,
  },
});

export default ShopButton;