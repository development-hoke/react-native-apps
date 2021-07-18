import React, {Component} from 'react';
import MainScreenTheme from '../../components/controller/MainScreenTheme';
import Colors from '../../constants/Colors';
import TextStyles from '../../constants/TextStyles';
import {View, Text, Image, PanResponder} from 'react-native';
import {
  LOGO_HEIGHT,
  MAP_ACTUAL_HEIGHT,
  MAP_ACTUAL_WIDTH, NAVIGATION_HEADER_HEIGHT,
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
} from '../../constants/AppConstants';
import HeavyLabel from '../../components/label/heavyLabel';
import {Net, requestPost} from '../../utils/APIUtils';

export default class MarketSearchProvinceSelect extends Component {
  constructor(props) {
    super(props);
    this.state = {province: '北海道', touchPoint_x: null, touchPoint_y: null};
    this.map_absolute_pos_x = 0;
    this.map_absolute_pos_y = 0;
    this.coordinateList = [];
    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (event, gestureState) => true,
      onMoveShouldSetPanResponder: () => false,
      onPanResponderGrant: (event, gestureState) => {
        this.setState(
          {
            touchPoint_x:
              ((gestureState.x0 - this.map_absolute_pos_x) /
                (SCREEN_WIDTH - 20)) *
              MAP_ACTUAL_WIDTH,
            touchPoint_y:
              (gestureState.y0 - this.map_absolute_pos_y) /
              ((SCREEN_WIDTH - 20) / MAP_ACTUAL_WIDTH),
          },
          this.goSelectShop,
        );
      },
    });
  }
  goSelectShop = () => {
    let selectedProvince = null;
    // let provinceID = null;
    this.coordinateList.map(item => {
      if (selectedProvince === null) {
        if (
          item.x1 <= this.state.touchPoint_x &&
          item.x2 >= this.state.touchPoint_x &&
          item.y1 <= this.state.touchPoint_y &&
          item.y2 >= this.state.touchPoint_y
        ) {
          selectedProvince = item.name;
          // provinceID = item.id;
        }
      }
    });
    if (selectedProvince) {
      this.props.navigation.navigate('MarketSearchMarketSelect', {
        province: selectedProvince,
      });
    }
  };
  componentDidMount() {
    requestPost(Net.auth.getMapCoordinate, null).then(json => {
      if (json.result === Net.error.E_OK) {
        this.coordinateList = json.coordinate;
      }
    });
  }
  render() {
    return (
      <MainScreenTheme
        backButton={true}
        menuButton={true}
        headerImage={true}
        noPaddingHoriz={true}
        backColor={Colors.black}>
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
            店舗検索 【エリアから探す】
          </Text>
        </View>
        <View
          onLayout={object => {
            this.map_absolute_pos_x = object.nativeEvent.layout.x;
            this.map_absolute_pos_y =
              object.nativeEvent.layout.y + NAVIGATION_HEADER_HEIGHT;
          }}
          style={{marginHorizontal: 10, marginTop: 10}}
          {...this._panResponder.panHandlers}>
          <HeavyLabel
            style={{
              color: Colors.white,
              fontSize: 30,
              lineHeight: 35,
              position: 'absolute',
              top: '28%',
              left: '5%',
            }}
            label={'都道府県を選択'}
          />
          <Image
            source={require('../../../assets/klipartz.com.png')}
            resizeMode={'stretch'}
            style={{
              width: '100%',
              height:
                ((SCREEN_WIDTH - 20) / MAP_ACTUAL_WIDTH) * MAP_ACTUAL_HEIGHT,
            }}
          />
        </View>
      </MainScreenTheme>
    );
  }
}
