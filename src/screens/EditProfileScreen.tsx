import { ActivityIndicator, Alert, Image, ImageSourcePropType, Pressable, SafeAreaView, StyleSheet, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Color } from '../assets/colors/colors'
import { useSelector } from 'react-redux'
import { ModelUser, ValidationResult } from '../models/Models'
import { launchImageLibrary, ImageLibraryOptions, Asset } from 'react-native-image-picker';
import { ViewProfileOption } from './ProfileScreen'
import CSText, { TextType } from '../components/CSText'
import callApiWith from '../utils/Api'
import { base_api, base_url } from '../utils/constant'
import axios from 'axios';

const EditProfileScreen = ({ navigation, route }: any) => {
    const currentUser = useSelector((state: any): ModelUser => { return state.user })
    const [profileImageAsset, setProfileImageAsset] = useState<Asset | null>(null);
    const [name, setName] = useState(currentUser.name)
    const [isLoading, showIsLoading] = useState(false)

    const handleDoneClick = async () => {
        const validation = validateForm();
        if (!validation.valid) {
            Alert.alert('Validation Error', validation.message);
            return;
        }
        showIsLoading(true)
        await callUpdateProfileAPI()
        showIsLoading(false)
    }

    useEffect(() => {
        setName(currentUser.name)
    }, [currentUser.name]);

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <Pressable
                    onPress={handleDoneClick}
                >
                    <CSText style={styles.txtDone} type={TextType.body3}>Done</CSText>
                </Pressable>
            ),
        });
    }, [navigation, handleDoneClick]);

    const validateForm = (): ValidationResult => {
        if (!name || name.length < 3) {
            return { valid: false, message: 'Name should be at least 3 characters long' };
        }
        return { valid: true, message: '' };
    }


    const handleEditProfileImg = () => {
        const options: ImageLibraryOptions = {
            mediaType: 'photo',
            maxWidth: 1024,
            maxHeight: 1024,
            quality: 0.9,
        };

        launchImageLibrary(options, response => {
            if (response.didCancel || response.errorCode || !response.assets || response.assets.length === 0) {
                return;
            }
            setProfileImageAsset(response.assets[0]);
        });
    }

    const handleOnChangeName = (text: string) => {
        setName(text)
    }

    const handleOnChangeUserName = (text: string) => {
    }

    const showAlert = (msg: string) => {
        Alert.alert('Success', msg, [{
            text: 'OK', onPress: () => {
                navigation.navigate('TabNavigator', { screen: 'ProfileScreen', params: { from: 'EditProfileScreen' } })
            }
        }]);
    }

    const callUpdateProfileAPI = async () => {
        const formData = new FormData();
        console.log("profileImageAsset",profileImageAsset)
        if (profileImageAsset) {
            formData.append('image', {
                uri: profileImageAsset.uri,
                type: profileImageAsset.type,
                name: profileImageAsset.fileName,
                fileName: profileImageAsset.fileName,
            });
        }
        formData.append("id", currentUser.id)
        formData.append("name", name)
        formData.append("str_current_image", currentUser.image)
        const response = await callApiWith('update_profile', 'POST', currentUser.token, formData,false)
        if (response) {
            showAlert("Updated Successfully")
        }else {
            showIsLoading(true)
            await callUpdateProfileAPI()
            showIsLoading(false)
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <Image source={(profileImageAsset == null)
                ? ((currentUser.image == null)
                    ? require('../assets/images/imgDefaultProfile.png')
                    : { uri: `${base_url}/uploads/${currentUser.image}` })
                : { uri: profileImageAsset.uri }
            }
                style={styles.imgProfileBG} />
            <View style={styles.viewBG1}>
                <View style={styles.viewProfileBack}></View>
                <Pressable onPress={handleEditProfileImg}>
                    <Image source={require('../assets/images/add-photo.png')}
                        style={styles.imgEditProfilePhoto} />
                </Pressable>
            </View>
            <Image source={(profileImageAsset == null)
                ? ((currentUser.image == null)
                    ? require('../assets/images/imgDefaultProfile.png')
                    : { uri: `${base_url}/uploads/${currentUser.image}` })
                : { uri: profileImageAsset.uri }
            }
                style={styles.imgProfile} />
            <CSText type={TextType.body3}>
                {currentUser.username}
            </CSText>
            <ViewProfileOption
                value={currentUser.username}
                title={'Username'}
                onChange={handleOnChangeUserName}
                editable={false}
            />
            <ViewProfileOption
                value={name}
                title={'Name'}
                onChange={handleOnChangeName}
                editable={true}
            />
            {isLoading && <View style={styles.containerLoader}>
                <ActivityIndicator />
            </View>}
        </SafeAreaView>
    )
}

export default EditProfileScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Color.main_bg,
        alignItems: "center"
    },
    containerLoader: {
        backgroundColor: 'rgba(0,0,0,0.3)',
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: "center",
        alignItems: "center",
    },
    viewBG1: {
        height: "25%",
        width: "100%",
    },
    viewBG2: {
        flex: 1,
        justifyContent: "flex-end",
        alignItems: "center",
        width: "100%",
        paddingBottom: 10
    },
    viewProfileBack: {
        flex: 1,
        backgroundColor: Color.main_btn,
        opacity: 0.5,
    },
    imgProfileBG: {
        position: "absolute",
        height: "25%",
        width: "100%",
        resizeMode: "cover"
    },
    imgProfile: {
        width: 120,
        height: 120,
        borderRadius: 60,
        bottom: 60,
        marginBottom: -60,
        borderWidth: 2,
        borderColor: "white",
    },
    imgEditProfilePhoto: {
        right: 10,
        bottom: 10,
        position: "absolute",
        height: 25,
        width: 30,
        resizeMode: "cover"
    },
    txtDone: {
        padding: 5,
        color: "white"
    },
})
