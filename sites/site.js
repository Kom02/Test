function getValue(object, path) {
  return path.split('.').reduce((value, key) => value?.[key], object);
}

function createPrinciple(item, index) {
  const article = document.createElement('article');
  article.className = 'principle';

  const number = document.createElement('span');
  number.className = 'principle-index';
  number.textContent = String(index + 1).padStart(2, '0');

  const content = document.createElement('div');
  const title = document.createElement('h3');
  title.textContent = item.title;
  const description = document.createElement('p');
  description.textContent = item.text;
  content.append(title, description);

  const arrow = document.createElement('span');
  arrow.className = 'principle-arrow';
  arrow.setAttribute('aria-hidden', 'true');
  arrow.textContent = '↗';
  article.append(number, content, arrow);
  return article;
}

function createProductCard(product) {
  const article = document.createElement('article');
  article.className = 'product-card';

  const visual = document.createElement('div');
  const visualTypes = ['citrus', 'berry', 'mango', 'cucumber', 'orange', 'peach'];
  const visualType = visualTypes.includes(product.visual) ? product.visual : 'citrus';
  visual.className = `drink-visual drink-visual--${visualType}`;
  visual.setAttribute('aria-hidden', 'true');

  const badge = document.createElement('span');
  badge.className = 'product-badge';
  badge.textContent = product.badge;

  const details = document.createElement('div');
  details.className = 'product-details';
  const category = document.createElement('p');
  category.className = 'product-category';
  category.textContent = product.category;

  const heading = document.createElement('h3');
  heading.textContent = product.name;
  const description = document.createElement('p');
  description.className = 'product-description';
  description.textContent = product.description;
  const price = document.createElement('p');
  price.className = 'product-price';
  price.textContent = product.price;

  details.append(category, heading, description, price);
  article.append(visual, badge, details);
  return article;
}

async function loadSiteData() {
  try {
    const response = await fetch('/api/site');
    if (!response.ok) {
      throw new Error(`El servidor respondió con estado ${response.status}.`);
    }

    const site = await response.json();
    if (typeof site.meta?.title === 'string') {
      document.title = site.meta.title;
    }
    if (typeof site.meta?.description === 'string') {
      const description = document.querySelector('meta[name="description"]');
      if (description) description.content = site.meta.description;
    }

    document.querySelectorAll('[data-site]').forEach((element) => {
      const value = getValue(site, element.dataset.site);
      if (typeof value === 'string' || typeof value === 'number') {
        element.textContent = String(value);
      }
    });

    document.querySelectorAll('[data-site-list]').forEach((list) => {
      const listPath = list.dataset.siteList;
      let items = getValue(site, listPath);

      if (listPath === 'home.featuredProductIds') {
        const productById = new Map((site.menu?.products || []).map((product) => [product.id, product]));
        items = Array.isArray(items) ? items.map((id) => productById.get(id)).filter(Boolean) : [];
      }

      if (!Array.isArray(items)) return;
      const createItem = listPath.endsWith('.products') || listPath === 'home.featuredProductIds'
        ? createProductCard
        : createPrinciple;
      list.replaceChildren(...items.map(createItem));
    });

    document.querySelectorAll('[data-site-email]').forEach((emailLink) => {
      if (typeof site.contact?.email === 'string') {
        emailLink.href = `mailto:${site.contact.email}`;
      }
    });
  } catch (error) {
    console.error('No se pudieron cargar los datos del sitio.', error);
  }
}

loadSiteData();
