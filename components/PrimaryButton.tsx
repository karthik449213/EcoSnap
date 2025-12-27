import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface Props {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'ghost';
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const PrimaryButton: React.FC<Props> = ({
  label,
  onPress,
  variant = 'primary',
  style,
  textStyle,
}) => {
  if (variant === 'ghost') {
    return (
      <TouchableOpacity style={[styles.ghostButton, style]} onPress={onPress} activeOpacity={0.85}>
        <Text style={[styles.ghostText, textStyle]}>{label}</Text>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity activeOpacity={0.9} onPress={onPress} style={style}>
      <LinearGradient
        colors={['#34D399', '#2F9E44']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.button}
      >
        <Text style={[styles.text, textStyle]}>{label}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 16,
    borderRadius: 18,
    alignItems: 'center',
  },
  text: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
    letterSpacing: 0.3,
  },
  ghostButton: {
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    backgroundColor: 'rgba(52, 211, 153, 0.08)',
  },
  ghostText: {
    color: '#047857',
    fontWeight: '700',
    fontSize: 15,
  },
});
