//***************************************************************************************************************************
// author: Kevin Wong
// date: 11/30/16
// program: bus-mall app
// description: The app's purpose is to have the group members choose which product, of the three displayed images, that they would
//              be most likely to purchase, and then store, calculate, and visually display the resulting data.
//***************************************************************************************************************************

'use strict';

// GLOBAL VARIABLES
var IMAGE_OBJECT_ARRAY = [];
var PATHS_ARRAY = [
  'bag.jpg', 'banana.jpg', 'bathroom.jpg', 'boots.jpg', 'breakfast.jpg', 'bubblegum.jpg', 'chair.jpg', 'cthulhu.jpg',
  'dog-duck.jpg', 'dragon.jpg', 'pen.jpg', 'pet-sweep.jpg', 'scissors.jpg', 'shark.jpg', 'sweep.png', 'tauntaun.jpg',
  'unicorn.jpg', 'usb.gif', 'water-can.jpg', 'wine-glass.jpg'];
var TOTAL_CLICKS = 0;
var COLLECT_LIMIT = 25;

// create an array of objects representing each image if it doesn't exist in the local storage
if (localStorage.getItem('imageObjectArray') === null) {
  for (var i = 0; i < PATHS_ARRAY.length; i++) {
    var photo = new ImageObject(PATHS_ARRAY[i]); // create an object for each image
    IMAGE_OBJECT_ARRAY.push(photo); // push the photo object into the IMAGE_OBJECT_ARRAY
  }

  // set the array in local storage as a wonky string
  localStorage.setItem('imageObjectArray', IMAGE_OBJECT_ARRAY);
} else { // the IMAGE_OBJECT_ARRAY alraedy exists after a page refresh and is the same as the local storage version
  // get the JSON string (created earlier) from local storage and set it to a variable
  var storedImageObjectArrayString = localStorage.getItem('imageObjectArray');
  // parse the JSON string to update the objects key:values in IMAGE_OBJECT_ARRAY
  IMAGE_OBJECT_ARRAY = JSON.parse(storedImageObjectArrayString);
}

// receive clicks on those displayed images, and track those clicks for each image.
// track how many times each image is displayed, for statistical purposes.
// prevent images from repeating in the same display
var displayArea = document.getElementById('image_area');

displayArea.addEventListener('click', clickHandler);

function clickHandler(event) {
  var targetString = event.target.src;
  var targetPath = targetString.split('images')[1];
  var itemPath;

  if (TOTAL_CLICKS > COLLECT_LIMIT) {
    // stop the page from handling more clicks
    return;
  }

  for (var i = 0; i < IMAGE_OBJECT_ARRAY.length; i++) {
    itemPath = IMAGE_OBJECT_ARRAY[i].path.split('images')[1];
    if (itemPath === targetPath) {
      IMAGE_OBJECT_ARRAY[i].clicked += 1; // increase the clicked property of the object
      IMAGE_OBJECT_ARRAY[i].numTimesShown += 1;
      TOTAL_CLICKS += 1; // increase the total clicks count
    }
  }

  changePictures();

  // display charted results after 25 selections have been made
  if (TOTAL_CLICKS >= COLLECT_LIMIT) {
    var dataArea = document.getElementById('data_area');
    dataArea.textContent = 'you hit ' + COLLECT_LIMIT + ' clicks';

    renderChart();
  }

  // add persistence by using local storage to store your voting data! The goal is to have all of your data persist through a page refresh or through completely closing the browser
  // turn the updated IMAGE_OBJECT_ARRAY into a JSON string and set it to a variable
  var imgObjArrJSON = JSON.stringify(IMAGE_OBJECT_ARRAY);
  // set the JSON string as a value for the key: imageObjectArray
  localStorage.setItem('imageObjectArray', imgObjArrJSON); // updated IMAGE_OBJECT_ARRAY (with data) now exists in local storage as a JSON string
}

// Upon receiving a click, three new non-duplicating random images need to be automatically displayed. In other words, the three images that are displayed should contain no duplicates, nor should they duplicate with any images that we displayed immediately before

