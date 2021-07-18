import React, {Component} from 'react';
import {
  Image,
  BackHandler,
  TouchableWithoutFeedback,
  View,
  PanResponder,
  Platform,
  PermissionsAndroid
} from 'react-native';
import TextStyles from '../constants/TextStyles';
import Colors from '../constants/Colors';
import HeavyLabel from '../components/label/heavyLabel';
import LoginButton from '../components/button/loginButton';
import LoginTemplate from '../components/loginTemplate';
import {
  LOGO_HEIGHT,
  MAP_ACTUAL_HEIGHT,
  MAP_ACTUAL_WIDTH,
  MessageText,
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
} from '../constants/AppConstants';
import {Net, requestPost} from '../utils/APIUtils';
import Toast from 'react-native-root-toast';

class SelectProvinceScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: null,
      password: null,
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

  handleBackPress = () => {
    this.interval = setTimeout(() => {
      this._backPress = 0;
      clearInterval(this.interval);
    }, 1000);
    this._backPress += 1;
    if (this._backPress <= 1) {
      Toast.show(MessageText.ExitApp, {
        duration: 500,
        backgroundColor: Colors.grey,
      });
      return true;
    }
    BackHandler.exitApp();
  };
  componentDidMount() {
    this._backPress = 0;
    this.navigationFocusLisener = this.props.navigation.addListener(
      'willFocus',
      () => {
        this.backHandler = BackHandler.addEventListener(
          'hardwareBackPress',
          this.handleBackPress,
        );
      },
    );
    this.navigationBlurListener = this.props.navigation.addListener(
      'willBlur',
      () => {
        if(this.backHandler) this.backHandler.remove();
      },
    );

    requestPost(Net.auth.getMapCoordinate, null).then(json => {
      if (json.result === Net.error.E_OK) {
        this.coordinateList = json.coordinate;
      }
    });
  }
  componentWillUnmount() {
    if (this.navigationBlurListener) this.navigationBlurListener.remove();
    if (this.navigationFocusLisener) this.navigationFocusLisener.remove();
    if (this.backHandler) {
      this.backHandler.remove();
    }
  }
  render() {
    return (
      <LoginTemplate noWhitePane={true}>
        <HeavyLabel
          label={'お気に入り店舗を選択してください'}
          style={[
            TextStyles.navHeaderTitle,
            {color: Colors.orange, fontSize: 20},
          ]}
        />
        <View
          onLayout={object => {
            this.map_absolute_pos_x = object.nativeEvent.layout.x;
            this.map_absolute_pos_y = object.nativeEvent.layout.y + LOGO_HEIGHT;
          }}
          style={{marginHorizontal: 10, marginTop: 10}}
          {...this._panResponder.panHandlers}>
          <Image
            source={require('../../assets/klipartz.com.png')}
            resizeMode={'stretch'}
            style={{
              width: '100%',
              height:
                ((SCREEN_WIDTH - 20) / MAP_ACTUAL_WIDTH) * MAP_ACTUAL_HEIGHT,
            }}
          />
        </View>
        <LoginButton
          onPress={() => {
            // this.props.navigation.pop();
            this.props.navigation.navigate('Login');
          }}
          style={{
            marginTop: 20,
            marginBottom: 30,
            height: 80,
            marginHorizontal: 20,
          }}
          borderRadius={10}
          textStyle={TextStyles.buttonLabel}
          text={'ログイン\n' + '既に登録済の方はこちら'}
          buttonType={'white'}
        />
      </LoginTemplate>
    );
  }
}
export default SelectProvinceScreen;
