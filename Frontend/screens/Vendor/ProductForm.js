import React, { useState, useEffect, useRef } from "react";
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
    Platform,
    ToastAndroid,
    StatusBar,
    ScrollView
} from "react-native";
import BottomSheet from "reanimated-bottom-sheet";
import Animated from "react-native-reanimated";

import * as ImagePicker from "expo-image-picker";
import * as Font from "expo-font";

import { Body, Button, Container, Header, Item, Left, Picker, Right, Title } from "native-base";
import Icon from "react-native-vector-icons/FontAwesome";
import FormContainer from "../../components/Shared/FormContainer";
import Input from "../../components/Shared/Input";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const customColor = require("../../constants/Color");

import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { REST_API_URL } from "../../constants/URLs";
import { useSelector } from "react-redux";
const FormData = require("form-data");

export default function ProductForm(props) {
    const user_data = useSelector((state) => state.user_data);
    const [pickerValue, setPickerValue] = useState();
    const [name, setName] = useState();
    const [cost, setCost] = useState();
    const [description, setDescription] = useState();
    const [image, setImage] = useState();
    const [imageType, setImageType] = useState("");
    const [categories, setCategories] = useState([]);
    const [category, setCategory] = useState();
    const [item, setItem] = useState(null);
    useEffect(() => {
        if (!props.route.params) {
            // Adding
            setItem(null);
        } else {
            // Updating
            setItem(props.route.params.item);
            setName(props.route.params.item.name);
            setCost(props.route.params.item.cost.toString());
            setDescription(props.route.params.item.description);
            setImage(props.route.params.item.image);
            setCategory(props.route.params.item.category);
            setLongDesc(props.route.params.item.longdesc);
        }

        // Categories
        (async () => {
            try {
                let res = await axios.get(`${REST_API_URL}/api/index/category`);
                if (res.data.success === true) {
                    setCategories(res.data.categories);
                    console.log(res.data.categories); 
                } else {
                    throw new Error(res.data.message);
                }
            } catch (error) {
                console.log("API call error", error);
            }
        })();
        // Image Picker
        (async () => {
            if (Platform.OS !== "web") {
                const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
                if (status !== "granted") {
                    alert("Allow camera permision to the upload photo!");
                }
            }
        })();

        // Font error
        (async () =>
            await Font.loadAsync({
                Roboto: require("native-base/Fonts/Roboto.ttf"),
                Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf")
            }))();
    }, []);

    const takePhotoFromCamera = async () => {
        let result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1
        });
        if (!result.cancelled) {
            setImage(result.uri);
            let __image_type__ = await result.uri.match(/(jpeg|png|jpg)/g);
            setImageType(__image_type__[0]);
        }
    };

    const choosePhotoFromLibrary = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1
        });
        if (!result.cancelled) {
            setImage(result.uri);
            let __image_type__ = await result.uri.match(/(jpeg|png|jpg)/g);
            setImageType(__image_type__[0]);
        }
    };

    const addProduct = () => {
        if (
            name == undefined ||
            cost == undefined ||
            description == undefined ||
            image == undefined
        ) {
            ToastAndroid.show("Please fill out the form completely", ToastAndroid.SHORT);
            return;
        }
        if (name == "" || cost == "" || description == "" || image == "") {
            ToastAndroid.show("Please fill out the form completely", ToastAndroid.SHORT);
            return;
        }
        let form = new FormData();
        form.append("image", {
            name: "image",
            type: `image/${imageType}`,
            uri: image
        });
        form.append("name", name);
        form.append("cost", cost);
        form.append("category", category);
        form.append("userId", user_data._id);
        form.append("description", description);
        (async () => {
            const token = await AsyncStorage.getItem("jwt");
            const requestConfig = {
                headers: {
                    "Content-Type": `mutlipart/form-data; boundary=${form._boundary}`,
                    Authorization: `Bearer ${token}`
                }
            };
            try {
                let response = await axios.post(
                    `${REST_API_URL}/api/vendor/item`,
                    form,
                    requestConfig
                );
                response = response.data;
                if (response.success === true) {
                    ToastAndroid.show("Item added successfully", ToastAndroid.SHORT);
                    props.navigation.navigate("Home");
                } else {
                    ToastAndroid.show(response.message, ToastAndroid.SHORT);
                }
            } catch (error) {
                console.log("API call error", error);
            }
        })();
    };

    const renderInner = () => (
        <View style={styles.panel}>
            <View style={{ alignItems: "center" }}>
                <Text style={styles.panelTitle}>Upload Photo</Text>
                <Text style={styles.panelSubtitle}>
                    Choose a photo for your product!
                </Text>
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

    const bs = useRef();
    const fall = new Animated.Value(1);

    return (
        <View style = {styles.container}>
           <Container>
            <Header style={{ backgroundColor: "#ffff" }}>
                <Left>
                    <Button transparent>
                        <MaterialCommunityIcons name="arrow-left" size={25} />
                    </Button>
                </Left>
                <Body>
                    <Title style={{ color: "#000", fontWeight: "400" }}>Create Product</Title>
                </Body>
                <Right>
                    <Button transparent></Button>
                </Right>
            </Header>
            <Animated.View
                style={{
                    opacity: Animated.add(0.1, Animated.multiply(fall, 1.0))
                }}
            >
                <FormContainer>
                    <View style={styles.imageContainer}>
                        <Image style={styles.image} source={{ uri: image }} />
                        <TouchableOpacity
                            onPress={() => bs.current.snapTo(0)}
                            style={styles.imagePicker}
                        >
                            <Icon style={{ color: "white" }} name="camera" />
                        </TouchableOpacity>
                    </View>
                    <View style={[styles.label, { marginTop: 20 }]}>
                        <Text style={styles.textForm}>Name of the Product</Text>
                    </View>
                    <Input
                        style={styles.textInput}
                        placeholder="Name"
                        name="name"
                        id="name"
                        value={name}
                        onChangeText={(text) => setName(text)}
                    />
                    <View style={styles.label}>
                        <Text style={styles.textForm}>Price (INR)</Text>
                    </View>
                    <Input
                        placeholder="Price"
                        name="cost"
                        id="cost"
                        value={cost}
                        keyboardType={"numeric"}
                        onChangeText={(text) => setCost(text)}
                    />

                    <View style={styles.label}>
                        <Text style={styles.textForm}>Description (Short Desc)</Text>
                    </View>
                    <Input
                        placeholder="Description (50 words)"
                        name="description"
                        id="description"
                        value={description}
                        multiline={true}
                        numOfLine={2}
                        onChangeText={(text) => setDescription(text)}
                    />

                    <View style={styles.label}>
                        <Text style={styles.textForm}>Select Category Of The Product </Text>
                    </View>
                    <Item picker style={{ width: "80%" }}>
                        <Picker
                            // style={styles.textForm}
                            mode="dropdown"
                            iosIcon={<Icon color={"#F2789F"} name="arrow-down" />}
                            placeholder="Select your Category"
                            style={{ width: Platform.OS === "ios" ? undefined : 120 }}
                            selectedValue={pickerValue}
                            onValueChange={(e) => [setPickerValue(e), setCategory(e)]}
                            // style={{height: 40 }}
                        >
        
                            {categories.map((c) => {
                                return <Picker.Item style={styles.textForm} key={c._id} label={c.name} value={c.name} />;
                            })}
              
                        </Picker>
                    </Item>
                    <TouchableOpacity
                        onPress={addProduct}
                        style={[styles.confirmButton, { marginTop: 20 }]}
                    >
                        <Text style={styles.confirmText}>CONFIRM</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {}}
                        style={[
                            styles.cancelButton,
                            // cancel button background color
                            { backgroundColor: customColor.white2, marginBottom: 80 }
                        ]}
                    >
                        <Text style={styles.cancelText}>CANCEL</Text>
                    </TouchableOpacity>
                </FormContainer>
            </Animated.View>
            <BottomSheet
                ref={bs}
                snapPoints={[330, 0]}
                renderContent={renderInner}
                renderHeader={renderHeader}
                initialSnap={1}
                callbackNode={fall}
                enabledGestureInteraction={true}
            />
        </Container>
        </View>
        
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    label: {
        width: "80%",
        marginTop: 10
    },
    textForm: {
        color: "#505462",
    },
    confirmButton: {
        width: "85%",
        marginTop: 10,
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
    cancelButton: {
        width: "85%",
        marginTop: 10,
        padding: 15,
        alignItems: "center",
        textAlign: "center",
        borderRadius: 10,
        borderColor: 'white',
        borderWidth: 1,
        //confirm button color
        backgroundColor: customColor.white2,
        elevation: 5
    },
    confirmText: {
        color: "white",
        fontWeight: "bold"
    },
    cancelText: {
        color: customColor.grey2,
        // fontWeight: "bold"
    },
    imageContainer: {
        width: 300,
        height: 200,
        borderStyle: "solid",
        borderWidth: 1,
        padding: 0,
        justifyContent: "center",
        borderRadius: 10,
        borderColor: "#ffff",
        elevation: 5
    },
    image: {
        width: "100%",
        height: "100%",
        borderRadius: 10
    },
    imagePicker: {
        position: "absolute",
        right: 5,
        bottom: 5,
        backgroundColor: customColor.light,
        padding: 8,
        borderRadius: 100,
        elevation: 20
    },
    commandButton: {
        padding: 15,
        borderRadius: 10,
        backgroundColor: "#FF9292",
        alignItems: "center",
        marginTop: 10
    },
    panel: {
        padding: 20,
        // backgroundColor: "#FFFFFF",
        backgroundColor: customColor.white2,
        paddingTop: 18
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
        borderBottomColor: "orange",
        paddingBottom: 5
    },
    actionError: {
        flexDirection: "row",
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: "orange",
        paddingBottom: 5
    }
});
