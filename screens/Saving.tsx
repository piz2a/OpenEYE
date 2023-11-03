import React, {ReactElement} from "react";
import {RootStackParamList} from "../types/RootStackParams";
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import LoadingTemplate from "./templates/LoadingTemplate";
import * as MediaLibrary from "expo-media-library";

const downloadImage = async (uri: string) => {
    try {
        const asset = await MediaLibrary.createAssetAsync(uri);
        const album = await MediaLibrary.getAlbumAsync('Download');
        if (album == null) {
            await MediaLibrary.createAlbumAsync('Download', asset, false);
        } else {
            await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
        }
    } catch (e) {
        console.log("downloadImage error:", e);
    }
};

function Saving({ navigation, route }: NativeStackScreenProps<RootStackParamList, 'Saving'>): ReactElement {
    const callbackProcess = async (setText: Function) => {
        setText('사진 저장 중');
        await downloadImage(route.params.previewImageUri);
        navigation.navigate('Complete', route.params);
    }
    return <LoadingTemplate callbackProcess={callbackProcess}/>;
}

export default Saving;