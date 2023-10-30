import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, Image, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Formik } from 'formik';
import * as yup from 'yup';
import logo from '../assets/logoPG.png';
import anonyme from '../assets/anonyme.png';
import { useNavigate } from "react-router-dom";

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
    nom: yup
        .string()
        .required('Veuillez entrer votre nom.')
        .label('Nom'),
    mdp: yup
        .string()
        .required('Veuillez entrer votre mot de passe.')
        .label('Nom'),
});

const Login = () => {
	const navigate = useNavigate();
    const [flash, setFlash] = useState('');
    const [jeton, setJeton] = useState('');
    const [utilisateur, setUtilisateur] = useState(null);
    const [enChargement, setEnChargement] = useState(false);

    useEffect(() => {
        if (jeton !== '') {
            chargerUtilisateur();
        }
    }, [jeton]);

    const demarrerSession = (valeurs) => {
        const nom_mdp = valeurs["nom"] + ':' + valeurs["mdp"];
        const nom_mdp_base64 = btoa(nom_mdp);

        const url = 'http://127.0.0.1:5000/api/jeton';
        const obj = {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + nom_mdp_base64,
            },
        };

        alert(nom_mdp);
        getJson(url, obj, 'Utilisateur et mot de passe chargé.', setEnChargement, setFlash, setJeton);
    };

    const quitterSession = () => {
        alert('quitter session');
        setJeton('');
        setUtilisateur(null);
        setFlash('');
    };

    const ajouter = () => {        
        navigate("/Ajouter");
    };

    const chargerUtilisateur = () => {
        if (jeton !== '' && utilisateur === null) {
            alert("charger utilisateur");
            const url = "http://127.0.0.1:5000/api/jeton_user/" + jeton;
            const obj = {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + jeton,
                },
            };
            getJson(url, obj, 'Utilisateur chargé.', setEnChargement, setFlash, setUtilisateur);
        }
    };

    if (utilisateur === null) {
        return (
            <View style={styles.container}>
                <Image source={logo} style={styles.logo} />
                <Image source={anonyme} style={styles.avatar} />
                <Text style={styles.flash}>Flash: {flash}</Text>
                

                <Formik
                    initialValues={{ nom: '', mdp: '' }}

                    onSubmit={(values, actions) => {
                        demarrerSession(values);
                    }}

                    validationSchema={validationSchema}
                >
                    {formikProps => (
                        <React.Fragment>
                            <View style={styles.inputView}>
                                <TextInput
                                    style={styles.inputText}
                                    placeholder="Utilisateur..."
                                    placeholderTextColor="#bbbbbb"
                                    onChangeText={formikProps.handleChange('nom')}
                                />
                            </View>
                            <Text style={styles.erreur}>{formikProps.errors.nom}</Text>

                            <View style={styles.inputView}>
                                <TextInput
                                    secureTextEntry={true}
                                    style={styles.inputText}
                                    placeholder="Mot de passe..."
                                    placeholderTextColor="#bbbbbb"
                                    onChangeText={formikProps.handleChange('mdp')}
                                />
                            </View>
                            <Text style={styles.erreur}>{formikProps.errors.mdp}</Text>

                            <TouchableOpacity style={styles.loginBtn} onPress={ajouter}>
                                <Text style={styles.loginText}>Nouvel utilisateur</Text>
                            </TouchableOpacity>

                            {enChargement ? (<ActivityIndicator />) : (
                                <TouchableOpacity style={styles.loginBtn} onPress={formikProps.handleSubmit}>
                                    <Text style={styles.loginText}>Établir une session</Text>
                                </TouchableOpacity>
                            )}
                        </React.Fragment>
                    )}
                </Formik>
            </View>
        );
    } else {
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
export default Login;

