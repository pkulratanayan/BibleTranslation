import React from 'react';
import {iew, Text, View} from "react-native";


export class TranslatedItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        return (
            <View>
                <Text>
                    {this.props.item}
                </Text>
            </View>
        );
    }
}