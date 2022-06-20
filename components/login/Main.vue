<template>
    <div class="container-fluid h-100 w-100" id="content_wrap">
        <div class="position-relative h-100 w-100">
            <div id="login_panel">
                <form method="POST" action="#">
                    <div class="row w-100 h-100" style="">
                        <div class="col-12 col-sm-12 col-md-6 offset-md-3 col-lg-4 offset-lg-4 w-100 pr-0">
                            <div class="card">
                                <div class="card-header">
                                    <h5 class="text-center">Login</h5>
                                </div>
                                <div class="card-body">
                                    <div class="form-group">
                                        <label class="login-text">User Domain</label>
                                        <div class="input-group">
                                            <input v-model="username_input" type="text" class="form-control" placeholder="User Domain..." autofocus>
                                            <div class="input-group-append">
                                                <div class="btn btn-primary login-normal-cursor">
                                                    <font-awesome-icon :icon="['fa', 'user']"/>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <label class="login-text">Password</label>
                                        <div class="input-group">
                                            <input v-model="password_input" type="password" class="form-control" placeholder="Password..." autofocus>
                                            <div class="input-group-append">
                                                <div class="btn btn-primary login-normal-cursor">
                                                    <font-awesome-icon :icon="['fa', 'lock']"/>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <div class="input-group justify-content-between">
                                            <!-- <div class="input-group-prepend ml-4">
                                                <input type="checkbox" class="form-check-input" v-model="remember_me_input">
                                                <label class="form-check-label">Remember me</label>
                                            </div> -->
                                            <button type="button" class="btn btn-primary" v-on:click="actionLogin">Sign In</button>
                                        </div>
                                    </div>
                                    </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
    const CryptoJS = require("crypto-js");
    export default {
        data() {
            return {
                username_input: '',
                password_input: '',
                remember_me_input: false
            }
        },
        methods: {
            actionLogin() {
                let config = {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
                this.$axios.$post(`/api/login`, {
                    user_domain: this.username_input,
                    password: this.password_input
                }, config)
                .then((response) => {
                    if(response.status == 'OK') {
                        let {data} = response
                        let {token, hasWorkspace} = data
                        const ciphertext = CryptoJS.AES.encrypt(
                            token,
                            process.env.SALT_KEY
                        ).toString();
                        this.$store.commit("auth/credentials", token);
                        this.$cookies.set("credentials", ciphertext, {
                            path: "/",
                        });
                        window.location.href = '/'
                    }
                })
                .catch()
            }
        }
    }
</script>