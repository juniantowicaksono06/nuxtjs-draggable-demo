<template>
    <div class="kanban-card card" ref="card_ref">
        <div class="card-header kanban-header">
            <p class="kanban-header-input mb-0" style="display: block;" ref="card_name_ref" v-on:click="enableEditKanbanName($event)">{{ kanban_card.name }}</p> 
            <input class="kanban-header-input" ref="card_name_edit" style="display:none;" v-model="kanban_card.name" v-on:blur="changeCardName($event)" v-on:focus="storeOldValue" v-on:keyup.enter="$event.target.blur()" />
        </div>
        <div class="card-body kanban-body py-1 px-2" ref="card_body_ref">
            <draggable group="task" v-model="kanban_card.cards" ghostClass="kanban-ghost-class" dragClass="kanban-drag-class" animation=250 @end="endDrag" :data-id="kanban_card._id">
                <div v-for="(item, index_item) in kanban_card.cards" :key="item._id" draggable=".kanban-item" v-on:mousedown="dragCard(item, kanban_card._id)">
                    <CardItem :data="{
                        item: item,
                        card_name: kanban_card.name
                    }" />
                </div>
            </draggable>
            <div class="add-item kanban-item kanban-text w-100 px-2 py-2" v-on:click="showAddItemInput($event, kanban_card._id)" :class="((!add_item_enabled) || (add_item_enabled && kanban_card._id != add_item_id) ? 'd-block' : 'd-none')">
                <strong>+</strong> Add Item
            </div>
            <div class="add-item kanban-item w-100 px-0 py-0 kanban-text" :class="((add_item_enabled == true && kanban_card._id == add_item_id) ? 'd-block' : 'd-none')">
                <!-- <textarea ref="add_item_ref" v-model="add_item_value" class="form-control ml-0 mr-0 kanban-text add-item" style="resize: none;" placeholder="Enter a title for this card"></textarea> -->
                <input ref="add_item_ref" type="text" v-model="add_item_value" class="form-control ml-0 mr-0 kanban-text add-item" style="resize: none;" placeholder="Enter a title for this card"  v-on:keyup.enter="addItem">
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
                kanban_card: this.data.kanban,
                drag_end_data: {
                    id: '',
                    board_id: '',
                    origin_list_id: '',
                    dest_list_id: ''
                },
                old_value: '',
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
            storeOldValue() {
                this.old_value = this.kanban_card.name
            },
            dragCard(item, card_id){
                this.drag_end_data['id'] = item._id
                this.drag_end_data['board_id'] = this.data.board_id
                this.drag_end_data['origin_list_id'] = card_id
            },
            endDrag(event) {
                this.drag_end_data['dest_list_id'] = event.to.dataset.id
                if(this.drag_end_data['dest_list_id'] == this.drag_end_data['origin_list_id']) return
                let config = {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
                this.$axios.$post(`/api/card/slide`, this.drag_end_data, config)
                .then((response) => {
                    if(response.status == 'OK') {
                        // Do Something
                    }
                }) 
                .catch((error) => {
                    alert('Error: Telah terjadi kesalahan')
                })
            },
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
            changeCardName(event) {
                if(this.kanban_card.name.trim() == '' || this.kanban_card.name.trim() == this.old_value.trim()) {
                    this.kanban_card.name = this.old_value
                    this.old_value = ''
                    return
                }
                this.old_value = ''
                this.$refs.card_name_ref.style.display = 'block'
                this.$refs.card_name_edit.style.display = 'none'
                let config = {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }
                this.$axios.$post(`/api/board`, new URLSearchParams({
                    name: this.kanban_card.name,
                    workspace_id: this.data.workspace_id
                }), config)
                .then((response) => {
                    if(response.status == 'OK') {
                        return 
                    }
                })
                .catch((error) => {
                    alert("Error: Telah terjadi kesalahan")
                })
            },
            showAddItemInput(event, card_id) {
                this.add_item_enabled = true
                this.add_item_id = card_id
                this.add_item_value = ''
                this.$nextTick(() => {
                    this.$refs.add_item_ref.focus()
                    let card_body_ref = this.$refs.card_body_ref
                    if(card_body_ref.scrollHeight > card_body_ref.clientHeight) {
                        card_body_ref.scrollTo(0, card_body_ref.scrollHeight)
                    }
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
                this.$axios.$post(`/api/card`, new URLSearchParams({
                    name: task_name,
                    list_id: this.kanban_card._id
                }), config)
                .then((response) => {
                    if(response.status == 'OK') {
                        let {data} = response
                        this.kanban_card.cards.push({
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