
import React, { Fragment } from 'react';
import ApiService from '../services/api';
import ArrayHelper from '../helpers/ArrayHelper'
import GeneralHelper from '../helpers/GeneralHelper'
import { SimpleCard, SearchInput } from '../components';
import { useTheme, Snackbar, Text } from 'react-native-paper';
import { View, SafeAreaView, ScrollView, ActivityIndicator } from 'react-native';

const API = new ApiService();

export default function CountryDetails(props) {
  const theme = useTheme();

  const [data, setData] = React.useState([]);
  const [rawData, setRawData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [snackbar, setSnackbar] = React.useState({ visible: false, message: '' });
  const [searchTerm, setSearchTerm] = React.useState('');

  const id = props.route.params.id;
  
  React.useEffect(() => {
    API
      .getDataByCountry(id)
      .then(data => {

        const dataGrouped = data.reduce((r, x) => {
          r[x.properties.estado] = r[x.properties.estado] || [];
          r[x.properties.estado].push(x)

          return r;
        }, {});

        const _data = Object
          .keys(dataGrouped)
          .map(key => {
            const filteredArr = (dataGrouped[key] || []).reduce((acc, current) => {
              const a = acc.find(item => item.properties.municipio === current.properties.municipio);
              
              if (!a) return acc.concat([current]);
              else return acc;
            }, []);

            return {
              state: key,
              count: filteredArr.length || 0
            }
          })
          .sort((a, b) => a.count > b.count ? -1 : a.count < b.count ? 1 : 0);

        setData(_data);
        setRawData(data);
      })
      .catch((err) => {
        setSnackbar({
          visible: true,
          message: 'Ocorreu um erro na consulta dos dados'
        });

        setData([]);
        setRawData([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const renderSplitView = () => {
    const dataFiltered = data.filter(({ state }) => {
      const a = GeneralHelper.removeSpecialCharacters(state).toLocaleLowerCase();
      const b = GeneralHelper.removeSpecialCharacters(searchTerm).toLocaleLowerCase();

      return a.match(b);
    });

    if (!dataFiltered.length) {
      return <Text style={{ textAlign: 'center', width: '100%' }}>Sem resultados</Text>
    }

    return (
      <Fragment>
        <View style={{ flexBasis: "49%" }}>
          {
            ArrayHelper.splitData(dataFiltered, 'even')
            .map(({ state, count}) =>
              <SimpleCard
                key={ state }
                title={ state }
                count={ count }
                onPress={ () => props.navigation.push('StateDetails', { id, state, data: rawData }) }
              />
            )
          }
        </View>
        <View style={{ flexBasis: "49%" }}> 
          {
            ArrayHelper.splitData(dataFiltered, 'odd')
            .map(({ state, count}) =>
              <SimpleCard
                key={ state }
                title={ state }
                count={ count }
                onPress={ () => props.navigation.push('StateDetails', { id, state, data: rawData }) }
              />
            )
          }
        </View>
      </Fragment>
    )
  }

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, padding: 20 }}>
        <ActivityIndicator size="large" color={ theme.colors.accent } />
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={{ padding: 20 }}>
        {
          rawData.length &&
          <SearchInput
            defaultValue={ searchTerm }
            onChangeText={ text => setSearchTerm(text) }
          />
        }
        <View style={{
          flex: 1,
          flexDirection: 'row',
          alignItems: 'flex-start',
          justifyContent: 'space-between'
        }}>
          { renderSplitView() }
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
