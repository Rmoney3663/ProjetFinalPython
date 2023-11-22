import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, Image, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Formik } from 'formik';
import * as yup from 'yup';
import logo from '../assets/logoPG.png';
import anonyme from '../assets/anonyme.png';
import { useNavigate, useParams } from "react-router-dom";
import NavigationBar from './NavigationBar';
import { useAppContext } from './AppContext';

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

const Explorer = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [flash, setFlash] = useState('');
    const { jeton, setJeton, utilisateur, setUtilisateur } = useAppContext();
    const [publication, setPublication] = useState(null);
    const [enChargement, setEnChargement] = useState(false);
    const [allUser, setAllUser] = useState(null);

    var numPage = 0

    useEffect(() => {
        const savedJeton = localStorage.getItem('jeton');
		const savedUtilisateur = JSON.parse(localStorage.getItem('utilisateur'));

        if (savedJeton && jeton == '') {
            setJeton(savedJeton);
          }
		if (savedUtilisateur && utilisateur == null)  {
		  setUtilisateur(savedUtilisateur);
		}
        if (publication === null && jeton !== '') {
            chargerPublication()
        }

        if (allUser === null && publication !== null) {
            chargerTousLesUtilisateurs()
        }

        console.log(publication)
        console.log(allUser)
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
        numPage -= 10
        localStorage.setItem('num', numPage)
        navigate("/explorer");
    };

    const pageSuivante = () => {
        numPage += 10
        localStorage.setItem('num', numPage)
        navigate("/explorer");
    };

    if(localStorage.getItem('numPageHome')){
        localStorage.removeItem('numPageHome')
    }
    if(localStorage.getItem('numPageProfil')){
        localStorage.removeItem('numPageProfil')
    }
    if(localStorage.getItem('num')){
        numPage = parseInt(localStorage.getItem('num'))
    }
    if(numPage == 0){
        localStorage.setItem('num',0)
    } 

    var itemPublication = []
    if (allUser != null) {
        for (let i = 0 + numPage; i < numPage + 10; i++) {
            if(i < publication.items.length){
                for (let j = 0; j < allUser.items.length; j++) {
                    if (allUser.items[j].id == publication.items[i].utilisateur_id) {
                        var items = [allUser.items[j].avatar, publication.items[i].corps]
                        itemPublication.push(items);
                    }
                }
            }
        }
    }

    if (publication != null && allUser != null) {
        return (
            <View style={styles.container}>
                <NavigationBar userId={utilisateur.id} />
                <Text style={styles.title}>Bonjour, {utilisateur.nom}!</Text>
                <Image source={utilisateur.avatar} style={styles.avatar} />
                <div>
                    <table>
                        <tbody>
                            {itemPublication.map(publications => (
                                <tr>
                                    <td>
                                        <Image source={publications[0]} style={styles.avatarSuiveur} />
                                    </td>
                                    <td>
                                        <Text style={styles.flash} key={publications[1]}>{publications[1]}</Text>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {numPage > 0 ? (
                    <TouchableOpacity>
                        <Text style={styles.text} onPress={() => pagePrecedente()}> Page précédente </Text>
                    </TouchableOpacity>
                ) : (<></>)}

                {numPage + 10 <= publication.items.length ? (
                    <TouchableOpacity>
                        <Text style={styles.text} onPress={() => pageSuivante()}> Page suivante </Text>
                    </TouchableOpacity>
                ) : (<></>)}

            </View>
        );
    }

};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'top',
        alignItems: 'center',
        backgroundColor: '#6e4256',
        margin: 10,
        width: 1080,
        height: 1920
    },
    logo: {
        width: 600,
        height: 200,
        margin: 50
    },
    avatar: {
        width: 400,
        height: 400,
        margin: 50
    },
    avatarSuiveur: {
        width: 100,
        height: 100,
        margin: 0
    },
    inputView: {
        width: '80%',
        backgroundColor: '#00a0d3',
        borderRadius: 25,
        height: 80,
        marginBottom: 20,
        justifyContent: 'center',
        padding: 20,
        marginTop: 20,
    },
    textarea: {
        width: '80%',
        backgroundColor: '#00a0d3',
        borderRadius: 25,
        height: 80,
        marginBottom: 20,
        justifyContent: 'center',
        padding: 20,
        marginTop: 20,
        height: 50,
        color: 'white',
        fontSize: 50
    },
    inputText: {
        height: 50,
        color: 'white',
        fontSize: 50
    },
    quitterBtn: {
        width: '80%',
        backgroundColor: '#00a0d3',
        borderRadius: 25,
        height: 80,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 0,
        marginBottom: 150
    },
    loginText: {
        fontSize: 50,
        color: 'white'
    },
    loginBtn: {
        width: '80%',
        backgroundColor: '#00a0d3',
        borderRadius: 25,
        height: 80,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 40,
        marginBottom: 10
    },
    erreur: {
        fontSize: 50,
        color: 'red'
    },
    flash: {
        fontSize: 35,
        color: 'black'
    },
    text: {
        fontSize: 50,
        color: 'black'
    },
    jeton: {
        fontSize: 30,
        color: 'black'
    },
    title: {
        fontSize: 80,
        color: 'black'
    },


});
export default Explorer;

