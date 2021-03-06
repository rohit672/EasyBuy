import React, { useState, useEffect, Fragment } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
    View,
    Text,
    TouchableOpacity,
    ImageBackground,
    TextInput,
    ToastAndroid,
    StyleSheet,
    Platform,
    ScrollView,
} from "react-native";

import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { REST_API_URL } from "../../constants/URLs";
const FormData = require("form-data");
import { updateCurrentUser } from "../../redux/actions/AuthAction";

import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import FontAwesome from "react-native-vector-icons/FontAwesome";

import BottomSheet from "reanimated-bottom-sheet";
import Animated from "react-native-reanimated";

import * as ImagePicker from "expo-image-picker";
const customColor = require('../../constants/Color');
const EditProfileScreen = ({ navigation }) => {
    const [image, setImage] = useState(
        "https://drive.google.com/uc?id=18CXkz-Lqgi04iiL9jV3CtRuoYg6lb3RV"
    );
    const user_data = useSelector((state) => state.user_data);
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [contact, setContact] = useState("");
    const [imageType, setImageType] = useState("");

    //modification 
    const [city, setCity] = useState("");
    const [locality, setLocality] = useState("");

    // Only for user-type data
    const [userAddress, setUserAddress] = useState({
        country: "",
        city: "",
        street: "",
        postal_code: ""
    });

    const token = useSelector((state) => state.token);
    const dispatch = useDispatch();
    useEffect(() => {

        if (user_data.imageUrl != undefined) {
            setImage(user_data.imageUrl);
            let __image_type__ = user_data.imageUrl.match(/(jpeg|png|jpg)/g);
            if (__image_type__ != null) {
                setImageType(__image_type__[0]);
            }
        }
        if (user_data.contact != undefined) {
            setContact(user_data.contact);
        }
        if (user_data.name != undefined) {
            setName(user_data.name);
        }
        if (user_data.email != undefined) {
            setEmail(user_data.email);
        }
        if (user_data.address != undefined) {
            setUserAddress({ ...userAddress, ...user_data.address });
        }

        //modification 
        if (user_data.city != undefined) {
            setCity(user_data.city);
        }
        if (user_data.locality != undefined) {
            setLocality(user_data.locality);
        }

    }, [user_data]);


    const takePhotoFromCamera = async () => {
        let result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1
        });

        if (!result.cancelled) {
            setImage(result.uri);
            let __image_type__ = await result.uri.match(/(jpeg|png|jpg)/g);
            if (imageType != null) {
                setImageType(__image_type__[0]);
            }
        }
    };

    const choosePhotoFromLibrary = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1
        });
        if (!result.cancelled) {
            setImage(result.uri);
            let __image_type__ = await result.uri.match(/(jpeg|png|jpg)/g);
            if (imageType != null) {
                setImageType(__image_type__[0]);
            }
        }
    };
    
    const handleOnPressSubmit = async () => {
        let form = new FormData();
        if (imageType != "") {
            form.append("image", {
                name: "image",
                type: `image/${imageType}`,
                uri: image
            });
        }
        form.append("name", name);
        form.append("email", email);
        form.append("contact", contact);
        // if (!token.isVendor) {
        //     form.append("street", userAddress.street);
        //     form.append("country", userAddress.country);
        //     form.append("city", userAddress.city);
        //     form.append("postal_code", userAddress.postal_code);
        // }
        form.append("city", city);
        form.append("locality", locality);

        (async () => {
          
            //modification
            
            const authToken = await AsyncStorage.getItem("jwt");
            const requestConfig = {
                headers: {
                    "Content-Type": `mutlipart/form-data; boundary=${form._boundary}`,
                    Authorization: `Bearer ${authToken}`
                }
            };

            try {
                let url = `${REST_API_URL}/api/vendor/vendor`;
                if (!token.isVendor) {

                    url = `${REST_API_URL}/api/user/user`;
                }
                let response = await axios.put(url, form, requestConfig);
                response = response.data;
                if (response.success === true) {
                    if (token.isVendor) {
                        updateCurrentUser(dispatch, response.vendor);
                    } else {
                        updateCurrentUser(dispatch, response.user);
                    }
                    ToastAndroid.show(response.message, ToastAndroid.SHORT);
                    navigation.goBack();
                } else {
                    ToastAndroid.show(response.message, ToastAndroid.SHORT);
                }
            } catch (error) {
                console.log("API call error for profile update", error);
            }
        })();
    };

    const renderInner = () => (
        <View style={styles.panel}>
            <View style={{ alignItems: "center" }}>
                <Text style={styles.panelTitle}>Upload Photo</Text>
                <Text style={styles.panelSubtitle}>Choose Your Profile Picture</Text>
            </View>
            <TouchableOpacity style={styles.panelButton1} onPress={takePhotoFromCamera}>
                <Text style={styles.panelButtonTitle1}>Take Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.panelButton2} onPress={choosePhotoFromLibrary}>
                <Text style={styles.panelButtonTitle}>Choose From Library</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.panelButton3} onPress={() => bs.current.snapTo(1)}>
                <Text style={styles.panelButtonTitle}>Cancel</Text>
            </TouchableOpacity>
        </View>
    );

    const renderHeader = () => (
        <View style={styles.header}>
            <View style={styles.panelHeader}>
                <View style={styles.panelHandle} />
            </View>
        </View>
    );

    var bs = React.useRef();
    var fall = new Animated.Value(1);

    return (
        <Fragment>
            <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
                <Animated.View
                    style={{
                        margin: 20,
                        opacity: Animated.add(0.1, Animated.multiply(fall, 1.0))
                    }}
                >
                    <View style={{ alignItems: "center", marginBottom: 30 }}>
                        <TouchableOpacity onPress={() => bs.current.snapTo(0)}>
                            <View
                                style={{
                                    height: 100,
                                    width: 100,
                                    borderRadius: 15,
                                    justifyContent: "center",
                                    alignItems: "center"
                                }}
                            >
                                <ImageBackground
                                    source={{
                                        uri: image
                                    }}
                                    style={{ height: 100, width: 100 }}
                                    imageStyle={{ borderRadius: 15 }}
                                >
                                    <View
                                        style={{
                                            flex: 1,
                                            justifyContent: "center",
                                            alignItems: "center"
                                        }}
                                    >
                                        <Icon
                                            name="camera"
                                            size={35}
                                            color="white"
                                            style={{
                                                opacity: 0.7,
                                                alignItems: "center",
                                                justifyContent: "center",
                                                borderWidth: 1,
                                                borderColor: "grey",
                                                borderRadius: 10
                                            }}
                                        />
                                    </View>
                                </ImageBackground>
                            </View>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.action}>
                        <FontAwesome name="user-o" size={20} />
                        <TextInput
                            placeholder="Name"
                            placeholderTextColor="#666666"
                            autoCorrect={false}
                            value={name}
                            onChangeText={(val) => {
                                setName(val);
                            }}
                            style={styles.textInput}
                        />
                    </View>

                    {/* modification  */}
                    
                    <View style={styles.action}>
                        <FontAwesome name="phone" size={20} />
                        <TextInput
                            placeholder="Contact"
                            placeholderTextColor="#666666"
                            autoCorrect={false}
                            value={contact}
                            onChangeText={(val) => {
                                setContact(val);
                            }}
                            style={styles.textInput}
                        />
                    </View>

                    <View style={styles.action}>
                        <FontAwesome name="globe" size={20} />
                        <TextInput
                            placeholder="City"
                            placeholderTextColor="#666666"
                            autoCorrect={false}
                            value={city}
                            onChangeText={(val) => {
                                setCity(val);
                            }}
                            style={styles.textInput}
                        />
                    </View>

                    <View style={styles.action}>
                        <FontAwesome name="home" size={20} />
                        <TextInput
                            placeholder="Locality"
                            placeholderTextColor="#666666"
                            autoCorrect={false}
                            value={locality}
                            onChangeText={(val) => {
                                setLocality(val);
                            }}
                            style={styles.textInput}
                        />
                    </View>


                    {/* {!token.isVendor && (
                        <View style={styles.action}>
                            <FontAwesome name="globe" size={20} />
                            <TextInput
                                placeholder="Country"
                                placeholderTextColor="#666666"
                                value={userAddress.country}
                                autoCorrect={false}
                                onChangeText={(val) => {
                                    setUserAddress({ ...userAddress, country: val });
                                }}
                                style={styles.textInput}
                            />
                        </View>
                    )}
                    {!token.isVendor && (
                        <View style={styles.action}>
                            <Icon name="map-marker-outline" size={20} />
                            <TextInput
                                placeholder="City"
                                placeholderTextColor="#666666"
                                value={userAddress.city}
                                autoCorrect={false}
                                onChangeText={(val) => {
                                    setUserAddress({ ...userAddress, city: val });
                                }}
                                style={styles.textInput}
                            />
                        </View>
                    )}
                    {!token.isVendor && (
                        <View style={styles.action}>
                            <Icon name="home" size={20} />
                            <TextInput
                                placeholder="Street"
                                value={userAddress.street}
                                placeholderTextColor="#666666"
                                onChangeText={(val) => {
                                    setUserAddress({ ...userAddress, street: val });
                                }}
                                autoCorrect={false}
                                style={styles.textInput}
                            />
                        </View>
                    )}
                    {!token.isVendor && (
                        <View style={styles.action}>
                            <Icon name="post-outline" size={20} />
                            <TextInput
                                placeholder="Postal Code"
                                value={userAddress.postal_code}
                                placeholderTextColor="#666666"
                                onChangeText={(val) => {
                                    setUserAddress({ ...userAddress, postal_code: val });
                                }}
                                autoCorrect={false}
                                style={styles.textInput}
                            />
                        </View>
                    )} */}
                    <TouchableOpacity style={styles.commandButton} onPress={handleOnPressSubmit}>
                        <Text style={styles.panelButtonTitle}>Submit</Text>
                    </TouchableOpacity>
                </Animated.View>
            </ScrollView>

            <BottomSheet
                ref={bs}
                snapPoints={[330, 0]}
                renderContent={renderInner}
                renderHeader={renderHeader}
                initialSnap={1}
                callbackNode={fall}
                enabledGestureInteraction={true}
            />
        </Fragment>
    );
};

