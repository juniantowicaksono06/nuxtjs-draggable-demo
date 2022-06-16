<!-- <style>
    @import '../assets/styles/board.css';
</style> -->
<template>
    <div class="w-100 h-100" id="content_wrap" v-on:click="closePopUp">
        <div class="w-100 h-100" v-if="!loading">
            <!-- <Topbar :data="{
                workspace: workspace
            }" :key="sidebarKey" /> -->
            <div class="h-100 d-flex">
                <div>
                    <WorkspaceSidebar :data="{
                        workspace: workspace,
                        boards: all_board
                    }" :key="sidebarKey" />
                </div>
                <div class="d-flex position-relative w-100 h-100">
                    <div class="container-fluid">
                        <div class="row" id="toolbar_section">
                            <div class="d-flex">
                                <span>
                                    <div>
                                        <p ref="board_input_ref" id="board_input_ref">{{ board.name }}</p>
                                    </div>
                                    <input ref="board_input" type="text" id="board_input" v-model="board.name" @focus="storeOldValue($event)"  v-on:keyup="resizeBoard" v-on:blur="changeBoardName($event, board._id)" />
                                </span>
                                <span class="ml-1" v-for="work in workspace" v-if="work._id == board.workspace_id._id">
                                    <span class="text-white transparent-button font-sm btn">{{ work.name }} <span class="ml-1"></span></span>
                                </span>
                                <span class="ml-1 d-flex" v-for="work in workspace" v-if="work._id == board.workspace_id._id">
                                    <div v-for="(member, member_index) in all_members" :key="member_index" class="px-1 py-1 position-relative member" ref="card_info_ref" @click.stop="" data-toggle="tooltip" data-placement="top" :title="member.name" :style="(member_index > 0 ? {
                                        marginLeft: '-20px'
                                    } : {})">
                                        <img :src="member.profile_pic" class="profile-pic-thumbs rounded-circle" v-if="(typeof member.profile_pic != 'undefined' && member.profile_pic != '')" />
                                        <div class="profile-pic-thumbs bg-primary text-white py-1 text-center rounded-circle" v-else>
                                            {{ generateProfileName(member.name) }}
                                        </div>
                                    </div>
                                </span>
                            </div>
                        </div>
                        <div class="row pl-5 pr-5" id="kanban_section" style="width: 100%;">
                            <div id="kanban_container" ref="kanban_container_ref">
                                <draggable tag="div" class="pb-5 d-flex" animation=250>
                                    <div v-for="(k, index) in board.lists" :key="index">
                                        <Card :data="{
                                            kanban: k,
                                            index: index,
                                            board_id: board._id,
                                            workspace_id: board.workspace_id._id
                                        }" />
                                    </div>
                                </draggable>
                                <div>
                                    <div :class="((!add_list_enabled && add_list_id == null) ? 'add-list transparent-button d-block' : 'add-list transparent-button d-none')" v-on:click="showAddListInput">
                                        <span class="mb-0" style="font-size: 14px;"><strong>+</strong> Add another list</span>
                                    </div>
                                    <div :class="((!add_list_enabled && add_list_id == null) ? 'add-list2 card d-none' : 'add-list2 card d-block')">
                                        <input ref="add_list_ref" v-model="add_list_value" class="form-control kanban-text" placeholder="Enter list title" />
                                        <div class="d-flex mt-2">
                                            <button class="btn btn-primary kanban-text" v-on:click="addList">Add List</button>
                                            <button class="btn btn-transparent kanban-text" v-on:click="disableAddList()"><font-awesome-icon :icon="['fa', 'xmark']"/></button>
                                        </div>
                                    </div>
                                </div>
                            </div>
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
                                <option v-for="work in workspace" :value="work._id">
                                    {{ work.name }}
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
    import CardPopup from "./CardPopup.vue"
    import WorkspaceSidebar from "../workspace/WorkspaceSidebar.vue"
    export default {
        async mounted() {
            this.loadDataWorkspace()
            this.loadDataBoard()
            this.loadMembers()
        },
        methods: {
            storeOldValue(event) {
                event.target.select()
                this.old_value = this.board.name
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
            async loadMembers() {
                let urlParams = new URLSearchParams(window.location.search)
                let id = urlParams.get('board_id')
                let response = await this.$axios.$get(`/api/member?board_id=${id}`)
                if(response.status == 'OK') {
                    let {data} = response
                    this.$store.commit('members/loadMembers', data)
                    this.all_members = this.$store.state.members.all_members
                }
            },
            loadDataWorkspace() {
                this.$axios.$get(`/api/workspace`)
                .then((response_workspace) => {
                    if(response_workspace.status != 'OK') {
                        return
                    }
                    this.$axios.$get(`/api/board`)
                    .then((response_board) => {
                        if(response_board.status != 'OK') {
                            return
                        }
                        this.workspace = response_workspace.data
                        this.all_board = response_board.data
                        this.$nextTick()
                        this.$forceUpdate()
                        this.sidebarKey += 1
                    }) 
                })
            },
            loadDataBoard() {
                let urlParams = new URLSearchParams(window.location.search)
                let id = urlParams.get('board_id')

                this.$axios.$get(`/api/board?id=${id}`)
                .then((response) => {
                    if(response.status == 'OK') {
                        this.loading = false
                        this.board = response.data
                        this.sidebarKey += 1
                        this.$nextTick(() => {
                            this.resizeBoard()
                            document.title = `${this.board.name} Board`
                        })
                    }
                })
            },
            changeBoardName(event, board_id) {
                let check = false
                if(this.board.name.trim() == '' || this.board.name == this.old_value) {
                    this.board.name = this.old_value
                    this.old_value = ''
                    check = true
                }
                this.old_value = ''
                for(let a = 0; a < this.all_board.length; a++) {
                    if(this.all_board[a]._id == board_id) {
                        this.all_board[a].name = this.board.name
                    }
                }
                if(check) {
                    this.resizeBoard()
                    return 
                }
                let config = {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }
                this.$axios.$put(`/api/board`, new URLSearchParams({
                    name: this.board.name,
                    id: this.board._id
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
            changeWorkspace(event, target) {
                this.board.workspace_id._id = this.workspace_id_selected
                for(let i = 0; i < this.all_board.length; i++) {
                    if(this.board._id == this.all_board[i]._id) {
                        this.all_board[i].workspace_id = this.workspace_id_selected
                        break
                    }
                }
                this.workspace_id_selected = null
                this.$bvModal.hide("modal_move_workspace")
            },
            showModalMoveWorkspace() {
                this.workspace_id_selected = this.board.workspace_id._id
                this.$bvModal.show("modal_move_workspace")
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
                this.$nextTick(() => {
                    this.$refs.add_list_ref.focus()
                    let kanban_container_ref = this.$refs.kanban_container_ref
                    if(kanban_container_ref.scrollWidth > kanban_container_ref.clientWidth) {
                        kanban_container_ref.scrollTo(kanban_container_ref.scrollWidth, kanban_container_ref.scrollHeight)
                    }
                })
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
                let config = {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }
                this.$axios.$post(`/api/list`, new URLSearchParams({
                    name: this.add_list_value,
                    board_id: this.board._id
                }), config)
                .then((response) => {
                    if(response.status == 'OK') {
                        this.board.lists.push({
                            "name": this.add_list_value,
                            "cards": []
                        })
                        this.disableAddList()
                        return 
                    }
                    alert("Telah terjadi kesalahan")
                })
                .catch((error) => {
                    alert("Error: Telah terjadi kesalahan")
                })
            },
            resizeBoard() {
                if("board_input" in this.$refs) {
                    this.$refs.board_input.style.width = (this.$refs.board_input_ref.offsetWidth + 30) + 'px';
                }
            },
        },
        data() {
            return {
                all_members: this.$store.state.members.all_members,
                sidebar_observer: null,
                all_board: [],
                sidebarKey: 0,
                loading: true,
                workspace_id_selected: null,
                workspace: [
                ],

                add_list_enabled: false,
                add_list_id: null,
                add_list_value: "",

                // DATA FOR PROFILE CARD
                profile_data: {
                    current_member: {},
                    member_list: {}
                },

                add_to_card_type: '',

                // MAIN DATA FOR BOARD AND CARDS
                board: {}
            }
        },
        components: {
            Card,
            draggable,
            Topbar,
            CardProfileMember,
            CardPopup,
            WorkspaceSidebar
        }
    }
</script>