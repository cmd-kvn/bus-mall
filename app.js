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
var DISPLAY_INDICES = [0, 0, 0];

// create an array of objects representing each image if it doesn't exist in the local storage
if (localStorage.getItem('imageObjectArray') === null) {
  for (var i = 0; i < PATHS_ARRAY.length; i++) {
    var photo = new ImageObject(PATHS_ARRAY[i]); // create an object for each image
    IMAGE_OBJECT_ARRAY.push(photo); // push the photo object into the IMAGE_OBJECT_ARRAY
  }

  // set the array in local storage as a wonky string
  localStorage.setItem('imageObjectArray', IMAGE_OBJECT_ARRAY);
} else { // the IMAGE_OBJECT_ARRAY already exists after a page refresh and is the same as the local storage version
  // get the JSON string (created earlier) from local storage and set it to a variable
  var storedImageObjectArrayString = localStorage.getItem('imageObjectArray');
  // parse the JSON string to update the objects key:values in IMAGE_OBJECT_ARRAY
  IMAGE_OBJECT_ARRAY = JSON.parse(storedImageObjectArrayString);
}

// create the display area and add an event listener
var displayArea = document.getElementById('image_area');
displayArea.addEventListener('click', clickHandler);

function clickHandler(event) {
  if (TOTAL_CLICKS > COLLECT_LIMIT) {
    return; // stop the page from handling more clicks
  }

  var targetString = event.target.src;
  // receive clicks on those displayed images, and track those clicks for each image.
  // track how many times each image is displayed, for statistical purposes.
  matchClicks(targetString);
  changePictures(); // prevent images from repeating in the same display


  // display charted results after 25 selections have been made
  if (TOTAL_CLICKS > COLLECT_LIMIT) {
    var dataArea = document.getElementById('data_area');
    dataArea.textContent = 'BusMall thanks you for your ' + COLLECT_LIMIT + ' clicks and your participation!';

    renderChart(); // show results on a chart
  }

  // add persistence by using local storage to store your voting data! The goal is to have all of your data persist through a page refresh or through completely closing the browser
  // turn the updated IMAGE_OBJECT_ARRAY into a JSON string and set it to a variable
  var imgObjArrJSON = JSON.stringify(IMAGE_OBJECT_ARRAY); // set the JSON string as a value for the key: imageObjectArray
  localStorage.setItem('imageObjectArray', imgObjArrJSON); // updated IMAGE_OBJECT_ARRAY (with data) now exists in local storage as a JSON string
}

function matchClicks(targetString) {
  var targetPath = targetString.split('images')[1];
  var itemPath;
  var displayIndex;

  // keep track of how many times a product was shown
  for (var i = 0; i < DISPLAY_INDICES.length; i++) {
    displayIndex = DISPLAY_INDICES[i];
    IMAGE_OBJECT_ARRAY[displayIndex].numTimesShown += 1;
  }

  // every time a the targetPath of an event matches the itemPath, increase its click count and the total click count
  for (i = 0; i < IMAGE_OBJECT_ARRAY.length; i++) {
    itemPath = IMAGE_OBJECT_ARRAY[i].path.split('images')[1];
    if (itemPath === targetPath) {
      IMAGE_OBJECT_ARRAY[i].clicked += 1; // increase the clicked property of the object
      TOTAL_CLICKS += 1; // increase the total clicks count
    }
  }
}

// select three random photos from the image directory and display them side-by-side-by-side in the browser window; managing the size and the aspect ratio of the images.
function changePictures() {
  var leftImage = document.getElementById('left_image');
  var middleImage = document.getElementById('middle_image');
  var rightImage = document.getElementById('right_image');
  var indices = generateRandomUniqueIndexes();

  leftImage.src = IMAGE_OBJECT_ARRAY[indices[0]].path;
  middleImage.src = IMAGE_OBJECT_ARRAY[indices[1]].path;
  rightImage.src = IMAGE_OBJECT_ARRAY[indices[2]].path;

  DISPLAY_INDICES = indices;

  // Upon receiving a click, three new non-duplicating random images need to be automatically displayed. In other words, the three images that are displayed should contain no duplicates, nor should they duplicate with any images that we displayed immediately before
  function generateRandomUniqueIndexes() {
    var uniqueIndices = [];
    var uniqueIndex;

    for (var i = 0; i < DISPLAY_INDICES.length; i++) { // 3 reps to get 3 numbers
      do {
        uniqueIndex = generateRandomNumber(); // generate random number for uniqueIndex
      } while (uniqueIndices.indexOf(uniqueIndex) !== -1 || // check to see if uniqueIndex is in var uniqueIndices array
      DISPLAY_INDICES.indexOf(uniqueIndex) !== -1); // check to see if uniqueIndex is in DISPLAY_INDICES[]

      uniqueIndices.push(uniqueIndex); // if not, add it into var uniqueIndices array
    }

    return uniqueIndices;
  }

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
        },
        {
          label: '% of Clicks When Viewed',
          data: makeArraysOfImageProperties(IMAGE_OBJECT_ARRAY)[3], //graph data of percentageClickedVsShown
          backgroundColor: '#ffae19',
          borderColor: '#ffa500',
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
    var arrayOfPercentageClickedVsShown = [];
    var percentage = 0;

    // use a for loop to populate arrays for each property from the IMAGE_OBJECT_ARRAY
    for (var i = 0; i < IMAGE_OBJECT_ARRAY.length; i++){
      arrayOfNames.push(IMAGE_OBJECT_ARRAY[i].name);
      arrayOfClicked.push(IMAGE_OBJECT_ARRAY[i].clicked);
      arrayOfNumTimesShown.push(IMAGE_OBJECT_ARRAY[i].numTimesShown);
      // The marketing team is not only interested in the total number of clicks, but also the percentage of times that an item was clicked when it was shown. So, you'll also need to keep track of how many times each image is displayed and do the calculations.
      percentage = IMAGE_OBJECT_ARRAY[i].clicked / IMAGE_OBJECT_ARRAY[i].numTimesShown * 100;
      arrayOfPercentageClickedVsShown.push(percentage);
    }

    // to access either array outside the function, call makeArraysOfImageProperties(IMAGE_OBJECT_ARRAY)[i]
    return [arrayOfNames, arrayOfClicked, arrayOfNumTimesShown, arrayOfPercentageClickedVsShown];
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
