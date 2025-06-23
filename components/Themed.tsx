/**
 * Learn more about Light and Dark modes:
 * https://docs.expo.io/guides/color-schemes/
 */

import { 
  Text as DefaultText, 
  useColorScheme, 
  View as DefaultView,
  ScrollView as DefaultScrollView,
  ScrollViewProps as DefaultScrollViewProps,
  TextInput as DefaultTextInput,
  Pressable as DefaultPressable,
} from 'react-native';
import Colors from '../constants/Colors';
import { FontAwesome } from '@expo/vector-icons';

interface ThemedIconProps {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  size?: number;
  style?: any;
}

type ThemeProps = {
  lightColor?: string;
  darkColor?: string;
};

type ThemedPressableProps = React.ComponentProps<typeof DefaultPressable> & {
  isSelected?: boolean;
  selectedBgColorKey?: keyof typeof Colors.light;
  unselectedBgColorKey?: keyof typeof Colors.light;
  selectedTextColorKey?: keyof typeof Colors.light;
  unselectedTextColorKey?: keyof typeof Colors.light;
};


export type TextProps = ThemeProps & DefaultText['props'];
export type ViewProps = ThemeProps & DefaultView['props'];
export type ScrollViewProps = ThemeProps & DefaultScrollViewProps;
export type TextInputProps = ThemeProps & DefaultTextInput['props'];

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
  const theme = useColorScheme() ?? 'light';
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return Colors[theme][colorName];
  }
}

export function Text(props: TextProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  return <DefaultText style={[{ color }, style]} {...otherProps} />;
}

export function View(props: ViewProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');

  return <DefaultView style={[{ backgroundColor }, style]} {...otherProps} />;
}

export function ScrollView(props: ScrollViewProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');

  return <DefaultScrollView style={[{ backgroundColor }, style]} {...otherProps} />;
}

export function TextInput(props: TextInputProps) {
  const { style, lightColor, darkColor, placeholderTextColor, ...otherProps } = props;

  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
  const backgroundColor = useThemeColor({}, 'background');
  const borderColor = useThemeColor({}, 'tabIconDefault');
  const placeholderColor = placeholderTextColor ?? useThemeColor({}, 'placeholder'); // New line

  return (
    <DefaultTextInput
      style={[
        {
          backgroundColor,
          color,
          borderColor,
          borderWidth: 1,
          borderRadius: 8,
          paddingHorizontal: 12,
          paddingVertical: 8,
        },
        style,
      ]}
      placeholderTextColor={placeholderColor}
      {...otherProps}
    />
  );
}

export default function ThemedIcon({ name, size = 18, style }: ThemedIconProps) {
  const color = useThemeColor({}, 'text');

  return <FontAwesome name={name} size={size} color={color} style={style} />;
}

export function Pressable({
  style,
  isSelected,
  selectedBgColorKey = 'tabSelectedBackground',
  unselectedBgColorKey = 'tabUnselectedBackground',
  selectedTextColorKey = 'tabSelectedText',
  unselectedTextColorKey = 'tabUnselectedText',
  children,
  ...otherProps
}: ThemedPressableProps) {
  const backgroundColor = useThemeColor({}, isSelected ? selectedBgColorKey : unselectedBgColorKey);
  const textColor = useThemeColor({}, isSelected ? selectedTextColorKey : unselectedTextColorKey);

  return (
    <DefaultPressable
      style={[
        {
          backgroundColor,
          paddingHorizontal: 16,
          paddingVertical: 8,
          borderRadius: 8,
          marginRight: 16,
        },
      ]}
      {...otherProps}
    >
      {typeof children === 'string' ? (
        <Text style={{ color: textColor, fontSize: 14, fontWeight: '600' }}>{children}</Text>
      ) : (
        children
      )}
    </DefaultPressable>
  );
}