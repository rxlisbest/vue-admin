<template>
<div class="content has-text-centered">
  <h1 class="is-title is-bold">Login</h1>

  <div class="columns is-vcentered">
    <div class="column is-6 is-offset-3">
      <div class="box">
        <div v-show="error" style="color:red; word-wrap:break-word;">{{ error }}</div>
        <form v-on:submit.prevent="login">
          <label class="label">Email</label>
          <p class="control">
            <input v-model="data.body.username" class="input" type="text" placeholder="email@example.org">
          </p>
          <label class="label">Password</label>
          <p class="control">
            <input v-model="data.body.password" class="input" type="password" placeholder="password">
          </p>

          <p class="control">
            <label class="checkbox">
              <input type="checkbox" v-model="data.rememberMe">
              Remember me
            </label>
          </p>

          <hr>
          <p class="control">
            <button type="submit" class="button is-primary">Login</button>
            <button class="button is-default">Cancel</button>
          </p>
        </form>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import Vue from 'vue'
import Message from 'vue-bulma-message'
const MessageComponent = Vue.extend(Message)
const openMessage = (propsData = {
  title: '',
  message: '',
  type: '',
  direction: '',
  duration: 1500,
  container: '.messages'
}) => {
  return new MessageComponent({
    el: document.createElement('div'),
    propsData
  })
}

export default {

  data () {
    return {
      data: {
        body: {
          grant_type: 'password',
          client_id: 'blog',
          scop: 'test',
          username: null,
          password: null
        },
        rememberMe: false
      },
      error: null
    }
  },
  mounted () {
    // Can set query parameter here for auth redirect or just do it silently in login redirect.
  },
  methods: {
    login () {
      var _this = this;
      var redirect = this.$auth.redirect()
      this.$auth.login({
        // headers: {
        //   'Content-Type': 'application/json'
        // },
        params: this.data.body,
        rememberMe: this.data.rememberMe,
        redirect: false,
        success (res) {
          // this.$auth.token('test')
          // console.log('Auth Success')
          // console.log('Token: ' + this.$auth.token())
          // console.log(res)
          if(res.status == 200){
            _this.$router.push('/dashboard');
          }
          else{
            openMessage({message: res.response.data.message, type: 'danger', duration: 1500, showCloseButton: true})
            return false;
          }
        },
        error (err) {
          // do nothing
        }
      })
    }
  }
  // filters: {
  //   json: function (value) {
  //     console.log(value)
  //     return value
  //   }
  // }

}
</script>

<style lang="scss" scoped>
.is-title {
    text-transform: capitalize;
}
</style>
