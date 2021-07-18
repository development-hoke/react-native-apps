import React, {Component} from 'react';
import {SCREEN_WIDTH} from '../../constants/AppConstants';
import {StyleSheet, Text, View} from 'react-native';
import Colors from '../../constants/Colors';
import Icon from 'react-native-vector-icons/FontAwesome';
import Ripple from 'react-native-material-ripple';
import GlobalState from '../../mobx/GlobalState';
import Toast from 'react-native-root-toast';
import {
  calendar_dayCell_width,
  calendar_leftTopCell_width,
} from '../../constants/AppConstants';

class HeaderCell extends Component {
  constructor(props) {
    super(props);
    this.state = {isWeekEnd: false};
  }
  componentDidMount(): void {
    if (this.props.dayOfWeekNum == 6 || this.props.dayOfWeekNum == 0) {
      this.setState({isWeekEnd: true});
    }
  }

  render() {
    const dayOfWeekNum = this.props.dayOfWeekNum;
    return (
      <View
        style={[
          {backgroundColor: Colors.very_light_grey, justifyContent: 'center'},
          styles.dayCell,
        ]}>
        <Text
          style={[
            {textAlign: 'center', lineHeight: 20},
            dayOfWeekNum == 6 && {color: Colors.blue},
            dayOfWeekNum == 0 && {color: Colors.red},
          ]}>
          {this.props.day}({this.props.dayOfWeek})
        </Text>
        {this.state.isWeekEnd ? (
          <View
            style={[
              {
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                opacity: 0.3,
              },
              dayOfWeekNum == 6 && {backgroundColor: Colors.blue},
              dayOfWeekNum == 0 && {backgroundColor: Colors.red},
            ]}
          />
        ) : null}
      </View>
    );
  }
}

export class HourCell extends Component {
  render() {
    return (
      <View style={[styles.hourCell]}>
        <Text style={[{textAlign: 'center'}]}>{this.props.time}</Text>
      </View>
    );
  }
}

export class CalendarScheduleBody extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <View
        style={{
          flexDirection: 'row',
        }}>
        <View
          style={{
            width: 100,
            justifyContent: 'center',
          }}>
          {GlobalState.hoursList.map((time, index) => (
            <HourCell key={time.f_id.toString()} time={time.f_time} />
          ))}
        </View>
        {this.props.scheduleDataOfWeek.map(dayData => {
          let domData = (
            <View
              style={{
                width: calendar_dayCell_width,
                height: 30 * GlobalState.hoursList.length,
                borderColor: Colors.white,
                borderRightWidth: 2,
                borderLeftWidth: 2,
                borderBottomWidth: 4,
              }}
            />
          );
          if (dayData.length > 0) {
            domData = dayData.map((data, index) => (
              <ScheduleCell
                key={data.date.toString() + data.time.toString()}
                type={data.type}
                date={data.date}
                time={data.time}
                reserveId={data.reserveId}
                reserve_purpose={data.reserve_purpose}
                other={data.other}
                confirm={data.confirm}
                onPress={reserveDateData => {
                  this.props.getReservedData(reserveDateData);
                }}
              />
            ));
          }
          return <View>{domData}</View>;
        })}
      </View>
    );
  }
}

