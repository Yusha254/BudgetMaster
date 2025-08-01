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
import { LineChart, PieChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import { Menu, Button } from 'react-native-paper';

const screenWidth = Dimensions.get('window').width;

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

export function useChartColors() {
  const theme = useColorScheme() ?? 'light';

  return {
    primary: Colors[theme].chartPrimary,
    secondary: Colors[theme].chartSecondary,
    background: Colors[theme].chartBackground,
    text: Colors[theme].chartText,
    chartColors: [
      '#4CAF50', '#FF9800', '#03A9F4', '#E91E63', '#9C27B0',
      '#F44336', '#00BCD4', '#8BC34A', '#FFC107', '#9E9E9E',
    ],
  };
}


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

export function ThemedLineChart({ data, bezier = true, ...props }: any) {
  const { primary, background, text } = useChartColors();

  return (
    <LineChart
      data={data}
      width={screenWidth - 32}
      height={220}
      bezier={bezier}
      withInnerLines={false}
      withShadow={true}
      withDots={false}
      chartConfig={{
        backgroundColor: background,
        backgroundGradientFrom: background,
        backgroundGradientTo: background,
        decimalPlaces: 0,
        color: () => primary,
        labelColor: () => text,
        style: {
          borderRadius: 8,
        },
        propsForDots: {
          r: '5',
          strokeWidth: '2',
          stroke: primary,
        },
      }}
      {...props}
    />
  );
}


export function ThemedPieChart({ data, accessor = 'amount', ...props }: any) {
  const { background, text } = useChartColors();

  return (
    <PieChart
      data={data}
      width={screenWidth - 32}
      height={220}
      chartConfig={{
        backgroundColor: background,
        backgroundGradientFrom: background,
        backgroundGradientTo: background,
        color: () => text,
        labelColor: () => text,
      }}
      accessor={accessor}
      backgroundColor="transparent"
      paddingLeft="0"
      absolute
      {...props}
    />
  );
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

export function ThemedMenu(props: React.ComponentProps<typeof Menu>) {
  return <Menu {...props} />;
}

export function ThemedMenuItem(props: React.ComponentProps<typeof Menu.Item>) {
  return <Menu.Item {...props} />;
}

export function ThemedButton(props: React.ComponentProps<typeof Button>) {
  const borderColor = useThemeColor({}, 'tabIconDefault');
  const textColor = useThemeColor({}, 'text');

  return (
    <Button
      mode="outlined"
      style={[
        {
          borderRadius: 8,
          borderColor,
          borderWidth: 1,
        },
        props.style,
      ]}
      labelStyle={{
        textTransform: 'none',
        fontWeight: '600',
        color: textColor,
      }}
      {...props}
    />
  );
}
