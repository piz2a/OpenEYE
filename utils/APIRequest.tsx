import {apiUrl} from "../Constants";
import {FaceData, SelectedEyesData} from "../types/FaceData";
import * as FileSystem from "expo-file-system";
import axios from "axios";

export const fetchEyePos = async (uris: string[]) => {
    const imageCount = uris.length;
    const responses: any[] = [];
    for (let i = 0; i < imageCount; i++) {
        const body = new FormData();
        // @ts-ignore
        body.append('image', {uri: uris[i], name: 'image.jpg', type: 'image/jpeg'});
        const response = await fetch(apiUrl + '/eyepos', {
            method: 'POST',
            body: body
        })
        const responseData = await response.json();
        console.log(
            "POST Response #", i,
            "Response Body -> " + JSON.stringify(responseData)
        );

        responses.push(responseData);
    }
    return responses;
};

export const jsonProcess = (imageCount: number, responses: any[]) => {
    let peopleImagesCount = imageCount;
    const analysisList: FaceData[][] = [];
    responses.forEach(response => {
        const faceDataList: FaceData[] = [];
        const peopleCount: number = response["people"];
        if (peopleCount === 0) {
            peopleImagesCount--;
            return;
        }
        for (let i = 0; i < peopleCount; i++) {
            const faceN = response[`face${i}`];
            const face: number[] = faceN["face"];
            const leftEye: number[] = faceN["lefteye"].pos;
            const leftEyeOpen: boolean = faceN["lefteye"].open;
            const rightEye: number[] = faceN["righteye"].pos;
            const rightEyeOpen: boolean = faceN["righteye"].open;
            faceDataList.push({
                face: face,
                eyes: {
                    left: {pos: leftEye, open: leftEyeOpen},
                    right: {pos: rightEye, open: rightEyeOpen}
                }
            });
        }
        analysisList.push(faceDataList);
    });
    if (peopleImagesCount === 0) return null;
    console.log(JSON.stringify(analysisList));
    return analysisList;
};

export const sampleImage = async (uris: string[], response: any[]): Promise<{previewImageUri: string, selectedEyesData: SelectedEyesData}> => {
    const body = new FormData();
    for (let i = 1; i <= 3; i++) {
        // @ts-ignore
        body.append(`image${i}`, {uri: uris[i - 1], name: `${i}.jpg`, type: 'image/jpeg'});
    }
    body.append('json', JSON.stringify(response));
    await axios.post(apiUrl + '/sampleimg', body).catch(console.log);

    const fileUri = FileSystem.documentDirectory + '/sampleimg.jpg';
    const res = await FileSystem.downloadAsync(apiUrl + '/sampleimg', fileUri);

    return {
        previewImageUri: res.uri,
        selectedEyesData: {backgroundNum: 0, selectedEyeNum: []}
    };
};

export const cropImage = async (uri: string, pos: number[], fileName: string) => {
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

export const cropFacesAndEyes = async (uris: string[], analysisList: FaceData[][]) => {
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

export const overlayImage = async (mainUri: string, overlayUri: string, pos: number[], fileName: string) => {
    const body = new FormData();
    // @ts-ignore
    body.append('main', {uri: mainUri, name: 'main.jpg', type: 'image/jpeg'});
    // @ts-ignore
    body.append('overlay', {uri: overlayUri, name: 'overlay.jpg', type: 'image/jpeg'});
    body.append('topleft', `${pos[0]} ${pos[1]}`);
    body.append('bottomright', `${pos[2]} ${pos[3]}`);
    await axios.post(apiUrl + '/overlay', body).catch(console.log);

    const fileUri = FileSystem.documentDirectory + '/' + fileName;
    const res = await FileSystem.downloadAsync(apiUrl + '/overlay', fileUri, {});

    return res.uri;
};

export const overlayEyes = async (uris: string[], newAnalysisList: FaceData[][]) => {
    const bgImageNum = 0;
    let mainImageUri = uris[bgImageNum];
    const minFaceCount = Math.min(...newAnalysisList.map(faceDataList => faceDataList.length));
    const selectedEyesData: SelectedEyesData = {
        backgroundNum: bgImageNum,
        selectedEyeNum: []
    };

    for (let j = 0; j < minFaceCount; j++) {
        for (let i = 0; i < newAnalysisList.length; i++) {
            if (![0, 1].every(eyeNum => newAnalysisList[i][j].eyes[eyeNum === 0 ? 'left' : 'right'].open))
                continue;
            for (let eyeNum = 0; eyeNum < 2; eyeNum++) {
                const eye = newAnalysisList[i][j].eyes[eyeNum === 0 ? 'left' : 'right'];
                if (i !== bgImageNum) {
                    mainImageUri = await overlayImage(
                        mainImageUri,
                        eye.imageUri ? eye.imageUri : '',
                        newAnalysisList[i][j].eyes.left.pos,
                        `overlay.jpg`
                    );
                }
            }
            selectedEyesData.selectedEyeNum.push(i);
            break;
        }
    }

    return mainImageUri;
};

export const changeEye = async (mainUri: string, eyeUri: string, pos: number[]) => {
    const body = new FormData();
    // @ts-ignore
    body.append('img', {uri: mainUri, name: 'main.jpg', type: 'image/jpeg'});
    // @ts-ignore
    body.append('eye', {uri: eyeUri, name: 'eye.jpg', type: 'image/jpeg'});
    body.append('center', `${Math.floor((pos[0] + pos[2]) / 2)} ${Math.floor((pos[1] + pos[3]) / 2)}`);
    await axios.post(apiUrl + '/changeeye', body).catch(console.log);

    const fileUri = FileSystem.documentDirectory + `/eyeChanged-${new Date().getTime()}.jpg`;
    const res = await FileSystem.downloadAsync(apiUrl + '/changeeye', fileUri);

    return res.uri;
};