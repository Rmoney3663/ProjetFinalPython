import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, Image, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Formik } from 'formik';
import * as yup from 'yup';
import anonyme from '../assets/anonyme.png';
import { useNavigate } from "react-router-dom";

const validationSchema = yup.object().shape({
    nom: yup
        .string()
        .required('Veuillez entrer votre nom.')
        .label('Nom'),
    courriel: yup
        .string()
        .required('Veuillez entrer votre courriel.')
        .label('Courriel'),
    mdp1: yup
        .string()
        .required('Veuillez entrer votre mot de passe.')
        .label('Mot de Passe'),
    mdp2: yup
        .string()
        .required('Veuillez retapper votre mot de passe.')
		.test('passwords-match', 'Les mots de passe ne correspondent pas', function (value) {
            return value === this.parent.mdp1;
        }),
});


async function getJson(url, obj, message, setEnChargement, setFlash){
    try
    {
        setEnChargement(true)
        setFlash('')
        let reponse = await fetch(url, obj);
        let reponseText = await reponse.text();
        setEnChargement(false)

        if (reponseText !== "")
        {
            setFlash(reponseText)
        }else{
			setFlash("Utilisateur creer")
		}
        return (reponseText);        
    } catch(erreur){
        console.error(erreur);
    }
}

const Ajouter = () => {
	const navigate = useNavigate();
    const [flash, setFlash] = useState('');
    const [enChargement, setEnChargement] = useState(false);
 	const [passwordMatchError, setPasswordMatchError] = useState('');
	
	const login = () => {  
		setFlash('');      
        navigate("/");
    };

 const creerUtilisateur = (values) => {
       
            alert("creer utilisateur");
            const url = "http://127.0.0.1:5000/api/utilisateurs";
            const obj = {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
				body: JSON.stringify({
					Nom:values["nom"],
					Courriel:values["courriel"],
					Password:values["mdp1"]
				})
            };
            getJson(url, obj, 'Utilisateur creer.', setEnChargement, setFlash);
        
    };


    
    return (
        <View style={styles.container}>
			<Text style={styles.title}>Enregistrement</Text>
 			<Image source={anonyme} style={styles.avatar} />
			<Text style={styles.flash}>Flash: {flash}</Text>
            <Formik
                initialValues={{ nom: '', courriel: '', mdp1: '', mdp2: '' }}

                onSubmit={(values, actions) => {
                        creerUtilisateur(values);
                    }}

                validationSchema={validationSchema}
            >
                {formikProps => (
                    <React.Fragment>
                        <View style={styles.inputView}>
                            <TextInput
                                style={styles.inputText}
                                placeholder="Nom d'utilisateur"
                                placeholderTextColor="#bbbbbb"
								value={formikProps.values.nom}
                                onChangeText={formikProps.handleChange('nom')}
                            />
                        </View>
                        <Text style={styles.erreur}>{formikProps.errors.nom}</Text>

                        <View style={styles.inputView}>
                            <TextInput
                                style={styles.inputText}
                                placeholder="Courriel"
                                placeholderTextColor="#bbbbbb"
								value={formikProps.values.courriel}
                                onChangeText={formikProps.handleChange('courriel')}
                            />
                        </View>
                        <Text style={styles.erreur}>{formikProps.errors.courriel}</Text>

                        <View style={styles.inputView}>
                            <TextInput
                                secureTextEntry={true}
                                style={styles.inputText}
                                placeholder="Mot de passe"
                                placeholderTextColor="#bbbbbb"
								value={formikProps.values.mdp1}
                                onChangeText={formikProps.handleChange('mdp1')}
                            />
                        </View>
                        <Text style={styles.erreur}>{formikProps.errors.mdp1}</Text>

                        <View style={styles.inputView}>
                            <TextInput
                                secureTextEntry={true}
                                style={styles.inputText}
                                placeholder="Retapper Mot de passe"
                                placeholderTextColor="#bbbbbb"
								value={formikProps.values.mdp2}
                                onChangeText={formikProps.handleChange('mdp2')}
								onBlur={() => {
                                    if (formikProps.values.mdp1 !== formikProps.values.mdp2) {
                                        setPasswordMatchError('Les mots de passe ne correspondent pas');
                                    } else {
                                        setPasswordMatchError('');
                                    }
                                }}
                            />
                        </View>
                        <Text style={styles.erreur}>{formikProps.errors.mdp2}</Text>
						<Text style={styles.erreur}>{passwordMatchError}</Text>

						 <TouchableOpacity
                            style={[styles.loginBtn,
							!formikProps.isValid || passwordMatchError ? styles.disabled : null]}
                            onPress={formikProps.handleSubmit}
                            disabled={!formikProps.isValid || passwordMatchError}
                        >
                            <Text style={styles.loginText}>Ajouter</Text>
                        </TouchableOpacity>

						<TouchableOpacity style={styles.loginBtn} onPress={login}>
                            <Text style={styles.loginText}>Quitter</Text>
		                </TouchableOpacity>
                    </React.Fragment>
                )}
            </Formik>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#6e4256',
        margin: 10,
        width: 1080,
        height: 1920,
    },
    inputView: {
        width: '80%',
        backgroundColor: '#00a0d3',
        borderRadius: 25,
        height: 80,
        marginBottom: 20,
        justifyContent: 'center',
        padding: 20,
    },
    inputText: {
        height: 50,
        color: 'white',
        fontSize: 50,
    },
    erreur: {
        fontSize: 50,
        color: 'red',
    },
	flash:{
        fontSize:50,
        color:'black'
    },
	title:{
        fontSize:80,
        color:'black'
    },
 	avatar:{
        width:256,
        height:256,
        margin:50
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
});

export default Ajouter;





