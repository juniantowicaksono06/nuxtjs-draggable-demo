<style>
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
                        <draggable v-model="ideation_data" tag="div" animation="250" class="pb-5 pt-3 row" id="ideation_data">
                            <div class="col-12 col-md-4 col-lg-3" v-for="idea in ideation_data">
                                <Card :data="idea" />
                            </div>
                        </draggable>
                    </div>
                </div>
            </div>
        </div>
        <b-modal id="add_ideation" title="Add Ideation" hide-footer>
            <div class="mb-2">
                <label for="title">Title</label>
                <input type="text" class="form-control" placeholder="Title" v-model="ideation_input.title">
                <span>{{ ideation_input_error['title'] }}</span>
            </div>
            <div class="mb-2">
                <label for="title">Description</label>
                <textarea class="form-control" placeholder="Description" v-model="ideation_input.description"></textarea>
                <span>{{ ideation_input_error['description'] }}</span>
            </div>
            <b-button variant="primary" v-on:click="saveIdeation"><i class="fa fa-save"></i> Save</b-button>
        </b-modal>
    </div>
</template>
<script>
    import draggable from "vuedraggable"
    import Card from './Card.vue'
    export default {
        data() {
            return {
                isLoading: false,
                ideation_data: [],
                ideation_input: {
                    title: '',
                    description: ''
                },
                ideation_input_error: {
                    title: '',
                    description: ''
                }
            }
        },
        components: {
            draggable,
            Card
        },
        methods: {
            openModal() {
                this.$bvModal.show('add_ideation')
            },
            saveIdeation() {
                let error = false
                Object.keys(this.ideation_input).forEach((key) => {
                    if(this.ideation_input[key] == '' || this.ideation_input[key] == null) {
                        this.ideation_input_error[key] = 'Input cannot be empty'
                        error = true
                    } 
                })
                if(this.ideation_data.length > 0 && !error) {
                    this.ideation_data.push(this.ideation_input)
                    this.ideation_input = {
                        title: '',
                        description: ''
                    }
                    this.$bvModal.hide('add_ideation')
                }
            }
        },
        mounted() {
            this.ideation_data = [
                {
                    title: 'Tes Ideation 1',
                    description: 'This is a Description',
                },
                {
                    title: 'Tes Ideation 2',
                    description: 'This is a Description',
                },
            ]
        }
    }
</script>