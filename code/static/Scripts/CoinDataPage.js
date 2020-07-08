
// $.ajax({
//   url: "/_getCoinData",
//   dataType: 'jsonp',
//   success: function (data) {
//       console.log(data);
//   }
// });
$.getJSON("/_getCoinData", (data)=>{
    console.log(data);
});