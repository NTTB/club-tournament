<script>
  import Header from "../Shared/Header.svelte";
  import MdDeleteForever from 'svelte-icons/md/MdDeleteForever.svelte'
  import MdPlayArrow from "svelte-icons/md/MdPlayArrow.svelte";
  var items = [
    { id: 1, name: "NK 2012" },
    { id: 2, name: "NK 2013" },
    { id: 3, name: "NK 2014" },
    { id: 4, name: "NK 2015" },
    { id: 5, name: "NK 2016" },
    { id: 6, name: "NK 2017" },
    { id: 7, name: "NK 2018" },
    { id: 8, name: "NK 2019" },
    { id: 9, name: "NK 2020" },
    { id: 10, name: "NK 2021" },
    { id: 11, name: "NK 2022" },
    { id: 12, name: "NK 2023" },
    { id: 13, name: "NK 2024" },
    { id: 14, name: "NK 2025" },
  ];

  function deleteTournament(item) {}

  function playTournament(item) {}
</script>

<style>
  .container {
    margin: 16px;
  }
  .item {
    display: grid;
    grid-template-columns: min-content 1fr min-content;
  }
  .item button {
    height: 48px;
    width: 48px;
    background-color: transparent;
    color: black;
    border: none;
    border: 1px solid silver;
    border-radius: 0;
  }

  .item .name {
    display: block;
    height: 48px;
    font-size: 16px;
    border-top: 1px solid silver;
    box-sizing: border-box;
    border-bottom: 1px solid silver;
    line-height: 46px;
    padding-left: 8px;
    color: black;
    font-weight: bold;
  }

  .right {
    text-align: right;
  }
  .new-tournament-button {
    background-color: var(--nttb-orange);
    color: var(--text-white);
    font-size: 16px;
    border: none;
    border-radius: 5px;
    padding: 16px 32px;
    text-transform: uppercase;
    font-weight: bold;
  }

</style>

<div class="header">
  <Header title="Toernooien" />
</div>
<div class="container">
  {#each items as item}
    <div class="item">
      <button on:click={() => playTournament(item)}>
        <MdPlayArrow />
      </button>
      <a class="name" href={`#/tournament/${item.id}/info`}> {item.name} </a>

      <button on:click={() => deleteTournament(item)}>
        <MdDeleteForever />
      </button>
    </div>
  {/each}

  <div class="right">
    <button class="new-tournament-button">Nieuw toernooi maken</button>
  </div>
</div>
