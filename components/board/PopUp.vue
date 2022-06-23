<style scoped>
    .pop-up {
        width: 310px;
        position: absolute;
        z-index: 9999999999999;
    }
    .popup-content {
        max-height: 500px;
    }
</style>
<template>
    <div :class="(show ? 'd-block pop-up' : 'd-none pop_up')" ref="pop_up_ref">
        <div class="card" @click.stop="">
            <div class="card-header">
                <h6 class="text-center">
                    <span>{{ title }}</span>
                    <span class="float-right hover-pointer" @click="$emit('close')">
                        <i class="fa fa-times"></i>
                    </span>
                </h6>
            </div>
            <div class="card-body px-1 py-1 popup-content">
                <slot name="component_render"></slot>
            </div>
        </div>
    </div>
</template>
<script>
import { get } from 'http'

    export default {
        data() {
            return {
            }
        },
        watch: {
            'show': function(value, value2) {
                if(value){
                    this.setPopupOffset()
                }
            }
        },
        mounted() {

        },
        props: {
            title: {
                type: String
            },
            show: {
                type: Boolean
            },
            popup_trigger: {
                type: Object
            }
        },
        methods: { 
            setPopupOffset() {
                setTimeout(() => {
                    let popup_wrapper = this.popup_trigger
                    let getClient = this.$refs.pop_up_ref.getBoundingClientRect()
                    // Calculate Offset Y
                    if((getClient.y + getClient.height) > window.innerHeight) {
                        this.$refs.pop_up_ref.style.top = (getClient.top - ((getClient.y + getClient.height) - window.innerHeight) - 20) + 'px'
                    }
                    else {
                        this.$refs.pop_up_ref.style.top = (popup_wrapper.y + popup_wrapper.height) + 'px'
                    }
                    // Calculate Offset X
                    if((getClient.x + getClient.width) > window.innerWidth) {
                        this.$refs.pop_up_ref.style.left = (getClient.left - ((getClient.x + getClient.width) - window.innerWidth) - 20) + 'px'
                    }
                    else {
                        console.log(popup_wrapper)
                        this.$refs.pop_up_ref.style.left = (popup_wrapper.x - 10) + 'px'
                    }
                })
            },
        },
    }
</script>