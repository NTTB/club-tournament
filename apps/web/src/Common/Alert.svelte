<script lang="ts">
  export var type: "success" | "danger" | "warning" = "warning";
</script>

<div class="alert alert-{type}">
  <slot />
</div>

<style>
  .alert {
    /* From bootstrap 5.2 alert */
    --alert-danger-color: #842029;
    --alert-danger-background-color: #f8d7da;
    --alert-danger-border-color: #f5c2c7;

    --alert-warning-color: #664d03;
    --alert-warning-background-color: #fff3cd;
    --alert-warning-border-color: #ffecb5;

    --alert-success-color: #0f5132;
    --alert-success-background-color: #d1e7dd;
    --alert-success-border-color: #badbcc;

    
    padding: 8px;
    border-radius: 4px;
    margin-bottom: 8px;
  }

  .alert-danger {
    color: var(--alert-danger-color);
    background-color: var(--alert-danger-background-color);
    border: 1px solid var(--alert-danger-border-color);

  }

  .alert-success {
    color: var(--alert-success-color);
    background-color: var(--alert-success-background-color);
    border: 1px solid var(--alert-success-border-color);
  }

  .alert-warning {
    color: var(--alert-warning-color);
    background-color: var(--alert-warning-background-color);
    border: 1px solid var(--alert-warning-border-color);
  }
</style>
