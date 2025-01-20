'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const ClientsPage = () => {
  const [clients, setClients] = useState([]);
  const [newClient, setNewClient] = useState({
    name: '',
    cif: '',
    address: {
      street: '',
      number: '',
      postal: '',
      city: '',
      province: '',
    },
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const token = typeof window !== 'undefined' ? localStorage.getItem('jwt') : null;
  const router = useRouter();

  // Redirigir si no hay token
  useEffect(() => {
    if (!token) {
      router.push('/onboarding');
    } else {
      fetchClients();
    }
  }, [router, token]);

  // Obtener la lista de clientes
  const fetchClients = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('https://bildy-rpmaya.koyeb.app/api/client', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error('Error al obtener clientes');
      const data = await response.json();
      setClients(data);
    } catch (error) {
      console.error('Error al cargar clientes:', error);
      setError('No se pudieron cargar los clientes.');
    } finally {
      setLoading(false);
    }
  };

  // Crear un nuevo cliente
  const createClient = async () => {
    // Validar campos obligatorios
    const { name, cif, address } = newClient;
    if (!name.trim() || !cif.trim()) {
      setError('Los campos "Nombre" y "CIF" son obligatorios.');
      return;
    }
    if (!address.street || !address.number || !address.postal || !address.city || !address.province) {
      setError('Todos los campos de la dirección son obligatorios.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const response = await fetch('https://bildy-rpmaya.koyeb.app/api/client', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newClient),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || 'Error desconocido al crear el cliente');
      }

      // Actualiza la lista de clientes y limpia el formulario
      fetchClients();
      setNewClient({
        name: '',
        cif: '',
        address: {
          street: '',
          number: '',
          postal: '',
          city: '',
          province: '',
        },
      });
      alert('¡Cliente creado con éxito!');
    } catch (error) {
      console.error('Error en la creación del cliente:', error);
      setError(error.message || 'No se pudo crear el cliente.');
    } finally {
      setLoading(false);
    }
  };

  // Eliminar un cliente
  const deleteClient = async (clientId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este cliente?')) {
      setLoading(true);
      setError('');
      try {
        const response = await fetch(`https://bildy-rpmaya.koyeb.app/api/client/${clientId}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Error al eliminar el cliente');
        }

        // Actualizar la lista de clientes después de la eliminación
        fetchClients();
        alert('Cliente eliminado con éxito');
      } catch (error) {
        console.error('Error al eliminar el cliente:', error);
        setError(error.message || 'No se pudo eliminar el cliente.');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div>
      <h1>Clientes</h1>
      {loading && <p>Cargando...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <section>
        <h2>Crear Cliente</h2>
        <input
          type="text"
          placeholder="Nombre del Cliente"
          value={newClient.name}
          onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
        />
        <input
          type="text"
          placeholder="CIF"
          value={newClient.cif}
          onChange={(e) => setNewClient({ ...newClient, cif: e.target.value })}
        />
        <input
          type="text"
          placeholder="Calle"
          value={newClient.address.street}
          onChange={(e) =>
            setNewClient({ ...newClient, address: { ...newClient.address, street: e.target.value } })
          }
        />
        <input
          type="number"
          placeholder="Número"
          value={newClient.address.number}
          onChange={(e) =>
            setNewClient({ ...newClient, address: { ...newClient.address, number: parseInt(e.target.value) } })
          }
        />
        <input
          type="number"
          placeholder="Código Postal"
          value={newClient.address.postal}
          onChange={(e) =>
            setNewClient({ ...newClient, address: { ...newClient.address, postal: parseInt(e.target.value) } })
          }
        />
        <input
          type="text"
          placeholder="Ciudad"
          value={newClient.address.city}
          onChange={(e) =>
            setNewClient({ ...newClient, address: { ...newClient.address, city: e.target.value } })
          }
        />
        <input
          type="text"
          placeholder="Provincia"
          value={newClient.address.province}
          onChange={(e) =>
            setNewClient({ ...newClient, address: { ...newClient.address, province: e.target.value } })
          }
        />
        <button onClick={createClient} disabled={loading}>
          Agregar Cliente
        </button>
      </section>

      <section>
        <h2>Lista de Clientes</h2>
        {clients.length === 0 ? (
          <p>No hay clientes registrados.</p>
        ) : (
          <ul>
            {clients.map((client) => (
              <li key={client._id}>
                <strong>{client.name}</strong> - CIF: {client.cif}{' '}
                <button onClick={() => deleteClient(client._id)} disabled={loading}>
                  Eliminar
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

export default ClientsPage;