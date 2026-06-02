// ===== Auth Utilities =====
// Shared helper used by all pages for authenticated API calls.
// Automatically handles 401 responses by logging the user out.

(function(global) {
  const TOKEN_KEY = 'recipeOrganizerToken';
  const USER_KEY  = 'recipeOrganizerUser';

  function getToken() {
    return localStorage.getItem(TOKEN_KEY);
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
   * Returns true if the stored token is present and not expired.
   */
  function isTokenValid() {
    const token = getToken();
    if (!token) return false;
    const payload = decodeTokenPayload(token);
    if (!payload) return false;
    // exp is in seconds; Date.now() is in milliseconds
    if (payload.exp && payload.exp * 1000 < Date.now()) return false;
    return true;
  }

  /**
   * Clear credentials and redirect to login.
   */
  function forceLogout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    window.location.hash = '/login';
  }

  /**
   * Authenticated fetch wrapper.
   * Attaches the Bearer token and handles 401 by forcing logout.
   *
   * @param {string} url
   * @param {RequestInit} [options]
   * @returns {Promise<Response>}
   */
  async function authFetch(url, options) {
    // Check expiry before even making the request
    if (!isTokenValid()) {
      forceLogout();
      throw new Error('Session expired. Please log in again.');
    }

    const token = getToken();
    const opts = Object.assign({}, options);
    opts.headers = Object.assign(
      { 'Content-Type': 'application/json' },
      opts.headers || {},
      { 'Authorization': 'Bearer ' + token }
    );

    const response = await fetch(url, opts);

    if (response.status === 401) {
      forceLogout();
      throw new Error('Session expired. Please log in again.');
    }

    return response;
  }

  // Expose on window so all inline page scripts can use it
  global.authFetch    = authFetch;
  global.isTokenValid = isTokenValid;
  global.forceLogout  = forceLogout;

})(window);
