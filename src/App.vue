<template>
  <!-- insert whichever permanent components you want here -->
  <!-- you might not want any and that is fine -->
  <main>
    <router-view :key="$route.path" />
  </main>
</template>

<script>
// import whichever components you want to render permanently

export default {
  name: 'App'
}
</script>

<style>

</style>
