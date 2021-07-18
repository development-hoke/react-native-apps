import React, {Component} from 'react';
import MyStyles from '../../constants/MyStyles';
import {Text} from 'react-native';
import Ripple from 'react-native-material-ripple';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import 'moment/min/locales';
import PropTypes from 'prop-types';

var moment = require('moment');

export default class DateInput extends Component {
  state = {
    visible: false,
    value: null,
  };

  constructor(props) {
    super(props);
    this.state = {value: this.props.init_value};
  }

  render() {
    return (
      <>
        <Ripple
          onPress={() => this.setState({visible: true})}
          style={[
            MyStyles.ml_15,
            MyStyles.input,
            {justifyContent: 'center'},
            this.props.style,
          ]}>
          <Text
            style={{
              marginLeft: 5,
              color: this.state.value ? 'black' : '#888',
            }}>
            {this.state.value
              ? moment(this.state.value).format('YYYY-MM-DD')
              : this.props.placeHolder}
          </Text>
        </Ripple>
        <DateTimePickerModal
          isVisible={this.state.visible}
          date={this.state.value || new Date()}
          mode={'date'}
          onConfirm={date => {
            this.setState({value: date, visible: false});
            this.props.onChange(date);
          }}
          onCancel={() => this.setState({visible: false})}
        />
      </>
    );
  }
}

DateInput.propTypes = {
  placeHolder: PropTypes.string,
  onChange: PropTypes.func.required,
  init_value: PropTypes.string,
};
