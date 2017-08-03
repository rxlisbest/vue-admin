<template>
  <div>
    <div class="tile is-ancestor">
      <div class="tile is-parent is-12">
        <article class="tile is-child box">
          <h1 class="title">Controls</h1>
          <div class="block">
            <label class="label">Title</label>
            <p class="control is-4">
              <input class="input" type="text" placeholder="Text input" v-model="article.title">
            </p>
            <label class="label">Content</label>
            <p class="control">
              <textarea class="textarea" placeholder="Textarea" v-model="article.content"></textarea>
            </p>
            <p class="control">
              <label class="radio">
                <input type="radio" name="question">
                Yes
              </label>
              <label class="radio">
                <input type="radio" name="question">
                No
              </label>
            </p>
            <p class="control is-4" id="container">
              <a id="pickfiles">上传文件</a>
              <progress-bar v-if="" :type="'info'" :value="percent" :max="100"></progress-bar>
            </p>
            <p class="control">
              <button class="button is-primary" v-on:click="addArticle()">Submit</button>
              <button class="button is-link">Cancel</button>
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
      }
    }
  },

  computed: {
    chartData () {
      return {
        labels: [
          'Red',
          'Blue',
          'Yellow'
        ],
        datasets: [{
          data: this.data,
          backgroundColor: [
            '#FF6384',
            '#36A2EB',
            '#FFCE56'
          ]
        }]
      }
    }
  },

  mounted () {
    this.loadData();
      // this.$auth.get('http://127.0.0.1:8000/api/v1/article/list').then(res => {
      //     console.log('RES', res);
      // });
    // setInterval(() => {
    //   // https://github.com/vuejs/vue/issues/2873
    //   // Array.prototype.$set/$remove deprecated (use Vue.set or Array.prototype.splice instead)
    //   this.data.forEach((item, i) => {
    //     this.data.splice(i, 1, Math.ceil(Math.random() * 1000))
    //   })
    // }, 1024)
  },
  methods: {
    addArticle (){
      this.axios({
        url: api.articles.create,
        method: "post",
        data : {
          title: this.article.title,
          content: this.article.content,
          file_id: this.article.file_id,
        }
      }).then((response) => {
        // console.log(response);
      }).catch((error) => {
        // console.log(error)
      })
    },
    loadData () {
      var _this = this;
      // this.$auth.refresh({
      //   headers: {
      //     'Content-Type': 'application/json'
      //   },
      //   params: {
      //     grant_type: 'refresh_token',
      //     grant_type: _this.$auth.refresh,
      //     grant_type: 'refresh_token',
      //     grant_type: 'refresh_token',
      //   }
      // });
      new Promise(function(resolve, reject) {
        _this.axios({
          url: api.qiniu.token,
          method: "get"
        }).then((response) => {
          var uptoken = response.data.uptoken
          resolve(uptoken);
        }).catch((error) => {
          reject(error);
        })
      }).then(function(uptoken){
        var uploader = Qiniu.uploader({
            runtimes: 'html5,flash,html4',      // 上传模式，依次退化
            browse_button: 'pickfiles',         // 上传选择的点选按钮，必需
            // 在初始化时，uptoken，uptoken_url，uptoken_func三个参数中必须有一个被设置
            // 切如果提供了多个，其优先级为uptoken > uptoken_url > uptoken_func
            // 其中uptoken是直接提供上传凭证，uptoken_url是提供了获取上传凭证的地址，如果需要定制获取uptoken的过程则可以设置uptoken_func
            uptoken : uptoken, // uptoken是上传凭证，由其他程序生成
            // uptoken_url: api.qiniu.token,         // Ajax请求uptoken的Url，强烈建议设置（服务端提供）
            // uptoken_func: function(){    // 在需要获取uptoken时，该方法会被调用
            //    // do something

            //   return uptoken;
            // },
            get_new_uptoken: false,             // 设置上传文件的时候是否每次都重新获取新的uptoken
            // downtoken_url: '/downtoken',
            // Ajax请求downToken的Url，私有空间时使用，JS-SDK将向该地址POST文件的key和domain，服务端返回的JSON必须包含url字段，url值为该文件的下载地址
            // unique_names: true,              // 默认false，key为文件名。若开启该选项，JS-SDK会为每个文件自动生成key（文件名）
            // save_key: true,                  // 默认false。若在服务端生成uptoken的上传策略中指定了sava_key，则开启，SDK在前端将不对key进行任何处理
            domain: 'http://cdn.bucket1.ruixinglong.net/',     // bucket域名，下载资源时用到，必需
            container: 'container',             // 上传区域DOM ID，默认是browser_button的父元素
            max_file_size: '100mb',             // 最大文件体积限制
            flash_swf_url: 'path/of/plupload/Moxie.swf',  //引入flash，相对路径
            max_retries: 3,                     // 上传失败最大重试次数
            dragdrop: true,                     // 开启可拖曳上传
            drop_element: 'container',          // 拖曳上传区域元素的ID，拖曳文件或文件夹后可触发上传
            chunk_size: '4mb',                  // 分块上传时，每块的体积
            auto_start: true,                   // 选择文件后自动上传，若关闭需要自己绑定事件触发上传
            //x_vars : {
            //    查看自定义变量
            //    'time' : function(up,file) {
            //        var time = (new Date()).getTime();
                      // do something with 'time'
            //        return time;
            //    },
            //    'size' : function(up,file) {
            //        var size = file.size;
                      // do something with 'size'
            //        return size;
            //    }
            //},
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
                       // 每个文件上传成功后，处理相关的事情
                       // 其中info是文件上传成功后，服务端返回的json，形式如：
                       // {
                       //    "hash": "Fh8xVqod2MQ1mocfI4S4KpRL6D98",
                       //    "key": "gogopher.jpg"
                       //  }
                       // 查看简单反馈
                       // var domain = up.getOption('domain');
                       // var res = parseJSON(info);
                       // var sourceLink = domain +"/"+ res.key; 获取上传成功后的文件的Url
                },
                'Error': function(up, err, errTip) {
                       //上传出错时，处理相关的事情
                },
                'UploadComplete': function() {
                       //队列文件处理完毕后，处理相关的事情
                },
                'Key': function(up, file) {
                    // 若想在前端对每个文件的key进行个性化处理，可以配置该函数
                    // 该配置必须要在unique_names: false，save_key: false时才生效
                    var key = new Date().getTime();
                    // do something with key here
                    return key
                }
            }
        });
      }).catch(function(error){
        console.log(error)
      });
      

      this.axios({
        url: api.articles.index,
        // transformResponse: [(data) => {
        //   return JSON.parse(data.replace(/T00:00:00/g, ''))
        // }],
        method: "get",
        params: {
          // access_token : token
        },
        data : {
          test : 123
        }
      }).then((response) => {
        // console.log(response);
      }).catch((error) => {
        // console.log(error)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
