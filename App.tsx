import React from 'react';
import {StatusBar} from 'react-native';
import {Provider} from 'react-redux';
import store from './src/redux/store';
import {ThemeProvider, useTheme} from './src/contexts/ThemeContext';
import 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';
import MovieBrowserScreen from './src/screens/MovieBrowserScreen';
import SearchScreen from './src/screens/SearchScreen';
import {RootStackParamList} from './src/types/navigation';

const Stack = createStackNavigator<RootStackParamList>();

const AppContent = () => {
  const {theme} = useTheme();

  return (
    <>
      <StatusBar
        barStyle={theme.dark ? 'light-content' : 'dark-content'}
        backgroundColor={theme.colors.background}
      />
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            cardStyle: {backgroundColor: theme.colors.background},
            ...TransitionPresets.ModalFadeTransition,
          }}>
          <Stack.Screen name="MovieBrowser" component={MovieBrowserScreen} />
          <Stack.Screen name="Search" component={SearchScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
};

function App(): React.JSX.Element {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </Provider>
  );
}

export default App;
