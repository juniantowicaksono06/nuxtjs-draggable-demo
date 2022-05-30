<style>
    @import '../assets/styles/kanban.css';
</style>
<template>
    <div class="w-100 h-100" id="content-wrap" v-on:click="closePopUp">
        <Topbar/>
        <div class="container-fluid">
            <div class="row" id="toolbar_section">
                <div class="d-flex">
                    <span class="text-white transparent-button font-sm btn">Board <span class="ml-1"><font-awesome-icon :icon="['fa', 'chevron-down']" /></span></span>
                    <span>
                        <div>
                            <p ref="board_input_ref" id="board_input_ref">{{ board_name }}</p>
                        </div>
                        <input ref="board_input" type="text" id="board_input" v-model="board_name" @focus="$event.target.select()"  v-on:keyup="resizeBoard" />
                    </span>
                    <span class="ml-1">
                        <span class="text-white transparent-button font-sm btn">Workspace <span class="ml-1"></span></span>
                    </span>
                    <span class="ml-1">
                        <span class="text-white transparent-button font-sm btn">Workspace visible <span class="ml-1"></span></span>
                    </span>
                </div>
            </div>
            <div class="row pl-4 pr-4" id="kanban_section">
                <draggable v-model="kanban" tag="div" class="pb-5" id="kanban_container" draggable=".kanban-card, .card-body:not(.add-item)" animation=250 ref="kanban_container">
                    <div class="kanban-card card" v-for="(k,index) in kanban" :key="k.kanban_id">
                        <div class="card-header kanban-header">
                            <p class="kanban-header-input mb-0" v-on:click="enableEditKanbanName($event,index)" style="display: block;" ref="kanban_name_ref">{{ k.kanban_name }}</p>
                            <input class="kanban-header-input" ref="kanban_name_edit" style="display:none;" v-model="k.kanban_name" v-on:blur="disableEditKanbanName($event, index)" />
                        </div>
                        <div class="card-body kanban-body py-1 px-2">
                            <draggable v-model="k.data" group="task" ghostClass="kanban-ghost-class" dragClass="kanban-drag-class" animation=250>
                                <div class="card kanban-item mb-1 mt-1" v-for="a in k.data" :key="a.task_id" draggable=".kanban-item" v-on:click="showModalItem($event, a, k.kanban_name)">
                                    <div class="py-2 px-1">
                                        <span class="kanban-text">{{ a.task_name }}</span>
                                    </div>
                                    <div class="w-100" v-if="(a.members.length > 0 || a.checklist.length > 0)">
                                        <div class="float-left px-2 mb-2">
                                            <div class="d-flex" v-if="(a.checklist.length > 0)">
                                                <span :class="(countChildChecklist(a.checklist) == a.checklist_completed ? 'badge badge-success kanban-text': 'kanban-text')"><font-awesome-icon class="ml-1" :icon="['fa', 'list-check']"/><span class="pl-1 pr-1">{{ a.checklist_completed }}/{{ countChildChecklist(a.checklist) }}</span></span>
                                            </div>
                                        </div>
                                        <div class="float-right profile-pic-container justify-content-end">
                                           <div v-for="(member, member_index) in a.members" class="px-1 py-1 position-relative  member" v-on:click="showProfileCard($event, member, a)" ref="card_info_ref" @click.stop="" data-toggle="tooltip" data-placement="top" :title="member.full_name">
                                                <img :src="member.profile_pic" class="profile-pic-thumbs rounded-circle" />
                                           </div> 
                                        </div>
                                    </div>
                                </div>
                            </draggable>
                            <div class="add-item kanban-item kanban-text w-100 px-2 py-2" v-on:click="showAddItemInput($event, k.kanban_id)" v-if="((!add_item_enabled) || (add_item_enabled && k.kanban_id != add_item_id))">
                                <strong>+</strong> Add Item
                            </div>
                            <div class="add-item kanban-item w-100 px-0 py-0 kanban-text" v-else-if="(add_item_enabled == true && k.kanban_id == add_item_id)">
                                <textarea autofocus v-model="add_item_value" class="form-control ml-0 mr-0 kanban-text" style="resize: none;" placeholder="Enter a title for this card"></textarea>
                                <div class="d-flex mt-2">
                                    <button class="btn btn-primary kanban-text" v-on:click="addItem">Add Item</button>
                                    <button class="btn btn-transparent kanban-text" v-on:click="disableAddItem()"><font-awesome-icon :icon="['fa', 'xmark']"/></button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="add-list transparent-button" v-if="(!add_list_enabled && add_list_id == null)" v-on:click="showAddListInput">
                        <span class="mb-0" style="font-size: 14px;"><strong>+</strong> Add another list</span>
                    </div>
                    <div class="add-list2 card" v-else>
                        <input v-model="add_list_value" autofocus class="form-control kanban-text" placeholder="Enter list title" />
                        <div class="d-flex mt-2">
                            <button class="btn btn-primary kanban-text" v-on:click="addList">Add List</button>
                            <button class="btn btn-transparent kanban-text" v-on:click="disableAddList()"><font-awesome-icon :icon="['fa', 'xmark']"/></button>
                        </div>
                    </div>
                </draggable>
            </div>
            <div>
                <!-- MODAL EDIT ITEM -->
                <b-modal id="modal_item" @hide="closePopUp" hide-footer size="lg" hide-header>
                    <div class="container-fluid" v-on:click="closePopUp">
                        <div class="d-flex justify-content-between" id="modal_header">
                            <div class="mb-1" style="width: 90%;">
                                <input class="ml-0 pl-0 pr-0 mr-0 input-transparent" v-model="item_modal_data.task_name" />
                                <h6 class="pr-0 no-select">in list <b>{{ item_modal_data_card_name }}</b></h6>
                            </div>
                            <div style="width: 10%; margin: 0 auto; text-align: right;">
                                <button class="btn btn-transparent" v-on:click="hideModalItem($event)">
                                    <font-awesome-icon :icon="['fa', 'xmark']" />        
                                </button>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-12 col-sm-6 d-flex">
                                 <div v-for="member in item_modal_data.members" class="px-1 py-1 position-relative member hover-pointer" v-on:click="showProfileCard($event, member, item_modal_data)" ref="card_info_ref" @click.stop="" data-toggle="tooltip" data-placement="top" :title="member.full_name">
                                    <img :src="member.profile_pic" class="profile-pic-thumbs rounded-circle" />
                                 </div>                               
                                 <div class="px-1 py-1 position-relative member hover-pointer" ref="card_info_ref" @click.stop="" data-toggle="tooltip" data-placement="top" title="Add member" style="margin: auto 0;" v-if="item_modal_data.members.length > 0" v-on:click="showAddToCard($event, 'members')">
                                    <p class="px-0 py-1 profile-pic-thumbs rounded-circle" style="text-align: center; margin: auto 0;background-color: #E5E7EB;">
                                        <span><font-awesome-icon :icon="['fa', 'plus']" /></span>
                                    </p>
                                 </div>                               
                            </div>
                            <div class="col-12 col-sm-6">

                            </div>
                        </div>
                        <div class="row ml-0 pl-0 pr-0" id="modal_content">
                            <div class="col-12 col-sm-9 col-md-9 pl-0 mt-2">
                                <h5 class="ml-0 pl-0 pr-0 no-select font-weight-bold">Description</h5>
                                <textarea class="form-control" placeholder="Add a more detailed description" v-model="item_modal_data.task_description" style="resize: none;"></textarea>
                                <div class="mt-2" v-for="(checklist, checklist_index) in item_modal_data.checklist" :key="checklist.checklist_id">
                                    <div class="d-flex mb-2">
                                        <input class="ml-0 pl-0 pr-0 mr-0 input-transparent" v-model="checklist.checklist_name" />
                                    </div>
                                    <div>
                                        <div class="progress">
                                            <div :class="(Math.round(100 / (checklist.checklist_child.length / countChildChecklistDoneTotal(checklist.checklist_child)) >= 100) ? 'progress-bar bg-success' : 'progress-bar')" role="progressbar" :style="{
                                                'width': Math.round(100 / (checklist.checklist_child.length / countChildChecklistDoneTotal(checklist.checklist_child)))+ '%'
                                            }" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"></div>
                                        </div>
                                    </div>
                                    <div v-for="(child, child_index) in checklist.checklist_child" :key="child.checklist_child_id" class="row">
                                        <div class="col-1 py-1 pr-0 mr-0">
                                            <input type="checkbox" class="form-control mr-0" :checked="child.checklist_child_done" style="width: 14px; height: 14px;" v-model="child.checklist_child_done" v-on:change="toggleChecklistDone(child.checklist_child_done)" />
                                        </div>
                                        <div class="col-10 mt-1 px-0">
                                            <h6 class="kanban-text">{{ child.checklist_child_name }}</h6>
                                        </div>
                                    </div>
                                    <div v-if="add_checklist_item.index == checklist_index && add_checklist_item.enable">
                                        <input class="form-control kanban-text" placeholder="Add an item" v-model="add_checklist_item.item_name" />
                                        <button class="btn btn-primary mt-2 kanban-text" v-on:click="addCheklistItem">Add</button>
                                        <button class="btn btn-transparent mt-2 kanban-text" v-on:click="disableAddChecklistItem()"><font-awesome-icon :icon="['fa', 'xmark']"/></button>
                                    </div>
                                    <div v-else>
                                        <button class="btn btn-secondary mt-2 kanban-text" v-on:click="enableAddChecklistItem(checklist_index)">Add an item</button>
                                    </div>
                                </div>
                            </div>
                            <div class="col-12 col-sm-3 col-md-3 pl-0">
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
                                data_item: item_modal_data
                            }" :closeAddToCard="closeAddToCard"/>
                        </div>
                    </div>
                </b-modal>
            </div>
        </div>
        <div id="profile_pop_up" ref="profile_pop_up_ref" @click.stop="">
            <CardProfileMember :data="profile_data" :close="closeCardInfo" />
        </div>
    </div>
