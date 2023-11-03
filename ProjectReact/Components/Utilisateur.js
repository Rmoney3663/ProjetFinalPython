import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, Image, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Formik } from 'formik';
import * as yup from 'yup';
import logo from '../assets/logoPG.png';
import anonyme from '../assets/anonyme.png';
import { useNavigate, useParams } from "react-router-dom";
import NavigationBar from './NavigationBar';
import { useAppContext  } from './AppContext';



const Utilisateur = () => {
	const { userId } = useParams();
	const navigate = useNavigate();
	const [flash, setFlash] = useState('');
	const {jeton, setJeton, utilisateur, setUtilisateur} = useAppContext();
	const [publication, setPublication] = useState(null);
	const [enChargement, setEnChargement] = useState(false);

 	

    useEffect(() => {
		const savedJeton = localStorage.getItem('jeton');
		const savedUtilisateur = JSON.parse(localStorage.getItem('utilisateur'));
		console.log('savedJeton ' + savedJeton);
  		console.log('savedUtilisateur ' + savedUtilisateur);
		console.log('Og Jeton ' + jeton);
	  	console.log('Og utilisateur ' + utilisateur);
		if (savedJeton && jeton == '') {			
		  	setJeton(savedJeton);
			console.log('Jeton ' + jeton);
		}

		if (savedUtilisateur && utilisateur == null)  {
		  	setUtilisateur(savedUtilisateur);
			console.log('utilisateur ' + utilisateur);
		}
		  	
        if (savedJeton === '' || savedUtilisateur === null) {
			
            navigate("/Login");
        }
    });

	if (utilisateur !== null) {
  		return (
		
	 		<View style={styles.container}>		
				<NavigationBar userId={utilisateur.id} />           
		        <Text style={styles.flash}>userId: {userId}</Text>
		        <Text style={styles.flash}>jeton: {jeton}</Text>
				<Text style={styles.flash}>utilisateur: {utilisateur.nom}</Text>
		    </View>
		
       
    	);
	}
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
    logo:{
        width:600,
        height:200,
        margin:50
    }, 
    avatar:{
        width:256,
        height:256,
        margin:50
    },
    inputView:{
        width:'80%',
        backgroundColor:'#00a0d3',
        borderRadius:25,
        height:80,
        marginBottom:20,
        justifyContent:'center',
        padding:20
    },
    inputText:{
        height:50,
        color:'white',
        fontSize:50
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
        fontSize:50,
        color:'white'
    },
    erreur:{
        fontSize:50,
        color:'red'
    },
    flash:{
        fontSize:50,
        color:'black'
    },
    jeton:{
        fontSize:30,
        color:'black'
    },


});
export default Utilisateur;

