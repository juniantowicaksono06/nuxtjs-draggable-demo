<style scoped>
    .loading-container {
        width: 100%;
        height: 100%;
        background-color: rgba(255, 255, 255, 0.705);
        position: fixed;
        top: 0;
        left: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 99999;
    }
</style>
<template>
    <div class="loading-container">
        <div>
            <ClipLoader color="red" size="50px" />
        </div>
    </div>
</template>
<script>
    import ClipLoader from 'vue-spinner/src/ClipLoader.vue'
    export default {
        components: {
            ClipLoader
        }
    }
</script>