import React, {Component} from 'react';
import {
  Image,
  PanResponder,
  SafeAreaView,
} from 'react-native';
import TextStyles from '../../constants/TextStyles';
import Colors from '../../constants/Colors';
import HeavyLabel from '../../components/label/heavyLabel';
import {
  MAP_ACTUAL_HEIGHT,
  MAP_ACTUAL_WIDTH, MAP_VIEW_WIDTH,
} from '../../constants/AppConstants';

import {Net, requestPost} from '../../utils/ApiUtils';
import MyStyles from '../../constants/MyStyles';


class SelectProvinceScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      touchPoint_x: null,
      touchPoint_y: null,
    };

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
              ((gestureState.x0 - this.map_absolute_pos_x) / MAP_VIEW_WIDTH) *
              MAP_ACTUAL_WIDTH,
            touchPoint_y:
              ((gestureState.y0 - this.map_absolute_pos_y) / MAP_VIEW_WIDTH) *
              MAP_ACTUAL_WIDTH,
          },
          this.goSelectShop,
        );
      },
    });
  }

  goSelectShop = () => {
    let selectedProvince = null;
    this.coordinateList.map(item => {
      if (selectedProvince === null) {
        if (
          item.x1 <= this.state.touchPoint_x &&
          item.x2 >= this.state.touchPoint_x &&
          item.y1 <= this.state.touchPoint_y &&
          item.y2 >= this.state.touchPoint_y
        ) {
          selectedProvince = item.name;
        }
      }
    });
    if (selectedProvince) {
      this.props.navigation.navigate('SelectShop', {
        selectedProvince: selectedProvince,
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
      <SafeAreaView style={[
          MyStyles.container,
          {
            flexDirection: 'column',
            backgroundColor: Colors.black,
            alignItems: 'center',
          }]}>
        <Image
          style={MyStyles.logo_img}
          source={require('../../../assets/harutob-L.jpg')}
          resizeMode={'contain'}
          height={100}
        />
        <HeavyLabel
          label={'ログインする店舗を選択してください'}
          style={[
            TextStyles.navHeaderTitle,
            {color: Colors.orange, fontSize: 26, textAlign: 'center'},
          ]}
        />
        <Image
          onLayout={object => {
            this.map_absolute_pos_x = object.nativeEvent.layout.x;
            this.map_absolute_pos_y = object.nativeEvent.layout.y;
          }}
          {...this._panResponder.panHandlers}
          source={require('../../../assets/klipartz.com.png')}
          resizeMode={'stretch'}
          style={{
            width: MAP_VIEW_WIDTH,
            height: MAP_VIEW_WIDTH / MAP_ACTUAL_WIDTH * MAP_ACTUAL_HEIGHT,
            marginBottom: 5,
          }}
        />
      </SafeAreaView>
    );
  }
}
export default SelectProvinceScreen;
