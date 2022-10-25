/**
 * COMMON_ADD_add.js
 *
 * @namespace
 * @constructor
 * @module
 * @execution
 * @requires
 * - jquery.js
 */

/**
 * @namespace COMMON_ADD
 */
var COMMON_ADD = COMMON_ADD || {};


/**
 * @constructor Util
 */
COMMON_ADD.Util = function(){
  'use strict';
  this.$win = $(window);
  this.$doc = $(document);
  this.ua = navigator.userAgent.toLowerCase();
  this.ver = window.navigator.appVersion.toLowerCase();
  this.url = location.href;
  this.path = location.pathname.replace('index.html', '');
  this.dir = this.path.split('/');
  this.view = 1260;
  this.breakPoint1 = 767;
  this.state = {
    current: 'is-current',
    open: 'is-open',
    active: 'is-active',
    fixed: 'is-fixed',
    disabled: 'is-disabled',
    selected: 'is-selected'
  };
};

COMMON_ADD.Util.prototype = {
  /**
   * @method isRangeSP
   * @return {Boolean}
   */
  isRangeSP: function(){
    'use strict';
    var clientW = document.documentElement.clientWidth,
        winW = window.innerWidth ? window.innerWidth : (this.$win.width() ? this.$win.width() : clientW);
    return (winW <= this.breakPoint1) ? true : false;
  },
  /**
   * @method isRangePC
   * @return {Boolean}
   */
  isRangePC: function(){
    'use strict';
    var clientW = document.documentElement.clientWidth,
        winW = window.innerWidth ? window.innerWidth : (this.$win.width() ? this.$win.width() : clientW);
    return (this.breakPoint1 < winW) ? true : false;
  },
  /**
   * @method deviceChecker
   * @return {String}
   */
  deviceChecker: function(){
    'use strict';
    if(this.ua.indexOf('iphone') !== -1) { return 'iphone'; }
    else if(this.ua.indexOf('ipod') !== -1) { return 'ipod'; }
    else if(this.ua.indexOf('ipad') !== -1) { return 'ipad'; }
    else if(this.ua.indexOf('android') !== -1 && this.ua.indexOf('mobile') !== -1) { return 'android mobile'; }
    else if(this.ua.indexOf('android') !== -1 && this.ua.indexOf('mobile') === -1) { return 'android tablet'; }
    else if(this.ua.indexOf('windows phone') !== -1) { return 'windows phone'; }
    else { return 'desktop'; }
  },
  /**
   * @method isMobile
   * @return {Boolean}
   */
  isMobile: function(){
    'use strict';
    return (this.deviceChecker() === 'iphone' || this.deviceChecker() === 'ipod' || this.deviceChecker() === 'android mobile' || this.deviceChecker() === 'windows phone') ? true : false;
  },
  /**
   * @method isTablet
   * @return {Boolean}
   */
  isTablet: function(){
    'use strict';
    return (this.deviceChecker() === 'ipad' || this.deviceChecker() === 'android tablet') ? true : false;
  },
  /**
   * @method isDesktop
   * @return {Boolean}
   */
  isDesktop: function(){
    'use strict';
    return (!this.isMobile() && !this.isTablet()) ? true : false;
  },
  /**
   * @method isBrowser
   * @param {String}
   * @return {Boolean}
   */
  isBrowser: function(_browser){
    'use strict';
    var browser = ['chrome', 'safari', 'firefox', 'edge', 'ie11'],
        browser_old = ['ie8', 'ie9', 'ie10'];
    switch(_browser){
      case browser[0]: return(this.ua.indexOf('chrome')  !== -1 && this.ua.indexOf('edge') === -1) ? true : false;
      case browser[1]: return(this.ua.indexOf('safari')  !== -1 && this.ua.indexOf('chrome') === -1) ? true : false;
      case browser[2]: return(this.ua.indexOf('firefox') !== -1) ? true : false;
      case browser[3]: return(this.ua.indexOf('edge') !== -1) ? true : false;
      case browser[4]: return((this.ua.indexOf('rv 11') !== -1 || this.ua.indexOf('rv:11') !== -1) && (this.ua.indexOf('trident') !== -1)) ? true : false;
      case browser_old[0]: return (this.ver.indexOf('msie 8') !== -1) ? true : false;
      case browser_old[1]: return (this.ver.indexOf('msie 9') !== -1) ? true : false;
      case browser_old[2]: return (this.ver.indexOf('msie 10') !== -1) ? true : false;
      default: return false;
    }
  },
  /**
   * @method isFontSizeWatch
   * @param {function}
   * @return {Boolean}
   */
  isFontSizeWatch: function(callback){
    'use strict';
    var $elm,
        $body = $('body'),
        watchName = 'js-fontSizeWatch',
        currentH = 0,
        interval = 500,
        HTML_FS_WATCH = $('<div class="' + watchName + '">&nbsp;</div>'),
        CSS_FS_WATCH = { position: 'absolute', top: '0', display: 'block', padding: '0', visibility: 'hidden' };
    // 監視用HTMLを生成する
    if(!$('.' + watchName).length){
      HTML_FS_WATCH.css(CSS_FS_WATCH).appendTo($body);
    }
    $elm = $('.' + watchName);
    // 要素の高さを取得
    var getHeight = function($elm){ return $elm.height(); };
    // 要素の高さを比較して、異なればcallbackを実行
    var watching = function(){
      var h = getHeight($elm);
      if(h === currentH){
        return false;
      } else {
        currentH = h;
        callback();
      }
    };
    setInterval(watching, interval);
  },
  /**
   * @method isWindowSizeWatch
   * @param {function}
   * @return {Boolean}
   */
  isWindowSizeWatch: function(callback){
    'use strict';
    var resize = false,
        interval = 500;
    this.$win.on('resize', function(){
      // リサイズされている間は何もしない
      if(resize !== false){ clearTimeout(resize); }
      resize = setTimeout(function(){
        callback();
      }, interval);
    });
  }
};


