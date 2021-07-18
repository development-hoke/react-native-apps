import React from 'react';
import {Text, View, StyleSheet, Image} from 'react-native';
import TextStyles from '../../constants/TextStyles';
import MainScreenTheme from '../../components/controller/MainScreenTheme';
import Colors from '../../constants/Colors';
import Ripple from 'react-native-material-ripple';

export default class MarketSearchMain extends React.Component {
  render() {
    return (
      <MainScreenTheme
        noPaddingHoriz={true}
        headerImage={true}
        menuButton={true}>
        <View
          style={{
            backgroundColor: Colors.black,
            justifyContent: 'center',
            height: 80,
          }}>
          <Text
            style={[
              {textAlign: 'center', fontSize: 25},
              TextStyles.whiteText,
              TextStyles.bold,
            ]}>
            店舗検索
          </Text>
        </View>
        <View
          style={{
            marginHorizontal: 5,
            marginTop: 1,
            borderTopWidth: 1,
            borderBottomWidth: 1,
            borderColor: Colors.black,
          }}>
          <Ripple
            onPress={() => {
              this.props.navigation.navigate('MarketSearchProvinceSelect');
            }}
            style={{
              borderBottomWidth: 1,
              borderColor: Colors.black,
              flexDirection: 'row',
              height: 100,
              alignItems: 'center',
              paddingLeft: 10,
            }}>
            <Image
              source={require('../../../assets/map.png')}
              resizeMode={'contain'}
              style={{flex: 1}}
            />
            <Text
              style={{
                fontSize: 20,
                fontWeight: 'bold',
                flex: 4,
                paddingLeft: 10,
              }}>
              エリアから探す
            </Text>
          </Ripple>
          <Ripple
            onPress={() => {
              this.props.navigation.navigate('MarketSearchMap');
            }}
            style={{
              flexDirection: 'row',
              height: 100,
              alignItems: 'center',
              paddingLeft: 10,
            }}>
            <Image
              source={require('../../../assets/currentPosition.png')}
              resizeMode={'contain'}
              style={{flex: 1}}
            />
            <Text
              style={{
                fontSize: 20,
                fontWeight: 'bold',
                flex: 4,
                paddingLeft: 10,
              }}>
              現在地から探す
            </Text>
          </Ripple>
        </View>
      </MainScreenTheme>
    );
  }
}