</template>

<script>
    import draggable from "vuedraggable"
    import CardProfileMember from "./CardProfileMember.vue"
    import Topbar from "../Topbar.vue"
    import AddToCard from "./AddToCard.vue"
    export default {
        mounted() {
            this.resizeBoard()
        },
        methods: {
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
            countChildChecklist(checklist) {
                let total_checklist_item = 0;
                if(checklist.length > 0) {
                    for(let i = 0; i < checklist.length; i++) {
                        total_checklist_item += checklist[i].checklist_child.length
                    }
                }
                return total_checklist_item
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
                this.$refs.add_to_card_pop_up_ref.style.display = 'block'
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
            showProfileCard(event, data, item) {
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
                    current_member: data,
                    member_list: item
                }
            },
            closeCardInfo() {
                if('profile_pop_up_ref' in this.$refs) {
                    if(typeof this.$refs.profile_pop_up_ref != 'undefined') {
                        this.$refs.profile_pop_up_ref.style.display = 'none'
                    }
                }
            },
            showModalItem(event, data, card_name) {
                this.item_modal_data = data
                this.item_modal_data_card_name = card_name
                this.$bvModal.show("modal_item")
            },
            hideModalItem(event) {
                this.$bvModal.hide("modal_item")
                this.item_modal_data = {
                    task_id: null,
                    task_name: '',
                    members: [],
                    checklist: []
                }
                this.item_modal_data_card_name = ''

            },
            enableEditKanbanName(event, index) {
                this.$refs.kanban_name_ref[index].style.display = 'none'
                this.$refs.kanban_name_edit[index].style.display = 'block'
                this.$refs.kanban_name_edit[index].focus()
                this.$refs.kanban_name_edit[index].select()
            },
            disableEditKanbanName(event, index) {
                this.$refs.kanban_name_ref[index].style.display = 'block'
                this.$refs.kanban_name_edit[index].style.display = 'none'
            },
            disableAddItem() {
                this.add_item_enabled = false
                this.add_item_id = null
                this.add_item_value = ''
            },
            disableAddList() {
                this.add_list_enabled = false
                this.add_list_id = null
                this.add_list_value = ''
            },
            addList() {
                if(this.add_list_value.trim() == "") {
                    return false
                }
                this.kanban.push({
                    kanban_id: this.add_list_id,
                    kanban_name: this.add_list_value,
                    data: []
                })  
                this.disableAddList()
            },
            addItem() {
                let id = this.add_item_id 
                let id_random = Math.round(Math.random() * 10240)
                let task_name = this.add_item_value
                if(task_name.trim() == "" || task_name == null) {
                    return false
                }
                this.kanban.map((value) => {
                    if(value.kanban_id == id) {
                        value.data.push({
                            task_id: id_random,
                            task_name: task_name,
                            members: [],
                            checklist: []
                        })
                    }
                    return value
                })
                this.disableAddItem()
            },
            resizeBoard() {
                this.$refs.board_input.style.width = (this.$refs.board_input_ref.offsetWidth + 30) + 'px';
            },
            showAddItemInput(event, kanban_id) {
                this.add_item_enabled = true
                this.add_item_id = kanban_id
                this.add_item_value = ''
            },
            showAddListInput() {
                this.add_list_enabled = true
                this.add_list_id = Math.round(Math.random() * 10240)
                this.add_list_value = ''
            },
            enableAddChecklistItem(index) {
                this.disableAddChecklistItem()
                this.add_checklist_item = {
                    enable: true,
                    index: index,
                    item_name: ''
                }
            },
            disableAddChecklistItem() {
                console.log("tes")
                this.add_checklist_item = {
                    enable: false,
                    index: null,
                    item_name: ''
                }
            },
            addCheklistItem() {
                if(this.add_checklist_item.item_name.trim() != '') {
                    this.item_modal_data.checklist[this.add_checklist_item.index].checklist_child.push({
                        'checklist_child_id': Math.round(Math.random() * 10240),
                        'checklist_child_name': this.add_checklist_item.item_name,
                        'checklist_child_done': false
                    })
                }
                this.add_checklist_item.item_name = ''
            },
            toggleChecklistDone(done) {
                // console.log(done)
                if(done) {
                    this.item_modal_data.checklist_completed++
                    return
                }
                this.item_modal_data.checklist_completed--
            }
        },
        data() {
            return {
                board_name: 'Project 1',
                add_item_enabled: false,
                add_item_id: null,
                add_item_value: "",

                add_list_enabled: false,
                add_list_id: null,
                add_list_value: "",

                // DATA FOR OPEN MODAL
                item_modal_data: {
                    task_id: null,
                    task_name: '',
                    task_description: '',
                    members: [],
                    checklist: []
                },
                item_modal_data_card_name: '',
                add_checklist_item: {
                    enable: false,
                    index: null,
                    item_name: ''
                },

                // FOR PROFILE CARD
                profile_data: {
                    current_member: {},
                    member_list: {}
                },

                add_to_card_type: '',

                kanban: [
                    {
                        kanban_id: 1,
                        kanban_name: 'Todo',
                        data: [
                           {
                               task_id: 1,
                               task_name: 'Testing 1',
                               task_description: 'Ini uji coba saja',
                               members: [
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
                               ],
                               checklist: [
                                   {
                                       'checklist_id': 1,
                                       'checklist_name': 'Testing1',
                                       'checklist_child': [
                                           {
                                               'checklist_child_id': 1,
                                               'checklist_child_name': 'Testing Child 1',
                                               'checklist_child_done': true
                                           },
                                           {
                                               'checklist_child_id': 2,
                                               'checklist_child_name': 'Testing Child 2',
                                               'checklist_child_done': false
                                           }
                                       ]
                                   },
                                   {
                                       'checklist_id': 2,
                                       'checklist_name': 'Testing2',
                                       'checklist_child': [
                                           {
                                               'checklist_child_id': 3,
                                               'checklist_child_name': 'Testing Child 3',
                                               'checklist_child_done': true
                                           },
                                           {
                                               'checklist_child_id': 4,
                                               'checklist_child_name': 'Testing Child 4',
                                               'checklist_child_done': true
                                           }
                                       ]
                                   }
                               ],
                               checklist_completed: 3,
                           },
                           {
                               task_id: 2,
                               task_name: 'Testing 2',
                               task_description: '',
                               members: [
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
                               ],
                               checklist: [],
                               checklist_completed: 0,
                           } 
                        ]
                    },
                    {
                        kanban_id: 2,
                        kanban_name: 'In Progress',
                        data: [
                           {
                               task_id: 3,
                               task_name: 'Testing 3',
                               task_description: '',
                               members: [],
                               checklist: [],
                               checklist_completed: 0,
                           } 
                        ]
                    },
                    {
                        kanban_id: 3,
                        kanban_name: 'Testing',
                        data: [
                            {
                                task_id: 4,
                                task_name: 'Testing 4',
                                task_description: '',
                                members: [],
                                checklist: [],
                                checklist_completed: 0,
                            }
                        ],
                    },
                    {
                        kanban_id: 4,
                        kanban_name: 'Deploy',
                        data: [
                            {
                                task_id: 5,
                                task_name: 'Testing 5',
                                task_description: '',
                                members: [],
                                checklist: [],
                                checklist_completed: 0,
                            }
                        ],
                    },
                ]
            }
        },
        components: {
            draggable,
            Topbar,
            CardProfileMember,
            AddToCard
        }
    }
</script>