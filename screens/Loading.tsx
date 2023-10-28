import React, {ReactElement, useEffect} from "react";
import {Text} from "react-native";
import {RootStackParamList} from "../types/RootStackParams";
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import Template from "./Template";
import {CommonActions} from "@react-navigation/native";
import {apiUrl} from "../Constants";

// navigator history에서 삭제시켜야 한다.

function Loading({ navigation, route }: NativeStackScreenProps<RootStackParamList, 'Loading'>): ReactElement {
    useEffect(() => {
        (async () => {
            let count = 0;
            for (let i = 0; i < route.params.uris.length; i++) {
                const body = new FormData();
                // @ts-ignore
                body.append('image', {uri: route.params.uris[i], name: 'image.jpg', type: 'image/jpeg'});
                fetch(apiUrl + '/eyepos', {
                    method: 'POST',
                    body: body
                }).then(
                    (response) => response.json()
                ).then((responseData) => {
                    console.log(
                        "POST Response #", i,
                        "Response Body -> " + JSON.stringify(responseData)
                    )
                    count++;
                    if (count === route.params.uris.length) {
                        navigation.dispatch(CommonActions.reset({
                            index: 1,
                            routes: [
                                { 'name': 'Camera' },
                                { 'name': 'Preview' },
                            ]
                        }));
                    }
                }).catch(reason => {
                    console.log('Catch:', reason);
                });
            }
        })();
    }, []);

    return (
        <Template btnL={{}} btnC={{}} btnR={{}}>
            <Text style={{color: "#fff"}}>Loading...</Text>
        </Template>
    );
}

export default Loading;