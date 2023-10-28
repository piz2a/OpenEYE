import {View, StyleSheet} from "react-native";
import {CenterFooterButton, FooterButtonProps, SideFooterButton} from "./FooterButton";

interface FooterProps {
    btnL: FooterButtonProps,
    btnC: FooterButtonProps,
    btnR: FooterButtonProps,
}

function Footer({ btnL, btnC, btnR }: FooterProps) {
    return (
        <View style={styles.container}>
            <SideFooterButton {...btnL}/>
            <CenterFooterButton {...btnC}/>
            <SideFooterButton {...btnR}/>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: "100%",
        maxHeight: "20%",
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
    }
})

export {FooterProps};
export default Footer;