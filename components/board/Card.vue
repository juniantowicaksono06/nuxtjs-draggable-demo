<template>
    <div class="kanban-card card" ref="card_ref">
        <div class="card-header kanban-header">
            <p class="kanban-header-input mb-0" style="display: block;" ref="card_name_ref" v-on:click="enableEditKanbanName($event)">{{ kanban_card.name }}</p> 
            <input class="kanban-header-input" ref="card_name_edit" style="display:none;" v-model="kanban_card.name" v-on:blur="renameCard($event)" v-on:focus="storeOldValue" v-on:keyup.enter="$event.target.blur()" />
        </div>
        <div class="card-body kanban-body py-1 px-2" ref="card_body_ref">
            <draggable group="task" v-model="kanban_card.cards" ghostClass="kanban-ghost-class" dragClass="kanban-drag-class" animation=250 @end="endDrag" :data-id="kanban_card._id">
                <div v-for="(item, index_item) in kanban_card.cards" :key="item._id" draggable=".kanban-item" v-on:mousedown="dragCard(item, kanban_card._id)">
                    <CardItem :data="{
                        item: item,
                        card_name: kanban_card.name,
                        index_item: index_item
                    }" @archiveItem="archiveItem" />
                </div>
            </draggable>
        </div>
        <div class="kanban-footer">
            <div class="add-item kanban-item kanban-text w-100 px-3 py-3" v-on:click="enableAddItem($event, kanban_card._id)" :class="((!add_item_enabled) || (add_item_enabled && kanban_card._id != add_item_id) ? 'd-block' : 'd-none')">
                <strong>+</strong> Add Item
            </div>
            <div class="add-item kanban-item w-100 px-2 py-2 kanban-text" :class="((add_item_enabled == true && kanban_card._id == add_item_id) ? 'd-block' : 'd-none')">
                <input ref="add_item_ref" type="text" v-model="add_item_value" class="form-control ml-0 mr-0 kanban-text add-item" style="resize: none;" placeholder="Enter a title for this card"  v-on:keyup.enter="addItem">
                <div class="d-flex mt-2">
                    <button class="btn btn-primary kanban-text" v-on:click="addItem">Add Item</button>
                    <button class="btn btn-transparent kanban-text" v-on:click="disableAddItem()"><i class="fa fa-times"></i></button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import draggable from 'vuedraggable'
    import CardItem from './CardItem.vue'
    import Swal from 'sweetalert2'
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
            document.addEventListener('keyup', this.onEscape)
            this.webSocketEvent()
        },
        computed: {
            wsInstance() {
                return this.$getWsInstance()
            }
        },
        methods: {
            webSocketEvent() {
                this.wsInstance.on('archive_item', (response) => {
                    let data = JSON.parse(response)
                    if(this.kanban_card) {
                        if(this.kanban_card._id == data.list_id) {
                            this.kanban_card.cards.some((value, index) => {
                                if(value._id == data.data['card_id']) {
                                    this.kanban_card.cards.splice(index, 1)
                                    return
                                }
                            })
                        }
                    }
                })
                this.wsInstance.on('add_item', (response) => {
                    let data = JSON.parse(response)
                    if(this.kanban_card) {
                        if(this.kanban_card._id == data.list_id) {
                            this.kanban_card.cards.push(data['data'])
                        }
                    }
                })
                this.wsInstance.on('edit_item', (response) => {
                    let data = JSON.parse(response)
                    if(this.kanban_card) {
                        if(this.kanban_card._id == data.list_id) {
                            this.kanban_card = {
                                ...this.kanban_card,
                                ...data.data
                            }
                        }
                    }
                })
            },
            archiveItem(index, id) {
                let config = {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data: {
                        id: id,
                        board_id: this.data.board_id,
                        list_id: this.kanban_card._id
                    }
                }
                this.$axios.$delete(`/api/card/`, config)
                .then((response) => {
                    if(response.status == 'OK') {
                        Swal.fire({
                            text: 'Card has been archived',
                            toast: true,
                            timer: 3000,
                            position: 'bottom-right',
                            showConfirmButton: false,
                            showCancelButton: false,
                            icon: 'success',
                            title: 'Success'
                        })
                        this.wsInstance.emit('archive_item', JSON.stringify({
                            list_id: this.kanban_card._id,
                            data: {
                                card_id: id 
                            }
                        }))
                    }
                }) 
                .catch((error) => {
                })
                this.kanban_card.cards.splice(index, 1)
            },
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
            renameCard(event) {
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
                this.$axios.$put(`/api/list`, new URLSearchParams({
                    name: this.kanban_card.name,
                    id: this.kanban_card._id
                }), config)
                .then((response) => {
                    if(response.status == 'OK') {
                        Swal.fire({
                            text: 'List has been renamed',
                            toast: true,
                            timer: 3000,
                            position: 'bottom-right',
                            showConfirmButton: false,
                            showCancelButton: false,
                            icon: 'success',
                            title: 'Success'
                        })
                        this.wsInstance.emit('edit_item', JSON.stringify({
                            list_id: this.kanban_card._id,
                            data: {
                                name: this.kanban_card.name
                            }
                        }))
                        
                    }
                })
                .catch((error) => {
                })
            },
            onEscape(event) {
                if(event.key == 'Escape') {
                    this.$refs.card_name_ref.style.display = 'block'
                    this.$refs.card_name_edit.style.display = 'none'
                    this.disableAddItem()   
                }
            },
            enableAddItem(event, card_id) {
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
                        Swal.fire({
                            text: 'Card item has been created',
                            toast: true,
                            timer: 3000,
                            position: 'bottom-right',
                            showConfirmButton: false,
                            showCancelButton: false,
                            icon: 'success',
                            title: 'Success'
                        })
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
                            "checklists": [],
                            "comments": []
                        })
                        this.wsInstance.emit('add_item', JSON.stringify({
                            list_id: this.kanban_card._id,
                            data: {
                                "deadline": {
                                    "date": null,
                                    "done": false
                                },
                                "_id": data._id,
                                "name": task_name,
                                "description": "",
                                "members": [],
                                "checklists": [],
                                "comments": []
                            }
                        }))
                        this.disableAddItem()
                    }
                }) 
                .catch((error) => {
                })
            },
        },
        components: {
            draggable,
            CardItem
        }
    }
</script>