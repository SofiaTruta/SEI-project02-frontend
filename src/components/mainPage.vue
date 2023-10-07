<template>
    <!-- conditional rendering: if not logged in, redirect to '/login'-->
    <div class="main-page-container">
        <navBar />
    </div>
</template>

<script>
import navBar from './navBar.vue'
export default {
    name: 'mainPage',
    components: {
        navBar
    }
}
</script>