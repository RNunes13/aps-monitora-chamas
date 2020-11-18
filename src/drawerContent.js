
import React from 'react';
import packageJson from '../package.json';
import Animated from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { StyleSheet, View } from 'react-native';
import { PreferencesContext } from './context/preferencesContext';

import {
  DrawerContentScrollView, DrawerItem,
} from '@react-navigation/drawer';

import {
  Drawer, Switch, Text, Title, TouchableRipple, useTheme, Caption, Avatar
} from 'react-native-paper';

export function DrawerContent(props) {
  const paperTheme = useTheme();

  const { theme, toggleTheme } = React.useContext(
    PreferencesContext
  );

  const translateX = Animated.interpolate(props.progress, {
    inputRange: [0, 0.5, 0.7, 0.8, 1],
    outputRange: [-100, -85, -70, -45, 0],
  });

  return (
    <DrawerContentScrollView { ...props } style={{ backgroundColor: '#e5e5e5' }}>
      <Animated.View
        style={[
          styles.drawerContent,
          {
            transform: [{ translateX }],
          },
        ]}
      >
        <View style={ styles.userInfoSection }>
          <Avatar.Image
            source={ require('./assets/images/logo.png') }
            style={{ backgroundColor: 'transparent' }}
            size={ 70 }
          />
          <Title style={ styles.title }>MonitoraChamas</Title>
          <Caption style={ styles.caption }>v{ packageJson.version }</Caption>
        </View>
        {/* <Drawer.Section title="Preferências">
          <TouchableRipple onPress={ toggleTheme }>
          <View style={ styles.preference }>
          <Text>Tema escuro</Text>
          <View pointerEvents="none">
          <Switch value={ theme === 'dark' } />
          </View>
          </View>
          </TouchableRipple>
        </Drawer.Section> */}
        <Drawer.Section style={ styles.drawerSection }>
          <DrawerItem
            icon={({ color, size }) => (
              <Icon name="supervisor-account" size={ 30 } color="#1b262c" />
            )}
            onPress={ () => props.navigation.navigate('About') }
            label="Sobre"
          />
        </Drawer.Section>
      </Animated.View>
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1
  },
  userInfoSection: {
    paddingLeft: 20,
  },
  title: {
    marginTop: 20,
    fontWeight: 'bold',
  },
  caption: {
    fontSize: 14,
    lineHeight: 14,
  },
  row: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  paragraph: {
    fontWeight: 'bold',
    marginRight: 3,
  },
  drawerSection: {
    marginTop: 15,
  },
  preference: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
});
