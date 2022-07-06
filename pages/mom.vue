<template>
    <MOM/>
</template>
<script>
    import MOM from '../components/mom/Main.vue'
    export default {
        middleware: ['hasworkspace'],
        name: 'MOMPage',
        head() {
            return {
                title: 'MOM'
            }
        },
        components: {
            MOM
        }
    }
</script>