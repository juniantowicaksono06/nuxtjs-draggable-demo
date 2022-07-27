<style scoped>
    #upload_file {
        padding: 5px;
        font-size: 14px;
        background-color: #fff;
        border-radius: 50%;
        position: absolute;
        right: -10px;
        top: -15px;
        box-shadow: 0px 0px 5px darkgray;
    }
    #upload_file_exist {
        padding: 5px;
        font-size: 14px;
        background-color: #fff;
        border-radius: 50%;
        position: absolute;
        right: 90px;
        top: -20px;
        box-shadow: 0px 0px 5px darkgray;
    }
    #upload_file:hover, #upload_file_exist:hover {
        color: rgb(10, 143, 196);
    }
    #input_file {
        display: none;
    }
    #user_section {
        position: absolute;
        right: 10px;
        width: 100%;
        z-index: 999;
    }
    #user_menu {
        right: -30px;
        position: absolute;
        border-radius: 5px;
        top: 10px;
        min-width: 300px;
    }
    .user_initial {
        min-width: 64px;
        max-width: 64px;
        margin-left: auto; 
        margin-right: auto; 
        font-size: 32px;
        user-select: none;
        -moz-user-select: none;
        -webkit-user-select: none;
    }
</style>
<template>
    <div>
        <div v-if="is_loading">
            <Loading/>
        </div>
        <div class="position-relative">
            <div class="position-absolute" id="user_section">
                <div class="profile-pic-thumbs border-log-profile-pic-thumbs bg-primary text-white py-1 text-center rounded-circle" v-on:click="toggleUserMenu" v-if="!$store.state.auth.identity.picture" ref="toggle_user_menu_ref">
                    {{ $generateInitialName(this.$store.state.auth.identity.name) }}
                </div>
                <div class="profile-pic-thumbs text-white py-1 text-center rounded-circle" v-on:click="toggleUserMenu" v-else ref="toggle_user_menu_ref">
                    <img :src="$store.state.auth.identity.picture" width="34" alt="" class="rounded-circle">
                </div>
                <div class="position-relative">
                    <div class="card" id="user_menu" v-if="is_user_menu_open">
                        <!-- <button class="btn btn-transparent btn-user" v-on:click="openUploadPhotoModal">
                            Upload Photo
                        </button> -->
                        <div class="px-3 py-2">
                            <div class="form-group text-center">
                                <div class="user_initial d-inline-block bg-primary text-white py-2 text-center rounded-circle" style="" v-if="!$store.state.auth.identity.picture">
                                    {{ $generateInitialName($store.state.auth.identity.name) }}
                                    <div class="position-relative">
                                        <input type="file" id="input_file" ref="input_file_ref" v-on:change="openUploadPhotoModal" accept=".png,.jpg,.jpeg">
                                        <button class="btn btn-default" id="upload_file" v-on:click="selectImage">
                                            <span><i class="fa fa-camera"></i></span>
                                        </button>
                                    </div>
                                </div>
                                <div v-else>
                                    <img :src="$store.state.auth.identity.picture" width="64" alt="" class="rounded-circle">
                                    <div class="position-relative">
                                        <input type="file" id="input_file" ref="input_file_ref" v-on:change="openUploadPhotoModal" accept=".png,.jpg,.jpeg" v-on:click="checkFile">
                                        <button class="btn btn-default" id="upload_file_exist" v-on:click="selectImage">
                                            <span><i class="fa fa-camera"></i></span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <h6 class="text-center">{{ $store.state.auth.identity.name }}</h6>
                            </div>
                        </div>
                        <div class="form-group" style="margin: 10px auto;">
                            <button class="btn btn-danger" v-on:click="actionLogout">
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <b-modal id="upload_photo_modal" hide-footer size="md" title="Upload Photo">
            <div v-if="cropped_image_url == null">
                <Cropper 
                    ref="cropper_ref" 
                    class="example-cropper" 
                    :src="original_pic_url"
                    :stencil-component="$options.components.Stencil" />
                <div class="mt-3">
                    <button class="btn btn-success btn-block" v-on:click="cropImage">
                        <i class="fa fa-cut"></i> Crop
                    </button>
                </div>
            </div>
            <div v-else>
                <img :src="cropped_image_url" class="w-100" alt="">
                <div class="mt-3">
                    <button class="btn btn-primary btn-block" v-on:click="updateImage">
                        <i class="fa fa-upload"></i> Upload
                    </button>
                </div>
            </div>
        </b-modal>
    </div>
