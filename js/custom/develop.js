/**
 * develop.js
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
  $.pipeline();
  $.develop_news_entries();
});

/* -------------------------------------------
 * @functon
------------------------------------------- */

(function($){
  'use strict';
  var u = new COMMON_ADD.Util();

  $.pipeline = function(config){
    // options
    var c = $.extend({
      factorElement: '.js-filter-developments',
      factorChild: '.pipeline-body__item',
      factorChild_accordion: '.pipeline-body__item--toggle',
      checkbox: '.js-filter-category',
      alertClass: '.pipeline-alert',
      openAll:".js-pipeline-openAll",
      toggleTarget:".pipeline-body__hidden",
      activeClassName:"is-active",
      notFound:".js-pipeline-notfound",
      tabs:".js-pipeline-tabs",
      tabs_detail:".pipeline-tabs__detail",
      tabs_trigger:".pipeline-tabs__trigger",
    }, config);
    // vars
    var $elm = $(c.factorElement);
    var $checkbox = $(c.checkbox);
    // exit
    if ($elm.length === 0) { return false; }

    //タブ切り替え
    $(".pipeline-tabs__trigger",c.tabs).click(function(){
      var $trigger = $(c.tabs_trigger);
      var $detail = $(c.tabs_detail);
      var index = $trigger.index($(this));
      $trigger.add($detail).removeClass(c.activeClassName);
      $(this).add($detail.eq(index)).addClass(c.activeClassName);
    });

    // setting
    pipeline_filter($(c.factorElement));

    //【F02】チェックボックスの変更処理
    $checkbox.on('change', function() {
      var $factorElement = $(this).parents(c.factorElement);
      var current_val = $(this).filter(":checked").val();
      if(current_val === "all") {
        $checkbox.not($(this)).prop('checked',false);
      }else if(current_val) {
        $checkbox.filter("#all").prop('checked',false);
      }
      pipeline_filter($factorElement);
    });

    //【F03】開発状況の絞り込み処理
    function pipeline_filter($factorElement){
      var $elm = $factorElement.filter(":visible").find(c.factorChild);
      var $alert = $factorElement.find(c.alertClass);
      visiblebox_close($factorElement,0);
      $elm.stop().hide();
      $alert.stop().hide();
      var category = [];
      $factorElement.find(c.checkbox).filter(":checked").each(function(){
        category.push( $(this).val() );
      });
      if(_.contains(category,"all")) {//allを選択
        $elm.stop().fadeIn(500);
        if($elm.filter(":visible").length === 0){$alert.filter(c.notFound).stop().fadeIn(500);}
      }else if(category.length > 0 ) {//all以外を選択
        $elm.each(function(){
          var elmCat = $(this).attr("data-filter-category");
          if( _.contains(category,elmCat) ){
            $(this).stop().fadeIn(500);
          }
        });
        if($elm.filter(":visible").length === 0){$alert.filter(c.notFound).stop().fadeIn(500);}
      } else {//選択無し
        $alert.filter(".js-pipeline-ready").stop().fadeIn(500);
      }
    }

    //【F04】開発状況詳細 開閉処理
    $(c.factorChild).click(function(){
      var $factorElement = $(this).parents(c.factorElement);
      $(this).toggleClass(c.activeClassName).find(c.toggleTarget).toggleClass(c.activeClassName).slideToggle(500);
      allBtn_control($factorElement);
    });

    //【F05】「すべて開く/閉じる」ボタンの状態制御
    function allBtn_control($factorElement) {
      var $elm = $factorElement.find(c.factorChild_accordion).filter(".is-active");
      var elmCount = $elm.length;
      var openCount = $elm.find(c.toggleTarget).filter(".is-active").length;
      if( elmCount === openCount && elmCount > 0 ){
        //【F05-1】
        $factorElement.find(c.openAll).addClass("is-active").find(".btn__label").text("Close");
      }else {
        //【F05-2】
        $factorElement.find(c.openAll).removeClass("is-active").find(".btn__label").text("Open");
      }
    }

    //【F06】開発状況詳細 開閉処理（すべて開く/閉じる）
    $(c.openAll).on("click",function(){
      var $factorElement = $(this).parents(c.factorElement);
      if( $(this).hasClass(c.activeClassName) ) {
        visiblebox_close($factorElement,500);
      }else {
        visiblebox_open($factorElement,500);
      }
    });

    //【F06-1】現在可視状態のアコーディオンをすべて開く
    function visiblebox_open($factorElement,speed) {
      var $switch = $factorElement.find(c.openAll);
      var $target_block = $factorElement.find(c.factorChild_accordion).filter(":visible");
      var $target_box = $target_block.find(c.toggleTarget);
      $switch.add($target_block).add($target_box).addClass(c.activeClassName);
      $target_box.slideDown(speed);
      allBtn_control($factorElement);
    }

    //【F06-2】現在可視状態のアコーディオンをすべて閉じる
    function visiblebox_close($factorElement,speed) {
      var $switch = $factorElement.find(c.openAll);
      var $target_block = $factorElement.find(c.factorChild_accordion).filter(":visible");
      var $target_box = $target_block.find(c.toggleTarget);
      $switch.add($target_block).add($target_box).removeClass(c.activeClassName);
      $target_box.slideUp(speed);
      allBtn_control($factorElement);
    }

  };

  //研究開発_ニュース表示（JSON連携）
  $.develop_news_entries = function(config){
    // options
    var c = $.extend({
      factorElement: '.js-develop-news-entries',
    }, config);
    // vars
    var $elm = $(c.factorElement);
    // exit
    if ($elm.length === 0) { return false; }


    $.ajax({
      url:"/e/news/js/develop.json",
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
          var arrayMonth = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December	']
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
        result = '<p class="news-undefind">No items found.</p>';
      }
      $elm.append(result);
    }

  }

})(jQuery);
