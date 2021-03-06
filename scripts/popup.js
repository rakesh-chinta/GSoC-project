
function save_now_function(){
	var wb_url = "https://web.archive.org/save/";
	chrome.runtime.sendMessage({message: "openurl", wayback_url: wb_url, method:'save' }, function(response) {
	});
}

function recent_capture_function(){
	var wb_url = "https://web.archive.org/web/2/";
	chrome.runtime.sendMessage({message: "openurl", wayback_url: wb_url, method:'recent' }, function(response) {
	});
}

function first_capture_function(){
	var wb_url = "https://web.archive.org/web/0/";
	chrome.runtime.sendMessage({message: "openurl", wayback_url: wb_url, method:'first' }, function(response) {
	});
}

function view_all_function(){
	var pattern = /https:\/\/web\.archive\.org\/web\/(.+?)\//g;
	url = document.location.href.replace(pattern, "");
	open_url = "https://web.archive.org/web/*/"+encodeURI(url);
	document.location.href = open_url;
}

function makeModal(){
    chrome.runtime.sendMessage({message: "makemodal"}, function(response) {
	});
    
}

function showSettings(eventObj){
    var target=eventObj.target;
    if(target.getAttribute('toggle')=='off'){
        document.getElementById('settings_btn').setAttribute('toggle','on');
    document.getElementById('settings_div').style.display="block";
    }else{
        document.getElementById('settings_btn').setAttribute('toggle','off');
        document.getElementById('settings_div').style.display="none";
    }
    
}

function restoreSettings() {
  //count=0;
  chrome.storage.sync.get({
    
    ts:true,
    rt:true,
    book:true,
    orcid:true,
    robust:true
  }, function(items) {
    
    document.getElementById('ts').checked = items.ts;
    document.getElementById('rt').checked = items.rt;
    document.getElementById('book').checked = items.book;
    document.getElementById('orcid').checked = items.orcid;
    document.getElementById('robust').checked = items.robust;  
      if(items.rt){
          document.getElementById('make_modal').style.display="block";
      }else{
          document.getElementById('make_modal').style.display="none";
      }
      if(items.ts){
          chrome.runtime.sendMessage({message: "start_ts"}, function(response) {});
      }
      if(items.book){
          document.getElementById('get_book').style.display="block";
      }else{
          document.getElementById('get_book').style.display="none";
      }
      if(items.orcid){
          chrome.runtime.sendMessage({message: "start_orcid"}, function(response) {});
      }
      if(items.robust){
          document.getElementById('get_robust_link').style.display="block";
      }else{
          document.getElementById('get_robust_link').style.display="none";
      }
      
  });
}

function saveSettings(){
    var ts = document.getElementById('ts').checked;
    var rt = document.getElementById('rt').checked;
    var book = document.getElementById('book').checked;
    var orcid= document.getElementById('orcid').checked;
    var robust= document.getElementById('robust').checked;
    if(ts){
        chrome.runtime.sendMessage({message: "start_ts"}, function(response) {});
    }
    if(rt){
        document.getElementById('make_modal').style.display="block";
    }
    if(book){
        document.getElementById('get_book').style.display="block";
    }
    if(orcid){
        chrome.runtime.sendMessage({message: "start_orcid"}, function(response) {});
    }
    if(robust){
        document.getElementById('get_robust_link').style.display="block";
    }
    chrome.storage.sync.set({
    
    ts: ts,
    rt:rt,
    book:book,
    orcid:orcid,
    robust:robust
  });
}

function getBooks(){
    chrome.runtime.sendMessage({message: "injectol" }, function(response) {
	});
}

