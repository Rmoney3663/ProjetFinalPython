import React from 'react';
import { StyleSheet, Text, View, Button, Image, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigate } from "react-router-dom";
import NavigationBar from './NavigationBar';

const NotFound = () => {
	const navigate = useNavigate();
	const mainpage = () => {        
        navigate("/");
    };

	return (
		<View style={styles.container}>	
			<Text style={styles.flash}>404 - Not Found</Text>
			<Text style={styles.loginText}>Fichier introuvable</Text>
			<TouchableOpacity style={styles.loginBtn} onPress={mainpage}>
				<Text style={styles.loginText}>Retour</Text>
			</TouchableOpacity>
		</View>
	);
};
const styles = StyleSheet.create({    
	container:{
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'#6e4256',
        margin:10,
        width:1080,
        height:1920
    },
    loginBtn:{
        width:'80%',
        backgroundColor:'#00a0d3',
        borderRadius:25,
        height:80,
        alignItems:'center',
        justifyContent:'center',
        marginTop:40,
        marginBottom:10
    },
    loginText:{
        fontSize:70,
        color:'white'
    },
    flash:{
        fontSize:80,
        color:'red'
    },


});
export default NotFound;