/**
 * @module
 */
COMMON_ADD.module = function(){
  'use strict';
  var u = new COMMON_ADD.Util();
  return {
    /**
     * @method initialize
     * - 初期化
     */
    initialize: function(){
      this.filterNewsEntries();
      this.listTitleAlign();
      this.blankLinkModal();
    },
    /**
     * @method filterNewsEntries
     * - ニュース一覧の絞り込み制御
     */
    filterNewsEntries: function(config){
      // options
      var c = $.extend({
        factorElement: '.js-filter-news-entries',
        displayElement: '.js-filter-news-entries_display',
        articleElement: '.js-filter-news-entries_article',
        filterYearElement: '.js-filter-news-entries_year',
        filterCategoryElement: '.js-filter-news-entries_category',
        filterTriggerElement: '.js-filter-news-entries_trigger',
        notfoundElement: '.js-filter-news-entries_notfound'
      }, config);
      // vars
      var $elm = $(c.factorElement),
          $display = $(c.displayElement),
          $article = $(c.articleElement),
          $selectYear = $(c.filterYearElement),
          $selectCategory = $(c.filterCategoryElement),
          $trigger = $(c.filterTriggerElement),
          dataYear = 'data-filter-year',
          dataCategory = 'data-filter-category',
          paramKey = {
            year: 'yearselect',
            category: 'category'
          },
          _params = {},
          paramValYear = '',
          paramValCategory = '',
          active = u.state.active,
          notfoundText = '<p class="lead text-center js-filter-news-entries_notfound">No items found.</p>',
          speed = 500,
          maxLength = 20;
      // exit
      if($elm.length === 0){ return false; }
      $display.prepend(notfoundText);
      $(c.notfoundElement).stop().hide();
      // function：クエリ設定
      var querySetting = function(){
        var query = location.search;
        _params = {};
        if(query !== ''){
          var _querys = query.split('?')[1].split('&');
          for(var i=0; i<_querys.length; i++){
            var key = _querys[i].split("=");
            _params[key[0]] = key[1];

            if(_querys[i].indexOf(paramKey.year + '=') !== -1){
              paramValYear = _querys[i].split(paramKey.year + '=')[1];
            }
            if(_querys[i].indexOf(paramKey.category + '=') !== -1){
              paramValCategory = _querys[i].split(paramKey.category + '=')[1];
            }
          }
        }
      };

      // function：表示記事設定
      var articleSetting = function(){
        var count = 0;
        $article.each(function(i){
          var $self = $(this),
              thisYear = $self.attr(dataYear),
              thisCategory = $self.attr(dataCategory);

          //年とカテゴリが指定されている場合
          if(paramValYear !== '' && paramValCategory !== '') {
            if(thisYear === paramValYear && thisCategory === paramValCategory) {
              $self.stop().fadeIn(speed).addClass(active);
            }
          }
          //年のみ指定されている場合
          if(paramValYear !== '' && paramValCategory === '') {
            if(thisYear === paramValYear) {
              $self.stop().fadeIn(speed).addClass(active);
            }
          }
          //カテゴリのみ指定されている場合
          if(paramValYear === '' && paramValCategory !== '') {
            if(thisCategory === paramValCategory) {
              if(count <= maxLength - 1) {
                count++;
                $self.stop().fadeIn(speed).addClass(active);
              } else {
                return false;
              }
            }
          }
          //年とカテゴリが指定されていない場合
          if(paramValYear === '' && paramValCategory === '') {
            if(i <= maxLength - 1) {
              $self.stop().fadeIn(speed).addClass(active);
            } else {
              return false;
            }
          }
        });
        //記事が0件の場合
        if($display.find('.'+active).length === 0) {
          $(c.notfoundElement).stop().show();
        }
      };

      // setting：表示設定
      $article.stop().hide().removeClass(active);
      querySetting();
      if(paramValYear !== '') {
        $selectYear.val(paramValYear);
      }
      if(paramValCategory !== '') {
        $selectCategory.val(paramValCategory);
      }
      articleSetting();

      //control：検索ボタンクリック
      $trigger.on('click', function(){
        var yearVal = $selectYear.val(),
            categoryVal = $selectCategory.val();
        //変化がない場合は何もしない
        if(paramValYear === yearVal && paramValCategory === categoryVal) {
          return false;
        }
        //変化があった場合
        else {
          var _replaceParams = [],
              replaceUrl = '';

          querySetting();
          _params[paramKey.year] = yearVal;
          _params[paramKey.category] = categoryVal;

          //クエリパラメータの形に成形
          Object.keys(_params).forEach( function(value) {
            if(this[value] === "") {
              return true;
            }
            if(!this[value]) {
              _replaceParams.push(value);
            } else {
              _replaceParams.push(value + '=' + this[value]);
            }
          }, _params);
          if(_replaceParams.length > 0) {
            replaceUrl = '?' + _replaceParams.join('&');
          } else {
            replaceUrl = '?';
          }

          //urlを変更
          history.pushState('','',replaceUrl);

          //記事の表示非表示制御
          $article.stop().hide().removeClass(active);
          $(c.notfoundElement).stop().hide();
          paramValYear = yearVal,
          paramValCategory = categoryVal,
          articleSetting();
        }
      });
    },
    /**
     * @method listTitleAlign
     * - リストタイトル揃え
     */
    listTitleAlign: function(){
      // vars
      var $elm = $('.js-list-title-align'),
          $list = $elm.children('li'),
          $label = $('.js-list-title-align_label'),
          length = [];
      // exit
      if($elm.length === 0){ return false; }
      
      // setting
      $label.each(function(){
        var thisLen = $(this).text().length;
        length.push(thisLen);
      });
      
      var maxLen = Math.max.apply(null,length);
      $list.css('padding-left', maxLen + 1 + 'em');
    },
    /**
     * @method blankLinkModal
     * - 外部リンク用モーダル
     */
    blankLinkModal: function(config){
      // options
      var c = $.extend({
        factorElement: 'js-blank-link-modal',
        contentElement: 'js-blank-link-modal_content',
        closeElement: 'js-blank-link-modal_close',
        TextElementJ: 'js-blank-link-modal_text_j',
        TextElementE: 'js-blank-link-modal_text_e',
        linkElement: 'js-blank-link-modal_href',
        escapeElement: 'js-esc-blank-link-modal',
      }, config);
      // vars
        var elm = '.' + c.factorElement,
            content = '.' + c.contentElement,
            close = '.' + c.closeElement,
            textJ = '.' + c.TextElementJ,
            textE = '.' + c.TextElementE,
            link = '.' + c.linkElement,
            $trigger = $('a, area').not('a[href="#"], area[href="#"], [href^="#tab"], [href^="#modal"], .' + c.escapeElement),
            $body = $('body'),
            modalOpenClass = 'modal-open',
            activeClass = u.state.active,
            modalAclass = 'modal-a',
            modalBclass = 'modal-b',
            modalListA,
            modalListB;
      // exit
      if($trigger.length === 0){ return false; }
      // setting：表示設定
      $.ajax({
        type: 'GET',
        url: '/js/custom/blank_link_list.json',
        dataType: 'json',
      }).done(function(data) {
        modalListA = data.modalListA,
        modalListB = data.modalListB;
        
        $trigger.each(function(){
          var $this = $(this),
              thisHref = $this.attr('href');
          $.each(modalListA,function(i,v){
            // タイプAリンクリストに一致
            if(0 <= thisHref.indexOf(v)){
              $this.addClass(modalAclass);
            }
          });
          $.each(modalListB,function(i,v){
            // タイプAリンクリストに一致
            if(0 <= thisHref.indexOf(v)){
              $this.addClass(modalBclass);
            }
          });
        });
      }).fail(function() {
      });
      
      var MODALHTML = '<div class="blank-link-modal '+c.factorElement+'">'+
            '<div class="modal__content '+c.contentElement+'">'+
              '<div class="modal__header"><button class="close '+c.closeElement+'" type="button" aria-label="閉じる"><span aria-hidden="true">&times;</span></button></div>'+
              '<div class="modal__body" data-parts="modal__elm">'+
                '<p class="text-center '+c.TextElementJ+'" data-parts="typography"></p>'+
                '<p class="text-center '+c.TextElementE+'" data-parts="typography"></p>'+
                '<div class="row justify-content-center">'+
                  '<div class="col-12 col-md-6">'+
                    '<a href="#" target="_blank" rel="noopener" class="btn btn-primary link link-blank '+c.linkElement+' '+c.closeElement+'" data-parts="buttons"><span class="btn__label">はい　/　O.K.</span></a>'+
                  '</div>'+
                '</div>'+
                '<div class="row justify-content-center">'+
                  '<div class="col-12 col-md-6">'+
                    '<a href="javascript:void(0);" class="btn btn-outline-primary link '+c.closeElement+'" data-parts="buttons"><span class="btn__label">いいえ　/　Cancel</span></a>'+
                  '</div>'+
                '</div>'+
              '</div>'+
            '</div>'+
          '</div>';
      $body.append(MODALHTML);
      
      // function
      function modalAlert(_modalClass,_href){
        var htmlJ,
            htmlE;
        if(_modalClass === 'modal-a') {
          htmlJ = '田辺三菱製薬のサイトを離れます。<br class="pc-hidden">よろしいですか？<br>（別ウィンドウが開きます）';
          htmlE = 'You are leaving the Mitsubishi Tanabe Pharma’s website.<br>(A new window will be opened.)';
        } else if(_modalClass === 'modal-b') {
          htmlJ = '関連会社のサイトに移動します。<br class="pc-hidden">よろしいですか？<br>（別ウィンドウが開きます）';
          htmlE = 'You are moving to the website of a group company.<br>(A new window will be opened.)';
        }
        
        $(textJ).html(htmlJ);
        $(textE).html(htmlE);
        $(link).attr('href',_href);
        $(elm).stop().addClass(activeClass);
        $body.stop().addClass(modalOpenClass);
        
        $(close).on('click', function() {
          $(elm).stop().removeClass(activeClass);
          $body.stop().removeClass(modalOpenClass);
        });
        $(document).on('click', function(e) {
          if(!$(e.target).closest(content).length) {
            $(elm).stop().removeClass(activeClass);
            $body.stop().removeClass(modalOpenClass);
          }
        });
      }
      
      $trigger.on('click', function(){
        var thisHref = $(this).attr('href');
        if ($(this).hasClass(modalAclass)) {
          modalAlert(modalAclass,thisHref);
          return false;
        }
        if ($(this).hasClass(modalBclass)) {
          modalAlert(modalBclass,thisHref);
          return false;
        }
      });
      
    }
  };
}();


/**
 * @execution
 */
$(function(){
  'use strict';
  // onReady
  COMMON_ADD.module.initialize();
  
});

$(window).on('load', function(){
  'use strict';
  // onLoad
});