import React, {Component} from 'react';
import MainScreenTheme from '../../components/controller/MainScreenTheme';
import {Text, View, Image} from 'react-native';
import Colors from '../../constants/Colors';
import TextStyles from '../../constants/TextStyles';
import GlobalState from '../../mobx/GlobalState';
const moment = require('moment');

export default class NoticeDetail extends Component {
  render() {
    return (
      <MainScreenTheme
        backButton={true}
        menuButton={true}
        title={''}
        noPaddingHoriz={true}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <View
            style={{
              paddingHorizontal: 10,
              paddingVertical: 10,
              backgroundColor: Colors.light_blue,
              width: 120,
              marginRight: 20,
            }}>
            <Text style={{textAlign: 'center'}}>{GlobalState.noticeDetailData.kind}</Text>
          </View>
          <Text>{moment(GlobalState.noticeDetailData.updated_at).format('YYYY-MM-DD H:m:s')}</Text>
        </View>
        <View
          style={{
            alignItems: 'center',
            marginTop: 5,
            marginHorizontal: 15,
            marginBottom: 20,
          }}>
          <Text
            style={[
              TextStyles.navHeaderTitle,
              TextStyles.bold,
              {textAlign: 'center', lineHeight: 40},
            ]}>
            {GlobalState.noticeDetailData.title}
          </Text>
          <Image
            source={{uri: GlobalState.noticeDetailData.image_path}}
            resizeMode={'contain'}
            style={{width: '100%', height: 200, marginVertical: 10}}
          />
          <Text style={[{lineHeight: 30}, TextStyles.normalText]}>
            {GlobalState.noticeDetailData.content}
          </Text>
        </View>
      </MainScreenTheme>
    );
  }
}
