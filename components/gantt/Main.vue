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
    },
    mounted(){
        this.loadGantt();
    },
    created(){
       
    },
    methods: {
        loadGantt(){
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
            axios.get(this.kanbanURL + 'report/gantt', {
                headers: {
                   'Content-type': 'application/json'
                }
            }).then(res => {
                res.data.data.forEach(object => {
                    this.gantt.AddTaskItemObject(object)
                });
                // this.$preloaders.close();
                this.gantt.Draw();
                this.isLoading = false
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
