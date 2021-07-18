import React, {Component} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  Linking,
  TouchableHighlight,
} from 'react-native';
import {
  requestPost,
  Net,
  alertNetworkError,
} from '../../utils/ApiUtils';
import MainLayout from '../../components/container/MainLayout';
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import MyStyles from '../../constants/MyStyles';
import PropTypes from 'prop-types';

class LinkText extends Component {
  render() {
    return (
      <TouchableHighlight
        underlayColor={'#ddddff'}
        onPress={this.props.onPress}>
        <Text style={MyStyles.link}>{this.props.text}</Text>
      </TouchableHighlight>
    );
  }
}

LinkText.propsType = {
  text: PropTypes.string.isRequired,
};

const styles = StyleSheet.create({
  manual_container: {
    width: 180,
    height: 100,
    borderWidth: 1,
    margin: 10,
    borderRadius: 5,
    borderColor: '#34BFA3',
    alignItems: 'center',
  },
});

export default class CarryingTool extends Component {
  state = {
    manuals: [],
    item: null,
  };

  componentDidMount(): void {
    requestPost(Net.manual.tool)
      .then(json => {
        this.setState({manuals: json.manuals});
      })
      .catch(err => {
        alertNetworkError(err);
      });
  }

  _renderManual = data => {
    return (
      <View style={styles.manual_container}>
        <Icon
          name={'leanpub'}
          size={30}
          color={'#34BFA3'}
        />
        <LinkText
          text={data.item.display_name}
          onPress={() => {
            this.openPdf(data.item.url);
          }}
        />
      </View>
    );
  };

  openPdf(url) {
    Linking.openURL(url);
  }

  render() {
    return (
      <MainLayout
        title={'提案ツール'}
        homeCallback={() => {
          this.props.navigation.navigate('Main');
        }}>
        <SafeAreaView style={{flex: 1, alignItems: 'center'}}>
          <FlatList
            data={this.state.manuals}
            numColumns={4}
            renderItem={this._renderManual}
          />
        </SafeAreaView>
      </MainLayout>
    );
  }
}
