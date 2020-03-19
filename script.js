"use strict";

let formSearch = document.querySelector(".form-search"),
  inputCitiesFrom = document.querySelector(".input__cities-from"),
  inputCitiesTo = document.querySelector(".input__cities-to"),
  dropdownCitiesFrom = document.querySelector(".dropdown__cities-from"),
  dropdownCitiesTo = document.querySelector(".dropdown__cities-to"),
  inputDateDepart = document.querySelector(".input__date-depart");

  //города 

//let citiesApi = 'http://api.travelpayouts.com/data/ru/cities.json';
let citiesApi = 'dataBase/cities.json';
let proxy = 'https://cors-anywhere.herokuapp.com/';


let city = [

];


let getData = (url, callback) => {
 

    let request  = new XMLHttpRequest();

    request.open('GET', url);

    request.addEventListener('readystatechange', () => {

     if(request.readyState !== 4) return;

     if(request.status === 200){

        callback(request.response);
     } else {
         console.error(request.status);
     }

    });
    
    request.send();

};




let showCity = function(input, list){

    list.textContent = "";

  if (input.value !== "") {
    let filterCity = city.filter(item => {
      let fixItem = item.toLocaleLowerCase();

      return fixItem.includes(input.value.toLocaleLowerCase());
    });

    filterCity.forEach(item => {
      let li = document.createElement("li");
      li.classList.add("dropdown__city");
      li.textContent = item;
      list.append(li);
    });
  }


};


let selectCity = (e, input, list) => {

    let target = event.target;
    if (target.tagName.toLowerCase() === 'li') {
        input.value = target.textContent;
        list.textContent = '';
        }

};


inputCitiesTo.addEventListener('input', () => {
    showCity(inputCitiesTo, dropdownCitiesTo)
})

inputCitiesFrom.addEventListener('input', () => {

    showCity(inputCitiesFrom, dropdownCitiesFrom)
});


dropdownCitiesFrom.addEventListener('click',(event) => {
    selectCity(event,inputCitiesFrom,dropdownCitiesFrom )
});

dropdownCitiesTo.addEventListener('click',(event)  => {
    selectCity(event,inputCitiesTo, dropdownCitiesTo)
});


getData(citiesApi, (data)=>{

    let dataCities =  JSON.parse(data);


   city = dataCities.filter((item) => {

     console.log(item.name);
     
      return true;
    });





  });