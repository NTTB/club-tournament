<script lang="ts">
  import FaArrowLeft from "svelte-icons/fa/FaArrowLeft.svelte";
  import MdMenu from "svelte-icons/md/MdMenu.svelte";
  export let title = "";
  export let backUrl: string = undefined;
  export let showMenuButton = true;
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
  .title {
    grid-column-start: 2;
    overflow: hidden;
    white-space: pre;
  }
  a.back-button {
    color: var(--text-white);
  }

  button.menu-button {
    background-color: transparent;
    color: var(--text-white);
    border: none;
    margin: 0;
    padding: 8px;
    border-radius: 0;
    width: 48px;
    height: 48px;
  }
</style>

<div class="header">
  {#if backUrl}
    <a href={backUrl} class="back-button icon" title="Terug">
      <FaArrowLeft />
    </a>
  {:else if showMenuButton}
    <button class="menu-button">
      <MdMenu />
    </button>
  {/if}

  <div class="title">{title}</div>
</div>
