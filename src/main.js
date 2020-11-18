
import React from 'react';
import AsyncStorage from "@react-native-community/async-storage";
import { RootNavigator } from './rootNavigator';
import { useColorScheme } from 'react-native-appearance';
import { PreferencesContext } from './context/preferencesContext';

import { Provider as PaperProvider, DefaultTheme, DarkTheme } from 'react-native-paper';

const themeStoreKey = 'appTheme';

export default function Main() {
  const colorScheme = useColorScheme();

  // const getTheme = async () => {
  //   const savedTheme = await AsyncStorage.getItem(themeStoreKey);

  //   if (savedTheme) return savedTheme;

  //   return colorScheme === 'dark' ? 'dark' : 'light'
  // };

  const [theme, setTheme] = React.useState('light');

  async function toggleTheme() {
    setTheme(theme => (theme === 'light' ? 'dark' : 'light'));
    
    // try {
    //   await AsyncStorage.setItem(themeStoreKey, (theme => (theme === 'light' ? 'dark' : 'light'))());
    // } catch (error) {
    //   console.error('Error saving data');
    // }
  }

  const preferences = React.useMemo(
    () => ({
      toggleTheme,
      theme,
    }),
    [theme]
  );

  const appTheme = () => {
    if (theme === 'light') {
      return {
        ...DefaultTheme,
        colors: {
          ...DefaultTheme.colors,
          primary: '#1b262c',
          accent: '#3282b8',
        },
      }
    }

    if (theme === 'dark') {
      return {
        ...DarkTheme,
        colors: {
          ...DarkTheme.colors,
          primary: '#1b262c',
          accent: '#3282b8',
        },
      }
    }
  }

  return (
    <PreferencesContext.Provider value={ preferences }>
      <PaperProvider theme={ appTheme() }>
        <RootNavigator />
      </PaperProvider>
    </PreferencesContext.Provider>
  );
};
