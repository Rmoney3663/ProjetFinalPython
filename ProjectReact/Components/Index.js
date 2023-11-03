import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, Image, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Formik } from 'formik';
import * as yup from 'yup';
import logo from '../assets/logoPG.png';
import anonyme from '../assets/anonyme.png';
import { useNavigate, useLocation } from "react-router-dom";
import NavigationBar from './NavigationBar';
import Login from './Login';
import MultilineTextInput from './MultilineTextInput';
import { useAppContext  } from './AppContext';


async function getText(url, obj, message, setEnChargement, setFlash){
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
			setFlash("Publication creer")
		}
        return (reponseText);        
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
 	const {jeton, setJeton, utilisateur, setUtilisateur} = useAppContext();
    //const [jeton, setJeton] = useState(location.state?.jeton || '');
    //const [utilisateur, setUtilisateur] = useState(location.state?.utilisateur || null);
	const [publication, setPublication] = useState(null);
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

	 const creerPublication = (values) => {
       
            alert("creer publication");
            const url = "http://127.0.0.1:5000/api/publications";
            const obj = {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
				body: JSON.stringify({
					text:values["publication"],
					userId:utilisateur.id
				})
            };
            getText(url, obj, 'Votre publication est en ligne!', setEnChargement, setFlash);
        
    };

    if (utilisateur !== null) {        
        return (
            <View style={styles.container}>			
 				
				<Formik
		            initialValues={{ publication: '' }}
		            onSubmit={(values, actions) => {
		                creerPublication(values);
		            }}
		            validationSchema={validationSchema}
		        >					
			        {formikProps => (
			            <React.Fragment>
							<NavigationBar userId={utilisateur.id} />
							<TouchableOpacity style={styles.quitterBtn} onPress={quitterSession}>
								<Text style={styles.loginText}>Quitter la session</Text>
							</TouchableOpacity>
							<Text style={styles.title}>Bonjour, {utilisateur.nom}!</Text>
							<Image source={utilisateur.avatar} style={styles.avatar} />
							<Text style={styles.flash}>Flash: {flash}</Text>
							<Text style={styles.jeton}>Jeton: {jeton}</Text>
							<Text style={styles.text}>Dite quelque chose...</Text>
							
							<MultilineTextInput
								style={styles.textarea}
								placeholder="Publication..."
								placeholderTextColor="#bbbbbb"
								value={formikProps.values.publication}
								onChangeText={formikProps.handleChange('publication')}
							/>
							<Text style={styles.erreur}>{formikProps.errors.publication}</Text>
							
							<TouchableOpacity
								style={styles.loginBtn}
								onPress={() => {
								if (formikProps.values.publication.trim() !== '') {
								  formikProps.handleSubmit();
									
								}
								}}
							>
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
export default Index;
