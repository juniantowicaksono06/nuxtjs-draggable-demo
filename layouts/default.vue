<template>
    <Nuxt />
</template>

<script>
    const CryptoJS = require("crypto-js");
    export default {
        middleware: ['auth'],
        beforeMount() {
            if (this.$cookies.get('credentials')) {
                const bytes  = CryptoJS.AES.decrypt(this.$cookies.get('credentials'), process.env.SALT_KEY);
                const originalText = bytes.toString(CryptoJS.enc.Utf8);
                this.$store.commit('auth/credentials', originalText) 
                console.log(this.$store.state.auth.credentials)
            }
        }
    }
</script>