<script lang="ts">
  import MdAddCircleOutline from "svelte-icons/md/MdAddCircleOutline.svelte";
  import type { Club } from "../data/club";
  export let club: Club = undefined;
</script>

<style>
  .card {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 48px;
    padding: 8px;
    border-top: 1px solid black;
  }
  .text{
      justify-self: center;
      align-self: center;
  }
</style>

<div class="card">
    <div class="text">Spelers van {club.name} toevoegen...</div>
</div>
