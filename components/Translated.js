import React from 'react';
import {View, StyleSheet, FlatList, SegmentedControlIOS, Button} from "react-native";
import {TranslatedItem} from "./TranslatedItem";
import {email} from "react-native-communications";
import _ from 'lodash'


export class Translated extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedTab: 'ENG => THA'
        };
    }

    renderTranslatedItem(data) {
        let {item, index} = data;
        let colors = ['#e0e0e0', '#a0a0a0'];
        console.log('index:' + index);
        let style = [
            styles.row,
            {'backgroundColor': colors[index % colors.length]}
        ];
        return (
            <View style={style}>
                <TranslatedItem item={item}/>
            </View>
        )
    }

    convertListToEmail(contents) {
        let transformed = _.chain(contents)
            .map(item => '<p>' + item + '</p>')
            .value();
        let final =  transformed.join('\n');
        console.log(final);
        return final;
    }

    renderTranslatedList() {
        if (this.state.selectedTab === 'ENG => THA') {
            // console.log('translated: render Eng to Thai');
            return (
                <FlatList
                    data={this.props.engToThaiContents}
                    extraData={this.state}
                    renderItem={(data) => this.renderTranslatedItem(data)}
                />
            );
        }
        else {
            // console.log('translated: render Thai to Eng:' + JSON.stringify(this.props.thaiToEngContents));
            return (
                <FlatList
                    data={this.props.thaiToEngContents}
                    extraData={this.state}
                    renderItem={(data) => this.renderTranslatedItem(data)}
                />
            );
        }
    }

    sendEmail() {
        email(null,
            null,
            null,
            this.state.selectedTab === 'ENG => THA' ? 'For Eng service' : 'For Thai service',
            this.state.selectedTab === 'ENG => THA' ? this.convertListToEmail(this.props.engToThaiContents) : this.convertListToEmail(this.props.thaiToEngContents));
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.toolbar}>
                    <SegmentedControlIOS
                        style={styles.toolbarTitle}
                        values={['ENG => THA', 'THA => ENG']}
                        selectedIndex={0}
                        onValueChange={(val) => {
                            this.setState({
                                selectedTab: val
                            })
                        }}
                    />
                </View>
                <Button title="EMAIL" style={styles.toolbarButton} onPress={() => this.sendEmail()}/>
                {this.renderTranslatedList()}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        // alignItems: 'center',
        justifyContent: 'center',
    },
    toolbar: {
        paddingTop: 30,
        paddingBottom: 10,
        flexDirection: 'row'
    },
    toolbarButton: {
        width: 50,
        color: '#fff',
    },
    toolbarTitle: {
        flex: 1
    }
});
