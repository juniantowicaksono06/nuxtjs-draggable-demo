<template>
  <Kanban/>
</template>

<script>
import Kanban from "../../components/board/Main.vue";
export default {
    middleware: ['hasworkspace'],
    name: "KanbanPage",
    components: { Kanban },
    head() {
        return {
            title: 'Board'
        }
    }
}
</script>
