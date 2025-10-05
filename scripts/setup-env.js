const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Función para obtener el branch actual
function getCurrentBranch() {
  try {
    const branch = execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf8' }).trim();
    return branch;
  } catch (error) {
    console.warn('No se pudo obtener el branch actual, usando develop por defecto');
    return 'develop';
  }
}

// Función para mapear branch a entorno
function mapBranchToEnv(branch) {
  if (branch === 'main' || branch === 'master') {
    return 'production';
  } else if (branch.startsWith('feature/')) {
    return 'feature';
  } else if (branch === 'develop') {
    return 'develop';
  } else {
    // Para otros branches, usar develop como fallback
    return 'develop';
  }
}

// Función principal
function setupEnv() {
  const branch = getCurrentBranch();
  const env = mapBranchToEnv(branch);
  const envFile = `.env.${env}`;
  const targetFile = '.env';

  console.log(`Branch actual: ${branch}`);
  console.log(`Entorno seleccionado: ${env}`);
  console.log(`Copiando ${envFile} a ${targetFile}`);

  try {
    if (fs.existsSync(envFile)) {
      fs.copyFileSync(envFile, targetFile);
      console.log('Archivo .env configurado correctamente');
    } else {
      console.error(`Archivo ${envFile} no encontrado. Asegúrate de crear los archivos .env.develop, .env.feature y .env.production`);
      process.exit(1);
    }
  } catch (error) {
    console.error('Error al configurar el archivo .env:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  setupEnv();
}

module.exports = { setupEnv, getCurrentBranch, mapBranchToEnv };