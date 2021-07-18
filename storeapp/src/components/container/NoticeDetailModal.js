import React, {Component} from 'react';
import {View, Text, Modal, Image, ScrollView} from 'react-native';
import ButtonEx from '../../components/button/ButtonEx';
import MyStyles from '../../constants/MyStyles';
import PropTypes from 'prop-types';

export default class NoticeDetailModal extends Component {
  state = {
    visible: false,
  };

  constructor(props) {
    super(props);
  }

  doModal = () => {
    this.setState({visible: true});
  };

  render() {
    return (
      <Modal
        transparent={true}
        visible={this.state.visible}
        animationType={'fade'}>
        <View style={MyStyles.Modal}>
          <View style={MyStyles.modalCloseView}>
            <ButtonEx
              icon={'times'}
              iconSize={15}
              style={{borderWidth: 0}}
              onPress={() => {
                this.setState({visible: false});
              }}
            />
          </View>
          <ScrollView>
            <View style={[MyStyles.container, MyStyles.m_15]}>
              <Text style={MyStyles.mb_15}>
                日付: {this.props.data ? this.props.data.date : ''}
              </Text>
              <Text style={MyStyles.mb_15}>
                お知らせジャンル: {this.props.data ? this.props.data.kind : ''}
              </Text>
              <Text style={MyStyles.mb_15}>
                お知らせタイトル: {this.props.data ? this.props.data.title : ''}
              </Text>
              <Text style={MyStyles.mb_15}>
                内容: {this.props.data ? this.props.data.content : ''}
              </Text>
              {this.props.data ? (
                <Image
                  style={{width: 160, height: 90}}
                  resizeMode={'contain'}
                  source={{uri: this.props.data.image_path}}
                />
              ) : null}
            </View>
          </ScrollView>
        </View>
      </Modal>
    );
  }
}

NoticeDetailModal.propTypes = {
  onCancel: PropTypes.func,
  data: PropTypes.object,
};
