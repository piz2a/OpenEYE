interface Eye {
    pos: number[]
    open: boolean
}

interface EyePair {
    left: Eye
    right: Eye
}

interface FaceData {
    face: number[]
    eyes: EyePair
}

export {Eye, EyePair, FaceData};