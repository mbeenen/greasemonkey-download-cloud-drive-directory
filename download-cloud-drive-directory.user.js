// ==UserScript==
// @name download-cloud-drive-directory
// @description Provides a button to download all files (non-recursive) in a Cloud Drive directory
// @include https://www.amazon.com/clouddrive*
// @require https://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js
// ==/UserScript

if(unsafeWindow.console){
    var GM_log = unsafeWindow.console.log;
}

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
  $(checkbox).trigger('click');
  setTimeout(function() {
    var downloadLink = document.getElementById("download_button");
    clickLink(downloadLink);
  }, delayFactor * 4);
  setTimeout(function() {
    $(checkbox).trigger('click');
  }, delayFactor * 8);
  return false;
};

$(document).ready(function () {
  $('<a href="#" style="display: inline-block;" id="d_dir">Download Dir<span> </span></a>')
    .addClass("action search_action folder_action ScndryBtnMed")
    .insertAfter('#more_actions_button');

  $('#d_dir').bind('click', function() {
    var total_file_count = $('.amazon_mp3_file').length;
    var i = 0;
    $('#file_list_content input[type="checkbox"]').each(function() {
      var button = this;
      var count = i;
      setTimeout(function() {
        downloadItem(button, count);
      }, delayFactor * 10 * (i-1));
    });
    return false;
  });
});
