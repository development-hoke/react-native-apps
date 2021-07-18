import {observer} from 'mobx-react';
import React from 'react';
import {Image, Keyboard, Modal, Text, View, TouchableWithoutFeedback} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import HeavyLabel from '../../components/label/heavyLabel';
import GlobalState from '../../mobx/GlobalState';
import Colors from '../../constants/Colors';
import TextStyles from '../../constants/TextStyles';

@observer
class MyInfoPopup extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={this.props.visible}
        onRequestClose={() => {
          this.props.onCancel();
        }}>
        <View style={{width: '100%', height: '100%'}}>
          <View style={{flex: 1}}>
            <TouchableWithoutFeedback
              onPress={() => {
                this.props.onCancel();
              }}
              style={{backgroundColor: Colors.primary}}>
              <View
                style={{
                  width: '100%',
                  height: '100%',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <TouchableWithoutFeedback
                  onPress={() => {
                    Keyboard.dismiss();
                  }}>
                  <View
                    style={{
                      width: '80%',
                      backgroundColor: Colors.black,
                      borderRadius: 50,
                      borderColor: Colors.orange,
                      borderWidth: 4,
                      elevation: 10,
                    }}>
                    <View
                      style={{
                        paddingVertical: 20,
                        paddingHorizontal: 10,
                        marginHorizontal: 25,
                        alignItems: 'center',
                      }}>
                      <View style={{ width: 110, height: 110, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center' }}>
                        <QRCode
                          value={GlobalState.myInfo.member_no}
                          backgroundColor='white'
                        />
                      </View>
                      <HeavyLabel
                        label={'お客様ID'}
                        style={{color: Colors.white, marginTop: 10}}
                      />
                      <HeavyLabel
                        label={GlobalState.myInfo.member_no}
                        style={{
                          color: Colors.white,
                          fontSize: 35,
                          lineHeight: 40,
                          marginTop: 10,
                        }}
                      />
                      <HeavyLabel
                        label={'パスワード'}
                        style={[{color: Colors.white, marginTop: 20}]}
                      />
                      <HeavyLabel
                        label={GlobalState.myInfo.password}
                        style={{
                          color: Colors.white,
                          fontSize: 35,
                          lineHeight: 40,
                          marginTop: 10,
                        }}
                      />
                      <HeavyLabel
                        label={
                          '※このIDとパスワードは再ログイン時に必要です。 必ず忘れないようにメモしてください。'
                        }
                        style={[
                          {
                            color: Colors.white,
                            fontSize: 18,
                            fontWeight: 'normal',
                            textAlign: 'center',
                            letterSpacing: -2,
                            marginTop: 20,
                          },
                        ]}
                      />
                    </View>
                  </View>
                </TouchableWithoutFeedback>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </View>
      </Modal>
    );
  }
}

export default MyInfoPopup;
