<script lang="ts">
  import { tournamentName } from "../data/tournament";
  import { derived } from "svelte/store";
  import Header from "./Header.svelte";

  const title = derived(tournamentName, (v) => {
    if (v.trim().length === 0) {
      return "Nieuw toernooi";
    } else {
      return v;
    }
  });
</script>

<Header title={$title} />
