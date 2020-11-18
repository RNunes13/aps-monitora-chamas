
import React, { Fragment } from 'react';
import ApiService from '../services/api';
import GeneralHelper from '../helpers/GeneralHelper'
import { DetailedCard, SearchInput } from '../components';
import { useTheme, Snackbar, Text, Chip } from 'react-native-paper';
import { View, SafeAreaView, ScrollView, ActivityIndicator } from 'react-native';

const API = new ApiService();

export default function StateDetails(props) {
  const theme = useTheme(); 

  const { id, state } = props.route.params;

  const states = {
    critical: { min: 0.8, max: 1, palette: ['#ffebee', '#ff7b7b', '#881106'] },
    high: { min: 0.60, max: 0.79, palette: ['#fffbe9', '#ffb38a', '#ff6700'] },
    medium: { min: 0.40, max: 0.59, palette: ['#fffbe9', '#fff9ba', '#fd0'] },
    low: { min: 0.20, max: 0.39, palette: ['#aceeb4', '#91e99b', '#6acd75'] },
    minimum: { min: 0, max: 0.19, palette: ['#b8d5cd', '#5ca08e', '#006a4e'] },
    default: { min: 0, max: 1, palette: ['#fff', '#9a9a9a', '#404040'] },
  };

  const [cities, setCities] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [snackbar, setSnackbar] = React.useState({ visible: false, message: '' });
  const [statesSelected, setStatesSelected] = React.useState({
    'Crítico': { selected: false, min: 0.8, max: 1 },
    'Alto': { selected: false, min: 0.6, max: 0.79 },
    'Médio': { selected: false, min: 0.4, max: 0.59 },
    'Baixo': { selected: false, min: 0.2, max: 0.39 },
    'Mínimo': { selected: false, min: 0, max: 0.19 },
  });

  React.useEffect(() => {
    async function fetchData() {
      try {
        const stateData = await API.getStates(id);
        const { estado_id } = stateData.filter(d => d.estado_name === state)[0];
  
        const citiesData = await API.getDataByCountryAndState(id, estado_id);

        const dataGrouped = citiesData
          .reduce((r, x) => {
            r[x.properties.municipio] = r[x.properties.municipio] || [];
            r[x.properties.municipio].push(x);

            return r;
          }, {});

        const _data = Object
          .keys(dataGrouped)
          .map(key => {
            const infos = (
              dataGrouped[key].filter(({properties}) => properties.risco_fogo || properties.numero_dias_sem_chuva)
              || []
            )[0]

            return {
              state: key,
              properties: infos
                ? infos.properties
                : (dataGrouped[key][0] || []).properties
            }
          })
          .sort((a, b) => {
            const stateA = GeneralHelper.removeSpecialCharacters(a.state).toLocaleLowerCase();
            const stateB = GeneralHelper.removeSpecialCharacters(b.state).toLocaleLowerCase();

            return stateA < stateB ? -1 : stateA > stateB ? 1 : 0
          });

        setCities(_data);
      } catch (error) {
        setSnackbar({
          visible: true,
          message: 'Ocorreu um erro na consulta dos estados'
        });
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const renderSplitView = () => {
    let dataFiltered = cities.filter(({ state }) => {
      const a = GeneralHelper.removeSpecialCharacters(state).toLocaleLowerCase();
      const b = GeneralHelper.removeSpecialCharacters(searchTerm).toLocaleLowerCase();

      return a.match(b);
    });

    dataFiltered = dataFiltered.filter(({ properties }) => {
      const activeFilters = Object
        .keys(statesSelected)
        .filter(key => statesSelected[key].selected)
        .map(key => statesSelected[key]);

      if (!activeFilters.length) return true;

      return activeFilters.some(filter => {
        return properties.risco_fogo >= filter.min && properties.risco_fogo <= filter.max
      });
    });

    if (!dataFiltered.length) {
      return <Text style={{ textAlign: 'center', width: '100%' }}>Sem resultados</Text>
    }

    return (
      <Fragment>
        <View>
          {
            dataFiltered
            .map(({ state, properties }) =>
              <DetailedCard
                key={ state }
                title={ state }
                states={ states}
                satellite={ properties.satelite }
                precipitation={ properties.precipitacao || 0 }
                rainlessDays={ properties.numero_dias_sem_chuva || 0 }
                fireRisk={ properties.risco_fogo && properties.risco_fogo >=0 ? properties.risco_fogo : 0  }
              />
            )
          }
        </View>
      </Fragment>
    )
  }

  const updateStatesSelected = (key) => {
    setStatesSelected(prevState => ({
      ...prevState,
      [key]: {
        ...prevState[key],
        selected: !prevState[key].selected
      },
    }));
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
          cities.length
          ? <SearchInput
              defaultValue={ searchTerm }
              onChangeText={ text => setSearchTerm(text) }
            />
          : null
        }
        <Text style={{ fontSize: 14, color: '#333', marginBottom: 5 }}>Risco de fogo</Text>
        <View style={{
          flex: 1,
          marginBottom: 15,
          flexDirection: 'row',
          alignItems: 'flex-start',
          flexWrap: 'wrap'
        }}>
          {
            Object.keys(statesSelected).map(key =>
              <Chip
                key={ key }
                selected={ statesSelected[key].selected }
                onPress={ () => updateStatesSelected(key) }
                style={{ marginRight: 5, marginBottom: 5 }}
              >
                { key }
              </Chip>
            )
          }
        </View>
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
