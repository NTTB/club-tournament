<script lang="ts">
  import CustomPlayerForm from "./CustomPlayerForm.svelte";
  import AddPlayerSearchResult from "./AddPlayerSearchResult.svelte";
  import type { Tournament } from "../data/tournament";
  import { customPlayerService } from "../data/custom-player/custom-player.service";
  import type { CustomPlayer } from "../data/custom-player/custom-player";
  import type { Readable } from "svelte/store";

  export let tournament: Tournament;
  let searchValue = "";
  let showManualCreate = false;

  let players$: Readable<CustomPlayer[]> = customPlayerService.find([]);

  $: {
    let terms = Array.from(
      new Set(searchValue.toLowerCase().split(/ +/))
    ).filter((x) => x.length);
    players$ = customPlayerService.find(terms);
    // Find players by name or club
  }

  function onSaveCreatePlayer(ev: CustomEvent<CustomPlayer>) {
    customPlayerService.create(ev.detail);
  }
</script>

<div class="search-bar">
  <input
    type="search"
    bind:value={searchValue}
    placeholder="Zoek spelers op naam, club of bondsnummer"
  />
  <button>➕</button>
</div>

{#if showManualCreate}
  <div class="manual-create">
  </div>
{/if}

<div class="search-results">
  <AddPlayerSearchResult players={$players$} />
</div>

<style>
  .search-bar {
    margin-top: 8px;
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 8px;
  }
  .manual-create {
    max-width: 800px;
    margin: auto;

    box-shadow: 2px 2px 4px grey;
    padding: 16px;
    border-radius: 8px;
  }
</style>
