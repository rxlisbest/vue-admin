<template>
  <div>
    <div class="tile is-ancestor">
      <div class="tile is-parent is-12">
        <article class="tile is-child box">
          <h1 class="title">视频</h1>
          <div class="block">
            <label class="label">标题</label>
            <p class="control is-4">
              <input class="input" type="text" placeholder="Text input" v-model="article.title">
            </p>
            <p class="control is-4" id="container">
            <label class="label">上传</label>
              <a class="button is-warning" id="pickfiles">上传文件</a>
              <a class="button is-danger modal-button btn-left-10" @click="openVideoModal">预览</a>
              <progress-bar class="top" v-if="percent > 0 && percent < 100" :type="'warning'" :value="percent" :max="100"></progress-bar>
              <span class="btn-left-10" v-text="file.name"></span>
            </p>
            <label class="label">描述</label>
            <p class="control">
              <textarea class="textarea" placeholder="Textarea" v-model="article.content"></textarea>
            </p>
            <p class="control">
              <button class="button is-primary" v-on:click="submit()">提交</button>
              <router-link class="button is-link" :to="{ path: '/video' }">取消</router-link>
            </p>
          </div>
        </article>
      </div>
    </div>
  </div>
</template>

<script>
import ProgressBar from 'vue-bulma-progress-bar'
import Chart from 'vue-bulma-chartjs'

import plupload from 'plupload'
global.plupload = plupload
import moxie from 'plupload/src/moxie'
global.moxie = moxie
import qiniu from 'qiniu-js'

