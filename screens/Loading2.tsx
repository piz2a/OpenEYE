import {ReactElement} from "react";
import LoadingTemplate from "./templates/LoadingTemplate";
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {RootStackParamList} from "../types/RootStackParams";
import {cropFacesAndEyes} from "../utils/APIRequest";

function Loading2({ navigation, route }: NativeStackScreenProps<RootStackParamList, 'Loading2'>): ReactElement {
    const callBackProcess = async (setText: Function) => {
        setText('눈 사진 자르는 중');
        const newAnalysisList = await cropFacesAndEyes(route.params.uris, route.params.analysisList);

        navigation.navigate('EyeSelection', {...route.params, analysisList: newAnalysisList, cropped: true});
    };

    return <LoadingTemplate callbackProcess={callBackProcess}/>;
}

export default Loading2;