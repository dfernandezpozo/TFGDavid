// server.js
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = 3001;
const USERS_FILE = path.join(__dirname, 'users.json');

// Middleware
app.use(cors());
app.use(express.json());

// Inicializar archivo de usuarios si no existe
async function initUsersFile() {
  try {
    await fs.access(USERS_FILE);
  } catch {
    await fs.writeFile(USERS_FILE, JSON.stringify([], null, 2));
  }
}

// Leer usuarios
async function getUsers() {
  const data = await fs.readFile(USERS_FILE, 'utf-8');
  return JSON.parse(data);
}

// Guardar usuarios
async function saveUsers(users) {
  await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2));
}

// RUTA: Registrar usuario
app.post('/api/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validaciones
    if (!username || !email || !password) {
      return res.status(400).json({ 
        error: 'Todos los campos son obligatorios' 
      });
    }

    if (password.length < 6) {
      return res.status(400).json({ 
        error: 'La contraseña debe tener al menos 6 caracteres' 
      });
    }

    // Leer usuarios existentes
    const users = await getUsers();

    // Verificar si el usuario o email ya existe
    const userExists = users.find(
      u => u.username === username || u.email === email
    );

    if (userExists) {
      return res.status(409).json({ 
        error: 'El usuario o email ya está registrado' 
      });
    }

    // Hash de la contraseña (10 rounds de salt)
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear nuevo usuario
    const newUser = {
      id: Date.now().toString(),
      username,
      email,
      password: hashedPassword,
      createdAt: new Date().toISOString()
    };

    // Agregar y guardar
    users.push(newUser);
    await saveUsers(users);

    // Responder sin enviar la contraseña
    const { password: _, ...userWithoutPassword } = newUser;
    res.status(201).json({ 
      message: 'Usuario registrado correctamente',
      user: userWithoutPassword 
    });

  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// RUTA: Login (verificar contraseña)
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ 
        error: 'Usuario y contraseña son obligatorios' 
      });
    }

    const users = await getUsers();
    const user = users.find(u => u.username === username || u.email === username);

    if (!user) {
      return res.status(401).json({ 
        error: 'Usuario o contraseña incorrectos' 
      });
    }

    // Comparar contraseña con bcrypt
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ 
        error: 'Usuario o contraseña incorrectos' 
      });
    }

    // Login exitoso
    const { password: _, ...userWithoutPassword } = user;
    res.json({ 
      message: 'Login exitoso',
      user: userWithoutPassword 
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// RUTA: Obtener todos los usuarios (sin contraseñas) - solo para debug
app.get('/api/users', async (req, res) => {
  try {
    const users = await getUsers();
    const usersWithoutPasswords = users.map(({ password, ...user }) => user);
    res.json(usersWithoutPasswords);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
});

// Iniciar servidor
initUsersFile().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    console.log(`📁 Usuarios guardados en: ${USERS_FILE}`);
  });
});