function dispORCID(response){
          if(response.text!=undefined){
              //console.log('Text received');
      document.getElementsByClassName('loader')[0].style.display='block';
      //.log('message received');
      var xhr = new XMLHttpRequest();
      //.log(xhr);
  xhr.open("GET","https://pub.orcid.org/v2.0/search?q="+response.text, true);

  xhr.onload = function() {
      //.log('Loaded');
      var dispArea=document.getElementById('disp');
      //dispArea.innerHTML="Searching...";

    
var xmlDoc = xhr.responseXML;
    
    function nsResolver(prefix) {
  var ns = {
    'search' : 'http://www.orcid.org/ns/search',
    'common': 'http://www.orcid.org/ns/common'
  };
  return ns[prefix] || null;
}
      
      
      
      

      
      
      
var eventNodeList = xmlDoc.evaluate('/search:search//search:result/common:orcid-identifier/common:path',xmlDoc, nsResolver, XPathResult.ANY_TYPE, null );  
      var idArr=[];


var currentEvent = eventNodeList.iterateNext();  
while (currentEvent) {  

    idArr.push(currentEvent.innerHTML);
    currentEvent = eventNodeList.iterateNext();  
}

document.getElementsByClassName('loader')[0].style.display='none';
      
//dispArea.innerHTML="";      
if(idArr.length!=0){
      //var list=document.createElement('ul');
    var linkToPage=document.createElement('a');
        linkToPage.setAttribute('href','https://orcid.org/orcid-search/quick-search?searchQuery='+response.text);
        linkToPage.innerHTML="Go to ORCID search";
        linkToPage.addEventListener('click',function(event){
            window.open(event.target.href, "", "width=750,height=1000");
        });
    var divBeforeList=document.createElement('div');
    divBeforeList.innerHTML="Top 10 results from ORCID search are :";
        dispArea.appendChild(linkToPage);
        dispArea.appendChild(divBeforeList);
      var len=idArr.length;
      if(len>10){
          len=10;
      }
        for(var i=0;i<len;i++){
            //var newxhr=new XMLHttpRequest();
            //makereq(idArr[i]);
            //newxhr.open('GET','https://pub.orcid.org/v2.0/'+idArr[i]+'/record',true);
            //newxhr.setRequestHeader();
            //newxhr.onload=function(){
                
            //};
            //newxhr.send(null);
            //var listElem=document.createElement('li');
            var listElem=document.createElement('a');
            listElem.setAttribute('class','list-group-item');
            var url="http://orcid.org/"+idArr[i];
            //listElem.innerHTML="<a href='#' id="+url+">"+ idArr[i]+"</a>";
            listElem.innerHTML=idArr[i];
            listElem.setAttribute('href','#');
            listElem.setAttribute('id',url);
            
            listElem.addEventListener('click',function(event){
                    var id=event.target.id;
                    //chrome.tabs.create({url:id});
                    //window.open(id,'_blank');
                    if(document.getElementsByClassName('active').length!=0){
                      document.getElementsByClassName('active')[0].classList.remove('active');  
                    } 
                    event.target.classList.add('active');
                    window.open(id, "", "width=750,height=1000");
                });
            //list.appendChild(listElem);
            dispArea.appendChild(listElem);
            //var newxhr=new XMLHttpRequest();
            //makereq(listElem,idArr[i],newxhr);
        }
        
    }else{
      dispArea.innerHTML="Not found";
  }

      
      
      
      
      
      
      
      
      
      
      
      
      
      
  };
  xhr.send(null);
      
}
}

function pasteSelection() {
    //.log('Pasted');
    chrome.tabs.query({active: true,currentWindow: true}, function (tabs) {

    

            //.log('Message sent');
            chrome.tabs.sendMessage(tabs[0].id,{method: "getSelectionfororcid"},function(response){
                //.log(response);
                if(response!=undefined){
                    dispORCID(response);
                }
                
            });
            //.log('Yup done');
    });
}

function display_robust_link(page_url,archived_url,title){
    var timestamp=archived_url.match(/\d{14}/g)[0];
    var year=timestamp.substring(0,4);
    var month=timestamp.substring(4,6);
    var day=timestamp.substring(6,8);

    var robust_link='<a href="'+page_url+'" data-versionurl="'+archived_url+'">'+title+'</a>';
//    var robust_link='<a href="'+page_url+'" data-versionurl="'+archived_url+'" data-versiondate="'+year+'-'+month+'-'+day+'">'+title+'</a>';
    var js_css='<link rel="stylesheet" type="text/css" href="http://robustlinks.mementoweb.org/tools/js/robustlinks.css" /><script type="text/javascript" src="http://robustlinks.mementoweb.org/tools/js/robustlinks-min.js"></script><script type="text/javascript" src="http://robustlinks.mementoweb.org/tools/js/robustlinks-uri-exclude-list.js"></script>';
    document.getElementsByClassName('loader')[0].style.display='none';
    document.getElementById('robust_link').innerHTML=robust_link;
    document.getElementById('js_and_css_for_robust').innerHTML=js_css;
    document.getElementById('robust_div').style.display='block';

}

