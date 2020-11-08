import { readable, derived } from 'svelte/store';
import { routes } from "./routes";
function getRoute() {
  if (!window.location.hash || !/^\#\//.test(window.location.hash)) {
    window.location.hash = '#/';
  }

  return window.location.hash.substr(2).replace(/%20/g, ' ');
}

export const locationStore = readable(getRoute(), (set) => {
  window.addEventListener('hashchange', () => set(getRoute()));
});

function findRoute(route: string) {
  const foundRoutes = routes.filter(v => {
    switch (typeof v.path) {
      case "function": return v.path(route);
      case "string": return v.path == route;
      default: return v.path.test(route);
    }
  });

  if (foundRoutes.length === 0)
    console.error(`No route found for ${route}`);
  if (foundRoutes.length > 2)
    console.warn(`Multiple routes found for ${route}`);
  return foundRoutes;
}

export const currentPageComponent = derived(locationStore, route => {
  const foundRoutes = findRoute(route);
  if (foundRoutes.length == 0) return undefined;
  return foundRoutes[0].component;
});

