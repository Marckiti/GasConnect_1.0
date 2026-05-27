import React, { useState, useEffect } from 'react';
import './Read.css';
import TruckImage from '../../assets/camion-grande-Photoroom.png';

const Read = () => {
    const [pedidos, setPedidos] = useState([]);

    useEffect(() => {
        // Por ahora, datos de ejemplo. En el futuro, conectar con Firebase
        const pedidosEjemplo = [
            {
                id: 1,
                callePrincipal: 'Av. Principal 123',
                calleSecundaria: 'Calle Secundaria',
                numeroDomicilio: '456',
                referenciaDomiciliaria: 'Cerca del parque',
                telefono: '0991234567',
                cantidadTanques: 2,
                fechaHoraEntrega: '2026-01-31T14:00',
                total: 7.00,
                estado: 'Pendiente'
            },
            {
                id: 2,
                callePrincipal: 'Calle Norte 789',
                calleSecundaria: 'Av. Sur',
                numeroDomicilio: '101',
                referenciaDomiciliaria: 'Frente a la tienda',
                telefono: '0987654321',
                cantidadTanques: 1,
                fechaHoraEntrega: '2026-02-01T10:00',
                total: 3.50,
                estado: 'Entregado'
            }
        ];
        setPedidos(pedidosEjemplo);
    }, []);

    return (
        <div className="read-container">
            <div className="page-header" style={{backgroundColor: '#004AAD', color: '#FF8C00', padding: '20px', textAlign: 'center', width: '100%', marginBottom: '20px', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'}}>
                <h1 style={{margin: '0', fontSize: '2.5rem', fontWeight: 'bold', color: '#FF8C00'}}>Mis Pedidos</h1>
            </div>
            {pedidos.length === 0 ? (
                <p>No tienes pedidos registrados.</p>
            ) : (
                <div className="pedidos-grid">
                    {pedidos.map((pedido) => (
                        <div key={pedido.id} className="pedido-card">
                            <div className="pedido-header">
                                <h3>Pedido #{pedido.id}</h3>
                                <span className={`estado ${pedido.estado.toLowerCase()}`}>
                                    {pedido.estado}
                                </span>
                            </div>
                            <div className="pedido-info">
                                <div className="ubicacion">
                                    <h4>Ubicación:</h4>
                                    <p>{pedido.callePrincipal}</p>
                                    <p>{pedido.calleSecundaria} {pedido.numeroDomicilio}</p>
                                    <p>Ref: {pedido.referenciaDomiciliaria}</p>
                                    <p>Tel: {pedido.telefono}</p>
                                </div>
                                <div className="detalles">
                                    <p><strong>Cantidad de tanques:</strong> {pedido.cantidadTanques}</p>
                                    <p><strong>Fecha de entrega:</strong> {new Date(pedido.fechaHoraEntrega).toLocaleString()}</p>
                                    <p className="total-verde"><strong>Total:</strong> ${pedido.total.toFixed(2)}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            <div className="truck-icon" style={{position: 'fixed', bottom: '20px', right: '20px', width: '80px', height: '80px', zIndex: 1000}}>
                <img src={TruckImage} alt="Camión GasConnect" style={{width: '100%', height: '100%', objectFit: 'contain'}} />
            </div>
        </div>
    );
};

export default Read;
