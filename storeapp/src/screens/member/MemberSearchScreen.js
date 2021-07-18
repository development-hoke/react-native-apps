import React, {Component} from 'react';
import {View, Text, SafeAreaView, StyleSheet, TextInput, Alert} from 'react-native';
import ButtonEx from '../../components/button/ButtonEx';
import MyStyles from '../../constants/MyStyles';
import {Net, requestPost, alertNetworkError} from '../../utils/ApiUtils';
import GlobalState from '../../mobx/GlobalState';
import MainLayout from '../../components/container/MainLayout';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default class MemberSearchScreen extends Component {
  state = {
    name: '',
    tel_no: '',
    code: '',
  };

  componentDidMount() {
    this.refresh = this.props.navigation.addListener('willFocus', () => {
      if (this.props.navigation.state.params) {
        this.setState({code: this.props.navigation.state.params.code});
      }
    });
  }

  componentWillUnmount() {
    this.refresh.remove();
  }

  searchMember = () => {
    if (!this.state.code || this.state.code === '') {
      if (!this.state.name || this.state.name === '') {
        Alert.alert('会員検索', '氏名を入力してください.');
        return;
      }
      if (!this.state.tel_no || this.state.tel_no === '') {
        Alert.alert('会員検索', '電話番号を入力してください.');
        return;
      }
    }
    requestPost(Net.member.search, {
      name: this.state.name,
      tel_no: this.state.tel_no,
      code: this.state.code,
    })
      .then(json => {
        if (json.result === Net.error.E_NO_MEMBER)
          Alert.alert('検索失敗', '検索結果がないです.');
        else if (json.result === Net.error.E_TOO_MANY_MEMBER)
          Alert.alert('検索失敗', '検索された会員があまりにも多いです.');
        else {
          this.props.navigation.navigate('MemberDetail', {
            memberId: json.memberId,
          });
        }
      })
      .catch(err => {
        alertNetworkError(err);
      });
  };

  render() {
    return (
      <MainLayout
        title={'会員検索'}
        homeCallback={() => this.props.navigation.navigate('Main')}
        rightHeader={
          <ButtonEx
            onPress={() =>
              this.props.navigation.navigate('MemberRegister', {
                memberId: 0,
            })}
            text={'会員登録'}
            icon={'user-plus'}
            type={'danger'}
          />
        }>
        <View
          style={[
            styles.container,
            {
              flexDirection: 'row',
              justifyContent: 'space-between',
            },
          ]}>
          <View style={{flex: 1}}>
            <ButtonEx
              text={'会員コード読み取り\n'}
              icon={'qrcode'}
              iconSize={80}
              vertical={true}
              type={'info'}
              style={{flex: 1}}
              onPress={() => this.props.navigation.navigate('QRScan', {prevScreen: 'MemberSearch'})}
            />
            <Text style={{marginTop: 20}}>会員番号</Text>
            <TextInput
              style={[MyStyles.input]}
              onChangeText={text => this.setState({code: text})}
              value={this.state.code}
            />
          </View>
          <View
            style={{
              borderRadius: 5,
              borderWidth: 1,
              flex: 1,
              marginLeft: 10,
              padding: 20,
              justifyContent: 'center',
            }}>
            <Text>氏名</Text>
            <TextInput
              style={[MyStyles.input, {marginTop: 10}]}
              onChangeText={value => {
                this.setState({name: value});
              }}
            />
            <Text style={{marginTop: 20}}>電話番号</Text>
            <TextInput
              style={[MyStyles.input, {marginTop: 10}]}
              onChangeText={value => {
                this.setState({tel_no: value});
              }}
            />
          </View>
        </View>
        <View
          style={[
            {
              marginTop: 15,
              alignItems: 'flex-end',
            },
          ]}>
          <ButtonEx
            text={'検索'}
            style={{width: 100}}
            type={'primary'}
            onPress={this.searchMember}
          />
        </View>
      </MainLayout>
    );
  }
}
