<style @scoped>
    .card-background {
        border-radius: 10px;
        /* overflow: hidden; */
    }
    #comment_list {
        /* max-height: 80vh; */
        overflow-y: auto;
        overflow-x: hidden;
    }
    ol[type='a'] {
        padding-left: 15px;
    }
    ol {
        margin-bottom: 5px;
        margin-left: 0;
    }
    ul {
        margin-top: 2px;
        list-style-type: none;
        margin-bottom: 2px;
        margin-left: 0;
        padding-left: 0;
    }
    ul.dashed > li {
        margin-left: 5px;
    }
    ul.dashed > li:before {
        content: '-';
        text-indent: -22px;
        font-weight: bold;
        margin-left: -8px;
    }
    .list-pre {
        white-space: break-spaces;
    }
    pre {
        margin-bottom: 0;
        white-space: break-spaces;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", "Liberation Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
    }
</style>
<template>
    <div class="container-fluid py-3 h-100" style="overflow: auto;">
        <div class="row">
            <div class="col-12">
                <div class="card card-background">
                    <div class="card-header">
                            <h5 class="mb-0">Minutes of Meeting</h5>
                    </div>
                    <div class="card-body">
                        <div class="mt-3">
                            <div class="container">
                                <div class="row mb-2">
                                    <div class="col-12">
                                        <h5>Workspace</h5>
                                    </div>
                                    <div class="col-12 col-sm-12 col-md-12 col-lg-3 mb-3">
                                        <select class="form-control" v-model="workspace">
                                            <option :value="work._id" v-for="work, index in myWorkspace" :key="index">{{ work.name }}</option>
                                        </select>
                                    </div>
                                    <div class="col-12">
                                        <h5>Choose a Date</h5>
                                    </div>
                                    <div class="col-12 col-sm-12 col-md-12 col-lg-4">
                                        <div class="form-group">
                                            <label for="end_date">Start Date</label>
                                            <b-form-datepicker id="start_date" v-model="start_date" class="mb-2"></b-form-datepicker>
                                        </div>
                                    </div>
                                    <div class="col-12 col-sm-12 col-md-12 col-lg-6">
                                        <div class="form-group">
                                            <label for="end_date">End Date</label>
                                            <div class="row">
                                                <div class="col-12 col-sm-12 col-md-12 col-lg-8">
                                                    <b-form-datepicker  id="end_date" v-model="end_date" class="mb-2"></b-form-datepicker>
                                                </div>
                                                <div class="col-12 col-sm-12 col-md-12 col-lg-4">
                                                    <button class="btn btn-primary" v-on:click="searchMom"><i class="fa fa-search"></i> Search</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="container">
                                <div class="row">
                                    <div class="col-12">
                                        <div class="card">
                                            <div class="card-header">
                                                <h5 class="mb-0 text-center">Meeting Notes</h5>
                                            </div>
                                            <div class="card-body py-2 px-2">
                                                <div class="px-2 py-2" v-if="data_mom.length > 0">
                                                    <div v-html="mom_data.text"></div>
                                                </div>
                                                <div v-else>
                                                    <!-- <h3><i class="fa fa-warning"></i></h3> -->
                                                    <h3 class="text-center"><i class="text-secondary fa fa-exclamation-circle fa-3x"></i></h3>
                                                    <h3 class="text-center">NO NOTE FOUND</h3>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import Comment from '../global/Comment.vue'
    import * as moment from 'moment'
    export default {
        data() {
            return {
                start_date: moment(new Date().toLocaleString('en-US', {
                    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
                })).format('YYYY-M-D'),
                end_date: moment(new Date().toLocaleString('en-US', {
                    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
                })).format('YYYY-M-D'),
                data_mom: [],
                workspace: null
            }
        },
        mounted() {
            this.workspace = this.myWorkspace[0]._id
            this.searchMom()
            this.webSocketEvent()
        },
        computed: {
            mom_data: function() {
                let mom_data = {
                    text: '',
                }
                this.data_mom.forEach((mom, index) => {
                    mom_data.text += `<h5><strong>${mom.name}</strong></h5>`; 
                    mom.lists.forEach((list, list_index) => {
                        let card_text = ``;
                        let card_index = 0
                        list.cards.forEach((card) => {
                            let badge_colour = ''
                            let deadline = moment(card.deadline.date).format('YYYY-MM-D')
                            deadline += " 23:59:59"
                            let overdue = moment().isAfter(deadline)
                            if(overdue && !card.deadline.done) {
                                badge_colour = "badge-danger"
                            }
                            else {
                                switch(list.name.toLowerCase().trim()) {
                                    case "backlog":
                                        badge_colour = "bg-orange-colour"
                                        break
                                    case "doing":
                                        badge_colour = "badge-success"
                                        break
                                    case "testing":
                                        badge_colour = "bg-purple"
                                        break
                                    case "done":
                                        badge_colour = "badge-primary"   
                                        break
                                    default:
                                        badge_colour = "badge-success"
                                        break;
                                }
                            }
                            card_text += `
                                <div class="mb-0 ml-2">
                                    <h6 class="mb-0 font-weight-bold">${list_index += 1}. ${card.name}
                                        <span class="badge px-2 py-1 ${badge_colour}">${list.name}</span>
                                    </h6>
                                </div>`
                            let comment_text = ''
                            card.comments.forEach((comment) => {
                                comment_text += `<div class="ml-2">
                                    <div class="ml-4 mb-1">
                                        <ul class="dashed list-pre"><li>${comment.text}</li></ul>
                                    </div>
                                </div>`
                            })
                            card_text += comment_text
                            card_index++;
                        })
                        mom_data.text += card_text
                    })
                })
                return mom_data
            },
            wsInstance: function() {
                return this.$getWsInstance()
            },
            myWorkspace: function(){
                return this.$store.state.auth.identity.workspace
            }
        },
        methods: {
            webSocketEvent() {
                this.wsInstance.on('mom_update', (response) => {
                    if(response == 'update') {
                        this.searchMom()
                    }
                })
            },
            convertDate(date) {
                let currentTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone; 
                let date_1 = new Date(date).toLocaleString('en-US', {
                    timeZone: currentTimezone
                })
                return `${moment(date_1).format('D MMMM YYYY')}`
            },
            searchMom() {
                this.$axios.$get(`/api/mom?start=${this.start_date}&end=${this.end_date}&workspace_id=${this.workspace}`)
                .then((response) => {
                    if(response.status != 'OK') return
                    const { data } = response
                    this.data_mom = data
                })
                .catch((error) => {
                    alert(error)
                })
            },
            editComment() {
                // DO SOMETHING
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
        },
        components: {
            Comment
        }
    }
</script>