<template>
    <div class="card kanban-item mb-1 mt-1" v-on:click="showModalItem($event, item, kanban_name)">
        <div class="py-2 px-2">
            <span class="kanban-text">{{ item.name }}</span>
        </div>
        <div class="w-100" v-if="(item.members.length > 0 || item.checklists.length > 0 || item.deadline.date != null)">
            <div class="float-left px-2 mb-2">
                <div class="d-flex" v-if="(item.checklists.length > 0 || item.deadline.date != null)">
                    <span :class="(countChecklistChild.done ? 'badge badge-success kanban-text mr-2': 'kanban-text mr-2')" v-if="item.checklists.length > 0">
                        <font-awesome-icon class="ml-1" :icon="['fa', 'list-check']"/><span class="pl-1 pr-1 kanban-text">{{ countChecklistChild.checklist_done }}/{{ countChecklistChild.total_checklist }}</span>
                    </span>
                    <span :class="(item.deadline.done ? 'badge badge-success kanban-text mr-2 deadline-badge' : isDeadline(item.deadline.date) ? 'badge badge-danger kanban-text mr-2 deadline-badge' : 'kanban-text mr-2 deadline-badge')" v-if="item.deadline.date != null">
                        <font-awesome-icon class="mr-1 kanban-text" :icon="['fa', 'clock']"/>
                        <input type="checkbox" class="d-inline-block" v-model="item.deadline.done" @click.stop="" v-on:click="toggleDeadline" />
                        <span>{{ convertDate(item.deadline.date) }}</span>
                    </span>
                </div>
            </div>
            <div class="float-right profile-pic-container justify-content-end">
                <div v-for="(member, member_index) in item.members" class="px-1 py-1 position-relative  member" v-on:click="openProfileCard($event, member, item)" ref="card_info_ref" @click.stop="" data-toggle="tooltip" data-placement="top" :title="member.name">
                    <img :src="member.profile_pic" class="profile-pic-thumbs rounded-circle" v-if="(typeof member.profile_pic != 'undefined' && member.profile_pic != '')" />
                    <div class="profile-pic-thumbs bg-primary text-white py-1 text-center rounded-circle" v-else>
                        {{ generateProfileName(member.name) }}
                    </div>
                </div> 
            </div>
        </div>
        <div class="modal">
            <b-modal class="modal-item" v-model="show_modal" @hide="closePopUp" hide-footer size="lg" hide-header>
                <div class="container-fluid" v-on:click="closePopUp">
                    <div class="d-flex justify-content-between" id="modal_header">
                        <div class="mb-1" style="width: 90%;">
                            <input class="ml-0 pl-0 pr-0 mr-0 input-transparent" v-model="item.name" v-on:blur="changeItemName()" />
                            <h6 class="pr-0 no-select">in list <b>{{ kanban_name }}</b></h6>
                        </div>
                        <div style="width: 10%; margin: 0 auto; text-align: right;">
                            <button class="btn btn-transparent" v-on:click="hideModalItem($event)">
                                <font-awesome-icon :icon="['fa', 'xmark']" />        
                            </button>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-12">
                            <div id="member_and_deadline_container">
                                <div>
                                    <h6 class="kanban-text" v-if="item.members.length > 0">Members</h6>
                                    <div v-for="member in item.members" class="px-1 py-1 position-relative member hover-pointer d-inline-block" v-on:click="openProfileCard($event, member, item)" ref="card_info_ref" @click.stop="" data-toggle="tooltip" data-placement="top" :title="member.full_name">
                                        <img :src="member.profile_pic" class="profile-pic-thumbs rounded-circle" v-if="(typeof member.profile_pic != 'undefined' && member.profile_pic != '')" />
                                        <div class="profile-pic-thumbs bg-primary text-white text-center py-1 rounded-circle" v-else>
                                            {{ generateProfileName(member.name) }}
                                        </div>
                                    </div>                               
                                    <div class="px-1 py-1 position-relative member hover-pointer d-inline-block" ref="card_info_ref" @click.stop="" data-toggle="tooltip" data-placement="top" title="Add member" style="margin: auto 0;" v-if="item.members.length > 0" v-on:click="showCardPopUp($event, 'members')">
                                        <p class="px-0 py-1 profile-pic-thumbs rounded-circle" style="text-align: center; margin: auto 0;background-color: #E5E7EB;">
                                            <span><font-awesome-icon :icon="['fa', 'plus']" /></span>
                                        </p>
                                    </div>                               
                                </div>
                                <div v-if="item.deadline.date != null">
                                    <h6 class="kanban-text">Due date</h6>
                                    <div style="margin: auto;">
                                        <input type="checkbox" class="d-inline-block mt-2 mr-1" v-model="item.deadline.done" v-on:click="toggleDeadline" />
                                        <div :class="(item.deadline.done ? 'd-inline-block btn bg-success text-white' : isDeadline(item.deadline.date) ? 'd-inline-block btn bg-danger text-white' : 'd-inline-block btn bg-gray')" v-on:click="showCardPopUp($event, 'dates')" @click.stop="">
                                            <h6 class="kanban-text mb-0">{{ convertDate(item.deadline.date, true) }}</h6>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="row ml-0 pl-0 pr-0" id="modal_content">
                        <div class="col-12 col-sm-12 col-md-9 pl-0 mt-2">
                            <h5 class="ml-0 pl-0 pr-0 no-select font-weight-bold">Description</h5>
                            <textarea class="form-control" placeholder="Add description" v-model="item.task_description" style="resize: none;"></textarea>
                            <!-- CHECKLISTS -->
                            <div class="mt-2 mb-2" v-for="(checklist, checklist_index) in item.checklists" :key="checklist.checklist_id">
                                <div class="d-flex mb-2">
                                    <input class="ml-0 pl-0 pr-0 mr-0 input-transparent" v-model="checklist.name" v-on:blur="changeChecklistName(checklist.name)" />
                                    <span class="btn btn-transparent" v-on:click="deleteChecklist($event, checklist_index, checklist, item.checklists)">
                                        <font-awesome-icon :icon="['fa', 'trash']"/>
                                    </span>
                                </div>
                                <div class="mb-2">
                                    <div class="progress">
                                        <div :class="(Math.round(100 / (checklist.childs.length / countChildChecklistDoneTotal(checklist.childs)) >= 100) ? 'progress-bar bg-success' : 'progress-bar')" role="progressbar" :style="{
                                            'width': Math.round(100 / (checklist.childs.length / countChildChecklistDoneTotal(checklist.childs)))+ '%'
                                        }" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"></div>
                                    </div>
                                </div>
                                <!-- CHECKLIST CHILD -->
                                <div v-for="(child, child_index) in checklist.childs" :key="child._id" class="row mt-2">
                                    <div class="col-1 py-1 pr-0 mr-0">
                                        <input type="checkbox" class="form-control mr-0" :checked="child.done" style="width: 14px; height: 14px;" v-model="child.done" v-on:change="checklistHandle(child.done, child._id, checklist._id)" />
                                    </div>
                                    <div class="col-10 mt-0 px-0">
                                        <!-- <h6 class="kanban-text">{{ child.checklist_child_name }}</h6> -->
                                        <input class="ml-0 pl-0 pt-0 pr-0 mr-0 kanban-text input-transparent" :style="child.done ? {
                                            fontSize: '12px',
                                            fontWeight: 'normal',
                                            textDecoration: 'line-through'
                                        } : {
                                            fontSize: '12px',
                                            fontWeight: 'normal'
                                        }" :readonly="(child.done)" v-model="child.name"  v-on:change="checklistHandle(child.name, child._id, checklist._id, 'name')" />
                                    </div>
                                    <div class="float-right" style="margin-top: -5px;">
                                        <span class="kanban-text btn btn-transparent" v-on:click="deleteChecklistChild($event, child_index, child, checklist.childs, checklist._id)">
                                            <font-awesome-icon :icon="['fa', 'trash']"/>
                                        </span>
                                    </div>
                                </div>
                                <div :class="(add_checklist_child.index == checklist_index && add_checklist_child.enable ? 'd-block' : 'd-none')">
                                    <input class="form-control kanban-text" placeholder="Add an item" v-model="add_checklist_child.item_name" />
                                    <button class="btn btn-primary mt-2 kanban-text" v-on:click="addChecklistChild">Add</button>
                                    <button class="btn btn-transparent mt-2 kanban-text" v-on:click="disableAddChecklistChild()"><font-awesome-icon :icon="['fa', 'xmark']"/></button>
                                </div>
                                <div :class="(add_checklist_child.index == checklist_index && add_checklist_child.enable ? 'd-none' : 'd-block')">
                                    <button class="btn btn-light mt-2 kanban-text" v-on:click="enableAddChecklistChild(checklist_index, checklist._id)">Add an item</button>
                                </div>
                            </div>
                        </div>
                        <div class="col-12 col-sm-12 col-md-3 pl-0">
                            <p class="mb-1 text-bold kanban-text">Add to card</p>
                            <div class="modal-list-option" v-on:click="showCardPopUp($event, 'members')" ref="members_item_ref" @click.stop=''>
                                <font-awesome-icon :icon="['fa', 'user']" class="kanban-text" />
                                <span class="kanban-text ml-2">Member</span>
                            </div>
                            <div class="modal-list-option" v-on:click="showCardPopUp($event, 'checklist')" ref="checklist_item_ref" @click.stop=''>
                                <font-awesome-icon :icon="['fa', 'check']" class="kanban-text" />
                                <span class="kanban-text ml-2">Checklist</span>
                            </div>
                            <div class="modal-list-option" v-on:click="showCardPopUp($event, 'dates')" ref="dates_item_ref" @click.stop=''>
                                <font-awesome-icon :icon="['fa', 'clock']" class="kanban-text" />
                                <span class="kanban-text ml-2">Dates</span>
                            </div>
                        </div>
                    </div>
                    <div id="card_pop_up" ref="card_pop_up_ref" :class="(show_popup ? 'd-block' : 'd-none')" @click.stop="">
                        <CardPopup :data="{
                            card_type: card_type,
                            data_item: item
                        }" 
                        :closeCardPopUp="closeCardPopUp" 
                        :generateProfileName="generateProfileName"
                       />
                    </div>
                </div>
            </b-modal>
        </div>
        <CardProfileMember :data="profile_data" :close="closeProfileCard" :key="profile_key" :generateProfileName="generateProfileName" :show="show_profile" :target_element="{data: target_element_profile}" />
    </div>
