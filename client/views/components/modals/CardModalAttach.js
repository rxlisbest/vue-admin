export default {
  data () {
    return {
      showModal: false,
      d1: {},
      d2: {},
      d3: {}
    }
  },

  methods: {
    okModalMethod (){},
    closeModalMethod (){},
    cancelModalMethod (){},
    showModalMethod(okModalMethod, d1, closeModalMethod, d2, cancelModalMethod, d3){
      this.showModal = true;
      if(typeof okModalMethod == 'function'){
        this.okModalMethod = okModalMethod;
      }
      if(typeof closeModalMethod == 'function'){
        this.closeModalMethod = closeModalMethod;
      }
      if(typeof cancelModalMethod == 'function'){
        this.cancelModalMethod = cancelModalMethod;
      }
      if(typeof d1 == 'object'){
        this.d1 = d1;
      }
      if(typeof d2 == 'object'){
        this.d2 = d2;
      }
      if(typeof d3 == 'object'){
        this.d3 = d3;
      }
    },
    ok (){
      this.showModal = false;
      this.okModalMethod(this.d1);
      this.okModalMethod = function(){};
      this.d1 = {};
    },
    close () {
      this.showModal = false;
      this.closeModalMethod(this.d2);
      this.closeModalMethod = function(){};
      this.d2 = {};
    },
    cancel (){
      this.showModal = false;
      this.cancelModalMethod(this.d3);
      this.cancelModalMethod = function(){};
      this.d3 = {};
    }
  }
}