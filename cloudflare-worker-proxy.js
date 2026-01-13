/**
 * Cloudflare Worker for Custom Domain Routing
 * 
 * Deploy this worker and point all customer custom domains to it.
 * The worker will:
 * 1. Inspect the Host header
 * 2. Query your API to find which organization owns the domain
 * 3. Proxy the request to your main Covera app
 * 4. Inject the organization context
 */

const MAIN_APP_URL = 'https://covera.co'; // Your main Covera domain
const API_URL = 'https://YOUR_PROJECT.supabase.co/functions/v1/make-server-be7827e3';

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  const url = new URL(request.url);
  const hostname = url.hostname;

  // If it's the main domain, pass through
  if (hostname === 'covera.co' || hostname === 'www.covera.co') {
    return fetch(request);
  }

  // Check if this is a custom domain we recognize
  try {
    // Query your backend to see if this domain is registered
    const domainCheckResponse = await fetch(`${API_URL}/public/domain-lookup/${hostname}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!domainCheckResponse.ok) {
      // Domain not found - show error page
      return new Response('Domain not configured. Please contact your administrator.', {
        status: 404,
        headers: { 'Content-Type': 'text/plain' },
      });
    }

    const domainData = await domainCheckResponse.json();
    const { userId, organizationName } = domainData;

    // Proxy the request to the main app, adding org context
    const targetUrl = new URL(request.url);
    targetUrl.hostname = new URL(MAIN_APP_URL).hostname;

    const modifiedRequest = new Request(targetUrl.toString(), {
      method: request.method,
      headers: request.headers,
      body: request.body,
    });

    // Add custom headers to identify the organization
    modifiedRequest.headers.set('X-Custom-Domain', hostname);
    modifiedRequest.headers.set('X-Organization-Id', userId);
    modifiedRequest.headers.set('X-Organization-Name', organizationName);

    const response = await fetch(modifiedRequest);
    
    // Return the response
    return response;

  } catch (error) {
    return new Response('Error processing request: ' + error.message, {
      status: 500,
      headers: { 'Content-Type': 'text/plain' },
    });
  }
}
