<style scoped>
    #login_panel {
        position: absolute;
        top: 50%;
        left: 1%;
        transform: translateY(-50%);
        -moz-transform: translateY(-50%);
        -webkit-transform: translateY(-50%);
        width: 100%;
    }
    .login-text {
        font-size: 0.85em;
    }
    .login-normal-cursor:hover {
        cursor: default !important;
    }
</style>
<template>
    <div class="container-fluid h-100 w-100" id="content_wrap">
        <div class="position-relative h-100 w-100">
            <div v-if="isLoading">
                <Loading/>
            </div>
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
                                                    <i class="fa fa-user"></i>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="form-error text-danger">
                                            <span class="kanban-text">{{ username_error }}</span>
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <label class="login-text">Password</label>
                                        <div class="input-group">
                                            <input v-model="password_input" type="password" class="form-control" placeholder="Password..." autofocus>
                                            <div class="input-group-append">
                                                <div class="btn btn-primary login-normal-cursor">
                                                    <i class="fa fa-lock"></i>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="form-error text-danger">
                                            <span class="kanban-text">{{ password_error }}</span>
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
    import Loading from "../global/Loading.vue";
    const CryptoJS = require("crypto-js");
    export default {
        components: {
            Loading
        },
        data() {
            return {
                username_error: '',
                username_input: '',
                password_input: '',
                password_error: '',
                remember_me_input: false,
                isLoading: false
            }
        },
        methods: {
            triggerWarning(type = '') {
                this.username_error = ''
                this.password_error = ''
                if(type == 'empty') {
                    if(this.username_input.trim() == '') {
                        this.username_error = 'Username cannot be empty'
                    }
                    if(this.password_input.trim() == '') {
                        this.password_error = 'Password cannot be empty'
                    }
                }
            },
            actionLogin() {
                this.isLoading = true
                if(this.username_input.trim() == '' || this.password_input.trim() == '') {
                    this.triggerWarning('empty'); 
                    return
                }
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
                        // window.location.href = '/'
                        this.isLoading = false
                        this.$router.push('/')
                    }
                })
                .catch()
            }
        }
    }
</script>