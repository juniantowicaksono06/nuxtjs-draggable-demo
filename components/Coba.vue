<style>
    .pointer {
        cursor: pointer;
    }
    .task_list {
        margin-bottom: 20px;
    }
    .task_list p {
        margin-bottom: 0;
    }
</style>
<template>
    <div>
        <h1>Testing VueJS Draggable Library</h1>
        <div class="container-fluid">
            <div class="row mb-2">
                <div class="col-6">
                    <div class="input-group">
                        <input class="form-control" placeholder="Add a Task..." v-model="add_task_value" />
                        <div class="input-group-append">
                            <button class="btn btn-primary" @click="(add_task())">Add Task</button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-6">
                    <div class="card">
                        <div class="card-header">
                            <h4>Todo</h4>
                        </div>
                        <div class="card-body">
                            <draggable :list="task_list" group="task" @change="task_done_handle">
                                <div class="pointer" v-for="task in task_list" :key="task.id">
                                    <div class="card task_list">
                                        <div class="card-body">
                                            <p>{{ task.task_name }}</p>
                                        </div>
                                    </div>
                                </div>
                            </draggable>
                            <div v-if="(task_list.length == 0)">
                                <p class="text-center mb-0">Hore anda rajin sekali</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-6">
                    <div class="card">
                        <div class="card-header">
                            <h4>Done</h4>
                        </div>
                        <div class="card-body">
                            <draggable :list="task_done" group="task" @change="task_not_complete_handle">
                                <div class="pointer" v-for="task in task_done" :key="task.id">
                                    <div class="card task_list">
                                        <div class="card-body">
                                            <p>{{ task.task_name }}</p>
                                        </div>
                                    </div>
                                </div>
                            </draggable>
                            <div v-if="(task_done.length == 0)">
                                <p class="text-center mb-0">Jangan malas</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import draggable from 'vuedraggable'
    export default {
        data() {
            return {
                add_task_value: '',
                task_list: [
                ],
                task_done: [

                ]
            }
        },
        created() {
            // console.log(this.$axios);
            this.$axios.$get('http://localhost:4500/api/task')
            .then((response) => {
                // this.task_list = response               
                let task_list = response.filter((value) => {
                    if(value.task_done == 0) return value
                })
                let task_done = response.filter((value) => {
                    if(value.task_done == 1) return value
                })
                this.task_list = task_list
                this.task_done = task_done
            })
        },
        methods: {
            task_done_handle: function(evt) {
                if('added' in evt) {
                    let {id} = evt.added.element
                    this.$axios.$post(`http://localhost:4500/api/task/${id}`, {
                        'task_done': 'not_done'
                    })
                    .then(response => {
                        console.log(response)
                    })
                }
                // console.log(evt.added)
            },
            task_not_complete_handle: function(evt) {
                console.log(evt)
                if('added' in evt) {
                    let {id} = evt.added.element
                    this.$axios.$post(`http://localhost:4500/api/task/${id}`, {
                        'task_done': 'done'
                    })
                    .then(response => {
                        console.log(response)
                    })
                }
            },
            add_task() {
                let last_id = this.task_list.length > 0 ? this.task_list[this.task_list.length - 1].id : 0
                last_id += 1;
                let tmp = {
                    'id': last_id,
                    'task_name': this.add_task_value
                }
                this.add_task_value = ''
                this.task_list = this.task_list.concat(tmp)
            }
        },
        components: {
            draggable
        }
    }
</script>