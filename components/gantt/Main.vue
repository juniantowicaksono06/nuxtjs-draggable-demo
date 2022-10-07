<style scoped>
    .card-background {
        border-radius: 10px;
        /* overflow: hidden; */
    }
    .rounded {
        border-radius: 5px !important;
    }
    .container-fluid .card {
        width: 100% !important;
        overflow: hidden !important;
    }
</style>
<style>
    .gtaskname div, .gres div {
        white-space: break-spaces !important;
        overflow: hidden !important;
    }
    .gtaskname > div {
        width: 100%;
        max-width: 100%;
    }
    .gcomp {
        max-width: 50px;
        min-width: 50px;
        width: 50px;
    }
    .gres > div {
        padding: 5px 5px;
    }
    .gchartcontainer {
        display:grid;
        grid-template-columns: 1.35fr 1fr auto;
    }
    #GanttChartDIVglisthead .gselector {
        max-width: 500px;
        width: auto;
    }
    .gtaskname ul {
        list-style-type: none;
    }
</style>
<template>
    <div class="container-fluid py-3 mb-4 h-100" style="overflow: auto;">
        <div v-if="isLoading">
            <Loading/>
        </div>
        <div data-app class="pb-3">
            <div class="card card-background">
                <div class="card-header">
                    <h5 class="mb-0">Gantt Chart</h5>
                </div>
                <div class="card-body">
                    <div class="row">
                        <div class="offset-9 form-group col-3">
                            <select class="form-control" v-model="workspace" @change="loadGantt(workspace)">
                                <option :value="work._id" v-for="work, index in myWorkspace" :key="index">{{ work.name }}</option>
                            </select>
                        </div>
                    </div>
                    <div style="" class="gantt" id="GanttChartDIV"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import * as JSGantt from 'jsgantt-improved';
import 'jsgantt-improved/dist/jsgantt.css';
import 'vue-select/dist/vue-select.css';
import Swal from 'sweetalert2'
import Loading from "../global/Loading.vue";

const axios = require('axios')

export default {
    data(){
        return {
            gantt: null,
            workspace: null,
            ref: {
                subdept: [],
                user: []
            },
            input: {},
            isLoading: false
        }
    },
    components: {
        Loading
    },
    computed: {
        identity(){
            return this.$store.state.auth.identity
        },
        kanbanURL: function() {
            return process.env.BACKEND_URL
        },
        myWorkspace: function(){
            return this.$store.state.auth.identity.workspace
        }
    },
    mounted(){
        this.workspace = this.myWorkspace[0]._id
        this.loadGantt(this.workspace);
    },
    created(){
      
    },
    methods: {
        capitalizeEachWord(value) {
            value = value.toLowerCase()
            let words = value.split(' ')
            words = words.map((value) => {
                return value[0].toUpperCase()  + value.substring(1)
            })
            return words.join(' ')
        },
        loadGantt(workspace_id){
            this.isLoading = true
            this.gantt = new JSGantt.GanttChart(document.getElementById('GanttChartDIV'), 'day');
            let _this2 = this;
            this.gantt.setOptions({
                vScrollTo: new Date(),
                vUseSort: 0,
                vAdditionalHeaders: { // Add data columns to your table
                    status: {
                        title: 'Status'
                    }
                },

                vColumnOrder: ['vShowRes', 'vShowComp', 'vShowDur', 'vShowStartDate', 'vShowEndDate', 'vShowPlanStartDate', 'vShowPlanEndDate', 'vShowCost', 'vAdditionalHeaders', 'vShowAddEntries'],
                vShowDur: 0,
                vShowStartDate: 0,
                vShowEndDate: 0,
            });
            // this.$preloaders.open();
            axios.get(this.kanbanURL + 'report/gantt?workspace_id=' + workspace_id, {
                headers: {
                   'Content-type': 'application/json'
                }
            }).then(res => {
                res.data.data.forEach(object => {
                    this.gantt.AddTaskItemObject(object)
                });
                this.gantt.Draw();
                this.isLoading = false
                this.$nextTick(() => {
                    this.refreshChart()
                    new MutationObserver(() => {
                        this.refreshChart()
                    }).observe(document.getElementById('GanttChartDIV'), {
                        childList: true
                    })
                })
            })
        },
        refreshChart() {
            let taskname = document.querySelectorAll('.gtasktable .gtaskname > div')
            taskname.forEach((element) => {
                let elementExists = element.querySelector('span')
                if(elementExists == null) {
                    let div = document.createElement('div')
                    let ul = document.createElement('ul')
                    let li = document.createElement('li')
                    ul.classList.add('px-2', 'ml-1', 'my-0')
                    ul.style.paddingTop = '3px'
                    ul.style.paddingBottom = '3px'
                    let content = element.innerHTML.replace(/&nbsp;/g, '')
                    li.innerHTML = content
                    ul.append(li)
                    div.append(ul)
                    element.innerHTML = div.innerHTML
                    let task_parent_element = element.parentElement.parentElement
                    let id = task_parent_element.getAttribute('id')
                    if(id != null) {
                        id = id.split('_')
                        id = id.length > 0 ? id[id.length - 1] : 0
                        let element_progress = document.getElementById(`GanttChartDIVchildrow_${id}`)
                        let member = document.querySelector(`#GanttChartDIVchild_${id} > .gres`)
                        let member_value = member.querySelector('div').innerHTML
                        member_value = member_value.split(',')
                        member_value = member_value.map((value) => {
                            let name = value.split(' ')
                            if(name.length > 1) {
                                return this.capitalizeEachWord(`${name[0]} ${name[1]}`)
                            }
                            return this.capitalizeEachWord(name[0])
                        }).join(', ')
                        member.querySelector('div').innerHTML = member_value
                        let element_height = task_parent_element.offsetHeight
                        if(element_progress != null) {
                            let member_height = member.offsetHeight
                            element_height = member_height > element_height ? member_height : element_height
                            element_progress.style.setProperty('height', `${element_height}px`, 'important')
                        }
                    }
                }
            })
        },
        requestFail(){
            Swal.fire({
                text: 'Oops...Something went wrong',
                toast: true,
                timer: 5000,
                position: 'bottom-right',
                showConfirmButton: false,
                showCancelButton: false,
                icon: 'error',
                title: 'Login Failed'
            })
        },
        requestSuccess(){
            Swal.fire({
                text: '',
                toast: true,
                timer: 3000,
                position: 'bottom-right',
                showConfirmButton: false,
                showCancelButton: false,
                icon: 'success',
                title: 'Success'
            })
        }
    }
}

</script>

<style scoped>
.modal {
    z-index: 10000;
}

.gantt {
    width: 100%;
}
</style>
