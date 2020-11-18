
import React from 'react';
import { StyleSheet } from 'react-native';
import { TextInput, useTheme } from 'react-native-paper';

export default function SearchInput(props) {
  const theme = useTheme();

  const { style, placeholder, onFocus, ...rest } = props;

  return (
    <TextInput
      style={{ ...styles.input, ...style }}
      placeholder={ placeholder || "Pesquisar..." }
      theme={{ colors: { primary: theme.colors.accent } }}
      left={
        <TextInput.Icon
          name="magnify"
          color="#555"
        />
      }
      { ...rest }
    />
  )
};

const styles = StyleSheet.create({
  input: {
    height: 60,
    marginBottom: 15,
  }
});
