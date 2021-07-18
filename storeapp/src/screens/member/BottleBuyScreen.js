import React, {Component} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Image,
  TouchableHighlight,
  TouchableOpacity,
  ImageBackground, Alert,
} from 'react-native';
import ButtonEx from '../../components/button/ButtonEx';
import TextStyles from '../../constants/TextStyles';
import {SCREEN_WIDTH, SCREEN_HEIGHT} from '../../constants/AppConstants';
import {Net, requestPost, alertNetworkError} from '../../utils/ApiUtils';
import GlobalState from '../../mobx/GlobalState';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 50,
  },
  imageColumn: {
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    flex: 1,
    marginTop: 10,
  },
  radiusView: {
    alignItems: 'center',
    borderRadius: SCREEN_HEIGHT*3/10,
    borderWidth: 2,
    borderColor: '#FF0000',
    width: SCREEN_HEIGHT*3/5,
    height: SCREEN_HEIGHT*3/5,
  }
});

export default class BottleManagerScreen extends Component {
  state = {
    halfbottle: true,
    fullbottle: false,
  };

  bottleInput() {
    requestPost(Net.bottle.input, {
      id: this.props.navigation.state.params.memberId,
      half: this.state.halfbottle,
      full: this.state.fullbottle,
    })
      .then(json => {
        this.setState({bottleUseData: json.bottleUseData});
        this.props.navigation.navigate('BottleManager');
      })
      .catch(err => {
        alertNetworkError(err);
      });
  }
  checkHalfBottle = () => {
    this.setState({
      halfbottle: true,
      fullbottle: false,
    });
  };
  checkFullBottle = () => {
    this.setState({
      halfbottle: false,
      fullbottle: true,
    });
  };
  render() {
    return (
      <SafeAreaView style={{flex: 1, flexDirection: 'column'}}>
        <View
          style={[
            styles.container,
            {
              flex: 4,
              flexDirection: 'row',
              marginLeft: 20,
              marginBottom: 20,
            },
          ]}>
          <View style={{flex: 1, alignItems: 'center'}}>
            <TouchableOpacity
              style={[
                styles.radiusView,
                {},
                !this.state.halfbottle && {borderWidth: 0},
              ]}
              onPress={() => this.checkHalfBottle()}>
              <Image
                source={require('../../../assets/bottle_L.png')}
                style={styles.image}
                resizeMode={'contain'}
              />
              <Text style={[TextStyles.loginLabel, {marginBottom: 30}]}>
                50cc
              </Text>
            </TouchableOpacity>
          </View>
          <View style={{flex: 1, alignItems: 'center'}}>
            <TouchableOpacity style={[
                styles.radiusView,
                {},
                !this.state.fullbottle && {borderWidth: 0},
              ]}
              onPress={() => this.checkFullBottle()}>
              <Image
                source={require('../../../assets/bottle_W.png')}
                style={styles.image}
                resizeMode={'contain'}
              />
              <Text style={[TextStyles.loginLabel,{marginBottom: 30}]}>
                100cc
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            marginTop: 10,
            marginBottom: 20,
          }}>
          <ButtonEx
            onPress={() => {
              this.bottleInput();
            }}
            style={{
              backgroundColor: '#FFC000',
              borderWidth: 1,
            }}
            text={'購入'}
            type={'warning'}
            textStyle={{
              marginLeft: 30,
              marginRight: 30,
            }}
          />
        </View>
      </SafeAreaView>
    );
  }
}
