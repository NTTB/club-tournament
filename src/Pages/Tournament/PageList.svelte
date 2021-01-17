<script lang="ts">
  import Header from "../../Shared/Header.svelte";
  import MdDeleteForever from "svelte-icons/md/MdDeleteForever.svelte";
  import MdPlayArrow from "svelte-icons/md/MdPlayArrow.svelte";
  import MdSettings from "svelte-icons/md/MdSettings.svelte";

  import {
    addTournament,
    getAllTournaments,
    deleteTournament,
    startTournament,
  } from "../../data/tournament";
  import type { Tournament } from "../../data/tournament";

  var items = getAllTournaments();

  async function newTournament() {
    var newTournament = await addTournament({
      id: 0,
      availableTables: 1,
      name: "",
      started: false,
      defaultPoolSettings: {
        pointsPerMatch: 2,
        setsPerMatch: 3,
        pointsPerSet: 11,
      },
    });

    window.location.hash = `#/tournament/${newTournament.id}/info`;
  }

  function deleteTournamentClick(item: Tournament) {
    var response = confirm(
      `Weet je zeker dat je het toernooi "${item.name}" wilt verwijderen?`
    );
    if (!response) return;
    deleteTournament(item);
  }

  async function editTournament(item: Tournament) {
    window.location.hash = `#/tournament/${item.id}/info`;
  }

  async function playTournament(item: Tournament) {
    if (!item.started) {
      var response = confirm(
        [
          `Weet je zeker dat je het toernooi wil starten?`,
          `Eenmaal gestart kunnen er geen aanpassingen meer gemaakt worden`,
        ].join("\n")
      );

      if (!response) return;
      if (item.started == false) {
        await startTournament(item.id);
      }
    }

    window.location.hash = `#/tournament/${item.id}/ranking`;
  }
</script>

<div class="header">
  <Header title="Toernooien" />
</div>
<div class="container">
  {#await $items}
    <p>Loading...</p>
  {:then items}
    {#each items as item}
      <div class="item">
        {#if item.started}
          <button on:click={() => editTournament(item)}>
            <MdSettings />
          </button>
        {:else}
          <button on:click={() => playTournament(item)}>
            <MdPlayArrow />
          </button>
        {/if}
        <a
          class="name"
          href={`#/tournament/${item.id}/${item.started ? "ranking" : "info"}`}>
          {item.name}
        </a>

        <button on:click={() => deleteTournamentClick(item)}>
          <MdDeleteForever />
        </button>
      </div>
    {/each}
  {/await}

  <div class="right">
    <button class="new-tournament-button" on:click={newTournament}>
      Nieuw toernooi maken
    </button>
  </div>
</div>

<style>
  .container {
    margin: 16px;
  }
  .item {
    display: grid;
    grid-template-columns: min-content 1fr min-content;
  }
  .item button {
    height: 48px;
    width: 48px;
    color: black;
    border: none;
    border: 1px solid silver;
    border-radius: 0;
  }

  .item .name {
    display: block;
    height: 48px;
    font-size: 16px;
    border-top: 1px solid silver;
    box-sizing: border-box;
    border-bottom: 1px solid silver;
    line-height: 46px;
    padding-left: 8px;
    color: black;
    font-weight: bold;
  }

  .right {
    text-align: right;
  }
  .new-tournament-button {
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
