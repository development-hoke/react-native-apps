import React, {Component} from 'react';
import {Text, View, Alert, PermissionsAndroid, Platform, Keyboard} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Ripple from 'react-native-material-ripple';
import Geolocation from 'react-native-geolocation-service';
import Autocomplete from 'react-native-autocomplete-input';
import debounce from 'lodash/debounce';

import MainScreenTheme from '../../components/controller/MainScreenTheme';
import Colors from '../../constants/Colors';
import TextStyles from '../../constants/TextStyles';
import HeavyLabel from '../../components/label/heavyLabel';
import MyTextInput from '../../components/input/MyTextInput';
import LoginButton from '../../components/button/loginButton';
import {alertNetworkError, Net, requestPost} from '../../utils/APIUtils';
import {MessageText} from '../../constants/AppConstants';
import MapView, { Marker, LatLng } from 'react-native-maps';
import GlobalState from '../../mobx/GlobalState';

export default class MarketSearchMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      shops: [],
      location: null,
      region: {
        latitude: 38.6684415,
        longitude: 137.6007843,
        latitudeDelta: 14,
        longitudeDelta: 14,
      },
      query: '',
      autoData: [],
    };
  }
  componentDidMount() {
    requestPost(Net.marketReserve.getShops, {
      customerID: GlobalState.myInfo.id,
      myShopID: GlobalState.myShop,
    }).then(json => {
      this.setState({shops: json.shopList});
    }).catch(err => {
      alertNetworkError(err);
    });

    this.getLocation();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.query != this.state.query) {
      this.queryShop(this.state.query);
    }
  }

  hasPermissionIOS = async () => {
    const openSetting = () => {
      Linking.openSettings().catch(() => {
        Alert.alert('Unable to open settings');
      });
    };
    const status = await Geolocation.requestAuthorization('whenInUse');

    if (status === 'granted') {
      return true;
    }

    if (status === 'denied') {
      Alert.alert('Location permission denied');
    }

    if (status === 'disabled') {
      Alert.alert(
        `Turn on Location Services to allow "${appConfig.displayName}" to determine your location.`,
        '',
        [
          { text: 'Go to Settings', onPress: openSetting },
          { text: "Don't Use Location", onPress: () => {} },
        ],
      );
    }

    return false;
  };

  hasLocationPermission = async () => {
    if (Platform.OS === 'ios') {
      const hasPermission = await this.hasPermissionIOS();
      return hasPermission;
    }

    if (Platform.OS === 'android' && Platform.Version < 23) {
      return true;
    }

    const hasPermission = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );

    if (hasPermission) {
      return true;
    }

    const status = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );

    if (status === PermissionsAndroid.RESULTS.GRANTED) {
      return true;
    }

    if (status === PermissionsAndroid.RESULTS.DENIED) {
      ToastAndroid.show(
        'Location permission denied by user.',
        ToastAndroid.LONG,
      );
    } else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
      ToastAndroid.show(
        'Location permission revoked by user.',
        ToastAndroid.LONG,
      );
    }

    return false;
  };

  getLocation = async () => {
    const hasPermission = await this.hasLocationPermission();

    if (!hasPermission) {
      return;
    }

    Geolocation.getCurrentPosition(
      (position) => {
        this.setState({ location: position })
        console.log(position);
      },
      (error) => {
        Alert.alert(`Code ${error.code}`, error.message);
        this.setState({ location: null })
        console.log(error);
      },
      {
        accuracy: {
          android: 'high',
          ios: 'best',
        },
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
        distanceFilter: 0,
        forceRequestLocation: true,
        forceLocationManager: false,
        showLocationDialog: true,
      },
    );
  };

  onMyLocation = () => {
    if (this.state.location != null) {
      this.map.animateToRegion({
        ...this.state.region,
        latitude: this.state.location.coords.latitude,
        longitude: this.state.location.coords.longitude,
      })
    }
  }

  onZoomMapIn = () => {
    this.map.animateToRegion({
      ...this.state.region,
      latitudeDelta: this.state.region.latitudeDelta / 2,
      longitudeDelta: this.state.region.longitudeDelta / 2,
    })
  }

  onZoomMapOut = () => {
    this.map.animateToRegion({
      ...this.state.region,
      latitudeDelta: Math.min(this.state.region.latitudeDelta * 2, 20),
      longitudeDelta: Math.min(this.state.region.longitudeDelta * 2, 20),
    })
  }

  queryShop = debounce((query) => {
    requestPost(Net.marketReserve.searchShops, {
      address: query,      
    }).then(json => {
      if (json.result === Net.error.E_OK) {
        this.setState({ autoData: json.shopList })
      }
    }).catch(err => {
      alertNetworkError(err);
    })
  }, 500);

  handleMoveToShop = (item) => {
    Keyboard.dismiss();
    this.setState({ 
      query: item.address,
      autoData: []
    })
    this.map.animateToRegion({
      latitude: item.latitude,
      longitude: item.longitude,
      latitudeDelta: 0.15,
      longitudeDelta: 0.15
    })
  }

  render() {
    const { query, autoData } = this.state;
    return (
      <MainScreenTheme
        noScrollView={true}
        noPaddingHoriz={true}
        headerImage={true}
        backButton={false}
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
            店舗検索 【マップ】
          </Text>
        </View>
        <MapView
          ref={map => { this.map = map }}
          style={{
            flex: 1,
          }}
          initialRegion={{
            latitude: 38.6684415,
            longitude: 137.6007843,
            latitudeDelta: 14,
            longitudeDelta: 14,
          }}
          onRegionChange={(reg) => this.setState({ region: reg })}
        >
          {this.state.shops.map(shop => 
            <Marker
              key={shop.id}
              coordinate={{
                latitude: shop.latitude,
                longitude: shop.longitude,
              }}
              onPress={(e) => this.props.navigation.navigate('MarketSearchMarketDetail', { passParam: shop })}
            />
          )}
        </MapView>
        <Ripple style={{
          position: 'absolute',
          right: 20,
          bottom: 112,
          width: 36,
          height: 36,
          backgroundColor: 'white',
          borderRadius: 4,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }} onPress={() => this.onMyLocation()}>
          <Icon name="crosshairs-gps" size={24} color="gray" />
        </Ripple>
        <View style={{
          position: 'absolute',
          right: 20,
          bottom: 20,
          width: 36,
          height: 72,
          backgroundColor: 'white',
          borderRadius: 4
        }}>
          <Ripple style={{
            width: 36,
            height: 36,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            borderBottomColor: '#E0E0E0',
            borderBottomWidth: 1,
          }} onPress={() => this.onZoomMapIn()}>
            <Icon name="plus" size={24} color="gray" />
          </Ripple>
          <Ripple style={{
            width: 36,
            height: 36,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }} onPress={() => this.onZoomMapOut()}>
            <Icon name="minus" size={24} color="gray" />
          </Ripple>
        </View>
        <View style={{
          position: 'absolute',
          top: 100,
          width: '80%',
          marginLeft: '10%'
        }}>
          <Autocomplete
            data={autoData}
            value={query}
            onChangeText={(text) => this.setState({ query: text })}
            containerStyle={{
              
            }}
            inputContainerStyle={{
              marginLeft: 10,
              marginRight: 10
            }}
            flatListProps={{
              keyExtractor: (_, idx) => idx.toString(),
              renderItem: ({ item }) => (
                <Ripple
                  style={{height: 30, paddingLeft: 10, justifyContent: 'center'}}
                  onPress={() => this.handleMoveToShop(item)}
                >
                  <Text>{`${item.name}(${item.address})`}</Text>
                </Ripple>
              ),
            }}
          />
        </View>
      </MainScreenTheme>
    );
  }
}
