<script lang="ts">
  import { locationStore, pathArguments, currentRoute } from "../../routing";
  import PageInfo from "./Info.svelte";
  import PagePlayers from "./Players.svelte";
  import PagePoule from "./Poule.svelte";

  let routes = [];
  $: {
    var pathArgs = $pathArguments;
    var id = pathArgs["id"];
    var currentPage = $currentRoute.component;

    routes = [
      {
        href: `#/tournament/${id}/info`,
        selected: currentPage == PageInfo,
        text: "Toernooi",
      },
      {
        href: `#/tournament/${id}/players`,
        selected: currentPage == PagePlayers,
        text: "Spelers",
      },
      {
        href: `#/tournament/${id}/poule`,
        selected: currentPage == PagePoule,
        text: "Indeling",
      },
    ];
  }
</script>

<style>
  .container {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
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
