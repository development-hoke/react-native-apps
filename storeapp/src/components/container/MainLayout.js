import React, {Component} from 'react';
import {View, Text, SafeAreaView, StyleSheet} from 'react-native';
import ButtonEx from '../../components/button/ButtonEx';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  header: {
    height: 50,
    flexDirection: 'row',
    marginBottom: 15,
    paddingLeft: 15,
    paddingRight: 15,
  },
  headerLeft: {flex: 1, alignItems: 'flex-start'},
  headerCenter: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerRight: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  titleText: {
    fontSize: 25,
    textAlign: 'center',
  },
});

export default class MainLayout extends Component {
  render() {
    return (
      <SafeAreaView style={{flex: 1, padding: 15, backgroundColor: 'white'}}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <ButtonEx
              onPress={() => {
                if (this.props.homeCallback) this.props.homeCallback();
              }}
              style={{borderWidth: 0}}
              textStyle={{fontSize: 10}}
              text={'TOP'}
              icon={'home'}
              iconSize={30}
              vertical={true}
            />
          </View>
          <View style={styles.headerCenter}>
            <Text style={styles.titleText}>{this.props.title}</Text>
            {this.props.middleHeader}
          </View>
          <View style={styles.headerRight}>{this.props.rightHeader}</View>
        </View>
        {this.props.children}
      </SafeAreaView>
    );
  }
}

MainLayout.propTypes = {
  title: PropTypes.string,
  rightHeader: PropTypes.object,
  middleHeader: PropTypes.object,
  homeCallback: PropTypes.func,
};
