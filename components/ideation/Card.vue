<style scoped>
    textarea {
        resize: none;
    }
</style>
<template>
    <div class="card">
        <div class="card-header" v-on:click="toggleInput('title')">
            <h5 class="mb-0" v-if="!input_active.title">{{ data.title }}</h5>
            <div class="w-100" v-else>
                <input type="text" class="form-control" v-model="data.title" ref="title">
            </div>
        </div>
        <div class="card-body" v-on:click="toggleInput('description')">
            <h5 class="mb-0" v-if="!input_active.description">{{ data.description }}</h5>
            <div class="w-100" v-else>
                <textarea class="form-control" v-model="data.description" ref="description"></textarea>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                input_active: {
                    title: false,
                    description: false
                }
            }
        },
        methods: {
            toggleInput(type = '') {
                Object.keys(this.input_active).forEach((key) => {
                    this.input_active[key] = false
                })
                if(type in this.input_active) {
                    this.input_active[type] = true
                    this.$nextTick(() => {
                        this.$refs[type].focus()
                    })
                }
            }
        },
        props: {
            data: {
                type: Object
            }
        },
        mounted() {
            // document.addEventListener('click', this.toggleInput)
        }
    }
</script>