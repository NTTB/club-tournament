<script lang="ts">
  import TournamentHeader from "./_Header.svelte";
  import PageToggle from "./_PageToggle.svelte";
  import NttbButton from "../../Common/NttbButton.svelte";

  import { findTournamentById } from "../../data/tournament";

  export let id: number;
  var tournamentPromise = findTournamentById(id);

  function onStartClick() {
    alert("Starting the auto draft");
  }
</script>

<style>
  .container {
    --pageHeaderHeight: 125px;
    height: calc(100vh - var(--pageHeaderHeight));
    padding: 8px 16px;
  }
</style>

{#await tournamentPromise}
  <TournamentHeader />
  <PageToggle id={id.toString()} mode="poule" />
  <div class="container">
    <p>Loading...</p>
  </div>
{:then tournament}
  <TournamentHeader title={tournament.name} />
  <PageToggle id={id.toString()} mode="poule" />

  <div class="container">
    <h2>Automatisch indelen</h2>

    <p>
      Via deze pagina kan je de spelers in het toernooi snel indelen. Bestaande
      indelingen zullen verloren gaan.
    </p>

    <p>
      Lorem ipsum dolor, sit amet consectetur adipisicing elit. Doloremque
      architecto aut unde ut libero quibusdam cupiditate, iure soluta
      consequatur quos. Libero deserunt quis facilis, sit et asperiores ab
      corrupti minima!
    </p>

    <NttbButton on:click={onStartClick}>Deel opnieuw in</NttbButton>
  </div>
{/await}