function wb_availability(page_url,code,title){
         var wb_avail_url="https://archive.org/wayback/available?url="+page_url;
         var newxhr=new XMLHttpRequest();
         newxhr.open('GET',wb_avail_url,true);
         //console.log("SPN over");
         newxhr.onerror=function(){
             console.log('Unknown error');
         };
         newxhr.onload=function(){
         if(newxhr.status==200){
         var res=JSON.parse(newxhr.responseText);
         if(res.archived_snapshots.closest!=undefined && code==200){
             console.log(code,newxhr.statusText);
         var archived_url=res.archived_snapshots.closest.url;
            display_robust_link(page_url,archived_url,title);  
         
         }else if(res.archived_snapshots.closest==undefined && code==200){
             console.log(code,newxhr.statusText);
             document.getElementsByClassName('loader')[0].style.display='none';
             document.getElementById('robust_error').innerHTML="There was an error in retrieving the playback URL. PLease try again";
             
         }else if(res.archived_snapshots.closest!=undefined && code==502){
                 console.log(code,newxhr.statusText);
                 var archived_url=res.archived_snapshots.closest.url;
                 document.getElementsByClassName('loader')[0].style.display='none';
                 var timestamp=archived_url.match(/\d{14}/g)[0];
                 var year=timestamp.substring(0,4);
                 var month=timestamp.substring(4,6);
                 var day=timestamp.substring(6,8);
                 //console.log(timestamp);
                 document.getElementById('robust_question_div').style.display='block';
                 document.getElementById('robust_question').innerHTML="We cannot save the page right now. Would you like a robust link to the most recent snapshot dated "+day+":"+month+":"+year+" ?";
                 document.getElementById('robust_yes').setAttribute('archurl',archived_url);
                 document.getElementById('robust_yes').setAttribute('url',page_url);
                 document.getElementById('robust_yes').setAttribute('title',title);
                 document.getElementById('robust_yes').onclick=function(eventObj){
                     document.getElementById('robust_question_div').style.display='none';
                     var page_url=eventObj.target.getAttribute('url');
                     var archived_url=eventObj.target.getAttribute('archurl');
                     var title=eventObj.target.getAttribute('title');
                     display_robust_link(page_url,archived_url,title);
                 };
                 document.getElementById('robust_no').onclick=function(eventObj){
                     document.getElementsByClassName('loader')[0].style.display='none';
                     document.getElementById('robust_question_div').style.display='none';
                 };

         }else if(res.archived_snapshots.closest==undefined && code==502){
                 console.log(code,newxhr.statusText);
                 document.getElementsByClassName('loader')[0].style.display='none';
                 document.getElementById('robust_error').innerHTML="We cannot save this page right now . We do not have a playback for it either";

         }
         }else{
             console.log(newxhr.status,newxhr.statusText);
             
             document.getElementsByClassName('loader')[0].style.display='none';
             document.getElementById('robust_error').innerHTML="Unknown error";
         }
        };
        newxhr.send();
}

