import React, {Component} from 'react';
import MainScreenTheme from '../../components/controller/MainScreenTheme';
import {Text, View, Image} from 'react-native';
import Colors from '../../constants/Colors';
import TextStyles from '../../constants/TextStyles';
import GlobalState from '../../mobx/GlobalState';
const moment = require('moment');

export default class TopicDetailScreen extends Component {
  render() {
    const topic = this.props.navigation.state.params.topic;
    return (
      <MainScreenTheme
        backButton={true}
        menuButton={true}
        title={''}
        noPaddingHoriz={true}>
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
            {topic.title}
          </Text>
          <Image
            source={{uri: topic.image_link}}
            resizeMode={'contain'}
            style={{width: '100%', height: 200, marginVertical: 10}}
          />
          <Text style={[{lineHeight: 30}, TextStyles.normalText]}>
            {topic.content}
          </Text>
        </View>
      </MainScreenTheme>
    );
  }
}
