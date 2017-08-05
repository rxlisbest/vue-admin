<template>
  <card-modal :visible="visible" @close="close" :title="title" transition="zoom" @ok="ok()" @cancel="cancel()">
    <div class="content has-text-centered"><i class="fa fa-exclamation-triangle fa-5x pull-left" :class="type" aria-hidden="true"></i><span class="message" v-text="message"></span></div>
  </card-modal>
</template>

<script>
import { CardModal } from 'vue-bulma-modal'

export default {
  components: {
    CardModal
  },

  props: {
    visible: Boolean,
    title: String,
    message: String,
    type: String,
    url: String,
  },

  data () {
    return {
      src: require('assets/logo.svg')
    }
  },

  methods: {
    ok(){
      this.$emit('ok')
    },
    open (url) {
      window.open(url)
    },
    close () {
      this.$emit('close')
    },
    cancel(){
      this.$emit('cancel')
    }

  }
}
</script>
<style type="text/css">
  .message{
    font-size: 20px;
    line-height: 60px;
  }
  .large{
    width:10%;
  }
  .warning{
    color:#ffdb4a;
  }
</style>
