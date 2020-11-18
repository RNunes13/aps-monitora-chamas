
import React from 'react';

export const PreferencesContext = React.createContext({
  theme: 'light',
  toggleTheme: () => {},
});
