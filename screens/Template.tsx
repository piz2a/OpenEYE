import {SafeAreaView, StyleSheet, View} from "react-native";
import {ReactNode} from "react";
import Footer, {FooterProps} from "../components/footer/Footer";

interface TemplateProps extends FooterProps {
    children?: ReactNode
    mainStyle?: any
    footerStyle?: any
}

function Template({ btnL, btnC, btnR, children, style = {}, mainStyle = {}, footerStyle = {} }: TemplateProps) {
    return (
        <SafeAreaView style={{...styles.container, ...style}}>
            <View style={{...styles.main, ...mainStyle}}>
                {children}
            </View>
            <Footer btnL={{...btnL, style: {width: 160 / 3, height: 160 / 3}}}
                    btnC={{...btnC, style: {width: 192 / 3, height: 192 / 3}}}
                    btnR={{...btnR, style: {width: 160 / 3, height: 160 / 3}}}
                    style={footerStyle}/>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: "#dbbbee",
    },
    main: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
    },
});

export default Template;