function getRobustLink(eventObj){
    document.getElementsByClassName('loader')[0].style.display='block';
    document.getElementById('robust_error').innerHTML="";
    document.getElementById('robust_div').style.display='none';
    

        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        var archived_url="";
        var page_url="";
        var robust_link="";
        if(tabs[0].url.indexOf('web.archive.org/web')>=0){
//        archived_url=tabs[0].url;
//        var pos=tabs[0].url.indexOf('/http');
//        var url=tabs[0].url.substring(pos+1);
//        page_url=url;
//        display_robust_link(page_url,archived_url,tabs[0].title);
        archived_url=tabs[0].url;
        var pos=tabs[0].url.indexOf('/http');
        var url=tabs[0].url.substring(pos+1);
        page_url=url;
        
        var timestamp=archived_url.match(/\d{14}/g)[0];
    var year=timestamp.substring(0,4);
    var month=timestamp.substring(4,6);
    var day=timestamp.substring(6,8);
    var title=tabs[0].title;
    var robust_link='<a href="'+page_url+'" data-versionurl="'+archived_url+'">'+title+'</a>';
//    var robust_link='<a href="'+archived_url+'" data-originalurl="'+page_url+'" data-versiondate="'+year+'-'+month+'-'+day+'">'+tabs[0].title+'</a>';
    var js_css='<link rel="stylesheet" type="text/css" href="http://robustlinks.mementoweb.org/tools/js/robustlinks.css" /><script type="text/javascript" src="http://robustlinks.mementoweb.org/tools/js/robustlinks-min.js"></script><script type="text/javascript" src="http://robustlinks.mementoweb.org/tools/js/robustlinks-uri-exclude-list.js"></script>';
    document.getElementsByClassName('loader')[0].style.display='none';
    document.getElementById('robust_link').innerHTML=robust_link;
    document.getElementById('js_and_css_for_robust').innerHTML=js_css;
    document.getElementById('robust_div').style.display='block';

          
        
        }else{
        //console.log('Normal page');
         page_url=tabs[0].url;
         var wb_url = "https://web.archive.org/save/";
         var pattern = /https:\/\/web\.archive\.org\/web\/(.+?)\//g;
         var url = page_url.replace(pattern, "");
         var open_url = wb_url+encodeURI(url);
         if(!page_url.includes('http')){
             page_url="http://"+page_url;
         }
         var xhr=new XMLHttpRequest();
         xhr.open('GET',open_url,true);
         //console.log(open_url);
         xhr.onload=function(){
         if(xhr.status==200){
//         var wb_avail_url="https://archive.org/wayback/available?url="+page_url;
//         var newxhr=new XMLHttpRequest();
//         newxhr.open('GET',wb_avail_url,true);
//         console.log("SPN over");
//         newxhr.onload=function(){
//         var res=JSON.parse(newxhr.responseText);
//         if(res.archived_snapshots.closest!=undefined){
//         archived_url=res.archived_snapshots.closest.url;
//         console.log(archived_url);
//         display_robust_link(page_url,archived_url,tabs[0].title);
//
//         }else{
//             document.getElementsByClassName('loader')[0].style.display='none';
//             document.getElementById('robust_error').innerHTML="There was an error. Please try again";
//             
//         }
//        };
//        newxhr.send();
          
             
//          archived_url=wb_availability(page_url);
//          console.log(archived_url);
//          if(archived_url==null){
//             document.getElementsByClassName('loader')[0].style.display='none';
//             document.getElementById('robust_error').innerHTML="There was an error in retrieving the playback URL. PLease try again";
//
//          }else{
//            display_robust_link(page_url,archived_url,tabs[0].title);    
//          }
          wb_availability(page_url,200,tabs[0].title);
         }else if(xhr.status==502){
             //cant be saved now
//             archived_url=wb_availability(page_url);
//             if(archived_url==null){
//                 document.getElementsByClassName('loader')[0].style.display='none';
//                 document.getElementById('robust_error').innerHTML="We cannot save this page right now . We do not have a playback for it either";
//             }else{
//                 document.getElementsByClassName('loader')[0].style.display='none';
//                 var timestamp=archived_url.match(/\d{5}/g)[0];
//                 var year=timestamp.substring(0,4);
//                 var month=timestamp.substring(4,6);
//                 var day=timestamp.substring(6,8);
//                 document.getElementById('robust_question_div').style.display='block';
//                 document.getElementById('robust_question').innerHTML="We cannot save the page right now. Would you like a robust link to the most recent snapshot dated "+day+":"+month+":"+year+" ?";
//                 document.getElementById('robust_yes').setAttribute('archurl',archived_url);
//                 document.getElementById('robust_yes').setAttribute('url',page_url);
//                 document.getElementById('robust_yes').setAttribute('title',tabs[0].title);
//                 document.getElementById('robust_yes').onclick=function(eventObj){
//                     document.getElementById('robust_question_div').style.display='none';
//                     var page_url=eventObj.target.getAttribute('url');
//                     var archived_url=eventObj.target.getAttribute('archurl');
//                     var title=eventObj.target.getAttribute('title');
//                     display_robust_link(page_url,archived_url,title);
//                 };
//                 document.getElementById('robust_no').onclick=function(eventObj){
//                     document.getElementsByClassName('loader')[0].style.display='none';
//                     document.getElementById('robust_question_div').style.display='none';
//                 };
//             }
             wb_availability(page_url,502,tabs[0].title);
         }else if(xhr.status==403){
             //blocked from being saved
             console.log(403,xhr.statusText);
             document.getElementsByClassName('loader')[0].style.display='none';
             document.getElementById('robust_error').innerHTML="This URL has been excluded from the Wayback Machine.";
         }else if(xhr.status==503){
             //server unavailable
             console.log(503,xhr.statusText);
             document.getElementsByClassName('loader')[0].style.display='none';
             document.getElementById('robust_error').innerHTML="The server responded with 503 error(Service Unavailable). Please try again";
         }else if(xhr.status==504){
             //server unavailable
             console.log(504,xhr.statusText);
             document.getElementsByClassName('loader')[0].style.display='none';
             document.getElementById('robust_error').innerHTML="The server responded with 504 error(Gateway timeout). Please try again";
         }else{
             //server unavailable
             console.log(xhr.status,xhr.statusText);
             document.getElementsByClassName('loader')[0].style.display='none';
             document.getElementById('robust_error').innerHTML="Unknown error";
         }
        };
        xhr.send();
                }
            });
}







restoreSettings();

document.getElementById('settings_div').style.display="none";


document.getElementById('save_now').onclick = save_now_function;
document.getElementById('recent_capture').onclick = recent_capture_function;
document.getElementById('first_capture').onclick = first_capture_function;
document.getElementById('make_modal').onclick=makeModal;

document.getElementById('settings_btn').onclick=showSettings;
document.getElementById('settings_save_btn').onclick=saveSettings;
document.getElementById('get_book').onclick = getBooks;
document.getElementById('get_robust_link').onclick=getRobustLink;


window.onload=pasteSelection;

