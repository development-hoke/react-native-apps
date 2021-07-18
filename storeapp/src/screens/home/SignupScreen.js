import React, {Component} from 'react';
import {StyleSheet, View, TextInput, Picker, Alert, Text} from 'react-native';
import LoginTemplate from '../../components/loginTemplate';
import MyStyles from '../../constants/MyStyles';
import ButtonEx from '../../components/button/ButtonEx';
import {requestGet, requestPost, Net, alertNetworkError, validateEmail} from '../../utils/ApiUtils';
import GlobalState from '../../mobx/GlobalState';

const styles = StyleSheet.create({
  label: {
    marginTop: 15,
    textAlign: 'left',
    width: 300,
  },
  input: {
    width: 300,
  },
  button: {
    width: 300,
    marginTop: 15,
  },
});

export default class SignupScreen extends Component {
  state = {
    name: '',
    email: '',
    password: '',
    confirm: '',
    shop: '',
    stores: [],
  };

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <LoginTemplate>
        <Text style={styles.label}>名前</Text>
        <TextInput
            style={[MyStyles.input, styles.input]}
            value={this.state.name}
            onChangeText={value => {
              this.setState({name: value});
            }}
        />
        <Text style={styles.label}>メールアドレス</Text>
        <TextInput
          keyboardType={'email-address'}
          style={[MyStyles.input, styles.input]}
          value={this.state.email}
          onChangeText={value => {
            this.setState({email: value});
          }}
        />
        <Text style={styles.label}>ショップ</Text>
        <View style={[MyStyles.input, styles.input]}>
          <Picker
            style={MyStyles.input}
            selectedValue={this.state.shop}
            onValueChange={value => {
              this.setState({shop: value});
            }}>
            {this.state.stores !== null
              ? this.state.stores.map((shop, idx) => (
                  <Picker.Item
                    label={shop.name}
                    value={shop.id}
                    key={shop.id}
                  />
                ))
              : null}
          </Picker>
        </View>
        <Text style={styles.label}>パスワード</Text>
        <TextInput
          style={[MyStyles.input, styles.input]}
          value={this.state.password}
          secureTextEntry={true}
          onChangeText={value => {
            this.setState({password: value});
          }}
        />
        <Text style={styles.label}>パスワード(再度入力)</Text>
        <TextInput
          style={[MyStyles.input, styles.input]}
          value={this.state.confirm}
          secureTextEntry={true}
          onChangeText={value => {
            this.setState({confirm: value});
          }}
        />
        <ButtonEx
          text={'登録'}
          type={'black'}
          style={styles.button}
          onPress={this.doSignup}
        />
      </LoginTemplate>
    );
  }

  componentDidMount() {
    requestGet(Net.store.list).then(json => {
      this.setState({stores: json.data});
    });
  }

  doSignup = () => {
    if (!this.state.name || this.state.name === '') {
      Alert.alert('登録', '名前を入力してください.');
      return;
    }
    if (!this.state.email || this.state.email === '') {
      Alert.alert('登録', 'メールアドレスを入力してください.');
      return;
    }
    if (!validateEmail(this.state.email)) {
      Alert.alert('登録', '正しいメールアドレスを入力してください.');
      return;
    }

    if (!this.state.password || this.state.password === '') {
      Alert.alert('登録', 'パスワードを入力してください.');
      return;
    }
    if (this.state.password !== this.state.confirm) {
      Alert.alert('登録', 'パスワード確認をまたしてください');
      return;
    }
    if (this.state.password.length < 8) {
      Alert.alert('登録', 'パスワードを8文字以上入力してください.');
      return;
    }
    requestPost(Net.auth.signup, {
      name: this.state.name,
      email: this.state.email,
      password: this.state.password,
      store: this.state.shop,
      deviceId: GlobalState.deviceId,
    })
      .then(json => {
        Alert.alert(
          '登録成功',
          '会員登録に成功しました. ログインしてください.',
        );
        this.props.navigation.navigate('Login');
      })
      .catch(err => {
        alertNetworkError(err);
      });
  };
}
