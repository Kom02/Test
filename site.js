async function loadSiteData() {
  try {
    const response = await fetch('/api/site');
    if (!response.ok) return;

    const site = await response.json();
    document.querySelectorAll('[data-site]').forEach((element) => {
      const value = element.dataset.site.split('.').reduce((item, key) => item?.[key], site);
      if (typeof value === 'string' || typeof value === 'number') {
        element.textContent = String(value);
      }
    });

    if (Array.isArray(site.principles?.items)) {
      const list = document.querySelector('[data-site-list="principles.items"]');
      list.replaceChildren(...site.principles.items.map((item, index) => {
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
      }));
    }

    const emailLink = document.querySelector('[data-site-email]');
    if (typeof site.contact?.email === 'string') {
      emailLink.href = `mailto:${site.contact.email}`;
      emailLink.firstChild.nodeValue = site.contact.email;
    }
  } catch (error) {
    console.error('No se pudieron cargar los datos del sitio.', error);
  }
}

loadSiteData();
