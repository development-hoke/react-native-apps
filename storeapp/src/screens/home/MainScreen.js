import React, {Component} from 'react';
import {View, StyleSheet, BackHandler, Text} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ButtonEx from '../../components/button/ButtonEx';
import MainLayout from '../../components/container/MainLayout';
import GlobalState from '../../mobx/GlobalState';
import Toast from 'react-native-root-toast';
import {alertNetworkError, Net, requestGet} from '../../utils/ApiUtils';
import { ASYNC_PARAMS } from '../../constants/AppConstants';

const styles = StyleSheet.create({
  btnView: {
    flex: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    marginBottom: 10,
  },
  button: {
    flex: 1,
    marginLeft: 10,
    marginRight: 10,
  },
});

export default class MainScreen extends Component {
  state = {
    canExit: false,
    new_reserve_count: null,
    new_inquiry_count: null,
    new_atec_count: null,
  };

  componentDidMount() {
    this.navigationFocusLisener = this.props.navigation.addListener(
      'willFocus',
      () => {
        GlobalState.backHandler = BackHandler.addEventListener(
          'hardwareBackPress',
          this.handleBackPress,
        );
        requestGet(Net.main.get)
          .then(json => {
            console.log(json);
            this.setState({new_reserve_count: json.new_reserve_count});
            this.setState({new_inquiry_count: json.new_inquiry_count});
            this.setState({new_atec_count: json.new_atec_count});
          })
          .catch(err => {
            alertNetworkError(err);
          });
      },
    );
    this.navigationBlurListener = this.props.navigation.addListener(
      'willBlur',
      () => {
        GlobalState.backHandler.remove();
      },
    );
  }

  componentWillUnmount() {
    this.navigationBlurListener.remove();
    this.navigationFocusLisener.remove();
  }

  handleBackPress = () => {
    if (this.state.canExit) {
      BackHandler.exitApp();
    }
    Toast.show('終了しようとすれば後に行くのをまた押してください.', {
      duration: 1000,
    });
    this.setState({canExit: true});
    this.interval = setInterval(() => {
      this.setState({canExit: false});
      clearInterval(this.interval);
    }, 1000);
    return true;
  };

  handleLogOut = async () => {
    await AsyncStorage.setItem(ASYNC_PARAMS.IS_LOGIN, 'false');
    BackHandler.exitApp();
  }

  render() {
    return (
      <MainLayout
        homeCallback={() => this.props.navigation.navigate('Main')}
        middleHeader={
          <ButtonEx
            style={{paddingHorizontal: 40}}
            text={'提案ツール'}
            type={'primary'}
            onPress={() => {
              this.props.navigation.navigate('CarryingTool');
            }}
            textStyle={{ fontSize: 30 }}
          />
        }
        rightHeader={
          <ButtonEx
            style={{marginRight: 10}}
            text={'業務を終了する'}
            type={'secondary'}
            onPress={this.handleLogOut}
          />
        }>
        <View style={[styles.btnView, {flex: 0.2}]}></View>
        <View style={{...styles.btnView, flex: 1.5}}>
          <ButtonEx
            onPress={() => this.props.navigation.navigate('CarryingRegister', {memberId: 0})}
            text={'施工登録'}
            type={'warning'}
            style={styles.button}
            icon={'magic'}
            iconSize={40}
            textStyle={{ fontSize: 40 }}
          />
          <ButtonEx
            text={'見積り'}
            onPress={() => this.props.navigation.navigate('CalculationManager')}
            type={'warning'}
            style={styles.button}
            icon={'print'}
            iconSize={30}
            iconSize={40}
            textStyle={{ fontSize: 40 }}
          />
          <ButtonEx
            type={'warning'}
            onPress={() => this.props.navigation.navigate('AtecManager')}
            text={'アーテック\n通信'}
            style={styles.button}
            icon={'bell'}
            iconSize={40}
            textStyle={{ fontSize: 40 }}
            new={this.state.new_atec_count}
          />
        </View>
        <View style={styles.btnView}>
          <ButtonEx
            new={this.state.new_reserve_count}
            text={'マイページ\n' +'編集'}
            onPress={() => this.props.navigation.navigate('MyShopEdit')}
            type={'warning'}
            style={styles.button}
            iconSize={40}
            textStyle={{ fontSize: 40 }}
          />
          <ButtonEx
            text={'マイショップ会員\nにプッシュ通知'}
            onPress={() => this.props.navigation.navigate('NoticeRequest')}
            type={'warning'}
            style={styles.button}
            // icon={'envelope'}
            iconSize={40}
            textStyle={{ fontSize: 40 }}
          />
          <ButtonEx
            type={'warning'}
            onPress={() => this.props.navigation.navigate('CouponRequest')}
            text={'クーポン申請'}
            style={styles.button}
            iconSize={40}
            textStyle={{ fontSize: 40 }}
          />
        </View>
        <View style={[styles.btnView, {flex: 1}]}>
          <ButtonEx
            onPress={() => this.props.navigation.navigate('CarryingHistory')}
            text={'受付履歴'}
            type={'secondary'}
            style={[styles.button]}
            textStyle={{ fontSize: 40 }}
          />
          <ButtonEx
            text={'トスアップ申請'}
            type={'secondary'}
            style={styles.button}
            onPress={() => this.props.navigation.navigate('Tossup')}
            textStyle={{ fontSize: 40 }}
          />
          <ButtonEx
            text={'施工マニュアル'}
            type={'secondary'}
            style={styles.button}
            onPress={() => this.props.navigation.navigate('Manual')}
            textStyle={{ fontSize: 40 }}
          />
        </View>
        <View style={[styles.btnView, {flex: 0.5, paddingLeft: 20}]}>
          <Text>Copyright © 2021 Haruto Coating</Text>
        </View>
      </MainLayout>
    );
  }
}
