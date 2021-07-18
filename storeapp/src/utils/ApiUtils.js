import {API_BASE_URL, IS_DEV_MODE} from '../constants/AppConstants';
import GlobalState from '../mobx/GlobalState';
import {Alert, Platform} from 'react-native';
import Toast from 'react-native-root-toast';
import Colors from '../constants/Colors';

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

export async function requestUpload(url, options, file_uri) {
  let file = {
    fileName: file_uri.replace(/^.*[\\\/]/, ''),
    type: 'image/jpeg',
    uri: file_uri,
  };

  let formData = new FormData();
  for (let key in options) formData.append(key, options[key]);
  formData.append('_file', {
    name: file.fileName,
    type: file.type,
    uri: Platform.OS === 'ios' ? file.uri.replace('file://', '') : file.uri,
  });

  let params = {
    url: url,
    method: 'POST',
    body: formData,
  };

  let headers = {
    'Content-Type': 'multipart/form-data',
    'x-access-token': GlobalState.loginStatus.accessToken,
    Accept: 'application/json',
  };

  let defaults = {headers: headers};
  params = Object.assign({}, defaults, params);
  GlobalState.isLoading = true;
  let response = await fetch(params.url, params).catch(error => {
    GlobalState.isLoading = false;
    throw error;
  });
  GlobalState.isLoading = false;
  return await response.json();
}

export function alertNetworkError(err) {
  console.log(err);
  Alert.alert(
    'エラー',
    'ネットワーク間違いです. サーバーとの連結を確認してください.',
  );
}

export function booleanToInt(value) {
  return value ? 1 : 0;
}

export function validateEmail(value) {
  let regex = /^(\w|')+([\.-]?(\w|')+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return regex.test(value);
}

export function showToast(message) {
  Toast.show(message, {backgroundColor: Colors.grey});
}

export const Net = {
  error: {
    E_OK: 0,
    E_TOKEN: 1,
    E_LOGIN: 2,
    E_NO_MEMBER: 3,
    E_TOO_MANY_MEMBER: 4,
    E_SHOP_DEVICE_ALREADY_EXIST: 12,
    E_MANAGER_DISABLED: 13,
    E_INTERNAL: 127,
  },
  auth: {
    login: API_BASE_URL + '/store/login',
    signup: API_BASE_URL + '/store/signup',
    auto_login: API_BASE_URL + '/store/auto_login',
    register: API_BASE_URL + '/store/register',
    register_device: API_BASE_URL + '/store/register_device',
    getMapCoordinate: API_BASE_URL + '/client/getMapCoordinate',
    getProvinceList: API_BASE_URL + '/client/getProvinceList',
    getCityListByProvince: API_BASE_URL + '/client/getCityListByProvince',
    getShopListByCity: API_BASE_URL + '/client/getShopListByCity',
    getAddress: API_BASE_URL + '/store/get_address',
  },
  store: {
    list: API_BASE_URL + '/store/get_stores',
    getImages: API_BASE_URL + '/store/get_shop_images',
    change_time: API_BASE_URL + '/store/change_shop_time',
    image_update: API_BASE_URL + '/store/update_shop_image',
    image_delete: API_BASE_URL + '/store/delete_shop_image',
  },
  tossup: {
    add: API_BASE_URL + '/store/add_tossup',
    get: API_BASE_URL + '/store/get_tossup',
  },
  inquiry: {
    get: API_BASE_URL + '/store/get_inquiry',
    reply: API_BASE_URL + '/store/reply_inquiry',
  },
  atec: {
    get: API_BASE_URL + '/store/get_atec',
    confirm: API_BASE_URL + '/store/confirm_atec',
  },
  member: {
    search: API_BASE_URL + '/store/search_member',
    get: API_BASE_URL + '/store/get_member',
    register: API_BASE_URL + '/store/register_member',
  },
  coupon: {
    add: API_BASE_URL + '/store/add_coupon',
    get: API_BASE_URL + '/store/get_coupon',
    change_date: API_BASE_URL + '/store/change_date_coupon',
  },
  last_coupon: {
    get: API_BASE_URL + '/store/get_last_coupon',
  },
  notice: {
    add: API_BASE_URL + '/store/add_notice',
    get: API_BASE_URL + '/store/get_notice',
    delete: API_BASE_URL + '/store/delete_notice',
  },
  bottle: {
    get: API_BASE_URL + '/store/get_bottle',
    get_use: API_BASE_URL + '/store/get_bottle_use',
    input: API_BASE_URL + '/store/bottle_input',
    delete: API_BASE_URL + '/store/bottle_delete',
  },
  carrying_register: {
    index: API_BASE_URL + '/store/index_carrying',
    confirm: API_BASE_URL + '/store/carrying_confirm',
    history_image: API_BASE_URL + '/store/history_image',
  },
  calculation_add: {
    get: API_BASE_URL + '/store/get_goods',
  },
  carrying_history: {
    get: API_BASE_URL + '/store/get_carryings',
    image_get: API_BASE_URL + '/store/get_carrying_image_history',
    sub_name: API_BASE_URL + '/store/get_carryings_subgoodsname',
  },
  marketReserve: {
    getReservedDataByShop: API_BASE_URL + '/store/getReservedDataByShop',
  },
  restDate: {
    register: API_BASE_URL + '/store/restDate_register',
    register_time: API_BASE_URL + '/store/restDate_register_time',
    reserve_confirm: API_BASE_URL + '/store/reserve_confirm',
    register_docomo: API_BASE_URL + '/store/restDate_docomo_register',
  },
  calculation: {
    save: API_BASE_URL + '/store/calcualtion_save',
    get: API_BASE_URL + '/store/calcualtion_get',
    get_goods: API_BASE_URL + '/store/calcualtion_get_goods',
  },
  main: {
    get: API_BASE_URL + '/store/get_new_counts',
  },
  manual: {
    get: API_BASE_URL + '/store/get_manuals',
    tool: API_BASE_URL + '/store/get_tools',
  },
};
