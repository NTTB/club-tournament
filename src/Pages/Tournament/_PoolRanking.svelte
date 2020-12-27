<script lang="ts">
  import { get } from "svelte/store";

  import type { Pool } from "../../data/pool";
  import { getPoolStandingById } from "../../data/pool-functions";
  export let pool: Pool;

  var poolStanding = get(getPoolStandingById(pool.id));
</script>

<style>
  table {
    border-collapse: collapse;
    width: 600px;
    max-width: 100%;
  }
  th,
  td {
    font-variant-numeric: tabular-nums;
    min-width: 20px;
    border-bottom: 1px solid #f5f5f5;
    padding: 4px;
  }
  th {
    text-align: center;
    color: #70757a;
    font-weight: normal;
    font-size: small;
  }

  .position {
    text-align: center;
  }

  .points {
    text-align: center;
  }
  .flex3 {
    display: grid;
    grid-template-columns: 1fr 2ch 1fr;
  }
  .left {
    font-variant-numeric: tabular-nums;
    text-align: right;
  }
  .center {
    text-align: center;
  }
  .right {
    font-variant-numeric: tabular-nums;
    text-align: left;
  }
</style>

<table>
  <thead>
    <tr>
      <th colspan="2" style="text-align: left">Speler</th>
      <!-- <th>Rating</th> -->
      <th>P</th>
      <th style="text-align: center">Matches</th>
      <th>Games</th>
      <!-- <th>Punten</th> -->
    </tr>
  </thead>
  {#each poolStanding.items as poolStandingItem}
    <tr>
      <td class="position">{poolStandingItem.position}</td>
      <td class="name">
        {poolStandingItem.playerInfo.name}
        ({poolStandingItem.playerInfo.club})
      </td>
      <!-- <td class="rating">{poolStandingItem.playerInfo.rating}</td> -->
      <td class="points">{poolStandingItem.points}</td>
      <td>
        <div class="flex3">
          <div class="left">{poolStandingItem.matchesWon}</div>
          <div class="center">-</div>
          <div class="right">{poolStandingItem.matchesLost}</div>
        </div>
      </td>
      <td>
        <div class="flex3">
          <div class="left">{poolStandingItem.gamesWon}</div>
          <div class="center">-</div>
          <div class="right">{poolStandingItem.gamesLost}</div>
        </div>
      </td>
      <!-- <td>
        <div class="flex3">
          <div class="left">{poolStandingItem.pointsWon}</div>
          <div class="center">-</div>
          <div class="right">{poolStandingItem.pointsLost}</div>
        </div>
      </td> -->
    </tr>
  {/each}
</table>
