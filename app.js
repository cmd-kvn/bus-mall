//***************************************************************************************************************************
// author: Kevin Wong
// date: 11/28/16
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

// create a constructor function that creates an object associated with each image, and has (at a minimum) properties for the name of the image, its filepath, the number of times it has been shown, and the number of times it has been clicked.
function ImageObject(paths) {
  this.name = paths;
  this.path = 'images/' + paths;
  this.clicked = 0;
  this.numTimesShown = 0;
}

// create an array of objects representing each image
for (var i = 0; i < PATHS_ARRAY.length; i++) {
  var photo = new ImageObject(PATHS_ARRAY[i]); // create an object for each image
  IMAGE_OBJECT_ARRAY.push(photo); // push the photo object into the IMAGE_OBJECT_ARRAY
}
//console.log(PATHS_ARRAY);

// select three random photos from the image directory and display them side-by-side-by-side in the browser window; managing the size and the aspect ratio of the images.

// receive clicks on those displayed images, and track those clicks for each image.
// track how many times each image is displayed, for statistical purposes.
// prevent images from repeating in the same display

// Upon receiving a click, three new non-duplicating random images need to be automatically displayed. In other words, the three images that are displayed should contain no duplicates, nor should they duplicate with any images that we displayed immediately before


// display results after 25 selections have been made

// The marketing team is not only interested in the total number of clicks, but also the percentage of times that an item was clicked when it was shown. So, you'll also need to keep track of how many times each image is displayed and do the calculations.
var displayLeftIndex = 0;
var displayMiddleIndex = 0;
var displayRightIndex = 0;

function changePictures() {
  var leftImage = document.getElementById('left_image');
  var middleImage = document.getElementById('middle_image');
  var rightImage = document.getElementById('right_image');
  var randomLeftIndex = generateRandomNumber();
  var randomMiddleIndex = generateRandomNumber();
  var randomRightIndex = generateRandomNumber();

  // generate random index number for the indecies
  while (displayLeftIndex === randomLeftIndex) {
    randomLeftIndex = generateRandomNumber();
  }
  while (displayMiddleIndex === randomMiddleIndex) {
    randomMiddleIndex = generateRandomNumber();
  }
  while (displayRightIndex === randomRightIndex) {
    randomRightIndex = generateRandomNumber();
  }

  // verify that random indecies aren't the same
  while (randomLeftIndex === randomMiddleIndex || randomLeftIndex === randomRightIndex) {
    randomLeftIndex = generateRandomNumber();
  }
  while (randomMiddleIndex === randomRightIndex) {
    randomMiddleIndex = generateRandomNumber();
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
