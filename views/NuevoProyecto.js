import React, { useState } from 'react'
import { View } from 'react-native'
import { Container, Button, Text, H1, Form, Item, Input, Toast } from 'native-base'
import globalStyles from '../styles/global'
import { useNavigation } from '@react-navigation/native'
import { gql, useMutation } from '@apollo/client'

const NUEVO_PROYECTO = gql`
    mutation nuevoProyecto($input: ProyectoInput) {
        nuevoProyecto(input: $input) {
            nombre
            id
        }
    }
`

// Actualiza la cache
const OBTENER_PROYECTOS = gql`
    query obtenerProyectos {
        obtenerProyectos {
            id
            nombre
        }
    }
`

const NuevoProyecto = () => {

    const [mensaje, guardarMensaje] = useState(null)
    const [nombre, guardarNombre] = useState('')

    const navigation = useNavigation()

    // Apollo
    const [nuevoProyecto] = useMutation(NUEVO_PROYECTO, {
        update(cache, { data: { nuevoProyecto } }) {
            const { obtenerProyectos } = cache.readyQuery({ query: OBTENER_PROYECTOS })
            cache.writeQuery({
                query: OBTENER_PROYECTOS,
                data: { obtenerProyectos: obtenerProyectos.concat([nuevoProyecto]) }
            })
        }
    })

    if (loading) return <Text>Cargando..</Text>

    const handleSubmit = async () => {
        if (nombre === '') {
            guardarMensaje('El nombre del proyecto es obligatorio')
            return
        }

        // Guardar el proyecto en BD
        try {
            const { data } = await nuevoProyecto({
                variables: {
                    input: {
                        nombre
                    }
                }
            })
            console.log(data)
            guardarMensaje('Proyecto creado correctamente')
            navigation.navigate("Proyectos")
        } catch (error) {
            // console.log(error)
            guardarMensaje(error.message.replace('GraphQlL error:', ''))
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
        <Container style={[globalStyles.contenedor], { backgroundColor: '#e84347' }}>
            <View style={globalStyles.contenido}>
                <H1 style={globalStyles.subtitulo}>Nuevo Proyecto</H1>

                <Form>
                    <Item inlineLabel last style={globalStyles.input}>
                        <Input
                            placeholder="Nombre del proyecto"
                            onChange={text => guardarNombre(text)}
                        />
                    </Item>
                </Form>

                <Button
                    style={[globalStyles.boton, { marginTop: 30 }]}
                    square
                    block
                    onPress={() => handleSubmit()}
                >
                    <Text style={globalStyles.botonTexto}>
                        Crear Proyecto
                </Text>
                </Button>

                {mensaje && mostrarAlerta()}

            </View>
        </Container>
    )
}

export default NuevoProyecto
