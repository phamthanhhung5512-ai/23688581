import React, {memo} from 'react';
import {
  Text,
  TextProps,
  StyleSheet,
  TextStyle,
} from 'react-native';

import {FONTS, COLORS} from '@constants/theme';

type TypographyVariant =
  | 'title'
  | 'subtitle'
  | 'body'
  | 'bodyBold'
  | 'caption'
  | 'button';

interface TypographyProps
  extends Omit<TextProps, 'style'> {
  variant?: TypographyVariant;
  color?: string;
  children: React.ReactNode;
  numberOfLines?: number;
  style?: TextStyle;
}

const Typography = memo(
  ({
    variant = 'body',
    color = COLORS.text,
    children,
    numberOfLines,
    style,
    ...rest
  }: TypographyProps) => {
    return (
      <Text
        {...rest}
        numberOfLines={numberOfLines}
        style={[
          styles.base,
          FONTS[variant],
          {color},
          style,
        ]}>
        {children}
      </Text>
    );
  },
);

Typography.displayName = 'Typography';

const styles = StyleSheet.create({
  base: {
    includeFontPadding: false,
  },
});

export default Typography;