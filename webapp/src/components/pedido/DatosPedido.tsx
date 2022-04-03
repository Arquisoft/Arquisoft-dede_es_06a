import Footer from '../Footer';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import ConfirmacionPago from './ConfirmacionPago';
//import {getUserData, setUserData} from '../../api/api';
import {Order} from '../../shared/shareddtypes';
import { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import { Input } from 'reactstrap';
import { ListaCarrito, Product } from '../../shared/shareddtypes';
import './DatosPedido.css';
import ErrorPage from '../ErrorPage';
import {isLoggedType} from '../../shared/shareddtypes';
import {isLogged} from '../../api/api';

type DatosPedido = {
    listaCarrito: ListaCarrito[];
  }

const DatosPedido: React.FC<DatosPedido> = ({listaCarrito}) => {
    const sessionCart = localStorage.getItem("listaCarrito");
    if (sessionCart)
        listaCarrito = JSON.parse(sessionCart);
    
    const [log,setIsLogged] = useState<isLoggedType>();
    const refreshIsLogged = async () => {
        setIsLogged(await isLogged());
    }
    useEffect(()=>{ refreshIsLogged(); }, []);

    function getPrecioTotal(): string {
        let precioTotal: number = 0;
        listaCarrito.forEach( (elem, i) => {
            precioTotal += listaCarrito[i].producto.precio * listaCarrito[i].unidades
        });
        let number:string = Number(precioTotal).toFixed(2);
        return number;
    }

    const saveData = () => {
        const nombre:HTMLInputElement  = document.querySelector("input[name='name']") as HTMLInputElement;
        const apellido: HTMLInputElement = document.querySelector("input[name='lastname']") as HTMLInputElement;
        const email: HTMLInputElement = document.querySelector("input[name='email']") as HTMLInputElement;
        const city: HTMLInputElement = document.querySelector("input[name='city']") as HTMLInputElement;
        const street: HTMLInputElement = document.querySelector("input[name='street']") as HTMLInputElement;
        const zipcode: HTMLInputElement = document.querySelector("input[name='zipcode']") as HTMLInputElement;
        let order:Order = {
            name: nombre.value,
            lastname: apellido.value,
            email: email.value,
            city: city.value,
            street: street.value,
            zipcode: zipcode.value
        }
        localStorage.setItem("order",  JSON.stringify(order));
    }

    if(log?.logged){
        return (
            <>
            <h2 id="tituloPago">Trámite de pedido</h2>
            <Form id="formPago">
                <Form.Group  controlId="nombre">
                    <Form.Control className="inputPago" type="text" placeholder="name" name="name"/>
                </Form.Group>
                <Form.Group controlId="apellidos">
                    <Form.Control className="inputPago" type="text" placeholder="lastname" name="lastname"/>
                </Form.Group>
                <Form.Group controlId="email">
                    <Form.Control className="inputPago" type="text" placeholder="email" name="email"/>
                </Form.Group>
                <Form.Group  controlId="city">
                    <Form.Control className="inputPago" type="text" placeholder="city" name="city"/>
                </Form.Group>
                <Form.Group controlId="street">
                    <Form.Control className="inputPago" type="text" placeholder="street" name="street"/>
                </Form.Group>
                <Form.Group controlId="zipcode">
                    <Form.Control className="inputPago" type="text" placeholder="zipcode" name="zipcode"/>
                </Form.Group>
                <Button id="formButton" type="button" href='/pago' onClick={saveData}>Siguiente</Button>
            </Form>
            <div id='resumen'>
                <h3 id='titulo-resumen'>Resumen de compra</h3>
                <div id='productos'>
                    {listaCarrito.map(carrito => (
                        <Card style={{ width: '18rem' }}>
                            <Card.Body>
                                <Card.Img variant="top" src={carrito.producto.nombre+".jpg"} />
                                <Card.Title>{carrito.producto.nombre}</Card.Title>
                                <Card.Subtitle className="mb-2 text-muted">Unidades: {" " + carrito.unidades + " "}</Card.Subtitle>
                                <Card.Subtitle className="mb-2 text-muted">Precio total: {" " + Number(carrito.unidades*carrito.producto.precio).toFixed(2) + " €"}</Card.Subtitle>
                            </Card.Body>
                        </Card>
                    ))}
                </div>
                <h4 id='titulo-resumen'>Precio del pedido: {getPrecioTotal() + " €"}</h4>
            </div>

            <Footer/>
        </>
        );
    }else{
        return (
            <ErrorPage msg="Debes iniciar sesión para poder acceder"/>
        );
    }

}
export default DatosPedido;