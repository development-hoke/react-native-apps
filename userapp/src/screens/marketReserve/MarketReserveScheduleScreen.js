import React, {Component} from 'react';
import {
  TextInput,
  Text,
  StyleSheet,
  View,
  // TouchableWithoutFeedback,
} from 'react-native';
import MainScreenTheme from '../../components/controller/MainScreenTheme';
import Colors from '../../constants/Colors';
import TextStyles from '../../constants/TextStyles';
import CalendarSchedule from '../../components/controller/CalendarSchedule';
import RNPickerSelect from 'react-native-picker-select';
import LoginButton from '../../components/button/loginButton';
import Icon from 'react-native-vector-icons/FontAwesome';
import {alertNetworkError, Net, requestPost} from '../../utils/APIUtils';
import GlobalState from '../../mobx/GlobalState';
import {LOAD_CALENDAR_TYPE, MessageText} from '../../constants/AppConstants';
import Toast from 'react-native-root-toast';
import {observer} from 'mobx-react';
import Common from '../../utils/Common';
import MyStyles from '../../constants/MyStyles';

@observer
class MarketReserveSchedule extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hopeMarket: '',
      purpose: '',
      other: '',
      shopList: [],
      reserveDate: null,
    };
  }
  getShopList = () => {
    requestPost(Net.marketReserve.getShops, {myShopID: GlobalState.myShop})
      .then(json => {
        let shopList = [];
        if (json.shopList && json.shopList.length > 0) {
          json.shopList.map(item => {
            shopList.push({
              key: item.id.toString(),
              label: item.name,
              value: item.id,
            });
          });
          this.setState({
            shopList: shopList,
          });
        }
      })
      .catch(err => {
        alertNetworkError(err);
      });
  };
  onShopChange = value => {
    this.setState({hopeMarket: value});
    GlobalState.selectedShopID = value;
    if (value === '') {
      this.scheduleCalendar.clearScheduleData();
    } else {
      requestPost(Net.marketReserve.getReservedDataByShop, {
        shopID: value,
        customerID: GlobalState.myInfo.id,
      })
        .then(json => {
          GlobalState.restDateList = json.restDateList;
          GlobalState.reservedData = json.reservedData;
          this.scheduleCalendar.initCalendar(
            LOAD_CALENDAR_TYPE.ONLY_SCHEDULE_DATA,
          );
        })
        .catch(err => alertNetworkError(err));
    }
  };
  componentDidMount() {
    if (this.props.navigation.state.params) {
      this.setState(
        {hopeMarket: this.props.navigation.state.params.shopID},
        () => {
          this.onShopChange(this.state.hopeMarket);
        },
      );
    }
    this.getShopList();
  }
  doReserve = () => {
    let reservedData = this.state.reserveDate;
    if (this.state.hopeMarket === '') {
      Common.showToast(MessageText.SelectMarket);
      return;
    }
    if (reservedData === null) {
      Common.showToast(MessageText.SelectReserveDate);
      return;
    }
    if (this.state.purpose === '') {
      Common.showToast(MessageText.SelectVisitPurpose);
      return;
    }
    requestPost(Net.marketReserve.reserveShop, {
      customerID: GlobalState.myInfo.id,
      shopID: this.state.hopeMarket,
      purpose: this.state.purpose,
      other: this.state.other,
      reserveDate: reservedData,
    })
      .then(json => {
        this.props.navigation.popToTop();
        this.props.navigation.navigate('MarketReserveFinish');
      })
      .catch(err => alertNetworkError(err));
  };
  render() {
    return (
      <MainScreenTheme
        // noScrollView={true}
        backButton={true}
        title={'ご来店予約'}
        backColor={Colors.black}>
        <Text
          style={[
            TextStyles.normalText,
            TextStyles.whiteText,
            TextStyles.bold,
            {marginBottom: 5, marginLeft: 10},
          ]}>
          ご希望店舗
        </Text>
        <RNPickerSelect
          placeholder={{
            label: '希望店舗を選択',
            value: '',
            color: Colors.brownish_grey_60,
          }}
          style={{...pickerSelectStyles}}
          value={this.state.hopeMarket}
          useNativeAndroidPickerStyle={false}
          Icon={() => {
            return (
              <View
                style={[
                  MyStyles.pickerSelectIconStyles,
                  {alignItems: 'center', justifyContent: 'center'},
                ]}>
                <Icon name={'chevron-down'} size={30} color={Colors.white} />
              </View>
            );
          }}
          onValueChange={value => {
            this.onShopChange(value);
          }}
          items={this.state.shopList}
        />
        <Text
          style={[
            TextStyles.whiteText,
            {
              marginBottom: 25,
              marginLeft: 10,
              color: '#788A97',
              fontSize: 12,
              marginTop: 5,
            },
          ]}>
          選択してください
        </Text>
        <Text
          style={[
            TextStyles.normalText,
            TextStyles.whiteText,
            TextStyles.bold,
            {marginBottom: 5, marginLeft: 10},
          ]}>
          希望日時
        </Text>
        <CalendarSchedule
          ref={p_schedule => {
            this.scheduleCalendar = p_schedule;
          }}
          getInfo={reserveDate => {
            this.setState({
              reserveDate: reserveDate,
            });
          }}
          style={{marginBottom: 20}}
        />
        <Text
          style={[
            TextStyles.normalText,
            TextStyles.whiteText,
            TextStyles.bold,
            {marginBottom: 5, marginLeft: 10},
          ]}>
          ご用件
        </Text>
        <RNPickerSelect
          placeholder={{
            label: 'ご用件を選択',
            value: '',
            color: Colors.brownish_grey_60,
          }}
          style={{...pickerSelectStyles}}
          value={this.state.purpose}
          useNativeAndroidPickerStyle={false}
          Icon={() => {
            return (
              <View
                style={[
                  MyStyles.pickerSelectIconStyles,
                  {alignItems: 'center', justifyContent: 'center'},
                ]}>
                <Icon name={'chevron-down'} size={30} color={Colors.white} />
              </View>
            );
          }}
          onValueChange={value => {
            this.setState({purpose: value});
          }}
          items={[
            {key: '1', label: '施工', value: '1'},
            {key: '2', label: '相談・見積り', value: '2'},
            {key: '3', label: 'その他', value: '3'},
          ]}
        />
        <Text
          style={[
            TextStyles.whiteText,
            {
              marginBottom: 25,
              marginLeft: 10,
              color: '#788A97',
              fontSize: 12,
              marginTop: 5,
            },
          ]}>
          選択してください
        </Text>
        <Text
          style={[
            TextStyles.normalText,
            TextStyles.whiteText,
            TextStyles.bold,
            {marginBottom: 5, marginLeft: 10},
          ]}>
          備考(任意)
        </Text>
        <TextInput
          style={{
            backgroundColor: Colors.white,
            height: 100,
            textAlignVertical: 'top',
            paddingHorizontal: 15,
            marginBottom: 30,
          }}
          value={this.state.other}
          onChangeText={text => {
            this.setState({other: text});
          }}
          multiline={true}
          // placeholder="상대에 대해 보낼 메시지를 진심을 담아 작성해주세요."
          returnKeyType="done"
        />
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 20,
          }}>
          <View
            style={{
              width: 8,
              height: 8,
              backgroundColor: Colors.white,
              marginRight: 5,
            }}
          />
          <Text style={[TextStyles.whiteText, {fontSize: 12}]}>
            キャンセルと時間変更の場合は直接予約店舗にご連絡ください。
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 20,
          }}>
          <View
            style={{
              width: 8,
              height: 8,
              backgroundColor: Colors.white,
              marginRight: 5,
            }}
          />
          <Text style={[TextStyles.whiteText, {fontSize: 12}]}>
            予約時間を15分超えてもご来店がない場合キャンセル扱いになります。
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 20,
          }}>
          <View
            style={{
              width: 8,
              height: 8,
              backgroundColor: Colors.white,
              marginRight: 5,
            }}
          />
          <Text style={[TextStyles.whiteText, {fontSize: 12}]}>
            状況によっては待ち時間が発生する可能性があります。予めご了承ください。
          </Text>
        </View>
        <LoginButton
          onPress={this.doReserve}
          buttonType={'orange'}
          textStyle={[
            {color: Colors.black},
            TextStyles.largeText,
            TextStyles.bold,
          ]}
          text={'上記の内容で予約する'}
          style={{height: 100, marginBottom: 20}}
        />
      </MainScreenTheme>
    );
  }
}

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    backgroundColor: Colors.white,
    borderColor: '#767171',
    borderWidth: 2,
    fontSize: 14,
    height: 45,
    paddingHorizontal: 15,
  },
  inputAndroid: {
    backgroundColor: Colors.white,
    borderColor: '#767171',
    borderWidth: 2,
    fontSize: 14,
    height: 44,
    paddingHorizontal: 15,
  },
});

export default MarketReserveSchedule;
