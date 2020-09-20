<script lang="ts">
  import { ViewMode, viewMode } from "./data/app-state";
  import Header from "./Header.svelte";
  import ViewToggle from "./ViewToggle.svelte";

  import PagePoule from "./Pages/Poule.svelte";
  import PagePlayers from "./Pages/Players.svelte";
  import PageTournament from "./Pages/Tournament.svelte";
</script>

<style>
  @import url("https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,400;0,700;1,300;1,400&display=swap");
  :root {
    --nttb-blue: #262acc;
    --nttb-orange: #f4612d;
    --text-white: white;
    --font-family-default: "Roboto", sans-serif;
  }

  :global(body) {
    font-family: var(--font-family-default);
    margin: 0;
    padding: 0;
  }
  :global(input),
  :global(select) {
    border: 1px solid black;
    border-radius: 3px;
    padding: 8px 10px;

    width: 100%;
    font-size: 14px;
  }

  /** Media query to simulate iPhone 8 */
  @media screen and (min-width: 600px) {
    main {
      height: 667px;
      width: calc(389px + 40px);
      max-height: 667px;
      max-width: calc(389px + 40px);
      margin: auto;
      overflow: auto;
      border: solid black 20px;
      max-width: calc(389px + 40px);
    }
  }
</style>

<main>
  <Header />
  <ViewToggle />
  {#if $viewMode === ViewMode.tournament}
    <PageTournament />
  {/if}
  {#if $viewMode === ViewMode.players}
    <PagePlayers />
  {/if}
  {#if $viewMode === ViewMode.poule}
    <PagePoule />
  {/if}
</main>
