import { Formik, Form, Field } from "formik" 
import {useNavigate} from "react-router-dom"
import * as Yup from "yup"
import Alerta from "./Alerta"
import Spinner from "./Spinner"


const Formulario = ({cliente, cargando}) => {

    const navigate = useNavigate()

    const nuevoClienteSchema = Yup.object().shape({
        nombre: Yup.string()
            .min(3, "El Nombre es muy corto")
            .max(40,"El Nombre es muy largo")
            .required('El nombre del Clientes es Obligatorio'),
        empresa: Yup.string()
            .required("El Nombre de la empresa es Obligatorio"),
        email: Yup.string()
            .email("Email no válido")
            .required("El Email es Obligatorio"),
        telefono: Yup.number()
            .positive("Numero no válido")
            .typeError("Numero no válido")
            .integer("Numero no valido"),
    })

    const handleSubmit = async values => {
        try {
            let respuesta ="";
            if (cliente.id) {   
                //Edicion de Cliente 
                const url = `${import.meta.env.VITE_API_URL}/${cliente.id}`
                respuesta = await fetch(url, {
                    method: "PUT",
                    body: JSON.stringify(values),
                    headers: {
                        "Content-Type": "application/json"
                    }
                })
            }else{
                //Nuevo Registro
                const url = import.meta.env.VITE_API_URL
                respuesta = await fetch(url, {
                    method: "POST",
                    body: JSON.stringify(values),
                    headers: {
                        "Content-Type": "application/json"
                    }
                })
            }
            await respuesta.json();
            navigate('/')
        } catch (error) {
            console.log(error)
        }
    }

    return (
        cargando ? <Spinner/> : (
            <div className="bg-white mt-10 px-5 py-10 rounded-md shadow-md 
            md:w-3/4 mx-auto">
                <h1 className="text-gray-600 font-bold text-xl uppercase text-center">{cliente?.nombre ? "Editar Cliente":"Agregar Cliente"}</h1>
                <Formik
                    initialValues={{
                        nombre: cliente?.nombre ?? "",
                        empresa: cliente?.empresa ?? "",
                        email: cliente?.email ?? "",
                        telefono: cliente?.telefono ?? "",
                        notas: cliente?.notas ?? ""
                    }}
                    enableReinitialize={true}
                    onSubmit={ async (values, {resetForm}) => {
                        await handleSubmit(values);
                        
                        resetForm()

                    }}
                    validationSchema={nuevoClienteSchema}
                >   
                    {({errors, touched})=> {

                        return (
                            
                    <Form className="mt-10">
                        <div className="mb-4">
                            <label 
                                className="text-gray-800"
                                htmlFor="nombre"
                            >Nombre: </label>
                            <Field 
                                id = "nombre"
                                name = "nombre"
                                type = "text"
                                className ="mt-2 block w-full p-3 bg-gray-100"
                                placeholder = "Nombre del Cliente"
                            />
                            {errors.nombre && touched.nombre ? <Alerta>{errors.nombre}</Alerta> : null}
                        </div>
                        <div className="mb-4">
                            <label 
                                className="text-gray-800"
                                htmlFor="empresa"
                            >Empresa: </label>
                            <Field 
                                id = "empresa"
                                name = "empresa"
                                type = "text"
                                className ="mt-2 block w-full p-3 bg-gray-100"
                                placeholder = "Empresa del Cliente"
                            />
                            {errors.nombre && touched.empresa ? <Alerta>{errors.empresa}</Alerta> : null}
                        </div>
                        <div className="mb-4">
                            <label 
                                className="text-gray-800"
                                htmlFor="email"
                            >E-mail: </label>
                            <Field 
                                id = "email"
                                name = "email"
                                type = "email"
                                className ="mt-2 block w-full p-3 bg-gray-100"
                                placeholder = "Email del Cliente"
                            />
                            {errors.nombre && touched.email ? <Alerta>{errors.email}</Alerta> : null}
                        </div>
                        <div className="mb-4">
                            <label 
                                className="text-gray-800"
                                htmlFor="telefono"
                            >Telefono: </label>
                            <Field 
                                id = "telefono"
                                name = "telefono"
                                type = "tel"
                                className ="mt-2 block w-full p-3 bg-gray-100"
                                placeholder = "Telefono del Cliente"
                            />
                            {errors.nombre && touched.telefono ? <Alerta>{errors.telefono}</Alerta> : null}
                        </div>
                        <div className="mb-4">
                            <label 
                                className="text-gray-800"
                                htmlFor="notas"
                            >Notas: </label>
                            <Field 
                                as="textarea"
                                id = "notas"
                                name = "notas"
                                type = "text"
                                className ="mt-2 block w-full p-3 bg-gray-100 h-40"
                                placeholder = "Notas del Cliente"
                            />
                        </div>

                        <input
                            className="mt-5 w-full rounded-md bg-blue-800 p-3 text-white uppercase font-bold text-lg cursor-pointer"
                            type="submit" 
                            value={cliente?.nombre ? "Editar Cliente":"Agregar Cliente"}
                        />
                    </Form>
                    )}}
                </Formik>
            </div>
        )
    )
}
Formulario.defaultProps = {
    cliente: {},
    cargando: false
}

export default Formulario
