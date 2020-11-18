
import React from 'react';
import color from 'color';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { useTheme, Portal, FAB } from 'react-native-paper';

import overlay from './overlay';
import { Main, Main2 } from './views';

const Tab = createMaterialBottomTabNavigator();

export const BottomTabs = (props) => {
  const routeName = props.route.state
    ? props.route.state.routes[props.route.state.index].name
    : 'Main';

  const theme = useTheme();

  let icon = 'feather';

  switch (routeName) {
    default:
      icon = 'feather';
      break;
  }

  const tabBarColor = theme.dark
    ? overlay(6, theme.colors.surface)
    : theme.colors.surface;

  return (
    <React.Fragment>
      <Tab.Navigator
        shifting
        initialRouteName="Main"
        backBehavior="initialRoute"
        activeColor={ theme.colors.accent }
        inactiveColor={ color(theme.colors.text).alpha(0.6).rgb().string() }
      >
        <Tab.Screen
          name="Main"
          component={ Main }
          options={{
            tabBarIcon: 'home-account',
            tabBarColor,
          }}
        />
        <Tab.Screen
          name="Main2"
          component={ Main2 }
          options={{
            tabBarIcon: 'home-account',
            tabBarColor,
          }}
        />
      </Tab.Navigator>
    </React.Fragment>
  );
};