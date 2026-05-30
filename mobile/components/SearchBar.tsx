import { Image, View, TextInput } from "react-native";
// import { icons } from "@/constants/icons";



interface Props {
    placeholder: string;
    onPress?: () => void;
    value?: string;
    onChangeText?: (text: string) => void;
}



function SearchBar({ placeholder, onPress, value, onChangeText }: Props) {
    return (
        <View
            style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: "#0f0d23",
                borderRadius: 9999,
                paddingHorizontal: 16,
                paddingVertical: 12,
            }}
        >
            {/* <Image
                source={icons.search}
                style={{
                    width: 18,
                    height: 18,
                }}
                resizeMode="contain"
                tintColor="#ab8bff"
            /> */}

            <TextInput
                style={{
                    flex: 1,
                    marginLeft: 6,
                    color: "#FFFFFF",
                }}

                onPress={onPress}
                placeholder={placeholder}
                value={value}
                onChangeText={onChangeText}
                placeholderTextColor="#a8b5db"
            />
        </View>
    );
};

export default SearchBar;