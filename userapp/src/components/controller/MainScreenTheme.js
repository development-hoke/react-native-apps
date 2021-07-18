import React, {Component} from 'react';
import {View, Text, ScrollView, SafeAreaView} from 'react-native';
import Colors from '../../constants/Colors';
import {
  NAVIGATION_HEADER_HEIGHT,
  BOTTOMBAR_HEIGHT,
} from '../../constants/AppConstants';
import NavigationHeader from '../NavigationHeader';

export default class MainScreenTheme extends Component {
  render() {
    return (
      <SafeAreaView style={{flex: 1, height: '100%'}}>
        <NavigationHeader
          this={this.props.this}
          backButton={this.props.backButton}
          menuButton={this.props.menuButton}
          closeButton={this.props.closeButton}
          headerImage={this.props.headerImage}
          title={this.props.title}
        />
        {this.props.noScrollView ? (
          <View
            style={{
              flex: 1,
              // marginTop: NAVIGATION_HEADER_HEIGHT,
              paddingHorizontal: this.props.noPaddingHoriz ? 0 : 15,
              backgroundColor: this.props.backColor,
            }}>
            {this.props.children}
          </View>
        ) : (
          <ScrollView
            // scrollEnabled={false}
            showsVerticalScrollIndicator={false}
            style={{
              paddingHorizontal: this.props.noPaddingHoriz ? 0 : 15,
              // paddingVertical: 10,
              // marginTop: NAVIGATION_HEADER_HEIGHT,
              backgroundColor: this.props.backColor,
            }}>
            {this.props.children}
          </ScrollView>
        )}
      </SafeAreaView>
    );
  }
}
