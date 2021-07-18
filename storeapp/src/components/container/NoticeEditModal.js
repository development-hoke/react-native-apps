import React, {Component} from 'react';
import {
  View,
  Modal,
  Image,
  StyleSheet,
  TextInput,
  Text,
  ScrollView,
  Alert,
  Platform
} from 'react-native';
import ButtonEx from '../../components/button/ButtonEx';
import MyStyles from '../../constants/MyStyles';
import PropTypes from 'prop-types';
import ImagePicker from 'react-native-image-picker';
import Ripple from 'react-native-material-ripple';
import { launchImageLibrary } from 'react-native-image-picker';

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    height: 40,
    backgroundColor: 'white',
  },
  ripple: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    height: 94,
    marginBottom: 15,
  },
});

export default class NoticeEditModal extends Component {
  state = {
    visible: false,
    id: '',
    kind: '',
    title: '',
    content: '',
    image: '',
    path: '',
  };

  constructor(props) {
    super(props);
  }

  doModal = () => {
    console.log(this.props.data);
    this.setState({
      visible: true,
      id: this.props.data ? this.props.data.id : 0,
      kind: this.props.data ? this.props.data.kind : '',
      title: this.props.data ? this.props.data.title : '',
      content: this.props.data ? this.props.data.content : '',
      image: this.props.data ? this.props.data.image_path : '',
      path: '',
    });
  };

  onCancel = () => {
    this.setState({visible: false});
  };

  getData = () => {
    return {
      id: this.state.id,
      kind: this.state.kind,
      title: this.state.title,
      content: this.state.content,
      image: this.state.path,
    };
  };

  render() {
    return (
      <Modal
        transparent={true}
        visible={this.state.visible}
        animationType={'fade'}>
        <View style={{flex: 1, justifyContent: 'center'}}>
          <View style={{...MyStyles.Modal, height: 420}}>
            <View style={MyStyles.modalCloseView}>
              <ButtonEx
                icon={'times'}
                iconSize={15}
                style={{borderWidth: 0}}
                onPress={() => {
                  this.onCancel();
                }}
              />
            </View>
            <View style={{...MyStyles.m_15}}>
              <View style={[MyStyles.mb_10, {flexDirection: 'row'}]}>
                <Text style={{textAlignVertical: 'center', marginTop: 6}}>ジャンル</Text>
                <TextInput
                  placeholder={'お知らせジャンル'}
                  value={this.state.kind}
                  onChangeText={text => {
                    this.setState({kind: text});
                  }}
                  style={[MyStyles.mr_15, MyStyles.input, {flex: 1, marginLeft: 10}]}
                />
                <Text style={{textAlignVertical: 'center', marginTop: 6}}>タイトル</Text>
                <TextInput
                  placeholder={'お知らせタイトル'}
                  value={this.state.title}
                  onChangeText={text => {
                    this.setState({title: text});
                  }}
                  style={[MyStyles.input, {flex: 1, marginLeft: 10}]}
                />
              </View>
              <Text style={{textAlignVertical: 'center'}}>内容</Text>
              <View style={{height: 150, marginTop: 5}}>
                <TextInput
                  multiline={true}
                  value={this.state.content}
                  placeholder={'内容'}
                  onChangeText={text => {
                    this.setState({content: text});
                  }}
                  style={{
                    ...MyStyles.mb_10,
                    ...MyStyles.input,
                    flex: 1, textAlignVertical: 'top', height: 150, paddingTop: 10
                  }}
                />
              </View>
              <Ripple
                style={styles.ripple}
                onPress={() => {
                  launchImageLibrary({mediaType: 'photo'}, (res) => {
                    if (res.didCancel || res.error) {
                      return;
                    }
                    this.setState({
                      image: Platform.OS === 'android' ? res.uri : res.uri.replace('file://', ''),
                      path: Platform.OS === 'android' ? res.uri : res.uri.replace('file://', '')
                    });
                  })
                }}>
                {this.state.image !== '' ? (
                  <Image
                    source={{uri: this.state.image}}
                    style={{width: 160, height: 90}}
                    resizeMode={'contain'}
                  />
                ) : (
                  <Text style={{color: '#777'}}>
                    イメージを選択しようとすればクリックしてください.
                  </Text>
                )}
              </Ripple>
              <ButtonEx
                type={'primary'}
                text={'送信'}
                onPress={() => {
                  if (this.state.kind === '') {
                    Alert.alert('お知らせ申請', 'お知らせジャンルを入力してください.');
                    return;
                  } else if (this.state.title === '') {
                    Alert.alert('お知らせ申請', 'お知らせタイトルを入力してください.');
                    return;
                  } else if (this.state.content === '') {
                    Alert.alert('お知らせ申請', '内容を入力してください.');
                    return;
                  } else if (this.state.image === '') {
                    Alert.alert('お知らせ申請', 'Imageを選択してください.');
                    return;
                  }
                  if (this.props.onOK) {
                    this.props.onOK();
                    this.onCancel();
                  } else {
                    this.onCancel();
                  }
                }}
              />
            </View>
          </View>
        </View>
      </Modal>
    );
  }
}

NoticeEditModal.propTypes = {
  onOK: PropTypes.func,
};
