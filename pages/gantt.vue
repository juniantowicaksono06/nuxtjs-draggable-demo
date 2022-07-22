<template>
    <Gantt/>
</template>
<script>
    import Gantt from '../components/gantt/Main.vue'
    export default {
        components: {
            Gantt
        },
        middleware: ['hasworkspace'],
        name: 'GanttPage',
        head() {
            return {
                title: 'Gantt Chart'
            }
        },
    }
</script>