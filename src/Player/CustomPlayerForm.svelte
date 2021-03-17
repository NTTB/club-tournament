<script lang="ts">
  import { createEventDispatcher } from "svelte";

  import type { CustomPlayer } from "../data/custom-player/custom-player";

  interface Events {
    save: CustomPlayer;
  }

  const dispatcher = createEventDispatcher<Events>();

  export let player: CustomPlayer = {
    type: "custom",
    id: undefined,
    img: undefined,
    name: "",
    club: "",
    rating: 0,
    class: "",
  };

  function saveClick() {
    dispatcher("save", player);
  }
</script>

<div class="form">
  <div class="row">
    <label for="name">Naam</label>
    <input id="name" type="text" bind:value={player.name} />
  </div>
  <div class="row">
    <label for="club">Club</label>
    <input id="club" type="text" bind:value={player.club} />
  </div>
  <div class="row">
    <label for="rating">Rating</label>
    <input id="rating" type="number" bind:value={player.rating} />
  </div>
  <div class="row">
    <label for="class">Niveau</label>
    <input id="class" type="string" bind:value={player.class} />
  </div>

  <div class="row">
    <div><!--spanner--></div>
    <button on:click={saveClick}>Opslaan</button>
  </div>
</div>

<style>
  .row {
    display: grid;
    grid-template-columns: 10ch 1fr;
    align-items: center;
  }
</style>
