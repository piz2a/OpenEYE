import {GestureResponderEvent, Image, StyleSheet, Text, TouchableOpacity} from "react-native";
import {useEffect, useState} from "react";

interface FooterButtonProps {
    source?: any,
    style?: any,
    onPress?: (event: GestureResponderEvent) => void
}

interface SuperFooterButtonProps extends FooterButtonProps {
    radius: number
    color: string
}

function FooterButton({ source, onPress, style = {} }: SuperFooterButtonProps) {
    /*
    const [style, setStyle] = useState({});
    useEffect(() => {
        Image.getSize(source, (width, height) => {
            setStyle({width: width / 3, height: height / 3});
        });
    }, []);
     */
    return (
        <TouchableOpacity activeOpacity={0.5} onPress={onPress ? onPress : () => {}}>
            <Image source={source} style={style}/>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    touchable: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    text: {
        color: '#fff',
        textAlign: "center"
    }
})

function CenterFooterButton(props: FooterButtonProps) {
    return <FooterButton radius={10} color={"#aaa"} {...props}/>
}

function SideFooterButton(props: FooterButtonProps) {
    return <FooterButton radius={8} color={"#999"} {...props}/>
}

export {FooterButtonProps};
export {CenterFooterButton, SideFooterButton};