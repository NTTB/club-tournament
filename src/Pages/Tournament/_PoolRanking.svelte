<script lang="ts">
  import type { Pool } from "../../data/pool";
  export let pool: Pool;
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
  {#each pool.players as player}
    <tr>
      <td class="name">{player.info.name} ({player.info.club})</td>
      <td class="rating">{player.info.rating}</td>
      <td class="points">99</td>
      <td class="games">99</td>
      <td>99</td>
    </tr>
  {/each}
</table>
