var concat = require('ffmpeg-concat')
var helpers = require('./lib/helpers')

// 3 paths with default duration 5 seconds for the pictures
//example0.mp4
// var paths = [
//   { "path": 'bkg1.png',},
//   { "path": 'snow2.mp4'},
//   { "path": 'bkg2.png',},
// ];
// var defaultParams = { d:5 }

// 3 paths with default duration 5 seconds for the pictures, 2 secs for the 1st pict
// example1.mp4
//  var paths = [
//   { "path": 'bkg1.png',"d":2},
//   { "path": 'snow2.mp4'},
//   { "path": 'bkg2.png',},
// ];
// var defaultParams = { d:5 }

// 3 paths with default duration 5 seconds for the pictures, 2 secs for the 1st pict
// 1 logo by default. position is (0,0) when not defined
// example2.mp4
// var paths = [
//   { "path": 'bkg1.png',"d":2},
//   { "path": 'snow2.mp4'},
//   { "path": 'bkg2.png',},
// ];
// var defaultParams = { d:5 ,"logo":"logo1.png"}

// 3 paths with default duration 5 seconds for the pictures, 2 secs for the 1st pict
// 1 logo by default position, 1 logoPosition by default
// example3.mp4
// var paths = [
//   { "path": 'bkg1.png',"d":2},
//   { "path": 'snow2.mp4'},
//   { "path": 'bkg2.png',},
// ];
// var defaultParams = { d:5 ,"logo":"logo1.png","logoPosition":{ x:1600,y:800 }}

// 3 paths with default duration 5 seconds for the pictures, 2 secs for the 1st pict
// 1 logo by default position, 1 logoPosition by default
// snow2.mp4 has a customized logo and customized position
// example4.mp4
// var paths = [
//   { "path": 'bkg1.png',"d":2},
//   { "path": 'snow2.mp4',"logo":"logo2.png","logoPosition":{ x:1600,y:0 }},
//   { "path": 'bkg2.png',},
// ];
// var defaultParams = { d:5 ,"logo":"logo1.png","logoPosition":{ x:1600,y:800 }}

// 3 paths with default duration 5 seconds for the pictures, 2 secs for the 1st pict
// 1 logo by default position, 1 logoPosition by default
// snow2.mp4 has no logo
// example5.mp4
// var paths = [
//   { "path": 'bkg1.png',"d":2},
//   { "path": 'snow2.mp4',"logo":""},
//   { "path": 'bkg2.png',},
// ];
// var defaultParams = { d:5 ,"logo":"logo1.png","logoPosition":{ x:1600,y:800 }}

// 3 paths with default duration 5 seconds for the pictures, 2 secs for the 1st pict
// 1 logo by default position, 1 logoPosition by default
// snow2.mp4 has no logo
// snow3.mp4 and bkg1.mp4 have a caption
// example6.mp4
// fyi trying also different transition here
var paths = [
  // { "path": 'bkg1.png',"d":4,"caption":'4{\\pos(200,200)}{\\fs(32)}\\Nmins old'},
  { "path": 'bkg1.png',"d":4,"caption":'first slide'},
  { "path": 'snow2.mp4',"logo":"","caption":"no logo, but caption :)"},
  // { "path": 'bkg2.png'}
];
var defaultParams = { d:5 ,"logo":"logo1.png","logoPosition":{ x:1600,y:800 }}


var subtitleStyle= {
  "Fontname": "Verdana",
  "Fontsize": "26",
  "PrimaryColour": "11861244",
  "SecondaryColour": "11861244",
  "TertiaryColour": "11861244",
  "BackColour": "-2147483640",
  "Bold": "2",
  "Italic": "0",
  "BorderStyle": "2",
  "Outline": "2",
  "Shadow": "3",
  "Alignment": "1",
  "MarginL": "40",
  "MarginR": "60",
  "MarginV": "40"
};

params =  {
  paths:paths,
  subtitleStyle:subtitleStyle,
  // transition:{name: 'directionalWipe',duration: 500  },
  transitions: [
    // {
    //   name: 'circleOpen',
    //   duration: 500
    // },
    // {
    //   name: 'crossWarp',
    //   duration: 800
    // },
    // {
    //   name: 'directionalWipe',
    //   duration: 500,
    //   // pass custom params to a transition
    // },
    {
      name: 'squaresWire',
      duration: 500
    }
  ],
  defaultParams:defaultParams,
  // audio:"song.mp3",
  output:"output0.mp4"
}

helpers.createSubtitles(params);
helpers.createvideos(params,function(params) {concat(params)} )
