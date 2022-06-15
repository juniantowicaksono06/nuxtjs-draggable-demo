<template>
    <Workspace/>
</template>

<script>
    import Workspace from '../components/workspace/Main.vue'
    export default {
        name: "WorkspacePage",
        components: {
            Workspace
        },
        head() {
            return {
                title: 'Workspace'
            }
        }
    }
</script>