import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, Image, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Formik } from 'formik';
import * as yup from 'yup';
import logo from '../assets/logoPG.png';
import anonyme from '../assets/anonyme.png';
import { useNavigate, useParams } from "react-router-dom";
import NavigationBar from './NavigationBar';
import { useAppContext  } from './AppContext';

async function getJson(url, obj, message, setEnChargement, setFlash, setEtat){
    try
    {
        setEnChargement(true)
        setFlash('')
        let reponse = await fetch(url, obj);
        let reponseJson = await reponse.json();
        setEnChargement(false)

        if (reponseJson.erreur === undefined)
        {
			setEtat(reponseJson)
            setFlash(message)
			console.log(reponseJson)
        }
        else
            setFlash(reponseJson.erreur)
        return (reponseJson);        
    } catch(erreur){
        console.error(erreur);
    }
}

const Explorer = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const [flash, setFlash] = useState('');
	const {jeton, setJeton, utilisateur, setUtilisateur} = useAppContext();
	const [publication, setPublication] = useState(null);
	const [enChargement, setEnChargement] = useState(false);
	const [user, setUser] = useState(null);
    const [nextPage, setNextPage] = useState(null);
    const [prevPage, setPrevPage] = useState(null);
    
    useEffect(() => {
        if(publication === null && jeton !== ''){
            chargerPublication()
        }
        else{
            console.log(utilisateur)
            console.log(id)
            console.log(publication.items)
        }

        if(user === null && jeton !== ''){
            console.log(user)
            //chargerUtilisateur()
            chargerToutLesUtilisateurs()
        }
        else{
            console.log(user)
        }
    });

    const chargerPublication = () => {
        alert("charger publication");
        const url = "http://127.0.0.1:5000/api/publications";
        const obj = {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
 				'Authorization': 'Bearer ' + jeton,
            },
        };
        getJson(url, obj, 'Publication chargé.', setEnChargement, setFlash, setPublication);
        
    };
    const chargerToutLesUtilisateurs = () => {
		console.log(jeton);
        const url = "http://127.0.0.1:5000/api/utilisateurs";
        const obj = {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
 				'Authorization': 'Bearer ' + jeton,
            },
        };
        getJson(url, obj, 'Tout les utilisateurs sont chargés.', setEnChargement, setFlash, setUser);
        
    };
    if(publication != null){
        return (		
            <View style={styles.container}>	
            <Text style={styles.title}>Bonjour, {utilisateur.nom}!</Text>
            <Image source={utilisateur.avatar} style={styles.avatar} /> 
            {publication.items.map(publications => (
            <li key={publications.id}>
                <div>
                <Image source={utilisateur.avatar} style={styles.avatarSuiveur} />         
                <Text style={styles.flash} key={publications.id}>{publications.corps}</Text>
                </div>
            </li>
            
          ))} 
          
            </View>	
       );
    }
	
};

const styles = StyleSheet.create({
    container:{
        justifyContent:'top',
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
        width:400,
        height:400,
        margin:50
    },
    avatarSuiveur:{
        width:100,
        height:100,
        margin:0
    },
    inputView:{
        width:'80%',
        backgroundColor:'#00a0d3',
        borderRadius:25,
        height:80,
        marginBottom:20,
        justifyContent:'center',
        padding:20,
 		marginTop:20,
    },
	textarea:{
        width:'80%',
        backgroundColor:'#00a0d3',
        borderRadius:25,
        height:80,
        marginBottom:20,
        justifyContent:'center',
        padding:20,
 		marginTop:20,
	  	height:50,
        color:'white',
        fontSize:50
    },
    inputText:{
        height:50,
        color:'white',
        fontSize:50
    },
    quitterBtn:{
        width:'80%',
        backgroundColor:'#00a0d3',
        borderRadius:25,
        height:80,
        alignItems:'center',
        justifyContent:'center',
        marginTop:0,
        marginBottom:150
    },
    loginText:{
        fontSize:50,
        color:'white'
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
    erreur:{
        fontSize:50,
        color:'red'
    },
    flash:{
        fontSize:35,
        color:'black'
    },
	text:{
        fontSize:50,
        color:'black'
    },
    jeton:{
        fontSize:30,
        color:'black'
    },
	title:{
        fontSize:80,
        color:'black'
    },


});
export default Explorer;

