<script lang="ts">
  import Header from "../../Shared/Header.svelte";
  import { derived, get } from "svelte/store";

  import { exportTournaments } from "../../data/tournament";
  import { customPlayerService } from "../../data/custom-player/custom-player.service";
  import { exportPools } from "../../data/pool-functions";
  import { exportTournamentPlayers } from "../../data/tournament-player-functions";
  import Hint from "../../Common/Hint.svelte";
  import Alert from "../../Common/Alert.svelte";
  import NttbButton from "../../Common/NttbButton.svelte";

  var exportMode = "paste";

  var customPlayers = customPlayerService.exportPlayers();
  var poules = exportPools();
  var tournament = exportTournaments();
  var tournamentplayers = exportTournamentPlayers();

  var exportData = derived(
    [customPlayers, poules, tournament, tournamentplayers],
    ([customPlayers, poules, tournament, tournamentplayers]) => {
      return JSON.stringify(
        {
          customPlayers,
          poules,
          tournament,
          tournamentplayers,
        },
        null,
        2
      );
    }
  );

  function copyToClipboard() {
    navigator.clipboard.writeText(get(exportData));
    exportMode = "done";
  }

  function share() {
    navigator.share({ text: $exportData });
    exportMode = "done";
  }

  var canShare = false;
  try {
    if (navigator["canShare"] != undefined) {
      canShare = navigator["canShare"]({ text: get(exportData) });
    } else {
      canShare = false;
    }
  } catch {
    canShare = false;
  }
</script>

<Header title="Export Data" backUrl="#/data" />
<div class="container">
  {#if exportMode == "paste"}
    <div>
      <NttbButton on:click={copyToClipboard}>Kopieer de data naar klembord</NttbButton>
      {#if canShare}
        <NttbButton on:click={share}>Deel de data</NttbButton>
      {/if}
    </div>
  {/if}

  {#if exportMode == "done"}
    <Alert type="success">De data kan nu ergens anders geplakt worden</Alert>
  {/if}
  <Hint
    >Nadat je op de gegevens gekopieerd hebt, plak ze in een e-mail zodat je ze
    op een andere apparaat kan importeren.<br /> Het is namelijk tekst zonder opmaak.
    Ontwikkelaars noemen dit JSON.</Hint
  >
</div>

<style>
  .container {
    max-width: 800px;
    margin: auto;
    margin-top: 16px;
  }
</style>
