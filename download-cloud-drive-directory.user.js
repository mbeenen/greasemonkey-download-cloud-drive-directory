// ==UserScript==
// @name download-cloud-drive-directory
// @description Provides a button to download all files (non-recursive) in a Cloud Drive directory
// @include https://www.amazon.com/clouddrive*
// @require https://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js
// ==/UserScript

if(unsafeWindow.console){
  var GM_log = unsafeWindow.console.log;
}

GM_log('script loaded');
var delayFactor = 100;

function mouseEvent(parent, type) {
  var evt = parent.ownerDocument.createEvent('MouseEvents');
  evt.initMouseEvent(type, true, true,
                     parent.ownerDocument.defaultView, 1, 0, 0, 0, 0, false, false, false,
                     false, 0, null);
  return parent.dispatchEvent(evt);
}

function click(parent) {
  return mouseEvent(parent, 'click');
}

function clickLink(target) {
  var notCanceled = click(target);
  if(target.tagName=="A" && notCanceled) window.location.href =
    target.href;
}

var downloadItem = function(checkbox, index) {
  GM_log('clicking ' + index);
  $(checkbox).trigger('click');
  setTimeout(function() {
    GM_log('clicking download button for ' + index);
    var downloadLink = document.getElementById("download_button");
    clickLink(downloadLink);
    //unsafeWindow.download(true);//$('#download_button').trigger('click');
  }, delayFactor * 4);
  setTimeout(function() {
    GM_log('unchecking ' + index);
    $(checkbox).trigger('click');
  }, delayFactor * 8);
  return false;
};

$(document).ready(function () {
  GM_log('document ready');
  $('<a href="https://www.amazon.com/clouddrive/#G=0&path=/Music/Arcade+Fire" id="d_dir" style="display: inline-block;">Download Dir<span> </span></a>')
    .addClass("action search_action folder_action ScndryBtnMed")
    .insertAfter('#more_actions_button');

  GM_log('button inserted');

  $('#d_dir').bind('click', function() {
    var total_file_count = $('.amazon_mp3_file').length;
    var i = 0;
    GM_log('total count is ' + total_file_count)
    GM_log('in click handler');
    $('#file_list_content input[type="checkbox"]').each(function() {
      GM_log('setting timeout for' + i++);
      var button = this;
      var count = i;
      setTimeout(function() {
        GM_log('count in inner function is' + count);
        downloadItem(button, count);
      }, delayFactor * 10 * (i-1));
    });
    // for (i = 0; i < total_file_count; i++) {
    //   var box = $('.amazon_mp3_file').get(i);
    //   GM_log('setting timeout for' + i);
    //   box.addClass('what!');
    //   //setTimeout(downloadItem(box, i), 10000 * (i + 1));
    // }
    return false;
  });
});
