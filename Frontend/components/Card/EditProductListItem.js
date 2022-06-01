import React, { Fragment, useEffect, useState, TouchableOpacity } from "react";
import { StyleSheet,Dimensions,ScrollView } from "react-native";
import { Avatar, ListItem , View, Text} from "react-native-elements";
import StarRating from "./StarRating";
import Icon from "react-native-vector-icons/MaterialIcons";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
const customColors = require("../../constants/Color");
const { height, width } = Dimensions.get("window");

export default function EditProductListItem(props) {
    const { item, categories } = props;
    const [product, setProducts] = useState(item);
    const [vendorProducts, setVendorProducts] = useState([]);

    useEffect(() => {
        const cId = categories.filter((c) => c._id === item.category);
        // console.log(cId[0].name);

        const waitFunc = async () => {
            await setProducts({
                ...product,
                category: cId[0].name,
                description:
                    item.description.length > 20
                        ? item.description.substring(0, 20) + "..."
                        : item.description
            });
        };

        waitFunc();
        console.log(product) ;

    }, []);

    const funciton = () => console.log(working) ; 

    
    const editProfileHandler = () => {
        console.log(product._id) ;    
          
    }

    return ( 
       
         <Fragment> 
            <ListItem style={styles.container} containerStyle={{ borderRadius: 20 }}>
                <Avatar
                    size={70}
                    source={{ uri: product.imageUrl }}
                />
                <ListItem.Content >
                    <ListItem.Title numberOfLines={1} style={{ fontWeight: "bold" }}>{product.name}</ListItem.Title>
                    <ListItem.Subtitle numberOfLines={1}>{product.description}</ListItem.Subtitle>
                    {/* <StarRating ratings={3} reviews={99} /> */}
                </ListItem.Content>
                <ListItem.Content style={{marginRight: 0}}>

                   {/* <View style={styles.mapSticker}>
                        <Icon size={30} name="location-pin" />
                        <Text style={{ fontSize: 10 }} onPress = {editProfileHandler}>Edit Product</Text>
                        
                    </View> */}
                <MaterialCommunityIcons style={{marginLeft: 60}}name="circle-edit-outline" size={30} color="black" />
                {/* <Feather name="edit" size={24} color="black" /> */}
                {/* <Icon size={30} name="" /> */}
                <Text style={{ fontSize: 12, marginLeft: 60,  marginTop: 10 }} onPress = {editProfileHandler}>Edit</Text>
                {/* <View style={styles.imageTextConatiner2}>
                    <TouchableOpacity style={styles.mapSticker}>
                        <Icon size={30} name="location-pin" />
                        <Text style={{ fontSize: 10 }} onPress = {editProfileHandler}>Edit Product</Text>
                        
                    </TouchableOpacity>
                </View> */}
                    {/* <ListItem.Title style={{ fontWeight: "bold" }}>
                        <ListItem.Subtitle style={{ fontSize: 10 }}>Price : </ListItem.Subtitle>₹{" "}
                        {product.cost}
                    </ListItem.Title> */}
                    {/* <ListItem.Subtitle>{product.category} Item</ListItem.Subtitle> */}
                    {/* <ListItem.Subtitle style={{ fontSize: 10 }}>
                        Given price is the price per unit item.{" "}
                    </ListItem.Subtitle>     */}
                </ListItem.Content>
            </ListItem>
        </Fragment>
    

    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 10
    },

});
