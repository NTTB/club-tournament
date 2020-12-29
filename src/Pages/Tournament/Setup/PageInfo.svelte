<script lang="ts">
  import TournamentHeader from "../_Header.svelte";
  import PageToggle from "./_PageToggle.svelte";
  import TournamentInfo from "./_Info.svelte";
  import Hint from "../../../Common/Hint.svelte";

  import { findTournamentById } from "../../../data/tournament";

  export let id: string;
  var tournamentPromise = findTournamentById(+id);
  var overrideTitle: string = undefined;

  function onTitleChanged(ev: CustomEvent<{ title: string }>) {
    console.log("Setting the title", ev.detail);
    overrideTitle = ev.detail.title;
  }
</script>

<style>
  .container {
    margin: 16px;
  }
</style>

{#await tournamentPromise}
  <TournamentHeader />
  <PageToggle {id} mode="info" />
  <div class="container">
    <p>Loading...</p>
  </div>
{:then tournament}
  <TournamentHeader
    title={overrideTitle == null ? tournament.name : overrideTitle} />
  <PageToggle {id} mode="info" />
  <div class="container">
    <TournamentInfo {tournament} on:titleChanged={onTitleChanged} />
    <Hint>
      <div>Alle wijzigingen worden automatisch opgeslagen</div>
      <div>
        Het is mogelijk om per poule afwijkende instellingen te gebruiken
      </div>
    </Hint>
  </div>
{/await}
