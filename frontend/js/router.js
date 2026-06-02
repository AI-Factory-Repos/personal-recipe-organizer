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

/**
 * Decode a JWT payload without verifying the signature.
 * Returns null if the token is missing or malformed.
 */
function decodeTokenPayload(token) {
  try {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(base64));
  } catch (e) {
    return null;
  }
}

/**
 * Returns true if there is a token and it is not expired.
 */
function isTokenValid() {
  const token = getToken();
  if (!token) return false;
  const payload = decodeTokenPayload(token);
  if (!payload) return false;
  if (payload.exp && payload.exp * 1000 < Date.now()) return false;
  return true;
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

  const authenticated = isTokenValid();

  // If token exists but is expired, clean up storage
  if (getToken() && !authenticated) {
    localStorage.removeItem('recipeOrganizerToken');
    localStorage.removeItem('recipeOrganizerUser');
  }

  // Auth guard — unauthenticated user tries to access protected route
  if (!authenticated && !PUBLIC_ROUTES.includes(base)) {
    window.location.hash = '/login';
    return;
  }

  // Already authenticated — no need to visit login/register
  if (authenticated && PUBLIC_ROUTES.includes(base)) {
    window.location.hash = '/dashboard';
    return;
  }

  const filePath = routes[base];
  if (!filePath) {
    window.location.hash = authenticated ? '/dashboard' : '/login';
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
  const authenticated = isTokenValid();
  const nav = document.getElementById('app-nav');
  if (!nav) return;

  if (!authenticated) {
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

  // Load auth utilities
  const authScript = document.createElement('script');
  authScript.src = '/frontend/js/auth.js';
  document.head.appendChild(authScript);

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
