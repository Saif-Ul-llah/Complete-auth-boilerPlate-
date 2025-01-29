import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const datasourcePath = path.join(__dirname, 'datasource.prisma');
const generatorPath = path.join(__dirname, 'generator.prisma');
const schemaDirPath = path.join(__dirname, 'schemas');

try {
  // Check if required files and directories exist
  if (!fs.existsSync(datasourcePath)) {
    throw new Error(`datasource.prisma file not found at ${datasourcePath}`);
  }
  if (!fs.existsSync(generatorPath)) {
    throw new Error(`generator.prisma file not found at ${generatorPath}`);
  }
  if (!fs.existsSync(schemaDirPath)) {
    console.warn(`schemas directory not found at ${schemaDirPath}. Creating it now.`);
    fs.mkdirSync(schemaDirPath, { recursive: true });
  }

  const datasource = fs.readFileSync(datasourcePath, 'utf-8');
  const generator = fs.readFileSync(generatorPath, 'utf-8');

  let models = '';
  if (fs.existsSync(schemaDirPath)) {
    const schemaDirs = fs.readdirSync(schemaDirPath);
    schemaDirs.forEach(dir => {
      const dirPath = path.join(schemaDirPath, dir);
      if (fs.lstatSync(dirPath).isDirectory()) {
        const modelPath = path.join(dirPath, 'index.prisma');
        if (fs.existsSync(modelPath)) {
          const model = fs.readFileSync(modelPath, 'utf-8');
          models += model + '\n';
        }
      }
    });
  }

  const schema = `${datasource}\n${generator}\n${models}`;
  const outputPath = path.join(__dirname, 'schema.prisma');
  fs.writeFileSync(outputPath, schema);

  console.log('Prisma schema generated successfully.');
} catch (error) {
  console.error('Error:', error.message);
  console.error('Stack:', error.stack);
}