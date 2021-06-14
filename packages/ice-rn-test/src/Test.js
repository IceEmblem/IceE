import React from 'react';
import { View, Text } from 'react-native'

export default class Test extends React.Component {
    render() {
        return (
            <View style={{width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Text>Hello World!!</Text>
            </View>
        );
    }
}