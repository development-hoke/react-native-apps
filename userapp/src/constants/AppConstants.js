/* eslint-disable */
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { Dimensions } from 'react-native';

export const IS_DEV_MODE = true;
export const EXTERNAL_URL = 'http://3.15.186.172/';
export const API_BASE_URL = 'http://3.15.186.172/api';

export const SCREEN_HEIGHT = Dimensions.get("screen").height;
export const SCREEN_WIDTH = Dimensions.get("screen").width;
export const NAVIGATION_HEADER_HEIGHT = 80; // 상단 headerbar의 height
export const BOTTOMBAR_HEIGHT = 75; // 하단 tabbar의 height
export const LOGO_HEIGHT = 150; // 상단에 놓이는 LOGO 그림의 높이
export const STATUSBAR_HEIGHT = getStatusBarHeight();

export const MAP_ACTUAL_WIDTH = 816;
export const MAP_ACTUAL_HEIGHT = 756;

export const ASYNC_PARAMS = {
  IS_SECOND: "@vaccine:is_second",
  IS_LOGIN: "@vaccine:is_login",
  MY_INFO: '@vaccine:my_info',
  MY_SHOP_ID: '@vaccine:my_shop_id',
  ACCESS_TOKEN: '@vaccine:access_token',
};

export const calendar_leftTopCell_width = 100;
export const calendar_dayCell_width =
  (SCREEN_WIDTH - 30 - calendar_leftTopCell_width) / 7;
export const LOAD_CALENDAR_TYPE = {
  ONLY_DATE: 1,
  ONLY_SCHEDULE_DATA: 2,
  BOTH: 3,
};
export const DayOfWeekNameList = ['日', '月', '火', '水', '木', '金', '土'];

export const MessageText = {
  ExitApp: 'Press back button again to exit app.',
  DuplicateAccount_Title: 'アカウント重複',
  DuplicateAccount_Content: '同じ情報を持つアカウントがすでに存在します。',
  MarketSearchMap_NoMarket: '該当postalコードを持つ店舗が存在しません。',
  MyShopRegister_Success: 'マイショップ登録が成功しました。',
  MyShopRegister_Title: 'マイショップ登録',
  MyShopRegister_Content: '登録されたマイショップが存在します。 マイショップを変更しますか？',
  DialogButton_OK: '確認',
  DialogButton_Cancel: 'キャンセル',
  WarningDialog_Title: '警告',
  ErrorDialog_Title: 'エラー',
  VerifyNumberInput: '認証コードを入力してください',
  PhoneNumberInput: '電話番号を入力してください。',
  VerifyNumber_NoMatch: '認証コードが正しくありません。',
  NoMemberHasPhoneExist: 'この電話番号を持つ会員が存在しません。 電話番号をもう一度確認してください。',
  EmailAddressInput: 'メールアドレスを入力してください。',
  PasswordInput: 'パスワードを入力してください。',
  LoginNoAccount: '該当するアカウントが存在しません。 アカウント情報をもう一度確認してください。',
  AgreeLicense: '利用規約に同意してください。',
  SelectMarket: 'ご希望の店舗をお選びください。',
  InputQuestion: 'お問い合わせ内容を入力してください。',
  SelectReserveDate: '訪問日を選択してください。',
  SelectVisitPurpose: '予約用件を選択してください。',
  SelectDateGuide: '一度に一つの予約のみ可能です。 予約を変更したい場合は、すでに予約した部分をもう一度押して予約をキャンセルしてください。'
};
