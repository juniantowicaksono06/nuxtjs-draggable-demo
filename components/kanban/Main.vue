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
                <draggable v-model="kanban" tag="div" class="pb-5" id="kanban_container" animation=250 ref="kanban_container">
                    <div v-for="(k, index) in kanban" :key="k.kanban_id">
                        <KanbanCardVue :data="{
                            kanban: k,
                            index: index
                        }" />
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
        </div>
    </div>
</template>

<script>
    import draggable from "vuedraggable"
    import KanbanCardVue from "./KanbanCard.vue"
    import CardProfileMember from "./CardProfileMember.vue"
    import Topbar from "../Topbar.vue"
    import AddToCard from "./AddToCard.vue"
    export default {
        mounted() {
            this.resizeBoard()
            // console.log(this.data)
        },
        methods: {
            closePopUp() {
                let a = document.getElementsByClassName("profile_pop_up")
                for(let i = 0; i < a.length; i++) {
                    a[i].style.display = 'none'
                }
            },
            showAddListInput() {
                this.add_list_enabled = true
                this.add_list_id = Math.round(Math.random() * 10240)
                this.add_list_value = ''
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
            resizeBoard() {
                this.$refs.board_input.style.width = (this.$refs.board_input_ref.offsetWidth + 30) + 'px';
            },
        },
        data() {
            return {
                board_name: 'Project 1',

                add_list_enabled: false,
                add_list_id: null,
                add_list_value: "",

                // DATA FOR OPEN MODAL
                item_modal_data: {
                    task_id: null,
                    task_name: '',
                    task_description: '',
                    members: [],
                    checklist: [],
                    deadline: {
                        date: null,
                        done: false
                    }
                },
                item_modal_data_card_name: '',

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
                               deadline: {
                                   date: '2022-06-30',
                                   done: true
                               }
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
                               deadline: {
                                   date: null,
                                   done: false
                               }
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
                               deadline: {
                                   date: null,
                                   done: false
                               }
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
                                deadline: {
                                   date: null,
                                   done: false
                                }
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
                                deadline: {
                                   date: null,
                                   done: false
                                }
                            }
                        ],
                    },
                ]
            }
        },
        components: {
            KanbanCardVue,
            draggable,
            Topbar,
            CardProfileMember,
            AddToCard
        }
    }
</script>