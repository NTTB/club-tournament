<script lang="ts">
  import FaArrowLeft from "svelte-icons/fa/FaArrowLeft.svelte";
  import { tournamentName } from "./data/tournament";
  import { derived } from "svelte/store";

  const title = derived(tournamentName, (v) => {
    if (v.trim().length === 0) {
      return "Nieuw toernooi";
    } else {
      return v;
    }
  });
</script>

<style>
  .header {
    background-color: var(--nttb-blue);
    color: var(--text-white);
    height: 56px;
    font-size: 20px;
    font-weight: bold;

    display: grid;
    grid-template-columns: 48px 1fr;
    gap: 8px;
    align-items: center;
  }

  .icon {
    height: 32px;
    width: 32px;
    padding: 8px;
  }
  .title{
    overflow: hidden;
    white-space: pre;
  }
</style>

<div class="header">
  <div class="back-button icon">
    <FaArrowLeft />
  </div>
  <div class="title">{$title}</div>
</div>
