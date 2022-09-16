<template>
    <Ideation />
</template>
<script>
    import Ideation from '../components/ideation/Main.vue'
    export default {
        components: {
            Ideation
        },
        middleware: ['hasworkspace'],
        name: 'IdeationPage',
        head() {
            return {
                title: 'Ideation'
            }
        }
    }
</script>