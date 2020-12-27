import type { Route } from './route.interface';

import PagePlayers from './Pages/Tournament/Players.svelte';
import PageAutoDraft from './Pages/Tournament/AutoDraft.svelte';
import PagePool from './Pages/Tournament/Pool.svelte';
import PageTournament from './Pages/Tournament/Info.svelte';
import PageTournamentList from './Pages/List.svelte';
import PageTournamentPlay from "./Pages/Tournament/PageTournamentPlay.svelte";
import Page404 from './Pages/404.svelte';


function smartPath(url: string): RegExp {
  return new RegExp("^" + url.replace(/:(\w+)/g, (_, name) => `(?<${name}>\\w+)`) + "$");
}

export const routes: Route[] = [
  { name: "tournament-info", path: smartPath("tournament/:id/info"), component: PageTournament },
  { name: "tournament-pool", path: smartPath("tournament/:id/pool"), component: PagePool },
  { name: "tournament-pool-auto-draft", path: smartPath("tournament/:id/pool/auto-draft"), component: PageAutoDraft },
  { name: "tournament-players", path: smartPath("tournament/:id/players"), component: PagePlayers },
  { name: "tournament-play", path: smartPath("tournament/:id/play"), component: PageTournamentPlay },

  // The index page and 404
  { path: "", component: PageTournamentList },
  { path: _ => true, component: Page404 },
];
