
import Axios from 'axios';
import React, { Fragment } from 'react';
import Api from '../services/api';
import ArrayHelper from '../helpers/ArrayHelper'
import { SimpleCard } from '../components';
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
      .then(counter => setData(counter))
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

  const renderSplitView = (
    <Fragment>
      <View style={{ flexBasis: "49%" }}>
        {
          ArrayHelper
          .splitData(data, 'even').map(({ id, name, count }) => 
            <SimpleCard
              key={ id }
              title={ name }
              count= { count }
              onPress={ () => navigation.push('CountryDetails', { id, name }) }
            />
          )
        }
      </View>
      <View style={{ flexBasis: "49%" }}>
        {
          ArrayHelper
          .splitData(data, 'odd').map(({ id, name, count }) => 
            <SimpleCard
              key={ id }
              title={ name }
              count= { count }
              onPress={ () => navigation.push('CountryDetails', { id, name }) }
            />
          )
        }
      </View>
    </Fragment>
  )

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, padding: 20 }}>
        <ActivityIndicator size="large" color={ theme.colors.accent } />
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#e5e5e5' }}>
      <ScrollView
        style={{ padding: 20 }}
        refreshControl={
          <RefreshControl
            enabled={ !loading && !!data.length }
            colors={ [theme.colors.accent] }
            onRefresh={ onRefresh }
            refreshing={ refreshing }
          />
        }
      >
        <View style={{
          flex: 1,
          flexDirection: 'row',
          alignItems: 'flex-start',
          justifyContent: 'space-between'
        }}>
          {
            !data.length
            ? <Text style={{ textAlign: 'center', fontSize: 18 }}>Sem dados</Text>
            : renderSplitView
          }
        </View>
      </ScrollView>
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
