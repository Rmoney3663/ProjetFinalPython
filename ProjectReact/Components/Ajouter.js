import React from 'react';
import { StyleSheet, Text, View, Button, Image, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Formik } from 'formik';
import * as yup from 'yup';


const validationSchema = yup.object().shape({
    nom: yup
        .string()
        .required('Veuillez entrer votre nom.')
        .label('Nom'),
    courriel: yup
        .string()
        .required('Veuillez entrer votre courriel.')
        .label('Nom'),
    mdp1: yup
        .string()
        .required('Veuillez entrer votre mot de passe.')
        .label('Nom'),
    mdp2: yup
        .string()
        .required('Veuillez retapper votre mot de passe.')
        .label('Nom'),
});

async function getJson(url, obj, thisRef, message, etat){
    try
    {
        thisRef.setState({enChargement:true})
        thisRef.setState({flash:''})
        thisRef.setState({[etat]:''})
        let reponse = await fetch(url, obj);
        let reponseJson = await reponse.json();
        thisRef.setState({enChargement:false})

        if (reponseJson.erreur === undefined)
        {
            thisRef.setState({[etat]:reponseJson[etat]})
            thisRef.setState({flash:message})
        }
        else
            thisRef.setState({flash:reponseJson.erreur})
        return (reponseJson);        
    } catch(erreur){
        console.error(erreur);
    }
}


export default class Ajouter extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            flash:'', 
            jeton:'', 
            utilisateur:null, 
            enChargement:false
        }
    }

    componentDidMount(){

    }

    render()
    {
        return(
            <View style={styles.container}>                  

                <Formik
                    initialValues={{ nom: '', courriel: '', mdp1: '', mdp2: ''}}

                    onSubmit={(values, actions) =>{
                        this.demarrerSession(values, this)
                    }}

                    validationSchema={validationSchema}
                >
                    {formikProps => (
                        <React.Fragment >
                            <View style={styles.inputView}>
                                <TextInput 
                                    style={styles.inputText}

                                    placeholder="Nom d'utilisateur"
                                    placeholderTextColor="#bbbbbb"
                                    onChangeText={formikProps.handleChange('nom')}
                                />                                    
                            </View>
                            <Text style={styles.erreur}>{formikProps.errors.nom}</Text>

                            <View style={styles.inputView}>
                                <TextInput 
                                    style={styles.inputText}

                                    placeholder="Courriel"
                                    placeholderTextColor="#bbbbbb"
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
                                    onChangeText={formikProps.handleChange('mdp2')}
                                />                                    
                            </View>
                            <Text style={styles.erreur}>{formikProps.errors.mdp2}</Text>                               
                            

                        </React.Fragment>
                    )}
                </Formik>
            </View>)
        
    }    
} 

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





