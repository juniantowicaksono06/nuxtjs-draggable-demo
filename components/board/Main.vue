<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<style scoped>
    #guest_member_list {
        max-width: 80vw;
        overflow: hidden;
    }
    #archive_content {
        max-height: 500px;
        overflow-y: auto;
        overflow-x: hidden;
    }
    #upload_background {
        min-height: 150px;
        border: 1px dashed darkgray;
    }
    #background_file {
        min-height: 150px;
        /* visibility: hidden; */
        opacity: 0;
        position: relative;
        z-index: 999;
    }
    #background_file:hover {
        cursor: pointer;
    }
    #drag_and_drop_file:hover {
        cursor: pointer;
    }
    #drag_and_drop_file {
        position: absolute;
        top: 30%;
        left: 18%;
    }
</style>
<template>
    <div class="w-100 h-100" v-on:click="closePopUp">
        <div class="d-flex w-100 h-100">
            <div class="container-fluid">
                <div class="row w-100" id="toolbar_section">
                    <div class="d-flex w-100">
                        <span>
                            <div>
                                <p ref="board_input_ref" id="board_input_ref">{{ board.name }}</p>
                            </div>
                            <input ref="board_input" v-on:keyup.enter="$event.target.blur()" type="text" id="board_input" v-model="board.name" @focus="storeOldValue($event)"  v-on:keyup="resizeBoard" v-on:blur="renameBoard($event, board._id)" />
                        </span>
                        <span class="ml-1">
                            <span class="text-white transparent-button font-sm btn">{{ board.workspace_id ? board.workspace_id.name : '' }} <span class="ml-1"></span></span>
                        </span>
                        <div id="guest_member_list">
                            <div v-for="(member, member_index) in $store.state.members.board_members" :key="member._id" class="ml-1 px-1 py-1 position-relative member d-inline-block" ref="card_info_ref" @click.stop="" v-b-tooltip.hover data-placement="top" :title="member.name" :style="(member_index > 0 ? {
                                marginLeft: '-20px !important'
                            } : {})">
                                <img :src="member.picture" class="profile-pic-thumbs rounded-circle" v-if="(typeof member.picture != 'undefined' && member.picture != '')" />
                                <div class="profile-pic-thumbs bg-primary text-white py-1 text-center rounded-circle" v-else>
                                    {{ generateProfileName(member.name) }}
                                </div>
                            </div>
                        </div>
                        <div class="px-1 py-1 position-relative member hover-pointer d-inline-block" ref="card_info_ref" @click.stop="" data-toggle="tooltip" data-placement="top" title="Add member" style="margin: 0" v-on:click="togglePopUp($event)" v-if="isGuest">
                            <p class="px-0 py-1 profile-pic-thumbs rounded-circle" style="text-align: center; margin: auto 0;background-color: #E5E7EB;">
                                <span><i class="fa fa-plus"></i></span>
                            </p>
                        </div>                               
                        <div class="text-white transparent-button font-sm btn ml-3" ref="archive_ref" id="archive_ref" v-on:click="openArchiveModal">
                            <span>Archive</span>
                        </div>
                        <div class="text-white transparent-button font-sm btn ml-3" ref="edit_board_ref" id="edit_board_ref" v-on:click="openEditBoardModal">
                            <span>Edit Board</span>
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
                        <div style="margin-left: auto; margin-right: 20px;">
                            <UserMenu />
                        </div>
                    </div>
                </div>
                <div class="row pl-5 pr-5" id="kanban_section" style="width: 100%;">
                    <div id="kanban_container" ref="kanban_container_ref">
                        <draggable v-model="board.lists" tag="div" class="pb-5 d-flex" animation=250 @end="endDrag">
                            <div v-for="(list, index) in board.lists" :key="list._id" v-on:mousedown="dragCard(list._id, index)">
                                <Card :data="{
                                    list: list,
                                    index: index,
                                    board_id: board._id,
                                    workspace_id: board.workspace_id._id
                                }" />
                            </div>
                        </draggable>
                        <div>
                            <div :class="((!add_list_enabled && add_list_id == null) ? 'add-list transparent-button d-block' : 'add-list transparent-button d-none')" v-on:click="enableAddList">
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
        <b-modal id="edit_board_modal" hide-footer size="md" title="Edit Board">
            <div class="row">
                <div class="col-12">
                    <div class="form-group">
                        <label for="board_title" class="kanban-text">
                            Board Title
                        </label>
                        <input type="text" class="form-control" placeholder="Board Title" v-model="board_title" v-on:keypress.enter="saveBoard" />
                    </div>
                    <div class="form-group mb-0">
                        <label class="kanban-text">
                            Project Platform
                        </label>
                    </div>
                    <div class="row">
                        <div class="col-12 col-md-4 col-lg-4">
                            <div class="form-check">
                                <input type="checkbox" class="form-check-input" value="Aplikasi Mobile" v-model="board_platform_list['Aplikasi Mobile']" :checked="board_platform_list['Aplikasi Mobile']">
                                <label for="aplikasiMobile" class="form-check-label"> Aplikasi Mobile</label>
                            </div>
                        </div>
                        <div class="col-12 col-md-4 col-lg-4">
                            <div class="form-check">
                                <input type="checkbox" class="form-check-input" value="Bot Telegram" v-model="board_platform_list['Bot Telegram']" :checked="board_platform_list['Bot Telegram']">
                                <label for="botTelegram" class="form-check-label"> Bot Telegram</label>
                            </div>
                        </div>
                       <div class="col-12 col-md-4 col-lg-4">
                            <div class="form-check">
                                <input type="checkbox" class="form-check-input" value="Web" v-model="board_platform_list['Web']" :checked="board_platform_list['Web']">
                                <label for="web" class="form-check-label"> Web</label>
                            </div>
                       </div> 
                    </div>
                    <div class="form-group" v-if="board_platform_list['Bot Telegram']">
                        <label for="bot_url" class="kanban-text">
                            Bot URL
                        </label>
                        <input type="text" class="form-control" placeholder="Bot URL" v-model="board_bot_url" v-on:keypress.enter="saveBoard" />
                    </div>
                    <div class="form-group" v-if="board_platform_list['Web']">
                        <label for="access_url" class="kanban-text">
                            Access URL
                        </label>
                        <input type="text" class="form-control" placeholder="Access URL" v-model="board_url" v-on:keypress.enter="saveBoard" />
                    </div>
                    <div class="form-group">
                        <label for="project_owner" class="kanban-text">
                            Project Owner
                        </label>
                        <input type="text" class="form-control" placeholder="Project Owner" v-model="board_project_owner" v-on:keypress.enter="saveBoard" />
                    </div>
                    <div class="form-group">
                        <label for="sub_department" class="kanban-text">
                            Sub Departement
                        </label>
                       
                        <select class="form-control" v-model="board_sub_dept">
                            <option value="" selected>Select Sub Departement</option>
                            <option :value="subdept" v-for="subdept in workspaceSubdept">{{ subdept }}</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="description" class="kanban-text">
                            Description
                        </label>
                        <!-- <input type="text" class="form-control" placeholder="Description" v-model="board_title" v-on:keypress.enter="saveBoard" /> -->
                        <textarea id="" rows="3" class="form-control" v-model="board_description" style="resize: none;" placeholder="Add a Description"></textarea>
                    </div>
                    <div class="form-group">
                        <label for="change_background" class="kanban-text">
                            Change Background
                        </label>
                        <div class="w-100 mb-3" v-if="bg_picture">
                            <img :src="bg_picture" alt="" class="w-100">
                        </div>
                        <div class="position-relative" id="upload_background">
                            <input type="file" id="background_file" ref="background_file_ref" v-on:change="fileChange" accept=".png,.jpg,.jpeg">
                            <div class="text-center" id="drag_and_drop_file">
                                <span><i class="fa fa-camera fa-3x"></i></span>
                                <div class="text-center">
                                    <span>Drag or Click Here To Upload Background</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="form-group">
                        <button class="btn btn-primary btn-block" v-on:click="saveBoard">Save</button>
                    </div>
                </div>
            </div>
        </b-modal>
        <b-modal id="card_archive_list" hide-footer size="md" title="Card Archive List">
            <div class="row" id="archive_content">
                <div class="col-12" v-if="archive_card.length">
                    <div v-for="archive in archive_card" :key="archive._id">
                        <CardItem :data="{
                            item: archive,
                            archive: true
                        }" @restoreArchive="restoreArchive" />
                    </div>
                </div>
                <div class="col-12" v-else>
                    <div class="text-center">
                        <h1><span><i class="fa fa-exclamation-circle text-secondary"></i></span></h1>
                        <h5 class="text-center">NO ARCHIVE FOUND!</h5>
                    </div>
                </div>
            </div>
        </b-modal>
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
    import PopUp from './PopUp.vue'
    import Multiselect from 'vue-multiselect'
    import CardItem from './CardItem.vue'
    import Swal from 'sweetalert2'
    import UserMenu from '../global/UserMenu.vue'
    // import { StencilPreview, BoundingBox, DraggableArea } from 'vue-advanced-cropper';
    import "vue-advanced-cropper/dist/style.css";

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
            document.addEventListener('keyup', this.onEscape)
            this.webSocketEvent()
        },
        watch: {
            '$route.query': function() {
                this.board_id = this.$route.query.board_id
                this.loadDataBoard()
                this.resizeKanbanContainer()
            },
            'board': function() {
                this.$nextTick(() => {
                    // this.loadDataMember()
                    this.loadDataMember()
                })
            },
            'board_id': function() {
                this.$nextTick(() => {
                    // this.loadDataAllMember()
                    this.loadDataMember()
                })
            },
            'board.name': function() {
                this.resizeBoard()
            }
        },
        computed: {
            isGuest: function() {
                if(this.board.workspace_id == null) return true
                let current_user_workspace = this.$store.state.auth.identity.workspace
                return current_user_workspace.find((a) => a['_id'] == this.board.workspace_id._id) != undefined
            },
            wsInstance: function() {
                return this.$getWsInstance()
            },
            kanbanURL: function() {
                return process.env.BACKEND_URL
            },
            guestMember() {
                return this.guest_members
                // return this.board_members.filter((value) => {
                //     if(this.board.workspace_id){
                //         let current_workspace = this.board.workspace_id._id
                //         let current_user_id = this.$store.state.auth.identity._id
                //         if(value.workspace_id != current_workspace && current_user_id != value._id) return value
                //     }
                // })
            },
            workspaceSubdept: function(){
                let subdept = []
                this.$store.state.auth.identity.workspace.forEach(workspace => {
                    workspace.subdept.forEach(dept => {
                        subdept.push(dept)
                    });
                });
                return subdept
            },
        },
        beforeDestroy() {
            let content_wrap = document.getElementById('content_wrap')
            content_wrap.style = ''
        },
        methods: {
            webSocketEvent() {
                this.wsInstance.on('slide_item', (response) => {
                    let result = JSON.parse(response)
                    let data = result.data
                    if(data.item.board_id != this.board_id) return
                    let card_data = null
                    this.board.lists.some((list, list_index) => {
                        if(list._id == data.item.origin_list_id) {
                            list.cards.some((card, card_index) => {
                                if(card._id == data.item.id) {
                                    card_data = card   
                                    this.board.lists[list_index].cards.splice(card_index, 1)
                                    return
                                }
                            })
                            return
                        }
                    })
                    this.board.lists.some((list, index) => {
                        if(list._id == data.item.dest_list_id) {
                            list.cards.push(card_data)      
                            return
                        }
                    })
                })
                this.wsInstance.on('restore_item', (response) => {
                    let result = JSON.parse(response)
                    let data = result.data
                    if(result.board_id != this.board_id) return
                    this.board.lists.some((list, index) => {
                        if(list._id == result.list_id) {
                            this.board.lists[index].cards.push(data)
                            return true
                        }
                    })
                })
                this.wsInstance.on('slide_list', (response) => {
                    let result = JSON.parse(response)
                    let data = result.data
                    if(data.lists.board_id != this.board_id) return
                    this.board.lists.some((list, index) => {
                        if(list._id == data.lists['list_id']) {
                            this.board.lists.splice(data.lists['index'], 0, this.board.lists.splice(index, 1)[0])
                            return true
                        }
                    })
                    console.log(this.board.lists)
                })
                this.wsInstance.on('archive_item', (response) => {
                    let data = JSON.parse(response)
                    this.board.lists.some((list, index) => {
                        if(list._id == data.list_id) {
                            if(list.cards.length > 0) {
                                list.cards.some((card, index) => {
                                    if(card._id == data.data['card_id']) {
                                        list.cards.splice(index, 1)
                                        return
                                    }
                                })
                            }
                            return
                        }
                    })
                })
                this.wsInstance.on('edit_board', (response) => {
                    let result = JSON.parse(response)
                    if(this.board._id == result['board_id']) {
                        this.board = {
                            ...this.board,
                            ...result.data
                        }
                        if(result.data.name) {
                            this.board_title = result.data.name
                            document.title = `${this.board_title} Board`
                        }
                        if(result.data.url) {
                            this.board_url = result.data.url
                        }
                        if(result.data.bot_url) {
                            this.board_bot_url = result.data.bot_url
                        }
                        if(result.data.description) {
                            this.board_description = result.data.description
                        }
                        if(result.data.project_owner) {
                            this.board_project_owner = result.data.project_owner
                        }
                        if(result.data.subdept) {
                            this.board_sub_dept = result.data.subdept
                        }
                        if(result.data.platform) {
                            this.board_platform_list = result.data.platform
                        }
                    }
                })
                this.wsInstance.on('add_list', (data) => {
                    this.board.lists.push(JSON.parse(data))
                })
            },
            fileChange() {
                const files = this.$refs.background_file_ref.files
                var file_reader = this.$convertFileTob64(files[0])
                file_reader.onload = () => {
                    this.bg_picture = file_reader.result
                }
                file_reader.onerror = (error) => {
                    Swal.fire({
                        text: 'Telah terjadi kesalahan',
                        toast: true,
                        timer: 3000,
                        position: 'bottom-right',
                        showConfirmButton: false,
                        showCancelButton: false,
                        icon: 'error',
                        title: 'Error'
                    })
                }
            },
            onEscape(e) {
                if(e.key == 'Escape') {
                    let board_input = document.getElementById('board_input')
                    if(board_input) {
                        board_input.blur()
                    }
                    this.disableAddList()
                }
            },
            saveBoard() {
                if(this.board_title.trim() == '') return
                let config = {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
                let formData = new FormData()
                let ws_emit_data = {
                    name: this.board_title,
                    platform: {
                        "Aplikasi Mobile": false,
                        "Bot Telegram": false,
                        "Web": false
                    }

                }
                formData.append('id', this.board._id)
                formData.append('name', this.board_title)

                if(this.board_platform_list) {
                    for(const key in this.board_platform_list) {
                        if(key == 'Web') {
                            if(this.board_platform_list[key] == true) {
                                // dataSend['url'] = this.board_url
                                formData.append('url', this.board_url)
                                ws_emit_data['url'] = this.board_url
                            }
                            else {
                                // dataSend['url'] = ''
                                formData.append('url', '')
                                ws_emit_data['url'] = ''
                            }
                        }
                        if(key == 'Bot Telegram') {
                            if(this.board_platform_list[key] == true) {
                                // dataSend['bot_url'] = this.board_bot_url
                                formData.append('bot_url', this.board_bot_url)
                                ws_emit_data['bot_url'] = this.board_bot_url
                            }
                            else {
                                // dataSend['bot_url'] = ''
                                formData.append('bot_url', '')
                                ws_emit_data['bot_url'] = ''
                            }
                        }

                        if(this.board_platform_list[key] == true) {
                            // dataSend['platform'].push(key)
                            formData.append('platform[]', key)
                            ws_emit_data['platform'][key] = this.board_platform_list[key]
                        } 
                    }
                }
                else {
                    formData.append('platform[]', null)
                    formData.append('url', '')
                    formData.append('bot_url', '')
                    ws_emit_data['platform'] = []
                    ws_emit_data['url'] = ''
                    ws_emit_data['bot_url'] = ''
                }
                formData.append('project_owner', this.board_project_owner)
                formData.append('description', this.board_description)
                formData.append('subdept', this.board_sub_dept)
                ws_emit_data['project_owner'] = this.board_project_owner
                ws_emit_data['description'] = this.board_description
                ws_emit_data['subdept'] = this.board_sub_dept
                if(this.$refs.background_file_ref.files.length > 0) {
                    formData.append('picture', this.$refs.background_file_ref.files[0])
                }
                // dataSend['project_owner'] = this.board_project_owner
                // dataSend['description'] = this.board_description
                // dataSend['subdept'] = this.board_sub_dept
            
                this.$axios.$put(`/api/board`, formData, config)
                .then((response) => {
                    if(response.status == 'OK') {
                        const { data } = response
                        if(data) {
                            let content_wrap = document.getElementById('content_wrap')
                            content_wrap.style.backgroundImage = `url(${this.kanbanURL}file_upload/board_background/${data.picture})`
                        }
                        Swal.fire({
                            text: 'Board has been saved',
                            toast: true,
                            timer: 3000,
                            position: 'bottom-right',
                            showConfirmButton: false,
                            showCancelButton: false,
                            icon: 'success',
                            title: 'Success'
                        })
                        this.$wsEmit({
                            board_id: this.board._id,
                            data: ws_emit_data
                        }, 'edit_board')
                        let boards = JSON.stringify(this.$store.state.sidebar.sidebar_data.boards)
                        boards = JSON.parse(boards)
                        let workspaces = this.$store.state.sidebar.sidebar_data.workspaces
                        boards.some((value, index) => {
                            if(value._id == this.board._id) {
                                boards[index].name = this.board_title
                                boards[index].url = this.board_url
                                boards[index].project_owner = this.board_project_owner
                                boards[index].description = this.board_description

                                this.board.name = this.board_title
                                this.board.url = this.board_url
                                this.board.project_owner = this.board_project_owner
                                this.board.description = this.board_description
                                let sidebar_data = {
                                    workspaces: workspaces,
                                    boards: boards
                                }
                                this.$store.commit('sidebar/setSidebarData', sidebar_data)
                                document.title = `${this.board.name} Board`
                                return true
                            }
                        })
                    }
                }).catch((error) => {
                })
            },
            restoreArchive(item) {
                let config = {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }
                this.$axios.$post(`/api/restore`, new URLSearchParams({
                    id: item._id,
                }), config)
                .then((response) => {
                    if(response.status == 'OK') {
                        Swal.fire({
                            text: 'Card has been restore',
                            toast: true,
                            timer: 3000,
                            position: 'bottom-right',
                            showConfirmButton: false,
                            showCancelButton: false,
                            icon: 'success',
                            title: 'Success'
                        })
                        const {data} = response
                        this.board.lists.some((value, index) => {
                            if(value._id == item.list_id) {
                                item._id = data._id
                                this.board.lists[index].cards.push(item)
                                this.$wsEmit({
                                    board_id: this.board_id,
                                    list_id: this.board.lists[index]._id,
                                    data: {
                                        ...item
                                    }
                                }, 'restore_item')
                                return true
                            }
                        })
                    }
                    this.closeArchiveModal()
                })
                .catch(error => {
                    console.log(error)
                })
            },
            openEditBoardModal() {
                this.bg_picture = ''
                this.$bvModal.show('edit_board_modal')
            },
            openArchiveModal() {
                this.$axios.$get(`/api/archive?board_id=${this.board._id}`)
                .then((response) => {
                    if(response.status == 'OK') {
                        let {data} = response
                        this.$bvModal.show('card_archive_list')
                        this.archive_card = data.filter((value) => {
                            return value.board_id._id == this.board._id
                        })
                    }
                }) 
                .catch((error) => {})
            },
            closeArchiveModal() {
                this.$bvModal.hide('card_archive_list')
            },
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
                        this.$wsEmit({
                            data: {
                                lists: this.drag_data
                            }
                        }, 'slide_list')
                        this.drag_data = {}
                    }
                }) 
                .catch((error) => {})
            },
            dragCard(card_id, index){
                this.drag_data['board_id'] = this.board_id
                this.drag_data['list_id'] = card_id
            },
            saveMember() {
                let member_exist = false
                let index = null;
                let members_id = []
                let board_members_and_guest = Object.assign([], this.$store.state.members.board_members)
                let board_members = []
                let current_workspace = this.board.workspace_id._id
                for(let a = 0; a < board_members_and_guest.length; a++) {
                    board_members_and_guest[a].workspace.some((workspace) => {
                        if(workspace == current_workspace) {
                            board_members.push(board_members_and_guest[a])
                            return false
                        }
                    })
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
                this.board_platform_list = {
                    "Aplikasi Mobile": false,
                    "Bot Telegram": false,
                    "Web": false
                },

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
                            this.board_title = this.board.name
                            this.board_url = this.board.url
                            this.board_bot_url = this.board.bot_url
                            
                            this.board_sub_dept = this.board.subdept ? this.board.subdept : ''
                            if(this.board.platform) {
                                if(this.board.platform.length > 0) {
                                    this.board.platform.forEach((value) => {
                                        this.board_platform_list[value] = true
                                    })
                                }
                            }
                            this.board_project_owner = this.board.project_owner ? this.board.project_owner : ''
                            this.board_description = this.board.description ? this.board.description : ''
                            let picture = this.board.picture
                            let content_wrap = document.getElementById('content_wrap')
                            if(picture) {
                                content_wrap.style.backgroundImage = `url(${this.kanbanURL}file_upload/board_background/${picture})`
                            }
                            else {
                                content_wrap.style = ''
                            }
                        })
                    }
                })
            },
            loadDataMember() {
                if(!this.board) return false
                if(Object.keys(this.board).length == 0) return false
                this.$axios.$get(`/api/member?board_id=${this.board_id}`)
                .then((response_member) => {
                    if(response_member.status == 'OK') {
                        let {data} = response_member
                        this.$store.commit('members/loadMembers', data)
                        let member_pic = {}
                        data = data.filter((value) => {
                            let current_workspace = this.board.workspace_id._id
                            let current_user_id = this.$store.state.auth.identity._id
                            member_pic[value._id] = value.picture
                            if(value.workspace_id != current_workspace && current_user_id != value._id) return value
                        })
                        this.$axios.$get(`/api/guest_member/${this.board.workspace_id._id}`)
                        .then((response) => {
                            if(response.status == 'OK') {
                                let current_user = this.$store.state.auth.identity
                                // let all_members = response.data
                                this.guest_members = response.data
                                this.member_multiselect = data.filter((member) => {
                                    for(let i = 0; i < response.data.length; i++) {
                                        if(response.data[i]._id == member._id && current_user.workspace.find((a) => a['_id'] == this.board.workspace_id._id) != 'undefined') {
                                            return member
                                        } 
                                    }
                                })
                            }
                        })
                        // this.loadDataAllMember
                        this.$store.commit('members/loadMembersPicture', member_pic)
                        this.board_members = data
                    }
                })
            },
            loadDataAllMember() {
                this.$axios.$get(`/api/member`)
                .then((response_member) => {
                    if(response_member.status == 'OK') {
                        let {data} = response_member
                        this.board_members = data
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
                let kanban_container = document.getElementById('kanban_container')
                if(kanban_container && sidebar) {
                    let width = window.innerWidth - sidebar.offsetWidth
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
            renameBoard(event, board_id) {
                let check = false
                if(this.board.name.trim() == '' || this.board.name == this.old_value) {
                    this.board.name = this.old_value
                    this.old_value = ''
                    check = true
                }
                this.old_value = ''
                // let sidebar_data = Object.assign([], this.$store.state.sidebar.sidebar_data)
                let sidebar_data = JSON.parse(JSON.stringify(this.$store.state.sidebar.sidebar_data))
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
                        this.board_title = this.board.name
                        // Do Something
                        Swal.fire({
                            text: 'Board has been rename',
                            toast: true,
                            timer: 3000,
                            position: 'bottom-right',
                            showConfirmButton: false,
                            showCancelButton: false,
                            icon: 'success',
                            title: 'Success'
                        })
                        this.$wsEmit({
                            board_id: this.board._id,
                            data: {
                                name: this.board.name 
                            }
                        }, 'edit_board')
                    }
                })
                .catch((error) => {
                    Swal.fire({
                        text: 'Telah terjadi kesalahan',
                        toast: true,
                        timer: 3000,
                        position: 'bottom-right',
                        showConfirmButton: false,
                        showCancelButton: false,
                        icon: 'error',
                        title: 'Error'
                    })
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
            enableAddList() {
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
                        const {data} = response
                        this.board.lists.push({
                            "_id": data._id,
                            "name": this.add_list_value,
                            "cards": []
                        })
                        this.$wsEmit({
                            "_id": data._id,
                            "name": this.add_list_value,
                            "cards": []
                        }, 'add_list')
                        Swal.fire({
                            text: 'List has been created',
                            toast: true,
                            timer: 3000,
                            position: 'bottom-right',
                            showConfirmButton: false,
                            showCancelButton: false,
                            icon: 'success',
                            title: 'Success'
                        })
                        this.disableAddList()
                    }
                })
                .catch((error) => {
                })
            },
            resizeBoard() {
                if("board_input" in this.$refs) {
                    this.$nextTick(() => {
                        this.$refs.board_input.style.width = (this.$refs.board_input_ref.offsetWidth + 30) + 'px';
                    })
                }
            },
        },
        data() {
            return {
                tes: 1,
                bg_picture: '',
                show_popup: false,
                popup_trigger: null,
                board_id: null,
                board_title: '',
                board_platform_list: {
                    "Aplikasi Mobile": false,
                    "Bot Telegram": false,
                    "Web": false
                },
                board_bot_url: '',
                board_url: '',
                board_description: '',
                board_project_owner: '',
                board_sub_dept: '',
                all_members: [],
                member_multiselect: [],
                board_members: this.$store.state.members.board_members,
                guest_members: [],
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

                // DATA FOR SLIDE LIST
                drag_data: {},

                // DATA FOR ARCHIVE CARD
                archive_card: []
            }
        },
        components: {
            Card,
            draggable,
            CardItem,
            CardProfileMember,
            PopUp,
            Multiselect,
            UserMenu
        }
    }
</script>