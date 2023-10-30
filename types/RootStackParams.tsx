import {FaceData, SelectedEyesData} from "./FaceData";

export type RootStackParamList = {
    Camera: {
        directoryUri?: string,
    };
    Loading: {
        uris: string[],
        directoryUri: string ,
    };
    Preview: {
        uris: string[],
        directoryUri: string,
        newAnalysisList: FaceData[][],
        previewImageUri: string,
        selectedEyesData: SelectedEyesData,
    };
    EyeSelection: undefined //{ uris: string[], directoryUri: string, newAnalysisList: FaceData[][], previewImageUri: string };
    OutFocusing: undefined;
    Saving: undefined;
    Complete: undefined;
};