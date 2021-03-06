import React from 'react';
import {StyleSheet, Text, View} from "react-native";
import ModalDropdown from 'react-native-modal-dropdown';
import _ from 'lodash';
import bibleIndices from '../resources/BibleIndices.json';
import Swipeout from 'react-native-swipeout';


export class SetupItemEng extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            books: bibleIndices.map(bibleIndex => bibleIndex.englishName),
            selectedItem : {bookIndex:null, chapter:null, fromVerse:null, toVerse:null},
            chapters: [],
            fromVerses: [],
            toVerses: []
        };
    }

    _onBookSelect(index, value) {
        let numberOfChapters = bibleIndices[index].chapters.length;
        let chapters = _.range(1, numberOfChapters + 1);
        let currentSelectedItem = this.state.selectedItem;
        currentSelectedItem.bookIndex = index;
        this.setState({
            chapters: chapters,
            selectedItem: currentSelectedItem
        });
        this.props.action(this.props.index, currentSelectedItem);
    }

    _onChapterSelect(index, value) {
        let numberOfVerses = bibleIndices[this.state.selectedItem.bookIndex].chapters[index];
        let verses = _.range(1, numberOfVerses + 1);
        let currentSelectedItem = this.state.selectedItem;
        currentSelectedItem.chapter = value;
        this.setState({
            selectedItem : currentSelectedItem,
            fromVerses: verses,
            toVerses: verses
        });
        this.props.action(this.props.index, currentSelectedItem);
    }

    _onFromVerseSelect(index, value) {
        let currentSelectedItem = this.state.selectedItem;
        currentSelectedItem.fromVerse = value;
        this.setState({
            selectedItem : currentSelectedItem,
        });
        this.props.action(this.props.index, currentSelectedItem);
    }

    _onToVerseSelect(index, value) {
        let currentSelectedItem = this.state.selectedItem;
        currentSelectedItem.toVerse = value;
        this.setState({
            selectedItem : currentSelectedItem,
        });
        this.props.action(this.props.index, currentSelectedItem);
    }

    render() {
        const swipeSettings = {
            autoClose: true,
            right : [
                {
                    onPress:() => {
                        this.props.removeListItemAction(this.props.index);
                    },
                    text: 'Delete', type: 'delete'
                }
            ]
        };
        return (
            <Swipeout {...swipeSettings}>
                <View style={styles.toolbar}>
                    <ModalDropdown style={styles.toolbarTitle} options={this.state.books} onSelect={(index, value) => this._onBookSelect(index, value)}>
                        <Text>{this.props.item.bookIndex === null ? '..book...' : bibleIndices[this.props.item.bookIndex].englishName}</Text>
                    </ModalDropdown>
                    <ModalDropdown style={styles.toolbarTitle} options={this.state.chapters} disabled={this.state.chapters.length <= 0}
                                   onSelect={(index, value) => this._onChapterSelect(index, value)}>
                        <Text>{this.props.item.chapter === null ? '..chapter...' : this.props.item.chapter}</Text>
                    </ModalDropdown>
                    <ModalDropdown style={styles.toolbarTitle} options={this.state.fromVerses} disabled={this.state.fromVerses.length <= 0}
                                   onSelect={(index, value) => this._onFromVerseSelect(index, value)}>
                        <Text>{this.props.item.fromVerse === null ? '..from verse...' : this.props.item.fromVerse}</Text>
                    </ModalDropdown>
                    <ModalDropdown style={styles.toolbarTitle} options={this.state.toVerses} disabled={this.state.toVerses.length <= 0}
                                   onSelect={(index, value) => this._onToVerseSelect(index, value)}>
                        <Text>{this.props.item.toVerse === null ? '..to verse...' : this.props.item.toVerse}</Text>
                    </ModalDropdown>
                </View>
            </Swipeout>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
    },
    toolbar: {
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