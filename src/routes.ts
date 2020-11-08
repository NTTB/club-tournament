import PagePlayers from './Pages/Tournament/Players.svelte';
import PagePoule from './Pages/Tournament/Poule.svelte';
import PageTournament from './Pages/Tournament/Info.svelte';
import PageTournamentList from './Pages/List.svelte';
import Page404 from './Pages/404.svelte';
export interface Route {
  match: (v: string) => boolean,
  component: any;
}

function mapRoute(url: string): RegExp {
  return new RegExp("^" + url.replace(/:(\w+)/g, (_, name) => `(?<${name}>\\w+)`));
}

export const routes: Route[] = [
  { match: (v) => mapRoute("/tournament/:id/info").test(v), component: PageTournament },
  { match: (v) => mapRoute("/tournament/:id/poule").test(v), component: PagePoule },
  { match: (v) => mapRoute("/tournament/:id/players").test(v), component: PagePlayers },

  // Old routes
  { match: (v) => /^tournament\/?/.test(v), component: PageTournament },
  { match: (v) => /^players\/?/.test(v), component: PagePlayers },
  { match: (v) => /^poule\/?/.test(v), component: PagePoule },
  { match: (v) => /^tournaments$/.test(v), component: PageTournamentList },

  // The index page and 404
  { match: (v) => "" == v, component: PageTournamentList },
  { match: _ => true, component: Page404 },
];

export function getCurrentRoute(route: string): Route {
  return routes.find(v => v.match(route));
}