import { Body, Button, Header, Left, Right } from "native-base";
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { View, SafeAreaView, StyleSheet, ScrollView } from "react-native";
import { Avatar, Title, Caption, Text, TouchableRipple } from "react-native-paper";

import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import { logoutUser } from "../../redux/actions/AuthAction";
import axios from "axios";
import { REST_API_URL } from "../../constants/URLs";

const ProfileScreen = ({ navigation }) => {
    const user_data = useSelector((state) => state.user_data);
    const dispatch = useDispatch();
    const token = useSelector((state) => state.token);
    const [isLoggedIn, setIsLoggedIn] = useState(true);
    const [image, setImage] = useState(
        "https://drive.google.com/uc?id=18CXkz-Lqgi04iiL9jV3CtRuoYg6lb3RV"
    );

    const [name, setName] = useState("Name");
    const [contact, setContact] = useState(""); 
    const [user, setUser] = useState();

    // modification 
    const [city, setCity] = useState("");
    const [locality, setLocality] = useState("");
    

    useEffect(() => {

        if (user_data.imageUrl != undefined) {
            setImage(user_data.imageUrl);
        }
        if (user_data.contact != undefined) {
            setContact(user_data.contact);
        }
        if (user_data.name != undefined) {
            setName(user_data.name);
        }

        // modification 
        // if (!token.isVendor && user_data.address.city != undefined) {
        //     setCity(user_data.address.city);
        // }

        // if (!token.isVendor && user_data.address.country != undefined) {
        //     setCountry(user_data.address.country);
        // }

        if (user_data.city != undefined ) {
              setCity(user_data.city) ; 
        }

        if (user_data.locality != undefined ) {
            setLocality(user_data.locality) ; 
        }

        const fetchAPI = async () => {
            if (token.isVendor) {
                let res = await axios.get(`${REST_API_URL}/api/index/vendor/${user_data._id}`);
                if (res.data.success === true) {
                    let vendor = { ...res.data.vendor, products: res.data.items };
                    setUser(vendor);
                } else {
                    throw new Error(res.data.message);
                }
            }
        };

        fetchAPI();

    }, [user_data]);
    const handleLogout = () => {
        setIsLoggedIn(false);
        logoutUser(dispatch);
        navigation.navigate("LoginScreen");
    };
    return (
        <SafeAreaView style={styles.container}>
            <Header style={{ backgroundColor: "#fff" }}>
                <Left>
                    <Button transparent onPress={() => navigation.goBack()}>
                        <Icon name="arrow-left" size={25} />
                    </Button>
                </Left>
                <Body>
                    <Title>Profile</Title>
                </Body>
                <Right>
                    <Button transparent></Button>
                </Right>
            </Header>
            <ScrollView>
                <View style={styles.userInfoSection}>
                    <View style={{ flexDirection: "row", marginTop: 15 }}>
                        <Avatar.Image
                            source={{
                                uri: image
                            }}
                            size={80}
                        />
                        <View style={{ marginLeft: 20 }}>
                            <Title
                                style={[
                                    styles.title,
                                    {
                                        marginTop: 15,
                                        marginBottom: 5
                                    }
                                ]}
                            >
                                {name}
                            </Title>
                            <Caption style={styles.caption}>@{name}</Caption>
                        </View>
                    </View>
                </View>

                <View style={styles.userInfoSection}>

                   {/* { !token.isVendor && (
                        <View style={styles.row}>
                            <Icon name="map-marker-radius" color="#777777" size={20} />
                            <Text style={{ color: "#777777", marginLeft: 20 }}>{city} , {country}</Text>
                        </View>
                    ) } */}

                        <View style={styles.row}>
                            <Icon name="map-marker-radius" color="#000" size={20} />
                            <Text style={{ color: "#777777", marginLeft: 20 }}> {locality} , {city} </Text>
                        </View>
                    
                    <View style={styles.row}>
                        <Icon name="phone" color="#000" size={20} />
                        <Text style={{ color: "#777777", marginLeft: 20 }}>{contact}</Text>
                    </View>
                    {/* <View style={styles.row}>
                        <Icon name="email" color="#777777" size={20} />
                        <Text style={{ color: "#777777", marginLeft: 20 }}>
                            {isLoggedIn ? user_data.email : ""}
                        </Text>
                    </View> */}
                </View>
                <View
                    style={{
                        borderBottomColor: "#D3D3D3",
                        borderBottomWidth: 1
                    }}
                />
                <View style={styles.menuWrapper}>
                    {!token.isVendor && (
                        <TouchableRipple onPress={() => {}}>
                            <View style={styles.menuItem}>
                                <Icon name="heart-outline" color="#000" size={25} />
                                <Text style={styles.menuItemText}>Your Favorites</Text>
                            </View>
                        </TouchableRipple>
                    )}

                    {token.isVendor && (
                        <TouchableRipple
                            onPress={() => {
                                navigation.navigate("Vendor Products", {
                                    user: user,
                                    navigation: navigation
                                });
                            }}
                        >
                            <View style={styles.menuItem}>
                                <Icon name="cart" color="#000" size={25} />
                                <Text style={styles.menuItemText}>Your Products</Text>
                            </View>
                        </TouchableRipple>
                    )}

                    {token.isVendor && (
                        <TouchableRipple
                            onPress={() => {
                                navigation.navigate("Edit Product", {
                                    user: user,
                                    navigation: navigation
                                });
                            }}
                        >
                            <View style={styles.menuItem}>
                                <Icon name="circle-edit-outline" color="#000" size={25} />
                                <Text style={styles.menuItemText}>Edit Products</Text>
                            </View>
                        </TouchableRipple>
                    )}


                    <TouchableRipple>
                        <View style={styles.menuItem}>
                            <Icon name="share-outline" color="#000" size={25} />
                            <Text style={styles.menuItemText}>Tell Your Friends</Text>
                        </View>
                    </TouchableRipple>
                    <TouchableRipple onPress={() => {}}>
                        <View style={styles.menuItem}>
                            <Icon name="account-check-outline" color="#000" size={25} />
                            <Text style={styles.menuItemText}>Support</Text>
                        </View>
                    </TouchableRipple>
                    <TouchableRipple
                        onPress={() => {
                            navigation.navigate("Edit Profile");
                        }}
                    >
                        <View style={styles.menuItem}>
                            <Icon name="cog-outline" color="#000" size={25} />
                            <Text style={styles.menuItemText}>Settings</Text>
                        </View>
                    </TouchableRipple>
                    <TouchableRipple onPress={handleLogout}>
                        <View style={styles.menuItem}>
                            <Icon name="logout" color="#000" size={25} />
                            <Text style={styles.menuItemText}>Logout</Text>
                        </View>
                    </TouchableRipple>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default ProfileScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    userInfoSection: {
        paddingHorizontal: 30,
        marginBottom: 25
    },
    title: {
        fontSize: 24,
        fontWeight: "bold"
    },
    caption: {
        fontSize: 14,
        lineHeight: 14,
        fontWeight: "500"
    },
    row: {
        flexDirection: "row",
        marginBottom: 10
    },
    infoBoxWrapper: {
        borderBottomColor: "#dddddd",
        borderBottomWidth: 1,
        borderTopColor: "#dddddd",
        borderTopWidth: 1,
        flexDirection: "row",
        height: 100
    },
    infoBox: {
        width: "50%",
        alignItems: "center",
        justifyContent: "center"
    },
    menuWrapper: {
        marginTop: 10
    },
    menuItem: {
        flexDirection: "row",
        paddingVertical: 15,
        paddingHorizontal: 30
    },
    menuItemText: {
        color: "#777777",
        marginLeft: 20,
        fontWeight: "600",
        fontSize: 16,
        lineHeight: 26
    }
});
