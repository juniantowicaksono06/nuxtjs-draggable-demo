<template>
    <div class="kanban-card card" ref="card_ref">
        <div class="card-header kanban-header">
            <p class="kanban-header-input mb-0" style="display: block;" ref="card_name_ref" v-on:click="enableEditKanbanName($event)">{{ data.list.name }}</p> 
            <input class="kanban-header-input" ref="card_name_edit" style="display:none;" v-model="data.list.name" v-on:blur="renameCard($event)" v-on:focus="storeOldValue" v-on:keyup.enter="$event.target.blur()" />
        </div>
        <div class="card-body kanban-body py-1 px-2" ref="card_body_ref">
            <draggable group="task" v-model="data.list.cards" ghostClass="kanban-ghost-class" dragClass="kanban-drag-class" animation=250 @end="endDrag" :data-id="data.list._id">
                <div v-for="(item, index_item) in cards" :key="item._id" draggable=".kanban-item" :data-id="item._id">
                    <CardItem :data="{
                        item: item,
                        card_name: data.list.name,
                        index_item: index_item,
                    }" @archiveItem="archiveItem" />
                </div>
            </draggable>
        </div>
        <div class="kanban-footer">
            <div class="add-item kanban-item kanban-text w-100 px-3 py-3" v-on:click="enableAddItem($event, data.list._id)" :class="((!add_item_enabled) || (add_item_enabled && data.list._id != add_item_id) ? 'd-block' : 'd-none')">
                <strong>+</strong> Add Item
            </div>
            <div class="add-item kanban-item w-100 px-2 py-2 kanban-text" :class="((add_item_enabled == true && data.list._id == add_item_id) ? 'd-block' : 'd-none')">
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
                drag_data: {
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
            },
            cards(){
                return this.data.list.cards.sort(function(a, b){
                    return new Date(b.updatedAt) - new Date(a.updatedAt)
                })
            }
        },
        methods: {
            webSocketEvent() {
                this.wsInstance.on('add_item', (response) => {
                    let data = JSON.parse(response)
                    if(this.data.list) {
                        if(this.data.list._id == data.list_id) {
                            this.data.list.cards.push(data['data'])
                        }
                    }
                })
                this.wsInstance.on('edit_list', (response) => {
                    let result = JSON.parse(response)
                    if(this.data.list) {
                        if(this.data.list._id == result.list_id) {
                            Object.keys(result.data).some((res) => {
                                this.data.list[res] = result.data[res]
                            })
                            return
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
                        list_id: this.data.list._id
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
                        this.$wsEmit({
                            list_id: this.data.list._id,
                            data: {
                                card_id: id 
                            }
                        }, 'archive_item')
                    }
                }) 
                .catch((error) => {
                })
                this.data.list.cards.splice(index, 1)
            },
            storeOldValue() {
                this.old_value = this.data.list.name
            },
            endDrag(event) {
                this.drag_data['id'] = event.item.dataset.id
                this.drag_data['board_id'] = this.data.board_id
                this.drag_data['dest_list_id'] = event.to.dataset.id
                this.drag_data['origin_list_id'] = event.from.dataset.id
                if(this.drag_data['dest_list_id'] == this.drag_data['origin_list_id']) return
                let config = {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
                this.$axios.$post(`/api/card/slide`, this.drag_data, config)
                .then((response) => {
                    if(response.status == 'OK') {
                        // Do Something
                        this.$wsEmit({
                            data: {
                                item: this.drag_data
                            }
                        }, 'slide_item')
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
                if(this.data.list.name.trim() == '' || this.data.list.name.trim() == this.old_value.trim()) {
                    this.data.list.name = this.old_value
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
                    name: this.data.list.name,
                    id: this.data.list._id
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
                        this.$wsEmit({
                            list_id: this.data.list._id,
                            data: {
                                name: this.data.list.name
                            }
                        }, 'edit_list')
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
                    list_id: this.data.list._id
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
                        this.data.list.cards.push({
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
                        this.$wsEmit({
                            list_id: this.data.list._id,
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
                        }, 'add_item')
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