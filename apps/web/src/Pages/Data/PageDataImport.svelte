<script lang="ts">
  import { customPlayerService } from "../../data/custom-player/custom-player.service";
  import { importTournaments } from "../../data/tournament";
  import { importTournamentPlayers } from "../../data/tournament-player-functions";
  import { importPools } from "../../data/pool-functions";

  import Header from "../../Shared/Header.svelte";
  import Alert from "../../Common/Alert.svelte";
  import ExportWarning from "./_ExportWarning.svelte";

  var importMode = "paste";
  var textAreaContent = "";
  var importErrorText = "";
  function importData() {
    if (!confirm("Weet je zeker dat je alle data wilt overschrijven?")) {
      return;
    }

    try {
      var data = JSON.parse(textAreaContent);

      customPlayerService.importPlayers(data.customPlayers);
      importTournaments(data.tournament);
      importTournamentPlayers(data.tournamentplayers);
      importPools(data.poules);
      importMode = "done";
    } catch (err) {
      importMode = "failed";
      importErrorText = err;
      if (err instanceof SyntaxError) {
        var ex = err as SyntaxError;
        importErrorText = JSON.stringify(
          {
            message: ex.message,
            name: ex.name,
            stack: ex.stack.split("\n"),
          },
          null,
          2
        );
      }
    }
  }
</script>

<Header title="Import Data" backUrl="#/data" />
<div class="container">
  {#if importMode == "paste"}
    <ExportWarning />
    <p>
      <textarea
        placeholder="Plak hier de data uit je export"
        bind:value={textAreaContent}
      />
    </p>
    <div class="buttons">
      <button on:click={() => importData()}>Importeer</button>
      <a href="#/data">Annuleer</a>
    </div>
  {/if}

  {#if importMode == "done"}
    <Alert type="success">
      Het importeren is gelukt, de oude data is overschreven door de nieuwe
      data.
    </Alert>
    <a href="#/">Terug naar het overzicht</a>
  {/if}

  {#if importMode == "failed"}
    <Alert type="danger">
      Het importeren is gefaald, hier onder de technische reden<br />
      <pre>{importErrorText}</pre>
    </Alert>
  {/if}
</div>

<style>
  textarea {
    width: 80%;
    min-height: 50vh;
    font-family: monospace;
  }
  .container {
    max-width: 800px;
    margin: auto;
    margin-top: 16px;
  }
</style>
