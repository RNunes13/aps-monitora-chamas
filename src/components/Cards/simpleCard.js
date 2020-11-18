
import React from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import { Card as CardPaper, Title, Paragraph } from 'react-native-paper';

export default function Card({ title, onPress, count = 0 }) {
  return (
    <CardPaper
      elevation={ 4 }
      onPress={ onPress }
      style={ styles.card }
    >
      <Title style={{ ...styles.title }}>{ title }</Title>
      <Paragraph>Total: { count }</Paragraph>
    </CardPaper>
  )
};

const styles = StyleSheet.create({
  card: {
    padding: 10,
    marginBottom: 10,
    width: (Dimensions.get('window').width / 2) - 25,
  },
  title: {
    lineHeight: 25
  }
});
