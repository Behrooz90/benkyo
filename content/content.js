//BLOCK WORDS
// findString = function findText(text) {
//   if(window.find(text)){
//     document.documentElement.innerHTML = '';
//     document.documentElement.innerHTML = 'This site is blocked';
//     document.documentElement.scrollTop = 0;
//   };
// }

// findString("youtube");

//NEED TO MAKE IT WORKS FOR THE WHOLE DOMAIN NOT JUST A SPECIFIC URL
//BLOCK THE PARTIAL DOMAINS
findURL = function changeURL(text){
    var current = window.location.href;
    if(current === text){
      window.location.replace("https://studybuddy2022.github.io/blocked.html");
    }
  }
  
  //BLOCK THE ENTIRE DOMAIN WITH THE FOLLOWING FUNCTION
  // findAllURL = function changeAllURL(text){
  //   var current = window.location.href;
  //   if(current.startsWith(text)){
  //     document.documentElement.innerHTML = '';
  //     document.documentElement.innerHTML = 'Domain is blocked';
  //     document.documentElement.scrollTop = 0;
  //   }
  // }
  
  
  findURL("https://www.quora.com/");
  findURL("https://www.youtube.com/");
  findURL("https://stackoverflow.com/");
  
  //findAllURL("https://www.facebook.com/");