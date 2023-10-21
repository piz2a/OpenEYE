import {SafeAreaView, StyleSheet, View} from "react-native";
import {Colors} from "react-native/Libraries/NewAppScreen";
import {ReactNode} from "react";
import Footer, {FooterProps} from "../components/footer/Footer";

interface TemplateProps extends FooterProps {
    children?: ReactNode
}

function Template({ btnL, btnC, btnR, children }: TemplateProps) {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.main}>
                {children}
            </View>
            <Footer {...{btnL, btnC, btnR}}/>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: Colors.darker,
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