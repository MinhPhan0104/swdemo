<script lang="ts">
</script>

<div class="text-center">
  <div class="inside-style-tag">Style inside style tag with postcss</div>
  <div class="text-5xl text-pink">Style directly with class</div>
</div>

<style lang="postcss">
  .inside-style-tag {
    @apply text-[blue];
  }
</style>
