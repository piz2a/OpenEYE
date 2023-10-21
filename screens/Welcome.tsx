import React, {ReactElement} from "react";
import {Button, StyleSheet, Text, View} from "react-native";
import {StackScreenProps} from "@react-navigation/stack";
import {RootStackParamList} from "../types/RootStackParams";

function Welcome({ navigation }: StackScreenProps<RootStackParamList, 'Welcome'>): ReactElement {
    return (
        <View style={styles.container}>
            <Text>Open up App.tsx to start working on your app!</Text>
            <Button
                title="Take a photo"
                onPress={() =>
                    navigation.navigate('Camera')
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default Welcome;