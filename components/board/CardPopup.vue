<!-- <style>
    @import '../assets/styles/kanban-add-to-card.css';
</style> -->
<template>
    <div class="card">
        <div class="card-header">
            <h6 class="text-center mb-0">
                <span v-if="(data.card_type == 'members')">Members</span>
                <span v-if="(data.card_type == 'checklist')">Checklist</span>
                <span v-if="(data.card_type == 'dates')">Dates</span>
                <span v-if="(data.card_type == 'confirmation')">Confirmation</span>
                <span class="float-right hover-pointer" v-on:click="closeCardPopUp">
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
                        <div id="member_list_container">
                            <div v-for="(member, member_index) in all_members" v-if="(member.name.toLowerCase().includes(search_member.toLowerCase()) || search_member.trim() == '' || member.email.toLowerCase().includes(search_member.toLowerCase()))" v-on:click="toggleMember($event, member)">
                                <div class="d-flex member-list-item mb-2">
                                    <div v-if="member.profile_pic">
                                        <img :src="member.profile_pic" style="width: 32px;"  class="rounded-circle" />
                                    </div>
                                    <div class="profile-pic-thumbs bg-primary text-white py-1 text-center rounded-circle" v-else style="width: 42px;">
                                        {{ generateProfileName(member.name) }}
                                    </div>
                                    <p class="mb-0 mt-1 ml-2 profile-fullname member-fullname">{{ member.name }}</p>
                                    <p class="mb-0 mt-1" v-for="selected in selected_members" v-if="(member._id == selected._id)"><font-awesome-icon :icon="['fa', 'check']" /></p>
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
                        <button class="btn btn-primary kanban-text" v-on:click="addChecklist">
                            Add
                        </button>
                    </div>
                </div>
            </div>
            <div id="dates_type" :class="(data.card_type == 'dates' ? 'type-active': 'type-inactive')">
                <b-row>
                    <b-col md="auto" style="margin: 0 auto;">
                        <b-calendar v-model="selected_date" locale="en-US" hide-header></b-calendar>
                    </b-col>
                </b-row>
                <div class="mt-2 px-2">
                    <div class="mt-2 mb-2">
                        <button class="btn btn-block btn-primary" v-on:click="saveDeadline">
                            Save
                        </button>
                        <button class="btn btn-block btn-light" v-on:click="removeDeadline" v-if="(deadline.date)">
                            Remove
                        </button>
                    </div>
                </div>
            </div>
            <div id="confirmation">
                
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
                selected_date: this.data.data_item.deadline.date == null ? this.currentDate() : this.data.data_item.deadline.date,
                deadline: this.data.data_item.deadline,
                date_context: null,
                all_members: [],
                selected_members: this.data.data_item.members,
                checklist: this.data.data_item.checklists
            }
        },
        props: {
            data: {
                type: Object
            },
            closeCardPopUp: {
                type: Function
            },
            generateProfileName: {
                type: Function
            },
            removeChecklist: {
                type: Function
            },
            confirmed: {
                type: Function
            }
        },
        mounted() {
            this.loadMembers()
        },
        methods: {
            loadMembers() {
                    this.$axios.$get(`${process.env.BACKEND_URL}/api/member`)
                    .then((response) => {
                        if(response.status == 'OK') {
                            let {data} = response
                            this.all_members = data
                            return
                        }
                        alert('Telah terjadi kesalahan')
                    }) 
                    .catch((error) => {
                        alert('Error: Telah terjadi kesalahan')
                    })
            },
            saveDeadline() {
                let config = {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
                this.$axios.$put(`${process.env.BACKEND_URL}/api/card`, {
                    id: this.data.data_item._id,
                    deadline: {
                        done: false,
                        date: this.selected_date
                    }
                }, config)
                .then((response) => {
                    if(response.status == 'OK') {
                        // Do Something
                        this.data.data_item.deadline.date = this.selected_date
                        this.closeCardPopUp()
                    }
                })
                .catch((error) => {
                    alert("Error: Telah terjadi kesalahan")
                })
            },
            removeDeadline() {
                let config = {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
                this.$axios.$put(`${process.env.BACKEND_URL}/api/card`, {
                    id: this.data.data_item._id,
                    deadline: {
                        done: false,
                    }
                }, config)
                .then((response) => {
                    if(response.status != 'OK') return
                    this.data.data_item.deadline = {
                        date: null,
                        done: false
                    }
                })
                .catch((error) => {
                    alert("Error: Telah terjadi kesalahan")
                })
                this.closeCardPopUp()
            },
            currentDate() {
                let d = new Date()
                return `${d.getFullYear()} ${d.getMonth()} ${d.getDate()}`
            },
            onContext(ctx) {
                this.date_context = ctx
            },
            addChecklist() {
                let config = {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }
                this.$axios.$post(`${process.env.BACKEND_URL}/api/card/checklist`, new URLSearchParams({
                    name: this.checklist_name,
                    card_id: this.data.data_item._id
                }), config)
                .then((response) => {
                    if(response.status == 'OK') {
                        let {data} = response
                        this.checklist.push({
                            '_id': data._id,
                            'name': this.checklist_name,
                            'childs': []
                        }) 
                        this.checklist_name = ''
                        return
                    }
                    alert('Telah terjadi kesalahan')
                }) 
                .catch((error) => {
                    alert('Error: Telah terjadi kesalahan')
                })
            },
            toggleMember(event, member) {
                let member_exist = false
                let index = null;
                let members_id = []
                for(let a = 0; a < this.selected_members.length; a++) {
                   if(this.selected_members[a]._id == member._id && index === null) {
                       member_exist = true
                       index = a
                   }
                   members_id.push(this.selected_members[a]._id)
                }
                // ADD MEMBER
                if(!member_exist) {
                    this.selected_members.push(member)
                    members_id.push(member._id)
                }
                // DELETE MEMBER
                else {
                    this.selected_members.splice(index, 1)
                    members_id.splice(index, 1)
                }
                let config = {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
                this.$axios.$put(`${process.env.BACKEND_URL}/api/card`, {
                    id: this.data.data_item._id,
                    members: members_id
                }, config)
                .then((response) => {
                    if(response.status == 'OK') {
                        // Do Something
                    }
                })
                .catch((error) => {
                    alert("Error: Telah terjadi kesalahan")
                })
            }
        }
    }
</script>