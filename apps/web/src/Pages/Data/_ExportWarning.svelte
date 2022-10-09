<script lang="ts">
  import { derived } from "svelte/store";

  import { exportTournaments } from "../../data/tournament";
  import { customPlayerService } from "../../data/custom-player/custom-player.service";
  import Alert from "../../Common/Alert.svelte";

  var customPlayers = customPlayerService.exportPlayers();
  var tournament = exportTournaments();

  var amountOfCustomPlayers = derived(customPlayers, (x) => x.items.length);
  var amountOfTournaments = derived(tournament, (x) => x.items.length);
  var haveData = derived(
    [amountOfCustomPlayers, amountOfTournaments],
    ([amountOfCustomPlayers, amountOfTournaments]) =>
      amountOfCustomPlayers > 0 || amountOfTournaments > 0
  );

  var warningType = derived(haveData, (x): "success" | "danger" | "warning" =>
    x ? "danger" : "warning"
  );
</script>

<Alert type={$warningType}>
  Importeren zal <b>alle</b> data overschrijven!
  {#if $haveData == false}
    <div>
      Maar geen zorgen! Jij hebt nog geen data die overschreven kan worden.
    </div>
  {:else}
    Je zal het volgende verliezen:
    <ul>
      <li>{$amountOfCustomPlayers} bestaande handmatige spelers</li>
      <li>{$amountOfTournaments} toernooien</li>
    </ul>

    <div>
      Twijfel je? Maak dan eerst een <a href="#/data/export">export</a> en bewaar
      die ergens anders zodat het later terug gezet kan worden.
    </div>
  {/if}
</Alert>
