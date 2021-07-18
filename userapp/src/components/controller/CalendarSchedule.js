import React, {Component} from 'react';
import {ScrollView, View} from 'react-native';
import Colors from '../../constants/Colors';
import {CalendarHeaderOfWeek, CalendarScheduleBody} from './CalendarElement';
import {SCREEN_WIDTH, DayOfWeekNameList} from '../../constants/AppConstants';
import {LOAD_CALENDAR_TYPE} from '../../constants/AppConstants';
import {observer} from 'mobx-react';

const moment = require('moment');
import 'moment/min/locales';
import {alertNetworkError, Net, requestPost} from '../../utils/APIUtils';
import GlobalState from '../../mobx/GlobalState';

@observer
class CalendarSchedule extends Component {
  constructor(props) {
    super(props);
    this.state = {
      calendarDayList: [],
      scheduleData: [],
      scheduleBody: null,
    };
  }
  componentDidMount(): void {
    this.initCalendar(LOAD_CALENDAR_TYPE.ONLY_DATE);
  }
  componentWillUnmount(): void {
    GlobalState.canReserve = true;
  }
  clearScheduleData = () => {
    this.setState({scheduleData: []}, () => {
      this.setState({scheduleBody: this.renderScheduleBody()});
    });
  };
  renderScheduleBody = () => {
    return (
      <View>
        {this.state.scheduleData.length > 0 ? (
          <View style={{flexDirection: 'row'}}>
            {this.state.scheduleData.map((item, index) => (
              <CalendarScheduleBody
                key={
                  'body' +
                  GlobalState.selectedShopID.toString() +
                  index.toString()
                }
                scheduleDataOfWeek={item}
                getReservedData={reservedData => {
                  this.props.getInfo(reservedData);
                }}
              />
            ))}
          </View>
        ) : null}
      </View>
    );
  };
  initCalendar = loadType => {
    const dayInterval = 24 * 60 * 60 * 1000;
    let iteratorDay = new Date();
    let calendarDayList = [];
    let scheduleData = [];
    let scheduleWeekData = [];
    let in_week_cnt = 1;
    let weekData = [];
    for (let i = 0; i < 30; i++) {
      if (in_week_cnt > 7) {
        in_week_cnt = 1;
        if (loadType === LOAD_CALENDAR_TYPE.ONLY_DATE) {
          calendarDayList.push(weekData);
          weekData = [];
        } else if (loadType === LOAD_CALENDAR_TYPE.ONLY_SCHEDULE_DATA) {
          scheduleData.push(scheduleWeekData);
          scheduleWeekData = [];
        }
      }
      if (loadType === LOAD_CALENDAR_TYPE.ONLY_DATE) {
        weekData.push({
          year: iteratorDay.getFullYear(),
          month: iteratorDay.getMonth() + 1,
          day: iteratorDay.getDate(),
          dayOfWeek: DayOfWeekNameList[iteratorDay.getDay()],
          dayOfWeekNum: iteratorDay.getDay(),
        });
      }
      if (loadType === LOAD_CALENDAR_TYPE.ONLY_SCHEDULE_DATA) {
        let daySchedule = [];
        let isRestDay = false;
        let restTime = [];
        if (GlobalState.restDateList.length > 0) {
          GlobalState.restDateList.forEach((value, index) => {
            if (!isRestDay) {
              if (
                moment(iteratorDay).format('YYYY-MM-DD') === value.f_rest_date
              ) {
                if (value.f_rest_time === 0) {
                  isRestDay = true;
                  return;
                } else {
                  restTime.push(value.f_rest_time);
                }
              }
            }
          });
        }
        if (!isRestDay) {
          for (let j = 0; j < GlobalState.hoursList.length; j++) {
            if (
              (iteratorDay.getDay() !== 6 &&
                iteratorDay.getDay() !== 0 &&
                j < 2) ||
              restTime.indexOf(GlobalState.hoursList[j].f_id) >= 0
            ) {
              daySchedule.push({
                type: 'none',
                date: moment(iteratorDay).format('YYYY/MM/DD'),
                time: GlobalState.hoursList[j].f_id,
              });
            } else {
              const strDate = moment(iteratorDay).format('YYYY-MM-DD');
              let _length = GlobalState.reservedData.length;
              let _firstElement = null;
              let _lastElement = null;
              if (_length > 0) {
                _firstElement = GlobalState.reservedData[0];
                _lastElement = GlobalState.reservedData[_length - 1];
              }
              if (
                _length === 0 ||
                strDate < _firstElement.f_reserve_date ||
                strDate > _lastElement.f_reserve_date
              ) {
                daySchedule.push({
                  type: 'OK',
                  date: moment(iteratorDay).format('YYYY/MM/DD'),
                  time: GlobalState.hoursList[j].f_id,
                });
              } else {
                let _popIndex = null;
                GlobalState.reservedData.forEach((value, index) => {
                  if (
                    value.f_reserve_time.toString() ===
                      GlobalState.hoursList[j].f_id.toString() &&
                    value.f_reserve_date === strDate
                  ) {
                    daySchedule.push({
                      type: 'cancel',
                      date: moment(iteratorDay).format('YYYY/MM/DD'),
                      time: GlobalState.hoursList[j].f_id,
                    });
                    _popIndex = index;
                  }
                });
                if (_popIndex === null) {
                  daySchedule.push({
                    type: 'OK',
                    date: moment(iteratorDay).format('YYYY/MM/DD'),
                    time: GlobalState.hoursList[j].f_id,
                  });
                } else {
                  GlobalState.reservedData.splice(_popIndex, 1);
                }
              }
            }
          }
        }
        scheduleWeekData.push(daySchedule);
      }
      in_week_cnt += 1;
      iteratorDay = iteratorDay.getTime();
      iteratorDay = new Date(iteratorDay + dayInterval);
    }
    if (loadType === LOAD_CALENDAR_TYPE.ONLY_DATE) {
      calendarDayList.push(weekData);
      this.setState({
        calendarDayList: calendarDayList,
      });
    } else if (loadType === LOAD_CALENDAR_TYPE.ONLY_SCHEDULE_DATA) {
      scheduleData.push(scheduleWeekData);
      this.setState(
        {
          scheduleData: scheduleData,
        },
        () => {
          this.setState({scheduleBody: this.renderScheduleBody()});
        },
      );
    }
  };

  render() {
    return (
      <View style={[{minHeight: 200}, this.props.style]}>
        <ScrollView
          showsHorizontalScrollIndicator={false}
          horizontal={true}
          pagingEnabled={true}
          style={{backgroundColor: Colors.very_light_grey}}>
          <View>
            <View style={{flexDirection: 'row'}}>
              {this.state.calendarDayList.map(item => (
                <CalendarHeaderOfWeek weekData={item} />
              ))}
            </View>
            <ScrollView>{this.state.scheduleBody}</ScrollView>
          </View>
        </ScrollView>
      </View>
    );
  }
}

export default CalendarSchedule;
