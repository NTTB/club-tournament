<script lang="ts">
  import Header from "../../Shared/Header.svelte";
</script>

<Header title="Data" backUrl="#/" />
<div class="container">
  <p>
    Òp dit moment draait de applicatie volledig in jouw huidige browser en wordt
    er geen data gedeeld met andere computers en ook niet met de NTTB.
  </p>
  <p>
    De enige manier om gegevens te delen is door ze te exporteren en ergens te
    weer opnieuw te importeren.
  </p>
  <p>
    Er wordt gewerkt aan functionaliteit om automatisch delen mogelijk te maken: <br> <a
      href="https://github.com/NTTB/nttb-tournament/issues/34"
      target="_blank"
      >GitHub #34: Share & update data on different devices without having to
      import/export</a
    >
  </p>
  <div class="buttons">
    <a href="#/data/export">Exporteer alles</a>
    <a href="#/data/import">Importeer en overschrijf</a>
  </div>
</div>

<style>
  .container {
    max-width: 800px;
    margin: auto;
    margin-top: 16px;
  }
  .buttons {
    display: flex;
    gap: 20px;
  }
  .buttons a {
    background-color: var(--nttb-orange);
    color: var(--text-white);
    font-size: 16px;
    border: none;
    border-radius: 5px;
    padding: 16px 32px;
    text-transform: uppercase;
    font-weight: bold;
  }
</style>
