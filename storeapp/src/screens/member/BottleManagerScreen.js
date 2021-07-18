import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ImageBackground,
  ScrollView,
  Modal,
} from 'react-native';
import ButtonEx from '../../components/button/ButtonEx';
import PropTypes from 'prop-types';
import TextStyles from '../../constants/TextStyles';
import {Net, requestPost, alertNetworkError} from '../../utils/ApiUtils';
import GlobalState from '../../mobx/GlobalState';
import MyStyles from '../../constants/MyStyles';
import MainLayout from "../../components/container/MainLayout";
import Ripple from "react-native-material-ripple";

class LinkText extends Component {
  render() {
    return (
      <Ripple
        onPress={this.props.onPress}>
        <Text style={styles.link}>{this.props.text}</Text>
      </Ripple>
    );
  }
}

LinkText.propsType = {
  text: PropTypes.string.isRequired,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  innerContainer: {
    marginLeft: 20,
    marginRight: 20,
    marginTop: 10,
    marginBottom: 20,
  },
  content: {height: 35},
  link: {
    textDecorationLine: 'underline',
  },
  image: {
    flex: 1,
    marginTop: 10,
  },
  contentModal: {
    marginTop: 15,
    marginLeft: 15,
    marginRight: 15,
  },
});

export default class BottleManagerScreen extends Component {
  state = {
    bottleRemain: 0,
    bottleUseDataLimit: [],
    bottleUseData: [],
    from_date: '',
    to_date: '',
    modalVisible: false,
  };

  componentDidMount(): void {
    requestPost(Net.bottle.get, {
      id: this.props.navigation.state.params.memberId,
    })
      .then(json => {
        this.setState({bottleUseDataLimit: json.bottleUseDataLimit});
        this.setState({bottleRemain: json.bottleRemain});
        this.setState({from_date: json.from_date});
        this.setState({to_date: json.to_date});
      })
      .catch(err => {
        alertNetworkError(err);
      });
  }

  toggleModal(visible) {
    if (visible === true) {
      requestPost(Net.bottle.get_use, {
        id: this.props.navigation.state.params.memberId,
      })
        .then(json => {
          this.setState({bottleUseData: json.bottleUseData});
        })
        .catch(err => {
          alertNetworkError(err);
        });
    }
    this.setState({modalVisible: visible});
  }

  bottleDelete() {
    requestPost(Net.bottle.delete, {
      id: this.props.navigation.state.params.memberId,
    })
      .then(json => {
        this.setState({bottleRemain: json.bottleRemain});
      })
      .catch(err => {
        alertNetworkError(err);
      });
  }

  render() {
    return (
      <MainLayout
        title={''}
        homeCallback={() => this.props.navigation.navigate('Main')}
        rightHeader={
          <ButtonEx
            onPress={() => this.bottleDelete()}
            text={'削除'}
            type={'danger'}
          />
        }>
        <Modal transparent={true} visible={this.state.modalVisible}>
          <View style={MyStyles.Modal}>
            <View
              style={{
                alignItems: 'flex-end',
                justifyContent: 'center',
                marginRight: 5,
              }}>
              <ButtonEx
                icon={'times'}
                iconSize={15}
                style={{borderWidth: 0}}
                onPress={() => {
                  this.toggleModal(!this.state.modalVisible);
                }}
              />
            </View>
            <View>
              <Text style={{fontSize: 30, textAlign: 'center'}}>ボトル使用一覧</Text>
            </View>
            <View style={{flex: 1, margin: 15, padding: 1, borderWidth: 1, backgroundColor: 'white'}}>
              <ScrollView>
                {this.state.bottleUseData.map((item, index) => (
                  <ButtonEx
                    style={styles.contentModal}
                    type={'warning'}
                    text={
                      item.date + '\n(' + item.goods + '    ' + item.amount + 'cc)'
                    }
                  />
                ))}
              </ScrollView>
            </View>
          </View>
        </Modal>
        <View style={{flex: 1, flexDirection: 'row'}}>
          <View style={{flex: 1, marginLeft: 20}}>
            <ImageBackground
              source={require('../../../assets/bottle50.png')}
              style={{flex: 6, alignItems: 'center'}}
              resizeMode={'contain'}>
              <Image
                source={require('../../../assets/bottle_L.png')}
                style={[styles.image,{flex: 1}]}
                resizeMode={'contain'}
              />
              <Text style={[TextStyles.loginLabel,{marginBottom: 30}]}>
                残量　{this.state.bottleRemain}cc
              </Text>
            </ImageBackground>
            <View style={{flex: 1, alignItems: 'center'}}>
              <Text style={TextStyles.headerLabel}>
                {GlobalState.shopName}
              </Text>
            </View>
          </View>
          <View style={{flex: 1, marginRight: 20}}>
            <View style={{flex: 6, alignItems: 'flex-start'}}>
              <Text style={TextStyles.middleSize}>ボトル使用履歴</Text>
              {this.state.bottleUseDataLimit.map((item, index) => (
                  <View style={{flex: 1, justifyContent: 'center'}}>
                    <Text style={{flex: 1}}>{'\t'}・{item.date}</Text>
                    <Text style={{flex: 1}}>{'\t\t\t\t\t\t'}({item.goods}  {item.amount}cc)</Text>
                  </View>
              ))}
            </View>
            <View
              style={{
                flex: 1,
                alignItems: 'flex-end',
                justifyContent: 'flex-start',
                marginRight: 80,
              }}>
              <LinkText
                text={'一覧→'}
                onPress={() => this.toggleModal(true)}
              />
            </View>
            <View style={{flex: 1, alignItems: 'center'}}>
              <Text style={TextStyles.middleSize}>
                使用期限
              </Text>
            </View>
            <View style={{flex: 1, alignItems: 'center'}}>
              <Text style={TextStyles.middleSize}>
                {this.state.from_date} ~ {this.state.to_date}
              </Text>
            </View>
            <View style={{flex: 1, alignItems: 'center', marginTop: 10, marginBottom: 20}}>
              <ButtonEx
                onPress={() =>
                  this.props.navigation.navigate('BottleBuy', {
                    memberId: this.props.navigation.state.params.memberId,
                  })
                }
                type={'warning'}
                text={'購入手続き'}
              />
            </View>
          </View>
        </View>
      </MainLayout>
    );
  }
}
