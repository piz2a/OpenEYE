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

export {Eye, EyePair, FaceData};