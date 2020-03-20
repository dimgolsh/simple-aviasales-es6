"use strict";

let formSearch = document.querySelector(".form-search"),
  inputCitiesFrom = document.querySelector(".input__cities-from"),
  inputCitiesTo = document.querySelector(".input__cities-to"),
  dropdownCitiesFrom = document.querySelector(".dropdown__cities-from"),
  dropdownCitiesTo = document.querySelector(".dropdown__cities-to"),
  inputDateDepart = document.querySelector(".input__date-depart");

//города

//let citiesApi = 'http://api.travelpayouts.com/data/ru/cities.json';
let citiesApi = "dataBase/cities.json";
let proxy = 'https://cors-anywhere.herokuapp.com/';
let API_KEY = '7f084d8c89ba7edfe2f7a43d0eb58c71';
let calendar ='http://min-prices.aviasales.ru/calendar_preload';
let calendar_params = '?origin=MOW&destination=LED&depart_date=2020-05-05&one_way=true';

let city = [];

let getData = (url, callback) => {
  let request = new XMLHttpRequest();

  request.open("GET", url);

  request.addEventListener("readystatechange", () => {
    if (request.readyState !== 4) return;

    if (request.status === 200) {
      callback(request.response);
    } else {
      console.error(request.status);
    }
  });

  request.send();
};

let showCity = function(input, list) {
  list.textContent = "";

  if (input.value !== "") {
    let filterCity = city.filter(item => {
        let fixItem = item.name.toLocaleLowerCase();
       return fixItem.startsWith(input.value.toLocaleLowerCase());
    });

  
   

    filterCity.forEach((item) => {

   
      let li = document.createElement("li");
      li.classList.add("dropdown__city");
      li.textContent = item.name;
      list.append(li);
    });
  }
};

let selectCity = (e, input, list) => {
  let target = event.target;
  if (target.tagName.toLowerCase() === "li") {
    input.value = target.textContent;
    list.textContent = "";
  }
};

let renderCheapDay = (cheapTicket) => {

  
};

let renderCheapYear = (cheapTickets) => {

  cheapTickets.sort((a,b)=> a.value - b.value);

  console.log(cheapTickets);

};

let renderCheap  = (response, date) => {

  let cheapTicket = JSON.parse(response).best_prices;

  let cheapTicketDay = cheapTicket.filter((item) => item.depart_date == date);

  renderCheapDay(cheapTicketDay);
  renderCheapYear(cheapTicket);

  console.log(cheapTicketDay);

}

inputCitiesTo.addEventListener("input", () => {
  showCity(inputCitiesTo, dropdownCitiesTo);
});

inputCitiesFrom.addEventListener("input", () => {
  showCity(inputCitiesFrom, dropdownCitiesFrom);
});

dropdownCitiesFrom.addEventListener("click", event => {
  selectCity(event, inputCitiesFrom, dropdownCitiesFrom);
});

dropdownCitiesTo.addEventListener("click", event => {
  selectCity(event, inputCitiesTo, dropdownCitiesTo);
});

formSearch.addEventListener('submit', (e)=>{
  e.preventDefault();
  console.log(e);

  let formData = {

    from: city.find((item)=>{ return inputCitiesFrom.value === item.name}).code,
    to: city.find((item) =>{return inputCitiesTo.value === item.name}).code,
    date: inputDateDepart.value
  };

  let requestData2 = '?origin=' + formData.from +
  '&destination=' + formData.to + 
  '&depart_date=' + formData.date + 
  '&one_way=true';

  let requestData = `?origin=${formData.from}&destination=${formData.to}&depart_date=${formData.date}&one_way=true`;

  console.log(formData);


  getData(calendar  + requestData, (response) => {
    renderCheap(response, formData.date)
    console.log(response);
  });


})



getData(citiesApi, data => {

  console.log(JSON.parse(data));
  city = JSON.parse(data).filter((item) => item.name);

  city.sort(function (a, b) {
    if (a.name > b.name) {
      return 1;
    }
    if (a.name < b.name) {
      return -1;
    }
    // a должно быть равным b
    return 0;
  });

});

/*getData(calendar + calendar_params + '&token=' + API_KEY,
 data => {
  let ticket =  JSON.parse(data).best_prices.filter(item => item.depart_name === '2020-05-05');
  console.log('ffff');
  console.log(ticket);
});*/


