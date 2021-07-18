import React, {Component} from 'react';
import Colors from '../../constants/Colors';
import {Image, Text, View, ImageBackground} from 'react-native';
import TextStyles from '../../constants/TextStyles';
import Ripple from 'react-native-material-ripple';
import Icon from 'react-native-vector-icons/FontAwesome';
import {withNavigation} from 'react-navigation';

class SigongCard extends Component {
  render() {
    const carrying = this.props.fullData

    return (
      <View style={[{backgroundColor: Colors.white}, this.props.style]}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-start',
            marginHorizontal: 5,
            marginTop: 5,
          }}>
          {/*<ImageBackground source={this.props.image} style={{marginRight: 10, flex: 1, height: 100}} resizeMode={'contain'} />*/}
          {carrying.carrying_kind == 1 ? (
            <Image
              resizeMode={'contain'}
              style={{marginRight: 10, flex: 1, height: 100}}
              source={require('../../../assets/harutob-L.jpg')}
            />
          ) : (
            <Image
              resizeMode={'contain'}
              style={{marginRight: 10, flex: 1, height: 100}}
              source={require('../../../assets/logo.png')}
            />
          )}
          <Text style={[TextStyles.normalText, TextStyles.bold, {flex: 1}]}>
            {this.props.productName}
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginHorizontal: 5,
            marginVertical: 5,
            flex: 1,
          }}>
          <View
            style={{
              flex: 1,
              height: 50,
              backgroundColor: Colors.light_grey,
              marginRight: 20,
              paddingLeft: 20,
              justifyContent: 'center',
            }}>
            <Text style={[TextStyles.bold, TextStyles.normalText]}>
              施工日{'\t' + this.props.date}
            </Text>
          </View>
          <Ripple
            style={[{marginRight: 20, flexDirection: 'row'}]}
            onPress={() => {
              this.props.navigation.navigate('SigongDetail', {
                passParam: this.props.fullData,
              });
            }}>
            <Text
              style={[
                TextStyles.underline,
                TextStyles.bold,
                TextStyles.normalText,
              ]}>
              詳細➔
            </Text>
          </Ripple>
        </View>
      </View>
    );
  }
}

export default withNavigation(SigongCard);
