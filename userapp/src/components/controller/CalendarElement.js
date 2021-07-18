import React, {Component} from 'react';
import {MessageText, SCREEN_WIDTH} from '../../constants/AppConstants';
import {StyleSheet, Text, View, TouchableHighlight} from 'react-native';
import Colors from '../../constants/Colors';
import Icon from 'react-native-vector-icons/FontAwesome';
import Ripple from 'react-native-material-ripple';
import GlobalState from '../../mobx/GlobalState';
import Toast from 'react-native-root-toast';
import {
  calendar_dayCell_width,
  calendar_leftTopCell_width,
} from '../../constants/AppConstants';
import Common from '../../utils/Common';

class HeaderCell extends Component {
  constructor(props) {
    super(props);
    this.state = {isWeekEnd: false};
  }
  componentDidMount() {
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
          {this.props.day + '\n'}({this.props.dayOfWeek})
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
                height: calendar_dayCell_width * GlobalState.hoursList.length,
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
                key={
                  GlobalState.selectedShopID.toString() +
                  data.date.toString() +
                  data.time.toString()
                }
                type={data.type}
                date={data.date}
                time={data.time}
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
          borderBottomWidth: 4,
          borderColor: Colors.white,
        }}>
        <View
          style={{
            width: 100,
            height: 100,
            backgroundColor: Colors.very_light_grey,
            justifyContent: 'center',
            borderColor: Colors.white,
            borderRightWidth: 2,
            borderLeftWidth: 2,
          }}>
          <Text style={[{textAlign: 'center'}]}>日時を選択</Text>
        </View>
        <View
          style={{
            flex: 1,
            width: SCREEN_WIDTH - calendar_leftTopCell_width - 30,
          }}>
          <View
            style={{
              backgroundColor: '#EBEAE6',
              // flex: 1,
              height: 50,
              borderColor: Colors.white,
              borderBottomWidth: 4,
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
                  'header' +
                  GlobalState.selectedShopID.toString() +
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
      isNone: this.props.type == 'none',
      isCancel: this.props.type == 'cancel',
      isOK: this.props.type == 'OK',
      isSelected: false,
    };
  }

  onPressCell = () => {
    if (this.state.isOK) {
      if (GlobalState.canReserve) {
        this.setState({isSelected: true});
        GlobalState.canReserve = false;
      } else {
        if (this.state.isSelected) {
          GlobalState.canReserve = true;
          this.setState({isSelected: false});
        } else {
          Common.showToast(MessageText.SelectDateGuide);
        }
      }
      return;
    }
    /*
    else {
      if (this.state.isNone) {
        this.setState({isNone: false, isCancel: true, isOK: false});
        return;
      }
      if (this.state.isCancel) {
        this.setState({isNone: true, isCancel: false, isOK: false});
        return;
      }
    }
     */
  };

  render() {
    if (this.state.isOK) {
      return (
        <Ripple
          onPress={() => {
            this.onPressCell();
            if (this.props.onPress) {
              this.props.onPress({
                date: this.props.date,
                time: this.props.time,
              });
            }
          }}
          style={[
            styles.scheduleReserveCell,
            this.state.isSelected && {
              borderColor: Colors.orange,
              borderWidth: 2,
            },
          ]}>
          <View
            style={{
              flex: 1,
              borderColor: Colors.blue,
              borderWidth: 2,
              borderRadius: 100,
              padding: 2,
            }}>
            <View
              style={{
                flex: 1,
                borderColor: Colors.blue,
                borderWidth: 2,
                borderRadius: 100,
              }}
            />
          </View>
        </Ripple>
      );
    } else {
      return (
        <View
          // onPress={() => {
          //   if (!this.state.isNone) {
          //     this.onPressCell();
          //     if (this.props.onPress) {
          //       this.props.onPress(this.state.isOK);
          //     }
          //   }
          //   this.onPressCell();
          // }}
          style={[
            {
              backgroundColor: Colors.very_light_grey,
              justifyContent: 'center',
              alignItems: 'center',
            },
            styles.scheduleCell,
          ]}>
          {this.state.isNone ? <Icon name={'minus'} size={15} /> : null}
          {this.state.isCancel ? <Icon name={'times'} size={15} /> : null}
        </View>
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
    height: calendar_dayCell_width,
    borderColor: Colors.white,
    borderRightWidth: 2,
    borderLeftWidth: 2,
    borderBottomWidth: 4,
  },
  scheduleReserveCell: {
    width: calendar_dayCell_width - 4,
    height: calendar_dayCell_width - 4,
    margin: 2,
    padding: 8,
    backgroundColor: Colors.light_yellow,
    justifyContent: 'center',
    elevation: 2,
  },
  hourCell: {
    height: calendar_dayCell_width,
    backgroundColor: Colors.very_light_grey,
    justifyContent: 'center',
    borderColor: Colors.white,
    borderRightWidth: 2,
    borderLeftWidth: 2,
    borderBottomWidth: 4,
  },
});
