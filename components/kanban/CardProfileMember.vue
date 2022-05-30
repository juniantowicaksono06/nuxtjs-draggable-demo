<style>
    @import '../assets/styles/kanban-profile-card.css';
</style>
<template>
    <div class="card" @click.stop="">
        <div class="card-header py-1 px-2 bg-primary text-white profile-head">
            <div class="float-right">
                <div class="btn btn-transparent mb-0 mt-0 px-0 py-0 text-white">
                    <font-awesome-icon :icon="['fa', 'xmark']" v-on:click="close" />
                </div>
            </div>
            <div class="d-flex mt-2">
                <div>
                    <img :src="this.data.profile_data.profile_pic" class="profile-pic rounded-circle"/>
                </div>

                <div class="profile-info">
                    <h5 class="mb-0 ml-2 mt-2 profile-fullname">{{ this.data.profile_data.full_name }}</h5>
                    <h6 class="ml-2 kanban-text profile-email">{{ this.data.profile_data.email }}</h6>
                </div>
            </div>
        </div>
        <div class="card-body px-0 py-1 mt-4 profile-body">
            <div class="profile-list-option" v-on:click="removeMember(data.profile_data.user_id)">
                <h6 class="mb-0">Remove from card</h6>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                item_data: this.data.item_data
            }
        },
        props: {
            data: {
                type: Object
            },
            close: {
                type: Function
            }
        },
        mounted() {
        },
        methods: {
            removeMember(user_id) {
                let member_exist = false
                let index = null;
                for(let i = 0; i < this.data.item_data.members.length; i++) {
                    if(this.data.item_data.members[i].user_id == user_id) {
                        member_exist = true
                        index = i
                        break
                    }
                }
                if(member_exist) {
                    this.data.item_data.members.splice(index, 1)
                    this.close()
                }
            },
        }
    }
</script>