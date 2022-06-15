<template>
    <div class="kanban-card card">
        <div class="card-header kanban-header">
            <p class="kanban-header-input mb-0" style="display: block;" ref="card_name_ref" v-on:click="enableEditKanbanName($event)">{{ kanban.name }}</p> 
            <input class="kanban-header-input" ref="card_name_edit" style="display:none;" v-model="kanban.name" v-on:blur="disableEditKanbanName($event)" />
        </div>
        <div class="card-body kanban-body py-1 px-2">
            <draggable group="task" ghostClass="kanban-ghost-class" dragClass="kanban-drag-class" animation=250>
                <div v-for="(a, index_item) in kanban.cards" :key="index_item" draggable=".kanban-item">
                    <CardItem :data="{
                        item: a,
                        card_name: kanban.name
                    }" />
                </div>
            </draggable>
            <div class="add-item kanban-item kanban-text w-100 px-2 py-2" v-on:click="showAddItemInput($event, kanban._id)" :class="((!add_item_enabled) || (add_item_enabled && kanban._id != add_item_id) ? 'd-block' : 'd-none')">
                <strong>+</strong> Add Item
            </div>
            <div class="add-item kanban-item w-100 px-0 py-0 kanban-text" :class="((add_item_enabled == true && kanban._id == add_item_id) ? 'd-block' : 'd-none')">
                <textarea ref="add_item_ref" v-model="add_item_value" class="form-control ml-0 mr-0 kanban-text add-item" style="resize: none;" placeholder="Enter a title for this card"></textarea>
                <div class="d-flex mt-2">
                    <button class="btn btn-primary kanban-text" v-on:click="addItem">Add Item</button>
                    <button class="btn btn-transparent kanban-text" v-on:click="disableAddItem()"><font-awesome-icon :icon="['fa', 'xmark']"/></button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import draggable from 'vuedraggable'
    import CardItem from './CardItem.vue'
    export default {
        data() {
            return {
                add_item_enabled: false,
                add_item_id: null,
                add_item_value: "",
                kanban: this.data.kanban
            }
        },
        props: {
            data: {
                type: Object
            }
        },
        mounted() {
        },
        methods: {
            // changeCardName() {
            // },
            disableAddItem() {
                this.add_item_enabled = false
                this.add_item_id = null
                this.add_item_value = ''
            },
            enableEditKanbanName(event) {
                this.$refs.card_name_ref.style.display = 'none'
                this.$refs.card_name_edit.style.display = 'block'
                this.$refs.card_name_edit.focus()
                this.$refs.card_name_edit.select()
            },
            disableEditKanbanName(event) {
                this.$refs.card_name_ref.style.display = 'block'
                this.$refs.card_name_edit.style.display = 'none'
            },
            showAddItemInput(event, card_id) {
                // setTimeout(() => {
                //     }, 200)
                this.add_item_enabled = true
                this.add_item_id = card_id
                this.add_item_value = ''
                this.$nextTick(() => {
                    this.$refs.add_item_ref.focus()
                })
            },
            addItem() {
                let task_name = this.add_item_value
                if(task_name.trim() == "" || task_name == null) {
                    return false
                }
                let config = {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }
                this.$axios.$post(`${process.env.BACKEND_URL}/api/card`, new URLSearchParams({
                    name: task_name,
                    list_id: this.kanban._id
                }), config)
                .then((response) => {
                    if(response.status == 'OK') {
                        let {data} = response
                        this.kanban.cards.push({
                            "deadline": {
                                "date": null,
                                "done": false
                            },
                            "_id": data._id,
                            "name": task_name,
                            "description": "",
                            "members": [],
                            "checklists": []
                        })
                        this.disableAddItem()
                        return
                    }
                    alert('Telah terjadi kesalahan')
                }) 
                .catch((error) => {
                    alert('Error: Telah terjadi kesalahan')
                })
            },
        },
        components: {
            draggable,
            CardItem
        }
    }
</script>