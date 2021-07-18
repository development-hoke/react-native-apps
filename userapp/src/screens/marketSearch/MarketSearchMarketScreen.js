import React, {Component} from 'react';
import Ripple from 'react-native-material-ripple';
import Colors from '../../constants/Colors';
import {Text, View} from 'react-native';
import MainScreenTheme from '../../components/controller/MainScreenTheme';
import TextStyles from '../../constants/TextStyles';
import {BOTTOMBAR_HEIGHT} from '../../constants/AppConstants';
import {FlatList} from 'react-native-gesture-handler';
import {alertNetworkError, Net, requestPost} from '../../utils/APIUtils';

export default class MarketSearchMarket extends Component {
  constructor(props) {
    super(props);
    this.state = {data: []};
  }
  componentDidMount() {
    requestPost(Net.marketSearch.getShopByArea, {
      areaID: this.props.navigation.state.params.passParam.areaID,
    })
      .then(json => {
        this.setState({data: this.addKeysToData(json.shopList)});
      })
      .catch(err => {
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
          this.props.navigation.navigate('MarketSearchMarketDetail', {
            passParam: item,
          });
        }}
        key={item.key}
        style={{
          borderBottomWidth: 1,
          borderColor: Colors.black,
          height: 80,
          justifyContent: 'center',
          paddingLeft: 10,
        }}>
        <Text
          style={{
            fontSize: 30,
            fontWeight: 'bold',
            textAlign: 'center',
          }}>
          {item.name}
        </Text>
      </Ripple>
    );
  };
  render() {
    return (
      <MainScreenTheme
        noScrollView={true}
        noPaddingHoriz={true}
        headerImage={true}
        backButton={true}
        menuButton={true}>
        <View
          style={{
            backgroundColor: Colors.black,
            justifyContent: 'center',
            height: 80,
          }}>
          <Text
            style={[
              {textAlign: 'center', fontSize: 25},
              TextStyles.whiteText,
              TextStyles.bold,
            ]}>
            店舗検索 【エリアから探す】
          </Text>
        </View>
        <View
          style={{
            marginHorizontal: 5,
            marginBottom: BOTTOMBAR_HEIGHT,
          }}>
          <FlatList data={this.state.data} renderItem={this.renderItem} />
        </View>
      </MainScreenTheme>
    );
  }
}

const marketList = [
  {key: '1', name: '北海道'},
  {key: '2', name: '東京'},
  {key: '3', name: '愛知県'},
  {key: '4', name: '大阪'},
  {key: '5', name: '京都'},
  {key: '6', name: '北海道'},
  {key: '7', name: '北海道'},
  {key: '8', name: '北海道'},
];