</template>
<script>
    import draggable from 'vuedraggable'
    import CardProfileMember from './CardProfileMember.vue'
    import CardPopup from './CardPopup.vue'
    export default {
        data() {
            return {
                profile_key: 0,
                item: this.data.item,
                show_modal: false,
                kanban_name: this.data.card_name,
                show_popup: false,
                show_profile: false,
                add_checklist_child: {
                    enable: false,
                    index: null,
                    item_name: ''
                },
                card_type: '',
                profile_data: {
                    current_member: {},
                    item: {}
                },
                // Target Element for Pop Up
                target_element: null,
                // Target Element for Profile Pop Up
                target_element_profile: {}
            }
        },
        mounted() {
            this.$nextTick(() => {
                window.addEventListener('resize', () => {
                    this.setPopupOffset()
                })
            })
        },
        computed: {
            countChecklistChild() {
                let checklist_done = 0;
                let total_checklist = 0;
                for(let i = 0; i < this.item.checklists.length; i++) {
                    for(let x = 0; x < this.item.checklists[i].childs.length; x++) {
                        if(this.item.checklists[i].childs[x].done) {
                            checklist_done++;
                        }
                    }
                    total_checklist += this.item.checklists[i].childs.length
                }
                return {
                    done: checklist_done >= total_checklist,
                    total_checklist: total_checklist,
                    checklist_done: checklist_done   
                }
            },
        },
        methods: {
            changeChecklistName(name) {
                let config = {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }
                this.$axios.$put(`${process.env.BACKEND_URL}/api/card`, new URLSearchParams({
                    id: this.item._id,
                    name: name
                }), config)
                .then((response) => {
                    if(response.status == 'OK') {
                        // Do Something
                    }
                })
                .catch((error) => {
                    alert("Error: Telah terjadi kesalahan")
                })
            },
            toggleDeadline() {
                let config = {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
                this.$axios.$put(`${process.env.BACKEND_URL}/api/card`, {
                    id: this.item._id,
                    deadline: {
                        date: this.item.deadline.date,
                        done: !this.item.deadline.done
                    }
                }, config)
                .then((response) => {
                    if(response.status == 'OK') {
                        // Do Something
                    }
                })
                .catch((error) => {
                    alert("Error: Telah terjadi kesalahan")
                })
            },
            changeItemName() {
                let config = {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }
                this.$axios.$put(`${process.env.BACKEND_URL}/api/card`, new URLSearchParams({
                    id: this.item._id,
                    name: this.item.name
                }), config)
                .then((response) => {
                    if(response.status == 'OK') {
                        // Do Something
                    }
                })
                .catch((error) => {
                    alert("Error: Telah terjadi kesalahan")
                })
            },
            generateProfileName(fullname) {
                if(fullname) {
                    let split_name = fullname.split(' ')
                    let initial = '';
                    if(split_name.length > 1) {
                        initial = `${split_name[0].charAt(0)}${split_name[split_name.length - 1].charAt(0)}`
                    }
                    else if(split_name.length == 1) {
                        initial = `${split_name[0].charAt(0)}`
                    }
                    return initial
                }
            },
            deleteChecklist(event, index, selected_checklist, checklist) {
                let config = {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data: {
                        card_id: this.item._id,
                        id: checklist[index]._id
                    }
                }
                this.$axios.$delete(`${process.env.BACKEND_URL}/api/card/checklist`, config)
                .then((response) => {
                    if(response.status == 'OK') {
                        checklist.splice(index, 1)
                        return
                    }
                    alert('Telah terjadi kesalahan')
                }) 
                .catch((error) => {
                    alert('Error: Telah terjadi kesalahan')
                })
            },
            deleteChecklistChild(event, child_index, selected_checklist, checklist, parent_id) {
                let config = {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data: {
                        card_id: this.item._id,
                        id: checklist[child_index]._id,
                        checklist_id: parent_id
                    }
                }
                this.$axios.$delete(`${process.env.BACKEND_URL}/api/card/checklist/child`, config)
                .then((response) => {
                    if(response.status == 'OK') {
                        checklist.splice(child_index, 1)
                        return
                    }
                    alert('Telah terjadi kesalahan')
                }) 
                .catch((error) => {
                    alert('Error: Telah terjadi kesalahan')
                })
                // checklist.splice(child_index, 1) 
            },
            showModalItem(event, data, card_name) {
                // this.$bvModal.show("modal_item")
                this.closePopUp()
                this.show_modal = true
            },
            hideModalItem(event) {
                this.show_modal = false
                // this.$bvModal.hide("modal_item")
            },
            closePopUp() {
                this.closeProfileCard()
                this.closeCardPopUp()
            },
            closeCardPopUp() {
                this.show_popup = false
                this.card_type = ''
            },
            setPopupOffset() {
                setTimeout(() => {
                    if(!this.show_popup) return
                    let getClient = document.getElementById('card_pop_up').getBoundingClientRect()
                    // Calculate Offset Y
                    if((getClient.y + getClient.height) > window.innerHeight) {
                        document.getElementById('card_pop_up').style.top = (getClient.top - ((getClient.y + getClient.height) - window.innerHeight) - 20) + 'px'
                    }
                    else {
                        if(this.target_element == null) return
                        let element = this.target_element.getBoundingClientRect()
                        document.getElementById('card_pop_up').style.top = (element.y + element.height) + 'px'
                    }
                    // Calculate Offset X
                    if((getClient.x + getClient.width) > window.innerWidth) {
                        document.getElementById('card_pop_up').style.left = (getClient.left - ((getClient.x + getClient.width) - window.innerWidth) - 20) + 'px'
                    }
                    else {
                        if(this.target_element == null) return
                        let element = this.target_element.getBoundingClientRect()
                        document.getElementById('card_pop_up').style.left = (element.x - 10) + 'px'
                    }
                })
            },
            showCardPopUp(event, type) {
                this.show_popup = !this.show_popup
                if(!this.show_popup) return
                this.$nextTick(() => {
                    let element = event.currentTarget.getBoundingClientRect()
                    this.target_element = event.currentTarget
                    this.$refs.card_pop_up_ref.style.left = (element.x - 10) + 'px'
                    this.$refs.card_pop_up_ref.style.top = (element.y + element.height) + 'px'
                    this.setPopupOffset()
                })
                this.card_type = type
            },
            openProfileCard(event, member, item) {
                this.show_popup = false
                this.show_profile = !this.show_profile
                this.profile_data = {
                    current_member: member,
                    item: item,
                }
                this.target_element_profile = event.currentTarget
            },
            closeProfileCard() {
                this.show_profile = false
                this.show_popup = false
                this.profile_data = {
                    current_member: {},
                    item: {}
                }
                this.target_element_profile = {}
            },
            isDeadline(date) {
                let d = new Date(date)
                let currentDate = new Date()
                if(d.getTime() < currentDate.getTime()) return true
                return false
            },
            countChildChecklistDoneTotal(checklist) {
                let total_checklist_item = 0;
                if(checklist.length > 0) {
                    for(let i = 0; i < checklist.length; i++) {
                        if(checklist[i].done) {
                            total_checklist_item++
                        }
                    }
                }
                return total_checklist_item
            },
            convertDate(date, fulldate = false) {
                let bulan = [
                    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
                ];
                if(date == null || date == '') return false
                let d = new Date(date)
                let month = bulan[d.getMonth()]
                if(fulldate) return `${d.getDate()} ${month} ${d.getFullYear()}`
                return `${month} ${d.getDate()}`
            },
            enableAddChecklistChild(index, id) {
                this.disableAddChecklistChild()
                this.add_checklist_child = {
                    enable: true,
                    index: index,
                    item_name: '',
                    item_id: id,
                }
            },
            disableAddChecklistChild() {
                this.add_checklist_child = {
                    enable: false,
                    index: null,
                    item_name: '',
                    item_id: null,
                }
            },
            addChecklistChild() {
                if(this.add_checklist_child.item_name.trim() != '') {
                    let config = {
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        }
                    }
                    this.$axios.$post(`${process.env.BACKEND_URL}/api/card/checklist/child`, new URLSearchParams({
                        name: this.add_checklist_child.item_name,
                        checklist_id: this.add_checklist_child.item_id
                    }), config)
                    .then((response) => {
                        if(response.status == 'OK') {
                            let {data} = response
                            this.item.checklists[this.add_checklist_child.index].childs.push({
                                '_id': data._id,
                                'name': this.add_checklist_child.item_name,
                                'done': false
                            })
                            this.add_checklist_child.item_name = ''
                            this.add_checklist_child.enable = false
                            return
                        }
                        alert('Telah terjadi kesalahan')
                    }) 
                    .catch((error) => {
                        alert('Error: Telah terjadi kesalahan')
                    })
                }
            },
            checklistHandle(value, child_id, parent_id, type='status') {
                let config = {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }
                let data = {}
                if(type == 'status') {
                    data = {
                        done: value,
                        checklist_id: parent_id,
                        id: child_id,
                        card_id: this.item._id
                    }
                }
                else if(type == 'name') {
                    data = {
                        name: value,
                        checklist_id: parent_id,
                        id: child_id,
                        card_id: this.item._id
                    }
                }
                this.$axios.$put(`${process.env.BACKEND_URL}/api/card/checklist/child`, new URLSearchParams(data), config)
                .then((response) => {
                    if(response.status == 'OK') {
                    }
                }) 
                .catch((error) => {
                    alert('Error: Telah terjadi kesalahan')
                })
            }
        },
        components: {
            draggable,
            CardProfileMember,
            CardPopup
        },
        props: {
            data: {
                type: Object
            }
        }
    }
</script>