
import React from 'react';
import { StatusBar } from './components'
import { useTheme } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { DefaultTheme, DarkTheme } from '@react-navigation/native';

import { StackNavigator } from './stack';
import { DrawerContent } from './drawerContent';

const Drawer = createDrawerNavigator();

export const RootNavigator = () => {
  const theme = useTheme();
  const navigationTheme = theme.dark ? DarkTheme : DefaultTheme;

  return (
    <NavigationContainer theme={ navigationTheme }>
      <StatusBar backgroundColor={ theme.colors.primary } barStyle="light-content"/>
      <Drawer.Navigator drawerContent={ props => <DrawerContent {...props} /> }>
        <Drawer.Screen name="Home" component={ StackNavigator } />
      </Drawer.Navigator>
    </NavigationContainer>
  );
};
