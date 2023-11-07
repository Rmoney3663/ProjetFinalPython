import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, Image, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Formik } from 'formik';
import * as yup from 'yup';
import logo from '../assets/logoPG.png';
import anonyme from '../assets/anonyme.png';
import { useNavigate, useParams } from "react-router-dom";
import NavigationBar from './NavigationBar';
import { useAppContext  } from './AppContext';

async function getJson(url, obj, message, setEnChargement, setFlash, setEtat, navigate) {
	let reponseJson; 
	try {
		setEnChargement(true);
		setFlash('');
		let reponse = await fetch(url, obj);
		if (reponse.status === 404) {
		  navigate("./NotFound"); 
		} else if (!reponse.ok) {
		  throw new Error('Network response was not ok');
		} else {
		  let reponseJson = await reponse.json();
		  setEnChargement(false);

		  if (reponseJson.erreur === undefined) {
			setEtat(reponseJson);
			setFlash(message);
			console.log(reponseJson);
		  } else {
			setFlash(reponseJson.erreur);
		  }
		}
		return reponseJson;
	} catch (erreur) {
	console.error(erreur);
	}
}


async function getUser(url, obj, message, setEnChargement, setFlash, chargerUtilisateurLog, chargerUtilisateur){
	try
	{
	    setEnChargement(true)
	    setFlash('')
	    let reponse = await fetch(url, obj);
	    setEnChargement(false)

	    if (reponse.status === 204)
	    {
			chargerUtilisateurLog();
			chargerUtilisateur();
	        setFlash(message)
			
	    }
	    else
	        setFlash("fail to follow")
	    return ;        
	} catch(erreur){
	    console.error(erreur);
	}        
}

const Utilisateur = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const [flash, setFlash] = useState('');
	const {jeton, setJeton, utilisateur, setUtilisateur} = useAppContext();
	const [publication, setPublication] = useState(null);
	const [enChargement, setEnChargement] = useState(false);
	const [user, setUser] = useState(null);
 	

    useEffect(() => {
		const savedJeton = localStorage.getItem('jeton');
		const savedUtilisateur = JSON.parse(localStorage.getItem('utilisateur'));
		if (savedJeton && jeton == '') {			
		  	setJeton(savedJeton);
		}

		if (savedUtilisateur && utilisateur == null)  {
		  	setUtilisateur(savedUtilisateur);			
		}
		  	
        if (savedJeton === '' || savedUtilisateur === null || id === null) {
			
            navigate("/");
        }
		console.log(savedUtilisateur.id)
		console.log(id)

		if (user === null && jeton != ''){
			chargerUtilisateur();
		}
    });

	const chargerUtilisateur = () => {
		console.log(jeton);
        const url = "http://127.0.0.1:5000/api/utilisateurs/" + id;
        const obj = {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
 				'Authorization': 'Bearer ' + jeton,
            },
        };
        getJson(url, obj, 'Utilisateur chargé.', setEnChargement, setFlash, setUser, navigate);
        
    };

	const chargerUtilisateurLog = () => {
		console.log(jeton);
        const url = "http://127.0.0.1:5000/api/utilisateurs/" + utilisateur.id;
        const obj = {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
 				'Authorization': 'Bearer ' + jeton,
            },
        };
        getJson(url, obj, 'Utilisateur chargé.', setEnChargement, setFlash, setUtilisateur);
        
    };


 	const modifier = () => {        
        navigate("/");
    };

	const suivre = () => {        
        const url = "http://127.0.0.1:5000/api/suivre/" + id;
        const obj = {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
 				'Authorization': 'Bearer ' + jeton,
            }
			
        };
        getUser(url, obj, 'Vous le suivez maintenant', setEnChargement, setFlash, chargerUtilisateurLog, chargerUtilisateur);
		
    };

	const nosuivre = () => {        
        const url = "http://127.0.0.1:5000/api/ne_plus_suivre/" + id;
        const obj = {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
 				'Authorization': 'Bearer ' + jeton,
            },
        };
	getUser(url, obj, 'Vous ne le suivez plus', setEnChargement, setFlash, chargerUtilisateurLog, chargerUtilisateur);
       
        
    };

	if (utilisateur !== null && id !== null) {
		if (id == utilisateur.id ){
			return (		
		 		<View style={styles.container}>	
					<NavigationBar userId={utilisateur.id} />           
					<Text style={styles.flash}>Flash: {flash}</Text>
	 				<Text style={styles.flash}>Je suis {utilisateur.nom}</Text>
					<Text style={styles.flash}>Dernier acces: {utilisateur.dernier_acces}</Text>
					<Text style={styles.flash}>je suis partisan de {utilisateur.les_partisans.length} utilisateur(s), 
					Je suis suivi par {utilisateur.partisans.length} utilisateur(s)</Text>
					<TouchableOpacity style={styles.loginBtn} onPress={modifier}>
		                <Text style={styles.loginText}>Modifier votre profil</Text>
		            </TouchableOpacity>
					<Text style={styles.title}>Utilisateur: {utilisateur.nom}</Text>
					<Image source={utilisateur.avatar} style={styles.avatar} />
				</View>	
			);
		}
		else if (user !== null){
			return (		
		 		<View style={styles.container}>	
					<NavigationBar userId={utilisateur.id} />           
					<Text style={styles.flash}>Flash: {flash}</Text>
	 				<Text style={styles.flash}>Je suis {user.nom}</Text>
					<Text style={styles.flash}>Dernier acces: {user.dernier_acces}</Text>
					<Text style={styles.flash}>je suis partisan de {user.les_partisans.length} utilisateur(s), 
					Je suis suivi par {user.partisans.length} utilisateur(s)</Text>
					
					<TouchableOpacity style={styles.loginBtn} onPress={(user.partisans.indexOf(utilisateur.id) != -1) ? nosuivre : suivre}>
	                	<Text style={styles.loginText}>
							{(user.partisans.indexOf(utilisateur.id) != -1) ? "Ne plus suivre" : "Suivre"}
						</Text>
	            	</TouchableOpacity>

					<Text style={styles.title}>Utilisateur: {user.nom}</Text>
					<Image source={user.avatar} style={styles.avatar} />
				</View>	
			);			
		}  		
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
export default Utilisateur;

