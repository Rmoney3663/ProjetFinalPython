import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, Image, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Formik } from 'formik';
import * as yup from 'yup';
import logo from '../assets/logoPG.png';
import anonyme from '../assets/anonyme.png';
import { useNavigate, useLocation } from "react-router-dom";
import NavigationBar from './NavigationBar';
import Login from './Login';

async function getJson(url, obj, message, setEnChargement, setFlash, setEtat){
    try
    {
        setEnChargement(true)
        setFlash('')
        setEtat('')
        let reponse = await fetch(url, obj);
        let reponseJson = await reponse.json();
        setEnChargement(false)

        if (reponseJson.erreur === undefined)
        {
			setEtat(reponseJson)
            setFlash(message)
        }
        else
            setFlash(reponseJson.erreur)
        return (reponseJson);        
    } catch(erreur){
        console.error(erreur);
    }
}

const validationSchema = yup.object().shape({
    publication: yup
        .string()
        .required('Veuillez remplire la publication.')
        .label('publication'),    
});

const Index = () => {
	const location = useLocation();
	const navigate = useNavigate();
    const [flash, setFlash] = useState('');
    const [jeton, setJeton] = useState(location.state?.jeton || '');
    const [utilisateur, setUtilisateur] = useState(location.state?.utilisateur || null);
    const [enChargement, setEnChargement] = useState(false);
	console.log(location);


    useEffect(() => {
        if (jeton === '' || utilisateur === null) {
            navigate("/Login");
        }
    });

    
    const quitterSession = () => {
        alert('quitter session');
        setJeton('');
        setUtilisateur(null);
        setFlash('');
    };


    if (utilisateur !== null) {        
        return (
            <View style={styles.container}>
                <Image source={logo} style={styles.logo} />
                <Image source={utilisateur.avatar} style={styles.avatar} />
                <Text style={styles.flash}>Flash: {flash}</Text>
                <Text style={styles.flash}>Utilisateur: {utilisateur.nom}</Text>
                <Text style={styles.jeton}>Jeton: {jeton}</Text>
                <TouchableOpacity style={styles.loginBtn} onPress={quitterSession}>
                    <Text style={styles.loginText}>Quitter la session</Text>
                </TouchableOpacity>
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
export default Index;
