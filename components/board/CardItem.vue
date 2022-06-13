<template>
    <div class="card kanban-item mb-1 mt-1" v-on:click="showModalItem($event, item, kanban_name)">
        <div class="py-2 px-1">
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
                        <input type="checkbox" class="d-inline-block" v-model="item.deadline.done" @click.stop="" />
                        <span>{{ convertDate(item.deadline.date) }}</span>
                    </span>
                </div>
            </div>
            <div class="float-right profile-pic-container justify-content-end">
                <div v-for="(member, member_index) in item.members" class="px-1 py-1 position-relative  member" v-on:click="showProfileCard($event, member, item)" ref="card_info_ref" @click.stop="" data-toggle="tooltip" data-placement="top" :title="member.name">
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
                            <input class="ml-0 pl-0 pr-0 mr-0 input-transparent" v-model="item.name" />
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
                                    <div v-for="member in item.members" class="px-1 py-1 position-relative member hover-pointer d-inline-block" v-on:click="showProfileCard($event, member, item)" ref="card_info_ref" @click.stop="" data-toggle="tooltip" data-placement="top" :title="member.full_name">
                                        <img :src="member.profile_pic" class="profile-pic-thumbs rounded-circle" v-if="(typeof member.profile_pic != 'undefined' && member.profile_pic != '')" />
                                        <div class="profile-pic-thumbs bg-primary text-white text-center py-1 rounded-circle" v-else>
                                            {{ generateProfileName(member.name) }}
                                        </div>
                                    </div>                               
                                    <div class="px-1 py-1 position-relative member hover-pointer d-inline-block" ref="card_info_ref" @click.stop="" data-toggle="tooltip" data-placement="top" title="Add member" style="margin: auto 0;" v-if="item.members.length > 0" v-on:click="showAddToCard($event, 'members')">
                                        <p class="px-0 py-1 profile-pic-thumbs rounded-circle" style="text-align: center; margin: auto 0;background-color: #E5E7EB;">
                                            <span><font-awesome-icon :icon="['fa', 'plus']" /></span>
                                        </p>
                                    </div>                               
                                </div>
                                <div v-if="item.deadline.date != null">
                                    <h6 class="kanban-text">Due date</h6>
                                    <div style="margin: auto;">
                                        <input type="checkbox" class="d-inline-block mt-2 mr-1" v-model="item.deadline.done" />
                                        <div class="d-inline-block btn bg-gray" v-on:click="showAddToCard($event, 'dates')" @click.stop="">
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
                            <div class="mt-2 mb-2" v-for="(checklist, checklist_index) in item.checklists" :key="checklist.checklist_id">
                                <div class="d-flex mb-2">
                                    <input class="ml-0 pl-0 pr-0 mr-0 input-transparent" v-model="checklist.name" />
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
                                <div v-for="(child, child_index) in checklist.childs" :key="child._id" class="row mt-2">
                                    <div class="col-1 py-1 pr-0 mr-0">
                                        <input type="checkbox" class="form-control mr-0" :checked="child.done" style="width: 14px; height: 14px;" v-model="child.done" v-on:change="toggleChecklistDone(child.done)" />
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
                                        }" :readonly="(child.done)" v-model="child.name" />
                                    </div>
                                    <div class="float-right" style="margin-top: -5px;">
                                        <span class="kanban-text btn btn-transparent" v-on:click="deleteChecklistChild($event, child_index, child, checklist.childs)">
                                            <font-awesome-icon :icon="['fa', 'trash']"/>
                                        </span>
                                    </div>
                                </div>
                                <div v-if="add_checklist_child.index == checklist_index && add_checklist_child.enable">
                                    <input class="form-control kanban-text" placeholder="Add an item" v-model="add_checklist_child.item_name" />
                                    <button class="btn btn-primary mt-2 kanban-text" v-on:click="addChecklistChild">Add</button>
                                    <button class="btn btn-transparent mt-2 kanban-text" v-on:click="disableAddChecklistChild()"><font-awesome-icon :icon="['fa', 'xmark']"/></button>
                                </div>
                                <div v-else>
                                    <button class="btn btn-light mt-2 kanban-text" v-on:click="enableAddChecklistChild(checklist_index, checklist._id)">Add an item</button>
                                </div>
                            </div>
                        </div>
                        <div class="col-12 col-sm-12 col-md-3 pl-0">
                            <p class="mb-1 text-bold kanban-text">Add to card</p>
                            <div class="modal-list-option" v-on:click="showAddToCard($event, 'members')" ref="members_item_ref" @click.stop=''>
                                <font-awesome-icon :icon="['fa', 'user']" class="kanban-text" />
                                <span class="kanban-text ml-2">Member</span>
                            </div>
                            <div class="modal-list-option" v-on:click="showAddToCard($event, 'checklist')" ref="checklist_item_ref" @click.stop=''>
                                <font-awesome-icon :icon="['fa', 'check']" class="kanban-text" />
                                <span class="kanban-text ml-2">Checklist</span>
                            </div>
                            <div class="modal-list-option" v-on:click="showAddToCard($event, 'dates')" ref="dates_item_ref" @click.stop=''>
                                <font-awesome-icon :icon="['fa', 'clock']" class="kanban-text" />
                                <span class="kanban-text ml-2">Dates</span>
                            </div>
                        </div>
                    </div>
                    <div id="add_to_card_pop_up" ref="add_to_card_pop_up_ref" @click.stop="">
                        <AddToCard :data="{
                            card_type: add_to_card_type,
                            data_item: item
                        }" :closeAddToCard="closeAddToCard" :generateProfileName="generateProfileName" />
                    </div>
                </div>
            </b-modal>
        </div>
        <div class="profile_pop_up" ref="profile_pop_up_ref" @click.stop="">
            <CardProfileMember :data="profile_data" :close="closeCardInfo" :generateProfileName="generateProfileName" />
        </div>
    </div>