export default EditProfileScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    commandButton: {
        marginTop: 40,
        padding: 15,
        alignItems: "center",
        textAlign: "center",
        borderRadius: 10,
        borderColor: 'white',
        borderWidth: 1,
        //confirm button color
        backgroundColor: customColor.light,
        elevation: 5
    },
    panel: {
        padding: 20,
        // backgroundColor: "#FFFFFF",
        backgroundColor: customColor.white2,
        paddingTop: 8
    },
    header: {
        backgroundColor: customColor.white2,
        shadowColor: customColor.black,
        shadowOffset: { width: -1, height: -3 },
        shadowRadius: 2,
        shadowOpacity: 0.5,
        paddingTop: 20,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
    },
    panelHeader: {
        alignItems: "center"
    },
    panelHandle: {
        width: 40,
        height: 7,
        borderRadius: 4,
        backgroundColor: "#00000040",
        marginBottom: 10
    },
    panelTitle: {
        fontSize: 24,
        height: 40,
        color: customColor.black2
    },
    panelSubtitle: {
        fontSize: 14,
        color: customColor.grey2,
        height: 30,
        marginBottom: 10
    },
    panelButton1: {
        padding: 13,
        borderRadius: 10,
        borderColor: 'white',
        backgroundColor: customColor.white,
        alignItems: "center",
        marginVertical: 7,
        elevation: 4
    },
    panelButtonTitle1: {
        fontSize: 17,
        // fontWeight: "bold",
        color: customColor.black2
    },
    panelButton2: {
        padding: 13,
        borderRadius: 10,
        borderColor: 'white',
        backgroundColor: customColor.grey2,
        alignItems: "center",
        marginVertical: 7,
        elevation: 5
    },
    panelButton3: {
        padding: 13,
        borderColor: 'white',
        borderRadius: 10,
        backgroundColor: customColor.black2,
        alignItems: "center",
        marginVertical: 7,
        elevation: 6
    },
    panelButtonTitle: {
        fontSize: 17,
        fontWeight: "bold",
        color: "white"
    },
    action: {
        flexDirection: "row",
        marginTop: 10,
        marginBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#f2f2f2",
        paddingBottom: 5
    },
    actionError: {
        flexDirection: "row",
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#FF0000",
        paddingBottom: 5
    },
    textInput: {
        flex: 1,
        marginTop: Platform.OS === "ios" ? 0 : -12,
        paddingLeft: 10,
        color: "gray"
    }
});
