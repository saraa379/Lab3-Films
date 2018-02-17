// Initialize Firebase
  var config = {
    apiKey: "AIzaSyBiRIqKCobBSmG2ggGtDWvjRehXLWSVNi0",
    authDomain: "lab3-films.firebaseapp.com",
    databaseURL: "https://lab3-films.firebaseio.com",
    projectId: "lab3-films",
    storageBucket: "lab3-films.appspot.com",
    messagingSenderId: "678260270524"
  };
  firebase.initializeApp(config);

  const db = firebase.database();

//Global variables

var nrPages = 0;//Nr of pages in current data
var dataArray = []; //list of movies
var nrMovies = 0;
var keys = [];



window.addEventListener('load', function(event) {

  //Global variables
  var pages = 0;  //page numbers

  //btnAddFilm functionality
  var btnAddFilm = document.getElementById('btnAddFilm');
  var formAddFilm = document.getElementById('formAddFilm');
  var arrow = document.getElementById('arrow');


  btnAddFilm.addEventListener('click', function(event) {
    //<i id="arrowUp" class="fas fa-caret-up"></i>
  

    if (formAddFilm.style.display === "none") {
        formAddFilm.style.display = "block";
        arrow.classList.remove("fa-caret-down");
        arrow.classList.add("fa-caret-up");
    } else {
        formAddFilm.style.display = "none";
        arrow.classList.remove("fa-caret-up");
        arrow.classList.add("fa-caret-down");
    }

  }); //btnAddFilm function ends

  //btnAddFilm2 functionality
  btnAddFilm2.addEventListener('click', function(event) {
    var namnFilm = document.getElementById('namnFilm').value;
    document.getElementById('namnFilm').value = "";

    var arFilm = document.getElementById('arFilm').value;
    document.getElementById('arFilm').value = "";

    var regissorFilm = document.getElementById('regissorFilm').value;
    document.getElementById('regissorFilm').value = "";

    var errorP = document.getElementById('errorP');

    
    if (namnFilm.length === 0||arFilm.length===0||regissorFilm.length===0) {
      errorP.innerText = 'Snälla, skriva ner namn, år eller regissör av filmen';
      errorP.style.display = 'block';
    } else {
      errorP.style.display = 'none';
      //console.log('Name of the film: ' + namnFilm);
      //console.log('Year of the film: ' + arFilm);
      //console.log('Director of the film: ' + regissorFilm);

      //Adding film into DB
      const newFilm = {
        name: namnFilm,
        year: arFilm,
        director: regissorFilm 
      }
      console.log(newFilm);

      //Adding movie into the DB
      db.ref('movies/').push(newFilm);

      retrieveDataFromDB();

      } //end of else
    
  }); //btnAddFilm2 function ends

  //Retrieves all movies from DB
  retrieveDataFromDB();


  //Sorts movies by select
  document.getElementById("selectSort").onchange=changeEventHandler;


}); //windows.load

//retrieving data from DB
function retrieveDataFromDB(){

  db.ref('movies/').limitToFirst(100).on('value', function(snapshot) {
    let data = snapshot.val();
    keys = Object.keys(data);
    //console.log('Keys: ' + keys);
    //console.log('Keys length: ' + keys.length);


    //sending data to publish
    dataArray = [];

    for(let child in data){
      let r = data[child];
      //console.log('Child: ' + r.name);
      //console.log('Child: ' + r.msgTime);
      //console.log('Child: ' + r.msgDate);
      //console.log('Child: ' + r.message);

      //Adding messages into array
      dataArray.push(r);

    }

    publishData();

  });//end of db.ref


}//end of function retrieveDataFromDB

function publishData(){

  //for(let child in dataArray){
  //    let r = dataArray[child];
  //    console.log('Film name: ' + r.name);
  //    console.log('Year: ' + r.year);
  //    console.log('Director: ' + r.director);
  //}//end of for


    //Nr of movies in current data
  console.log('Nr of movies: ' + dataArray.length);
  nrMovies = dataArray.length;

    //Nr of pages in current data
    if (nrMovies > 10) {
        var division = Math.floor(nrMovies / 10);
        var modulo = nrMovies % 10;
        if (modulo != 0) {
          nrPages = division + 1;
        }else{
          nrPages = division;
        }

        //console.log('Division: ' + division);
        //console.log('Modulo: '+ modulo);
    }else{
      nrPages = 1;
      console.log('Nr of pages: ' + nrPages);
    }//end of else

    console.log('Number of pages: '+ nrPages);

//Fills the single page (tableContent) with movies
    fillPage(0);
    fillPageNr(0);

}//end function publishData

function fillPage(start){

      //clearing all children from div tableContent
    var tableContent = document.getElementById('tableContent');

    while (tableContent.firstChild) {
        tableContent.removeChild(tableContent.firstChild);
    }

    var loopValue = start + 10;
  
  for (var i = start; i < loopValue; i++) {
    //console.log(dataArray[i]);
    if (dataArray[i]==undefined) {
      console.log('End of array');
    }else{
        //creating row with film data

        const newDiv = document.createElement('div');
        newDiv.setAttribute("id","tableRow");

        const namnRow = document.createElement('p');
          namnRow.setAttribute("id","namnRow");
          namnRow.innerHTML = dataArray[i].name;
          newDiv.appendChild(namnRow);

        const arRow = document.createElement('p');
          arRow.setAttribute("id","arRow");
          arRow.innerHTML = dataArray[i].year;
          newDiv.appendChild(arRow);

        const directorRow = document.createElement('p');
          directorRow.setAttribute("id","directorRow");
          directorRow.innerHTML = dataArray[i].director;
          newDiv.appendChild(directorRow);

        const cross = document.createElement('i');
        cross.classList.add("fas");
        cross.classList.add("fa-times");
        const btnRow = document.createElement('button');
        //add id
        var btnId = 'id'+i;
        btnRow.setAttribute("id",btnId);
        btnRow.setAttribute("onclick","removeFilm(this.id)");
        btnRow.appendChild(cross);
        newDiv.appendChild(btnRow);

        tableContent.appendChild(newDiv);
    }//end of if
  }//end of for loop

  

} //end of function fillPage

