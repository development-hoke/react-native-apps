import React, {Component} from 'react';
import Ripple from 'react-native-material-ripple';
import Colors from '../../constants/Colors';
import {Text, Animated, LayoutAnimation} from 'react-native';
import TextStyles from '../../constants/TextStyles';
import {Image} from 'react-native';
import {View} from 'react-native';
import SigongCard from './SigongCard';
import TabItem from '../button/TabItem';
import Icon from 'react-native-vector-icons/FontAwesome';
import {withNavigation} from 'react-navigation';

class Accordion extends Component {
  constructor(props) {
    super(props);
    this.state = {
      historyListStyle: {display: 'none'},
      isExpand: false,
    };
  }
  doAccordion = () => {
    this.state.isExpand ? this.collapseAccordion() : this.expandAccordion();
  }
  expandAccordion = () => {
    // LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
    this.setState({
      historyListStyle: {
        display: 'flex',
      },
      isExpand: true,
    });
  };
  collapseAccordion = () => {
    // LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
    this.setState({
      historyListStyle: {
        display: 'none',
      },
      isExpand: false,
    });
  };
  render() {
    const sigongList = () => {
      return this.props.sigongList.map((sigong, index) => (
        <SigongCard
          fullData={sigong}
          key={sigong.id.toString()}
          style={{marginBottom: 5}}
          image={sigong.image_path}
          productName={sigong.goods}
          date={sigong.date}
        />
      ));
    };
    return (
      <View style={[{marginHorizontal: 5}, this.props.style]}>
        <Ripple
          onPress={this.doAccordion}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: Colors.grey,
            height: 60,
            paddingHorizontal: 20,
            marginBottom: 5,
            // marginTop: 30,
          }}>
          <Text
            style={[TextStyles.buttonLabel, TextStyles.whiteText, {flex: 10}]}>
            {this.props.headerTitle}
          </Text>
          <Icon
            name={this.state.isExpand ? 'minus' : 'chevron-down'}
            color={Colors.white}
            size={30}
          />
        </Ripple>
        <View style={this.state.historyListStyle}>
          {this.props.sigongList ? sigongList() : null}
          {this.props.children}
        </View>
      </View>
    );
  }
}
export default withNavigation(Accordion);
