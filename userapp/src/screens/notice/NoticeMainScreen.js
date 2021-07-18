import React, {Component} from 'react';
import {View, Text, Image} from 'react-native';
import Colors from '../../constants/Colors';
import MainScreenTheme from '../../components/controller/MainScreenTheme';
import Ripple from 'react-native-material-ripple';
import {FlatList} from 'react-native-gesture-handler';
import {requestPost, Net, alertNetworkError} from '../../utils/APIUtils';
import GlobalState from '../../mobx/GlobalState';
const moment = require('moment');

export default class NoticeMain extends Component {
  constructor(props) {
    super(props);
    this.state = {data: null};
  }
  componentDidMount() {
    requestPost(Net.notice.getNotice, null).then(json => {
      this.setState({data: this.addKeysToData(json.notice)});
    }).catch(err => {
      alertNetworkError(err);
    });
  }

  addKeysToData = data => {
    return data.map((item, index) => {
      return Object.assign(item, {key: item.id.toString()});
    });
  };
  renderItem = ({item}) => {
    return (
      <Ripple
        onPress={() => {
          GlobalState.noticeDetailData = item;
          this.props.navigation.navigate('NoticeDetail');
        }}
        style={{
          height: 120,
          borderBottomWidth: 1,
          borderBottomColor: Colors.black,
        }}>
        <View style={{flexDirection: 'row', flex: 1}}>
          <View style={{flex: 3}}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <View
                style={{
                  paddingHorizontal: 10,
                  paddingVertical: 10,
                  backgroundColor: Colors.light_blue,
                  width: 120,
                  marginRight: 20,
                }}>
                <Text style={{textAlign: 'center'}}>{item.kind}</Text>
              </View>
              <Text>{moment(item.updated_at).format('YYYY-MM-DD H:m:s')}</Text>
            </View>
            <View
              style={{
                paddingLeft: 20,
                paddingTop: 10,
              }}>
              <Text>● {item.title}</Text>
            </View>
          </View>
          <Image
            source={{uri: item.image_path}}
            resizeMode={'contain'}
            style={{
              flex: 1,
              alignSelf: 'center',
              margin: 50,
              marginRight: 20,
              width: '100%',
              height: '100%',
            }}
          />
        </View>
      </Ripple>
    );
  };
  render() {
    return (
      <MainScreenTheme
        title={'お知らせ一覧'}
        menuButton={true}
        noScrollView={true}
        noPaddingHoriz={true}>
        <FlatList data={this.state.data} renderItem={this.renderItem} />
      </MainScreenTheme>
    );
  }
}
