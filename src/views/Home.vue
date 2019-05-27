<template>
  <div class="home">
    <DraftTrainer/>
  </div>
</template>

<script>
// @ is an alias to /src
import DraftTrainer from '@/components/DraftTrainer.vue'

export default {
  name: 'home',
  components: {
    DraftTrainer
  }
}
</script>
