<style scoped>
.card-label {
    width: auto;
    height: 30px;
    border-radius: 5px;
}
</style>

<template>
    <div class="card">
        <div class="card-header">
            <h6 class="text-center mb-0">
                <span v-if="(data.card_type == 'members' || data.card_type == 'card_members')">Members</span>
                <span v-if="(data.card_type == 'checklist')">Checklist</span>
                <span v-if="(data.card_type == 'dates')">Dates</span>
                <span v-if="(data.card_type == 'label')">Label</span>
                <span v-if="(data.card_type == 'confirmation')">Confirmation</span>
                <span class="float-right hover-pointer" v-on:click="closeCardPopUp">
                    <i class="fa fa-times"></i>
                </span>
            </h6>
        </div>
        <div class="card-body px-1 py-1">
            <!-- MEMBERS TYPES -->
            <div id="card_members_type" :class="(data.card_type == 'card_members' ? 'type-active': 'type-inactive')">
                <div class="row">
                    <div class="col-12">
                        <input class="form-control kanban-text" placeholder="Search members" v-model="search_member" />
                    </div>
                    <div class="col-12 mt-2">
                        <h6>Card members</h6>
                        <div id="member_list_container">
                            <div v-for="(member, member_index) in data.data_item.members" v-if="(member.name.toLowerCase().includes(search_member.toLowerCase()) || search_member.trim() == '' || member.email.toLowerCase().includes(search_member.toLowerCase()))" v-on:click="toggleCardMember($event, member)">
                                <div class="d-flex member-list-item mb-2">
                                    <div v-if="member.picture">
                                        <img :src="member.picture" style="width: 32px;"  class="rounded-circle" />
                                    </div>
                                    <div class="profile-pic-thumbs bg-primary text-white py-1 text-center rounded-circle" v-else style="width: 42px;">
                                        {{ generateProfileName(member.name) }}
                                    </div>
                                    <p class="mb-0 mt-1 ml-2 profile-fullname member-fullname">{{ member.name }}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
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
                                    <div v-if="member.picture">
                                        <img :src="member.picture" style="width: 32px;"  class="rounded-circle" />
                                    </div>
                                    <div class="profile-pic-thumbs bg-primary text-white py-1 text-center rounded-circle" v-else style="width: 42px;">
                                        {{ generateProfileName(member.name) }}
                                    </div>
                                    <p class="mb-0 mt-1 ml-2 profile-fullname member-fullname">{{ member.name }}</p>
                                    <p class="mb-0 mt-1" v-for="selected in data.data_item.members" v-if="(member._id == selected._id)"><i class="fa fa-check"></i></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- CHECKLIST TYPES -->
            <div id="checklist_type" :class="(data.card_type == 'checklist' ? 'type-active': 'type-inactive')">
                <div class="row">
                    <div class="col-12">
                        <input class="form-control kanban-text" placeholder="Title" v-model="checklist_name" v-on:keypress.enter="addChecklist" />
                    </div>
                    <div class="col-12 mt-2">
                        <button class="btn btn-primary kanban-text" v-on:click="addChecklist">
                            Add
                        </button>
                    </div>
                </div>
            </div>
            <!-- DATES TYPES -->
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
            <!-- LABEL TYPES -->
            <div id="label_type" :class="(data.card_type == 'label' ? 'type-active': 'type-inactive')">
                <div class="form-check my-2" v-for="label, index in labels" :key="index">
                    <input class="form-check-input" type="radio" name="cardlabel" v-model="cardLabel" :checked="cardLabel === label._id" @change="selectLabel(label)">
                    <div :class="label.color + ' form-check-label card-label text-white px-3'" >
                        {{ label.name }}
                    </div>
                </div>
                <button class="btn btn-block btn-light" v-if="(data.data_item.labels)" v-on:click="removeLabel">
                    Remove
                </button>
            </div>
            <!-- CONFIRMATION TYPES -->
            <div id="confirmation" :class="(data.card_type == 'confirmation' ? 'type-actice' : 'type-inactive')">
                <div class="px-3">
                    <div>
                        <h6>{{ option.confirm_text }}</h6>
                    </div>
                    <div class="form-group mt-3">
                        <div :class="option.btn_confirm_block ? `${btnYesType} btn-block` : `${btnYesType}`" v-on:click="actionConfirmYes">Yes</div>
                        <div :class="option.btn_confirm_block ? 'btn btn-default btn-block' : 'btn btn-default'" v-on:click="actionConfirmNo">No</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import moment from 'moment'
    export default {
        data() {
            return {
                search_member: '',
                checklist_name: '',
                selected_date: this.data.data_item.deadline.date == null ? this.currentDate() : this.data.data_item.deadline.date,
                deadline: this.data.data_item.deadline,
                date_context: null,
                all_members: this.$store.state.members.board_members,
                cardLabel: null
            }
        },
        watch: {
            'data.data_item.deadline.date': {
                handler: function(value) {
                    this.selected_date = value
                }
            }
        },
        computed: {
            wsInstance: function() {
                return this.$getWsInstance()
            },
            labels: function(){
                return this.$store.state.card.labels
            },
            btnYesType() {
                if(this.option.btn_confirm_yes) return `btn btn-${this.option.btn_confirm_yes}`
                return 'btn btn-success'
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
            option: {
                type: Object
            }
        },
        mounted() {
        },
        methods: {
            actionConfirmNo() {
                this.option.action_confirm_no()
            },
            actionConfirmYes() {
                if(this.option.data) {
                    this.option.action_confirm_yes(...this.option.data)
                }
                else {
                    this.option.action_confirm_yes()
                }
            },
            saveDeadline() {
                let config = {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
                this.$axios.$put(`/api/card`, {
                    id: this.data.data_item._id,
                    deadline: {
                        done: false,
                        date: this.selected_date
                    }
                }, config)
                .then((response) => {
                    if(response.status == 'OK') {
                        let task_total = 0
                        let task_overdue = 0
                        let deadline = moment(this.selected_date).format('YYYY-MM-D')
                        deadline += " 23:59:59"
                        let overdue = moment().isAfter(deadline)
                        if(!this.data.data_item.deadline.date) {
                            if(overdue && !this.data.data_item.deadline.done) {
                                task_overdue++
                            }
                            task_total++
                        }
                        else if(this.data.data_item.deadline.date) {
                            let previous_date = moment(this.data.data_item.deadline.date).format('YYYY-MM-D')
                            let previous_date_overdue = moment().isAfter(previous_date)
                            let deadline = moment(this.selected_date).format('YYYY-MM-D')
                            deadline += '23:59:59'
                            let overdue = moment().isAfter(deadline)
                        }
                        // Do Something
                        this.data.data_item.deadline.date = this.selected_date
                        this.$nextTick(() => {
                            this.$wsEmit({
                                item_id: this.data.data_item._id,
                                data: {
                                    deadline: this.data.data_item.deadline
                                } 
                            }, 'edit_item')
                            this.$wsEmit({
                                board_id: this.$route.query.board_id,
                                data: 'refresh' 
                            }, 'workspace')
                        })
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
                this.$axios.$put(`/api/card`, {
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
                    this.$nextTick(() => {
                        this.$wsEmit({
                            item_id: this.data.data_item._id,
                            data: {
                                deadline: this.data.data_item.deadline
                            },
                        }, 'edit_item')
                        this.$wsEmit({
                            board_id: this.$route.query.board_id,
                            data: 'refresh' 
                        }, 'workspace')
                    })
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
                if(this.checklist_name == '') return
                let config = {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }
                this.$axios.$post(`/api/card/checklist`, new URLSearchParams({
                    name: this.checklist_name,
                    card_id: this.data.data_item._id
                }), config)
                .then((response) => {
                    if(response.status == 'OK') {
                        let {data} = response
                        this.data.data_item.checklists.push({
                            '_id': data._id,
                            'name': this.checklist_name,
                            'childs': []
                        }) 
                        this.$nextTick(() => {
                            this.$wsEmit({
                                item_id: this.data.data_item._id,
                                data: {
                                    checklists: this.data.data_item.checklists
                                },
                            }, 'edit_item')
                        })
                        this.checklist_name = ''
                    }
                }) 
                .catch((error) => {
                    alert('Error: Telah terjadi kesalahan')
                })
            },
            toggleMember(event, member) {
                let member_exist = false
                let index = null;
                let members_id = []
                for(let a = 0; a < this.data.data_item.members.length; a++) {
                   if(this.data.data_item.members[a]._id == member._id && index === null) {
                       member_exist = true
                       index = a
                   }
                   members_id.push(this.data.data_item.members[a]._id)
                }
                // ADD MEMBER
                if(!member_exist) {
                    members_id.push(member._id)
                }
                // DELETE MEMBER
                else {
                    members_id.splice(index, 1)
                }
                let config = {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
                this.$axios.$put(`/api/card`, {
                    id: this.data.data_item._id,
                    members: members_id
                }, config)
                .then((response) => {
                    if(response.status == 'OK') {
                        // Do Something
                        if(!member_exist) {
                            this.data.data_item.members.push(member)
                        }
                        else {
                            this.data.data_item.members.splice(index, 1)
                        }
                        this.$wsEmit({
                            item_id: this.data.data_item._id,
                            data: {
                                members: this.data.data_item.members
                            }
                        }, 'edit_item')
                    }
                })
                .catch((error) => {
                    alert("Error: Telah terjadi kesalahan")
                })
            },
            toggleCardMember(event, member) {
                let config = {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
                this.$axios.$put(`/api/card/checklist/child`, {
                    id: this.data.target.checklistChildId,
                    card_id: this.data.data_item._id,
                    checklist_id: this.data.target.checklistId,
                    member_id: member._id
                }, config)
                .then((response) => {
                    if(response.status == 'OK') {
                        this.data.data_item.checklists[this.data.target.checklistIndex].childs[this.data.target.checklistChildIndex].member_id = member
                        this.closeCardPopUp()
                    }
                })
                .catch((error) => {
                    alert("Error: Telah terjadi kesalahan")
                })
            },
            selectLabel(label){
                this.cardLabel = label._id
                this.$axios.$put('/api/card', {
                    id: this.data.data_item._id,
                    labels: this.cardLabel
                }).then((response) => {
                    if (response.status == 'OK') {
                        this.data.data_item.labels = label
                        this.closeCardPopUp()
                    }
                })
            },
            removeLabel(){
                this.$axios.$put('/api/card', {
                    id: this.data.data_item._id,
                    labels: null
                }).then((response) => {
                    if (response.status == 'OK') {
                        this.data.data_item.labels = null
                        this.closeCardPopUp()
                    }
                })
            }
        }
    }
</script>