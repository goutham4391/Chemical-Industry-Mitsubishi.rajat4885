/*メインビジュアル
----------------------------------------------*/
function top_mv(){
  var $elm = $('.js-top-mv-slider'),
    $append = $('.top-mv-utils'),
    bp1 = 768,
    btnElm = '.carousel-btn',
    btnClass = 'paused';

  // exit
  if($elm.length === 0){ return false; }

  $elm.slick({
    arrows: false,
    dots: true,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 5000,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    centerMode:false,
    dotsClass:"slick-dots",
    appendDots:$append,
    appendArrows:$append,
    responsive: [
      {
        breakpoint: bp1,
        settings: {
          arrows:true,
          slidesToShow: 1,
        }
      }
    ]
  });

  //再生ボタン
  $append.find(btnElm).on('click', function () {
    if ($(this).hasClass(btnClass)) {
      $(this).removeClass(btnClass);
      $elm.slick('slickPause');
    } else {
      $(this).addClass(btnClass);
      $elm.slick('slickPlay');
    }
  });

  //ページャ
  $append.find('.js-slick-prev').on('click', function(){
    $elm.slick('slickPrev');
  });
  $append.find('.js-slick-next').on('click', function(){
    $elm.slick('slickNext');
  });

}


/*NEWSのJSON出力
----------------------------------------------*/
function top_news(){
  var $elm = $('.js-top-news-entries');
  if($elm.length === 0){ return false; }
  $.ajax({
    url:"/e/news/js/top.json",
    type:"GET",
    dataType:"json",
  }).done(function(data_idea) {
    lender_column(data_idea);
  }).fail(function() {
  });
  function lender_column(data){
    var result ="";
    var maxItem = 7;
    if(data.length >= 1) {
      for (  var i = 0;  i < maxItem;  i++  ) {
        const month_en_list = ['January','February','March','April','May','June','July','August','September','October','November','December']
        var item = data[i];
        var target =  item.blank || item.pdf  ? 'target="_blank"' : '';
        var pdf_size = item.pdf && item.size !==""   ? '[PDF: '+item.size+']' : '';
        var item_year = item.date.replace(/(\d+)-(\d+)-(\d+)/,"$1");
        var month = item.date.replace(/(\d+)-(\d+)-(\d+)/,"$2");
        var item_month = month_en_list[month - 1];
        var item_day = item.date.replace(/(\d+)-(\d+)-(\d+)/,"$3");
        var item_time = item_month + " " + item_day + ", " + item_year;
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
      result = '<div class="top-news-list news__body" data-parts="news__elm"><div class="news__list">' + result + '</div></div>';
    }else {
      result = '<p class="top-news-undefind">No items found.</p>';
    }
    $elm.append(result);
  }
}

//init
$(function(){
  top_mv();
  top_news();
});
