import React from 'react';
import {Text, View, StyleSheet, FlatList, SegmentedControlIOS} from "react-native";
import {TranslatedItem} from "./TranslatedItem";

export class Translated extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedTab: 'ENG => THA'
        };
    }

    renderTranslatedItem(data) {
        let {item} = data;
        return (
            <TranslatedItem item={item}/>
        )
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
