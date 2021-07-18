import React, {Component} from 'react';
import {
  Text,
  StyleSheet,
  View,
  Modal,
  Alert,
} from 'react-native';
import Colors from '../../constants/Colors';
import CalendarSchedule from '../../components/controller/CalendarSchedule';
import {Net, requestPost, alertNetworkError} from '../../utils/ApiUtils';
import GlobalState from '../../mobx/GlobalState';
import {LOAD_CALENDAR_TYPE} from '../../constants/AppConstants';
import MainLayout from '../../components/container/MainLayout';
import MyStyles from '../../constants/MyStyles';
import ButtonEx from '../../components/button/ButtonEx';
import DateInput from '../../components/input/DateInput';

const moment = require('moment');

export default class ShopReserve extends Component {
  constructor(props) {
    super(props);
    this.state = {
      purpose: '',
      other: '',
      reserveDate: null,
      modalVisible: false,
      restDateModal: false,
      restDate: '',
    };
  }


  componentDidMount() {
    this.refesh = this.props.navigation.addListener('willFocus', () => {
      requestPost(Net.marketReserve.getReservedDataByShop, {
        shopID: GlobalState.shopId,
      })
        .then(json => {
          GlobalState.restDateList = json.restDateList;
          GlobalState.reservedData = json.reservedData;
          GlobalState.hoursList = json.timeList;
          this.scheduleCalendar.initCalendar(
            LOAD_CALENDAR_TYPE.ONLY_SCHEDULE_DATA,
          );
        })
        .catch(err => alertNetworkError(err));
    });
  }

  componentWillUnmount() {
    this.refesh.remove();
  }

  reload() {
    requestPost(Net.marketReserve.getReservedDataByShop, {
      shopID: GlobalState.shopId,
    })
      .then(json => {
        GlobalState.restDateList = json.restDateList;
        GlobalState.reservedData = json.reservedData;
        GlobalState.hoursList = json.timeList;
        this.scheduleCalendar.initCalendar(
          LOAD_CALENDAR_TYPE.ONLY_SCHEDULE_DATA,
        );
      })
      .catch(err => alertNetworkError(err));
  }
  render() {
    return (
      <MainLayout
        title={'ショップカレンダー'}
        homeCallback={() => this.props.navigation.navigate('Main')}
        rightHeader={
          <ButtonEx
            onPress={() => {
              this.setState({restDateModal: true});
            }}
            text={'店休日登録'}
            type={'danger'}
          />
        }>
        <Modal transparent={true} visible={this.state.modalVisible}>
          <View style={MyStyles.Modal}>
            <View style={MyStyles.modalCloseView}>
              <ButtonEx
                icon={'times'}
                iconSize={15}
                style={{borderWidth: 0}}
                onPress={() => {
                  this.setState({modalVisible: false});
                }}
              />
            </View>
            <Text style={{margin: 20}}>
              用件: {this.state.purpose === '1' ? '施工' : ''}
              {this.state.purpose === '2' ? '相談・見積り' : ''}
              {this.state.purpose === '3' ? 'その他' : ''}
            </Text>
            <Text style={{margin: 20, marginTop: 0}}>
              備考:{'\n' + this.state.other}
            </Text>
          </View>
        </Modal>
        <Modal
          transparent={true}
          visible={this.state.restDateModal}
          animationType={'fade'}>
          <View style={[MyStyles.Modal, {marginTop: 30, marginBottom: 30}]}>
            <View style={MyStyles.modalCloseView}>
              <ButtonEx
                icon={'times'}
                iconSize={15}
                style={{borderWidth: 0}}
                onPress={() => {
                  this.setState({restDateModal: false});
                }}
              />
            </View>
            <View style={[MyStyles.container, MyStyles.m_15]}>
              <View style={[MyStyles.mb_15]}>
                <DateInput
                  placeHolder={'店休日'}
                  onChange={date => this.setState({restDate: date})}
                />
                <Text style={{marginTop: 15, marginLeft: 20}}>※店休日を選択すれば店休日を取り消します</Text>
              </View>
              <View style={[MyStyles.mb_15, {flex: 1, justifyContent: 'flex-end'}]}>
                <ButtonEx
                  type={'primary'}
                  text={'確認'}
                  onPress={() => {
                    if (!this.state.restDate) {
                      Alert.alert('確認', '店休日を選択してください.');
                      return;
                    }
                    requestPost(Net.restDate.register, {
                      shopId: GlobalState.shopId,
                      rest_date: moment(this.state.restDate).format('YYYY/MM/DD'),
                    })
                      .then(json => {
                        //this.scheduleCalendar.initCalendar(LOAD_CALENDAR_TYPE.ONLY_SCHEDULE_DATA);
                        this.reload();
                        this.setState({restDateModal: false});
                      })
                      .catch(err => {
                        alertNetworkError(err);
                      });
                  }}
                />
              </View>
            </View>
          </View>
        </Modal>
        <CalendarSchedule
          ref={p_schedule => {
            this.scheduleCalendar = p_schedule;
          }}
          getInfo={reserveDate => {
            if (reserveDate.type === 'cancel') {
              this.setState({
                modalVisible: true,
                reserveDate: reserveDate,
                purpose: reserveDate.reserve_purpose,
                other: reserveDate.other,
              });
              requestPost(Net.restDate.reserve_confirm, {
                reserveId: reserveDate.reserveId,
              })
                .then(json => {
                  this.reload();
                })
                .catch(err => {
                  alertNetworkError(err);
                });
            } else {
              requestPost(Net.restDate.register_time, {
                shopId: GlobalState.shopId,
                rest_date: moment(reserveDate.date).format('YYYY/MM/DD'),
                rest_time: reserveDate.time,
                rest_type: reserveDate.type,
              })
                .then(json => {
                  this.reload();
                })
                .catch(err => {
                  alertNetworkError(err);
                });
            }
          }}
          style={{marginBottom: 20}}
        />
      </MainLayout>
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

const styles = StyleSheet.create({
  pickerSelectIconStyles: {
    width: 44,
    height: 44,
    backgroundColor: '#AFABAB',
  },
});
