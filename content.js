/**
 * Copyright 2011 Zoee Silcock (zoeetrope.com)
 *
 * This file is part of Reddit Hover Text.
 *
 * Reddit Hover Text is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Reddit Hover Text is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Reddit Hover Text. If not, see <http://www.gnu.org/licenses/>.
 **/



 
/**
 * The timeout variable we use to delay showing and hiding of the hover div.
 **/
var hideTimeout;
var showTimeout;
/**
 * The url whose data we have in the hover div currently, it's used to avoid
 * asking for the same data several times in a row.
 **/
var lastUrl;
/**
 * The link_id whose data we have in the hover div currently, it's used to avoid
 * asking for the same data several times in a row.
 **/
var lastLink;

/**
 * This is where the magic starts as soon as the page has finished loading.
 * We go through all the anchor tags with the class title and check if they
 * are text based submissions and not url submissions. We add eventhandlers for
 * mouseenter and mouseleave to the text submissions.
 **/
var eventPosition = {
  commitMessagePosition : 'div.repository-content',
  commentMessagePosition : 'div.timeline-comment-group.js-minimizable-comment-group.js-targetable-comment'
};

var eventName = {
  mouseEnter : 'mouseenter',
  mouseLeave : 'mouseleave'
};

var selector = {
  commitMessageLink : 'a.message.js-navigation-open',
  commentMessageTopBox : 'h3.timeline-comment-header-text.f5.text-normal'
};


$(document).ready(function() {
  initHover();

  $(eventPosition.commitMessagePosition).on(eventName.mouseEnter , selector.commitMessageLink , handleCommitMessageMouseEnter);
  $(eventPosition.commitMessagePosition).on(eventName.mouseLeave , selector.commitMessageLink ,  handleMouseLeave);
  
  $(eventPosition.commentMessagePosition).on(eventName.mouseEnter , selector.commentMessageTopBox , handelCommentMessageMouseEnter);
  $(eventPosition.commentMessagePosition).on(eventName.mouseLeave , selector.commentMessageTopBox , handleMouseLeave);



  //$('div.unminimized-comment.comment.previewable-edit.js-task-list-container.js-comment.timeline-comment.reorderable-task-lists ').on('mouseenter', 'h3.timeline-comment-header-text.f5.text-normal', handelCommentMessageMouseEnter);

  //$('div.Box').on('mouseenter', 'a.link-gray-dark.v-align-middle.no-underline.h4.js-navigation-open', handleMouseEnter2);

});

/**
 * This function adds the floating div we use to display the content. We are
 * handling mouseenter and mouseleave events on it to avoid hiding the hover
 * when the user moves the mouse over it. This allows the user to press links
 * in the content.
 **/
function initHover() {
  $('body').append('<div id="sentiment-hover"></div>');
  $('#sentiment-hover').hide();

  $('#sentiment-hover').hover(function() {
    if(hideTimeout !== null) {
      // Don't hide the hover if the mouse enters the hover.
      clearTimeout(hideTimeout);
      hideTimeout = null;
    }
  }, handleMouseLeave);
}

/**
 * This is the event handler for mouseenter on the links. First we check to see
 * if there is a hideHover() pending, if so we will cancel it. Next we will
 * check if we need to request new data via ajax. Finally we show the hover
 * with a 250 ms delay to avoid unintended triggers.
 *
 * @argument {object} e The event object.
 **/
function handleCommitMessageMouseEnter(e) {
  var commit = getCommitInfo(e);
  var showDelay = 100;
  showTimeout = setTimeout(function() {
    showTimeout = null;
    populateHover(commit);
    positionHover($(e.target), e.pageX);
    showHover();
  }, showDelay);
};
function getCommitInfo(event){
  var commit = { type: 'commit' };
  Object.keys(event.target.attributes).forEach(element => {
    if(event.target.attributes[element].name === 'aria-label') commit.message = event.target.attributes[element].value;
    else if (event.target.attributes[element].name === 'href') commit.id = event.target.attributes[element].value;
    else if (event.target.attributes[element].name === 'class') commit.class = event.target.attributes[element].value;
  });
  return commit;
};



function handelCommentMessageMouseEnter(e){
  var comment = getCommentInfo(e.currentTarget);
  var showDelay = 100;
  showTimeout = setTimeout(function() {
    showTimeout = null;
    populateHover(comment);
    positionHover($(e.target), e.pageX);
    showHover();
  }, showDelay);
};




