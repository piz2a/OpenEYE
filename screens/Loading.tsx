import React, {ReactElement, useEffect} from "react";
import {Text} from "react-native";
import {RootStackParamList} from "../types/RootStackParams";
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import Template from "./Template";
import {apiUrl} from "../Constants";
import * as FileSystem from "expo-file-system";
import {EncodingType} from "expo-file-system";
import {decode as atob} from 'base-64';
import {Buffer} from 'buffer';
import {CommonActions} from "@react-navigation/native";

// navigator history에서 삭제시켜야 한다.

function dataURLtoFile(dataurl: string, filename: string) {
    const match = 'data:image/jpeg;base64,'.match(/:(.*?);/);
    const bstr = atob(dataurl);
    let n = bstr.length
    const u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    if (match === null)
        return new File([new Uint8Array(n)], filename)
    const mime = match[1];
    return new File([u8arr], filename, {type:mime});
}

const b64toBlob = (b64Data: string, contentType='', sliceSize=512) => {
    const byteCharacters = atob(b64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        const slice = byteCharacters.slice(offset, offset + sliceSize);

        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, {type: contentType});
    return blob;
}

function Loading({ navigation, route }: NativeStackScreenProps<RootStackParamList, 'Loading'>): ReactElement {
    useEffect(() => {
        (async () => {
            let count = 0;
            for (let i = 0; i < route.params.uris.length; i++) {
                const base64 = await FileSystem.readAsStringAsync(route.params.uris[i],{encoding: EncodingType.Base64})
                let body = new FormData();
                // dataURLtoFile(base64, 'image.jpg')
                // body.append('image', b64toBlob(base64, 'image/jpeg'), 'image.jpg');
                // @ts-ignore
                body.append('image', {uri: route.params.uris[i], name: 'image.jpg', type: 'image/jpeg'});
                // body.append('image', base64);
                fetch('https://openeye.ziho.kr/eyepos', {
                    method: 'POST',
                    body: body
                }).then(
                    (response) => {
                        // console.log(response.headers);
                        // response.text().then(response => console.log(response));
                        return response.json();
                    }
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
                    console.log('error:', reason);
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