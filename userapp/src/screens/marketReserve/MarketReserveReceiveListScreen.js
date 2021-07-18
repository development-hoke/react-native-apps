import React, {Component} from 'react';
import {FlatList} from 'react-native-gesture-handler';
import MainScreenTheme from '../../components/controller/MainScreenTheme';
import Ripple from 'react-native-material-ripple';
import Colors from '../../constants/Colors';
import {Text, View} from 'react-native';
import {alertNetworkError, Net, requestPost} from '../../utils/APIUtils';
import GlobalState from '../../mobx/GlobalState';

export default class MarketReserveReceiveList extends Component {
  constructor(props) {
    super(props);
    this.state = {data: []};
  }
  addIsReadToData = (data, readInquiryList) => {
    return data.map((item, index) => {
      let isRead = false;
      readInquiryList.forEach(it => {
        if (it.f_inquiry === item.id) {
          isRead = true;
          return;
        }
      });
      return Object.assign(item, {isRead: isRead});
    });
  };
  componentDidMount() {
    this.reload = this.props.navigation.addListener('willFocus', () => {
      requestPost(Net.marketReserve.getQuestionList, {
        customerID: GlobalState.myInfo.id,
      })
        .then(json => {
          let inquiryList = json.inquiryList;
          let readInquiryList = json.readInquiryList;
          this.setState({
            data: this.addIsReadToData(inquiryList, readInquiryList),
          });
        })
        .catch(err => alertNetworkError(err));
    });
  }
  componentWillUnmount() {
    this.reload.remove();
  }

  renderItem = ({item}) => {
    return (
      <Ripple
        onPress={() => {
          this.props.navigation.navigate('MarketReserveReceiveDetail', {
            inquiry: item,
          });
        }}
        style={{
          height: 120,
          borderBottomWidth: 1,
          borderBottomColor: Colors.black,
        }}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <View
            style={{
              paddingHorizontal: 10,
              paddingVertical: 5,
              backgroundColor: Colors.light_blue,
              width: 120,
              marginRight: 20,
            }}>
            <Text style={{textAlign: 'center'}}>
              {item.kind === 0 ? 'お問い合わせ' : '来店予約'}
            </Text>
          </View>
          <Text>Re : 【{item.shop_name}】</Text>
        </View>
        <Text style={{marginVertical: 10, marginHorizontal: 15}}>{item.content}</Text>
        {!item.isRead ? (
          <View
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: 20,
              height: 20,
              borderBottomLeftRadius: 20,
              backgroundColor: Colors.orange,
            }}
          />
        ) : null}
      </Ripple>
    );
  };
  render() {
    return (
      <MainScreenTheme
        noScrollView={true}
        backButton={true}
        title={'受信ボックス'}
        noPaddingHoriz={true}>
        <FlatList data={this.state.data} renderItem={this.renderItem} />
      </MainScreenTheme>
    );
  }
}
