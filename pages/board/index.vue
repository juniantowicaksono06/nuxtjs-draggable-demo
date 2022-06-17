<template>
  <Kanban/>
</template>

<script>
import Kanban from "../../components/board/Main.vue";
export default {
    middleware: ['selectworkspace'],
    name: "KanbanPage",
    components: { Kanban },
    head() {
        return {
            title: 'Board'
        }
    }
}
</script>
