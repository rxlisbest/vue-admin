<template>
  <div>
    <div class="tile is-ancestor">
      <div class="tile is-parent">
        <article class="tile is-child box">
          <h4 class="title">列表</h4>
          <router-link :to="{ path: '/video/create' }" class="button is-primary modal-button">新增记录</router-link>
          
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
                  <router-link :to="{ path: '/video/update/' + v.id }">编辑</router-link>
                  <a v-on:click="showModalMethod(delete_article_modal, deleteArticle, {id: v.id})">
                    删除
                  </a>
                </td>
              </tr>
            </tbody>
          </table>
          <pagination v-if="showPagination" :pageNo="articles.pages.totalPage" :cur="articles.pages.page + 1" @requestData="requestData"></pagination>
          <!-- <a v-for="v in Array.from(new Array(articles.pages.totalPage), (v,i) => { return i})" :key="v" @click="page(v)">{{v + 1}}</a> -->
        </article>
      </div>
    </div>
    <card-modal :type="card_modal.type" :title="card_modal.title" :message="card_modal.message" :visible="showModal" @close="close" transition="zoom" @ok="ok()" @cancel="cancel()"></card-modal>
  </div>
</template>
<script>

import Pagination from '../components/Pagination'
import CardModal from '../components/modals/CardModal'
import CardModalAttach from '../components/modals/CardModalAttach.js'

export default {
  mixins: [CardModalAttach],

  components: {
    CardModal,
    Pagination
  },

  data () {
    return {
      articles: {
        models: [],
        pages:{
          totalPage: 1,
          page: 0
        }
      },
      showPagination: false,
      delete_article_modal: {
        type: 'warning',
        title: '提示信息',
        message: '确定要删除这条记录？',
      }
    }
  },

  mounted () {
    let id = Number(this.$route.params.id);
    if(!isNaN(id)){
      this.articles.pages.page = id;
    } 
    this.loadData();
  },
  
  methods: {
    requestData (page) {
      this.articles.pages.page = page - 1;
      this.loadData();
      // 在这里使用ajax或者fetch将对应页传过去获取数据即可
    },
    loadData () {
      let _this = this;
      _this.showPagination = false;
      _this.axios({
        url: api.articles.index,
        method: "get",
        params: {
          page: _this.articles.pages.page,
        }
      }).then((response) => {
        _this.articles = response.data;
        _this.showPagination = true;
      }).catch((error) => {
        // console.log(error)
      })
    },
    deleteArticle (obj) {
      let _this = this;
      this.axios({
        url: api.articles.delete + obj.id,
        method: "delete",
      }).then((response) => {
        _this.articles.pages.page = 0;
        _this.loadData();
      }).catch((error) => {
        // console.log(error)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>