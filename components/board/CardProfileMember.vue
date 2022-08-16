<template>
    <div :class="(show ? 'profile_pop_up d-block' : 'profile_pop_up d-none')" ref="profile_pop_up_ref" style="z-index: 99999;">
        <div class="card" @click.stop="">
            <div class="card-header py-1 px-2 bg-primary text-white profile-head">
                <div class="float-right">
                    <div class="btn btn-transparent mb-0 mt-0 px-0 py-0 text-white" v-on:click="close">
                        <i class="fa fa-times"></i>
                    </div>
                </div>
                <div class="d-flex mt-2" style="flex-shrink: 0;">
                    <div v-if="memberPicture[this.data.current_member._id]" style="flex-shrink: 0;">
                        <img :src="memberPicture[this.data.current_member._id]" class="profile-pic rounded-circle"/>
                    </div>
                    <div style="flex-shrink: 0;" class="profile-pic bg-primary text-white py-4 text-center rounded-circle" v-else>
                        <h2 class="d-inline-block">{{ generateProfileName(this.data.current_member.name) }}</h2>
                    </div>
                    <div class="profile-info">
                        <h5 class="mb-0 ml-2 mt-2 profile-fullname">{{ this.data.current_member.name }}</h5>
                        <h6 class="ml-2 kanban-text profile-email">{{ this.data.current_member.email }}</h6>
                    </div>
                </div>
            </div>
            <div class="card-body px-0 py-1 mt-4 profile-body">
                <div class="profile-list-option" v-on:click="removeMember(data.current_member._id)">
                    <h6 class="mb-0">Remove from card</h6>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                member_list: this.data,
            }
        },
        computed: {
            memberPicture() {
                return this.$store.state.members.board_members_picture
            },
        },
        props: {
            data: {
                type: Object
            },
            close: {
                type: Function
            },
            generateProfileName: {
                type: Function
            },
            show: {
                type: Boolean
            },
            target_element: {
                type: Object
            }
        },
        mounted() {
            window.addEventListener('resize', () => {
                this.setProfileOffset()  
            })
        },
        watch: {
            target_element: function(oldVal, newVal) {
                this.setProfileOffset()
            }
        },
        methods: {
            setProfileOffset() {
                if(this.show) {
                    let getClient = this.$refs.profile_pop_up_ref.getBoundingClientRect()
                    if(getClient.y + getClient.height > window.innerHeight) {
                        this.$refs.profile_pop_up_ref.style.top = (getClient.top - ((getClient.y + getClient.height) - window.innerHeight) - 20) + 'px'
                    }
                    else {
                        let element = this.target_element.data.getBoundingClientRect()
                        this.$refs.profile_pop_up_ref.style.top = (element.y + element.height) + 'px'
                    }
                    if((getClient.x + getClient.width + 20) > window.innerWidth) {
                        this.$refs.profile_pop_up_ref.style.left = (getClient.left - ((getClient.x + getClient.width) - window.innerWidth) - 20) + 'px'
                    }
                    else {
                        let element = this.target_element.data.getBoundingClientRect()
                        this.$refs.profile_pop_up_ref.style.left = (element.x - 10) + 'px'
                    }
                }
            },
            removeMember(user_id) {
                let member_exist = false
                let index = null;
                let members_id = []
                for(let i = 0; i < this.data.item.members.length; i++) {
                    if(this.data.item.members[i]._id == user_id && index == null) {
                        member_exist = true
                        index = i
                    }
                   members_id.push(this.data.item.members[i]._id)
                }
                if(member_exist) {
                    members_id.splice(index, 1)
                    let config = {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }
                    this.$axios.$put(`/api/card`, {
                        id: this.data.item._id,
                        members: members_id
                    }, config)
                    .then((response) => {
                        if(response.status == 'OK') {
                            // Do Something
                            this.data.item.members.splice(index, 1)
                            this.close()
                        }
                    })
                    .catch((error) => {
                        alert("Error: Telah terjadi kesalahan")
                    })
                }
            },
        }
    }
</script>