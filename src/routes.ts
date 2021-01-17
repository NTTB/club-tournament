import type { Route } from './route.interface';

import PagePlayers from './Pages/Tournament/Setup/PagePlayers.svelte';
import PageAutoDraft from './Pages/Tournament/Setup/PageDraft.svelte';
import PagePool from './Pages/Tournament/Setup/PagePool.svelte';
import PageTournament from './Pages/Tournament/Setup/PageInfo.svelte';
import PageTournamentList from './Pages/Tournament/PageList.svelte';
import PageTournamentPlayRanking from "./Pages/Tournament/Play/PageRanking.svelte";
import PageTournamentMatches from "./Pages/Tournament/Play/PageMatches.svelte";
import Page404 from './Pages/404.svelte';


function smartPath(url: string): RegExp {
  return new RegExp("^" + url.replace(/:(\w+)/g, (_, name) => `(?<${name}>\\w+)`) + "$");
}

export const routes: Route[] = [
  { name: "tournament-info", path: smartPath("tournament/:id/info"), component: PageTournament },
  { name: "tournament-pool", path: smartPath("tournament/:id/pool"), component: PagePool },
  { name: "tournament-pool-auto-draft", path: smartPath("tournament/:id/pool/auto-draft"), component: PageAutoDraft },
  { name: "tournament-players", path: smartPath("tournament/:id/players"), component: PagePlayers },
  { name: "tournament-ranking", path: smartPath("tournament/:id/ranking"), component: PageTournamentPlayRanking },
  { name: "tournament-ranking-pool", path: smartPath("tournament/:id/ranking/:poolId"), component: PageTournamentPlayRanking },
  { name: "tournament-matches", path: smartPath("tournament/:id/matches"), component: PageTournamentMatches },
  { name: "tournament-matches-pool", path: smartPath("tournament/:id/matches/:poolId"), component: PageTournamentMatches },

  // The index page and 404
  { path: "", component: PageTournamentList },
  { path: _ => true, component: Page404 },
];
