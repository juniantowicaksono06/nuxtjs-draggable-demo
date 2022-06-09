<template>
  <Kanban/>
</template>

<script>
import Kanban from "../../../components/kanban/Main.vue";
export default {
    name: "KanbanPage",
    components: { Kanban },
    head() {
        return {
            title: 'Board'
        }
    }
}
</script>