function fillPageNr(startV){
  //filling page numbers
  var pageNr = nrPages + 1;
  var pages = document.getElementById("pages");

  while (pages.firstChild) {
    pages.removeChild(pages.firstChild);
  }

  for (var p = 1; p < pageNr; p++) {
      var pageId = 'is'+p;
      const page = document.createElement('button');
      page.setAttribute("id",pageId);
      page.classList.add("page");
      page.setAttribute("onclick","gotoPage(this.id)");
      page.innerText = p;
      pages.appendChild(page);
      
      if(startV < 11 && p == 1){
          page.classList.add("active");
      }else if(startV > 10 && start < 21 && p==2){
          page.classList.add("active");
      }else if(startV > 20 && start < 31 && p==3){
          page.classList.add("active");
      }else if(startV > 30 && start < 41 && p==4){
          page.classList.add("active");
      }else if(startV > 40 && start < 51 && p==5){
          page.classList.add("active");
      }else if(startV > 50 && start < 61 && p==6){
          page.classList.add("active");
      }else if(startV > 60 && start < 71 && p==7){
          page.classList.add("active");
      }else if(startV > 70 && start < 81 && p==8){
          page.classList.add("active");
      }else if(startV > 80 && start < 91 && p==9){
          page.classList.add("active");
      }else if(startV > 90 && start < 101 && p==10){
          page.classList.add("active");
      }
  }
}//end of function fillPageNr

function removeFilm(btnId){

  console.log('Buttons id: ' + btnId);
  var rest = btnId.substring(2);
  console.log('Rest: ' + rest);
  var id = parseInt(rest);
  console.log('Id: ' + id);

  var key = keys[id];
  console.log('Key: ' + key);

  db.ref('movies/'+key).remove();

  //location.reload();
  retrieveDataFromDB();


}

function gotoPage(pageId){
  console.log('Page is: ' + pageId);
  var rest = pageId.substring(2);
  console.log('Rest: ' + rest);
  var is = parseInt(rest);
  console.log('Is: ' + is);

  //remove previous active class
  var pageNr = nrPages + 1;
  for (var p = 1; p < pageNr; p++) {
    var pId = 'is'+p;
    var classes = document.getElementById(pId).classList;
      if (classes.contains("active")) {
   
          classes.remove("active");
      } 
  }
//add active class on current page
  var newPage = document.getElementById(pageId);
  newPage.classList.add("active");

  var startValue = 0;

  if(is == 1){
    startValue = 0;
  }else{
    startValue = is * 10 - 10;
  }
    console.log(startValue);

  fillPage(startValue);


}//end of function gotoPage

//Sort by Select
function changeEventHandler(event){

  if(!event.target.value){ 
      alert('Please Select an attribute to sort');
  } else {
      if(event.target.value=='titel'){
        console.log('You choose: ' + event.target.value);
        sortByTitle();
      }else if(event.target.value=='director'){
        console.log('You choose: ' + event.target.value);
        sortByDirector();
      }else if(event.target.value=='ar'){
        console.log('You choose: ' + event.target.value);
        sortByYear();
      }
  }

}

//Sort by title
function sortByTitle(){

    db.ref('movies/').orderByChild('name').limitToFirst(100).once('value', function(snapshot) {
          dataArray = []; 
          keys = [];
          snapshot.forEach( child => {
          
            var film = child.val();
            //console.log('Name: ' + film.name);
            //console.log('Ar: ' + film.year);
            //console.log('Director: ' + film.director);
            dataArray.push(film);
            keys.push(child.key);

          })
        //console.log('Keys: ' + keys);
        //console.log('Films: ' + dataArray);


    publishData();

  });//end of db.ref

}//end of function sortByTitle


//Sort by year
function sortByYear(){

    db.ref('movies/').orderByChild('director').limitToFirst(100).once('value', function(snapshot) {
          dataArray = []; 
          keys = [];
          snapshot.forEach( child => {
          
            var film = child.val();
            //console.log('Name: ' + film.name);
            //console.log('Ar: ' + film.year);
            //console.log('Director: ' + film.director);
            dataArray.push(film);
            keys.push(child.key);

          })
        //console.log('Keys: ' + keys);
        //console.log('Films: ' + dataArray);


    publishData();

  });//end of db.ref

}//end of function sortByTitle

//Sort by director
function sortByDirector(){

    db.ref('movies/').orderByChild('director').limitToFirst(100).once('value', function(snapshot) {
          dataArray = []; 
          keys = [];
          snapshot.forEach( child => {
          
            var film = child.val();
            //console.log('Name: ' + film.name);
            //console.log('Ar: ' + film.year);
            //console.log('Director: ' + film.director);
            dataArray.push(film);
            keys.push(child.key);

          })
        //console.log('Keys: ' + keys);
        //console.log('Films: ' + dataArray);


    publishData();

  });//end of db.ref

}//end of function sortByTitle

	


