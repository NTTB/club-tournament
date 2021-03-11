<script lang="ts">
  export let win: number;
  export let lose: number;
</script>

<div class="container">
  <div class="win">{win}</div>
  <div class="seperator">-</div>
  <div class="lose">{lose}</div>
</div>

<style>
  .container {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    gap: 6px;
  }
  .seperator {
    text-align: center;
  }
  .win {
    text-align: right;
  }
  .lose {
    text-align: left;
  }
</style>
