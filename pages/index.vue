<template>
    <Workspace/>
</template>

<script>
    import Workspace from '../components/workspace/Main.vue'
    export default {
        middleware: ['hasworkspace'],
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