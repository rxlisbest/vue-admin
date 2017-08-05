<template>
  <div>
    <div class="tile is-ancestor">
      <div class="tile is-parent">
        <article class="tile is-child box">
          <h4 class="title">Table</h4>
          <table class="table">
            <thead>
              <tr>
                <th>标题</th>
                <th>创建时间</th>
                <th>操作</th>
              </tr>
            </thead>
            <tfoot>
              <tr>
                <th>标题</th>
                <th>创建时间</th>
                <th>操作</th>
              </tr>
            </tfoot>
            <tbody>
              <tr v-for="v in articles.models">
                <td v-text="v.title"></td>
                <td v-text="v.create_time"></td>
                <td class="is-icon">
                  <router-link :to="{ path: '/dashboard/' + v.id }">编辑</router-link>
                  <a v-on:click="showModalMethod(deleteArticle, {id: v.id})">
                    删除
                  </a>
                </td>
              </tr>
            </tbody>
          </table>
        </article>
      </div>
    </div>
    <card-modal :visible="showModal" @close="close" transition="zoom" @ok="ok()" @cancel="cancel()"></card-modal>
  </div>
</template>
<script>

import CardModal from '../components/modals/CardModal'
import CardModalAttach from '../components/modals/CardModalAttach.js'

export default {
  mixins: [CardModalAttach],

  components: {
    CardModal
  },

  data () {
    return {
      articles: {
        models: [],
        pages:{}
      }
    }
  },

  mounted () {
    this.loadData();
  },
  methods: {
    loadData () {
      let _this = this;
      this.axios({
        url: api.articles.index,
        method: "get",
      }).then((response) => {
        _this.articles = response.data;
      }).catch((error) => {
        console.log(error)
      })
    },
    
    deleteArticle (obj) {
      let _this = this;
      this.axios({
        url: api.articles.delete + obj.id,
        method: "delete",
      }).then((response) => {
        _this.loadData();
      }).catch((error) => {
        console.log(error)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>