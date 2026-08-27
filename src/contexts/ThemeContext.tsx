// import React, {
//   createContext,
//   useContext,
//   useState,
//   useMemo,
// } from 'react';
// import {LIGHT_THEME, DARK_THEME} from '@constants/theme';
//
// type ThemeMode = 'light' | 'dark';
//
// interface ThemeContextType {
//   mode: ThemeMode;
//   theme: typeof LIGHT_THEME;
//   toggleTheme: () => void;
// }
//
// const ThemeContext = createContext<ThemeContextType | undefined>(
//   undefined,
// );
//
// export const ThemeProvider: React.FC<{children: React.ReactNode}> = ({
//   children,
// }) => {
//   const [mode, setMode] = useState<ThemeMode>('light');
//
//   const toggleTheme = () => {
//     setMode(prev => (prev === 'light' ? 'dark' : 'light'));
//   };
//
//   const value = useMemo(
//     () => ({
//       mode,
//       theme: mode === 'light' ? LIGHT_THEME : DARK_THEME,
//       toggleTheme,
//     }),
//     [mode],
//   );
//
//   return (
//     <ThemeContext.Provider value={value}>
//       {children}
//     </ThemeContext.Provider>
//   );
// };
//
// export const useTheme = () => {
//   const context = useContext(ThemeContext);
//   if (context === undefined) {
//     throw new Error('useTheme must be used within a ThemeProvider');
//   }
//   return context;
// };
//=================================================================
import React, {
  createContext,
  useContext,
  useMemo,
  useState,
} from 'react';

import {LIGHT_THEME, DARK_THEME} from '@constants/theme';

type ThemeMode = 'light' | 'dark';

interface ThemeContextType {
  mode: ThemeMode;
  theme: typeof LIGHT_THEME;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(
  undefined,
);

export const ThemeProvider: React.FC<{children: React.ReactNode}> = ({
  children,
}) => {
  const [mode, setMode] = useState<ThemeMode>('light');

  const toggleTheme = () => {
    setMode(prev => {
      if (prev === 'light') {
        return 'dark';
      }

      return 'light';
    });
  };

  const theme = mode === 'light' ? LIGHT_THEME : DARK_THEME;

  const value = useMemo(
    () => ({
      mode,
      theme,
      toggleTheme,
    }),
    [mode, theme],
  );

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);

  if (context === undefined) {
    throw new Error(
      'useTheme must be used within a ThemeProvider',
    );
  }

  return context;
};