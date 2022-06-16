<template>
    <Login/>
</template>

<script>
    import Login from '../components/login/Main.vue'
    export default {
        name: "LoginPage",
        layout: 'empty',
        // middleware: ['authenticated'],
        components: { Login },
        head() {
            return {
                title: 'Login Page'
            }
        }
    }
</script>