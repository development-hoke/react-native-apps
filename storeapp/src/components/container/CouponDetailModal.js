import React, {Component} from 'react';
import {View, Text, Modal, Image, SafeAreaView} from 'react-native';
import ButtonEx from '../../components/button/ButtonEx';
import MyStyles from '../../constants/MyStyles';
import PropTypes from 'prop-types';

export default class CouponDetailModal extends Component {
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
        <View style={{flex: 1, justifyContent: 'center'}}>
          <View style={{...MyStyles.Modal, height: 400}}>
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
            <SafeAreaView style={{flexDirection: 'row', flex: 1}}>
              <View style={{flex: 1, margin: 30}}>
                <Text style={MyStyles.mb_15}>
                  {this.props.data
                    ? this.props.data.type === 0
                      ? 'ハルトコーティング'
                      : 'ハルトコーティングtypeF'
                    : ''}
                </Text>
                <Text style={MyStyles.mb_15}>
                  {this.props.data ? this.props.data.title : ''}
                </Text>
                <Text style={MyStyles.mb_15}>
                  {this.props.data ? this.props.data.amount : ''}
                  {this.props.data
                    ? this.props.data.unit === 0
                      ? '円引き'
                      : '%引き'
                    : ''}
                </Text>
                <Text style={MyStyles.mb_15}>
                  {this.props.data
                    ? this.props.data.from_date + ' ~ ' + this.props.data.to_date
                    : ''}
                </Text>
                <Text style={MyStyles.mb_15}>
                  {this.props.data
                    ? this.props.data.reuse === 0
                      ? '一回きり'
                      : '期間内無制限'
                    : ''}
                </Text>
                <ButtonEx
                  style={{marginBottom: 20}}
                  text={'期間変更'}
                  type={'primary'}
                  onPress={() => this.ceModal.doModal()}
                />
                <ButtonEx
                  text={'配信停止'}
                  type={'secondary'}
                  onPress={() => this.ceModal.doModal()}
                />
              </View>
              <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                {this.props.data ? (
                  <Image
                    style={{width: 160, height: 90}}
                    resizeMode={'contain'}
                    source={{uri: this.props.data.image_path}}
                  />
                ) : null}
              </View>
            </SafeAreaView>
          </View>
        </View>
      </Modal>
    );
  }
}

CouponDetailModal.propTypes = {
  data: PropTypes.object.required,
};