var ancor = /<a [^>]+>(.*?)<\/a>/g ;
var code = /<code>(.*?)<\/code>/g ;
var space = /\s\s+/g ;
var bracket = /[{()}":\[\]]+/g ;
var tag = /<(g-emoji|\/g-emoji|strong|\/strong|em|\/em|p|\/p|li|\/li|ol|\/ol|ul|\/ul|span|\/span|svg|\/svg|input|br\s*\/?)[^>]*>/g;

//var slashWord = /\s(.+)[\/.+)]+/g;




function getCommentInfo(event){
  var comment = { type : 'comment',
                  message : ''
                };
  var elementList  = event.offsetParent.children[1].children[0].children[0].children[0].children[0].children[0].children;
  Object.keys(elementList).forEach(element=>{
    if(elementList[element].nodeName === 'P' ) comment.message += getInnerHTMlFromElement(elementList[element]);
    else if(elementList[element].nodeName === 'OL' || elementList[element].nodeName === 'UL' || elementList[element].nodeName === 'BLOCKQUOTE' ) comment.message += getTextFromList(elementList[element].children);
    comment.message += '\n';
  });

  var mes = comment.message.replace(ancor,'');
  var mes = mes.replace(code,'');
  //console.log(mes);
  var mes = mes.replace(tag,'');
  var mes = mes.replace(bracket,'');
  var mes = mes.replace(space,' ');
  console.log(mes);
  comment.message = mes;

  return comment;

  //var mes = mes.replace(slashWord,'');
  //console.log(mes);
};


// function getTextFromBlockquote(blockquoteList){
//   var text = '';
//   Object.keys(blockquoteList).forEach(item=>{
//     if(blockquoteList[item].nodeName === 'P') text += getInnerHTMlFromElement(blockquoteList[item]);
//     else if(blockquoteList[item].nodeName === 'blockquote' ) text += getTextFromBlockquote(blockquoteList[item].children);
//     text += '\n';
//   });
//   return text;
// };

function getTextFromList(list){
  var text = '';
  Object.keys(list).forEach( item => {
    if( list[item].nodeName === 'P' ) text += getInnerHTMlFromElement(list[item]);
    else if( list[item].nodeName === 'OL' || list[item].nodeName === 'UL' || list[item].nodeName === 'BLOCKQUOTE') text += getTextFromList(list[item].children);
    else if( list[item].nodeName === 'LI' ) text += getInnerHTMlFromElement(list[item]);
    text += '\n';
  });
  return text;
};


function getInnerHTMlFromElement(element){
  return element.innerHTML;
};



// function handleMouseEnter2(e) {
//   var thingElement = e.currentTarget;

//   var list = thingElement.offsetParent.children[1].children[0].children[0].children[0].children[0].children[0].children;

// for(var i=0;i<list.length;i++){
//   console.log(list[i].nodeName);
// }



  // setTimeout(function(){ 

  //   var x = document.getElementsByClassName("Popover-message Popover-message--large Box box-shadow-large Popover-message--bottom-left");
  //   var y = x[0].children[0].children[0] ;

  //   var para = document.createElement("P");
  //   para.innerText = "new text added";
  //   y.appendChild(para);

  // }, 500)



   







  
  
  // extract commit message
  
    // var commitMessage = e.target.event.target.attributes[0].value;
    // var commitId = e.target.event.target.attributes[3].value;
  
    // console.log(commitMessage);
    // console.log(commitId);
  
    // calculate the sentiment of the commit message
  
    // var showDelay = 250;
    // showTimeout = setTimeout(function() {
    //   showTimeout = null;
    //   populateHover(commitMessage);
    //   positionHover($(e.target));
    //   showHover();
    // }, showDelay);
  
  //  var thingElement = $(e.target).closest('.thing');
  
  //   var linkId = $(thingElement).data('fullname');
  //   var url = $(e.target).attr('href');
  //   var showDelay = 250;
  //   var regex = new RegExp('/r/.*/comments');
  
  //   if (regex.exec(url) !== null &&
  //       $(e.target).closest('.entry').find('.expando-button.selftext').length === 1) {
  //     if (hideTimeout !== null && lastLink !== linkId) {
  //       clearTimeout(hideTimeout);
  //       hideTimeout = null;
  //       showDelay = 0;
  //     }
  
  //     showTimeout = setTimeout(function() {
  //       showTimeout = null;
  //       if (lastLink !== linkId) {
  //         lastUrl = getRedditUrl() + url;
  //         populateHover(linkId);
  //       }
  
  //       positionHover($(e.target));
  //       showHover();
  //     }, showDelay);
  //   }
  //}

/**
 * This is the event handler for mouseleave both on links and on the actual
 * hover div. We use a 250 ms timeout which allows the user to move from the
 * link to the hover and back without hiding the hover.
 *
 * @argument {object} e The event object.
 **/
function handleMouseLeave(e) {
  if(showTimeout !== null) {
    clearTimeout(showTimeout);
    showTimeout = null;
  } else {
    hideTimeout = setTimeout(function() {
      hideTimeout = null;
      hideHover();
    }, 250);
  }
}

/**
 * This function positions the hover div based on the location of the link
 * it is attached to.
 *
 * @argument {object} element The element used to decide the placement of the
 * hover div.
 **/
function positionHover(element, x) {
  var position = $(element).offset();
  $('#sentiment-hover').css('left', x);
  $('#sentiment-hover').css('top', position.top + $(element).height() + 2);
  // $('#sentiment-hover').css('left', position.left);
  // $('#sentiment-hover').css('top', position.top + $(element).height() + 2);
}

function createHoverDiv(content){
  var mainDiv = document.createElement("div");
  var titleParagraph = document.createElement("p");
  var horizontalLine = document.createElement("hr");
  var textParagraph = document.createElement("p");

  titleParagraph.className = 'text-title';
  titleParagraph.innerText = "Sentiment value : "+content.value;
  mainDiv.appendChild(titleParagraph);

  if(content.type === 'commit'){
    horizontalLine.className = 'horizontal-line';
    mainDiv.appendChild(horizontalLine);

    textParagraph.className = 'text-content';
    textParagraph.innerText = content.text;
    mainDiv.appendChild(textParagraph);
  }
  return mainDiv;
};

/**
 * This is where we actually put content into the hover div. We start by
 * placing our loading gif so the user knows that we are retreiving the data.
 * Next we trigger an ajax call to the link and extract the selftext_html
 * from the JSON result.
 *
 * @argument {string} linkId The id of the link to fetch.
 **/
function populateHover(input) {
  chrome.runtime.sendMessage( { data : input } , function(response) {
    var result = response.data;
    var div = createHoverDiv(result);
    $('#sentiment-hover').html(div);
  });
}

/**
 * This shows the hover div, it's in a separate function in case we decide to
 * put an animation on it later.
 **/
function showHover() {
  $('#sentiment-hover').show();
}

/**
 * This hides the hover div, it's in a separate function in case we decide to
 * put an animation on it later.
 **/
function hideHover() {
  $('#sentiment-hover').hide();
}

/**
 * We use this to build our reddit URLs. This avoids making cross origin
 * requests when fetching from the API and marks the correct URL as
 * visited when that option is enabled.
 */
// function getRedditUrl() {
//   return window.location.origin;
// }

// function getLoadingImage() {
//   if ($('body.res-nightmode').length) {
//     return "ajax-loader-night.gif";
//   } else {
//     return "ajax-loader.gif";
//   }
// }

// function getOptionsDiv() {
//   var div = $('<div class="optionsDiv"></div>');
//   var markAsVisited = $('<a href="#">Mark as visited</a>');
//   var visitedHelp = $('<span>(Click to toggle marking links as visited.)</span>');

//   if(!markAsVisitedEnabled()) {
//     markAsVisited.addClass('enableisited');
//   } else {
//     markAsVisited.addClass('disableVisited');
//   }

//   $(markAsVisited).bind('click', function(event) {
//     event.preventDefault();
//     toggleMarkAsVisited();

//     if(!markAsVisitedEnabled()) {
//       $(this).addClass('enableVisited');
//       $(this).removeClass('disableVisited');
//     } else {
//       $(this).addClass('disableVisited');
//       $(this).removeClass('enableVisited');

//       chrome.extension.sendRequest({action: 'addUrlToHistory', url: lastUrl});
//     }
//   });

//   $(markAsVisited).bind('mouseenter', {help: visitedHelp}, function(event) {
//     $(event.data.help).show();
//   });
//   $(markAsVisited).bind('mouseleave', {help: visitedHelp}, function(event) {
//     $(event.data.help).hide();
//   });

//   $(div).prepend(visitedHelp);
//   $(visitedHelp).hide();
//   $(div).prepend(markAsVisited);

//   return div;
// }

// function toggleMarkAsVisited() {
//   if(markAsVisitedEnabled()) {
//     localStorage.setelement('markAsVisited', false);
//   } else {
//     localStorage.setelement('markAsVisited', true);
//   }
// }

// function markAsVisitedEnabled() {
//   return localStorage.getelement('markAsVisited') === 'true';
// }

// /**
//  * A helper function for translating html entities into their real characters
//  * since we are using the html markup that reddit provides to format the data
//  * in the hover div.
//  *
//  * @argument {string} str The input string.
//  **/
// function html_entity_decode(str) {
//   return $('<textarea />').html(str).text();
// }
