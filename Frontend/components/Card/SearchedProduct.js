import React from "react";
import { View, StyleSheet, Dimensions, ScrollView } from "react-native";
import { Left, Body, ListItem, Thumbnail, Text } from "native-base";
import { Avatar } from "react-native-elements";

const { width } = Dimensions.get("window");

const SearchedProduct = (props) => {
    const { productsFiltered } = props;
    return (
        <ScrollView style={{ width: width }}>
            {productsFiltered.length > 0 ? (
                productsFiltered.map((item) => (
                    <ListItem
                        onPress={() => {
                            props.navigation.navigate("Product Details", { item: item });
                        }}
                        key={item.name}
                        avatar
                    >
                        <Left>
                        <Avatar
                            rounded
                            size={50}
                            containerStyle={{ elevation: 20 }}
                             source={{
                             uri: item.imageUrl
                              }}
                         />
                        </Left>
                        <Body>
                            <Text>{item.name}</Text>
                            <Text note>{item.seller.name}</Text>
                        </Body>
                    </ListItem>
                ))
            ) : (
                <View style={styles.center}>
                    <Text style={{ alignSelf: "center" }}>
                        No products match the selected criteria
                    </Text>
                </View>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    center: {
        justifyContent: "center",
        alignItems: "center",
        height: 100
    }
});

export default SearchedProduct;
