<script lang="ts">
  import { fade, slide } from "svelte/transition";
  import { createEventDispatcher } from "svelte";

  interface Events {
    backgroundClicked: {};
  }

  const dispatch = createEventDispatcher<Events>();

  function onBackgroundClick() {
    dispatch("backgroundClicked", {});
  }
</script>

<style>
  .toaster.background {
    background: rgba(0, 0, 0, 20%);
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    position: absolute;
  }
  .toaster.foreground {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 70vh;
    background-color: white;
    border-top-left-radius: 12px;
    border-top-right-radius: 12px;
  }
  .header {
    margin: 12px;
  }
  .header-bar{
    border-bottom: 3px solid black;
  }
  .body {
    margin-left: 12px;
    margin-right: 12px;
  }
</style>

<div
  class="toaster background"
  on:click={onBackgroundClick}
  transition:fade={{ duration: 100 }} />
<div class="toaster foreground" transition:slide={{ duration: 100 }}>
  {#if $$slots.title}
    <div class="header">
      <slot name="title" />
    </div>
    <div class="header-bar"></div>
  {/if}
  <div class="body">
    <slot />
  </div>
</div>
