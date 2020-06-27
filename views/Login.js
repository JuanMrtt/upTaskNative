import React, { useState } from 'react'
import { View } from 'react-native'
import { Container, Button, Text, H1, Input, Form, Item, Toast } from 'native-base'
import { useNavigation } from '@react-navigation/native'
import globalStyles from '../styles/global'
import AsyncStorage from '@react-native-community/async-storage'

// Apollo
import { gql, useMutation } from '@apollo/client'
const AUTENTICAR_USIARIO = gql`
    mutation autenticarUsuario($input: AutenticarInput){
        autenticarUsuario(input: $input) {
            token
        }
}
`

const Login = () => {

    const [email, guardarEmail] = useState('')
    const [password, guardarPassword] = useState('')

    const [mensaje, guardarMensaje] = useState(null)

    // React Navigation
    const navigation = useNavigation()

    // Mutation de Apollo
    const [autenticarUsuario] = useMutation(AUTENTICAR_USIARIO)


    // Cuando presiona en iniciar sesion
    const handleSubmit = async () => {

        if (email === '' || password === '') {
            // Mostrar un error
            guardarMensaje('Todos los campos son obligatorios')
            return
        }


        // Autenticar usuario
        try {
            const { data } = await autenticarUsuario({
                variables: {
                    input: {
                        email,
                        password
                    }
                }
            })

            const { token } = data.autenticarUsuario

            // Colocar token en storage
            await AsyncStorage.setItem('token', token)

            // redireccionar a proyectos
            guardarMensaje(data.crearUsuario)
            navigation.navigate('Proyectos')

        } catch (error) {
            guardarMensaje(error.message.replace('GraphQL error:', ''))
        }
    }
    // Muestra un mensaje Toast
    const mostrarAlerta = () => {
        Toast.show({
            text: mensaje,
            buttonText: 'OK',
            duration: 5000
        })
    }
    return (

        <Container style={[globalStyles.contenedor, { backgroundColor: '#E84347' }]}>
            <View style={globalStyles.contenido}>
                <H1 style={globalStyles.titulo}>UpTask</H1>

                <Form>
                    <Item inlineLabel last style={globalStyles.input}>
                        <Input
                            autoCompleteType="email"
                            placeholder="Email"
                            onChangeText={text => guardarEmail(text.toLowerCase())}
                            value={email}
                        />
                    </Item>
                </Form>
                <Form>
                    <Item inlineLabel last style={globalStyles.input}>
                        <Input
                            secureTextEntry={true}
                            placeholder="Password"
                            onChangeText={text => guardarPassword(text)}

                        />
                    </Item>
                </Form>
                <Button
                    square
                    block
                    style={globalStyles.boton}
                    onPress={() => handleSubmit()}
                >
                    <Text
                        style={globalStyles.botonTexto}
                    >Iniciar Sesión</Text>
                </Button>

                <Text
                    onPress={() => navigation.navigate("CrearCuenta")}
                    style={globalStyles.enlace}
                >Crear Cuenta</Text>

                {mensaje && mostrarAlerta()}

            </View>
        </Container>

    )
}

export default Login
