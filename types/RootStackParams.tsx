import {FaceData, SelectedEyesData} from "./FaceData";

interface LoadingParams {
    uris: string[]
    directoryUri: string
    orientation: number
}

interface PreviewParams extends LoadingParams {
    uris: string[]
    directoryUri: string
    newAnalysisList: FaceData[][]
    previewImageUri: string
    selectedEyesData: SelectedEyesData
}

export type RootStackParamList = {
    Camera: { directoryUri?: string }
    Loading: LoadingParams
    Preview: PreviewParams
    EyeSelection: PreviewParams
    OutFocusing: undefined
    Saving: undefined
    Complete: undefined
};