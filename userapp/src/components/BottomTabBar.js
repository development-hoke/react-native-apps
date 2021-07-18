import React, {Component} from 'react';
import {View} from 'react-native';
import {withNavigation} from 'react-navigation';
import MyStyles from '../constants/MyStyles';
import TabItem from './button/TabItem';

class BottomTabBar extends Component {
  constructor(props) {
    super(props);
    this.state = {iconList: iconList, activeIndex: 0};
    // console.log(iconList)
    // console.log(this.state.iconList);
  }

  componentDidUpdate(): void {
    this.props.navigation.navigate(
      this.state.iconList[this.state.activeIndex].route,
    );
  }

  onPressTabItem = idx => {
    this.setState({
      iconList: this.state.iconList.map((icon, index) => {
        icon.isActive = idx == index ? true : false;
        return icon;
      }),
      activeIndex: idx,
    });
  };
  render() {
    return (
      <View style={MyStyles.bottomTabBar}>
        {this.state.iconList.map((icon, index) => (
          <TabItem
            key={icon.text}
            icon={icon.isActive ? icon.active : icon.inactive}
            text={icon.text}
            isActive={icon.isActive}
            onPress={() => {
              this.onPressTabItem(index);
            }}
          />
        ))}
      </View>
    );
  }
}

const iconList = [
  {
    active: require('../../assets/1-1.png'),
    inactive: require('../../assets/1-0.png'),
    text: 'Top',
    isActive: false,
    route: 'Main',
  },
  {
    active: require('../../assets/2-1.png'),
    inactive: require('../../assets/2-0.png'),
    text: 'お知らせ',
    isActive: false,
    route: 'Top',
  },
  {
    active: require('../../assets/3-1.png'),
    inactive: require('../../assets/3-0.png'),
    text: 'マイページ',
    isActive: false,
    route: 'MyPageFirst',
  },
  {
    active: require('../../assets/4-1.png'),
    inactive: require('../../assets/4-0.png'),
    text: 'ご来店予約\nお問い合わせ',
    isActive: false,
    route: 'Top',
  },
  {
    active: require('../../assets/5-1.png'),
    inactive: require('../../assets/5-0.png'),
    text: '店舗検索',
    isActive: false,
    route: 'MarketSearch',
  },
  {
    active: require('../../assets/6-1.png'),
    inactive: require('../../assets/6-0.png'),
    text: 'HARUTO\nオンラインショップ',
    isActive: false,
    route: 'Top',
  },
];

export default withNavigation(BottomTabBar);