// The marketing team is not only interested in the total number of clicks, but also the percentage of times that an item was clicked when it was shown. So, you'll also need to keep track of how many times each image is displayed and do the calculations.

//find what was clicked
//find it in the array

// select three random photos from the image directory and display them side-by-side-by-side in the browser window; managing the size and the aspect ratio of the images.
function changePictures() {
  var leftImage = document.getElementById('left_image');
  var middleImage = document.getElementById('middle_image');
  var rightImage = document.getElementById('right_image');
  var randomLeftIndex = generateRandomNumber();
  var randomMiddleIndex = generateRandomNumber();
  var randomRightIndex = generateRandomNumber();
  var displayLeftIndex = 0;
  var displayMiddleIndex = 0;
  var displayRightIndex = 0;

  // generate random index number for the indices
  while (displayLeftIndex === randomLeftIndex) {
    randomLeftIndex = generateRandomNumber();
  }
  while (displayMiddleIndex === randomMiddleIndex) {
    randomMiddleIndex = generateRandomNumber();
  }
  while (displayRightIndex === randomRightIndex) {
    randomRightIndex = generateRandomNumber();
  }

  // verify that random indices aren't the same
  while (randomLeftIndex === randomMiddleIndex) {
    randomLeftIndex = generateRandomNumber();
  }
  while (randomMiddleIndex === randomRightIndex || randomLeftIndex === randomRightIndex) {
    randomRightIndex = generateRandomNumber();
  }

  // display random images to the screen
  displayLeftIndex = randomLeftIndex;
  leftImage.src = 'images/' + PATHS_ARRAY[randomLeftIndex];

  displayMiddleIndex = randomMiddleIndex;
  middleImage.src = 'images/' + PATHS_ARRAY[randomMiddleIndex];

  displayRightIndex = randomRightIndex;
  rightImage.src = 'images/' + PATHS_ARRAY[randomRightIndex];


  function generateRandomNumber() {
    return Math.floor(Math.random() * PATHS_ARRAY.length);
  }
}

function renderChart() {
  var ctx = document.getElementById('my_chart');
  var chartConfig = {
    type: 'bar',
    data: {
      labels: makeArraysOfImageProperties(IMAGE_OBJECT_ARRAY)[0], // x-axis labels
      datasets: [{
        label: '# of Clicks',
        data: makeArraysOfImageProperties(IMAGE_OBJECT_ARRAY)[1], //graph data of times clicked
        backgroundColor: '#003df5',
        borderColor: '#002eb8',
        borderWidth: 1
      },
        {
          label: '# of Times Shown',
          data: makeArraysOfImageProperties(IMAGE_OBJECT_ARRAY)[2], //graph data of numTimesShown
          backgroundColor: '#33ffcc',
          borderColor: '#33ccff',
          borderWidth: 1
        }
      ]
    },
    options: {
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero:true
          }
        }]
      }
    }
  };

  function makeArraysOfImageProperties(IMAGE_OBJECT_ARRAY) {
    var arrayOfNames = [];
    var arrayOfClicked = [];
    var arrayOfNumTimesShown = [];

    // use a for loop to populate arrays for each property from the IMAGE_OBJECT_ARRAY
    for (var i = 0; i < IMAGE_OBJECT_ARRAY.length; i++){
      arrayOfNames.push(IMAGE_OBJECT_ARRAY[i].name);
      arrayOfClicked.push(IMAGE_OBJECT_ARRAY[i].clicked);
      arrayOfNumTimesShown.push(IMAGE_OBJECT_ARRAY[i].numTimesShown);
    }

    // to access either array outside the function, call makeArraysOfImageProperties(IMAGE_OBJECT_ARRAY)[i]
    return [arrayOfNames, arrayOfClicked, arrayOfNumTimesShown];
  }

  // use the chart.js library to render the chart after passing in the arguments from above
  new Chart(ctx, chartConfig);
}

// create a constructor function that creates an object associated with each image, and has (at a minimum) properties for the name of the image, its filepath, the number of times it has been shown, and the number of times it has been clicked.
function ImageObject(paths) {
  this.name = paths;
  this.path = 'images/' + paths;
  this.clicked = 0;
  this.numTimesShown = 0;
}
