var config = {
    apiKey: "AIzaSyDCRh-slIK4OrfOygnEgOW7uv8BQyirbtA",
    authDomain: "jay-book.firebaseapp.com",
    databaseURL: "https://jay-book.firebaseio.com",
    projectId: "jay-book",
    storageBucket: "jay-book.appspot.com",
    messagingSenderId: "740434210124"
  };
  firebase.initializeApp(config);

  var log = console.log;
  var auth = firebase.auth();
  var db = firebase.database();
  var googleAuth = new firebase.auth.GoogleAuthProvider();
  var ref = null;
  var user = null;

  $("#login_bt").on("click", function(){
    auth.signInWithPopup(googleAuth);
  });

  $("#logout_bt").on("click", function(){
    auth.signOut();
  });

  auth.onAuthStateChanged(function(result){
    if(result) {
      user = result;
      var email = '<img src="'+result.photoURL+'" style="width:24px;border-radius:50%;"> '+result.email;
      $("#login_bt").hide();
      $("#logout_bt").show();
      $("#user_email").html(email);
    } else {
      user = null;
      $("#login_bt").show();
      $("#logout_bt").hide();
      $("#user_email").html('');
    }
    init();
  });
  
/** Database **/ 
function init() {
  $(".jbooks").empty();
  ref = db.ref("root/jbook");
  ref.on("child_added", onAdded);
}
function onAdded(data){
  var k = data.key;
  var v = data.val();
  var d = new Date(v.wdate);
  var month = ["1월","2월","3월","4월","5월","6월","7월","8월","9월","10월","11월","12월"];
  var date = String(d.getFullYear())+"년 "+month[d.getMonth()]+" "+String(d.getDate())+"일 "+zeroAdd(d.getHours())+":"+zeroAdd(d.getMinutes())+":"+zeroAdd(d.getSeconds());
  var icon = "";
  if(user){
    if(user.uid==v.uid) {
      icon += '<i onclick="onUpdate(this);" class="fas fa-edit"></i>';
      icon += '<i onclick="onDelete(this);" class="fas fa-trash"></i>';
    }
  }
  
  var html = '<ul id="'+k+'" data-uid="'+v.uid+'" class="jbook">';
  html += '<li>'+v.uname+' ('+v.email+') | '+date+'</li>';
  html += '<li>'+v.content+'</li>';
  html += '<li>'+icon+'</li>';
  html += '</ul>';
  $(".jbooks").prepend(html);
}

function zeroAdd(n) {
  if(n<10) return "0"+n;
  else return n;
}

$("#save_bt").on("click",function(){
  var $content = $("#content");
  if($content.val() == "") {
    alert("내용을 입력하세요");
    $content.focus();
  } else {
    ref = db.ref("root/jbook/");
    ref.push({
      email: user.email,
      uid: user.uid,
      uname: user.displayName,
      content: $content.val(),
      wdate: Date.now()
    }).key;
    $content.val('');
  }
})