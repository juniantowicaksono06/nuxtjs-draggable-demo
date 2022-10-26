<template>
    <div class="container-fluid py-3 mb-4 h-100" style="overflow: auto;">
        <div data-app class="pb-3">
            <div class="card">
                <div class="card-header">
                    <h5 class="mb-0">Report</h5>
                </div>
                <div class="card-body">
                    <div class="row">
                        <div class="offset-3 col-3 my-auto">
                              <button type="button" @click="filterPeriod('Today')" :class="periode === 'Today' ? 'btn-primary' : 'btn-outline-primary'" class="btn">Today</button>
                              <button type="button" @click="filterPeriod('This Month')" :class="periode === 'This Month' ? 'btn-primary' : 'btn-outline-primary'" class="btn">This Month</button>
                              <button type="button" @click="filterPeriod('Range')" :class="periode === 'Range' ? 'btn-primary' : 'btn-outline-primary'" class="btn">Range</button>
                        </div>
                        <div class="col-3">
                            <label>Date</label><br>
                            <date-picker v-model="date" type="date" value-type="format" format="YYYY-MM-DD" placeholder="Select Date" style="width: 100%" range :disabled="periode !== 'Range'"></date-picker>
                        </div>
                        <div class="form-group col-3">
                            <label>Workspace</label>
                            <select class="form-control" v-model="workspace" >
                                <option :value="work._id" v-for="work, index in myWorkspace" :key="index">{{ work.name }}</option>
                            </select>
                        </div>
                    </div>
                    <div class="col-md-12">
                        <LineChart :data="chartData" :options="chartOptions" :height="500"/>
                    </div>
                    <!-- <div>
                      <button class="btn btn-success float-right">Download</button>
                    </div> -->
                    <div style="margin-top: 50px; overflow-x: auto;">
                      <table class="table table-bordered" style="white-space: nowrap;">
                          <thead class="bg-light">
                            <tr class="text-center">
                              <th rowspan="2">Name</th>
                              <th :colspan="Object.keys(arrDate).length">Date</th>
                            </tr>
                            <tr>
                              <th v-for="date, index in Object.keys(arrDate)" :key="index">{{ date }}</th>
                            </tr>
                          </thead>
                          <tbody>
                              <tr v-for="member, index in memberActivity" :key="index">
                                <td>{{ member.name }}</td>
                                <td v-for="date, index in Object.keys(member.project)" :key="index">{{ member.project[date].count }}</td>
                              </tr>
                          </tbody>
                      </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import 'vue2-datepicker/index.css';
import LineChart from "../global/LineChart.vue";
import moment from 'moment';

export default {
   components: { LineChart },
   data(){
      return {
        periode: null,
        date: [],
        arrDate: {},
        memberActivity: {},
        workspace: null,
        chartData: {
            labels: [],
            datasets: [],
        },
        chartOptions: {
            responsive: true,
            maintainAspectRatio: false,
                    tooltips: {
                        mode: 'index',
                        intersect: false,
                    },
                    hover: {
                        mode: 'nearest',
                        intersect: true
                    },
                    scales: {
                        xAxes: [{
                            display: true,
                            scaleLabel: {
                                display: true,
                                labelString: 'Date'
                            }
                        }],
                        yAxes: [{
                            display: true,
                            scaleLabel: {
                                display: true,
                                labelString: 'Count Activity'
                            }
                        }]
                    }
        }
    }
   },
   mounted(){
        this.workspace = this.myWorkspace[0]._id
        this.filterPeriod('This Month')
   },
   computed : {
        myWorkspace: function(){
            return this.$store.state.auth.identity.workspace
        }
   },
   methods: {
    getData(){
        this.$axios.get(`/api/report/member?workspace_id=${this.workspace}&start=${this.date[0]}&end=${this.date[1]}`)
            .then((response) => {
                
                let memberFix = response.data.data.map(member => {
                    let arrDate = this.getArrDate(moment(this.date[0]), moment(this.date[1]))
                    member.project.forEach(project => {
                        arrDate[project._id].count = project.count
                    });

                    this.chartData.datasets.push({
                        label: member.name,
                        data: Object.keys(arrDate).map(c => arrDate[c].count),
                        backgroundColor: "rgba(20, 255, 0, 0.3)",
                        borderColor: "rgba(100, 255, 0, 1)",
                        fill: false
                    })
                     
                    return {
                        member_id: member.member_id,
                        name: member.name,
                        project: arrDate
                    }
                })
                this.memberActivity = memberFix
            })
    },
    filterPeriod(period){
        this.periode = period
        if(period == 'Today'){
            // let today = moment()
            // this.date= [
            //     today.format('YYYY-MM-DD'), 
            //     today.format('YYYY-MM-DD')
            // ]
            
            // this.arrDate[today.format('YYYY-MM-DD')] = { count: 0, type: ( today.day() == 6 || today.day() == 0 ) ? 'weekend' : 'weekday' }
            // this.getData()

        }else if (period == 'This Month') {
            let start =  moment().startOf('M')
            let end = moment().endOf('M')
            this.date= [
                start.format('YYYY-MM-DD'), 
                end.format('YYYY-MM-DD')
            ]

            this.arrDate = this.getArrDate(start, end)
            this.chartData.labels = Object.keys(this.arrDate)
            this.getData()

        }else if(period == 'Range'){
            this.date = []
        }
    },
    getArrDate(start, end){
        let diff = end.diff(start, 'days')
        let arrDate = []
        for (let i = 0; i < diff; i++) {
            let date = start.clone().add(i, 'days')
            arrDate[date.format('YYYY-MM-DD')] = { count: 0, type: ( date.day() == 6 || date.day() == 0 ) ? 'weekend' : 'weekday'}
        }
        return arrDate
    }
   }
}
</script>