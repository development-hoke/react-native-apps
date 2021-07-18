/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import {observer} from 'mobx-react';
import React, {Component} from 'react';
import {StyleSheet, View, ActivityIndicator, Image} from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';
import GlobalState from './src/mobx/GlobalState';
import Colors from './src/constants/Colors';

@observer
class App extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <View style={{width: '100%', height: '100%'}}>
        <AppNavigator />
        {GlobalState.isLoading ? (
          <View
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'transparent',
            }}>
            <ActivityIndicator
              style={{backgroundColor: 'transparent'}}
              size="large"
              color={Colors.orange}
            />
          </View>
        ) : null}
      </View>
    );
  }
}

export default App;
