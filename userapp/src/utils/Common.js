import Toast from 'react-native-root-toast';
import Colors from '../constants/Colors';

export default {
  displayJapaneseDate(strDate) {
    const strDayOfWeekList = ['月', '火', '水', '木', '金', '土', '日'];
    let reserveDate = new Date(strDate);
    const dateStringJapanese =
      reserveDate.getFullYear().toString() +
      '年' +
      (reserveDate.getMonth() + 1).toString() +
      '月' +
      (reserveDate.getDate() + 1).toString() +
      '日' +
      '(' +
      strDayOfWeekList[reserveDate.getDay()] +
      ')';
    return dateStringJapanese;
  },
  showToast(message) {
    Toast.show(message, {backgroundColor: Colors.grey});
  },
};
