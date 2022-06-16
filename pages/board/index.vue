<template>
  <Kanban/>
</template>

<script>
import Kanban from "../../components/board/Main.vue";
export default {
    // middleware: ['auth'],
    name: "KanbanPage",
    components: { Kanban },
    head() {
        return {
            title: 'Board'
        }
    }
}
</script>
