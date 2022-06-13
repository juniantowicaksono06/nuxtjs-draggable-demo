<style>
    @import '../assets/styles/kanban.css';
</style>
<template>
    <div class="w-100 h-100" id="content_wrap" v-on:click="closePopUp">
        <div class="w-100 h-100" v-if="!loading">
            <Topbar :data="{
                workspace: workspace
            }" :key="sidebarKey" />
            <div class="h-100 d-flex">
                <div>
                    <WorkspaceSidebar :data="{
                        workspace: workspace
                    }" :key="sidebarKey" />
                </div>
                <div class="d-flex position-relative w-100 h-100">
                    <div class="container-fluid">
                        <div class="row" id="toolbar_section">
                            <div class="d-flex">
                                <span>
                                    <div>
                                        <p ref="board_input_ref" id="board_input_ref">{{ kanban.name }}</p>
                                    </div>
                                    <input ref="board_input" type="text" id="board_input" v-model="kanban.name" @focus="$event.target.select()"  v-on:keyup="resizeBoard" v-on:blur="changeBoardName($event, kanban._id)" />
                                </span>
                                <span class="ml-1" v-on:click="showModalMoveWorkspace" v-for="work in workspace" v-if="work.workspace_id == kanban.workspace_id._id">
                                    <span class="text-white transparent-button font-sm btn">{{ work.workspace_name }} <span class="ml-1"></span></span>
                                </span>
                            </div>
                        </div>
                        <div class="row pl-5 pr-5" id="kanban_section" style="width: 100%;">
                            <draggable v-model="kanban.lists" tag="div" class="pb-5" id="kanban_container" animation=250 ref="kanban_container">
                                <div v-for="(k, index) in kanban.lists" :key="index">
                                    <Card :data="{
                                        kanban: k,
                                        index: index
                                    }" />
                                </div>
                                <div class="add-list transparent-button" v-if="(!add_list_enabled && add_list_id == null)" v-on:click="showAddListInput">
                                    <span class="mb-0" style="font-size: 14px;"><strong>+</strong> Add another list</span>
                                </div>
                                <div class="add-list2 card" v-else>
                                    <input v-model="add_list_value" class="form-control kanban-text" placeholder="Enter list title" />
                                    <div class="d-flex mt-2">
                                        <button class="btn btn-primary kanban-text" v-on:click="addList">Add List</button>
                                        <button class="btn btn-transparent kanban-text" v-on:click="disableAddList()"><font-awesome-icon :icon="['fa', 'xmark']"/></button>
                                    </div>
                                </div>
                            </draggable>
                        </div>
                    </div>
                </div>
            </div>
            <!-- Modal Select And Move Board to Workspace -->
            <b-modal id="modal_move_workspace" hide-footer size="md" title="Edit Workspace">
                <div class="row">
                    <div class="col-12">
                        <div class="form-group w-100">
                            <label class="kanban-text">
                                This board is in workspace
                            </label>
                            <select class="form-control" v-model="workspace_id_selected">
                                <option v-for="work in workspace" :value="work.workspace_id">
                                    {{ work.workspace_name }}
                                </option>
                            </select>
                        </div>
                        <div class="form-group">
                            <button class="btn btn-block btn-primary" v-on:click="changeWorkspace">
                                Change
                            </button>
                        </div>
                    </div>
                </div>
            </b-modal>
        </div>
    </div>
</template>

