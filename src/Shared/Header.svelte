<script lang="ts">
  import FaArrowLeft from "svelte-icons/fa/FaArrowLeft.svelte";
  import MdMenu from "svelte-icons/md/MdMenu.svelte";
  import MdClose from "svelte-icons/md/MdClose.svelte";
  import type { HeaderAction } from "./HeaderAction";
  let menuState = "closed";
  export let title = "";
  export let backUrl: string = undefined;
  export let showMenuButton = true;
  export let menuActions: HeaderAction[] = [];

  function closeMenu() {
    menuState = "closed";
  }

  function toggleMenu() {
    if (menuState === "closed") {
      menuState = "open";
    } else {
      menuState = "closed";
    }
  }

  function isCurrent(url: string) {
    return location.hash === url;
  }
</script>

<div class="header">
  {#if backUrl}
    <a href={backUrl} class="back-button icon" title="Terug">
      <FaArrowLeft />
    </a>
  {:else if showMenuButton}
    <button class="menu-button" on:click={toggleMenu}>
      {#if menuState === "open"}
        <MdClose />
      {:else}
        <MdMenu />
      {/if}
    </button>
  {/if}

  <div class="title">{title}</div>
  <div class="right">
    <slot />
  </div>
</div>

{#if menuState == "open"}
  <div class="menu-background" on:click={closeMenu} />
  <div class="menu">
    {#each menuActions as menuAction}
      <a
        class="menu-action"
        class:current={isCurrent(menuAction.url)}
        href={menuAction.url}
        on:click={closeMenu}
      >
        {menuAction.title}
      </a>
    {/each}
  </div>
{/if}

<style>
  .menu-action {
    display: grid;
    color: white;
    font-size: 18px;
    font-weight: bold;
    height: 48px;
    padding-left: 16px;
    align-content: center;
  }

  .menu-action.current:hover,
  .menu-action:hover {
    text-decoration: none;
    background-color: rgba(0, 0, 0, 10%);
  }

  .menu-action.current {
    text-decoration: none;
    background-color: rgba(0, 0, 0, 5%);
  }

  .menu-background {
    top: 56px;
    left: 0;
    right: 0;
    bottom: 0;
    position: absolute;
    background-color: black;
    opacity: 15%;
  }

  .menu {
    z-index: 2000;
    position: absolute;
    color: white;
    background-color: var(--nttb-blue);
    left: 0;
    width: 300px;
    top: 56px;
    bottom: 0;
  }

  .header {
    background-color: var(--nttb-blue);
    color: var(--text-white);
    height: 56px;
    font-size: 20px;
    font-weight: bold;

    display: grid;
    grid-template-columns: 48px 1fr auto;
    gap: 8px;
    align-items: center;
    box-shadow: 0 0 3px black inset;
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
