<script lang="ts">
  import type { CustomPlayer } from "../data/custom-player/custom-player";
  import { customPlayerService } from "../data/custom-player/custom-player.service";

  export let players: CustomPlayer[] = [];

  function deleteCustomPlayer(player: CustomPlayer) {
    customPlayerService.destroy(player);
  }
</script>

<table>
  <thead>
    <tr>
      <th class="actions" />
      <th>Naam</th>
      <th>Club</th>
      <th>Rating</th>
      <th>Klass</th>
      <th class="actions" />
    </tr>
  </thead>
  <tbody>
    {#each players as player}
      <tr>
        <td>
          <button>➕</button>
        </td>
        <td>{player.name}</td>
        <td>{player.club}</td>
        <td>{player.rating}</td>
        <td>{player.class}</td>
        <td><button on:click={() => deleteCustomPlayer(player)}>❌</button></td>
      </tr>
    {/each}
  </tbody>
</table>

<style>
  table {
    width: 100%;
  }
  .checkbox {
    width: 2ch;
  }
  .actions {
    width: 1px;
  }

  th {
    text-align: left;
  }
</style>
