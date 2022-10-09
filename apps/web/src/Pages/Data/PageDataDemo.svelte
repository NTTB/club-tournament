<script lang="ts">
  import Header from "../../Shared/Header.svelte";
  import { ImportDemoData } from "../../data/demo-data";
  import ExportWarning from "./_ExportWarning.svelte";

  function importData() {
    if(!confirm("Weet je zeker dat je alles wilt overschrijven?")) return;
    ImportDemoData();
    window.location.hash = "#/"; // And back to list page
  }
</script>

<Header title="Demonstratie toernooi laden" backUrl="#/data" />
<div class="container">
  <p>
    Hier kan je een demonstratie toernooi laden. Dat is een complex toernooi
    waar meerdere spelers gelijk staan en het principe van walkovers en
    walkaways demonstreert.
  </p>
  <ExportWarning />
  <div class="buttons">
    <button on:click={importData}>Importeer demo toernooi</button>
    <a href="#/">Annuleer</a>
  </div>
</div>

<style>
  .buttons{
    display: flex;
    align-items: baseline;
    gap: 20px;
  }
  .container {
    max-width: 800px;
    margin: auto;
    margin-top: 16px;
  }
</style>
