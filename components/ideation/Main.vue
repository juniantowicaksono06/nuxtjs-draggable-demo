<style scoped>
    .card-background {
        border-radius: 10px;
    }
    .rounded {
        border-radius: 5px !important;
    }
    .container-fluid .card {
        width: 100% !important;
        overflow: hidden !important;
    }
    textarea {
        resize: none;
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
                    <h5 class="mb-0">Ideation</h5>
                </div>
                <div class="card-body">
                    <div id="ideation">
                        <b-button variant="primary" v-on:click="openModal"><i class="fa fa-plus"></i> Add Ideation</b-button>
                        <div class="offset-9 form-group col-3">
                            <label>Select Workspace</label>
                            <select class="form-control" v-model="workspace" @change="loadIdeation">
                                <option :value="work._id" v-for="work, index in myWorkspace" :key="index">{{ work.name }}</option>
                            </select>
                        </div>
                        <!-- <draggable v-model="ideation_data" tag="div" animation="250" class="pb-5 pt-3 row" id="ideation_data" @end="endDrag"> -->
                            <div class="row pb-5 pt-3" v-if="ideation_data.length > 0">
                                <div class="col-12 col-md-4 col-lg-4 mb-3" v-for="(idea) in ideation_data" :key="idea._id">
                                    <Card :data="idea" @deleteIdeation="deleteIdeation" />
                                </div>
                            </div>
                            <div class="row pb-5 pt-3" v-else> 
                                <div class="col-12">
                                    <h1 class="text-center text-warning mb-3">
                                        <i class="fa fa-lightbulb fa-3x"></i>
                                    </h1>
                                    <h3 class="text-center">No Ideation Found!</h3>
                                </div>
                            </div>
                        <!-- </draggable> -->
                    </div>
                </div>
            </div>
        </div>
        <b-modal id="add_ideation" title="Add Ideation" hide-footer>
            <div class="mb-2">
                <label for="title">Title</label>
                <input type="text" class="form-control" placeholder="Title" v-model="ideation_input.title">
                <span class="text-danger">{{ ideation_input_error['title'] }}</span>
            </div>
            <div class="mb-2">
                <label>Workspace</label>
                <select class="form-control" v-model="ideation_input.workspace_id">
                    <option :value="work._id" v-for="work, index in myWorkspace" :key="index">{{ work.name }}</option>
                </select>
            </div>
            <div class="mb-2">
                <label for="title">Description</label>
                <textarea class="form-control" placeholder="Description" v-model="ideation_input.description"></textarea>
                <span class="text-danger">{{ ideation_input_error['description'] }}</span>
            </div>
            <b-button variant="primary" v-on:click="saveIdeation"><i class="fa fa-save"></i> Save</b-button>
        </b-modal>
    </div>
</template>
<script>
    import draggable from "vuedraggable"
    import Swal from 'sweetalert2'
    import Card from './Card.vue'
    export default {
        data() {
            return {
                isLoading: false,
                ideation_data: [],
                ideation_input: {
                    title: '',
                    description: '',
                    workspace_id: ''
                },
                ideation_input_error: {
                    title: '',
                    description: ''
                },
                workspace: null,
                drag_data: {}
            }
        },
        components: {
            draggable,
            Card
        },
        computed: {
            wsInstance: function() {
                return this.$getWsInstance()
            },
            myWorkspace: function(){
                return this.$store.state.auth.identity.workspace
            }
        },
        methods: {
            webSocketEvent() {
                this.wsInstance.on('create_ideation', (response) => {
                    let result = JSON.parse(response)
                    let data = result.data
                    this.ideation_data.splice(0, 0, data)
                })
                this.wsInstance.on('update_ideation', (response) => {
                    let result = JSON.parse(response)
                    let data = result.data
                    let card_id = result.card_id
                    this.ideation_data.forEach((ideation) => {
                        if(ideation._id == card_id) {
                            // this.ideation_data.splice(ideation_index, 1)
                            ideation['title'] = data['title']
                            ideation['description'] = data['description']
                            return
                        }
                    })
                })

                this.wsInstance.on('delete_ideation', (response) => {
                    let result = JSON.parse(response)
                    let data = result.data
                    this.ideation_data.forEach((ideation, ideation_index) => {
                        if(ideation._id == data._id) {
                            this.ideation_data.splice(ideation_index, 1)
                            return
                        }
                    })
                })
            },
            deleteIdeation(id) {
                let index = null
                this.ideation_data.forEach((ideation, ideation_index) => {
                    if(ideation._id == id) {
                        index = ideation_index
                        return
                    }
                })
                let config = {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                }
                this.$axios.$delete(`/api/ideation/${id}`, config)
                .then(response => {
                    if(index != null) {
                        this.ideation_data.splice(index, 1)
                        this.$wsEmit({
                            data: {
                                _id: id
                            }
                        }, 'delete_ideation')
                    }
                })
                .catch(error => {
                    console.log(error)
                })
            },
            // dragCard(id, index) {
            //     this.drag_data['id'] = id
            // },
            // endDrag() {
            //     this.drag_data['index'] = $event.newIndex.toString()
            //     let config = {
            //         headers: {
            //             'Content-Type': 'application/json'
            //         }
            //     }
            //     this.$axios.$put(`/api/ideation/slide`, this.drag_data, config)
            //     .then((response) => {
            //         if(response.status == 'OK') {
            //             this.drag_data = {}
            //         }
            //     })
            //     .catch((error) => {})
            // },
            openModal() {
                this.$bvModal.show('add_ideation')
            },
            loadIdeation() {
                this.isLoading = true
                this.$axios.$get(`/api/ideation?workspace_id=${this.workspace}`)
                .then((response) => {
                    if(response.status == 'OK') {
                        const { data } = response
                        this.ideation_data = data
                    }
                    this.isLoading = false
                })
                .catch((error) => {
                    this.isLoading = false
                })
            },
            saveIdeation() {
                let error = false
                Object.keys(this.ideation_input).forEach((key) => {
                    if(this.ideation_input[key] == '' || this.ideation_input[key] == null) {
                        this.ideation_input_error[key] = 'Input cannot be empty'
                        error = true
                    } 
                })
                if(!error) {
                    let config = {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }
                    this.$axios.$post(`/api/ideation`, {
                        title: this.ideation_input['title'],
                        description: this.ideation_input['description'],
                        workspace_id: this.ideation_input['workspace_id']
                    }, config)
                    .then((response) => {
                        if(response.status == 'OK') {
                            const {data} = response
                            let ideation = {
                                ...this.ideation_input,
                                _id: data._id
                            } 
                            this.ideation_data.splice(0, 0, ideation)
                            this.ideation_input = {
                                title: '',
                                description: ''
                            }
                            Swal.fire({
                                text: 'Ideation created',
                                toast: true,
                                timer: 3000,
                                position: 'bottom-right',
                                showConfirmButton: false,
                                showCancelButton: false,
                                icon: 'success',
                                title: 'Success'
                            })
                            this.$wsEmit({
                                data: ideation
                            }, 'create_ideation')
                        }
                        this.$bvModal.hide('add_ideation')
                    })
                    .catch((error) => {
                        this.$bvModal.hide('add_ideation')
                    })
                }
            }
        },
        mounted() {
            this.workspace = this.myWorkspace[0]._id
            this.webSocketEvent()
            this.loadIdeation()
        }
    }
</script>