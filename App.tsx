// TH1 | 23688581 | PHAM THANH HUNG | #240681

import React from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {ThemeProvider} from '@contexts/ThemeContext';

import HomeScreen from '@screens/HomeScreen';

const App = () => {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <HomeScreen />
      </ThemeProvider>
    </SafeAreaProvider>
  );
};

export default App;