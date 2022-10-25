/**
 * sustainability.js
 *
 * @requires
 * - jquery.js
 */
/* -------------------------------------------
 * @init
------------------------------------------- */
$(function() {
  'use strict';
  var u = new COMMON_ADD.Util();
  $.sustainability_news_entries();
});

/* -------------------------------------------
 * @functon
------------------------------------------- */

(function($){
  'use strict';
  var u = new COMMON_ADD.Util();

  //サステナビリティ_ニュース表示（JSON連携）
  $.sustainability_news_entries = function(config){
    // options
    var c = $.extend({
      factorElement: '.js-sustainability-news-entries',
    }, config);
    // vars
    var $elm = $(c.factorElement);
    // exit
    if ($elm.length === 0) { return false; }


    $.ajax({
      url:"/e/sustainability/news/js/sustainability.json",
      type:"GET",
      dataType:"json",
    }).done(function(data_idea) {
      lender_column(data_idea);
    }).fail(function() {
    });
    function lender_column(data){
      var result ="";
      var maxItem = 5;
      if(data.length < maxItem) {
        maxItem = data.length;
      }
      if(data.length >= 1) {
        for (  var i = 0;  i < maxItem;  i++  ) {
          var item = data[i];
          var target =  item.blank || item.pdf  ? 'target="_blank"' : '';
          var pdf_size = item.pdf && item.size !==""   ? '[PDF: '+item.size+']' : '';
          var item_year = item.date.replace(/(\d+)-(\d+)-(\d+)/,"$1");
          var item_month = item.date.replace(/(\d+)-(\d+)-(\d+)/,"$2");
          var arrayMonth = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December	'];
          var item_day = item.date.replace(/(\d+)-(\d+)-(\d+)/,"$3");
          var item_time = arrayMonth[item_month - 1] + " " + item_day + ", " + item_year;
          //リンクタイプ処理
          var link_icon = 'link';
          if(item.pdf && item.blank) {
            link_icon ="link link-pdf";
          } else if(item.blank) {
            link_icon ="link link-blank";
          }else if(item.url ==="") {
            link_icon = "";
          }
          //カテゴリ処理
          var category ="badge-cate_01";
          if(item.icon === "Information") {
            category ="badge-cate_02";
          } else if(item.icon === "Updates") {
            category ="badge-cate_03";
          }
          //整形
          result += '<div class="list__item" data-parts="news__elm">';
          result += '<article>';
          if(item.url !=="") {result += '<a href="'+item.url+'" class="btn" '+target+'>';}
          result += '<div class="news__detail media media-vertical-md" data-parts="media">';
          result += '<div class="news__property media__elm">';
          result += '<time datetime="'+item.date+'">'+item_time+'</time>';
          result += '<span class="badge '+category+'" data-parts="news__elm">'+item.icon+'</span>';
          result += '</div>';
          result += '<div class="news__ttl media__elm  '+link_icon+'">';
          result += '<h2><span>'+item.title+pdf_size+'</span></h2>';
          result += '</div>';
          result += '</div>';
          if(item.url !=="") {result += '</a>';}
          result += '</article>';
          result += '</div>';
        }
        result = '<div class="news__body" data-parts="news__elm"><div class="news__list">' + result + '</div></div>';
      }else {
        result = '<p class="news-undefind">該当のニュースはありません。</p>';
      }
      $elm.append(result);
    }

  }

})(jQuery);
