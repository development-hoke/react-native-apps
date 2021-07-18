import React, {Component} from 'react';
import {
  Text,
  StyleSheet,
  View,
  SafeAreaView,
  FlatList,
  Alert,
  Image, Modal, ScrollView,
  Dimensions,
  Platform
} from 'react-native';
import {Calendar, LocaleConfig} from 'react-native-calendars';
import ButtonEx from '../../components/button/ButtonEx';
import {Net, requestPost, alertNetworkError, requestUpload} from '../../utils/ApiUtils';
import MainLayout from '../../components/container/MainLayout';
import TimeInput from '../../components/input/TimeInput';
import Ripple from 'react-native-material-ripple';
import Colors from '../../constants/Colors';
import GlobalState from '../../mobx/GlobalState';
import { launchImageLibrary } from 'react-native-image-picker';
import MyStyles from '../../constants/MyStyles';
import DateInput from '../../components/input/DateInput';

const moment = require('moment');

export default class MyShopEditScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      from: '',
      to: '',
      selected: null,
      shopImages: [],
      selected_image: '',
      modal_visible: false,
      restDateModal: false,
      docomoDateModal: false,
      restDate: '',
      newImages: [],
      SCREEN_WIDTH: 0,
      SCREEN_HEIGHT: 0,
      holidays: {},
      docomoDays: {},
      isDocomo: 0,
    };
  }

  componentDidMount() {
    this.setState({from: new Date('2000/1/1 ' + (GlobalState.start_time ? GlobalState.start_time : '00:00'))});
    this.setState({to: new Date('2000/1/1 ' + (GlobalState.end_time ? GlobalState.end_time : '00:00'))});
    this.setState({SCREEN_WIDTH: Dimensions.get('window').width});
    this.setState({SCREEN_HEIGHT: Dimensions.get('window').height});
    LocaleConfig.locales['ja'] = {
      monthNames: ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'],
      monthNamesShort: ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'],
      dayNames: ['日', '月', '火', '水', '木', '金', '土'],
      dayNamesShort: ['日', '月', '火', '水', '木', '金', '土'],
      today: '今日'
    };
    LocaleConfig.defaultLocale = 'ja';
    requestPost(Net.store.getImages, {}).then(json => {
      console.log(json)
      this.setState({
        shopImages: json.shopImages.map(item => ({
          ...item,
          isUpdated: false,
        }))
      });
    }).catch(err => alertNetworkError(err));
    requestPost(Net.marketReserve.getReservedDataByShop, {
      shopID: GlobalState.shopId,
    }).then(json => {
      let sHolidays = {};
      json.restDateList.forEach(item => {
        sHolidays[item.f_rest_date] = {selected: true, selectedColor: 'red'};
      });
      let sDocomoDays = {};
      json.restDocomoList.forEach(item => {
        sDocomoDays[item.f_rest_date] = {selected: true, selectedColor: 'red'};
      });
      this.setState({ holidays: sHolidays, docomoDays: sDocomoDays });
      this.setState({ isDocomo: json.docomo });
    }).catch(err => alertNetworkError(err));
  }

  async updateProfile() {
    if (!this.state.from) {
      Alert.alert('マイページ編集', '開始時間を選択してください.');
      return;
    } else if (!this.state.to) {
      Alert.alert('マイページ編集', '終了時間を選択してください.');
      return;
    }
    await requestPost(Net.store.change_time, {
      start_time: moment(this.state.from).format('HH:mm'),
      end_time: moment(this.state.to).format('HH:mm'),
    }).then(json => {
      console.log(json);
      GlobalState.start_time = json.shopData.start_time;
      GlobalState.end_time = json.shopData.end_time;
    }).catch(err => {
      alertNetworkError(err);
    });
    await Promise.all(
      this.state.shopImages.filter(img => img.isUpdated).map(async (img) => {
        await requestUpload(Net.store.image_update, { id: img.image.id }, img.image.url).then(json => {
          console.log('Upload Finished')
        }).catch(err => {
          alertNetworkError(err);
        });
      })
    );
    await Promise.all(
      this.state.shopImages.filter(img => img.isDeleted).map(async (img) => {
        await requestPost(Net.store.image_delete, { id: img.image.id }).then(json => {
          console.log('Remove Finished')
        }).catch(err => {
          alertNetworkError(err);
        });
      })
    );
    await requestPost(Net.store.getImages, {}).then(json => {
      this.setState({
        shopImages: json.shopImages.map(item => ({
          ...item,
          isUpdated: false,
        }))
      });
    }).catch(err => alertNetworkError(err));
  }

  onHolidaySet(day) {
    this.setState(prev => {
      var prevHolidays = prev.holidays;
      if (prevHolidays[day.dateString] && prevHolidays[day.dateString].selected) {
        prevHolidays[day.dateString] = {selected: false, selectedColor: 'red'};
      } else {
        prevHolidays[day.dateString] = {selected: true, selectedColor: 'red'};
      }
      return {
        ...prev,
        holidays: prevHolidays,
      }
    });
  }

  saveHolidaySet() {
    const newHolidays = [];
    for (const [key, value] of Object.entries(this.state.holidays)) {
      if (value.selected) {
        newHolidays.push(key);
      }
    }
    requestPost(Net.restDate.register, {
      shopId: GlobalState.shopId,
      dates: newHolidays,
    }).then(json => {
      console.log(json);
      this.setState({restDateModal: false});
      let sHolidays = {};
      json.restDateList.forEach(item => {
        sHolidays[item.f_rest_date] = {selected: true, selectedColor: 'red'};
      });
      this.setState({ holidays: sHolidays });
    }).catch(err => {
      alertNetworkError(err);
    });
  }

  onDocomoDaySet(day) {
    this.setState(prev => {
      var prevHolidays = prev.docomoDays;
      if (prevHolidays[day.dateString] && prevHolidays[day.dateString].selected) {
        prevHolidays[day.dateString] = {selected: false, selectedColor: 'red'};
      } else {
        prevHolidays[day.dateString] = {selected: true, selectedColor: 'red'};
      }
      return {
        ...prev,
        docomoDays: prevHolidays,
      }
    });
  }

  saveDocomoSet() {
    const newHolidays = [];
    for (const [key, value] of Object.entries(this.state.docomoDays)) {
      if (value.selected) {
        newHolidays.push(key);
      }
    }
    requestPost(Net.restDate.register_docomo, {
      shopId: GlobalState.shopId,
      dates: newHolidays,
    }).then(json => {
      this.setState({ docomoDateModal: false });
      let sHolidays = {};
      json.restDocomoList.forEach(item => {
        sHolidays[item.f_rest_date] = {selected: true, selectedColor: 'red'};
      });
      this.setState({ docomoDays: sHolidays });
    }).catch(err => {
      alertNetworkError(err);
    });
  }

  onDeleteImage(data) {
    this.setState(prev => ({
      shopImages: prev.shopImages.map(item => item.no != data.no ? item : ({
        no: item.no,
        image: {id: item.image.id},
        isDeleted: true,
      }))
    }))
  }

  onLoadImage(data) {
    this.setState({selected: data.item.no});
    launchImageLibrary({mediaType: 'photo'}, (res) => {
      if (res.didCancel || res.errorCode) {
        return;
      }
      let newItem = {
        no: this.state.selected,
        image: {
          url: Platform.OS === 'android' ? res.uri : res.uri.replace('file://', ''),
          display_name: res.fileName,
          id: data.item.image && data.item.image.id || 0
        },
        isUpdated: true,
      };
      this.setState(prev => ({
        shopImages: prev.shopImages.map((img) => img.no == this.state.selected ? newItem : img)
      }));
    });
  }

  _renderImage = data => {
    return (
      <Ripple>
        <Image
          source={{uri: data.item.image ? data.item.image.url : 'https://via.placeholder.com/150?text=empty'}}
          style={{width: 150, height: 150, margin: 5}}
          resizeMode={'contain'}
        />
      </Ripple>
    );
  };

  _renderItem = data => {
    return (
      <View style={styles.tableRow}>
        <Text style={[styles.firstColumn, {borderTopWidth: 0}]}>画像 {data.item.no}</Text>
        <Ripple style={[styles.secondColumn, {borderTopWidth: 0}]} onPress={() => this.onLoadImage(data)}>
          <Text>
            {data.item.image ? data.item.image.display_name : ''}
          </Text>
        </Ripple>
        {data.item.image && data.item.image.url && (
          <Ripple style={{
            justifyContent: 'center',
            alignItems: 'center',
            padding: 8,
            backgroundColor: "#f22d4e"}}
            onPress={() => this.onDeleteImage(data.item)}>
            <Text style={{color: 'white'}}>削除</Text>
          </Ripple>
        )}
      </View>
    );
  };

  render() {
    return (
      <MainLayout
        title={'マイページ編集'}
        homeCallback={() => this.props.navigation.navigate('Main')}
        rightHeader={
          <View style={{display: 'flex', flexDirection: 'row'}}>
            <ButtonEx
              onPress={() => {
                this.setState({restDateModal: true});
              }}
              text={'店休日登録'}
              type={'danger'}
            />
          </View>
        }>
        <View style={{ padding: 15 }}>
          <View style={{flexDirection: 'row'}}>
            <View style={{flexDirection: 'column', flex: 1}}>
              <View style={styles.tableRow}>
                <Text style={[styles.firstColumn]}>店舗名</Text>
                <Text style={[styles.secondColumn]}>{GlobalState.shopName}</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={[styles.firstColumn, {borderTopWidth: 0}]}>営業時間</Text>
                <View style={[styles.secondColumn, {borderTopWidth: 0, flexDirection: 'row', alignItems: 'center', paddingRight: 10}]}>
                  <TimeInput
                    style={[styles.timeInput, {flex: 1, marginLeft: 10}]}
                    placeHolder={'開始時間'}
                    init_value={new Date('2000/1/1 ' + (GlobalState.start_time ? GlobalState.start_time : '00:00'))}
                    onChange={time => this.setState({from: time})}
                  />
                  <Text>    ~</Text>
                  <TimeInput
                    style={[styles.timeInput, {flex: 1, marginRight: 10}]}
                    placeHolder={'終了時間'}
                    init_value={new Date('2000/1/1 ' + (GlobalState.end_time ? GlobalState.end_time : '00:00'))}
                    onChange={time => this.setState({to: time})}
                  />
                </View>
              </View>
              <FlatList
                data={this.state.shopImages}
                renderItem={this._renderItem}
                style={{}}
                keyExtractor={(item, index) => `left-${index}`}
              />
            </View>
            <View style={{flex: 1, alignItems: 'center', marginHorizontal: 10, borderWidth: 1}}>
              <FlatList
                data={this.state.shopImages}
                renderItem={this._renderImage}
                numColumns={3}
                style={{}}
                keyExtractor={(item, index) => `right-${index}`}
              />
            </View>
          </View>
          <View style={{ marginTop: 10, marginRight: 10, display: 'flex', alignItems: 'flex-end' }}>
            <ButtonEx
              onPress={() => {
                this.updateProfile();
              }}
              style={{ width: 80 }}
              text={'更新'}
              type={'primary'}
            />
          </View>
        </View>
        <Modal
          transparent={true}
          visible={this.state.modal_visible}
          animationType={'fade'}>
          <View style={MyStyles.Modal}>
            <View style={MyStyles.modalCloseView}>
              <ButtonEx
                icon={'times'}
                iconSize={15}
                style={{borderWidth: 0}}
                onPress={() => {
                  this.setState({modal_visible: false});
                }}
              />
            </View>
            <SafeAreaView style={{flexDirection: 'row', flex: 1, alignItems: 'center', justifyContent: 'center'}}>
              <Image
                source={{uri: this.state.selected_image}}
                style={{height: '100%', margin: 20, flex: 1}}
                resizeMode={'contain'}
              />
            </SafeAreaView>
          </View>
        </Modal>
        <Modal
          transparent={true}
          visible={this.state.restDateModal}
          animationType={'fade'}>
          <View style={{flex: 1, justifyContent: 'center'}}>
            <View style={[MyStyles.Modal, {height: 480, width: '50%', marginLeft: '25%'}]}>
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
                  <Text style={{ marginLeft: 20}}>※カレンダーから定休日を選択してください。</Text>
                </View>
                <ScrollView style={{ flex: 1 }}>
                  <Calendar 
                    onDayPress={(day) => this.onHolidaySet(day)}
                    enableSwipeMonths={true}
                    markedDates={this.state.holidays}
                  />
                </ScrollView>
                <View style={[MyStyles.m_15, { justifyContent: 'flex-end'}]}>
                  <ButtonEx
                    type={'primary'}
                    text={'確認'}
                    onPress={() => this.saveHolidaySet()}
                  />
                </View>
              </View>
            </View>
          </View>
        </Modal>
      </MainLayout>
    );
  }
}

const styles = StyleSheet.create({
  firstColumn: {
    width: 80,
    fontSize: 12,
    textAlign: 'left',
    borderWidth: 1,
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 5,
  },
  secondColumn: {
    flex: 1,
    fontSize: 12,
    textAlign: 'left',
    borderWidth: 1,
    borderLeftWidth: 0,
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 5,
  },
  timeInput: {
    color: 'black',
    borderColor: Colors.black,
    borderWidth: 1,
    height: 28,
    paddingTop: 0,
    paddingBottom: 0,
  },
  tableRow: {
    height: 33,
    flexDirection: 'row',
  },
});
