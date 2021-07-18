import React, {Component} from 'react';
import Colors from '../constants/Colors';
import {Text, View} from 'react-native';
import ScrollableTabView from 'react-native-scrollable-tab-view';

export default class Test extends Component {
  render() {
    return (
      <View>
        <ScrollableTabView
          tabBarInactiveTextColor={Colors.warm_grey}
          initialPage={0}
          locked={true}
          tabBarActiveTextColor={Colors.black}
          tabBarUnderlineStyle={{ backgroundColor: Colors.black, height: 2 }}
        >
          <View tabLabel="나에게 관심있는 이성" style={[{ flex: 1, width: "100%" }]}>
            <Text>afsdf</Text>
          </View>

          <View tabLabel="이전 카드" style={[{ flex: 1, width: "100%" }]}>
            <Text>aaaaaaaaaaaaa</Text>
          </View>
        </ScrollableTabView>
      </View>
    );
  }
}
