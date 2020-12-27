<script lang="ts">
  import type { Poule } from "../../data/poule";
  export let poule: Poule;
</script>

<style>
  th,
  td {
    font-variant-numeric: tabular-nums;
  }
  th {
    text-align: center;
  }
  .rating {
    text-align: left;
  }
</style>

<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Rating</th>
      <th>Punten</th>
      <th>Gespeeld</th>
      <th>Wedstrijden</th>
      <th>Games</th>
      <th>Punten</th>
    </tr>
  </thead>
  {#each poule.players as player}
    <tr>
      <td class="name">{player.info.name} ({player.info.club})</td>
      <td class="rating">{player.info.rating}</td>
      <td class="points">99</td>
      <td class="games">99</td>
      <td>99</td>
    </tr>
  {/each}
</table>
