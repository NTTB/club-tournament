<script lang="ts">
  import { get } from "svelte/store";
  import {
    getPlayersFromTournament,
    addPlayerToTournament,
  } from "../data/tournament-player-functions";
  import type { Club } from "../data/club";
  import { PlayerData } from "../data-players";

  export let tournamentId: number;
  export let club: Club = undefined;

  function addAllOfClub() {
    var tournamentPlayers = get(getPlayersFromTournament(tournamentId));
    const clubPlayers = PlayerData.filter((x) => x.club === club.name);

    const missingClubPlayers = clubPlayers.filter(
      (cp) => !tournamentPlayers.some((tp) => tp.nttbId === cp.id)
    );

    missingClubPlayers.forEach((player) => {
      addPlayerToTournament(
        +tournamentId,
        {
          class: player.class,
          club: player.club,
          img: player.img,
          name: player.name,
          rating: player.rating,
        },
        player.id
      );
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
