import React, {Component} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
} from 'react-native';
import ViewPager from '@react-native-community/viewpager';
import ButtonEx from '../../components/button/ButtonEx';
import MyStyles from '../../constants/MyStyles';
import {
  requestUpload,
  requestGet,
  Net,
  alertNetworkError,
} from '../../utils/ApiUtils';
import MainLayout from '../../components/container/MainLayout';
import NoticeDetailModal from '../../components/container/NoticeDetailModal';
import CouponDetailModal from '../../components/container/CouponDetailModal';
import NoticeEditModal from '../../components/container/NoticeEditModal';
import CouponEditModal from '../../components/container/CouponEditModal';
import Ripple from 'react-native-material-ripple';

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#c4c5d6',
  },
  tabHeader: {
    borderRadius: 0,
    borderWidth: 0,
  },
});

export default class RequestListScreen extends Component {
  state = {
    tabTypes: ['secondary', 'none'],
    coupons: [],
    notices: [],
    item: null, // Selected notice or coupon
  };

  componentDidMount() {
    requestGet(Net.coupon.get)
      .then(json => {
        this.setState({coupons: json.data});
      })
      .catch(err => {
        alertNetworkError(err);
      });
    requestGet(Net.notice.get)
      .then(json => {
        this.setState({notices: json.data});
      })
      .catch(err => {
        alertNetworkError(err);
      });
  }

  _renderCoupon = data => {
    return (
      <Ripple
        style={{borderBottomWidth: 1, borderColor: '#ddd'}}
        onPress={() => {
          this.setState({item: data.item});
          this.cdModal.doModal();
        }}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text style={{width: 120, padding: 5, textAlign: 'center'}}>{data.item.date}</Text>
          <Text style={{width: 200, padding: 5, textAlign: 'center'}}>{data.item.title}</Text>
          <Text style={{flex: 1, padding: 5}}>{data.item.content}</Text>
        </View>
      </Ripple>
    );
  };

  _renderNotice = data => {
    return (
      <Ripple
        style={{borderBottomWidth: 1, borderColor: '#ddd'}}
        onPress={() => {
          this.setState({item: data.item});
          this.ndModal.doModal();
        }}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text style={{width: 120, padding: 5, textAlign: 'center'}}>{data.item.date}</Text>
          <Text style={{width: 150, padding: 5, textAlign: 'center'}}>{data.item.kind}</Text>
          <Text style={{flex: 1, padding: 5}}>{data.item.content}</Text>
        </View>
      </Ripple>
    );
  };

  render() {
    return (
      <MainLayout
        title={'申請一覧'}
        homeCallback={() => {
          this.props.navigation.navigate('Main');
        }}>
        <View style={styles.tabBar}>
          <ButtonEx
            type={this.state.tabTypes[0]}
            text={'クーポン申請一覧'}
            style={styles.tabHeader}
            onPress={() => {
              this.viewPager.setPage(0);
              this.setState({tabTypes: ['secondary', 'none']});
            }}
          />
          <ButtonEx
            type={this.state.tabTypes[1]}
            text={'お知らせ申請一覧'}
            style={styles.tabHeader}
            onPress={() => {
              this.viewPager.setPage(1);
              this.setState({tabTypes: ['none', 'secondary']});
            }}
          />
        </View>
        <ViewPager
          ref={viewPager => {
            this.viewPager = viewPager;
          }}
          style={{flex: 1}}
          initialPage={0}
          onPageSelected={e => {
            e.nativeEvent.position === 1
              ? this.setState({tabTypes: ['none', 'secondary']})
              : this.setState({tabTypes: ['secondary', 'none']});
          }}>
          <View key="1">
            <View style={MyStyles.tableRow}>
              <Text style={[MyStyles.tableHeader, {width: 120}]}>日付</Text>
              <Text style={[MyStyles.tableHeader, {width: 200}]}>
                クーポン名
              </Text>
              <Text style={[MyStyles.tableHeader, {flex: 1}]}>
                クーポン内容
              </Text>
            </View>
            <View style={{flex: 1}}>
              <FlatList
                data={this.state.coupons}
                renderItem={this._renderCoupon}
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
                text={'クーポン申請'}
                type={'primary'}
                onPress={() => this.ceModal.doModal()}
              />
            </View>
          </View>
          <View key="2">
            <View style={MyStyles.tableRow}>
              <Text style={[MyStyles.tableHeader, {width: 120}]}>日付</Text>
              <Text style={[MyStyles.tableHeader, {width: 150}]}>
                お知らせジャンル
              </Text>
              <Text style={[MyStyles.tableHeader, {flex: 1}]}>
                お知らせタイトル
              </Text>
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
                onPress={() => this.neModal.doModal()}
              />
            </View>
          </View>
        </ViewPager>
        <NoticeDetailModal
          ref={ref => (this.ndModal = ref)}
          data={this.state.item}
          onCancel={() => {
            this.setState({vnDetail: false});
          }}
        />
        <CouponDetailModal
          ref={ref => (this.cdModal = ref)}
          data={this.state.item}
          onCancel={() => {
            this.setState({vcDetail: false});
          }}
        />
        <NoticeEditModal
          ref={ref => (this.neModal = ref)}
          onOK={() => {
            let data = this.neModal.getData();
            requestUpload(Net.notice.add, data, data.image)
              .then(json => {
                if (json.result === Net.error.E_OK) {
                  this.setState({notices: json.data});
                }
              })
              .catch(err => {
                alertNetworkError(err);
              });
          }}
        />
        <CouponEditModal
          ref={ref => (this.ceModal = ref)}
          onOK={() => {
            let data = this.ceModal.getData();
            requestUpload(Net.coupon.add, data, data.image)
              .then(json => {
                if (json.result === Net.error.E_OK) {
                  this.setState({coupons: json.data});
                }
              })
              .catch(err => {
                alertNetworkError(err);
              });
          }}
        />
      </MainLayout>
    );
  }
}
