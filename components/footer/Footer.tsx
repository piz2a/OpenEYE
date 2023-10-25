import {View, StyleSheet} from "react-native";
import {CenterFooterButton, FooterButtonProps, SideFooterButton} from "./FooterButton";
import {RefObject, useCallback, useEffect, useState} from "react";

interface FooterProps {
    btnL: FooterButtonProps,
    btnC: FooterButtonProps,
    btnR: FooterButtonProps,
}

function Footer(/*{ propsRef }: { propsRef: RefObject<FooterProps> }*/{ btnL, btnC, btnR }: FooterProps) {
    /*
    const [tempState, updateTempState] = useState(0);
    const updateFooter = () => updateTempState(tempState + 1);
    useEffect(() => {
        console.log(propsRef.current, tempState);
        updateFooter();
    }, [propsRef.current]);
     */
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
        backgroundColor: "#000",
    }
})

export {FooterProps};
export default Footer;