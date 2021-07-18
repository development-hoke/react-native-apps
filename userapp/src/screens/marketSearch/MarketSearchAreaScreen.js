import React, {Component} from 'react';
import {Image, Text, View} from 'react-native';
import Colors from '../../constants/Colors';
import TextStyles from '../../constants/TextStyles';
import Ripple from 'react-native-material-ripple';
import MainScreenTheme from '../../components/controller/MainScreenTheme';
import {FlatList} from 'react-native-gesture-handler';
import {BOTTOMBAR_HEIGHT} from '../../constants/AppConstants';
import {requestPost, Net, alertNetworkError} from '../../utils/APIUtils';

export default class MarketSearchArea extends Component {
  constructor(props) {
    super(props);
    this.state = {data: null};
  }
  addKeysToData = data => {
    return data.map((item, index) => {
      return Object.assign(item, {key: index});
    });
  };
  componentDidMount() {
    requestPost(Net.marketSearch.getAreaList, null)
      .then(json => {
        let areaList = [];
        json.areaList.map(item => {
          areaList.push({key: item.f_id.toString(), name: item.f_area_name});
        });
        this.setState({data: areaList});
      })
      .catch(err => {
        alertNetworkError(err);
      });
  }

  renderItem = ({item}) => {
    return (
      <Ripple
        key={item.key}
        onPress={() => {
          this.props.navigation.navigate('MarketSearchMarket', {
            passParam: {areaID: item.key},
          });
        }}
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
          {this.state.data ? (
            <FlatList data={this.state.data} renderItem={this.renderItem} />
          ) : null}
        </View>
      </MainScreenTheme>
    );
  }
}
