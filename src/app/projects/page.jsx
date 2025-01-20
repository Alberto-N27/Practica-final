'use client';

import { useState, useEffect } from 'react';

const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [clients, setClients] = useState([]);
  const [newProject, setNewProject] = useState({
    clientId: '',
    name: '',
    projectCode: '',
    address: {
      street: '',
      number: '',
      postal: '',
      city: '',
      province: '',
    },
    code: ''
  });
  const token = localStorage.getItem('jwt');

  // Obtener la lista de proyectos
  const fetchProjects = async () => {
    try {
      const response = await fetch('https://bildy-rpmaya.koyeb.app/api/project', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Error al obtener proyectos');
      const data = await response.json();
      setProjects(data);
    } catch (error) {
      console.error('Error al cargar proyectos:', error);
    }
  };

  // Obtener la lista de clientes
  const fetchClients = async () => {
    try {
      const response = await fetch('https://bildy-rpmaya.koyeb.app/api/client', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Error al obtener clientes');
      const data = await response.json();
      setClients(data);
    } catch (error) {
      console.error('Error al cargar clientes:', error);
    }
  };

  // Crear un nuevo proyecto
  const createProject = async () => {
    try {
      const response = await fetch('https://bildy-rpmaya.koyeb.app/api/project', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: newProject.name,
          projectCode: newProject.projectCode,
          email: 'mimail@gmail.com', // Este valor puedes ajustar según sea necesario
          address: newProject.address,
          code: newProject.code,
          clientId: newProject.clientId
        }),
      });

      if (!response.ok) throw new Error('Error al crear proyecto');
      const result = await response.json();
      console.log('Proyecto creado:', result);
      alert('¡Proyecto creado con éxito!');
      fetchProjects();
      setNewProject({
        clientId: '',
        name: '',
        projectCode: '',
        address: {
          street: '',
          number: '',
          postal: '',
          city: '',
          province: '',
        },
        code: ''
      });
    } catch (error) {
      console.error('Error al crear proyecto:', error);
      alert('Error al crear el proyecto');
    }
  };

  // Eliminar un proyecto
  const deleteProject = async (projectId) => {
    const confirmDelete = window.confirm('¿Estás seguro de que deseas eliminar este proyecto?');
    if (!confirmDelete) return;

    try {
      const response = await fetch(`https://bildy-rpmaya.koyeb.app/api/project/${projectId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Error al eliminar el proyecto');
      alert('¡Proyecto eliminado con éxito!');
      fetchProjects(); // Actualizamos la lista de proyectos después de eliminar
    } catch (error) {
      console.error('Error al eliminar el proyecto:', error);
      alert('Error al eliminar el proyecto');
    }
  };

  // Rellenar los campos con los datos del cliente seleccionado
  const handleClientSelect = (clientId) => {
    const selectedClient = clients.find(client => client._id === clientId);
    if (selectedClient) {
      setNewProject({
        ...newProject,
        clientId: selectedClient._id,
        address: selectedClient.address, // Rellenamos los campos de la dirección
      });
    }
  };

  useEffect(() => {
    fetchClients();
    fetchProjects();
  }, []);

  return (
    <div>
      <h1>Proyectos</h1>
      <section>
        <h2>Crear Proyecto</h2>
        <select
          value={newProject.clientId}
          onChange={(e) => handleClientSelect(e.target.value)}
        >
          <option value="">Selecciona un cliente</option>
          {clients.map((client) => (
            <option key={client._id} value={client._id}>
              {client.name}
            </option>
          ))}
        </select>
        
        <input
          type="text"
          placeholder="Nombre del Proyecto"
          value={newProject.name}
          onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
        />
        <input
          type="text"
          placeholder="Código del Proyecto"
          value={newProject.projectCode}
          onChange={(e) => setNewProject({ ...newProject, projectCode: e.target.value })}
        />
        <input
          type="text"
          placeholder="Código Interno"
          value={newProject.code}
          onChange={(e) => setNewProject({ ...newProject, code: e.target.value })}
        />
        <h3>Dirección del Cliente</h3>
        <input
          type="text"
          placeholder="Calle"
          value={newProject.address.street}
          onChange={(e) => setNewProject({ ...newProject, address: { ...newProject.address, street: e.target.value } })}
        />
        <input
          type="number"
          placeholder="Número"
          value={newProject.address.number}
          onChange={(e) => setNewProject({ ...newProject, address: { ...newProject.address, number: e.target.value } })}
        />
        <input
          type="number"
          placeholder="Código Postal"
          value={newProject.address.postal}
          onChange={(e) => setNewProject({ ...newProject, address: { ...newProject.address, postal: e.target.value } })}
        />
        <input
          type="text"
          placeholder="Ciudad"
          value={newProject.address.city}
          onChange={(e) => setNewProject({ ...newProject, address: { ...newProject.address, city: e.target.value } })}
        />
        <input
          type="text"
          placeholder="Provincia"
          value={newProject.address.province}
          onChange={(e) => setNewProject({ ...newProject, address: { ...newProject.address, province: e.target.value } })}
        />
        <button onClick={createProject}>Agregar Proyecto</button>
      </section>

      <section>
        <h2>Lista de Proyectos</h2>
        {projects.length === 0 ? (
          <p>No hay proyectos registrados.</p>
        ) : (
          <ul>
            {projects.map((project) => (
              <li key={project._id}>
                <strong>{project.name}</strong> - Cliente: {project.clientId} 
                <button onClick={() => deleteProject(project._id)}>Eliminar</button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

export default ProjectsPage;