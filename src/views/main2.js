
import Axios from 'axios';
import React from 'react';
import Api from '../services/api';
import { Card } from '../components';
import { VictoryPie, VictoryChart, VictoryTheme } from "victory-native";
import { Text, useTheme, Snackbar } from 'react-native-paper';
import { View, SafeAreaView, ScrollView, ActivityIndicator, RefreshControl } from 'react-native';

const API = new Api();

export default function Main({ navigation }) {
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [refreshing, setRefreshing] = React.useState(false);
  const [snackbar, setSnackbar] = React.useState({ visible: false, message: '' });

  const theme = useTheme();

  React.useEffect(() => {
    getData();
  }, []);

  const getData = (callback = null) => {
    API
      .getCounters()
      .then((counter) => {
        const map = counter.map(c => ({ x: c.name, y: c.count }))

        setData(map);
      })
      .catch((err) => {
        console.log(err);
        setSnackbar({
          visible: true,
          message: 'Ocorreu um erro na consulta dos dados'
        });

        setData([]);
      })
      .finally(() => callback ? callback() : setLoading(false));
  }

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);

    getData(() => setRefreshing(false));
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, padding: 20 }}>
        <ActivityIndicator size="large" color={ theme.colors.accent } />
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#e5e5e5' }}>
      <View>
        <VictoryPie data={ data } />
      </View>
      <Snackbar
        visible={ snackbar.visible && snackbar.message }
        onDismiss={ () => setSnackbar({ visible: false }) }
        theme={{ colors: { accent: '#00f' } }}
        action={{
          label: 'Fechar',
          onPress: () => setSnackbar({ visible: false }),
        }}
      >
        { snackbar.message }
      </Snackbar>
    </SafeAreaView>
  );
};
