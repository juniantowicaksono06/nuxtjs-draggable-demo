<template>
    <Report />
</template>
<script>
    import Report from '../components/report/Main.vue'
    export default {
        middleware: ['hasworkspace'],
        name: 'ReportPage',
        head() {
            return {
                title: 'Report'
            }
        },
        components: {
            Report
        }
    }
</script>