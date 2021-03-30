<script lang="ts">
  export let id: string;
  export let poolId: string;

  export let mode: "ranking" | "matches";

  let routes = [
    {
      href: `#/tournament/${id}/ranking` + (poolId ? `/${poolId}` : ""),
      selected: mode == "ranking",
      text: "Resultaten",
    },
    {
      href: `#/tournament/${id}/matches` + (poolId ? `/${poolId}` : ""),
      selected: mode == "matches",
      text: "Wedstrijden",
    },
  ];
</script>

<style>
  .container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    max-width: 600px;
    margin: 16px;
    margin-left: auto;
    margin-right: auto;
  }
  a {
    padding: 8px 16px;
    border: 1px solid var(--nttb-blue);
    text-align: center;
    cursor: pointer;
    text-decoration: none;
    border-right: none;
  }

  a:first-child {
    border-top-left-radius: 5px;
    border-bottom-left-radius: 5px;
  }
  a:last-child {
    border-top-right-radius: 5px;
    border-bottom-right-radius: 5px;
    border-right: 1px solid var(--nttb-blue);
  }

  .selected {
    color: var(--text-white);
    background-color: var(--nttb-blue);
  }
</style>

<div class="container">
  {#each routes as route}
    <a class:selected={route.selected} href={route.href}>{route.text}</a>
  {/each}
</div>
