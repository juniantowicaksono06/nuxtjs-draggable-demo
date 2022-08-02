<style scoped>
    .comment-person, .comment-nik {
        font-size: 14px;
        margin-bottom: 0;
    }
    .comment-date {
        display: inline-block;
        margin-top: 2px;
        font-size: 12px;
        margin-left: 10px;
    }
    .comment-person {
        font-weight: 500;
    }
    .comment-text {
        font-size: 14px;
        white-space: pre-wrap;
    }
</style>
<template>
    <div class="row mb-3 mt-2">
        <div class="col-12" style="height: 48px;">
            <div class="">
                <div v-if="data.member_id">
                    <div class="profile-pic-thumbs text-white py-1 text-center float-left no-zoom" v-if="data.member_id.picture">
                        <img :src="data.member_id.picture" class="profile-pic-thumbs rounded-circle no-zoom" />
                    </div>
                    <div class="profile-pic-thumbs bg-primary text-white py-1 text-center rounded-circle float-left no-zoom" v-else>
                        {{ data.initialName }}
                    </div>
                </div>
                <div class="profile-pic-thumbs bg-primary text-white py-1 text-center rounded-circle float-left no-zoom" v-else>
                    {{ data.initialName }}
                </div>
                <div class="row">
                    <div class="col-6 col-sm-6 col-md-8">
                        <p class="comment-person">{{ data.by }}</p>
                        <!-- <p class="comment-nik">{{ data.user_domain }}</p> -->
                    </div>
                    <div class="col-6 col-sm-6 col-md-4 pr-0 text-right">
                        <p class="comment-date no-select text-right d-inline-block">{{ convertCommentDate }}</p>
                    </div>
                </div>
                <span class="no-select d-inline-block">
                    <br />
                </span>
            </div>
        </div>
        <div class="col-12">
            <!-- <div class="card" v-if="!edit || data.user_domain != $store.state.auth.identity.user_domain"> -->
            <div class="card">
                <div class="card-body px-2 py-2">
                    <div class="comment-text">{{ data.text }}</div>
                </div>
            </div>
            <!-- <div class="form-group" v-if="edit">
                <textarea class="form-control w-100" ref="edit_comment_ref" rows="5" style="resize:none" placeholder="Add a comment" v-model="comment"></textarea>
                <div class="mt-2">
                    <button class="btn btn-primary" v-on:click="editComment" v-if="data.user_domain == $store.state.auth.identity.user_domain">
                        Save
                    </button>
                    <button class="btn btn-primary" v-on:click="replyComment" v-else>
                        Reply
                    </button>
                    <button class="btn btn-default" v-on:click="toggleEdit">
                        <span><i class="fa fa-times"></i> Cancel</span>
                    </button>
                </div>
            </div> -->
            <!-- <div class="mt-1 d-flex">
                <button class="btn kanban-text py-0 my-0" v-if="!edit && $store.state.auth.identity.user_domain != data.user_domain" v-on:click="toggleEdit('reply')">
                    Reply
                </button>
                <button class="btn kanban-text py-0 my-0" v-on:click="toggleEdit" v-else-if="!edit && $store.state.auth.identity.user_domain == data.user_domain">
                    Edit
                </button>
            </div> -->
        </div>
    </div>
</template>
<script>
    import * as moment from 'moment'
    export default {
        
        mounted() {
        },
        computed: {
            convertCommentDate() {
                let currentTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone; 
                let date = new Date(this.data.date).toLocaleString('en-US', {
                    timeZone: currentTimezone
                })
                return `${moment(date).format('D MMMM YYYY H:mm:ss')}`
            }
        },
        data() {
            return {
                edit: false,
                comment: '',
            }
        },
        props: {
            data: {
                type: Object
            }
        },
        methods: {
            replyComment() {
                this.$emit('replyComment', this.comment)
                this.edit = false
            },
            editComment() {
                this.$emit('editComment', this.data.index, this.comment)
                this.edit = false
            },
            toggleEdit(type) {
                if(type == 'reply') {
                    this.comment = `@${this.data.user_domain} `
                }
                else {
                    this.comment = this.data.text
                }
                this.edit = !this.edit
                this.$nextTick(() => {
                    if(this.edit) {
                        this.$refs.edit_comment_ref.focus()
                    }
                })
            },
            prependZero(num) {
                if(num < 10) return `0${num}`
                return num
            }
        }
    }
</script>