export class CalendarHeaderOfWeek extends Component {
  render() {
    return (
      <View
        style={{
          flexDirection: 'row',
          borderBottomWidth: 2,
          borderColor: Colors.white,
        }}>
        <View
          style={{
            width: 100,
            height: 60,
            backgroundColor: Colors.very_light_grey,
            justifyContent: 'center',
            borderColor: Colors.white,
            borderRightWidth: 1,
            borderLeftWidth: 1,
          }}>
          <Text style={[{textAlign: 'center'}]}>時間</Text>
        </View>
        <View
          style={{
            flex: 1,
            width: SCREEN_WIDTH - calendar_leftTopCell_width - 30,
          }}>
          <View
            style={{
              backgroundColor: '#EBEAE6',
              flex: 1,
              borderColor: Colors.white,
              borderBottomWidth: 2,
              borderRightWidth: 2,
              borderLeftWidth: 2,
              justifyContent: 'center',
            }}>
            <Text style={{textAlign: 'center'}}>
              {this.props.weekData[0].year + '.' + this.props.weekData[0].month}
            </Text>
          </View>
          <View style={{flexDirection: 'row', flex: 1}}>
            {this.props.weekData.map((item, index) => (
              <HeaderCell
                key={
                  item.year.toString() +
                  item.month.toString() +
                  item.day.toString()
                }
                day={item.day}
                dayOfWeek={item.dayOfWeek}
                dayOfWeekNum={item.dayOfWeekNum}
              />
            ))}
          </View>
        </View>
      </View>
    );
  }
}
class ScheduleCell extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isNone: false,
      isCancel: false,
      isOK: false,
      isSelected: false,
    };
  };

  onPressCell = () => {
    if (this.state.isNone) {
      this.setState({isNone: false, isOK: true});
      return;
    }
    if (this.state.isOK) {
      this.setState({isNone: true, isOK: false});
      return;
    }
  };

  componentDidMount(): void {
    if (this.props.type == 'none') this.setState({isNone: true});
    if (this.props.type == 'cancel') this.setState({isCancel: true});
    if (this.props.type == 'OK') this.setState({isOK: true});
  }

  render() {
    if (this.state.isCancel) {
      return (
        <Ripple
          onPress={() => {
            if (this.props.onPress) {
              this.props.onPress({
                type: this.props.type,
                date: this.props.date,
                time: this.props.time,
                reserveId: this.props.reserveId,
                reserve_purpose: this.props.reserve_purpose,
                other: this.props.other,
                confirm: this.props.confirm,
              });
            }
          }}
          style={[
            styles.scheduleReserveCell,
            this.props.confirm === 0 && {
              backgroundColor: Colors.orange,
            },
          ]}>
          <View style={{alignItems: 'center'}}>
            <Icon name={'times'} size={15} />
          </View>
        </Ripple>
      );
    } else {
      return (
        <Ripple
          onPress={() => {
            this.onPressCell();
            if (this.props.onPress) {
              this.props.onPress({
                type: this.props.type,
                date: this.props.date,
                time: this.props.time,
                reserveId: null,
                reserve_purpose: null,
                other: null,
                confirm: null,
              });
            }
          }}
          style={[
            {
              backgroundColor: Colors.very_light_grey,
              justifyContent: 'center',
              alignItems: 'center',
            },
            styles.scheduleCell,
          ]}>
          {this.state.isNone ? <Icon name={'minus'} size={15} /> : null}
          {this.state.isOK ? <Icon name={'ban'} size={15} /> : null}
        </Ripple>
      );
    }
  }
}

const styles = StyleSheet.create({
  dayCell: {
    width: calendar_dayCell_width,
    borderRightWidth: 2,
    borderLeftWidth: 2,
    borderColor: Colors.white,
  },
  scheduleCell: {
    width: calendar_dayCell_width,
    height: 30,
    borderColor: Colors.white,
    borderRightWidth: 2,
    borderLeftWidth: 2,
    borderBottomWidth: 4,
  },
  scheduleReserveCell: {
    width: calendar_dayCell_width - 4,
    height: 26,
    margin: 2,
    padding: 8,
    backgroundColor: Colors.light_yellow,
    justifyContent: 'center',
    elevation: 2,
  },
  hourCell: {
    height: 30,
    backgroundColor: Colors.very_light_grey,
    justifyContent: 'center',
    borderColor: Colors.white,
    borderRightWidth: 2,
    borderLeftWidth: 2,
    borderBottomWidth: 4,
  },
});

export default {
  CalendarHeaderOfWeek: CalendarHeaderOfWeek,
  CalendarScheduleBody: CalendarScheduleBody,
  HourCell: HourCell,
};
