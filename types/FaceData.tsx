interface Eye {
    pos: number[]
    open: boolean
    imageUri?: string
}

interface EyePair {
    left: Eye
    right: Eye
}

interface FaceData {
    face: number[]
    faceImageUri?: string
    eyes: EyePair
}

interface SelectedEyesData {
    backgroundNum: number
    selectedEyeNum: number[]
}

export {Eye, EyePair, FaceData, SelectedEyesData};