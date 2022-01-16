<script lang="ts">
  import IoIosFunnel from "svelte-icons/io/IoIosFunnel.svelte";
  import IoMdPersonAdd from "svelte-icons/io/IoMdPersonAdd.svelte";

  import { createEventDispatcher } from "svelte";

  interface Events {
    update: PlayerSearchBarEvent;
  }

  interface PlayerSearchBarEvent {
    mode: "add" | "filter";
    query: string;
  }

  const dispatcher = createEventDispatcher<Events>();

  let filterQuery: string = "";
  let filterInput: HTMLElement;
  export let allowedMode: ("add" | "filter")[] = ["add", "filter"];
  export let mode: "add" | "filter" = "add";
  let inputPlaceholder = "";

  $: {
    if (mode === "add") {
      inputPlaceholder =
        "Zoek nieuwe spelers op naam of club";
    } else {
      inputPlaceholder = "Filter spelers naam of club";
    }
  }

  $: {
    dispatcher("update", {
      mode: mode,
      query: filterQuery,
    });
  }

  export function setMode(newMode: "add" | "filter") {
    mode = newMode;
  }

  export function getQueryText() {
    return filterQuery;
  }

  export function clearFilter() {
    filterQuery = "";
  }
</script>

<div class="container">
  <div class="buttons">
    {#if allowedMode.includes("filter")}
      <button
        class="filter-button"
        class:active={mode == "filter"}
        on:click={() => setMode("filter")}><IoIosFunnel /></button
      >
    {/if}
    {#if allowedMode.includes("add")}
      <button
        class="add-button"
        class:active={mode == "add"}
        on:click={() => setMode("add")}><IoMdPersonAdd /></button
      >
    {/if}
  </div>
  <input
    type="text"
    placeholder={inputPlaceholder}
    bind:value={filterQuery}
    bind:this={filterInput}
  />
</div>

<style>
  .container {
    display: grid;
    grid-template-columns: max-content 1fr;
    align-content: center;
    justify-content: center;
  }
  .buttons {
    display: flex;
  }
  button {
    background-color: white;
    max-height: 34px;
    border: 1px solid var(--nttb-blue);
    border: none;
    border-radius: 0;
    border-left: none;
    border-right: none;
  }

  button {
    width: 34px;
    border: 1px solid var(--nttb-blue);
    box-sizing: border-box;
    place-content: right;
  }

  .filter-button {
    border-top-left-radius: 3px;
    border-bottom-left-radius: 3px;
  }

  button.active {
    background-color: var(--nttb-blue);
    color: white;
  }

  input,
  button {
    margin: 0;
  }

  input {
    border: none;
    border-color: var(--nttb-blue);
    border: 1px solid var(--nttb-blue);
    border-left: 1px transparent;
    box-sizing: border-box;
    border-radius: 0;
    border-top-right-radius: 3px;
    border-bottom-right-radius: 3px;
    height: 34px;
    width: 100%;
  }
</style>
