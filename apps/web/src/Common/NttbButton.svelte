<script lang="ts">
  export var disabled: boolean = false;
</script>

<style>
  button {
    background-color: var(--nttb-orange);
    color: var(--text-white);
    font-size: 16px;
    border: none;
    border-radius: 5px;
    padding: 16px 32px;
    text-transform: uppercase;
    font-weight: bold;
  }
  button:disabled {
    filter: grayscale(40%);
  }
</style>

<button {disabled} on:click><slot /></button>
