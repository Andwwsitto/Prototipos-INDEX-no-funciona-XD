const http = require('http');
const { getCollection, close } = require('./mongo02');

const PORT = 3000;
const headers = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

function sendJSON(res, status, data) {
  res.writeHead(status, headers);
  res.end(JSON.stringify(data));
}

async function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => { body += chunk; });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (error) {
        reject(error);
      }
    });
    req.on('error', reject);
  });
}

const server = http.createServer(async (req, res) => {
  if (req.method === 'OPTIONS') {
    res.writeHead(204, headers);
    return res.end();
  }

  if (req.method === 'POST' && req.url === '/register') {
    try {
      const body = await parseBody(req);
      const { id, nombre, grupo, especialidad, horario } = body;

      if (!id || !nombre || !grupo || !especialidad || !horario) {
        return sendJSON(res, 400, { error: 'Faltan campos obligatorios.' });
      }

      const collection = await getCollection('usuarios');
      await collection.insertOne({ id, nombre, grupo, especialidad, horario, createdAt: new Date() });
      return sendJSON(res, 201, { message: 'Registro guardado correctamente.' });
    } catch (error) {
      console.error(error);
      return sendJSON(res, 500, { error: 'Error interno del servidor.' });
    }
  }

  if (req.method === 'POST' && req.url === '/login') {
    try {
      const body = await parseBody(req);
      const { email, password } = body;

      if (!email || !password) {
        return sendJSON(res, 400, { error: 'Correo y contraseña son obligatorios.' });
      }

      const collection = await getCollection('usuarios');
      const user = await collection.findOne({ email });
      if (!user) {
        return sendJSON(res, 401, { error: 'Usuario no encontrado.' });
      }
      if (user.password !== password) {
        return sendJSON(res, 401, { error: 'Contraseña incorrecta.' });
      }
      return sendJSON(res, 200, { message: 'Ingreso exitoso. Bienvenido.' });
    } catch (error) {
      console.error(error);
      return sendJSON(res, 500, { error: 'Error interno del servidor.' });
    }
  }

  sendJSON(res, 404, { error: 'Ruta no encontrada.' });
});

server.listen(PORT, () => {
  console.log(`Servidor iniciado en http://127.0.0.1:${PORT}`);
});

process.on('SIGINT', async () => {
  console.log('Cerrando servidor...');
  await close();
  process.exit();
});
