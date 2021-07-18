import React, {Component} from 'react';
import Colors from '../../constants/Colors';
import {StyleSheet, Text, TextInput, View} from 'react-native';
import TextStyles from '../../constants/TextStyles';
import RNPickerSelect from 'react-native-picker-select';
import Icon from 'react-native-vector-icons/FontAwesome';
import LoginButton from '../../components/button/loginButton';
import MainScreenTheme from '../../components/controller/MainScreenTheme';
import MyStyles from '../../constants/MyStyles';
import Toast from 'react-native-root-toast';
import GlobalState from '../../mobx/GlobalState';
import {alertNetworkError, Net, requestPost} from '../../utils/APIUtils';
import Common from '../../utils/Common';
import {MessageText} from '../../constants/AppConstants';

export default class MarketReserveQuestion extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hopeMarket: this.props.navigation.state.params.shopID,
      shopList: [],
      contentOfQuery: '',
    };
  }
  componentDidMount() {
    // requestPost(Net.marketReserve.getShops)
    //   .then(json => {
    //     let shopList = [];
    //     if (json.shopList && json.shopList.length > 0) {
    //       json.shopList.map(item => {
    //         shopList.push({
    //           key: item.id.toString(),
    //           label: item.name,
    //           value: item.id,
    //         });
    //       });
    //       this.setState({
    //         shopList: shopList,
    //       });
    //     }
    //   })
    //   .catch(err => {
    //     alertNetworkError(err);
    //   });
  }

  render() {
    return (
      <MainScreenTheme
        // noScrollView={true}
        backButton={true}
        title={'お問い合わせ'}
        backColor={Colors.black}>
        {/*<Text*/}
        {/*  style={[*/}
        {/*    TextStyles.normalText,*/}
        {/*    TextStyles.whiteText,*/}
        {/*    TextStyles.bold,*/}
        {/*    {marginBottom: 5, marginLeft: 10},*/}
        {/*  ]}>*/}
        {/*  ご希望店舗*/}
        {/*</Text>*/}
        {/*<RNPickerSelect*/}
        {/*  placeholder={{*/}
        {/*    label: '希望店舗を選択',*/}
        {/*    value: '',*/}
        {/*    color: Colors.brownish_grey_60,*/}
        {/*  }}*/}
        {/*  style={{...pickerSelectStyles}}*/}
        {/*  value={this.state.hopeMarket}*/}
        {/*  useNativeAndroidPickerStyle={false}*/}
        {/*  Icon={() => {*/}
        {/*    return (*/}
        {/*      <View*/}
        {/*        style={[*/}
        {/*          MyStyles.pickerSelectIconStyles,*/}
        {/*          {alignItems: 'center', justifyContent: 'center'},*/}
        {/*        ]}>*/}
        {/*        <Icon name={'chevron-down'} size={30} color={Colors.white} />*/}
        {/*      </View>*/}
        {/*    );*/}
        {/*  }}*/}
        {/*  onValueChange={value => {*/}
        {/*    this.setState({hopeMarket: value});*/}
        {/*  }}*/}
        {/*  items={this.state.shopList}*/}
        {/*/>*/}
        <Text
          style={[
            TextStyles.normalText,
            TextStyles.whiteText,
            TextStyles.bold,
            {marginBottom: 5, marginLeft: 10, marginTop: 20},
          ]}>
          お問い合わせ内容
        </Text>
        <TextInput
          style={{
            backgroundColor: Colors.white,
            height: 300,
            textAlignVertical: 'top',
            paddingHorizontal: 15,
            marginBottom: 30,
          }}
          value={this.state.contentOfQuery}
          onChangeText={text => {
            this.setState({contentOfQuery: text});
          }}
          multiline={true}
          // placeholder="상대에 대해 보낼 메시지를 진심을 담아 작성해주세요."
          returnKeyType="done"
        />
        <LoginButton
          onPress={() => {
            if (
              this.state.hopeMarket === null ||
              this.state.hopeMarket === ''
            ) {
              Common.showToast(MessageText.SelectMarket);
              return;
            }
            if (
              this.state.contentOfQuery === null ||
              this.state.contentOfQuery === ''
            ) {
              Common.showToast(MessageText.InputQuestion);
              return;
            }
            this.props.navigation.navigate('MarketReserveQuestionConfirm', {
              passParam: {
                shopID: this.state.hopeMarket,
                contentOfQuery: this.state.contentOfQuery,
              },
            });
          }}
          buttonType={'orange'}
          textStyle={[
            {color: Colors.black},
            TextStyles.largeText,
            TextStyles.bold,
          ]}
          text={'確認'}
          style={{height: 80, marginBottom: 20}}
        />
      </MainScreenTheme>
    );
  }
}

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    backgroundColor: Colors.white,
    borderColor: '#767171',
    borderWidth: 2,
    fontSize: 14,
    height: 45,
    paddingHorizontal: 15,
  },
  inputAndroid: {
    backgroundColor: Colors.white,
    borderColor: '#767171',
    borderWidth: 2,
    fontSize: 14,
    height: 44,
    paddingHorizontal: 15,
  },
});
