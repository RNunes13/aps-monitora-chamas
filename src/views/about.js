
import React, { Fragment } from 'react';
import { useTheme, Title, Text } from 'react-native-paper';
import { StyleSheet, View, SafeAreaView, ScrollView, Linking } from 'react-native';

export default function About(props) {
  const theme = useTheme();

  const links = {
    openData: 'http://queimadas.dgi.inpe.br/queimadas/dados-abertos/',
    otherData: 'http://queimadas.dgi.inpe.br/queimadas/portal',
  };

  return (
    <SafeAreaView>
      <ScrollView style={{ padding: 20 }}>
        <View>
          <Title style={ styles.title }>MonitoraChamas</Title>
          <Text style={ styles.paragraph }>
            Este aplicativo tem como objetivo exibir os dados de focos de calor da América do Sul. Os dados apresentados são do Programa de Queimadas do Instituto Nacional de Pesquisas Espaciais - INPE.
          </Text>
          <Text style={ styles.paragraph }>
            Saiba mais sobre esses dados no{' '}
            <Text style={ styles.hiperlink } onPress={ () => Linking.openURL(links.openData) }>
              Portal de dados abertos do Programa Queimadas
            </Text>
          </Text>
          <Text style={ styles.paragraph }>
            Outros dados sobre queimadas podem ser acompanhados nos{' '}
            <Text style={ styles.hiperlink } onPress={ () => Linking.openURL(links.otherData) }>
              Sistemas de Monitoramento{' '}
            </Text>
            do INPE
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  paragraph: {
    fontSize: 16,
    marginBottom: 10,
  },
  hiperlink: {
    color: '#3282b8'
  }
});
