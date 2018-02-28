import React from 'react';

import {StyleSheet, TabBarIOS, Text, View} from 'react-native';
import {Setup} from './components/Setup';
import {Translated} from './components/Translated';

const defaultRowContent = {
    bookIndex: null,
    chapter: null,
    fromVerse: null,
    toVerse: null
};

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedTab: 'setup',
            translatedContentsEngToThai: [],
            translatedContentsThaiToEng: [],
            setupContentsEngToThai: [defaultRowContent],
            setupContentsThaiToEng: [defaultRowContent],
        };
    }

    handleTranslateEngToThai(setupData, translatedData) {
        console.log('handleTranslateEngToThai,' + JSON.stringify(setupData) + '||' + JSON.stringify(translatedData));
        this.setState({
            setupContestsEngToThai: setupData,
            translatedContentsEngToThai: translatedData
        })
    }

    handleTranslateThaiToEng(setupData, translatedData) {
        this.setState({
            setupContentsThaiToEng: setupData,
            translatedContentsThaiToEng: translatedData
        })

    }

    render() {
        return (
            <View style={styles.container}>
                <TabBarIOS selectedTab={this.state.selectedTab}>
                    <TabBarIOS.Item
                        selected={this.state.selectedTab === 'setup'}
                        systemIcon="featured"
                        onPress={() => {
                            this.setState({
                                selectedTab: 'setup',
                            });
                        }}>
                        <Setup
                            translateEngToThaiAction={(setupData, translatedData) => this.handleTranslateEngToThai(setupData, translatedData)}
                            setupContentsEngToThai={this.state.setupContentsEngToThai}
                            translateThaiToEngAction={(setupData, translatedData) => this.handleTranslateThaiToEng(setupData, translatedData)}
                            setupContentsThaiToEng={this.state.setupContentsThaiToEng}/>
                    </TabBarIOS.Item>
                    <TabBarIOS.Item
                        selected={this.state.selectedTab === 'translated'}
                        systemIcon="contacts"
                        onPress={() => {
                            this.setState({
                                selectedTab: 'translated',
                            });
                        }}>
                        <Translated engToThaiContents={this.state.translatedContentsEngToThai}
                                    thaiToEngContents={this.state.translatedContentsThaiToEng}/>
                    </TabBarIOS.Item>
                </TabBarIOS>
            </View>
        )
            ;
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
    },
    toolbar: {
        backgroundColor: '#81c04d',
        paddingTop: 30,
        paddingBottom: 10,
        flexDirection: 'row'    //Step 1
    },
    toolbarButton: {
        width: 50,            //Step 2
        color: '#fff',
        textAlign: 'center'
    },
    toolbarTitle: {
        color: '#fff',
        textAlign: 'center',
        fontWeight: 'bold',
        flex: 1                //Step 3
    }
});
