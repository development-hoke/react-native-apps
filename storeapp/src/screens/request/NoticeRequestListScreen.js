import React, {Component} from 'react';
import {
  View,
  Text,
  FlatList,
  Alert,
} from 'react-native';
import ButtonEx from '../../components/button/ButtonEx';
import MyStyles from '../../constants/MyStyles';
import {
  requestUpload,
  requestGet,
  requestPost,
  Net,
  alertNetworkError,
} from '../../utils/ApiUtils';
import MainLayout from '../../components/container/MainLayout';
import NoticeDetailModal from '../../components/container/NoticeDetailModal';
import NoticeEditModal from '../../components/container/NoticeEditModal';

export default class NoticeRequestListScreen extends Component {
  state = {
    notices: [],
    item: null, // Selected notice or coupon
  };

  componentDidMount() {
    requestGet(Net.notice.get)
      .then(json => {
        console.log(json);
        this.setState({notices: json.data});
      })
      .catch(err => {
        alertNetworkError(err);
      });
  }

  _renderNotice = data => {
    return (
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <Text style={{width: 120, padding: 5, textAlign: 'center'}}>{data.item.date}</Text>
        <Text style={{width: 150, padding: 5, textAlign: 'center'}}>{data.item.kind}</Text>
        <Text style={{flex: 1, padding: 5}}>{data.item.content}</Text>
        <View style={{width: 80, paddingHorizontal: 10}}>
          <ButtonEx
            text={'編集'}
            type={'primary'}
            padding={2}
            onPress={() => {
              this.setState({item: data.item});
              this.neModal.doModal();
            }}
            textStyle={{fontSize: 12}}
          />
        </View>
        <View style={{width: 80, paddingHorizontal: 10}}>
          <ButtonEx
            text={'削除'}
            type={'secondary'}
            padding={2}
            textStyle={{fontSize: 12}}
            onPress={() => {
              Alert.alert(
                '削除',
                'お知らせを削除しますか?',
                [
                {
                  text: 'Cancel',
                  onPress: () => {},
                  style: 'cancel',
                },
                {
                  text: 'OK',
                  onPress: () => {
                    requestPost(Net.notice.delete, {
                      id: data.item.id,
                    })
                      .then(json => {
                        this.setState({notices: json.data});
                      })
                      .catch(err => {
                        alertNetworkError(err);
                      });
                  },
                },
              ],
              );
            }}
          />
        </View>
      </View>
    );
  };

  render() {
    return (
      <MainLayout
        title={'お知らせ一覧'}
        homeCallback={() => {
          this.props.navigation.navigate('Main');
        }}>
        <View style={{flex: 1, padding: 15}}>
          <View style={MyStyles.tableRow}>
            <Text style={[MyStyles.tableHeader, {width: 120}]}>日付</Text>
            <Text style={[MyStyles.tableHeader, {width: 150}]}>
              お知らせジャンル
            </Text>
            <Text style={[MyStyles.tableHeader, {flex: 1}]}>
              お知らせタイトル
            </Text>
            <Text style={[MyStyles.tableHeader, {width: 80}]}>編集</Text>
            <Text style={[MyStyles.tableHeader, {width: 80}]}>削除</Text>
          </View>
          <View style={{flex: 1}}>
            <FlatList
              data={this.state.notices}
              renderItem={this._renderNotice}
            />
          </View>
          <View
            style={[
              {
                marginTop: 15,
                alignItems: 'flex-end',
              },
            ]}>
            <ButtonEx
              text={'お知らせ申請'}
              type={'primary'}
              onPress={() => {
                this.setState({item: null})
                this.neModal.doModal();
              }}
            />
          </View>
        </View>
        <NoticeDetailModal
          ref={ref => (this.ndModal = ref)}
          data={this.state.item}
          onCancel={() => {
            this.setState({vnDetail: false});
          }}
        />
        <NoticeEditModal
          ref={ref => (this.neModal = ref)}
          data={this.state.item ? this.state.item : null}
          onOK={() => {
            let data = this.neModal.getData();
            if(data.image !== '') {
              requestUpload(Net.notice.add, data, data.image).then(json => {
                if (json.result === Net.error.E_OK) {
                  this.setState({notices: json.data});
                }
              }).catch(err => {
                alertNetworkError(err);
              });
            } else {
              requestPost(Net.notice.add, {
                id: data.id,
                kind: data.kind,
                title: data.title,
                content: data.content,
              }).then(json => {
                this.setState({notices: json.data});
              }).catch(err => {
                alertNetworkError(err);
              });
            }
          }}
        />
      </MainLayout>
    );
  }
}
