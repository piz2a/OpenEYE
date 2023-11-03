import axios from "axios";
import {apiUrl} from "../Constants";
import * as FileSystem from "expo-file-system";
import {FaceData} from "../types/FaceData";
import {ReactElement} from "react";
import LoadingTemplate from "./templates/LoadingTemplate";
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {RootStackParamList} from "../types/RootStackParams";

const cropImage = async (uri: string, pos: number[], fileName: string) => {
    const body = new FormData();
    // @ts-ignore
    body.append('image', {uri: uri, name: 'image.jpg', type: 'image/jpeg'});
    body.append('topleft', `${pos[0]} ${pos[1]}`);
    body.append('bottomright', `${pos[2]} ${pos[3]}`);
    console.log(uri, JSON.stringify(pos));
    await axios.post(apiUrl + '/crop', body).catch(console.log);

    const fileUri = FileSystem.documentDirectory + '/' + fileName;
    const res = await FileSystem.downloadAsync(apiUrl + '/crop', fileUri);
    return res.uri;
};

const cropFacesAndEyes = async (uris: string[], analysisList: FaceData[][]) => {
    const newAnalysisList: FaceData[][] = [];
    for (let i = 0; i < analysisList.length; i++) {
        const newFaceDataList: FaceData[] = [];
        for (let j = 0; j < analysisList[i].length; j++) {
            console.log(`${i} ${j}`, JSON.stringify(analysisList[i][j]));
            try {
                const newFaceData: FaceData = {
                    ...analysisList[i][j],
                    eyes: {
                        left: {
                            ...analysisList[i][j].eyes.left,
                            imageUri: await cropImage(
                                uris[i], analysisList[i][j].eyes.left.pos, `eyeLeft-${new Date().getTime()}-${i}-${j}.jpg`
                            )
                        },
                        right: {
                            ...analysisList[i][j].eyes.right,
                            imageUri: await cropImage(
                                uris[i], analysisList[i][j].eyes.right.pos, `eyeRight-${new Date().getTime()}-${i}-${j}.jpg`
                            )
                        }
                    },
                    faceImageUri: await cropImage(
                        uris[i], analysisList[i][j].face, `face-${new Date().getTime()}-${i}-${j}.jpg`
                    )
                };
                newFaceDataList.push(newFaceData);
            } catch (e) {
                console.log(e);
            }
        }
        newAnalysisList.push(newFaceDataList);
    }
    return newAnalysisList;
};

function Loading2({ navigation, route }: NativeStackScreenProps<RootStackParamList, 'Loading2'>): ReactElement {
    const callBackProcess = async (setText: Function) => {
        setText('눈 사진 Crop 중');
        const newAnalysisList = await cropFacesAndEyes(route.params.uris, route.params.analysisList);

        navigation.navigate('EyeSelection', {...route.params, analysisList: newAnalysisList});
    };

    return <LoadingTemplate callbackProcess={callBackProcess}/>;
}

export default Loading2;