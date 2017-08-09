<template>
  <image-modal :visible="visible" @close="close" transition="roll">
    <video-player ref="videoPlayer" :options="playerOptions"></video-player>
  </image-modal>
</template>

<script>
import { ImageModal } from 'vue-bulma-modal'
import { videoPlayer } from 'vue-video-player'

export default {
  components: {
    ImageModal,
    videoPlayer
  },

  props: {
    visible: Boolean,
    src: String,
    type: String
  },

  data(){
    return {
      playerOptions: {
        // component options
        start: 0,
        playsinline: false,
        // videojs options
        muted: true,
        language: 'en',
        playbackRates: [1.0, 2.0],
        sources: [{
          type: this.type,
          src: this.src
        }],
        poster: "",
      }
    }
  },

  methods: {
    close () {
      this.$emit('close')
    }
  }
}
</script>
