<script lang="ts">
  import { ViewMode, viewMode } from "./tournament";
  import Header from "./Header.svelte";
  import ViewToggle from "./ViewToggle.svelte";

  import PagePlanning from "./Pages/Planning.svelte";
  import PagePlayers from "./Pages/Players.svelte";
  import PageTournament from "./Pages/Tournament.svelte";
  import Tournament from "./Pages/Tournament.svelte";
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
  {#if $viewMode === ViewMode.planning}
    <PagePlanning />
  {/if}
</main>
