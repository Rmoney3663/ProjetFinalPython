import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, Image, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Formik } from 'formik';
import * as yup from 'yup';
import { useNavigate, useLocation } from "react-router-dom";
import NavigationBar from './NavigationBar';
import Login from './Login';
import MultilineTextInput from './MultilineTextInput';
import { useAppContext  } from './AppContext';


async function getText(url, obj, message, setEnChargement, setFlash, chargerUtilisateur){
	let reponse; 
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
			setFlash("Utilisateur modifier")
			chargerUtilisateur()
		}
        return (reponseText);        
    } catch(erreur){
        console.error(erreur);
    }
}

async function getJson(url, obj, message, setEnChargement, setFlash, setEtat) {
	let reponseJson; 
	try {
		setEnChargement(true);
		setFlash('');
		const reponse = await fetch(url, obj); 
		reponseJson = await reponse.json(); 
		setEnChargement(false);

		if (reponseJson.erreur === undefined) {
			setEtat(reponseJson);
			localStorage.setItem('utilisateur', JSON.stringify(reponseJson));
			setFlash(message);
			console.log("utilisateur");
			console.log(reponseJson);
		} else {
			setFlash(reponseJson.erreur);
		}

		return reponseJson;
	} catch (erreur) {
		console.error(erreur);
	}
}


const validationSchema = yup.object().shape({
    nom: yup
        .string()
        .required('Veuillez remplire le nom.')
        .label('nom'),    
	propos: yup
        .string()
        .required('Veuillez remplire la section A propos de moi.')
        .label('propos'),    
});

const Modifier = () => {
	const location = useLocation();
	const navigate = useNavigate();
    const [flash, setFlash] = useState('');
 	const {jeton, setJeton, utilisateur, setUtilisateur} = useAppContext();
	const [publication, setPublication] = useState(null);
    const [enChargement, setEnChargement] = useState(false);


    useEffect(() => {
		const savedJeton = localStorage.getItem('jeton');
		const savedUtilisateur = JSON.parse(localStorage.getItem('utilisateur'));

		if (savedJeton && jeton == '') {
		  setJeton(savedJeton);
		}

		if (savedUtilisateur && utilisateur == null)  {
		  setUtilisateur(savedUtilisateur);
		}

        if (jeton === '' || utilisateur === null) {
            navigate("/");
        }
    });   
  

	 const Modifier = (values) => {
       
            alert("Modifier Profile");
			alert(jeton);
            const url = "http://127.0.0.1:5000/api/utilisateurs/" + utilisateur.id;
            const obj = {
                method: 'PUT',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
					'Authorization': 'Bearer ' + jeton,
                },
				body: JSON.stringify({
					nom:values["nom"],
					propos:values["propos"],
				})
            };
            getText(url, obj, 'Profil Modifier', setEnChargement, setFlash, chargerUtilisateur);
        
    };

	const chargerUtilisateur = () => {
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

    if (utilisateur !== null) {        
        return (
            <View style={styles.container}>			
 				
				<Formik
		            initialValues={{ nom: utilisateur.nom, propos: utilisateur.a_propos_de_moi }}
		            onSubmit={(values, actions) => {
		                Modifier(values);
		            }}
		            validationSchema={validationSchema}
		        >					
			        {formikProps => (
			            <React.Fragment>
							<NavigationBar userId={utilisateur.id} />							
							<Text style={styles.title}>Editer Profil</Text>
							<Text style={styles.flash}>Flash: {flash}</Text>
							<Text style={styles.jeton}>Jeton: {jeton}</Text>

							<Text style={styles.text}>Nom</Text>
							<View style={styles.inputView}>
                            <TextInput
                                style={styles.inputText}
                                placeholder="Nom..."
                                placeholderTextColor="#bbbbbb"
								value={formikProps.values.nom}
                                onChangeText={formikProps.handleChange('nom')}
		                        />
		                    </View>
                        	<Text style={styles.erreur}>{formikProps.errors.nom}</Text>
							
							<Text style={styles.text}>A propos de moi</Text>
							<MultilineTextInput
								style={styles.textarea}
								placeholder="A propos de moi..."
								placeholderTextColor="#bbbbbb"
								value={formikProps.values.propos}
								onChangeText={formikProps.handleChange('propos')}
							/>
							<Text style={styles.erreur}>{formikProps.errors.propos}</Text>
							
							<TouchableOpacity
								style={styles.loginBtn}
								onPress={() => {
								if (formikProps.values.propos.trim() !== '' && formikProps.values.nom.trim() !== '') {
								  formikProps.handleSubmit();									
								}}}>

							<Text style={styles.loginText}>Soumettre</Text>
							</TouchableOpacity>

			            </React.Fragment>
				        )}
		        </Formik>
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
        fontSize:30,
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
export default Modifier;
