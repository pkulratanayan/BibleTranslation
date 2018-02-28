import React from 'react';
import {Button, FlatList, SegmentedControlIOS, StyleSheet, Text, View} from "react-native";
import {SetupItemEng} from "./SetupItemEng";
import {SetupItemThai} from "./SetupItemThai";
import bibleIndices from '../resources/BibleIndices.json';

const defaultRowContent = {
    bookIndex: null,
    chapter: null,
    fromVerse: null,
    toVerse: null
};

let BIBLE_VERSION = Object.freeze({AMERICAN_STANDARD: 'asv', THAI: 'thai'});

export class Setup extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedTab: 'ENG => THA',
            setupContentsEngToThai: this.props.setupContentsEngToThai,
            setupContentsThaiToEng: this.props.setupContentsThaiToEng,
            translatedContents: []
        };
    }

    addSetupRow() {
        if (this.state.selectedTab === 'ENG => THA') {
            let currentSetupContents = this.state.setupContentsEngToThai;
            currentSetupContents.push(defaultRowContent);
            this.setState({
                setupContentsEngToThai: currentSetupContents
            });
        }
        else {
            let currentSetupContents = this.state.setupContentsThaiToEng;
            currentSetupContents.push(defaultRowContent);
            this.setState({
                setupContentsThaiToEng: currentSetupContents
            });

        }
    }

    getBibleUrl(lookupName, chapter, fromVerse, toVerse, version) {
        let url = 'http://getbible.net/json?passage='
            + lookupName
            + chapter
            + ':' + fromVerse + '-' + toVerse + '&version=' + version;
        console.log('url:' + url);
        return url;
    }

    async handleTranslate() {
        if (this.state.selectedTab === 'ENG => THA') {
            let wholeContentArray = [];
            await Promise.all(this.state.setupContentsEngToThai.map(async function (setupItem) {
                let lookupName = bibleIndices[setupItem.bookIndex].lookupName;
                let url = this.getBibleUrl(lookupName,
                    setupItem.chapter,
                    setupItem.fromVerse,
                    setupItem.toVerse,
                    BIBLE_VERSION.THAI);
                let response = await fetch(url);
                let bodyInit = response._bodyInit;
                bodyInit = bodyInit.substring(1);
                bodyInit = bodyInit.substring(0, bodyInit.length - 2);
                let responseObject = JSON.parse(bodyInit);
                let bibleIndex = bibleIndices[setupItem.bookIndex];
                let englishName = bibleIndex.englishName;
                let thaiName = bibleIndex.thaiName;
                let wholeContent = 'book(eng/thai):' + englishName + '/' + thaiName + ', chapter:' + setupItem.chapter + '\n';
                for (let i = setupItem.fromVerse; i <= setupItem.toVerse; i++) {
                    wholeContent += 'verse:' + i + responseObject.book[0].chapter[i]['verse'];
                }
                wholeContentArray.push(wholeContent);
            }, this));
            this.setState({
                translatedContents: wholeContentArray
            });
            this.props.translateEngToThaiAction(this.state.setupContentsEngToThai, wholeContentArray);
        }
        else {
            let wholeContentArray = [];
            await Promise.all(this.state.setupContentsThaiToEng.map(async function (setupItem) {
                let lookupName = bibleIndices[setupItem.bookIndex].lookupName;
                let url = this.getBibleUrl(lookupName,
                    setupItem.chapter,
                    setupItem.fromVerse,
                    setupItem.toVerse,
                    BIBLE_VERSION.AMERICAN_STANDARD);
                let response = await fetch(url);
                let bodyInit = response._bodyInit;
                bodyInit = bodyInit.substring(1);
                bodyInit = bodyInit.substring(0, bodyInit.length - 2);
                let responseObject = JSON.parse(bodyInit);
                let bibleIndex = bibleIndices[setupItem.bookIndex];
                let englishName = bibleIndex.englishName;
                let thaiName = bibleIndex.thaiName;
                let wholeContent = 'book(eng/thai):' + englishName + '/' + thaiName + ', chapter:' + setupItem.chapter + '\n';
                for (let i = setupItem.fromVerse; i <= setupItem.toVerse; i++) {
                    wholeContent += 'verse:' + i + responseObject.book[0].chapter[i]['verse'];
                }
                wholeContentArray.push(wholeContent);
            }, this));
            this.setState({
                translatedContents: wholeContentArray
            });
            this.props.translateThaiToEngAction(this.state.setupContentsThaiToEng, wholeContentArray);
        }
    }

    handleChildUpdateEngToThai(index, setupItem) {
        let currentSetupContents = this.state.setupContentsEngToThai;
        currentSetupContents[index] = setupItem;
        this.setState({
            setupContentsEngToThai: currentSetupContents
        });
    }

    handleChildUpdateThaiToEng(index, setupItem) {
        let currentSetupContents = this.state.setupContentsThaiToEng;
        currentSetupContents[index] = setupItem;
        this.setState({
            setupContentsThaiToEng: currentSetupContents
        });
    }

    handleChildDeleteEngToThai(index)
    {
        let currentSetupContents = this.state.setupContentsEngToThai;
        currentSetupContents.splice(index, 1);
        this.setState({
            setupContentsEngToThai: currentSetupContents
        });
    }

    handleChildDeleteThaiToEng(index)
    {
        let currentSetupContents = this.state.setupContentsThaiToEng;
        currentSetupContents.splice(index, 1);
        this.setState({
            setupContentsThaiToEng: currentSetupContents
        });
    }

    renderItemEngToThai(data) {
        let {item, index} = data;
        console.log('renderItemEngToThai : item:' + JSON.stringify(item) + ',index:' + index);
        return (
            <SetupItemEng item={item} index={index}
                          removeListItemAction={(index) => this.handleChildDeleteEngToThai(index)}
                          action={(index, setupItem) => this.handleChildUpdateEngToThai(index, setupItem)}/>
        )
    };

    renderItemThaiToEng(data) {
        let {item, index} = data;
        // console.log('renderItemThaiToEng : item:' + JSON.stringify(item) + ',index:' + index);
        return (
            <SetupItemThai item={item} index={index}
                           removeListItemAction={(index) => this.handleChildDeleteThaiToEng(index)}
                           action={(index, setupItem) => this.handleChildUpdateThaiToEng(index, setupItem)}/>
        )
    };

    renderSetupList() {
        if (this.state.selectedTab === 'ENG => THA') {
            console.log('RenderSetupList(Eng=>Thai):this.state.setupContentsEngToThai' + JSON.stringify(this.state.setupContentsEngToThai));
            return (
                <FlatList
                    data={this.state.setupContentsEngToThai}
                    extraData={this.state}
                    renderItem={(data) => this.renderItemEngToThai(data)}
                />
            );
        }
        else {
            console.log('RenderSetupList(Thai=>Eng):this.state.setupContentsThaiToEng' + JSON.stringify(this.state.setupContentsThaiToEng));
            return (
                <FlatList
                    data={this.state.setupContentsThaiToEng}
                    extraData={this.state}
                    renderItem={(data) => this.renderItemThaiToEng(data)}
                />
            );
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.toolbar}>
                    <Button title="ADD" style={styles.toolbarButton} onPress={() => this.addSetupRow()}/>
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
                    <Button title="TRA" style={styles.toolbarButton} onPress={() => this.handleTranslate()}/>
                </View>
                {this.renderSetupList()}
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
