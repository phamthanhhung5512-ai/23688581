import React, {memo} from 'react';
import {
  StyleSheet,
  TextInput,
  TextInputProps,
  View,
} from 'react-native';

import Typography from './Typography';
import {COLORS, SIZES} from '@constants/theme';

interface ShopInputProps
  extends Omit<TextInputProps, 'style'> {
  label?: string;
  error?: string;
}

const ShopInput = memo(
  ({
    label,
    error,
    ...props
  }: ShopInputProps) => {
    return (
      <View style={styles.container}>
        {label ? (
          <Typography
            variant="bodyBold"
            style={styles.label}>
            {label}
          </Typography>
        ) : null}

        <TextInput
          {...props}
          style={[
            styles.input,
            error ? styles.inputError : null,
          ]}
          placeholderTextColor={COLORS.textLight}
        />

        {error ? (
          <Typography
            variant="caption"
            color={COLORS.error}
            style={styles.error}>
            {error}
          </Typography>
        ) : null}
      </View>
    );
  },
);

ShopInput.displayName = 'ShopInput';

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  label: {
    marginBottom: SIZES.sm,
  },
  input: {
    height: SIZES.inputHeight,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SIZES.radiusMd,
    backgroundColor: COLORS.surface,
    paddingHorizontal: SIZES.md,
    color: COLORS.text,
  },
  inputError: {
    borderColor: COLORS.error,
  },
  error: {
    marginTop: SIZES.xs,
  },
});

export default ShopInput;