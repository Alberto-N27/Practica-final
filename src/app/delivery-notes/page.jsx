'use client';

import { useState, useEffect } from 'react';

const DeliveryNotesPage = () => {
  const [deliveryNotes, setDeliveryNotes] = useState([]);
  const [projects, setProjects] = useState([]);
  const [newNote, setNewNote] = useState({
    clientId: '',
    projectId: '',
    format: '',
    material: '',
    hours: 0,
    description: '',
    workdate: '',
  });
  const token = localStorage.getItem('jwt');

  // Obtener la lista de albaranes
  const fetchDeliveryNotes = async () => {
    try {
      const response = await fetch('https://bildy-rpmaya.koyeb.app/api/deliverynote', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Error al obtener albaranes');
      const data = await response.json();
      setDeliveryNotes(data);
    } catch (error) {
      console.error('Error al cargar albaranes:', error);
    }
  };

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

  // Crear un nuevo albarán
  const createDeliveryNote = async () => {
    try {
      const response = await fetch('https://bildy-rpmaya.koyeb.app/api/deliverynote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newNote),
      });

      if (!response.ok) throw new Error('Error al crear albarán');
      fetchDeliveryNotes(); // Actualiza la lista de albaranes
      setNewNote({
        clientId: '',
        projectId: '',
        format: '',
        material: '',
        hours: 0,
        description: '',
        workdate: '',
      });
    } catch (error) {
      console.error('Error al crear albarán:', error);
    }
  };

  // Eliminar un albarán
  const deleteDeliveryNote = async (noteId) => {
    const confirmDelete = window.confirm('¿Estás seguro de que deseas eliminar este albarán?');
    if (!confirmDelete) return;

    try {
      const response = await fetch(`https://bildy-rpmaya.koyeb.app/api/deliverynote/${noteId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Error al eliminar el albarán');
      fetchDeliveryNotes(); // Actualiza la lista de albaranes
    } catch (error) {
      console.error('Error al eliminar el albarán:', error);
    }
  };

  // Rellenar los campos con los datos del cliente y proyecto seleccionado
  const handleProjectSelect = (projectId) => {
    const selectedProject = projects.find((project) => project._id === projectId);
    if (selectedProject) {
      setNewNote({
        ...newNote,
        projectId: selectedProject._id,
        clientId: selectedProject.clientId, // Supongamos que cada proyecto tiene un cliente asociado
      });
    }
  };

  useEffect(() => {
    fetchDeliveryNotes();
    fetchProjects();
  }, []);

  return (
    <div>
      <h1>Albaranes</h1>

      {/* Sección para crear un nuevo albarán */}
      <section>
        <h2>Crear Albarán</h2>
        <select
          value={newNote.projectId}
          onChange={(e) => handleProjectSelect(e.target.value)}
        >
          <option value="">Selecciona un proyecto</option>
          {projects.map((project) => (
            <option key={project._id} value={project._id}>
              {project.name}
            </option>
          ))}
        </select>

        <textarea
          placeholder="Descripción del albarán"
          value={newNote.description}
          onChange={(e) => setNewNote({ ...newNote, description: e.target.value })}
        />

        <select
          value={newNote.format}
          onChange={(e) => setNewNote({ ...newNote, format: e.target.value })}
        >
          <option value="">Selecciona un formato</option>
          <option value="material">Material</option>
          <option value="hours">Horas</option>
        </select>

        {newNote.format === 'material' && (
          <input
            type="text"
            placeholder="Tipo de material"
            value={newNote.material}
            onChange={(e) => setNewNote({ ...newNote, material: e.target.value })}
          />
        )}

        {newNote.format === 'hours' && (
          <input
            type="number"
            placeholder="Número de horas"
            value={newNote.hours}
            onChange={(e) => setNewNote({ ...newNote, hours: e.target.value })}
          />
        )}

        <input
          type="date"
          placeholder="Fecha del trabajo"
          value={newNote.workdate}
          onChange={(e) => setNewNote({ ...newNote, workdate: e.target.value })}
        />

        <button onClick={createDeliveryNote}>Agregar Albarán</button>
      </section>

      {/* Sección para mostrar la lista de albaranes */}
      <section>
        <h2>Lista de Albaranes</h2>
        {deliveryNotes.length === 0 ? (
          <p>No hay albaranes disponibles.</p>
        ) : (
          <ul>
            {deliveryNotes.map((note) => (
              <li key={note._id}>
                <p>{note.description}</p> - Proyecto: {note.projectId.name} {/* Corregir aquí */}
                <button onClick={() => deleteDeliveryNote(note._id)}>Eliminar</button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

export default DeliveryNotesPage;