import {observer} from 'mobx-react';
import React from 'react';
import {
  Keyboard,
  Modal,
  Text,
  View,
  TouchableWithoutFeedback,
} from 'react-native';
import HeavyLabel from '../components/label/heavyLabel';
import Colors from '../constants/Colors';

@observer
class TransferCodePopup extends React.Component {
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
                      <HeavyLabel
                        label={'引き継ぎコードの発行'}
                        style={{color: Colors.white}}
                      />
                      <HeavyLabel
                        label={this.props.transferCode}
                        style={{
                          color: Colors.white,
                          fontSize: 35,
                          lineHeight: 40,
                          marginTop: 10,
                        }}
                      />
                      <HeavyLabel
                        label={
                          '※引き継ぎの際は新しい端末で２４時間以内に引き継ぎコードを入力してください\n'
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

export default TransferCodePopup;
