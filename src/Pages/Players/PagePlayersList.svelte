<script lang="ts">
  import TiDeleteOutline from "svelte-icons/ti/TiDeleteOutline.svelte";
  import TiPlus from "svelte-icons/ti/TiPlus.svelte";

  import Header from "../../Shared/Header.svelte";
  import PlayerAvatar from "../../Player/PlayerAvatar.svelte";
  import PlayerSearchBar from "../../Pages/Tournament/Setup/PlayerSearchBar.svelte";

  import { customPlayerService } from "../../data/custom-player/custom-player.service";
  import type { CustomPlayer } from "../../data/custom-player/custom-player";
  import type { Readable } from "svelte/store";

  let players$: Readable<CustomPlayer[]> = customPlayerService.find([]);
  let filterValue = "";

  $: {
    const splitValue = new Set(
      ...filterValue
        .toLowerCase()
        .split(" ")
        .filter((x) => x.length > 0)
    );
    players$ = customPlayerService.find(Array.from(splitValue));
  }

  function onFilterUpdate(query) {
    filterValue = query;
  }

  function onDeleteClick(player) {
    const deleteConfirmed = confirm(
      'Weet je zeker dat je "' + player.name + '" wilt verwijderen?'
    );

    if (deleteConfirmed) {
      customPlayerService.destroy(player);
    }
  }
</script>

<Header title="Spelers" backUrl="#/">
  <a href="#/players/create" class="header-link" data-test="new-player-button"
    ><TiPlus /></a
  >
</Header>

<div class="filter-bar">
  <PlayerSearchBar
    mode="filter"
    allowedMode={["filter"]}
    on:update={(ev) => onFilterUpdate(ev.detail.query)}
  />
</div>
<table>
  <thead>
    <tr>
      <th class="avatar"><!--Used for logo--></th>
      <th>Naam</th>
      <th>Rating</th>
      <th>Club</th>
      <th>Niveau</th>
      <th class="actions"><!--Used for actions--></th>
    </tr>
  </thead>
  <tbody>
    {#each $players$ as player}
      <tr>
        <td><a href={"#/players/" + player.id}><PlayerAvatar /></a></td>
        <td><a href={"#/players/" + player.id}>{player.name}</a></td>
        <td>{player.rating}</td>
        <td>{player.club}</td>
        <td>{player.class}</td>
        <td class="actions">
          <div>
            <button class="icon" on:click={() => onDeleteClick(player)}
              ><TiDeleteOutline /></button
            >
          </div>
        </td>
      </tr>
    {/each}
  </tbody>
</table>

<style>
  .filter-bar {
    height: 48px;
    min-height: 48px;
    display: grid;
    align-content: center;
    background-color: var(--nttb-orange);
    padding-left: 8px;
    padding-right: 8px;
  }
  table {
    width: 100%;
    border-collapse: collapse;
  }
  thead th {
    min-height: 48px;
    height: 48px;
    font-size: larger;
    border-bottom: 2px solid black;
  }
  td,
  th {
    padding: 4px;
  }
  th {
    text-align: left;
  }
  .icon {
    max-width: 48px;
    max-height: 48px;
    min-width: 48px;
    min-height: 48px;
  }
  .avatar,
  .actions {
    width: 1px;
  }
  .actions div {
    display: flex;
    gap: 8px;
    flex-wrap: nowrap;
  }
  a.header-link {
    color: white;
    display: inline-block;
    max-width: 36px;
    max-height: 36px;
    padding: 8px;
  }
  a.header-link:hover {
    background-color: rgba(0, 0, 0, 10%);
  }
</style>
