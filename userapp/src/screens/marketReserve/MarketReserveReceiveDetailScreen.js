import React, {Component} from 'react';
import MainScreenTheme from '../../components/controller/MainScreenTheme';
import {View, Text} from 'react-native';
import Colors from '../../constants/Colors';
import {alertNetworkError, Net, requestPost} from '../../utils/APIUtils';
import GlobalState from '../../mobx/GlobalState';

export default class MarketReserveReceiveDetail extends Component {
  componentDidMount(): void {
    requestPost(Net.marketReserve.setInquiryRead, {
      customerID: GlobalState.myInfo.id,
      inquiryID: this.props.navigation.state.params.inquiry.id,
    })
      .then(json => {
        console.log(json);
      })
      .catch(err => alertNetworkError(err));
  }

  render() {
    return (
      <MainScreenTheme
        backButton={true}
        title={'受信ボックス'}
        noPaddingHoriz={true}>
        <View
          style={{
            height: 80,
            justifyContent: 'center',
            borderBottomWidth: 1,
            borderColor: Colors.black,
          }}>
          <Text style={{textAlign: 'center'}}>
            Re： 【{this.props.navigation.state.params.inquiry.shop_name}】
          </Text>
        </View>
        <View style={{marginVertical: 20, marginHorizontal: 15}}>
          <Text style={{textAlign: 'left', lineHeight: 25}}>
            {this.props.navigation.state.params.inquiry.reply}
          </Text>
        </View>
      </MainScreenTheme>
    );
  }
}
