<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<template>
    <div class="w-100 h-100" v-on:click="closePopUp">
        <div class="d-flex w-100 h-100">
            <div class="container-fluid">
                <div class="row" id="toolbar_section">
                    <div class="d-flex">
                        <span>
                            <div>
                                <p ref="board_input_ref" id="board_input_ref">{{ board.name }}</p>
                            </div>
                            <input ref="board_input" v-on:keyup.enter="$event.target.blur()" type="text" id="board_input" v-model="board.name" @focus="storeOldValue($event)"  v-on:keyup="resizeBoard" v-on:blur="changeBoardName($event, board._id)" />
                        </span>
                        <span class="ml-1">
                            <span class="text-white transparent-button font-sm btn">{{ board.workspace_id ? board.workspace_id.name : '' }} <span class="ml-1"></span></span>
                        </span>
                        <div v-for="(member, member_index) in $store.state.members.all_members" :key="member._id" class="ml-1 px-1 py-1 position-relative member" ref="card_info_ref" @click.stop="" data-toggle="tooltip" data-placement="top" :title="member.name" :style="(member_index > 0 ? {
                            marginLeft: '-20px !important'
                        } : {})">
                            <img :src="member.profile_pic" class="profile-pic-thumbs rounded-circle" v-if="(typeof member.profile_pic != 'undefined' && member.profile_pic != '')" />
                            <div class="profile-pic-thumbs bg-primary text-white py-1 text-center rounded-circle" v-else>
                                {{ generateProfileName(member.name) }}
                            </div>
                        </div>
                        <div class="px-1 py-1 position-relative member hover-pointer d-inline-block" ref="card_info_ref" @click.stop="" data-toggle="tooltip" data-placement="top" title="Add member" style="margin: 0" v-on:click="togglePopUp($event)">
                            <p class="px-0 py-1 profile-pic-thumbs rounded-circle" style="text-align: center; margin: auto 0;background-color: #E5E7EB;">
                                <span><i class="fa fa-plus"></i></span>
                            </p>
                        </div>                               
                        <PopUp title="Guest Members" :show="show_popup" :popup_trigger="popup_trigger" @close="closePopUp">
                            <template slot="component_render" @click.stop="">
                                <div @click.stop="">
                                    <div class="form-group">
                                        <multiselect :options="guestMember" :searchable="true" :multiple="true" :close-on-select="false" :clear-on-select="true" track-by="name" label="name" v-model="member_multiselect" :hide-selected="true">
                                        </multiselect>
                                    </div>
                                    <div class="form-group">
                                        <button class="btn btn-primary btn-block" v-on:click="saveMember">Save</button>
                                    </div>
                                </div>
                            </template>
                        </PopUp>
                    </div>
                </div>
                <div class="row pl-5 pr-5" id="kanban_section" style="width: 100%;">
                    <div id="kanban_container" ref="kanban_container_ref">
                        <draggable v-model="board.lists" tag="div" class="pb-5 d-flex" animation=250 @end="endDrag">
                            <div v-for="(k, index) in board.lists" :key="k._id" v-on:mousedown="dragCard(k._id, index)">
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
                                <input ref="add_list_ref" v-model="add_list_value" class="form-control kanban-text" placeholder="Enter list title" v-on:keyup.enter="addList" />
                                <div class="d-flex mt-2">
                                    <button class="btn btn-primary kanban-text" v-on:click="addList">Add List</button>
                                    <button class="btn btn-transparent kanban-text" v-on:click="disableAddList()"><i class="fa fa-times"></i></button>
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
</template>

