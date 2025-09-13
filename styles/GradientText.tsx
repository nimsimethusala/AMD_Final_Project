import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";
import { Text } from 'react-native';

export function GradientText(props: { text: string }) {
    return (
        <MaskedView maskElement={<Text style={[{ fontSize: 55 }, {backgroundColor: 'transparent'}]}>{props.text}</Text>}>
            <LinearGradient
                colors={['#FF0000', '#00FF00']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            >
                <Text style={[{ fontSize: 55 }, {opacity: 0}]}>{props.text}</Text>
            </LinearGradient>
        </MaskedView>
    )
}

