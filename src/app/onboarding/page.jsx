'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const OnboardingPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [isRegistered, setIsRegistered] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Verificar autenticación del usuario al cargar el componente
  useEffect(() => {
    if (localStorage.getItem('jwt')) {
      router.push('/clients');
    }
  }, [router]);

  // Función para registrar un nuevo usuario
  const registerUser = async () => {
    // Validar campos
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setError('Correo electrónico inválido.');
      return;
    }
    if (!password) {
      setError('La contraseña no puede estar vacía.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      // Realizar la solicitud al servidor
      const response = await fetch('https://bildy-rpmaya.koyeb.app/api/user/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      // Validar la respuesta del servidor
      if (!response.ok) {
        const responseBody = await response.json();
        throw new Error(responseBody.message || 'Registro fallido.');
      }

      // Procesar respuesta y guardar token
      const { token } = await response.json();
      localStorage.setItem('jwt', token);
      setIsRegistered(true);
    } catch (err) {
      console.error('Error al registrar:', err.message);
      setError(err.message || 'Error al registrar.');
    } finally {
      setLoading(false);
    }
  };

  // Función para validar al usuario con un código
  const validateUser = async () => {
    const token = localStorage.getItem('jwt');
    if (!token) {
      setError('Token no encontrado. Regístrese primero.');
      return;
    }
    if (!code) {
      setError('El código de validación no puede estar vacío.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const response = await fetch('https://bildy-rpmaya.koyeb.app/api/user/validation', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ code }),
      });

      // Validar respuesta del servidor
      if (!response.ok) {
        const responseBody = await response.json();
        throw new Error(responseBody.message || 'Validación fallida.');
      }

      // Redirigir al usuario si la validación es exitosa
      router.push('/clients');
    } catch (err) {
      console.error('Error al validar:', err.message);
      setError(err.message || 'Error al validar.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Registro</h1>
      {loading && <p>Cargando...</p>} {/* Indicador de carga */}

      {!isRegistered ? (
        <form>
          <div>
            <label htmlFor="email">Correo</label>
            <input
              id="email"
              type="email"
              placeholder="Correo"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="button" onClick={registerUser} disabled={loading}>
            Registrar
          </button>
        </form>
      ) : (
        <form>
          <div>
            <label htmlFor="code">Código de validación</label>
            <input
              id="code"
              type="text"
              placeholder="Código de validación"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
          </div>
          <button type="button" onClick={validateUser} disabled={loading}>
            Validar
          </button>
        </form>
      )}

      {error && <p style={{ color: 'red' }}>{error}</p>} {/* Mostrar errores en rojo */}
    </div>
  );
};

export default OnboardingPage;