<style>
    @import './assets/styles/kanban.css';
</style>
<template>
    <div class="w-100 h-100" id="content-wrap" v-on:click="closeElem">
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
                            <input class="kanban-header-input" ref="kanban_name_edit" style="display:none;" :value="k.kanban_name" v-on:blur="disableEditKanbanName($event, index)" />
                        </div>
                        <div class="card-body kanban-body py-1 px-2">
                            <draggable v-model="k.data" group="task" ghostClass="kanban-ghost-class" dragClass="kanban-drag-class" animation=250>
                                <div class="card kanban-item mb-1 mt-1" v-for="a in k.data" :key="a.task_id" draggable=".kanban-item" v-on:click="showModalItem($event, a.task_id, a.task_name, k.kanban_name)">
                                    <div class="py-2 px-1">
                                        <span class="kanban-text">{{ a.task_name }}</span>
                                    </div>
                                    <div class="w-100" v-if="(a.members.length > 0)">
                                        <div class="float-left">
                                        </div>
                                        <div class="float-right profile-pic-container justify-content-end">
                                           <div v-for="(member, member_index) in a.members" class="px-1 py-1 position-relative  member" v-on:click="openCardInfo($event, member)" ref="card_info_ref" @click.stop="">
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
                <b-modal id="modal_item" hide-footer size="lg" hide-header>
                    <div class="container-fluid">
                        <div class="d-flex justify-content-between" id="modal_header">
                            <div class="mb-1" style="width: 90%;">
                                <input class="ml-0 pl-0 pr-0 mr-0 input-transparent" v-model="open_item_modal_task_name" />
                                <h6 class="pr-0 no-select" id="">in list <b>{{ open_item_modal_kanban_name }}</b></h6>
                            </div>
                            <div style="width: 10%; margin: 0 auto; text-align: right;">
                                <button class="btn btn-transparent" v-on:click="hideModalItem($event)">
                                    <font-awesome-icon :icon="['fa', 'xmark']" />        
                                </button>
                            </div>
                        </div>
                        <div class="row ml-0 pl-0 pr-0" id="modal_content">
                            <div class="col-12 pl-0">
                                <h5 class="ml-0 pl-0 pr-0 no-select">Description</h5>
                            </div>
                            <div class="col-9 pl-0">
                                <textarea class="form-control" placeholder="Add a more detailed description" style="resize: none;"></textarea>
                            </div>
                            <div class="col-3">
                                <div class="row">
                                    <div class="col-12">
                                        <p class="mb-1 text-bold kanban-text">Add to card</p>
                                        <div class="modal-list-option">
                                            <font-awesome-icon :icon="['fa', 'user']" class="kanban-text" />
                                            <span class="kanban-text ml-2">Member</span>
                                        </div>
                                        <div class="modal-list-option">
                                            <font-awesome-icon :icon="['fa', 'check']" class="kanban-text" />
                                            <span class="kanban-text ml-2">Checklist</span>
                                        </div>
                                        <div class="modal-list-option">
                                            <font-awesome-icon :icon="['fa', 'clock']" class="kanban-text" />
                                            <span class="kanban-text ml-2">Dates</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </b-modal>
            </div>
        </div>
        <div id="profile_pop_up" ref="profile_pop_up" @click.stop="">
            <CardProfileMember :data="profile_data" :close="closeCardInfo" />
        </div>
    </div>
</template>

<script>
    import draggable from "vuedraggable"
    import CardProfileMember from "./CardProfileMember.vue"
    import Topbar from "./Topbar.vue"
    export default {
        mounted() {
            this.resizeBoard()
        },
        methods: {
            closeElem() {
                this.closeCardInfo()
            },
            openCardInfo(event, data) {
                let element = event.currentTarget.getBoundingClientRect()
                this.$refs.profile_pop_up.style.display = 'block'
                let profile_pop_up_height = this.$refs.profile_pop_up.clientHeight
                let kanban_container_height = document.getElementById('kanban_container').clientHeight
                this.$refs.profile_pop_up.style.left = element.x + 'px'
                if(element.y + (profile_pop_up_height) < window.innerHeight) {
                    if(element.y + (profile_pop_up_height) + 48 > window.innerHeight) {
                        this.$refs.profile_pop_up.style.top = (element.y) + 'px'
                    }
                    else {
                        this.$refs.profile_pop_up.style.top = (element.y + 48) + 'px'
                    }
                }
                else {
                    this.$refs.profile_pop_up.style.top = ((element.y + 48) - (profile_pop_up_height)) + 'px'
                }
                this.profile_data = data
            },
            closeCardInfo() {
                this.$refs.profile_pop_up.style.display = 'none'
            },
            showModalItem(event, id, name, card_name) {
                this.open_item_modal_task_id = id
                this.open_item_modal_task_name = name
                this.open_item_modal_kanban_name = card_name
                this.$bvModal.show("modal_item")
            },
            hideModalItem(event) {
                this.$bvModal.hide("modal_item")
                this.open_item_modal_task_id = null
                this.open_item_modal_task_name = ''
                this.open_item_modal_kanban_name = ''
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
                            members: []
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

                open_item_modal_task_id: null,
                open_item_modal_task_name: '',
                open_item_modal_kanban_name: '',

                profile_data: {
                    'user_id': 1,
                    'full_name': 'Junianto Ichwan Dwi Wicaksono',
                    'email': 'juniantowicaksono06@gmail.com',
                    'profile_pic': 'https://play-lh.googleusercontent.com/xlnwmXFvzc9Avfl1ppJVURc7f3WynHvlA749D1lPjT-_bxycZIj3mODkNV_GfIKOYJmG'
                },


                kanban: [
                    {
                        kanban_id: 1,
                        kanban_name: 'Todo',
                        data: [
                           {
                               task_id: 1,
                               task_name: 'Testing 1',
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
                               ]
                           },
                           {
                               task_id: 2,
                               task_name: 'Testing 2',
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
                               ]
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
                               members: []
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
                                members: []
                            }
                        ]
                    },
                    {
                        kanban_id: 4,
                        kanban_name: 'Deploy',
                        data: [
                            {
                                task_id: 5,
                                task_name: 'Testing 5',
                                members: []
                            }
                        ]
                    },
                ]
            }
        },
        components: {
            draggable,
            Topbar,
            CardProfileMember
        }
    }
</script>