</template>
<script>
    import { Cropper } from 'vue-advanced-cropper'
    import Stencil from './Stencil.vue'
    import Swal from 'sweetalert2'
    import Loading from './Loading.vue'
    export default {
        data() {
            return {
                original_pic_url: null,
                is_user_menu_open: false,
                cropped_image_url: null,
                compress_image: null,
                is_loading: false,
                file_dialog_open: false,
            }
        },
        mounted() {
            document.addEventListener('click', this.onClickOutside)
        },
        beforeDestroy() {
            document.removeEventListener('click', this.onClickOutside)
        },
        methods: {
            actionLogout() {
                this.$cookies.remove('credentials');
                this.$router.push('/login/');
            },
            selectImage() {
                this.file_dialog_open = true
                this.$refs.input_file_ref.click()
            },
            updateImage() {
                if(this.cropped_image_url == null) return false
                this.is_loading = true
                let config = {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
                this.$axios.$post(`/api/member/upload`, {
                    picture: this.compress_image,
                    id: this.$store.state.auth.identity._id
                }, config)
                .then((response) => {
                    if(response.status == 'OK') {
                        Swal.fire({
                            text: 'Profile Picture Updated',
                            toast: true,
                            timer: 3000,
                            position: 'bottom-right',
                            showConfirmButton: false,
                            showCancelButton: false,
                            icon: 'success',
                            title: 'Success'
                        })
                        this.is_loading = false
                        let members = JSON.stringify(this.$store.state.members.all_members)
                        let member = JSON.stringify(this.$store.state.auth.identity)
                        member = JSON.parse(member)
                        members = JSON.parse(members)
                        for(let x = 0; x < members.length; x++) {
                            if(member._id == members[x]._id) {
                                members[x].picture = this.compress_image
                            }
                        }
                        this.$store.commit('members/loadMembers', members)

                        member.picture = this.compress_image

                        this.$store.commit('auth/setProfile', member)

                        this.$bvModal.hide('upload_photo_modal')
                    }
                })
                .catch(error => {
                    this.is_loading = false
                })
            },
            checkFile() {
                document.body.onfocus = () => {
                    document.body.onfocus = null
                    this.file_dialog_open = false
                }
            },
            cropImage() {
                const result = this.$refs.cropper_ref.getResult()
                this.$compressImage(result.canvas.toDataURL(), (res) => {
                    this.cropped_image_url = res.original_image
                    this.compress_image = res.compress_image
                })
            },
            toggleUserMenu() {
                this.is_user_menu_open = !this.is_user_menu_open
            },
            onClickOutside(event) {
                const { toggle_user_menu_ref } = this.$refs
                if(!toggle_user_menu_ref || toggle_user_menu_ref.contains(event.target) || this.file_dialog_open) return
                this.is_user_menu_open = false
            },
            openUploadPhotoModal() {
                this.is_user_menu_open = false
                this.file_dialog_open = false
                this.cropped_image_url = null
                const files = this.$refs.input_file_ref.files
                var file_reader = this.$convertFileTob64(files[0])
                file_reader.onload = () => {
                    this.original_pic_url = file_reader.result
                    this.$bvModal.show('upload_photo_modal')
                }
                file_reader.onerror = (error) => {
                    Swal.fire({
                        text: 'Telah terjadi kesalahan',
                        toast: true,
                        timer: 3000,
                        position: 'bottom-right',
                        showConfirmButton: false,
                        showCancelButton: false,
                        icon: 'error',
                        title: 'Error'
                    })
                }
            },
        },
        components: {
            Cropper,
            Stencil,
            Loading
        }
    }
</script>