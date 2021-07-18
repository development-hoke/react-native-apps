import React, {Component} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  TouchableHighlight,
  Modal,
  Image,
  FlatList,
} from 'react-native';
import MainLayout from '../../components/container/MainLayout';
import ButtonEx from '../../components/button/ButtonEx';
import MyStyles from '../../constants/MyStyles';
import {alertNetworkError, Net, requestGet, requestPost} from '../../utils/ApiUtils';

export default class AtecManagerScreen extends Component {
  state = {
    data: [],
    selected: {
      id: 1,
      date: null,
      kind: '',
      title: '',
      content: '',
      image: '',
      image_path: '',
    },
    modalVisible: false,
  };

  componentDidMount() {
    requestGet(Net.atec.get)
      .then(json => {
        console.log(json);
        this.setState({data: json.data});
      })
      .catch(err => {
        alertNetworkError(err);
      });
  }

  toggleModal(visible, id) {
    this.setState({modalVisible: visible});
  }

  formatContent(text) {
    var index = text.indexOf("\n");
    if (index === -1) index = undefined;
    return text.substring(0, index) + (index > 0 ? '...' : '');
  }

  _renderItem = data => {
    return (
      <TouchableHighlight
        onPress={() => {
          this.setState({selected: data.item, modalVisible: true});
        }}>
        <View style={{flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#ddd'}}>
          <Text style={{flex: 2, padding: 5,  textAlign: 'center' }}>
            {data.item.kind}
          </Text>
          <Text style={{flex: 4, padding: 5, textAlign: 'center' }}>
            {data.item.title}
          </Text>
          <Text style={{flex: 5, padding: 5 }}>{this.formatContent(data.item.content)}</Text>
        </View>
      </TouchableHighlight>
    );
  };

  confirmAtec() {
    requestPost(Net.atec.confirm, {
      atec_id: this.state.selected.id,
    })
      .then(json => {
        this.setState({data: json.data});
      })
      .catch(err => {
        alertNetworkError(err);
      });
    this.toggleModal(false);
  }

  render() {
    return (
      <MainLayout
        title={'アーテック通信'}
        homeCallback={() => {
          this.props.navigation.navigate('Main');
        }}>
        <Modal transparent={true} visible={this.state.modalVisible}>
          <View style={{flex: 1, justifyContent: 'center'}}>
            <View style={{...MyStyles.Modal, height: 400}}>
              <View style={MyStyles.modalCloseView}>
                <ButtonEx
                  icon={'times'}
                  iconSize={15}
                  style={{borderWidth: 0}}
                  onPress={() => {
                    this.toggleModal(!this.state.modalVisible);
                  }}
                />
              </View>
              <View style={{flex: 2, flexDirection: 'row', marginLeft: 30, marginRight: 30}}>
                <View style={{flex: 2}}>
                  <Text style={MyStyles.transTableContent}>{this.state.selected.date}</Text>
                </View>
                <View style={{flex: 2}}>
                  <Text style={MyStyles.transTableContent}>{this.state.selected.kind}</Text>
                </View>
                <View style={{flex: 3}}>
                  <Text style={MyStyles.transTableContent}>{this.state.selected.title}</Text>
                </View>
                <View style={{flex: 3, alignItems: 'center'}}>
                  <Image
                    source={{uri: this.state.selected.image_path}}
                    style={{width: 100, height: 100, margin: 5, flex: 1}}
                    resizeMode={'contain'}
                  />
                </View>
              </View>
              <View style={{flex: 3, flexDirection: 'row', marginLeft: 30, marginRight: 30}}>
                <Text style={[MyStyles.transTableContent, {flex: 1, textAlign: 'left', padding: 10}]}>{this.state.selected.content}</Text>
              </View>
              <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', marginBottom: 10, marginTop: 20}}>
                <ButtonEx
                  onPress={() =>
                    this.confirmAtec()
                  }
                  type={'primary'}
                  text={'確認'}
                  textStyle={{
                    paddingLeft: 30,
                    paddingRight: 30,
                  }}
                />
              </View>
            </View>
          </View>
        </Modal>
        <View style={{...MyStyles.tableRow, paddingLeft: 15, paddingRight: 15}}>
          <Text style={[MyStyles.tableHeader, {flex: 2, padding: 5}]}>通信ジャンル</Text>
          <Text style={[MyStyles.tableHeader, {flex: 4, padding: 5}]}>お知らせタイトル</Text>
          <Text style={[MyStyles.tableHeader, {flex: 5, padding: 5}]}>お知らせ詳細</Text>
        </View>
        <FlatList
          data={this.state.data}
          renderItem={this._renderItem}
          style={{marginBottom: 15, flex: 1, paddingLeft: 15, paddingRight: 15}}
        />
      </MainLayout>
    );
  }
}