<script>
    import draggable from "vuedraggable"
    import Card from "./Card.vue"
    import CardProfileMember from "./CardProfileMember.vue"
    import Topbar from "../Topbar.vue"
    import PopUp from './PopUp.vue'
    import Multiselect from 'vue-multiselect'

    export default {
        async mounted() {
            this.board_id = this.$route.query.board_id
            this.loadDataBoard()
            this.resizeKanbanContainer()
            new ResizeObserver(() => {
                this.resizeKanbanContainer()
            }).observe(document.getElementById("sidebar"))
            window.addEventListener('resize', () => {
                this.resizeKanbanContainer()
            })
        },
        watch: {
            '$route.query': function() {
                this.board_id = this.$route.query.board_id
                this.loadDataBoard()
                this.resizeKanbanContainer()
            },
            'board_id': function() {
                this.loadDataMember()
                this.loadDataAllMember()
            }
        },
        computed: {
            guestMember() {
                return this.all_members.filter((value) => {
                    if(this.board.workspace_id){
                        let current_workspace = this.board.workspace_id._id
                        let current_user_id = this.$store.state.auth.identity._id
                        if(value.workspace_id != current_workspace && current_user_id != value._id) return value
                    }
                })
            },
        },
        methods: {
            endDrag($event) {
                this.drag_data['index'] = $event.newIndex.toString()
                let config = {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
                this.$axios.$put(`/api/list/slide`, this.drag_data, config)
                .then((response) => {
                    if(response.status == 'OK') {
                        // Do Something
                        this.drag_data = {}
                    }
                }) 
                .catch((error) => {
                    alert('Error: Telah terjadi kesalahan')
                })
            },
            dragCard(card_id, index){
                this.drag_data['board_id'] = this.board_id
                this.drag_data['list_id'] = card_id
            },
            saveMember() {
                let member_exist = false
                let index = null;
                let members_id = []
                let board_members_and_guest = Object.assign([], this.$store.state.members.all_members)
                let board_members = []
                let current_workspace = this.$store.state.auth.identity.workspace_id._id
                for(let a = 0; a < board_members_and_guest.length; a++) {
                    if(board_members_and_guest[a].workspace_id == current_workspace) {
                        board_members.push(board_members_and_guest[a])
                    }
                }
                if(this.member_multiselect.length > 0) {
                    for(let a = 0; a < this.member_multiselect.length; a++) {
                        members_id.push(this.member_multiselect[a]._id)
                        board_members.push(this.member_multiselect[a])
                    }
                }
                let config = {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
                this.$store.commit('members/loadMembers', board_members)
                this.$axios.$put(`/api/board/member`, {
                    id: this.board_id,
                    members: members_id
                }, config)
                .then((response) => {
                    if(response.status == 'OK') {
                        // Do Something
                        this.show_popup = false
                    }
                })
                .catch((error) => {
                    alert("Error: Telah terjadi kesalahan")
                })
            },
            closePopUp() {
                this.show_popup = false
            },
            loadDataBoard() {
                let id = this.board_id
                if(!id) {
                    this.$router.push('/')
                    return
                }

                this.$axios.$get(`/api/board?id=${id}`)
                .then((response) => {
                    if(response.status == 'OK') {
                        if('data' in response == false) {
                            this.$router.push('/')
                            return
                        }
                        this.board = response.data
                        this.$nextTick(() => {
                            this.resizeBoard()
                            document.title = `${this.board.name} Board`
                        })
                    }
                })
            },
            loadDataMember() {
                this.$axios.$get(`/api/member?board_id=${this.board_id}`)
                .then((response_member) => {
                    if(response_member.status == 'OK') {
                        let {data} = response_member
                        this.$store.commit('members/loadMembers', data)
                        data = data.filter((value) => {
                            let current_workspace = this.board.workspace_id._id
                            let current_user_id = this.$store.state.auth.identity._id
                            if(value.workspace_id != current_workspace && current_user_id != value._id) return value
                        })
                        this.member_multiselect = data
                    }
                })
            },
            loadDataAllMember() {
                this.$axios.$get(`/api/member`)
                .then((response_member) => {
                    if(response_member.status == 'OK') {
                        let {data} = response_member
                        this.all_members = data
                    }
                })
            },
            togglePopUp(event) {
                this.show_popup = !this.show_popup
                if(this.show_popup) {
                    let rect = event.currentTarget.getBoundingClientRect()
                    let obj = {
                        top: rect.top,
                        right: rect.right,
                        bottom: rect.bottom,
                        left: rect.left,
                        width: rect.width,
                        height: rect.height,
                        x: rect.x,
                        y: rect.y
                    }
                    this.popup_trigger = obj
                }
                else {
                    this.popup_trigger = null
                }
            },
            resizeKanbanContainer() {
                let sidebar = document.getElementById("sidebar")
                let width = window.innerWidth - sidebar.offsetWidth
                let kanban_container = document.getElementById('kanban_container')
                if(kanban_container) {
                    kanban_container.style.width = (width - 60) + 'px'
                }
            },
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
            changeBoardName(event, board_id) {
                let check = false
                if(this.board.name.trim() == '' || this.board.name == this.old_value) {
                    this.board.name = this.old_value
                    this.old_value = ''
                    check = true
                }
                this.old_value = ''
                let sidebar_data = Object.assign([], this.$store.state.sidebar.sidebar_data)
                for(let a = 0; a < sidebar_data.boards.length; a++) {
                    if(sidebar_data.boards[a]._id == board_id) {
                        sidebar_data.boards[a].name = this.board.name
                    }
                }
                this.$store.commit('sidebar/setSidebarData', sidebar_data)
                document.title = `${this.board.name} Board`
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
                show_popup: false,
                popup_trigger: null,
                board_id: null,
                all_members: [],
                member_multiselect: [],
                board_members: this.$store.state.members.all_members,
                sidebar_observer: null,
                sidebarKey: 0,
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
                board: {},
                drag_data: {}
            }
        },
        components: {
            Card,
            draggable,
            Topbar,
            CardProfileMember,
            PopUp,
            Multiselect
        }
    }
</script>