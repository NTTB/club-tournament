<script lang="ts">
  import MdAddCircleOutline from "svelte-icons/md/MdAddCircleOutline.svelte";
  import type { Club } from "../data/club";
  import { tournamentPlayers, META } from "../data/tournament-player";
  import { PlayerData } from "../data-players";
  export let club: Club = undefined;

  function addAllOfClub() {
    tournamentPlayers.update((tournamentPlayers) => {
      const clubPlayers = PlayerData.filter((x) => x.club === club.name);

      const missingClubPlayers = clubPlayers.filter(
        (cp) => !tournamentPlayers.some((tp) => tp.nttbId === cp.id)
      );

      missingClubPlayers.forEach((player) => {
        tournamentPlayers.push({
          id: META.nextId++,
          info: {
            class: player.class,
            club: player.club,
            img: player.img,
            name: player.name,
            rating: player.rating,
          },
          nttbId: player.id,
        });
      });
      return tournamentPlayers;
    });
  }
</script>

<style>
  .card {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 48px;
    padding: 8px;
    border-top: 1px solid black;
  }
  .text {
    justify-self: center;
    align-self: center;
  }
</style>

<div class="card" on:click={addAllOfClub}>
  <div class="text">Spelers van {club.name} toevoegen...</div>
</div>
