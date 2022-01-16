<script lang="ts">
  import Header from "../../Shared/Header.svelte";
  import { customPlayerService } from "../../data/custom-player/custom-player.service";
  import CustomPlayerForm from "../../Player/CustomPlayerForm.svelte";
  import type { CustomPlayer } from "../../data/custom-player/custom-player";

  export let id: string;
  const player$ = customPlayerService.getById(+id);

  function onSavePlayer(player: CustomPlayer) {
    customPlayerService.update(player);
    location.hash = "#/players";
  }
</script>

<Header title="Speler aanpassen" backUrl="#/players" />
<div class="container">
  <CustomPlayerForm
    player={$player$}
    on:save={(ev) => onSavePlayer(ev.detail)}
  />
</div>

<style>
  .container {
    max-width: 800px;
    margin: auto;
    margin-top: 16px;
  }
</style>
