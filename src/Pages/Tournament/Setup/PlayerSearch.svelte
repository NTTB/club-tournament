<script lang="ts">
  import SearchCardPlayer from "../../../Common/SearchCardPlayer.svelte";
  import SearchCardCustomPlayer from "../../../Common/SearchCardCustomPlayer.svelte";

  import { customPlayerService } from "../../../data/custom-player/custom-player.service";
  import { getPlayersFromTournament } from "../../../data/tournament-player-functions";
  import { derived } from "svelte/store";
  import type { CustomPlayer } from "../../../data/custom-player/custom-player";
  import type { TournamentPlayer } from "../../../data/tournament-player";
  import { createEventDispatcher } from "svelte";

  interface Events {
    addCustomPlayer: CustomPlayer;
    editCustomPlayer: CustomPlayer;
    createCustomPlayer: void;
  }

  const dispatcher = createEventDispatcher<Events>();

  /**
   * Tournament Id
   */
  export let id: string;
  export let searchQuery = "";

  var existingPlayers$ = getPlayersFromTournament(+id);
  var customResults$ = customPlayerService.find([]);

  $: {
    let customPlayers$ = customPlayerService.find(
      Array.from(
        new Set(searchQuery.split(/\W+/).map((x) => x.trim().toLowerCase()))
      )
    );

    customResults$ = derived(
      [customPlayers$, existingPlayers$],
      ([found, existingPlayers]) => onlyMissingPlayers(found, existingPlayers)
    );
  }

  $: showSearch = searchQuery.length >= 1;

  function onlyMissingPlayers(
    found: CustomPlayer[],
    existing: TournamentPlayer[]
  ): CustomPlayer[] {
    const existingIds = existing
      .filter((x) => x.info.type === "custom")
      .map((x) => x.info.id);

    return found.filter((x) => !existingIds.includes(x.id));
  }
</script>

{#if showSearch}
  <div class="results">
    {#each $customResults$ as result}
      <SearchCardPlayer
        player={result}
        on:add={(ev) => dispatcher("addCustomPlayer", ev.detail)}
        on:edit={(ev) => dispatcher("editCustomPlayer", ev.detail)}
      />
    {/each}

    <SearchCardCustomPlayer on:click={() => dispatcher("createCustomPlayer")} />
  </div>
{/if}

<style>
  .results {
    z-index: 1;
    position: fixed;
    background-color: white;
    box-shadow: 0 0 10px black;
    width: calc(100vw - 64px);
    max-height: calc(100vh - 186px);
    overflow: auto;
  }
</style>
