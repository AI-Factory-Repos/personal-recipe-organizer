// ===== Simple Hash-based Router =====

const routes = {
  '/login':         '/frontend/pages/login.html',
  '/register':      '/frontend/pages/register.html',
  '/dashboard':     '/frontend/pages/dashboard.html',
  '/create-recipe': '/frontend/pages/create-recipe.html',
  '/recipe':        '/frontend/pages/recipe-detail.html',   // /recipe/:id
  '/edit-recipe':   '/frontend/pages/edit-recipe.html',     // /edit-recipe/:id
};

const PUBLIC_ROUTES = ['/login', '/register'];

function getToken() {
  return localStorage.getItem('recipeOrganizerToken');
}

function parseRoute(hash) {
  // Strip leading #
  const path = hash.replace(/^#/, '') || '/login';
  // Match base segment (e.g. /recipe/abc → /recipe)
  const parts = path.split('/');
  const base = '/' + (parts[1] || '');
  const param = parts[2] || null;
  return { base, param, full: path };
}

async function navigate(path) {
  window.location.hash = path;
}

async function loadRoute() {
  const hash = window.location.hash || '#/login';
  const { base, param } = parseRoute(hash);

  const token = getToken();

  // Auth guard
  if (!token && !PUBLIC_ROUTES.includes(base)) {
    window.location.hash = '/login';
    return;
  }
  if (token && PUBLIC_ROUTES.includes(base)) {
    window.location.hash = '/dashboard';
    return;
  }

  const filePath = routes[base];
  if (!filePath) {
    window.location.hash = token ? '/dashboard' : '/login';
    return;
  }

  try {
    const res = await fetch(filePath);
    if (!res.ok) throw new Error('Page not found');
    const html = await res.text();

    // Extract body content from fetched HTML
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const bodyContent = doc.body.innerHTML;

    document.getElementById('page').innerHTML = bodyContent;

    // Store param for page scripts
    window.__routeParam = param;

    // Re-run inline scripts from the loaded page
    const scripts = document.getElementById('page').querySelectorAll('script');
    scripts.forEach(oldScript => {
      const newScript = document.createElement('script');
      if (oldScript.src) {
        newScript.src = oldScript.src;
      } else {
        newScript.textContent = oldScript.textContent;
      }
      oldScript.parentNode.replaceChild(newScript, oldScript);
    });

    renderNav(base);
  } catch (err) {
    document.getElementById('page').innerHTML = '<p style="color:red;padding:2rem">Failed to load page.</p>';
    console.error(err);
  }
}

function renderNav(currentBase) {
  const token = getToken();
  const nav = document.getElementById('app-nav');
  if (!nav) return;

  if (!token) {
    nav.innerHTML = `
      <div class="nav-inner">
        <span class="nav-brand" onclick="navigate('/dashboard')">🍴 Recipe Organizer</span>
        <nav class="nav-links">
          <a href="#/login">Login</a>
          <a href="#/register" class="btn-nav-primary">Register</a>
        </nav>
      </div>`;
  } else {
    const user = JSON.parse(localStorage.getItem('recipeOrganizerUser') || '{}');
    nav.innerHTML = `
      <div class="nav-inner">
        <span class="nav-brand" onclick="navigate('/dashboard')">🍴 Recipe Organizer</span>
        <nav class="nav-links">
          <a href="#/dashboard">My Recipes</a>
          <a href="#/create-recipe" class="btn-nav-primary">+ New Recipe</a>
          <span style="color:var(--color-text-muted);font-size:0.9rem">${user.username || ''}</span>
          <button class="btn-nav-logout" onclick="logout()">Logout</button>
        </nav>
      </div>`;
  }
}

window.logout = function() {
  localStorage.removeItem('recipeOrganizerToken');
  localStorage.removeItem('recipeOrganizerUser');
  window.location.hash = '/login';
};

window.navigate = navigate;

// ===== Bootstrap =====
(function init() {
  // Build shell layout
  document.body.innerHTML = `
    <header id="app-nav"></header>
    <main id="page"></main>
  `;

  // Add stylesheet if not already present
  if (!document.querySelector('link[href*="main.css"]')) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '/frontend/css/main.css';
    document.head.appendChild(link);
  }

  // Initial nav render
  renderNav('');

  // Listen to hash changes
  window.addEventListener('hashchange', loadRoute);

  // Load initial route
  if (!window.location.hash) {
    window.location.hash = '#/login';
  } else {
    loadRoute();
  }
})();
