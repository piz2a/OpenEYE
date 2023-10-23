import {SafeAreaView, StyleSheet, View} from "react-native";
import {Colors} from "react-native/Libraries/NewAppScreen";
import {ReactNode, useEffect} from "react";
import Footer, {FooterProps} from "../components/footer/Footer";

interface TemplateProps extends FooterProps {
    setFooterProps: Function
    children?: ReactNode
}

function Template({ setFooterProps, btnL, btnC, btnR, children }: TemplateProps) {
    useEffect(() => {
        setFooterProps({btnL: btnL, btnC: btnC, btnR: btnR});
    }, []);
    return (
        <View style={styles.container}>
            <View style={styles.main}>
                {children}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: Colors.darker,
        maxHeight: '80%',
    },
    main: {
        flex: 1,
        backgroundColor: Colors.darker,
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
    },
});

export default Template;