<script lang="ts">
  import Header from "../../Shared/Header.svelte";
  import { customPlayerService } from "../../data/custom-player/custom-player.service";
  import type { CustomPlayer } from "../../data/custom-player/custom-player";

  let nameInput: HTMLInputElement;
  let player: CustomPlayer = {
    class: "",
    club: "",
    id: undefined,
    img: undefined,
    name: "",
    rating: undefined,
    type: "custom",
  };

  let submitDisabled = true;
  $: {
    submitDisabled = false;
    submitDisabled = player.name.trim().length === 0;
    submitDisabled = submitDisabled || typeof player.rating !== "number";
  }

  async function onSubmit() {
    await customPlayerService.create(player);
    location.hash = "#/players";
  }

  async function createAndReset() {
    await customPlayerService.create(player);

    player = {
      class: "",
      club: "",
      id: undefined,
      img: undefined,
      name: "",
      rating: undefined,
      type: "custom",
    };

    nameInput.focus();
  }
</script>

<Header title="Nieuwe speler" backUrl="#/players" />

<form class="form" on:submit|preventDefault={onSubmit}>
  <div class="row">
    <label for="name">Naam</label>
    <input
      id="name"
      type="text"
      data-test="name-input"
      bind:value={player.name}
      placeholder="Naam van de speler"
      bind:this={nameInput}
    />
  </div>
  <div class="row">
    <label for="rating">Rating</label>
    <input
      id="rating"
      type="number"
      data-test="rating-input"
      bind:value={player.rating}
      placeholder="De rating van de speler die gebruikt wordt bij het indelen"
    />
  </div>

  <div class="row">
    <label for="club">Club</label>
    <input
      id="club"
      type="text"
      bind:value={player.club}
      placeholder="Optioneel de naam van de club"
    />
  </div>
  <div class="row">
    <label for="class">Niveau</label>
    <input id="class" type="string" bind:value={player.class} placeholder="Optioneel het niveau van de speler" />
  </div>

  <div class="row">
    <div><!--spanner--></div>
    <div class="button-split">
      <button data-test="save-button" type="submit" disabled={submitDisabled}>Opslaan</button>
      <button type="button" disabled={submitDisabled} on:click={createAndReset}
        >Opslaan en nog 1 maken</button
      >
    </div>
  </div>
</form>

<style>
  form {
    max-width: 800px;
    margin: auto;
    margin-top: 16px;
  }
  .row {
    display: grid;
    grid-template-columns: 10ch 1fr;
    align-items: center;
  }
  .button-split {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
  }
</style>
