import PagePlayers from './Pages/Players.svelte';
import PagePoule from './Pages/Poule.svelte';
import PageTournament from './Pages/Tournament.svelte';
import Page404 from './Pages/404.svelte';
export interface Route {
  match: (v: string) => boolean,
  component: any;
}

export const routes: Route[] = [
  { match: (v) => /^players\/?/.test(v), component: PagePlayers },
  { match: (v) => /^tournament\/?/.test(v), component: PageTournament },
  { match: (v) => /^poule\/?/.test(v), component: PagePoule },
  { match: _ => true, component: Page404 },
];


export function getCurrentRoute(route: string): Route {
  return routes.find(v => v.match(route));
}