// message
import Vue from 'vue'
import VideoModal from '../components/modals/VideoModal'
const VideoModalComponent = Vue.extend(VideoModal)
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

  components: {
    Chart,
    ProgressBar
  },
  
  data () {
    return {
      data: [300, 50, 100],
      percent: 0,
      article: {
        title: '',
        content: '',
        file_id: 0,
        type: 1,
      },
      file: {
        id: '',
        type: '',
        hash: '',
        name: '',
        size: '',
        domain: '',
        save_name: '',
        transcode_id: '',
        transcode_type: '',
        transcode_name: '',
        is_transcoded: '',
      },
      qiniu_domain: ''
    }
  },
  mounted () {
    this.loadData();
    this.loadQiniu();
  },

  methods: {
    submit(){
      let title = this.article.title;
      let content = this.article.content;
      let file_id = this.article.file_id;
      let type = this.article.type;
      if(!title){
        openMessage({message: '标题不能为空', type: 'danger', duration: 1500, showCloseButton: true})
        return false;
      }
      // if(!file_id){
      //   openMessage({message: '视频不能为空', type: 'danger', duration: 1500, showCloseButton: true})
      //   return false;
      // }
      let id = Number(this.$route.params.id);
      if(id && !isNaN(id)){
        this.updateArticle();
      }
      else{
        this.addArticle();
      }
    },

    addArticle (){
      let _this = this;
      this.axios({
        url: api.articles.create,
        method: "post",
        data : {
          title: this.article.title,
          content: this.article.content,
          file_id: this.article.file_id,
          type: this.article.type,
        }
      }).then((response) => {
        // console.log(response);
        if(response.status == 200){
          _this.$router.push('/video');
        }
      }).catch((error) => {

      })
    },

    updateArticle (){
      let _this = this;
      let id = this.$route.params.id;
      this.axios({
        url: api.articles.update + id,
        method: "put",
        data : {
          title: this.article.title,
          content: this.article.content,
          file_id: this.article.file_id,
          type: this.article.type,
        }
      }).then((response) => {
        if(response.status == 200){
          // _this.$router.push('/video');
        }
        // console.log(response);
      }).catch((error) => {

      })
    },

    loadData () {
      let _this = this;
      let id = Number(this.$route.params.id);
      if(isNaN(id)){
        return false;
      }
      this.axios({
        url: api.articles.view + id,
        method: "get",
      }).then((response) => {
        if(response.status == 200){
          var data = response.data;
          _this.article = data;
          if(data.file_id > 0){
            _this.axios({
              url: api.file.view + data.file_id,
              method: "get",
            }).then((response) => {
              if(response.status == 200){
                var data = response.data;
                _this.file = data;
              }
            }).catch((error) => {
              // openMessage({message: error, type: 'error', duration: 0, showCloseButton: true})
            })
          }
        }
      }).catch((error) => {

      })
    },

    loadQiniu (){
      let _this = this;
      new Promise(function(resolve, reject) {
        _this.axios({
          url: api.qiniu.token,
          method: "get"
        }).then((response) => {
          _this.qiniu_domain = response.data.domain;
          resolve(response.data);
        }).catch((error) => {
          reject(error);
        })
      }).then(function(res){
        var uploader = Qiniu.uploader({
            runtimes: 'html5,flash,html4',      // 上传模式，依次退化
            browse_button: 'pickfiles',         // 上传选择的点选按钮，必需
            uptoken : res.uptoken, // uptoken是上传凭证，由其他程序生成
            get_new_uptoken: false,             // 设置上传文件的时候是否每次都重新获取新的uptoken
            domain: res.domain,     // bucket域名，下载资源时用到，必需
            container: 'container',             // 上传区域DOM ID，默认是browser_button的父元素
            max_file_size: '100mb',             // 最大文件体积限制
            flash_swf_url: 'path/of/plupload/Moxie.swf',  //引入flash，相对路径
            max_retries: 3,                     // 上传失败最大重试次数
            dragdrop: true,                     // 开启可拖曳上传
            drop_element: 'container',          // 拖曳上传区域元素的ID，拖曳文件或文件夹后可触发上传
            chunk_size: '4mb',                  // 分块上传时，每块的体积
            auto_start: true,                   // 选择文件后自动上传，若关闭需要自己绑定事件触发上传
            multi_selection: false,
            filters : {
                // max_file_size: '30mb',
                prevent_duplicates: true, //不允许选取重复文件
                mime_types: [
                  // {title : "files", extensions: 'avi, rm, rmvb, wmv, flv, mpg, mpeg, mp4, mov, 3gp, mkv'},
                  {title : "Video files", extensions : "flv,mpg,mpeg,avi,wmv,mov,asf,rm,rmvb,mkv,m4v,mp4,3gp,mov"}, // 限定flv,mpg,mpeg,avi,wmv,mov,asf,rm,rmvb,mkv,m4v,mp4后缀格式上传
                ]
            },
            init: {
                'FilesAdded': function(up, files) {
                    plupload.each(files, function(file) {
                        // 文件添加进队列后，处理相关的事情
                    });
                },
                'BeforeUpload': function(up, file) {
                       // 每个文件上传前，处理相关的事情
                },
                'UploadProgress': function(up, file) {
                       // 每个文件上传时，处理相关的事情
                  _this.percent = file.percent;
                },
                'FileUploaded': function(up, file, info) {
                  eval("info = " + info.response);
                  _this.axios({
                    url: api.file.create,
                    method: "post",
                    data : {
                      hash: info.hash,
                      name: file.name,
                      type: file.type,
                      size: file.size,
                      domain: _this.qiniu_domain,
                      save_name: info.key,
                      is_transcoded: 0
                    }
                  }).then((response) => {
                    if(response.status == 200){
                      _this.article.file_id = response.data.id;
                      _this.file.name = file.name;
                      _this.file.id = response.data.id;
                    }
                  }).catch((error) => {
                    // openMessage({message: error, type: 'error', duration: 0, showCloseButton: true })
                  })
                },
                'Error': function(up, err, errTip) {
                       //上传出错时，处理相关的事情
                },
                'UploadComplete': function() {
                       //队列文件处理完毕后，处理相关的事情
                },
                'Key': function(up, file) {
                    var key = new Date().getTime();
                    return key
                }
            }
        });
      }).catch(function(error){

      });
    },
    openVideoModal(){
      let _this = this;
      if(!_this.file.id){
        openMessage({message: '预览文件为空', type: 'warning', duration: 2000, showCloseButton: true})
        return false;
      }
      _this.axios({
        url: api.file.view + _this.file.id,
        method: "get",
      }).then((response) => {
        if(response.status == 200){
          let data = response.data;
          _this.file = data;
          let src = '';
          let type = '';
          if(_this.file.transcode_id != null){
            if(_this.file.is_transcoded == 1){
              src = _this.file.domain + _this.file.transcode_name;
              type = _this.file.transcode_type;
            }
          }
          else{
            src = _this.file.domain + _this.file.save_name;
            type = _this.file.type;
          }
          if(src && type){
            let propsData = {
                  visible: true,
                  src: src,
                  type: type,
                };
            new VideoModalComponent({
              el: document.createElement('div'),
              propsData
            })
          }
          else{
            openMessage({message: '视频转码中...', type: 'warning', duration: 2000, showCloseButton: true})
          }
        }
      }).catch((error) => {

      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .top {
    margin-top: 10px;
  }
  .btn-left-10{
    margin-left: 10px;
  }
</style>
