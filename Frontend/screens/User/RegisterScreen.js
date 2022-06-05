import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    ToastAndroid,
    TextInput,
    Platform,
    StyleSheet,
    ScrollView,
    StatusBar
} from "react-native";

import * as Animatable from "react-native-animatable";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Feather from "react-native-vector-icons/Feather";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

import { Item, Picker, Icon } from "native-base";
import { useSelector, useDispatch } from "react-redux";
import { setErrorMessage, registerUser } from "../../redux/actions/AuthAction";
import MESSAGES from "../../constants/Messages";
import Color from "../../constants/Color";
const customColor = require("../../constants/Color");
const COLORS = {primary: 'orange', white: '#fff', white2: '#f3f3f3', black: '#000',black2: '#505462', grey: '#f3f3f3',grey2: '#787a91'};

const RegisterScreen = ({ navigation }) => {
    const error_message = useSelector((state) => state.error_message);
    const success_message = useSelector((state) => state.success_message);
    const dispatch = useDispatch();

    const [data, setData] = React.useState({
        email: "",
        password: "",
        confirm_password: "",
        check_textInputChange: false,
        secureTextEntry: true,
        confirm_secureTextEntry: true
    });

    const [usertype, setUsertype] = useState("0");
    const [isValidType, setIsValidType] = useState(false);

    useEffect(() => {
        if (error_message.length > 0) {
            ToastAndroid.show(error_message, ToastAndroid.SHORT);
        }
    }, [error_message]);

    useEffect(() => {
        if (success_message === MESSAGES.REGISTERED_SUCCESSFULLY) {
            navigation.navigate("LoginScreen");
        }
        if (success_message.length > 0) {
            ToastAndroid.show(success_message, ToastAndroid.SHORT);
        }
    }, [success_message]);

    const textInputChange = (email) => {
        let val = email.trim().toLowerCase();
        if (val.length !== 0) {
            setData({
                ...data,
                email: val,
                check_textInputChange: true
            });
        } else {
            setData({
                ...data,
                email: val,
                check_textInputChange: false
            });
        }
    };

    const nameChangeHandler = (name) => {
        setData({
            ...data,
            name: name
        });
    };

    /* modification */ 
    const cityChangeHandler = (city) => {
        setData({
            ...data,
            city: city
        });
    };

    const localityChangeHandler = (locality) => {
        setData({
            ...data,
            locality: locality
        });
    };

    const phoneChangeHandler = (phone) => {
        setData({
            ...data,
            contact: phone
        });
    };

    const handlePasswordChange = (val) => {
        setData({
            ...data,
            password: val
        });
    };

    const handleConfirmPasswordChange = (val) => {
        setData({
            ...data,
            confirm_password: val
        });
    };

    const updateSecureTextEntry = () => {
        setData({
            ...data,
            secureTextEntry: !data.secureTextEntry
        });
    };

    const updateConfirmSecureTextEntry = () => {
        setData({
            ...data,
            confirm_secureTextEntry: !data.confirm_secureTextEntry
        });
    };

    const selectUserTypeHandler = (type) => {
        if (type === "0") {
            setIsValidType(false);
        } else {
            setIsValidType(true);
            setUsertype(type);
        }
    };

    const handleRegister = () => {

        if (!isValidType) {
            dispatch(setErrorMessage("Please select valid user type"));
            return;
        }

        if (!data.name || !data.contact || !data.email || !data.password || !data.city || !data.locality ) {
            dispatch(setErrorMessage("Please fill all details"));
            return;
        }

        if (data.password != data.confirm_password) {
            dispatch(setErrorMessage("Passwords does not match"));
            return;
        } else if (data.password.length < 8) {
            dispatch(setErrorMessage("Password must be 8 characters long"));
            return;
        }

        if (data.contact.length < 10) {
            dispatch(setErrorMessage("Enter a valid contact number"));
            return;
        }

        const user = {
            email: data.email,
            password: data.password,
            user_type: usertype,
            name: data.name,
            contact: data.contact,
            city : data.city,
            locality : data.locality
        };

      //  console.log(user.city + "hey" + user.locality); 
        
        registerUser(user, dispatch);
    };
    
    return (
        <View style={styles.container}>
            {/* status bar is top notification area */}
            <StatusBar backgroundColor = 'orange' barStyle="light-content" />
            <View style={styles.header}>
                <Text style={styles.text_header}>Register Now!</Text>
            </View>
            <Animatable.View animation="fadeInUpBig" style={styles.footer}>
                <ScrollView showsVerticalScrollIndicator={false}>

                    {/* NAME */}
                    <Text style={[styles.text_footer]}>Name</Text>
                    <View style={styles.action}>
                        <MaterialIcons name="drive-file-rename-outline" color="#505462" size={20} />
                        <TextInput
                            placeholder="Full Name"
                            placeholderTextColor="#787a91"
                            style={styles.textInput}
                            autoCapitalize="none"
                            onChangeText={(val) => nameChangeHandler(val)}
                        />
                    </View>

                    {/* CONTACT */}
                    <Text style={[styles.text_footer, { marginTop: 10 }]}>Contact</Text>
                    <View style={styles.action}>
                        <FontAwesome name="phone" color="#505462" size={20} />
                        <TextInput
                            placeholder="Contact Number"
                            placeholderTextColor="#787a91"
                            style={styles.textInput}
                            autoCapitalize="none"
                            onChangeText={(val) => phoneChangeHandler(val)}
                        />
                        {data.check_contactNumber ? (
                            <Animatable.View animation="bounceIn">
                                <Feather name="check-circle" color="orange" size={20} />
                            </Animatable.View>
                        ) : null}
                    </View>

                    {/* EMAIL */}
                    <Text style={[styles.text_footer, { marginTop: 10 }]}>Email</Text>
                    <View style={styles.action}>
                        <MaterialIcons name="alternate-email" color="#505462" size={20} />
                        <TextInput
                            placeholderTextColor="#787a91"
                            placeholder="Your Email"
                            style={styles.textInput}
                            autoCapitalize="none"
                            onChangeText={(val) => textInputChange(val)}
                        />
                        {data.check_textInputChange ? (
                            <Animatable.View animation="bounceIn">
                                <Feather name="check-circle" color="orange" size={20} />
                            </Animatable.View>
                        ) : null}
                    </View>

                    {/* USER TYPE */}
                    <Text style={[styles.text_footer, { marginTop: 10 }]}>User Type</Text>
                    <View style={{ paddingTop: 10, paddingBottom: 10 }}>
                        <Item picker>
                            <Picker
                                mode="dropdown"
                                iosIcon={<Icon name="arrow-down" />}
                                style={{ width: "100%", height: 20 }}
                                placeholderTextColor="#787a91"
                                placeholder="Select User Type"
                                selectedValue={usertype}
                                onValueChange={(type) => {
                                    selectUserTypeHandler(type);
                                }}
                            >
                                <Picker.Item label="Select..." color="#787a91" value="0" />
                                <Picker.Item label="General User" color="#787a91" value="user" />
                                <Picker.Item label="Vendor" color="#787a91" value="vendor" />
                            </Picker>
                        </Item>
                    </View>

                    

                    {/* City */}
                    <Text style={[styles.text_footer]}>City</Text>
                    <View style={styles.action}>
                        <MaterialIcons name="drive-file-rename-outline" color="#505462" size={20} />
                        <TextInput
                            placeholderTextColor="#787a91"
                            placeholder="City Name"
                            style={styles.textInput}
                            autoCapitalize="none"
                            onChangeText={(val) => cityChangeHandler(val)}
                        />
                    </View>

                    {/* Locality */}
                    <Text style={[styles.text_footer]}>Locality</Text>
                    <View style={styles.action}>
                        <MaterialIcons name="drive-file-rename-outline" color="#505462" size={20} />
                        <TextInput
                            placeholder="Locality"
                            placeholderTextColor="#787a91"
                            style={styles.textInput}
                            autoCapitalize="none"
                            onChangeText={(val) => localityChangeHandler(val)}
                        />
                    </View>

                    {/* PASSWORD */}
                    <Text style={[styles.text_footer, { marginTop: 10 }]}>Password</Text>
                    <View style={styles.action}>
                        <Feather name="lock" color="#505462" size={20} />
                        <TextInput
                            placeholder="Your Password"
                            placeholderTextColor="#787a91"
                            secureTextEntry={data.secureTextEntry ? true : false}
                            style={styles.textInput}
                            autoCapitalize="none"
                            onChangeText={(val) => handlePasswordChange(val)}
                        />
                        <TouchableOpacity onPress={updateSecureTextEntry}>
                            {data.secureTextEntry ? (
                                <Feather name="eye-off" color='orange' size={20} />
                            ) : (
                                <Feather name="eye" color="orange" size={20} />
                            )}
                        </TouchableOpacity>
                    </View>

                    {/* CONFIRM PASSWORD */}
                    <Text style={[styles.text_footer, { marginTop: 10 }]}>Confirm Password</Text>
                    <View style={styles.action}>
                        <Feather name="lock" color="#505462" size={20} />
                        <TextInput
                            placeholder="Confirm Your Password"
                            placeholderTextColor="#787a91"
                            secureTextEntry={data.confirm_secureTextEntry ? true : false}
                            style={styles.textInput}
                            autoCapitalize="none"
                            onChangeText={(val) => handleConfirmPasswordChange(val)}
                        />
                        <TouchableOpacity onPress={updateConfirmSecureTextEntry}>
                            {data.secureTextEntry ? (
                                <Feather name="eye-off" color="orange" size={20} />
                            ) : (
                                <Feather name="eye" color="orange" size={20} />
                            )}
                        </TouchableOpacity>
                    </View>

                    {/* BUTTON_GRP */}
                    <View style={styles.button}>
                        <TouchableOpacity onPress={handleRegister} style={[styles.registerButton]}>
                            <Text style={styles.registerText}>Submit</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => navigation.goBack()}
                            style={[
                                styles.loginButton,
                                { marginTop: 15, marginBottom: 20, backgroundColor: COLORS.primary }
                            ]}
                        >
                            <Text style={styles.loginText}>Login</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </Animatable.View>
        </View>
    );
};

