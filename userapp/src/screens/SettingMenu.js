import React, {Component} from 'react';
import {View, FlatList, Text} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Ripple from 'react-native-material-ripple';
import MainScreenTheme from '../components/controller/MainScreenTheme';
import Colors from '../constants/Colors';
import TextStyles from '../constants/TextStyles';
import {ASYNC_PARAMS} from '../constants/AppConstants';
import GlobalState from '../mobx/GlobalState';
import MyInfoPopup from './myPage/MyInfoPopup';
import TransferCodePopup from './TransferCodePopup';
import {Net, requestPost} from '../utils/APIUtils';

export default class SettingMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      showMyInfoPopup: false,
      showTransferCodePopup: false,
      transferCode:
        GlobalState.deviceId.substr(-5) +
        GlobalState.myInfo.member_no.substr(-5),
    };
  }
  componentDidMount() {
    const settingMenuList = [
      {
        callback: () => {
          // this.props.navigation.pop();
          // this.props.navigation.navigate('MemberRegister');
          this.setState({showMyInfoPopup: true});
        },
        title: '会員ID・パスワードを表示',
      },
      {
        callback: () => {
          this.props.navigation.pop();
          this.props.navigation.navigate('SigongList');
        },
        title: '施工履歴一覧',
      },
      {callback: null, title: 'プッシュ通知設定'},
      {
        callback: () => {
          this.setState({showTransferCodePopup: true}, () => {
            requestPost(Net.myShop.generateTransferCode, {
              customerID: GlobalState.myInfo.id,
              transferCode: this.state.transferCode,
            }).then(json => {});
          });
        },
        title: '引き継ぎ(機種変更の方)',
      },
      // {
      //   callback: () => {
      //     this.props.navigation.pop();
      //     this.props.navigation.navigate('MarketReserveQuestion', {
      //       shopID: GlobalState.myShop,
      //     });
      //   },
      //   title: 'お問い合わせ',
      // },
      {
        callback: () => {
          this.props.navigation.pop();
          this.props.navigation.navigate('Faq');
        },
        title: 'よくあるご質問(Q＆A)',
      },
      {
        callback: () => {
          this.props.navigation.pop();
          this.props.navigation.navigate('UsePolicyLicense', {isPrivacy: true});
        },
        title: '利用規約・プライバシーポリシー',
      },
      // {
      //   callback: () => {
      //     this.props.navigation.pop();
      //     this.props.navigation.navigate('UsePolicyLicense', {isUse: true});
      //   },
      //   title: '会員規約',
      // },
      {callback: this.logout, title: 'ログアウト'},
    ];
    this.setState({data: this.addKeysToData(settingMenuList)});
  }

  addKeysToData = data => {
    return data.map(item => {
      return Object.assign(item, {key: item.title});
    });
  };
  logout = () => {
    GlobalState.isLogout = true;
    AsyncStorage.removeItem(ASYNC_PARAMS.IS_LOGIN, () => {
      this.props.navigation.navigate('SelectShop');
    });
  };
  renderItem = ({item}) => {
    return (
      <Ripple
        onPress={() => {
          if (item.callback) {
            item.callback();
          }
        }}
        style={{
          backgroundColor: Colors.grey,
          height: 70,
          justifyContent: 'center',
          marginTop: 3,
          paddingHorizontal: 20,
        }}>
        <Text style={TextStyles.settingItemText}>{item.title}</Text>
      </Ripple>
    );
  };
  render() {
    return (
      <MainScreenTheme
        closeButton={true}
        headerImage={true}
        noScrollView={true}
        noPaddingHoriz={true}
        backColor={Colors.black}
        this={this}>
        <View style={{backgroundColor: Colors.black}}>
          <FlatList data={this.state.data} renderItem={this.renderItem} />
        </View>
        <MyInfoPopup
          visible={this.state.showMyInfoPopup}
          onOk={() => {
            this.setState({showMyInfoPopup: false});
          }}
          onCancel={() => {
            this.setState({showMyInfoPopup: false});
          }}
        />
        <TransferCodePopup
          transferCode={this.state.transferCode}
          visible={this.state.showTransferCodePopup}
          onOk={() => {
            this.setState({showTransferCodePopup: false});
          }}
          onCancel={() => {
            this.setState({showTransferCodePopup: false});
          }}
        />
      </MainScreenTheme>
    );
  }
}
