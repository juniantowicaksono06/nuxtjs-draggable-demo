<style>
    @import './assets/styles/kanban.css';
</style>
<template>
    <div class="w-100 h-100" id="content-wrap">
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
                <draggable v-model="kanban" tag="div" id="kanban_container" draggable=".kanban-card" animation=250>
                    <div class="kanban-card card" v-for="k in kanban" :key="k.kanban_id">
                        <div class="card-header kanban-header">
                            <input class="kanban-header-input" :value="k.kanban_name" @focus="$event.target.select()" />
                        </div>
                        <div class="card-body kanban-body py-1 px-2">
                            <draggable v-model="k.data" group="task" ghostClass="kanban-ghost-class" dragClass="kanban-drag-class" animation=250>
                                <div class="card kanban-item mb-1 mt-1" v-for="a in k.data" :key="a.task_id" draggable=".kanban-item">
                                    <div class="py-2 px-1">
                                        <span class="kanban-text">{{ a.task_name }}</span>
                                    </div>
                                </div>
                            </draggable>
                            <div class="add-item kanban-text w-100 px-2 py-2" v-on:click="showAddItemInput($event, k.kanban_id)" v-if="((!add_item_enabled) || (add_item_enabled && k.kanban_id != add_item_id))">
                                <strong>+</strong> Add Item
                            </div>
                            <div class="w-100 px-0 py-0 kanban-text" v-else-if="(add_item_enabled == true && k.kanban_id == add_item_id)">
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
        </div>
    </div>
</template>

<script>
    import draggable from "vuedraggable"
    import Topbar from "./Topbar.vue"
    export default {
        mounted() {
            // console.log(this.$refs.board_input)
            this.resizeBoard()
        },
        methods: {
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

                kanban: [
                    {
                        kanban_id: 1,
                        kanban_name: 'Todo',
                        data: [
                           {
                               task_id: 1,
                               task_name: 'Testing 1'
                           },
                           {
                               task_id: 2,
                               task_name: 'Testing 2'
                           } 
                        ]
                    },
                    {
                        kanban_id: 2,
                        kanban_name: 'In Progress',
                        data: [
                           {
                               task_id: 3,
                               task_name: 'Testing 3'
                           } 
                        ]
                    },
                    {
                        kanban_id: 3,
                        kanban_name: 'Testing',
                        data: [
                            {
                                task_id: 4,
                                task_name: 'Testing 4'
                            }
                        ]
                    },
                    {
                        kanban_id: 4,
                        kanban_name: 'Deploy',
                        data: [
                            {
                                task_id: 5,
                                task_name: 'Testing 5'
                            }
                        ]
                    },
                ]
            }
        },
        components: {
            draggable,
            Topbar
        }
    }
</script>