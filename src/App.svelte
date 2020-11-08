<script lang="ts">
  import { currentPageComponent } from "./routes";
</script>

<style>
  @import url("https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,400;0,700;1,300;1,400&display=swap");
  :root {
    --nttb-blue: #262acc;
    --nttb-orange: #f4612d;
    --text-white: white;
    --text-dimmed-black: rgb(84, 84, 84);
    --font-family-default: "Roboto", sans-serif;
  }

  :global(body) {
    font-family: var(--font-family-default);
    margin: 0;
    padding: 0;
  }
  :global(input),
  :global(select) {
    border: 1px solid black;
    border-radius: 3px;
    padding: 8px 10px;

    width: 100%;
    font-size: 14px;
  }
</style>

<main>
  <svelte:component this={$currentPageComponent} />
</main>
