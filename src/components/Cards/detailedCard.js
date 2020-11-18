
import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Dimensions, StyleSheet } from 'react-native';
import { Card as CardPaper, Title, Paragraph, Divider, Text } from 'react-native-paper';

export default function Card({
  title,
  states,
  fireRisk,
  satellite,
  rainlessDays,
  precipitation,
}) {
  function getState(info) {
    const { default: _default, minimum, low, medium, high, critical } = states;

    if (fireRisk < 0) return info === 'palette' ? _default.palette : '';

    if (fireRisk >= states.minimum.min && fireRisk <= states.minimum.max) return info === 'palette' ? minimum.palette : 'Mínimo';
    else if (fireRisk >= states.low.min && fireRisk <= states.low.max) return  info === 'palette' ? low.palette : 'Baixo';
    else if (fireRisk >= states.medium.min && fireRisk <= states.medium.max) return  info === 'palette' ? medium.palette : 'Médio';
    else if (fireRisk >= states.high.min && fireRisk <= states.high.max) return  info === 'palette' ? high.palette : 'Alto';
    else if (fireRisk >= states.critical.min && fireRisk <= states.critical.max) return  info === 'palette' ? critical.palette : 'Crítico';
    else return info === 'palette' ? _default.palette : '';
  }

  const currentPalette = getState('palette');
  const stateName = getState('info');

  return (
    <LinearGradient
      colors={ currentPalette }
      style={ styles.linearGradient }
    >
      <CardPaper style={ styles.card }>
        <Title style={{ ...styles.title }}>{ title }</Title>
        
        <Divider style={{ ...styles.divider }} />

        <Paragraph style={{ ...styles.paragraph }}>
          <MaterialIcon name="fire" size={ 18 } />
          Risco de fogo: { fireRisk * 100 }% - <Text style={{ fontSize: 14, color: currentPalette[currentPalette.length - 1] }}>{ stateName }</Text>
        </Paragraph>
        <Paragraph style={{ ...styles.paragraph }}>
          <MaterialIcon name="weather-cloudy-alert" size={ 18 } />
          {' '}Dias sem chuva: { rainlessDays }
        </Paragraph>
        <Paragraph style={{ ...styles.paragraph }}>
          <MaterialIcon name="weather-pouring" size={ 18 } />
          {' '}Precipitacao: { precipitation } mm
        </Paragraph>
        
        <Divider style={{ ...styles.divider }} />
        
        <Paragraph style={{ textAlign: 'right', fontSize: 11 }}>
          Dados do satélite { satellite }
        </Paragraph>
      </CardPaper>
    </LinearGradient>
  )
};

const styles = StyleSheet.create({
  linearGradient: {
    padding: 2,
    borderRadius: 5,
    marginBottom: 10,
    width: (Dimensions.get('window').width) - 41,
  },
  card: {
    padding: 10,
  },
  title: {
    lineHeight: 25,
  },
  divider: {
    marginTop: 5,
    marginBottom: 5,
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 22,
  },
});
