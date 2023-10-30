import React from 'react';
import { StyleSheet, Text, View, Button, Image, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Formik } from 'formik';
import * as yup from 'yup';
import logo from './assets/logoPG.png'
import anonyme from './assets/anonyme.png'

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

async function getJson(url, obj, thisRef, message, etat){
    try
    {
        thisRef.setState({enChargement:true})
        thisRef.setState({flash:''})
        thisRef.setState({[etat]:''})
        let reponse = await fetch(url, obj);
        let reponseJson = await reponse.json();
        thisRef.setState({enChargement:false})

        if (typeof reponseJson.erreur === 'undefined')
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

async function chargerUtilisateur(thisRef)
{
    if (thisRef.state.jeton !='')
    {
        alert("charger utilisateur")

        var url = "http://127.0.0.1:5000/api/jeton_user/" + thisRef.state.jeton

        var obj = {
            method: 'GET',
            headers:{
                Accept:'application/json',
                'Content-Type':'application/json',
                'Authorization': 'Bearer ' + thisRef.state.jeton,
            },
        };
        var reponse = getJson(url, obj, thisRef, 'Utilisateur chargé.', 'utilisateur')
    }
}

export default class Login extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            flash:'', 
            jeton:'', 
            utilisateur:'', 
            enChargement:false, 
            anonyme:true
        }
    }

    componentDidMount(){

    }

    componentDidUpdate(){
        if (this.state.anonyme && this.state.jeton != '')
        {
            this.setState({anonyme:false})
            chargerUtilisateur(this)
        }
    }

    demarrerSession(valeurs, thisRef)
    {
        var nom_mdp = valeurs["nom"] + ':' + valeurs["mdp"];
        var nom_mdp_base64 = btoa(nom_mdp)

        var url = 'http://127.0.0.1:5000/api/jeton'
        var obj = {
            method: 'GET',
            headers:{
                Accept:'application/json',
                'Content-Type':'application/json',
                'Authorization': 'Bearer ' + nom_mdp_base64,
            },
        };
        alert(nom_mdp)
        var reponse = getJson(url, obj, thisRef, 'Utilisateur et mot de passe chargé.', 'utilisateur')

    }

    quitterSession(thisRef)
    {
        alert('quitter session')
        thisRef.setState({anomyme:true})
        thisRef.setState({jeton:''})
        thisRef.setState({utilisateur:''})
        thisRef.setState({flash:''})
    }

    render()
    {
        if(this.state.anomyme || typeof this.state.utilisateur === 'undefined'){
            return(
                <View style={styles.container}>
                    <Image source={logo} style={styles.logo}/>
                    <Image source={anonyme} style={styles.avatar}/>
                    <Text style={styles.flash}>Flash: {this.state.flash}</Text><br/>

                    <Formik
                        initialValues={{ nom: '', mdp: ''}}

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

                                        placeholder="Utilisateur..."
                                        placeholderTextColor="#bbbbbb"
                                        onChangeText={formikProps.handlechange('nom')}
                                    />                                    
                                </View>
                                <Text style={styles.erreur}>{formikProps.errors.nom}</Text>
                                <View style={styles.inputView}>
                                    <TextInput 
                                        secureTextEntry={true}
                                        style={styles.inputText}
                                        placeholder="Mot de passe..."
                                        placeholderTextColor="#bbbbbb"
                                        onChangeText={formikProps.handlechange('mdp')}
                                    />                                    
                                </View>
                                <Text style={styles.erreur}>{formikProps.errors.mdp}</Text>
                                
                                <TouchableOpacity>
                                    <Text style={styles.nouvelUtilisateur}>Nouvel utilisateur</Text>
                                </TouchableOpacity>
                                {this.state.enChargement ? (<ActivityIndicator/>) :(
                                    <TouchableOpacity style={styles.loginBtn}>
                                         <Text style={styles.loginText} onPress={formikProps.handleSubmit}>Établir une session</Text>
                                    </TouchableOpacity>
                                )}

                            </React.Fragment>
                        )}
                    </Formik>
                </View>)
        }
        else
        {
            return (
                <View style={styles.container}>
                    <Image source={logo} style={styles.logo}/>
                    <Image source={this.state.utilisateur.avatar} style={styles.avatar}/>
                    <Text style={styles.flash}>Flash: {this.state.flash}</Text><br/>
                    <Text style={styles.flash}>Utilisateur: {this.state.utilisateur.nom}</Text>
                    <Text style={styles.jeton}>Jeton: {this.state.jeton}</Text>
                    <TouchableOpacity style={styles.loginBtn}>
                        <Text style={styles.loginText} onPress={()=> this.quitterSession(this)}>Quitter la session</Text>
                    </TouchableOpacity>
                
                </View>)
        }
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


})