<script>
    import draggable from "vuedraggable"
    import Card from "./Card.vue"
    import CardProfileMember from "./CardProfileMember.vue"
    import Topbar from "../Topbar.vue"
    import AddToCard from "./AddToCard.vue"
    import WorkspaceSidebar from "../workspace/WorkspaceSidebar.vue"
    export default {
        async mounted() {
            this.loadDataWorkspace()
            this.loadDataBoard()
        },
        methods: {
            changeBoardName(event, board_id) {
                for(let a = 0; a < this.workspace.length; a++) {
                    this.workspace[a].workspace_data.forEach((value, index) => {
                        if(value.board_id == board_id) {
                            value.board_name = this.kanban.name
                        }
                    })
                }
            },
            changeWorkspace(event, target) {
                let old_workspace_id = this.kanban.workspace_id
                this.kanban.workspace_id = this.workspace_id_selected
                let board_move = {}
                console.log(this.workspace)
                for(let i = 0; i < this.workspace.length; i++) {
                    if(this.workspace[i].workspace_id == old_workspace_id)   {
                        for(let a = 0; a < this.workspace[i].workspace_data.length; a++) {
                            if(this.workspace[i].workspace_data[a].board_id == this.kanban.workspace_data.board_id) {
                                board_move = this.workspace[i].workspace_data[a]
                                this.workspace[i].workspace_data.splice(a, 1)
                                break;
                            }
                        }
                        break;
                    }
                }
                for(let i = 0; i < this.workspace.length; i++) {
                    if(this.workspace[i].workspace_id == this.workspace_id_selected)   {
                        this.workspace[i].workspace_data.push(board_move)
                        break;
                    }
                }
                this.workspace_id_selected = null
                this.$bvModal.hide("modal_move_workspace")
            },
            showModalMoveWorkspace() {
                this.workspace_id_selected = this.kanban.workspace_id
                this.$bvModal.show("modal_move_workspace")
            },
            resizeKanbanContainer() {
                if(!this.loading) {
                    let sidebar = document.getElementById("sidebar")
                    let width = window.innerWidth - sidebar.offsetWidth
                    document.getElementById('kanban_container').style.width = (width - 60) + 'px'
                }
            },
            loadDataWorkspace() {
                this.$axios.$get(`https://965f4f9f-449c-4d77-8560-7ccffe3f561c.mock.pstmn.io/workspace`)
                .then((response) => {
                    this.workspace = response.workspace
                    this.$nextTick()
                    this.$forceUpdate()
                    this.sidebarKey += 1
                })
            },
            loadDataBoard() {
                let id = this.$nuxt.$route.params.slug
                this.$axios.$get(`${process.env.BACKEND_URL}/api/board?id=62a19d9ef243480499051229`)
                .then((response) => {
                    if(response.status == 'OK') {
                        this.loading = false
                        this.kanban = response.data
                        setTimeout(() => {
                            console.log(this.kanban)
                            this.resizeBoard()
                            this.resizeKanbanContainer()
                            // Listen to window resize
                            window.addEventListener('resize', () => {
                                this.resizeKanbanContainer()
                            })
                            // UNCOMMENT ME IF FINISHED
                            // Listen to sidebar resize
                            // new ResizeObserver(() => {
                            //     this.resizeKanbanContainer()
                            // }).observe(document.getElementById('sidebar'))
                            this.sidebarKey += 1
                            document.title = `${this.kanban.name} Board`
                        }, 200)
                    }
                })
                // this.$axios.$get(`https://965f4f9f-449c-4d77-8560-7ccffe3f561c.mock.pstmn.io/kanban/${id}`)
                // .then((response) => {
                //     this.kanban = response
                //     this.loading = false
                //     this.$nextTick()
                //     setTimeout(() => {
                //         this.resizeBoard()
                //         this.resizeKanbanContainer()
                //         // Listen to window resize
                //         window.addEventListener('resize', () => {
                //             this.resizeKanbanContainer()
                //         })
                //         // Listen to sidebar resize
                //         new ResizeObserver(() => {
                //             this.resizeKanbanContainer()
                //         }).observe(document.getElementById('sidebar'))
                //         this.sidebarKey += 1
                //         document.title = `${this.kanban.workspace_data.board_name} Board`
                //     }, 200)
                // })
            },
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
                this.kanban.lists.push({
                    "name": this.add_list_value,
                    "cards": []
                })
                this.disableAddList()
            },
            resizeBoard() {
                if("board_input" in this.$refs) {
                    this.$refs.board_input.style.width = (this.$refs.board_input_ref.offsetWidth + 30) + 'px';
                }
            },
        },
        data() {
            return {
                sidebarKey: 0,
                loading: true,
                workspace_id_selected: null,
                workspace: [
                ],

                add_list_enabled: false,
                add_list_id: null,
                add_list_value: "",

                // FOR PROFILE CARD
                profile_data: {
                    current_member: {},
                    member_list: {}
                },

                add_to_card_type: '',

                // MAIN DATA FOR CARD
                kanban: {}
            }
        },
        components: {
            Card,
            draggable,
            Topbar,
            CardProfileMember,
            AddToCard,
            WorkspaceSidebar
        }
    }
</script>