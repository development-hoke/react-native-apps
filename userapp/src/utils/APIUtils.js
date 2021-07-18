import {API_BASE_URL, IS_DEV_MODE} from '../constants/AppConstants';
import GlobalState from '../mobx/GlobalState';
import {Alert} from 'react-native';

async function request(options) {
  let headers = {
    'Content-Type': 'application/json;charset=UTF-8',
    Accept: 'application/hal+json',
    'x-access-token': GlobalState.loginStatus.accessToken,
  };

  let defaults = {headers: headers};
  const params = Object.assign({}, defaults, options);
  IS_DEV_MODE ? console.log(params.url) : true;
  GlobalState.isLoading = true;
  let response = await fetch(params.url, params).catch(error => {
    GlobalState.isLoading = false;
    throw error;
  });
  GlobalState.isLoading = false;
  return response.json();
}

export function requestGet(url, param = null) {
  // eslint-disable-next-line no-undef
  let queryString = new URLSearchParams();
  if (param !== undefined && param != null) {
    for (let key in param) {
      queryString.append(key, param[key]);
    }
  }

  let options = {
    url: url + '?' + queryString.toString(),
    method: 'GET',
  };

  return request(options);
}

export function requestPost(url, param = null) {
  let options = {
    url: url,
    method: 'POST',
  };

  if (param !== undefined && param != null) {
    options.body = JSON.stringify(param);
  }

  return request(options);
}

export function alertNetworkError(err) {
  console.log(err);
  Alert.alert(
    'エラー',
    'ネットワーク間違いです. サーバーとの連結を確認してください.',
  );
}

export const Net = {
  error: {
    E_OK: 0,
    E_TOKEN: 1,
    E_LOGIN: 2,
    E_NO_MY_SHOP: 10,
    E_MEMBER_ALREADY_EXIST: 11,
    E_INTERNAL: 127,
  },
  restType: {
    ON_DUTY: 0,
    WHOLE_REST: 1,
    OUT_OF_DUTY: 2,
  },
  auth: {
    login: API_BASE_URL + '/client/login',
    createAccount: API_BASE_URL + '/client/createAccount',
    sendVerifyNumber: API_BASE_URL + '/client/sendVerifyNumber',
    confirmVerifyNumber: API_BASE_URL + '/client/confirmVerifyNumber',
    signup: API_BASE_URL + '/client/signup',
    getLicense: API_BASE_URL + '/client/getLicense',
    getFaq: API_BASE_URL + '/client/getFaq',
    getProvinceList: API_BASE_URL + '/client/getProvinceList',
    getCityListByProvince: API_BASE_URL + '/client/getCityListByProvince',
    getShopListByCity: API_BASE_URL + '/client/getShopListByCity',
    getMapCoordinate: API_BASE_URL + '/client/getMapCoordinate',
  },
  notice: {
    getNotice: API_BASE_URL + '/client/getNotice',
  },
  marketReserve: {
    getShops: API_BASE_URL + '/client/getShopList',
    searchShops: API_BASE_URL + '/client/searchShops',
    getShopImage: API_BASE_URL + '/client/getShopImage',
    sendQuestion: API_BASE_URL + '/client/sendQuestion',
    getQuestionList: API_BASE_URL + '/client/getQuestionList',
    getTimeList: API_BASE_URL + '/client/getTimeList',
    getReservedDataByShop: API_BASE_URL + '/client/getReservedDataByShop',
    reserveShop: API_BASE_URL + '/client/reserveShop',
    calcUnReadInquires: API_BASE_URL + '/client/calcUnReadInquires',
    setInquiryRead: API_BASE_URL + '/client/setInquiryRead',
  },
  marketSearch: {
    getShopByArea: API_BASE_URL + '/client/getShopByArea',
    getShopByProvince: API_BASE_URL + '/client/getShopByProvince',
    getMyShop: API_BASE_URL + '/client/getMyShop',
    registerMyShop: API_BASE_URL + '/client/registerMyShop',
  },
  myShop: {
    getSigongList: API_BASE_URL + '/client/getSigongList',
    getCouponList: API_BASE_URL + '/client/getCouponList',
    useCoupon: API_BASE_URL + '/client/useCoupon',
    expireCoupon: API_BASE_URL + '/client/expireCoupon',
    generateTransferCode: API_BASE_URL + '/client/generateTransferCode',
  },
  topic: {
    getTopicList: API_BASE_URL + '/client/getTopicList',
  }
};
