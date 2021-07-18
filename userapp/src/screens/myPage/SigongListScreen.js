import React, {Component} from 'react';
import {View, Text, TouchableHighlight, Image} from 'react-native';
import MainScreenTheme from '../../components/controller/MainScreenTheme';
import Colors from '../../constants/Colors';
import TextStyles from '../../constants/TextStyles';
import Icon from 'react-native-vector-icons/FontAwesome';
import SigongCard from '../../components/controller/SigongCard';
import {alertNetworkError, Net, requestPost} from '../../utils/APIUtils';
import GlobalState from '../../mobx/GlobalState';

export default class SigongList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sigongList: [],
      sortMode: 'desc',
      kind: 1
    };
  }

  componentDidMount() {
    this.getCarryingList()
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.sortMode != this.state.sortMode
      || prevState.kind != this.state.kind) {
        this.getCarryingList()
      }
  }

  getCarryingList = () => {
    requestPost(Net.myShop.getSigongList, {
      customerID: GlobalState.myInfo.member_no,
      sortMode: this.state.sortMode,
      type: this.state.kind
    }).then(json => {
      if (json.result === Net.error.E_OK) {
        console.log(json.sigongList)
        this.setState({
          sigongList: json.sigongList,
        });
      }
    }).catch(err => alertNetworkError(err));    
  }

  render() {
    return (
      <MainScreenTheme
        backButton={true}
        menuButton={true}
        noPaddingHoriz={true}>
        <View
          style={{
            height: 60,
            backgroundColor: Colors.grey,
            justifyContent: 'center',
            paddingLeft: 20,
          }}>
          <Text
            style={[
              TextStyles.whiteText,
              TextStyles.normalText,
              TextStyles.bold,
            ]}>
            施工履歴一覧
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 10,
            paddingHorizontal: 10,
            backgroundColor: Colors.black,
          }}>
          <TouchableHighlight
            style={{
              flex: 4,
              alignItems: 'center',
              marginRight: 10,
              borderColor: Colors.light_blue,
              borderWidth: this.state.kind == 1 ? 2 : 0,
              borderRadius: 5,
            }} onPress={() => {
              this.setState({ kind: 1 });
            }}>
            <Image
              resizeMode={'contain'}
              style={{
                margin: 5,
                width: 120,
                height: 40,
              }}
              source={require('../../../assets/harutob-L.jpg')}
            />
          </TouchableHighlight>
          <TouchableHighlight
            style={{
              flex: 3,
              alignItems: 'center',
              marginRight: 10,
              backgroundColor: Colors.white,
              borderColor: Colors.light_blue,
              borderWidth: this.state.kind == 2 ? 2 : 0,
              borderRadius: 5,
            }} onPress={() => {
              this.setState({ kind: 2 });
            }}>
            <Image
              resizeMode={'contain'}
              style={{
                margin: 5,
                width: 80,
                height: 40,
              }}
              source={require('../../../assets/logo.png')}
            />
          </TouchableHighlight>
          <TouchableHighlight
            onPress={() => {
              if (this.state.sortMode === 'asc') {
                this.setState({sortMode: 'desc'});
              } else {
                this.setState({sortMode: 'asc'});
              }
            }}
            style={{
              flex: 5,
              alignItems: 'center',
              backgroundColor: Colors.white,
            }}>
            <View
              style={{
                flexDirection: 'row',
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Icon name={'sort'} size={30} />
              <Text
                style={[
                  TextStyles.bold,
                  TextStyles.normalText,
                  {marginHorizontal: 10},
                ]}>
                並べ替え
              </Text>
            </View>
          </TouchableHighlight>
        </View>
        <View style={{backgroundColor: Colors.black}}>
          {this.state.sigongList.map((sigong, index) => (
            <SigongCard
              fullData={sigong}
              key={sigong.id.toString()}
              style={{marginBottom: 5}}
              image={sigong.image_path}
              productName={`${sigong.goods} (${sigong.goods_subs})`}
              date={sigong.date}
            />
          ))}
        </View>
      </MainScreenTheme>
    );
  }
}
