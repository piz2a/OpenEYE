import {Button, GestureResponderEvent, Image, StyleSheet, Text, TouchableOpacity} from "react-native";

interface FooterButtonProps {
    sourceFileName?: string
    onPress?: (event: GestureResponderEvent) => void
}

interface SuperFooterButtonProps extends FooterButtonProps {
    radius: number
    color: string
}

function FooterButton({ sourceFileName, onPress }: SuperFooterButtonProps) {
    return (
        <TouchableOpacity activeOpacity={0.5} onPress={onPress ? onPress : () => {}}>
            <Image source={require('../../assets/favicon.png')}/>
            <Text style={styles.text}>{sourceFileName}</Text>
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