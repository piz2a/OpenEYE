import {FaceData} from "./FaceData";

export type RootStackParamList = {
    Camera: undefined;
    Loading: { uris: string[], directoryUri: string };
    Preview: { uris: string[], directoryUri: string, newAnalysisList: FaceData[][], previewImageUri: string };
    EyeSelection: undefined;
    OutFocusing: undefined;
    Saving: undefined;
    Complete: undefined;
};