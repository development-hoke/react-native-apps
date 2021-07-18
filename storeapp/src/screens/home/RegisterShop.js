import React, {Component} from 'react';
import {Alert, Text, TextInput, View, StyleSheet, Image, Platform} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MapView, { Marker, LatLng } from 'react-native-maps';
import { launchImageLibrary } from 'react-native-image-picker';
import MyStyles from '../../constants/MyStyles';
import LoginTemplate from '../../components/loginTemplate';
import {requestPost, requestUpload, Net, alertNetworkError} from '../../utils/ApiUtils';
import GlobalState from '../../mobx/GlobalState';
import ButtonEx from '../../components/button/ButtonEx';
import Ripple from 'react-native-material-ripple';
import { ASYNC_PARAMS } from '../../constants/AppConstants';
import CheckBox from '../../components/button/CheckBox';

const styles = StyleSheet.create({
  label: {
    width: 300,
    textAlign: 'left',
  },
  input: {
    width: 300,
    marginBottom: 15,
  },
  button: {
    borderWidth: 1,
    borderColor: 'black',
    width: 300,
    marginBottom: 15,
  },
  imgWrapper: {
    borderColor: 'black',
    borderWidth: 1,
    marginTop: 5,
    marginBottom: 10,
    width: 360,
    height: 240,
  }
});

class RegisterShop extends Component {
  state = {
    name: '',
    brand: '',
    postal: '',
    address: '',
    email: '',
    tel_no: '',
    docomo: 0,
    reserveUrl: '',
    classUrl: '',
    image: '',
    latitude: 35.6684415,
    longitude: 139.6007843,
  };

  constructor(props) {
    super(props);
  }

  onImageSelect = () => {
    launchImageLibrary({mediaType: 'photo'}, (res) => {
      if (res.didCancel || res.errorCode) {
        return;
      }
      this.setState({ image: Platform.OS === 'android' ? res.uri : res.uri.replace('file://', '') });
    });
  }

  fetchAddress = () => {
    if (this.state.postal == '') return;
    const zipcode = this.state.postal;
    const cZipcode = zipcode.slice(0, 3) + '-' + zipcode.slice(3, 7);
    requestPost(Net.auth.getAddress, {
      code: cZipcode
    }).then(v => {
      if (v.location.results.length > 0) {
        const loc = v.location.results[0];
        this.setState({ 
          address: `${v.text.name_p} ${v.text.name_c}`,
          latitude: loc.Latitude,
          longitude: loc.Longitude,
        });
      }
    }).catch(err => {
      alertNetworkError(err);
    });
  }

  apiRegister = () => {
    const data = {
      ...this.state,
      link: this.state.reserveUrl,
      class_link: this.state.classUrl,
      deviceID: GlobalState.deviceId,
    }
    requestUpload(Net.auth.register, data, this.state.image).then(json => {
      if (json.result === Net.error.E_OK) {
        Alert.alert(
          '登録成功',
          '店舗登録が申請されました。',
        );
        this.props.navigation.navigate('Login');
      }
    }).catch(err => {
      alertNetworkError(err);
    })
  }

  render() {
    return (
      <LoginTemplate>
        <Text style={{...styles.label, marginTop: 15}}>ショップ名</Text>
        <TextInput
          style={[MyStyles.input, styles.input]}
          value={this.state.name}
          onChangeText={value => {
            this.setState({name: value});
          }}
        />
        <Text style={styles.label}>代理店名</Text>
        <TextInput
          style={[MyStyles.input, styles.input]}
          value={this.state.brand}
          onChangeText={value => {
            this.setState({brand: value});
          }}
        />
        <Text style={styles.label}>郵便番号</Text>
        <View style={{flexDirection: 'row'}}>
          <TextInput
            style={{...MyStyles.input, ...styles.input, width: 250}}
            value={this.state.postal}
            onChangeText={value => {
              this.setState({postal: value});
            }}
          />
          <ButtonEx
            style={{...styles.button, width: 40, marginLeft: 10}}
            text={'〒'}
            onPress={this.fetchAddress}
          />
        </View>
        <Text style={styles.label}>住所</Text>
        <TextInput
          style={[MyStyles.input, styles.input]}
          value={this.state.address}
          onChangeText={value => {
            this.setState({address: value});
          }}
        />
        <Text style={styles.label}>代理店メールアドレス</Text>
        <TextInput
          style={[MyStyles.input, styles.input]}
          value={this.state.email}
          onChangeText={value => {
            this.setState({email: value});
          }}
        />
        <Text style={styles.label}>電話番号</Text>
        <TextInput
          style={[MyStyles.input, styles.input]}
          value={this.state.tel_no}
          onChangeText={value => {
            this.setState({tel_no: value});
          }}
        />
        <CheckBox
          label={'ドコモショップ'}
          checkBox_size={20}
          space_size={10}
          isActive={this.state.docomo == 1}
          onPress={isChecked => {
            this.setState({docomo: isChecked ? 1 : 0});
          }}
        />
        {this.state.docomo == 1 && (
          <>
            <Text style={{...styles.label, marginTop: 15}}>予約ページURL</Text>
            <TextInput
              style={[MyStyles.input, styles.input]}
              value={this.state.reserveUrl}
              onChangeText={value => {
                this.setState({reserveUrl: value});
              }}
            />
            <Text style={styles.label}>スマホ教室URL</Text>
            <TextInput
              style={[MyStyles.input, styles.input]}
              value={this.state.classUrl}
              onChangeText={value => {
                this.setState({classUrl: value});
              }}
            />
          </>
        )}
        <MapView
          style={{
            width: '90%',
            height: 500,
            margin: 20,
          }}
          initialRegion={{
            latitude: 38.6684415,
            longitude: 137.6007843,
            latitudeDelta: 15,
            longitudeDelta: 15,
          }}
        >
          <Marker
            draggable
            coordinate={{
              latitude: this.state.latitude,
              longitude: this.state.longitude,
            }}
            onDragEnd={(e) => {
              this.setState({
                latitude: e.nativeEvent.coordinate.latitude,
                longitude: e.nativeEvent.coordinate.longitude,
              })
            }}
          />
        </MapView>
        <Text style={styles.label}>画像</Text>
        <Ripple
          style={styles.imgWrapper}
          onPress={(e) => this.onImageSelect()}
        >
          {this.state.image != '' && (<Image
            source={{uri: this.state.image}}
            style={{width: '100%', height: '100%'}}
            resizeMode={'contain'}
          />)}
        </Ripple>
        <ButtonEx
          style={styles.button}
          type={'black'}
          text={'申請'}
          onPress={this.apiRegister}
        />
      </LoginTemplate>
    );
  }
}

export default RegisterShop;
