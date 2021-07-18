import React, {Component} from 'react';
import {View, Text, Image, FlatList, BackHandler} from 'react-native';
import Colors from '../../constants/Colors';
import MainScreenTheme from '../../components/controller/MainScreenTheme';
import {
  ASYNC_PARAMS,
  MessageText,
  SCREEN_WIDTH,
} from '../../constants/AppConstants';
import Carousel from 'react-native-snap-carousel/src/carousel/Carousel';
import {Pagination} from 'react-native-snap-carousel';
import TextStyles from '../../constants/TextStyles';
import Ripple from 'react-native-material-ripple';
import Toast from 'react-native-root-toast';
import GlobalState from '../../mobx/GlobalState';
import AsyncStorage from '@react-native-community/async-storage';
import {observer} from 'mobx-react';
import {alertNetworkError, Net, requestGet, requestPost} from '../../utils/APIUtils';

@observer
class TopMainScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeImageIndex: 0, 
      imageList: imageList, 
      canExit: false,
      topics: [],
    };
  }

  componentDidMount() {
    requestGet(Net.topic.getTopicList).then(json => {
      this.setState({ topics: json.topics })
    }).catch(err => alertNetworkError(err));

    AsyncStorage.getItem(ASYNC_PARAMS.MY_INFO, (error, result) => {
      if (result) {
        GlobalState.myInfo = JSON.parse(result);
        requestPost(Net.marketSearch.getMyShop, {
          customerID: GlobalState.myInfo.id,
        }).then(json => {
          if (json.result === Net.error.E_OK) {
            GlobalState.myShop = json.myShop.f_shop_id;
          }
        }).catch(err => alertNetworkError(err));
      }
    });

    AsyncStorage.getItem(ASYNC_PARAMS.ACCESS_TOKEN, (error, result) => {
      if (result) {
        GlobalState.loginStatus.accessToken = result;
      }
    });

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
  }

  componentWillUnmount() {
    if(this.navigationBlurListener) this.navigationBlurListener.remove();
    if(this.navigationFocusLisener) this.navigationFocusLisener.remove();
    if(this.backHandler) this.backHandler.remove();
  }

  handleBackPress = () => {
    Toast.show(MessageText.ExitApp, {
      duration: 500,
      backgroundColor: Colors.grey,
    });
    if (this.state.canExit) BackHandler.exitApp();
    this.setState({canExit: true});
    this.interval = setInterval(() => {
      this.setState({canExit: false});
      clearInterval(this.interval);
    }, 1000);
    return true;
  };

  renderImage = ({item, index}) => {
    return (
      <Ripple onPress={() => this.onTopic(item)}>
        <Image
          source={{ uri: item.image_link }}
          resizeMode={'stretch'}
          style={{width: '100%', height: 200}}
        />
      </Ripple>
    );
  };

  onTopic = (item) => {
    this.props.navigation.navigate('Topic', {
      topic: item
    });
  }

  render() {
    const { topics } = this.state;
    return (
      <MainScreenTheme
        headerImage={true}
        menuButton={true}
        noPaddingHoriz={true}>
        <Carousel
          activeSlideAlignment="center"
          ref={c => {
            this._carousel = c;
          }}
          inactiveSlideScale={0.85}
          data={topics}
          renderItem={this.renderImage}
          onSnapToItem={index => this.setState({activeImageIndex: index})}
          sliderWidth={SCREEN_WIDTH}
          itemWidth={SCREEN_WIDTH}
        />
        <Pagination
          dotsLength={topics.length}
          activeDotIndex={this.state.activeImageIndex}
          dotContainerStyle={{height: 20}}
          containerStyle={{
            backgroundColor: 'transparent',
            paddingVertical: 0,
          }}
          dotStyle={{
            width: 10,
            height: 10,
            borderRadius: 10,
            borderWidth: 1,
            borderColor: Colors.white,
            backgroundColor: Colors.light_orange,
            marginHorizontal: -10,
          }}
          inactiveDotStyle={{
            width: 10,
            height: 10,
            borderRadius: 10,
            borderWidth: 1,
            backgroundColor: '#AFABAB',
          }}
          inactiveDotOpacity={0.1}
          inactiveDotScale={1}
        />
        <View
          style={{
            backgroundColor: Colors.black,
            height: 60,
            marginHorizontal: 5,
            justifyContent: 'center',
          }}>
          <Text
            style={[
              TextStyles.whiteText,
              {fontSize: 25, textAlign: 'center', letterSpacing: 2},
            ]}>
            TOPICS
          </Text>
        </View>
        <View style={{marginHorizontal: 20, marginVertical: 5}}>
          {topics.map((item, index) => (
            <Ripple
              key={item.id}
              style={{
                borderWidth: 2,
                borderColor: Colors.black,
                marginBottom: 10,
              }}
              onPress={() => this.onTopic(item)}
              >
              <View
                style={{
                  backgroundColor: 'white',
                  width: '100%',
                  height: 200,
                }}
              >
                <Image 
                  source={{ uri: item.image_link }}
                  style={{
                    width: '100%',
                    height: '100%'
                  }}
                  resizeMode={'stretch'}
                />
              </View>
              <Text
                style={{
                  textAlign: 'center',
                  padding: 20,
                  fontWeight: 'bold',
                  fontSize: 20,
                  lineHeight: 30,
                }}>
                {item.title}
              </Text>
            </Ripple>
          ))}
        </View>
      </MainScreenTheme>
    );
  }
}

const imageList = [
  {image: require('../../../assets/test.jpg'), key: '1'},
  {image: require('../../../assets/test.jpg'), key: '2'},
  {image: require('../../../assets/test.jpg'), key: '3'},
];

const itemList = [
  {
    content: 'ハルトショップ枚方藤坂店\n' + '2020年１月31日にOPEN!!10時～',
    key: '1',
  },
  {
    content: 'ハルトショップ枚方藤坂店\n' + '2020年１月31日にOPEN!!10時～',
    key: '2',
  },
];

export default TopMainScreen;
