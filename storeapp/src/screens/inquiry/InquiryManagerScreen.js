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
  alertNetworkError,
  Net,
  requestGet,
  requestPost,
} from '../../utils/ApiUtils';
import MainLayout from '../../components/container/MainLayout';
import Ripple from 'react-native-material-ripple';

export default class InquiryManagerScreen extends Component {
  state = {
    data: [],
    selected: {
      id: 1,
      date: null,
      customer_name: '',
      sender_name: '',
      content: '',
    },
    content: '',
    modalVisible: false,
  };

  componentDidMount(): void {
    requestGet(Net.inquiry.get)
      .then(json => {
        this.setState({data: json.data});
      })
      .catch(err => {
        alertNetworkError(err);
      });
  }

  sendInquiry = () => {
    if (this.state.content === '') {
      Alert.alert('お問い合わせ', '内容を入力してください.');
      return;
    }
    requestPost(Net.inquiry.reply, {
      id: this.state.selected.id,
      reply: this.state.content,
    })
      .then(json => {
        this.setState({data: json.data});
      })
      .catch(err => {
        alertNetworkError(err);
      });
    this.setState({modalVisible: false});
  };

  _renderItem = data => {
    return (
      <Ripple
        style={{borderBottomWidth: 1, borderColor: '#ddd'}}
        onPress={() => {
          this.setState({selected: data.item, modalVisible: true});
        }}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text style={{width: 120, padding: 5, textAlign: 'center'}}>
            {data.item.date}
          </Text>
          <Text style={{width: 100, padding: 5, textAlign: 'center'}}>
            {data.item.customer_name
              ? data.item.customer_name
              : data.item.sender_name}
          </Text>
          <Text style={{flex: 1, padding: 5}}>{data.item.content}</Text>
        </View>
      </Ripple>
    );
  };

  render() {
    return (
      <MainLayout
        title={'お問い合わせ一覧'}
        homeCallback={() => {
          this.props.navigation.navigate('Main');
        }}>
        <Modal transparent={true} visible={this.state.modalVisible}>
          <View style={MyStyles.Modal}>
            <View style={MyStyles.modalCloseView}>
              <ButtonEx
                icon={'times'}
                iconSize={15}
                style={{borderWidth: 0}}
                onPress={() => {
                  this.setState({modalVisible: false});
                }}
              />
            </View>
            <View style={{flex: 1, margin: 15}}>
              <Text style={{padding: 5}}>
                日付: {this.state.selected.date}
              </Text>
              <Text style={{padding: 5}}>
                名前:{' '}
                {this.state.selected.customer_name
                  ? this.state.selected.customer_name
                  : this.state.selected.sender_name}
              </Text>
              <Text style={{padding: 5}}>
                内容: {this.state.selected.content}
              </Text>
              <TextInput
                multiline={true}
                placeholder={'内容を入力してください.'}
                onChangeText={text => {
                  this.setState({content: text});
                }}
                style={{
                  backgroundColor: 'white',
                  borderWidth: 1,
                  flex: 1,
                  marginTop: 15,
                  textAlignVertical: 'top',
                }}
              />
            </View>
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 15,
              }}>
              <ButtonEx
                onPress={() => this.sendInquiry()}
                type={'primary'}
                text={'送信'}
                textStyle={{
                  paddingLeft: 30,
                  paddingRight: 30,
                }}
              />
            </View>
          </View>
        </Modal>
        <View style={MyStyles.tableRow}>
          <Text style={[MyStyles.tableHeader, {width: 120}]}>日付</Text>
          <Text style={[MyStyles.tableHeader, {width: 100}]}>名前</Text>
          <Text style={[MyStyles.tableHeader, {flex: 1}]}>内容</Text>
        </View>
        <FlatList
          data={this.state.data}
          renderItem={this._renderItem}
          style={{marginBottom: 15, flex: 1}}
        />
      </MainLayout>
    );
  }
}
