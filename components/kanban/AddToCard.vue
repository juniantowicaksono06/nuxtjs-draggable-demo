<style>
    @import '../assets/styles/kanban-add-to-card.css';
</style>
<template>
    <div class="card">
        <div class="card-header">
            <h6 class="text-center mb-0">
                <span v-if="(data.card_type == 'members')">Members</span>
                <span v-if="(data.card_type == 'checklist')">Checklist</span>
                <span v-if="(data.card_type == 'dates')">Dates</span>
                <span class="float-right hover-pointer" v-on:click="closeAddToCard">
                    <font-awesome-icon :icon="['fa', 'xmark']"/>
                </span>
            </h6>
        </div>
        <div class="card-body px-1 py-1">
            <div id="members_type" :class="(data.card_type == 'members' ? 'type-active': 'type-inactive')">
                <div class="row">
                    <div class="col-12">
                        <input class="form-control kanban-text" placeholder="Search members" v-model="search_member" />
                    </div>
                    <div class="col-12 mt-2">
                        <h6>Board members</h6>
                        <div id="member-list-container">
                            <div v-for="(member, member_index) in all_members" v-if="(member.full_name.toLowerCase().includes(search_member.toLowerCase()) || search_member.trim() == '' || member.email.toLowerCase().includes(search_member.toLowerCase()))" v-on:click="toggleMember($event, member)">
                                <div class="d-flex member-list-item mb-2">
                                    <div>
                                        <img :src="member.profile_pic" style="width: 32px;"  class="rounded-circle" />
                                    </div>
                                    <p class="mb-0 mt-1 ml-2 profile-fullname member-fullname">{{ member.full_name }}</p>
                                    <p class="mb-0 mt-1" v-for="selected in selected_members" v-if="(member.user_id == selected.user_id)"><font-awesome-icon :icon="['fa', 'check']" /></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div id="checklist_type" :class="(data.card_type == 'checklist' ? 'type-active': 'type-inactive')">
                <div class="row">
                    <div class="col-12">
                        <input class="form-control kanban-text" placeholder="Title" v-model="checklist_name" />
                    </div>
                    <div class="col-12 mt-2">
                        <button class="btn btn-primary kanban-text">
                            Add
                        </button>
                    </div>
                </div>
            </div>
            <div id="dates_type" :class="(data.card_type == 'dates' ? 'type-active': 'type-inactive')">
                <div>dates</div>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                search_member: '',
                checklist_name: '',
                all_members: [
                    {
                        'user_id': 1,
                        'full_name': 'Junianto Ichwan Dwi Wicaksono',
                        'email': 'juniantowicaksono06@gmail.com',
                        'profile_pic': 'https://play-lh.googleusercontent.com/xlnwmXFvzc9Avfl1ppJVURc7f3WynHvlA749D1lPjT-_bxycZIj3mODkNV_GfIKOYJmG'
                    },
                    {
                        'user_id': 2,
                        'full_name': 'Arif Romdoni',
                        'email': 'arif98@gmail.com',
                        'profile_pic': 'https://i.pinimg.com/550x/c4/e6/d5/c4e6d51d4910f37051a67c48a1b5498b.jpg'
                    },
                    {
                        'user_id': 3,
                        'full_name': 'Ahmad Fadil',
                        'email': 'jackhammer@gmail.com',
                        'profile_pic': 'https://i.pinimg.com/originals/fd/f4/18/fdf41862cf42f0c0cf4ca627c74cbece.jpg'
                    },
                    {
                        'user_id': 4,
                        'full_name': 'Septian',
                        'email': 'septianz98@gmail.com',
                        'profile_pic': 'https://avatarfiles.alphacoders.com/302/302948.png'
                    },
                ],
                selected_members: this.data.data_item.members
            }
        },
        props: {
            data: {
                type: Object
            },
            closeAddToCard: {
                type: Function
            }
        },
        mounted() {
        },
        methods: {
            toggleMember(event, member) {
                let member_exist = false
                let index = null;
                for(let a = 0; a < this.selected_members.length; a++) {
                   if(this.selected_members[a].user_id == member.user_id) {
                       member_exist = true
                       index = a
                       break;
                   }
                }
                // ADD MEMBER
                if(!member_exist) {
                    this.selected_members.push(member)
                }
                // DELETE MEMBER
                else {
                    this.selected_members.splice(index, 1)
                }
            }
        }
    }
</script>