
import React from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { TouchableOpacity } from 'react-native';
import { Appbar, useTheme } from 'react-native-paper';
import { createStackNavigator } from '@react-navigation/stack';

import { BottomTabs } from './bottomTabs';
import { Main, CountryDetails, About, StateDetails } from './views';

const Stack = createStackNavigator();

export const StackNavigator = () => {
  const theme = useTheme();

  return (
    <Stack.Navigator
      initialRouteName="Main"
      headerMode="screen"
      screenOptions={{
        header: ({ scene, previous, navigation }) => {
          const { options } = scene.descriptor;
          const title =
            options.headerTitle !== undefined
              ? options.headerTitle
              : options.title !== undefined
              ? options.title
              : scene.route.name;

          return (
            <Appbar.Header
              theme={{ colors: { primary: theme.colors.primary } }}
            >
              {previous ? (
                <Appbar.BackAction onPress={ navigation.goBack } />
              ) : (
                <TouchableOpacity
                  style={{ marginLeft: 10 }}
                  onPress={() => { navigation.openDrawer() }}
                >
                  <Icon name="menu" size={ 30 } color="white" />
                </TouchableOpacity>
              )}
              <Appbar.Content
                title={ title }
                titleStyle={{
                  fontSize: 18,
                  fontWeight: 'bold',
                }}
              />
            </Appbar.Header>
          );
        },
      }}
    >
      <Stack.Screen
        name="About"
        component={ About }
        options={{ headerTitle: 'Sobre' }}
      />
      <Stack.Screen
        name="Main"
        component={ Main }
        options={{ headerTitle: 'Focos de calor' }}
      />
      <Stack.Screen
        name="CountryDetails"
        component={ CountryDetails }
        options={({ route }) => {
          const routeName = route.params ? route.params.name : 'País';

          return { headerTitle: routeName };
        }}
      />
      <Stack.Screen
        name="StateDetails"
        component={ StateDetails }
        options={({ route }) => {
          const routeName = route.params ? route.params.state : 'Estado';

          return { headerTitle: routeName };
        }}
      />
    </Stack.Navigator>
  );
};
