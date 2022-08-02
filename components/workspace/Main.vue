<!-- <style>
    @import '../assets/styles/kanban.css';
</style> -->
<style scoped>
</style>
<template>
    <div class="w-100 h-100">
        <div class="d-flex w-100 position-relative h-100">
            <Content :key="contentKey" />
        </div>
    </div>
</template>
<script>
    // import Sidebar from "./WorkspaceSidebar.vue";
    import Content from "./WorkspaceContent.vue";
    export default {
        data() {
            return {
                sidebarKey: 0,
                contentKey: 0
            }
        },
        mounted() {
        },
        methods: {
        },
        components: {
            // Sidebar,
            Content
        },
    }
</script>
