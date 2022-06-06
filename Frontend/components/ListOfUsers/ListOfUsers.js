import axios from "axios";
import { Header, Text, Item, Input, Icon } from "native-base";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Dimensions,
    RefreshControl,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    View
} from "react-native";
import { REST_API_URL } from "../../constants/URLs";
import UserCard from "./UserCard";

export default function ListOfUsers({ navigation }) {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState();
    const [focus, setFocus] = useState();
    const [refreshing, setRefreshing] = useState(false);

    
    //modification 
    const [vendors , setVendor] = useState("") ; 
    const [newUser , setNewUsers] = useState([]) ; 
    const [placeHolder , setPlaceHolder] = useState("") ; 
    const placeHolderText = ["Phone" , "Email"] ;

    const { height } = Dimensions.get("screen");

    useEffect(() => {
        const fetchAPI = async () => {
            setIsLoading(true);
            let res = await axios.get(`${REST_API_URL}/api/index/vendors`);
            if (res.data.success === true) {
                setUsers(res.data.vendors);
            } else {
                throw new Error(res.data.message);
            }
            setIsLoading(false);
        };

        fetchAPI();
        setIsLoading(false);
        setFocus(false) ;

    }, []);

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        (async () => {
            setIsLoading(true);
            let res = await axios.get(`${REST_API_URL}/api/index/vendors`);
            if (res.data.success === true) {
                setUsers(res.data.vendors);
            } else {
                throw new Error(res.data.message);
            }
            setIsLoading(false);
            setRefreshing(false);
        })();
    }, []);


    const searchClick = () => {
         
    }

    const openList = () => {
        setFocus(true);
    };

    const onBlur = () => {
        setFocus(false);
    };


    return (
        <SafeAreaView>
            <Header searchBar rounded style={{ backgroundColor: "#F8F8F8" }}>
                <Item style={{ backgroundColor: "#E8E8E8", borderRadius: 20 }}>
                    <Icon name="ios-search" onPress={searchClick}/>
                    <Input
                      
                        style = {[{fontSize:13}]}
                        onFocus={openList}
                        placeholder="Search Vendors By City, Area, Name, Contact..."
                        onChangeText={(text) => setVendor(text)} 
                    />
                </Item>
            </Header>
            {!isLoading ? (
                <ScrollView
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                    containerStyle={{ padding: 0 }}
                >
                    {users.map((u, i) => {

                        if (vendors == "") 
                          return <UserCard key={i} user={u} navigation={navigation} />;
                        else {

                          if (u.city.toLocaleLowerCase().includes(vendors.toLocaleLowerCase()) ||
                             
                              u.locality.toLocaleLowerCase().includes(vendors.toLocaleLowerCase()) ||

                              u.name.toLocaleLowerCase().includes(vendors.toLocaleLowerCase()) || 

                              u.contact.toLocaleLowerCase().includes(vendors.toLocaleLowerCase())
                          
                          ) 
                          return <UserCard key={i} user={u} navigation={navigation} />;

                        }
                    })}

                </ScrollView>
            ) : (
                <SafeAreaView>
                    <View style={{ alignSelf: "center", marginTop: height / 3 }}>
                        {/* change the color of loading bar in the vendors list */}
                        <ActivityIndicator style={{ margin: 10 }} size="large" color="orange" />
                        <Text note>Loading Vendors....</Text>
                    </View>
                </SafeAreaView>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({});