</template>
<script>
    import draggable from 'vuedraggable'
    import CardProfileMember from './CardProfileMember.vue'
    import AddToCard from './AddToCard.vue'
    export default {
        data() {
            return {
                item: this.data.item,
                show_modal: false,
                kanban_name: this.data.card_name,
                add_checklist_child: {
                    enable: false,
                    index: null,
                    item_name: ''
                },
                add_to_card_type: '',
                profile_data: {
                    current_member: {},
                    item: {}
                }
            }
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
                let checklist_child_completed = 0;
                let checklist_child_total = selected_checklist.childs.length
                checklist.splice(index, 1)
            },
            deleteChecklistChild(event, child_index, selected_checklist, checklist) {
                checklist.splice(child_index, 1) 
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
                this.closeCardInfo()
                this.closeAddToCard()
            },
            closeAddToCard() {
                if("add_to_card_pop_up_ref" in this.$refs) {
                    if(typeof this.$refs.add_to_card_pop_up_ref != 'undefined') {
                        this.$refs.add_to_card_pop_up_ref.style.display = 'none'
                        this.add_to_card_type = ''
                    }
                }
            },
            showAddToCard(event, type) {
                if(this.$refs.add_to_card_pop_up_ref.style.display == 'none' || this.$refs.add_to_card_pop_up_ref.style.display == '') {
                    this.$refs.add_to_card_pop_up_ref.style.display = 'block'
                }
                else {
                    this.$refs.add_to_card_pop_up_ref.style.display = 'none'
                }
                let element = event.currentTarget.getBoundingClientRect()
                let {add_to_card_pop_up_ref} = this.$refs
                this.$refs.add_to_card_pop_up_ref.style.left = (element.x - 10) + 'px'
                if(element.y + (add_to_card_pop_up_ref.clientHeight) < window.innerHeight) {
                    if(element.y + (add_to_card_pop_up_ref.clientHeight) + 38 > window.innerHeight) {
                        this.$refs.add_to_card_pop_up_ref.style.top = (element.y) + 'px'
                    }
                    else {
                        this.$refs.add_to_card_pop_up_ref.style.top = (element.y + 38) + 'px'
                    }
                }
                else {
                    this.$refs.add_to_card_pop_up_ref.style.top = ((element.y + 38) - (add_to_card_pop_up_ref.clientHeight)) + 'px'
                }
                this.add_to_card_type = type
            },
            showProfileCard(event, member, item) {
                this.hideProfileCard()
                let element = event.currentTarget.getBoundingClientRect()
                this.$refs.profile_pop_up_ref.style.display = 'block'
                let profile_pop_up_height = this.$refs.profile_pop_up_ref.clientHeight
                this.$refs.profile_pop_up_ref.style.left = element.x + 'px'
                if(element.y + (profile_pop_up_height) < window.innerHeight) {
                    if(element.y + (profile_pop_up_height) + 48 > window.innerHeight) {
                        this.$refs.profile_pop_up_ref.style.top = (element.y) + 'px'
                    }
                    else {
                        this.$refs.profile_pop_up_ref.style.top = (element.y + 48) + 'px'
                    }
                }
                else {
                    this.$refs.profile_pop_up_ref.style.top = ((element.y + 48) - (profile_pop_up_height)) + 'px'
                }
                this.profile_data = {
                    current_member: member,
                    item: item,
                }
            },
            hideProfileCard() {
                let i = document.getElementsByClassName('profile_pop_up')
                for(let a = 0; a < i.length; a++) {
                    i[a].style.display = 'none'
                }
                this.profile_data = {
                    current_member: {},
                    item: {}
                }
            },
            closeCardInfo() {
                if('profile_pop_up_ref' in this.$refs) {
                    if(typeof this.$refs.profile_pop_up_ref != 'undefined') {
                        this.$refs.profile_pop_up_ref.style.display = 'none'
                    }
                }
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
                        if(checklist[i].checklist_child_done) {
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
                            this.item.checklists[this.add_checklist_child.index].childs.push({
                                '_id': Math.round(Math.random() * 10240),
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
            toggleChecklistDone(done) {
                // if(done) {
                // }
            }
        },
        components: {
            draggable,
            CardProfileMember,
            AddToCard
        },
        props: {
            data: {
                type: Object
            }
        }
    }
</script>