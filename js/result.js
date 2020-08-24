var vue = new Vue({
  el: "#app",
  data: {
      quizNum: 0,
      quizContents: "",
      questionTitle: "",
      ansList:[],
      selectAnsNum: -1,
      correctAnswer : "",
      correctAnswerNum: -1,
      selectQuestionNum:-1,
      isHideNum: 0,
      isHideResult:true,
      isIconHide1:true,
      isIconHide2:true,
      isIconHide3:true,
      isIconHide4:true,
      // isIconHide5:true,
      isIconHide6:true,
      resultList: [],
      allUserCount: 0,
      ansUserCount: 0,
      maxLimitTime:40,
      limitTime:0,
      winnerList:[],
      answerList:[[],[],[],[]],
      loginMessage:"",
      isCorrectList:[false, false, false, false],
      explain: "",
      kindList: [],
      name: "",
      password: "",
      loginCount: 0,
      error : {
        missLoginInfo:false
      }
  },
  watch: {
     name: function(newVal, oldVal) {
       this.error.requireName = (newVal.length < 1) ? true : false;
     },
      password: function(newVal, oldVal) {
        this.error.requirePassword = (newVal.length < 1) ? true : false;
      },
   },
  methods: {

    resetIcon(){
      if(!this.isIconHide1) this.isIconHide1 = true;
      if(!this.isIconHide2) this.isIconHide2 = true;
      if(!this.isIconHide3) this.isIconHide3 = true;
      if(!this.isIconHide4) this.isIconHide4 = true;
      // if(!this.isIconHide5) this.isIconHide5 = true;
      if(!this.isIconHide6) this.isIconHide6 = true;
    },
    toHome(){
      this.isHideNum = 2;
      this.resetIcon();
      this.isIconHide1 = false;

      //DBクイズデータの初期化
      initQuizData()
    },
    confirm(){
      //ログイン処理
      if(0 < this.name.length && 0 < this.password.length){
        if(login(this.name, this.password)){
            this.isHideNum = 1;
            this.loginCount = 0;
            waitLoginInit();
        } else {
          this.error.missLoginInfo = true;
        }
      }
    },
    toTimeUp(){
      this.isHideNum = 5;
      this.resetIcon();
      this.isIconHide2 = false;

      sendTimeOut();
      clearInterval(timerInterval);

    },
    toCorrectAnswer(){
      this.setCorrectButton()
      this.isHideNum = 6;
      this.resetIcon();
      this.isIconHide4 = false;

      sendAnswer();
      checkAns();

    },
    checkToResultPage(){
      swal({
        title: "結果発表に進む？",
        type:"info",
        showCancelButton : true
      })
      .then(function(val){
        vue.toResultPage()
     })
      .catch(function(e) {
        //cancelを押した場合はこちら
      });
    },
    toResultPage(){
      this.isHideNum = 7;

    },
    setQuestion(quizNum, quizContents, ansList){
      this.quizNum = quizNum;
      this.quizContents = quizContents;
      this.ansList = ansList;
      this.selectAnsNum = -1;
    },

    //Result用メソッド
    getAnswerResult(ansNum, explain){
      this.correctAnswer = this.ansList[ansNum];
      this.correctAnswerNum = ansNum;
      this.explain = explain
    },
    showResult(){
      summaryResult();
      this.isHideResult = false;
    },
    goQuiz(e){
      var selectQuestionNum = parseInt(e.target.id) ;

      //ボタン更新
      this.selectQuestionNum = selectQuestionNum;
      this.questionTitle = e.target.innerText;
      this.kindList[selectQuestionNum].disable = true;

      //初期化
      this.answerList = [[],[],[],[]];
      this.ansUserCount = 0;
      this.limitTime = this.maxLimitTime;


      //クイズ取得
      var q = questions[selectQuestionNum]
      this.setQuestion(this.quizNum+1, q.quizContents, q.ansList)
      this.getAnswerResult(q.correctAnswer, q.explain)

      //画面描画
      this.isHideNum = 3;


      this.resetIcon()
      this.isIconHide3 = false;
      this.isIconHide6 = false; //回答者数表示

      //タイトル表示
      this.showTitle();
    },
    showTitle(){
      function myFunc(){
        setTimeout(function(){
          $("#questionTitle").css("opacity", 0)
          //問題表示
          vue.isHideNum = 4;
          vue.countDownTimer();
          sendQuestion();
        }, 1000)
      }
      TweenMax.to( "#questionTitle", 2.5, {opacity: 1, ease: Circ.easeInOut, delay:0.3, onComplete:myFunc })
    },
    countDownTimer(){
      timerInterval = setInterval(function(){

        vue.limitTime--;
        if(vue.limitTime < 1){
          clearInterval(timerInterval);
        }
      }, 1000)
    },
    setCorrectButton(){
      for(var i in this.isCorrectList){
        this.isCorrectList[i] = false;
      }
      this.isCorrectList[this.correctAnswerNum] = true;
    }
  }
})

var timerInterval