<style scoped>
    textarea {
        resize: none;
    }
    input[type=text]:focus, textarea:focus {
        outline: none;
        box-shadow: none;
    }
    input[type=text] {
        font-size: 1.25rem;
        padding: 0 !important;
        margin: 0 !important;
        line-height: 0;
        border: none;
        outline: none;
        background-color: #F7F7F7;
    }
    textarea {
        font-size: 1rem;
        padding: 0 !important;
        margin: 0 !important;
        border: none;
        outline: none;
        max-height: 300px;
    }
    div.card-body h6 {
        font-weight: normal;
    }
    pre > h6 {
        max-height: 300px;
    }
    div.my-card:hover .btn-delete {
        cursor: pointer;
        display: block !important;
    }
</style>
<template>
    <div class="card">
        <b-modal title="Confirmation" v-model="show_modal" size="md" ok-variant="danger" ok-title="Delete" @ok="deleteIdeation">
            <h5 class="text-center">Are you sure you want to delete this ideation?</h5>
        </b-modal>
        <div :class="`card-header ${data._id}`" v-on:click="toggleInput($event, 'title')">
            <h5 class="mb-0" v-if="!input_active.title">{{ data.title }}</h5>
            <div class="w-100" v-else>
                <input type="text" class="form-control" v-model="data.title" :ref="`title_${data._id}`" v-on:blur="updateCard" v-on:keyup.enter="toggleInput($event)">
            </div>
        </div>
        <div :class="`card-body my-card ${data._id}`" v-on:click="toggleInput($event, 'description')">
            <pre v-if="!input_active.description"><h6 class="mb-0" :ref="`description_${data._id}`">{{ data.description }}</h6></pre>
            <div class="w-100 mb-4" v-else>
                <textarea class="form-control" v-model="description" :ref="`description_${data._id}`" v-on:keypress="setDescriptionHeight" v-on:keyup="setDescriptionHeight" v-on:focus="setDescriptionHeight"></textarea>
            </div>
            <div class="mt-2" v-if="input_active.description">
                <b-button variant="primary" v-on:click="updateCard($event)"><i class="fa fa-save"></i> Save</b-button>
                <b-button variant="danger" v-on:click="cancelDescription($event)"><i class="fa fa-times"></i> Cancel</b-button>
            </div>
            <div class="mt-2 d-flex justify-content-between" v-else>
                <div class="profile-pic-thumbs bg-primary text-white text-center py-1 rounded-circle btn-delete d-none" v-b-tooltip.hover :title="data.createdBy.name">
                    {{ generateProfileName(data.createdBy.name) }}
                </div>
                <b-button variant="danger" v-if="$store.state.auth.identity._id ===  data.createdBy._id" v-on:click="confirmDelete($event)" class="btn-delete d-none"><i class="fa fa-trash"></i> Delete</b-button>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        watch: {
            'data': {
                handler: function(value) {
                    this.setDescriptionHeight()
                },
                deep: true
            },
        },
        data() {
            return {
                input_active: {
                    title: false,
                    description: false
                },
                description: '',
                show_modal: false
            }
        },
        methods: {
            deleteIdeation(event) {
                event.preventDefault()
                this.$emit('deleteIdeation', this.data._id)
                this.show_modal = false
            },
            confirmDelete(event) {
                event.stopPropagation()
                this.show_modal = true
            },
            setDescriptionHeight() {
                let textArea = this.$refs[`description_${this.data._id}`]
                textArea.style.height = textArea.scrollHeight + 'px'
            },
            cancelDescription(event) {
                event.stopPropagation()
                this.input_active.description = false
                this.$nextTick(() => {
                    this.setDescriptionHeight()
                })
            },
            toggleInput(event, type = '') {
                event.stopPropagation()
                // this.description = ''
                Object.keys(this.input_active).forEach((key) => {
                    this.input_active[key] = false
                })
                if(type in this.input_active && type != '') {
                    // if(type == 'description') {
                    this.description = this.data.description
                    // }
                    this.input_active[type] = true
                    this.$nextTick(() => {
                        this.$refs[`${type}_${this.data._id}`].focus()
                    })
                }
            },
            updateCard(event) {
                event.stopPropagation()
                let config = {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
                let description = this.description
                this.$axios.$put(`/api/ideation/${this.data._id}`, {
                    title: this.data['title'],
                    description: this.description
                }, config)
                .then((response) => {
                    if(response.status == 'OK') {
                        this.data['description'] = description
                        this.input_active.description = false
                        this.$nextTick(() => {
                            this.setDescriptionHeight()
                        })
                        let ideation = {
                            title: this.data['title'],
                            description: this.description
                        }
                        this.$wsEmit({
                            card_id: this.data._id,
                            data: ideation
                        }, 'update_ideation')
                    }
                })
                .catch((error) => {
                    // this.$bvModal.hide('add_ideation')
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
            }
        },
        props: {
            data: {
                type: Object
            }
        },
        mounted() {
            document.addEventListener('click', this.toggleInput)
            this.setDescriptionHeight()
        }
    }
</script>