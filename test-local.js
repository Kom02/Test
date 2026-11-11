const fs = require('node:fs');
const path = require('node:path');

const root = __dirname;
const requiredFiles = [
  'index.html',
  'menu.html',
  'nosotros.html',
  'data/siteData.home.json',
  'data/siteData.about.json',
  'data/siteData.menu.json',
  'designs/global.css',
  'designs/global2.css',
  'designs/kefir.css',
  'sites/site.js',
  'resources/kefir.png',
];

function readJson(file) {
  return JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
}

function build() {
  for (const file of requiredFiles) {
    if (!fs.existsSync(path.join(root, file))) {
      throw new Error(`Falta el archivo requerido: ${file}`);
    }
  }

  const sites = {
    home: readJson('data/siteData.home.json'),
    about: readJson('data/siteData.about.json'),
    menu: readJson('data/siteData.menu.json'),
  };

  if (
    !sites.home.meta?.title
    || !sites.home.home?.featured
    || !Array.isArray(sites.home.menu?.products)
    || !sites.about.about?.hero
    || !Array.isArray(sites.about.about?.values?.items)
    || !Array.isArray(sites.menu.menu?.products)
  ) {
    throw new Error('Los archivos JSON no tienen el esquema esperado por las páginas.');
  }

  const output = path.join(root, '_site');
  fs.rmSync(output, { recursive: true, force: true });
  fs.mkdirSync(path.join(output, 'css'), { recursive: true });
  fs.mkdirSync(path.join(output, 'js'), { recursive: true });
  fs.mkdirSync(path.join(output, 'api'), { recursive: true });
  fs.mkdirSync(path.join(output, 'resources'), { recursive: true });

  for (const file of ['index.html', 'menu.html', 'nosotros.html']) {
    fs.copyFileSync(path.join(root, file), path.join(output, file));
  }

  for (const file of ['global.css', 'global2.css', 'kefir.css']) {
    fs.copyFileSync(path.join(root, 'designs', file), path.join(output, 'css', file));
  }

  const productPhotoStyles = `
.featured-product-photo {
  position: relative;
  z-index: 1;
  display: block;
  width: auto;
  max-width: 100%;
  height: min(62vh, 590px);
  object-fit: contain;
  filter: drop-shadow(12px 18px 15px rgba(41, 53, 43, 0.18));
}
@media (max-width: 760px) {
  .featured-product-photo { height: 300px; }
}
`;
  fs.writeFileSync(path.join(output, 'css', 'product-photo.css'), productPhotoStyles);
  fs.copyFileSync(path.join(root, 'sites/site.js'), path.join(output, 'js/site.js'));

  for (const page of ['home', 'about', 'menu']) {
    fs.copyFileSync(
      path.join(root, `data/siteData.${page}.json`),
      path.join(output, 'api', `${page}.json`),
    );
  }

  fs.copyFileSync(path.join(root, 'resources/kefir.png'), path.join(output, 'resources/kefir.png'));
  fs.writeFileSync(path.join(output, '.nojekyll'), '');
  console.log(`Sitio generado en ${output}`);
}

try {
  build();
  require('./serve-local.js');
} catch (error) {
  console.error(`No se pudo iniciar la vista local: ${error.message}`);
  process.exitCode = 1;
}
