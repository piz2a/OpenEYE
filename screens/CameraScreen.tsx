import React, {ReactElement, useEffect, useRef, useState} from "react";
import {Image, StyleSheet, Text, View} from "react-native";
import {RootStackParamList} from "../types/RootStackParams";
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import Template from "./Template";
import {Camera, CameraType} from "expo-camera";

function CameraScreen({ navigation }: NativeStackScreenProps<RootStackParamList, 'Camera'>): ReactElement {
    const camera = useRef<Camera>(null);
    const [type, setType] = useState(CameraType.back);
    const [permission, requestPermission] = Camera.useCameraPermissions();
    const [ready, setReady] = useState(false);
    const [imageUriList, setImageUriList] = useState<string[] | null>(null);

    useEffect(() => {
        if (!permission?.granted) requestPermission();
    }, [permission]);

    const takePicture = async () => {
        if (camera.current && permission?.granted && ready) {
            const newImageUriList: string[] = [];
            for (let i = 0; i < 3; i++) {
                setTimeout(async () => {
                    if (!camera.current) return;
                    const data = await camera.current.takePictureAsync();
                    newImageUriList.push(data.uri);
                }, 100 * i);
            }
            setImageUriList(newImageUriList);
        } else {
            // No Camera
        }
    }
    const toggleCameraType = () => setType(current => (current === CameraType.back ? CameraType.front : CameraType.back))

    return (
        <Template btnL={{sourceFileName: "Recent"}}
                  btnC={{sourceFileName: "Take", onPress: () => takePicture() /*navigation.navigate('Loading')}*/}}
                  btnR={{sourceFileName: "Turn", onPress: toggleCameraType}}>
            {imageUriList === null ?
                <Camera ref={camera} onCameraReady={() => setReady(true)} style={styles.camera} type={type} ratio={'1:1'}/> :
                <View style={{flex: 1}}>
                    <Text style={{color: '#f00'}}>{imageUriList[0].length}b</Text>
                    <Image source={{uri: imageUriList[0]}} style={styles.image}/>
                    <Image source={{uri: imageUriList[1]}} style={styles.image}/>
                    <Image source={{uri: imageUriList[2]}} style={styles.image}/>
                </View>
            }
        </Template>
    );
}

const styles = StyleSheet.create({
    camera: {
        flex: 1,
        aspectRatio: 1,
        width: "100%",
    },
    image: {
        flex: 1,
        aspectRatio: 1,
        width: "50%",
    },
})

export default CameraScreen;
