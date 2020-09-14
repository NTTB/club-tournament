<script lang="ts">
  import Hint from "../Common/Hint.svelte";
  import PlayerCard from "../Common/PlayerCard.svelte";
  import MdGroup from 'svelte-icons/md/MdGroup.svelte'
</script>

<style>
  .section-header {
    display: grid;
    height: 52px;
    grid-template-columns: 48px 1fr 48px;
    background-color: var(--nttb-orange);
    color: var(--text-white);
    font-size: 20px;
    align-items: center;
    margin-bottom: 6px;
  }

  .section-header .title {
    text-transform: uppercase;
  }

  
  .icon {
    height: 32px;
    width: 32px;
    padding: 8px;
  }

  .section-body {
    padding-left: 16px;
    padding-right: 16px;
  }

  .auto-fill-button {
    width: 100%;
    height: 48px;
    background-color: var(--nttb-orange);
    color: var(--text-white);
    border: none;
    text-transform: uppercase;
    border-radius: 5px;
  }
</style>

<div class="section">
  <div class="section-header">
    <div class="icon">
      <MdGroup />
    </div>
    <div class="title">Nieuwe poule</div>
  </div>
  <div class="section-body">
    <Hint>Sleep spelers hier naar toe om een nieuwe poule te maken.</Hint>
  </div>
</div>

<div class="section">
  <div class="section-header">
    <div class="icon">
      <MdGroup />
    </div>
    <div class="title">Niet ingedeeld (3)</div>
  </div>
  <div class="section-body">
    <PlayerCard />
    <PlayerCard />
    <PlayerCard />
  </div>
</div>

<div class="section">
  <div class="section-body">
    <button class="auto-fill-button">Automatisch indelen</button>
  </div>
</div>
