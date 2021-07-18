import React, {Component} from 'react';
import {
  View,
  Text,
  TextInput,
  Modal,
  FlatList,
  Alert,
} from 'react-native';
import ButtonEx from '../../components/button/ButtonEx';
import MyStyles from '../../constants/MyStyles';
import {
  requestPost,
  requestGet,
  Net,
  alertNetworkError,
} from '../../utils/ApiUtils';
import MainLayout from '../../components/container/MainLayout';
import Ripple from 'react-native-material-ripple';

export default class TossupScreen extends Component {
  state = {
    data: [],
    selected: {
      id: 0,
      content: 0,
      created_at: '',
    },
    content: '',
    viewEdit: false,
    viewDetail: false,
  };

  componentDidMount() {
    requestGet(Net.tossup.get)
      .then(json => {
        this.setState({data: json.data});
      })
      .catch(err => {
        alertNetworkError(err);
      });
  }

  sendTossup = () => {
    if (this.state.content === '') {
      Alert.alert('トスアップ申請', '内容を入力してください.');
      return;
    }
    requestPost(Net.tossup.add, {content: this.state.content})
      .then(json => {
        this.setState({data: json.data});
      })
      .catch(err => {
        alertNetworkError(err);
      });
    this.setState({viewEdit: false});
  };

  _renderItem = data => {
    return (
      <Ripple
        style={{borderBottomWidth: 1, borderColor: '#ddd'}}
        onPress={() => {
          this.setState({selected: data.item, viewDetail: true});
        }}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text style={{width: 120, padding: 5, textAlign: 'center'}}>{data.item.created_at}</Text>
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
        <Modal transparent={true} visible={this.state.viewEdit}>
          <View style={{flex: 1, justifyContent: 'center'}}>
            <View style={{...MyStyles.Modal, height: 420}}>
              <View style={MyStyles.modalCloseView}>
                <ButtonEx
                  icon={'times'}
                  iconSize={15}
                  style={{borderWidth: 0}}
                  onPress={() => {
                    this.setState({viewEdit: false});
                  }}
                />
              </View>
              <TextInput
                multiline={true}
                placeholder={'内容を入力してください.'}
                onChangeText={text => {
                  this.setState({content: text});
                }}
                style={{
                  backgroundColor: 'white',
                  margin: 15,
                  borderWidth: 1,
                  flex: 1,
                  textAlignVertical: 'top',
                }}
              />
              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 10,
                }}>
                <ButtonEx
                  onPress={() => this.sendTossup()}
                  type={'primary'}
                  text={'送信'}
                  textStyle={{
                    paddingLeft: 30,
                    paddingRight: 30,
                  }}
                />
              </View>
            </View>
          </View>
        </Modal>
        <Modal transparent={true} visible={this.state.viewDetail}>
          <View style={{flex: 1, justifyContent: 'center'}}>
            <View style={MyStyles.Modal}>
              <View style={MyStyles.modalCloseView}>
                <ButtonEx
                  icon={'times'}
                  iconSize={15}
                  style={{borderWidth: 0}}
                  onPress={() => {
                    this.setState({viewDetail: false});
                  }}
                />
              </View>
              <Text style={{margin: 20}}>申請日: {this.state.selected.created_at}</Text>
              <Text style={{margin: 20, marginTop: 0}}>
                内容:{'\n' + this.state.selected.content}
              </Text>
            </View>
          </View>
        </Modal>
        <View style={{...MyStyles.tableRow, paddingLeft: 15, paddingRight: 15}}>
          <Text style={[MyStyles.tableHeader, {width: 120}]}>日付</Text>
          <Text style={[MyStyles.tableHeader, {flex: 1}]}>内容</Text>
        </View>
        <View style={{flex: 1, paddingLeft: 15, paddingRight: 15}}>
          <FlatList data={this.state.data} renderItem={this._renderItem} />
        </View>
        <View
          style={[
            {
              marginTop: 15,
              marginBottom: 15,
              alignItems: 'flex-end',
              paddingLeft: 15, paddingRight: 15
            },
          ]}>
          <ButtonEx
            text={'送信'}
            type={'danger'}
            style={{width: 100}}
            onPress={() => {
              this.setState({content: '', viewEdit: true});
            }}
          />
        </View>
      </MainLayout>
    );
  }
}
