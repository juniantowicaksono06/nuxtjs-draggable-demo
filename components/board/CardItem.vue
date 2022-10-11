<style scoped>
    #comment_list {
        max-height: 500px;
        overflow: auto;
    }
    .log-user {
        font-size: 14px;
        margin-bottom: 0;
    }
    .log-date {
        display: inline-block;
        font-size: 12px;
    }
    .log-user {
        font-weight: 500;
    }
    .log-text {
        font-size: 14px;
        white-space: pre-wrap;
    }
    .log-separator {
        border-left: 1px solid gray;
        margin-left: 16px;
        height: 100%;
    }
    .border-log-profile-pic-thumbs {
        border: 2px solid gray;
        border-radius: 50%;
    }
    #log_activity > .body {
        max-height: 500px;
        overflow-y: auto;
    }
    .profile-checklist-thumbs {
        width: 22px;
        font-size: 10pt;
        height: 22px;
    }
</style>
<template>
    <div class="card kanban-item mb-1 mt-1" v-on:click="showModalItem($event, item, kanban_name)">
        <div class="py-2 px-2">
            <span class="kanban-text">{{ item.name }}</span>
        </div>
        <div class="w-100" v-if="(item.members.length > 0 || item.checklists.length > 0 || item.deadline.date != null || item.comments.length > 0)">
            <div class="float-left px-2 mb-2">
                <div class="d-flex">
                    <span :class="(countChecklistChild.done && countChecklistChild.checklist_done != 0 ? 'badge badge-success kanban-text mr-2': 'kanban-text mr-2')" v-if="item.checklists.length > 0">
                        <i class="fas fa-list-check"></i>
                        <span class="pl-1 pr-1 kanban-text">{{ countChecklistChild.checklist_done }}/{{ countChecklistChild.total_checklist }}</span>
                    </span>
                    <span class="kanban-text mr-2" v-if="item.comments.length > 0">
                        <i class="fa fa-comment"></i>
                        <span class="px-1 kanban-text">{{ item.comments.length }}</span>
                    </span>
                    <span :class="(item.deadline.done ? 'badge badge-success kanban-text mr-2 deadline-badge' : isDeadline(item.deadline.date) ? 'badge badge-danger kanban-text mr-2 deadline-badge' : 'kanban-text mr-2 deadline-badge')" v-if="item.deadline.date != null">
                        <i class="fa fa-clock mr-1 kanban-text"></i>
                        <input type="checkbox" class="d-inline-block" :value="item.deadline.done" @click.stop="" v-on:click="toggleDeadline" v-if="!data.archive" :checked="item.deadline.done" />
                        <span>{{ convertDate(item.deadline.date) }}</span>
                    </span>
                </div>
            </div>
            <div class="float-right profile-pic-container justify-content-end">
                <div v-for="(member, member_index) in item.members" :key="member._id" class="px-1 py-1 position-relative  member" v-on:click="!data.archive ? openProfileCard($event, member, item) : ''" ref="card_info_ref" @click.stop="" v-b-tooltip.hover :title="member.name">
                    <div v-if="memberPicture[member._id]">
                        <img :src="memberPicture[member._id]" class="profile-pic-thumbs rounded-circle" />
                    </div>
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
                        <!-- CARD ITEM NAME -->
                        <div class="mb-1" style="width: 90%;">
                            <input class="ml-0 pl-0 pr-0 mr-0 input-transparent" v-model="item.name" v-on:blur="renameItem" v-on:focus="storeOldValue(item.name)" v-on:keyup.enter="$event.target.blur()" v-if="!data.archive" />
                            <span class="ml-0 pl-0 pr-0 mr-0 input-transparent" v-else>{{ item.name }}</span>
                            <h6 class="pr-0 no-select" v-if="!data.archive">in list <b>{{ kanban_name }}</b></h6>
                            <h4 class="pr-0 no-select text-center text-danger" v-else><span><i class="fa fa-archive mr-2 mt-3"></i></span> This card is archived</h4>
                            <div class="mt-2" v-if="data.archive" v-on:click="restoreArchive">
                                <div class="btn btn-primary"><i class="fa fa-trash-restore"></i> Restore</div>
                            </div>
                        </div>
                        <!-- CLOSE MODAL BUTTON -->
                        <div style="width: 10%; margin: 0 auto; text-align: right;">
                            <button class="btn btn-transparent" v-on:click="hideModalItem($event)">
                                <i class="fa fa-times"></i>
                            </button>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-12">
                            <div id="member_and_deadline_container">
                                <div :key="show_modal" v-if="item.members.length > 0">
                                    <h6 class="kanban-text" :key="show_modal">Members</h6>
                                    <div v-for="member in item.members" class="px-1 py-1 position-relative member hover-pointer d-inline-block" v-on:click="openProfileCard($event, member, item)" :key="member._id" ref="card_info_ref" @click.stop="" v-b-tooltip.hover :title="member.name">
                                        <div v-if="memberPicture[member._id]">
                                            <img :src="memberPicture[member._id]" class="profile-pic-thumbs rounded-circle" />
                                        </div>
                                        <div class="profile-pic-thumbs bg-primary text-white py-1 text-center rounded-circle" v-else>
                                            {{ generateProfileName(member.name) }}
                                        </div>
                                    </div>                               
                                    <div class="px-1 py-1 position-relative member hover-pointer d-inline-block" ref="card_info_ref" @click.stop="" v-b-tooltip.hover data-placement="top" title="Add member" style="margin: auto 0;" v-if="item.members.length > 0 && !data.archive" v-on:click="showCardPopUp($event, 'members')">
                                        <p class="px-0 py-1 profile-pic-thumbs rounded-circle" style="text-align: center; margin: auto 0;background-color: #E5E7EB;">
                                            <span><i class="fa fa-plus"></i></span>
                                        </p>
                                    </div>                               
                                </div>
                                <div v-if="item.deadline.date != null">
                                    <h6 class="kanban-text">Due date</h6>
                                    <div style="margin: auto;">
                                        <input type="checkbox" class="d-inline-block mt-2 mr-1" :value="item.deadline.done" v-on:click="toggleDeadline" :disabled="!data.archive ? false : true" :checked="item.deadline.done" />
                                        <div :class="(item.deadline.done ? 'd-inline-block btn bg-success text-white' : isDeadline(item.deadline.date) ? 'd-inline-block btn bg-danger text-white' : 'd-inline-block btn bg-gray')" v-on:click="showCardPopUp($event, 'dates')" @click.stop="" v-if="!data.archive">
                                            <h6 class="kanban-text mb-0">{{ convertDate(item.deadline.date, true) }}</h6>
                                        </div>
                                        <div :class="(item.deadline.done ? 'd-inline-block btn bg-success text-white' : isDeadline(item.deadline.date) ? 'd-inline-block btn bg-danger text-white' : 'd-inline-block btn bg-gray')" @click.stop="" v-else>
                                            <h6 class="kanban-text mb-0">{{ convertDate(item.deadline.date, true) }}</h6>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="row ml-0 pl-0 pr-0" id="modal_content">
                        <div :class="data.archive ? 'col-12 col-sm-12 col-md-12 col-lg-12 pl-0 mt-2' : 'col-12 col-sm-12 col-md-12 col-lg-9 pl-0 mt-2'">
                            <h5 class="ml-0 pl-0 pr-0 no-select font-weight-bold">Description</h5>
                            <textarea class="form-control" placeholder="Add description" v-model="item.description" style="resize: none;" v-on:focus="showEditButton('description')" rows="5" v-if="!data.archive"></textarea>
                            <textarea class="form-control" placeholder="Add description" v-model="item.description" style="resize: none;" rows="5" disabled="true" v-else></textarea>
                            <div :class="(show_edit_button['description'] ? 'form-group d-block mt-2' : 'form-group d-none mt-2')" v-if="!data.archive">
                                <button class="btn btn-primary" v-on:click="changeDescription">Save Description</button>
                                <button class="btn btn-default" v-on:click="hideEditButton('description')"><i class="fa fa-times"></i></button>
                            </div>
                            <!-- CHECKLISTS -->
                            <div class="mt-2 mb-2" v-for="(checklist, checklist_index) in item.checklists" :key="checklist._id" v-if="item.checklists.length > 0">
                                <div class="d-flex mb-2">
                                    <input class="ml-0 pl-0 pr-0 mr-0 input-transparent" v-model="checklist.name" v-on:blur="renameChecklist(checklist, checklist._id)" v-on:focus="storeOldValue(checklist.name)" v-on:keyup.enter="$event.target.blur()" v-if="!data.archive" />
                                    <span class="ml-0 pl-0 pr-0 mr-0 input-transparent" v-else>{{ item.name }}</span>
                                    <span class="btn btn-transparent" v-on:click="showCardPopUp($event, 'confirmation', {
                                        btn_confirm_block: true,
                                        btn_confirm_yes: 'danger',
                                        confirm_text: checklist.childs.length > 0 ? 'Are you sure you want to delete this checklist and it\'s child?' : 'Are you sure you want to delete this checklist?',
                                        action_confirm_yes: deleteChecklist,
                                        action_confirm_no: closeCardPopUp,
                                        data: [
                                            checklist_index, item.checklists
                                        ]
                                    })"  @click.stop='' v-if="!data.archive">
                                        <i class="fa fa-trash"></i>
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
                                        <input type="checkbox" class="form-control mr-0" :checked="child.done" style="width: 14px; height: 14px;" :value="child.done" v-on:change="checklistChildHandle(child, checklist._id)" v-if="!data.archive" />
                                        <input type="checkbox" class="form-control mr-0" :checked="child.done" style="width: 14px; height: 14px;" v-model="child.done" v-else disabled="true" />
                                    </div>
                                    <div class="col-10 mt-0 px-0 d-flex justify-content-between">
                                        <div style="flex: 5">
                                            <input class="ml-0 pl-0 pt-0 pr-0 mr-0 kanban-text input-transparent" :style="child.done ? {
                                                fontSize: '14px',
                                                fontWeight: 'normal',
                                                textDecoration: 'line-through'
                                            } : {
                                                fontSize: '14px',
                                                fontWeight: 'normal'
                                            }" v-on:keyup.enter="$event.target.blur()" :readonly="(child.done)" v-model="child.name" v-on:focus="storeOldValue(child.name)"  v-on:change="checklistChildHandle(child, checklist._id, 'name')" v-if="!data.archive" />
                                            <span class="ml-0 pl-0 pt-0 pr-0 mr-0 kanban-text input-transparent"  :style="child.done ? {
                                                fontSize: '14px',
                                                fontWeight: 'normal',
                                                textDecoration: 'line-through'
                                            } : {
                                                fontSize: '14px',
                                                fontWeight: 'normal'
                                            }" v-else>{{ child.name }}</span>
                                        </div>
                                        <div v-if="child.member_id" class="px-1 py-1 position-relative member hover-pointer d-inline-block" v-b-tooltip.hover :title="child.member_id.name" @click.stop="" v-on:click="showCardPopUp($event, 'card_members', {}, { checklistChildIndex: child_index, checklistChildId: child._id, checklistIndex: checklist_index, checklistId: item.checklists[checklist_index]._id })">
                                            <div v-if="memberPicture[child.member_id._id]">
                                                <img :src="memberPicture[child.member_id._id]" class="profile-checklist-thumbs rounded-circle" />
                                            </div>
                                            <div class="profile-checklist-thumbs bg-primary text-white text-center rounded-circle" v-else>
                                                {{ generateProfileName(child.member_id.name) }}
                                            </div>
                                        </div>
                                        <div v-if="!child.member_id" class="px-1 py-1 position-relative member hover-pointer d-inline-block" ref="card_info_ref" @click.stop="" v-b-tooltip.hover data-placement="top" title="Add member" style="margin: auto 0;" v-on:click="showCardPopUp($event, 'card_members', {}, { checklistChildIndex: child_index, checklistChildId: child._id, checklistIndex: checklist_index, checklistId: item.checklists[checklist_index]._id })">
                                            <p class="profile-checklist-thumbs rounded-circle" style="text-align: center; margin: auto 0;background-color: #E5E7EB;">
                                                <span><i class="fa fa-plus"></i></span>
                                            </p>
                                        </div>  
                                    </div>
                                    <div class="float-right" v-if="!data.archive">
                                        <span class="kanban-text btn btn-transparent" v-on:click="showCardPopUp($event, 'confirmation', {
                                            btn_confirm_block: true,
                                            btn_confirm_yes: 'danger',
                                            confirm_text: 'Are you sure you want to delete this checklist?',
                                            action_confirm_yes: deleteChecklistChild,
                                            action_confirm_no: closeCardPopUp,
                                            data: [
                                                child_index, checklist.childs, checklist._id
                                            ]
                                        })" @click.stop="">
                                                <i class="fa fa-trash"></i>
                                        </span>
                                    </div>
                                </div>
                                <div :class="(add_checklist_child.index == checklist_index && add_checklist_child.enable ? 'd-block' : 'd-none')" v-if="!data.archive">
                                    <input v-on:keyup.enter="addChecklistChild" class="form-control kanban-text" placeholder="Add an item" v-model="add_checklist_child.item_name" />
                                    <button class="btn btn-primary mt-2 kanban-text" v-on:click="addChecklistChild">Add</button>
                                    <button class="btn btn-transparent mt-2 kanban-text" v-on:click="disableAddChecklistChild()">
                                    <i class="fa fa-times"></i></button>
                                </div>
                                <div :class="(add_checklist_child.index == checklist_index && add_checklist_child.enable ? 'd-none' : 'd-block')" v-if="!data.archive">
                                    <button class="btn btn-light mt-2 kanban-text" v-on:click="enableAddChecklistChild(checklist_index, checklist._id)">Add an item</button>
                                </div>
                            </div>
                        </div>
                        <!-- ADD TO CARD SECTION -->
                        <div class="col-12 col-sm-12 col-md-12 col-lg-3 pl-0" v-if="!data.archive">
                            <p class="mb-1 text-bold kanban-text">Add to card</p>
                            <div class="modal-list-option" v-on:click="showCardPopUp($event, 'members')" ref="members_item_ref" @click.stop=''>
                                <i class="fa fa-user"></i>
                                <span class="kanban-text ml-2">Member</span>
                            </div>
                            <div class="modal-list-option" v-on:click="showCardPopUp($event, 'checklist')" ref="checklist_item_ref" @click.stop=''>
                                <i class="fa fa-check"></i>
                                <span class="kanban-text ml-2">Checklist</span>
                            </div>
                            <div class="modal-list-option" v-on:click="showCardPopUp($event, 'dates')" ref="dates_item_ref" @click.stop=''>
                                <i class="fa fa-clock"></i>
                                <span class="kanban-text ml-2">Dates</span>
                            </div>
                            <div class="mt-5">
                                <div class="modal-list-option" v-on:click="showCardPopUp($event, 'confirmation', {
                                    btn_confirm_block: true,
                                    btn_confirm_yes: 'danger',
                                    confirm_text: 'Are you sure you want to archive this card?',
                                    action_confirm_yes: archiveItem,
                                    action_confirm_no: closeCardPopUp
                                })" ref="archive_item_ref" @click.stop="">
                                    <i class="fa fa-archive"></i>
                                    <span class="kanban-text ml-2">Archive</span>
                                </div>
                            </div>
                        </div>
                        <div class="col-12 col-sm-12 col-md-12 col-lg-9 pl-0 mt-2">
                            <b-card no-body>
                                <b-tabs card content>
                                    <!-- COMMENTS -->
                                    <b-tab title="Comments" id="comments" class="py-3 px-3">
                                        <div class="form-group">
                                            <h5 class="ml-0 pl-0 pr-0 no-select font-weight-bold">Comments</h5>
                                        </div>
                                        <div class="row mt-3 mb-3" id="comment_list" ref="comment_list_ref" v-if="item.comments" :key="load_comment">
                                            <div class="col-12">
                                                <div v-for="(comment, comment_index) in item.comments" :key="comment._id">
                                                    <Comment :data="{...comment, initialName: generateProfileName(comment.by), index: comment_index}" @editComment="editComment" />
                                                </div>
                                            </div>
                                        </div>
                                        <div class="form-group pl-0 ml-0">
                                            <textarea id="comment_text" class="form-control w-100" rows="5" style="resize:none" placeholder="Add a comment" v-on:focus="showEditButton('comments')" v-model="comment" v-if="!data.archive"></textarea>
                                            <textarea id="comment_text" class="form-control w-100" rows="5" style="resize:none" placeholder="Add a comment" v-model="comment" disabled="true" v-else></textarea>
                                        </div>
                                        <div :class="(show_edit_button['comments'] ? 'form-group d-block mt-2' : 'form-group d-none mt-2')">
                                            <button class="btn btn-primary" v-on:click="sendComment">
                                                Send
                                            </button>
                                            <button class="btn btn-default" v-on:click="hideEditButton('comments')">
                                                <span><i class="fa fa-times"></i></span>
                                            </button>
                                        </div>
                                    </b-tab>
                                    <!-- LOG ACTIVITY -->
                                    <b-tab title="Log Activity" id="log_activity" class="pt-3 pb-1 px-3" v-if="log_activity.length > 0">
                                        <h5 class="ml-0 pl-0 pr-0 no-select font-weight-bold">Log Activity</h5>
                                        <div class="form-group body pr-3 pb-2">
                                            <div v-for="(log, log_index) in log_activity" :key="log._id">
                                                <div>
                                                    <div class="row mt-2">
                                                        <div class="col-2 col-sm-2 col-lg-1">
                                                            <div v-if="log.member_id">
                                                                <div class="profile-pic-thumbs text-white text-center no-zoom" v-if="memberPicture[log.member_id._id]">
                                                                    <img :src="memberPicture[log.member_id._id]" class="profile-pic-thumbs rounded-circle no-zoom" />
                                                                </div>
                                                                <div class="profile-pic-thumbs border-log-profile-pic-thumbs bg-primary text-white py-1 text-center rounded-circle no-zoom" v-else>
                                                                    {{ generateProfileName(log.user) }}
                                                                </div>
                                                            </div>
                                                            <div class="profile-pic-thumbs border-log-profile-pic-thumbs bg-primary text-white py-1 text-center rounded-circle no-zoom" v-else>
                                                                {{ generateProfileName(log.user) }}
                                                            </div>
                                                            <div class="log-separator" v-if="log_index != log_activity.length - 1">
                                                            </div>
                                                        </div>
                                                        <div class="col-10 col-sm-10 col-lg-11">
                                                            <div>
                                                                <p class="log-user">{{ log.user }}</p>
                                                            </div>
                                                            <div>
                                                                <p class="log-date mb-0">{{ convertLogDate(log.createdAt) }}</p>
                                                            </div>
                                                            <div>
                                                                <div class="card">
                                                                    <div class="card-body py-2 px-2">
                                                                        <p class="log-text mb-0">{{ log.remark }}</p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </b-tab>
                                </b-tabs>
                            </b-card>
                        </div>
                    </div>
                    <div id="card_pop_up" ref="card_pop_up_ref" :class="(show_popup ? 'd-block' : 'd-none')" @click.stop="" v-if="!data.archive">
                        <CardPopup :data="{
                            card_type: card_type,
                            data_item: item,
                            target: target,  
                        }"
                        :option="option"
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
    import Comment from '../global/Comment.vue'
    import * as moment from 'moment'
    import Swal from 'sweetalert2'
    export default {
        data() {
            return {
                edit_date: false,
                profile_key: 0,
                item: this.data.item,
                show_modal: false,
                kanban_name: this.data.card_name,
                option: {},
                show_edit_button: {
                    comments: false,
                    description: false
                },
                comment: '',
                // LOG ACTIVITY
                log_activity: [],
                // To Show Pop Up
                show_popup: false,
                // To Show Profile
                show_profile: false,
                // show_edit_description: false,
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
                target_element_profile: {},
                old_value: '',
                load_comment: false,
                target: {
                    checklistId: null,
                    checklistIndex: null,
                    checklistChildId: null,
                    checklistChildIndex: null,
                }
            }
        },
        mounted() {
            this.$nextTick(() => {
                window.addEventListener('resize', () => {
                    this.setPopupOffset()
                })
            })
            this.initOption()
            document.addEventListener('click', this.onClickOutside)
            this.webSocketEvent()
        },
        beforeDestroy() {
            document.removeEventListener('click', this.onClickOutside)
        },
        computed: {
            wsInstance: function() {
                return this.$getWsInstance()
            },
            memberPicture() {
                return this.$store.state.members.board_members_picture
            },
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
        watch: {
            'item': {
                handler: function(value) {
                    if(this.load_comment) {
                        this.loadLog()
                    }
                },
                deep: true
            },
            'item.checklists': {
                handler: function(checklist) {
                    if(checklist.length == 0 || this.item.deadline.date == '' || this.item.deadline.date == null) return
                    let checklist_child = []
                    for(let i = 0; i < checklist.length; i++) {
                        checklist_child.push(...checklist[i].childs)
                    }
                    if(checklist_child.length > 0) {
                        let child_done = checklist_child.filter((val) => {
                            if(val.done) {
                                return val.done
                            }
                        })
                        if(checklist_child.length == child_done.length && this.item.deadline.done === false && this.item.deadline.date) {
                            this.toggleDeadline()      
                            this.item.deadline.done = true
                        }
                        else if(checklist_child.length > child_done.length && this.item.deadline.done === true && this.item.deadline.date) {
                            this.toggleDeadline()      
                            this.item.deadline.done = false
                        }
                    }
                },
                deep: true
            }
        },
        methods: {
            webSocketEvent() {
                this.wsInstance.on('edit_item', (response) => {
                    let result = JSON.parse(response)
                    if(result.item_id != this.item._id) return
                    Object.keys(result.data).forEach((value) => {
                        if(result.checklist_id && !result.checklist_child_id) {
                            this.item.checklists.some((checklist, checklist_index) => {
                                if(checklist._id == result.checklist_id) {
                                    Object.keys(result.data).forEach((res) => {
                                        checklist[res] = result.data[res]
                                    })
                                    return
                                }
                            })
                        }
                        else if(result.checklist_child_id) {
                            this.item.checklists.some((checklist, checklist_index) => {
                                if(checklist._id == result.checklist_id) {
                                    checklist.childs.some((child, child_index) => {
                                        if(child._id == result.checklist_child_id) {
                                            Object.keys(result.data).some((res) => {
                                                child[res] = result.data[res]
                                            })
                                            return
                                        }
                                    })
                                    return
                                }
                            })
                        }
                        else {
                            this.item[value] = result.data[value]
                        }
                    })
                })
                this.wsInstance.on('add_comment', (response) => {
                    let result = JSON.parse(response)
                    if(result.item_id != this.item._id) return
                    this.item['comments'] = result.data['comments']
                })
            },
            initModal() {
                if(this.data.archive === true) return
                this.$axios.$get(`/api/card/${this.item._id}`)
                .then((response) => {
                    let {status} = response
                    if(status == 'OK') {
                        let {data} = response
                        if(data) {
                            this.item.comments = [...data.comments]
                        }
                        this.load_comment = true
                    }
                })
                .catch(error => alert("Error: Telah terjadi kesalahan"))
            },
            loadLog() {
                this.$axios.$get(`/api/log/${this.item._id}`)
                .then((response) => {
                    let { status } = response
                    if(status == 'OK') {
                        let { data } = response
                        if(data) {
                            this.log_activity = data
                        }
                    }
                })
            },
            restoreArchive() {
                this.hideModalItem()
                this.$emit('restoreArchive', this.item)
            },
            editComment(index, value) {
                this.item.comments[index].text = value            
            },
            replyComment(text) {
                let profile = this.$store.state.auth.identity.name
                
                this.hideEditButton('comments')
                let currentTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone; 
                let date = new Date().toLocaleString('en-US', {
                    timeZone: currentTimezone
                })
                if(this.item.comments) {
                    this.item.comments.push({
                        name: profile,
                        date: date,
                        user_domain: this.$store.state.auth.identity.user_domain,
                        profile_pic: '',
                        text: text
                    })
                }
                this.comment = ''
            },
            convertLogDate(log_date) {
                let currentTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone; 
                let date = new Date(log_date).toLocaleString('en-US', {
                    timeZone: currentTimezone
                })
                return `${moment(date).format('D MMMM YYYY H:mm:ss')}`
            },
            sendComment() {
                let profile = this.$store.state.auth.identity.name
                
                this.hideEditButton('comments')
                let currentTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone; 
                let date = new Date().toLocaleString('en-US', {
                    timeZone: currentTimezone
                })
                if(this.item.comments) {
                    this.item.comments.push({
                        by: profile,
                        text: this.comment,
                        date: new Date(),
                        member_id: {
                            _id: this.$store.state.auth.identity._id,
                            name: this.$store.state.auth.identity.name
                        }
                    })
                }
                else {
                    this.item.comments = [{
                        by: profile,
                        text: this.comment,
                        date: new Date(),
                        member_id: {
                            picture: this.$store.state.auth.identity.picture
                        }
                    }]
                }
                let config = {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }
                this.$wsEmit({
                    item_id: this.item._id,
                    data: {
                        comments: this.item.comments
                    }
                }, 'add_comment')
                this.$wsEmit({}, 'mom_update')
                setTimeout(() => {
                    this.$refs.comment_list_ref.scrollTo(0, this.$refs.comment_list_ref.scrollHeight)
                }, 100)
                this.$axios.$post(`/api/card/comment`, new URLSearchParams({
                    id: this.item._id,
                    text: this.comment
                }), config)
                .then((response) => {
                    if(response.status == 'OK') {
                    }
                }) 
                .catch((error) => {
                    alert('Error: Telah terjadi kesalahan')
                })
                this.comment = ''
            },
            archiveItem() {
                this.closeCardPopUp()
                this.hideModalItem()
                this.$emit('archiveItem', this.data.index_item, this.item._id)
            },
            initOption() {
                this.option = {
                    btn_confirm_block: true,
                    btn_confirm_yes: 'danger',
                    confirm_text: '',
                    action_confirm_yes: null,
                    action_confirm_no: null
                }
                // if(this.data.archive) {
                //     let members = Object.assign([], this.$store.state.members.board_members)
                //     members = members.filter((value) => {
                //         if(this.item.members.includes(value._id)) {
                //             return value
                //         }
                //         else {
                //             let exist = false
                //             this.item.members.some((member) => {
                //                 if(member._id == value._id) {
                //                     exist = true
                //                     return true
                //                 }
                //             })
                //             if(exist) return value
                //         }
                //     })
                //     this.item.members = members
                // }
            },
            storeOldValue(name) {
                this.old_value = name
            },
            showEditButton(target) {
                this.show_edit_button[`${target}`] = true
            },
            hideEditButton(target) {
                this.show_edit_button[`${target}`] = false
            },
            changeDescription() {
                let config = {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }
                let description = this.item.description.trim()
                this.$axios.$put(`/api/card`, new URLSearchParams({
                    id: this.item._id,
                    description: description
                }), config)
                .then((response) => {
                    if(response.status == 'OK') {
                        // Do Something
                        this.hideEditButton('description')
                        this.$wsEmit({
                            item_id: this.item._id,
                            data: {
                                description: description
                            }
                        }, 'edit_item')
                    }
                })
                .catch((error) => {
                    alert("Error: Telah terjadi kesalahan")
                })
            },
            renameChecklist(checklist, checklist_id) {
                let config = {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }
                if(checklist.name.trim() == '' || this.old_value.trim() == checklist.name.trim()) {
                    checklist.name = this.old_value
                    this.old_value = ''
                    return 
                }
                this.old_value = ''
                this.$axios.$put(`/api/card/checklist`, new URLSearchParams({
                    card_id: this.item._id,
                    id: checklist_id,
                    name: checklist.name,
                }), config)
                .then((response) => {
                    if(response.status == 'OK') {
                        Swal.fire({
                            text: 'Checklist has been rename',
                            toast: true,
                            timer: 3000,
                            position: 'bottom-right',
                            showConfirmButton: false,
                            showCancelButton: false,
                            icon: 'success',
                            title: 'Success'
                        })
                    }
                    this.$wsEmit({
                        item_id: this.item._id,
                        checklist_id: checklist_id,
                        data: {
                            name: checklist.name
                        },
                    }, 'edit_item')
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
            toggleDeadline() {
                let config = {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
                let done = !this.item.deadline.done
                this.$axios.$put(`/api/card`, {
                    id: this.item._id,
                    deadline: {
                        date: this.item.deadline.date,
                        done: done
                    }
                }, config)
                .then((response) => {
                    if(response.status == 'OK') {
                        // Do Something
                        this.edit_date = true
                        this.item.deadline.done = done
                        this.$wsEmit({
                            item_id: this.item._id,
                            data: {
                                deadline: {
                                    date: this.item.deadline.date,
                                    done: done
                                }
                            }
                        }, 'edit_item')
                        let task_overdue = 0
                        let task_done = 0
                        let deadline = moment(this.item.deadline.date).format('YYYY-MM-D')
                        deadline += " 23:59:59"
                        let overdue = moment().isAfter(deadline)
                        if(overdue && !this.item.deadline.done) {
                            task_overdue++
                            task_done--
                        }
                        else if(this.item.deadline.done) {
                            task_done++
                        }
                        else if(!this.item.deadline.done) {
                            task_done--
                        }
                        this.$wsEmit({
                            board_id: this.$route.query.board_id,
                            data: 'refresh'
                        }, 'workspace')
                    }
                })
                .catch((error) => {
                    alert("Error: Telah terjadi kesalahan")
                })
            },
            renameItem() {
                if(this.item.name.trim() == '' || this.item.name.trim() == this.old_value.trim()) {
                    this.old_value = ''
                    return
                }
                this.old_value = ''
                let config = {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }
                this.$axios.$put(`/api/card`, new URLSearchParams({
                    id: this.item._id,
                    name: this.item.name
                }), config)
                .then((response) => {
                    if(response.status == 'OK') {
                        Swal.fire({
                            text: 'Card item has been renamed',
                            toast: true,
                            timer: 3000,
                            position: 'bottom-right',
                            showConfirmButton: false,
                            showCancelButton: false,
                            icon: 'success',
                            title: 'Success'
                        })
                        let ws_data = {
                            item_id: this.item._id,
                            data: {
                                name: this.item.name
                            }
                        }
                        this.$wsEmit(ws_data, 'edit_item')
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
            deleteChecklist(index, checklist) {
                let config = {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data: {
                        card_id: this.item._id,
                        id: checklist[index]._id
                    }
                }
                this.closeCardPopUp()
                this.$axios.$delete(`/api/card/checklist`, config)
                .then((response) => {
                    if(response.status == 'OK') {
                        checklist.splice(index, 1)
                        Swal.fire({
                            text: 'Checklist group has been deleted',
                            toast: true,
                            timer: 3000,
                            position: 'bottom-right',
                            showConfirmButton: false,
                            showCancelButton: false,
                            icon: 'success',
                            title: 'Success'
                        })
                        this.$wsEmit({
                            item_id: this.item._id,
                            data: {
                                checklists: checklist
                            },
                        }, 'edit_item')
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
            deleteChecklistChild(child_index, checklist, parent_id) {
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
                this.closeCardPopUp()
                this.$axios.$delete(`/api/card/checklist/child`, config)
                .then((response) => {
                    if(response.status == 'OK') {
                        checklist.splice(child_index, 1)
                        Swal.fire({
                            text: 'Checklist has been deleted',
                            toast: true,
                            timer: 3000,
                            position: 'bottom-right',
                            showConfirmButton: false,
                            showCancelButton: false,
                            icon: 'success',
                            title: 'Success'
                        })
                        this.$wsEmit({
                            item_id: this.item._id,
                            data: {
                                checklists: this.item.checklists
                            },
                        }, 'edit_item')
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
            showModalItem(event, data, card_name) {
                this.closePopUp()
                this.show_modal = true
                this.initModal()
            },
            hideModalItem(event) {
                this.show_modal = false
            },
            closePopUp() {
                this.closeProfileCard()
                this.closeCardPopUp()
            },
            closeCardPopUp() {
                this.show_popup = false
                this.card_type = ''
                this.initOption()
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
            showCardPopUp(event, type, option = {}, target = {}) {
                this.target = target;
                this.show_popup = !this.show_popup
                if(!this.show_popup) return
                this.option = option
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
            onClickOutside(event) {
                this.closePopUp()
            },
            isDeadline(date) {
                let d = new Date(date)
                let currentDate = new Date()
                d.setDate(d.getDate() + 1)
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
                    this.$axios.$post(`/api/card/checklist/child`, new URLSearchParams({
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
                            this.$nextTick(() => {
                                this.$wsEmit({
                                    item_id: this.item._id,
                                    data: {
                                        checklists: this.item.checklists
                                    },
                                }, 'edit_item')
                            })
                            this.add_checklist_child.item_name = ''
                            this.add_checklist_child.enable = false
                        }
                    }) 
                    .catch((error) => {
                    })
                }
            },
            checklistChildHandle(checklist_child, parent_id, type='status') {
                let config = {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }
                let data = {}
                let done = checklist_child.done
                if(type == 'status') {
                    done = !done
                    data = {
                        done: done,
                        checklist_id: parent_id,
                        id: checklist_child._id,
                        card_id: this.item._id
                    }
                }
                else if(type == 'name') {
                    if(checklist_child.name.trim() == '' || checklist_child.name.trim() == this.old_value) {
                        this.old_value = ''
                        return
                    }
                    data = {
                        name: checklist_child.name,
                        checklist_id: parent_id,
                        id: checklist_child._id,
                        card_id: this.item._id
                    }
                }
                this.old_value = ''
                this.$axios.$put(`/api/card/checklist/child`, new URLSearchParams(data), config)
                .then((response) => {
                    if(response.status == 'OK') {
                        checklist_child.done = done
                        this.$wsEmit({
                            item_id: this.item._id,
                            checklist_id: parent_id,
                            checklist_child_id: checklist_child._id,
                            data: {
                                ...checklist_child
                            },
                        }, 'edit_item')
                    }
                }) 
                .catch((error) => {
                    console.log(error)
                    alert('Error: Telah terjadi kesalahan')
                })
            }
        },
        components: {
            draggable,
            CardProfileMember,
            Comment,
            CardPopup
        },
        props: {
            data: {
                type: Object
            }
        }
    }
</script>