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

async function getJson(url, obj, message, setEnChargement, setFlash, setEtat) {
    try {
        setEnChargement(true)
        setFlash('')
        let reponse = await fetch(url, obj);
        let reponseJson = await reponse.json();
        setEnChargement(false)

        if (reponseJson.erreur === undefined) {
            setEtat(reponseJson)
            setFlash(message)
            console.log(reponseJson)
        }
        else
            setFlash(reponseJson.erreur)
        return (reponseJson);
    } catch (erreur) {
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
	const [publication, setPublication] = useState(null);
    const [allUser, setAllUser] = useState(null);
    const [enChargement, setEnChargement] = useState(false);
    var numPageHome = 0

    useEffect(() => {
		const savedJeton = localStorage.getItem('jeton');
		const savedUtilisateur = JSON.parse(localStorage.getItem('utilisateur'));
		console.log("index ");
		console.log(savedUtilisateur);
		if (savedJeton && jeton == '') {
		  setJeton(savedJeton);
		}

		if (savedUtilisateur && utilisateur == null)  {
		  setUtilisateur(savedUtilisateur);
		}

        if (jeton === '' || utilisateur === null) {
            navigate("/Login");
        }

        if (publication === null && jeton !== '') {
            chargerPublication()
        }

        if (allUser === null && publication !== null) {
            chargerTousLesUtilisateurs()
        }
    });

    const chargerPublication = () => {
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

    const chargerTousLesUtilisateurs = () => {
        const url = "http://127.0.0.1:5000/api/utilisateurs";
        const obj = {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + jeton,
            },
        };
        getJson(url, obj, 'Tous les utilisateurs ont été chargé.', setEnChargement, setFlash, setAllUser);

    };
    const pagePrecedente = () => {
        numPageHome -= 20
        localStorage.setItem('numPageHome', numPageHome)
        navigate("/");
    };

    const pageSuivante = () => {
        numPageHome += 20
        localStorage.setItem('numPageHome', numPageHome)
        navigate("/");
    };
    if(localStorage.getItem('num')){
        localStorage.removeItem('num')
    }
    if(localStorage.getItem('numPageProfil')){
        localStorage.removeItem('numPageProfil')
    }
    if(localStorage.getItem('numPageHome')){
        numPageHome = parseInt(localStorage.getItem('numPageHome'))
    }
    if(numPageHome == 0){
        localStorage.setItem('numPageHome',0)
    } 

    var itemPublication = []
    if (allUser != null && utilisateur != null && publication != null) {
        for (let i = 0 + numPageHome; i < numPageHome + 20; i++) {
            if(i < publication.items.length){
                for (let k = 0; k < allUser.items.length; k++){
                    for (let j = 0; j < utilisateur.les_partisans.length; j++) {
                        if (utilisateur.les_partisans[j] == publication.items[i].utilisateur_id ) {
                            if(allUser.items[k].id == utilisateur.les_partisans[j]){
                                var items = [allUser.items[k].avatar, publication.items[i].corps, publication.items[i].utilisateur_id]
                                itemPublication.push(items);
                            }       
                        }
                        if(utilisateur.id == publication.items[i].utilisateur_id){
                            if(allUser.items[k].id == utilisateur.les_partisans[j]){
                                var items = [utilisateur.avatar, publication.items[i].corps, publication.items[i].utilisateur_id]
                                itemPublication.push(items);
                            } 
                        }
                    }
                }
            }
        }
        console.log(itemPublication)
    }
    
    const quitterSession = () => {
        alert('quitter session');
        setJeton('');
        setUtilisateur(null);
        setFlash('');
		localStorage.setItem('jeton', '');
		localStorage.setItem('utilisateur', JSON.stringify(null));

		
    };

	 const creerPublication = (values) => {
       
            alert("creer publication");
			alert(jeton);
            const url = "http://127.0.0.1:5000/api/publications";
            const obj = {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
					'Authorization': 'Bearer ' + jeton,
                },
				body: JSON.stringify({
					text:values["publication"],
					userId:utilisateur.id
				})
            };
            getText(url, obj, 'Votre publication est en ligne!', setEnChargement, setFlash);
        
    };

	const goToNavigationBar = (userId) => {
 		 navigate(`/Utilisateur/${userId}`);
    	
  	};


    if (allUser != null && utilisateur != null && publication != null) {        
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
							}}}>

							<Text style={styles.loginText}>Soumettre</Text>
							</TouchableOpacity>

			            </React.Fragment>
				        )}
		        </Formik>
                <div>
                    <table>
                        <tbody>
                            {itemPublication.map(publications => (
                                <tr>
                                    <td>
					 					<TouchableOpacity onPress={() => goToNavigationBar(publications[2])} >
										    <Image source={publications[0]} style={styles.avatarSuiveur}  />
										</TouchableOpacity>                                        
                                    </td>
                                    <td>
                                        <Text style={styles.flash} key={publications[1]}>{publications[1]}</Text>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {numPageHome > 0 ? (
                    <TouchableOpacity>
                        <Text style={styles.text} onPress={() => pagePrecedente()}> Page précédente </Text>
                    </TouchableOpacity>
                ) : (<></>)}

                {numPageHome + 20 <= publication.items.length ? (
                    <TouchableOpacity>
                        <Text style={styles.text} onPress={() => pageSuivante()}> Page suivante </Text>
                    </TouchableOpacity>
                ) : (<></>)}
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
        height:2120
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
    avatarSuiveur: {
        width: 100,
        height: 100,
        margin: 0
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