export default RegisterScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.primary
    },
    buttonContainer: {
        width: "100%",
        padding: 10,
        alignItems: "center",
        textAlign: "center",
        borderRadius: 10,
        borderColor: "#FF9292",
        borderWidth: 1.5
    },
    registerButton: {
        width: "100%",
        marginTop: 10,
        padding: 15,
        alignItems: "center",
        textAlign: "center",
        backgroundColor: '#f3f3f3',
        borderRadius: 10,
        borderColor: 'white',
        borderWidth: 1,
        elevation: 5
    },
    registerText: {
        color: "#505462",
        fontSize: 18,
    },
    loginButton: {
        width: "100%",
        marginTop: 10,
        padding: 15,
        alignItems: "center",
        textAlign: "center",
        backgroundColor: 'orange',
        borderRadius: 10,
        borderColor: 'white',
        borderWidth: 1,
        elevation: 4
    },
    loginText: {
        color: "white",
        fontSize: 18,
        fontWeight: 'bold'
    },
    buttonText: {
        color: customColor.dark,
        fontSize: 18,
        fontWeight: "bold"
    },
    iconS: {
        right: 0
    },
    header: {
        flex: 1,
        justifyContent: "flex-end",
        paddingHorizontal: 20,
        paddingBottom: 50
    },
    footer: {
        flex: 3,
        backgroundColor: COLORS.white,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingHorizontal: 20,
        paddingVertical: 30
    },
    text_header: {
        color: COLORS.white ,
        fontWeight: "bold",
        fontSize: 30
    },
    text_footer: {
        color: "#505462",
        fontSize: 18
    },
    action: {
        flexDirection: "row",
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.primary,
        paddingBottom: 5
    },
    actionError: {
        flexDirection: "row",
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.primary,
        paddingBottom: 5
    },
    textInput: {
        flex: 1,
        marginTop: Platform.OS === "ios" ? 0 : -12,
        paddingLeft: 10,
        color: COLORS.black2
    },
    errorMsg: {
        color: "orange",
        fontSize: 14
    },
    successMsg: {
        color: "#0000FF",
        fontSize: 14
    },
    button: {
        alignItems: "center",
        marginTop: 50
    },
    signIn: {
        width: "100%",
        height: 50,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 10
    },
    extSign: {
        fontSize: 18,
        fontWeight: "bold"
    },
    textPrivate: {
        flexDirection: "row",
        flexWrap: "wrap",
        marginTop: 20
    },
    color_textPrivate: {
        color: "grey"
    }
});
