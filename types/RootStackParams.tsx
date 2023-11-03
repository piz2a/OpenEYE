import {FaceData, SelectedEyesData} from "./FaceData";

interface LoadingParams {
    uris: string[]
    orientation: number
    backToCamera: (navigation: any, route: any) => void
}

interface PreviewParams extends LoadingParams {
    analysisList: FaceData[][]
    previewImageUri: string
    selectedEyesData: SelectedEyesData
}

export type RootStackParamList = {
    Camera: { directoryUri?: string }
    Loading: LoadingParams
    Preview: PreviewParams
    Loading2: PreviewParams
    EyeSelection: PreviewParams
    OutFocusing: undefined
    Saving: undefined
    Complete: undefined
};