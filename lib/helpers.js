var ffmpeg = require('fluent-ffmpeg')
var fs = require('fs')
var key = 'temptFKCCkvh6qyurDVw16fNX3TtVw76Ba8oN_'

async function addparams (vids, params, callback) {
  var promArray = []
  var i = vids.length
  var newImages = []
  for (var i = 0; i < vids.length; i++) {
    var path = params['paths'][i]
    var logo = ''
    if (path.hasOwnProperty('logo')) {
      logo = path['logo']
    } else if (params['defaultParams'].hasOwnProperty('logo')) {
      logo = params['defaultParams']['logo']
    }
    const output = key + i + '.mp4'
    const input = './' + vids[i]
    const index = i
    if (logo !== '') {
      const img = './' + logo
      var x = 0
      var y = 0
      if (path.hasOwnProperty('logoPosition')) {
        x = path['logoPosition'].x
        y = path['logoPosition'].y
      } else if (params['defaultParams'].hasOwnProperty('logoPosition')) {
        x = params['defaultParams']['logoPosition'].x
        y = params['defaultParams']['logoPosition'].y
      } else {
        console.error('missing positions for logos')
      }
      const posX = x
      const posY = y
      const p = new Promise((resolve, reject) => {
        ffmpeg(input)
          .input(img)
          .complexFilter([
            { filter: 'overlay', options: { x: posX, y: posY }, outputs: '[output1]' },
            { filter: 'ass=' + index + '.ass', inputs: '[output1]' }
          ])
          .outputOptions(['-c:a copy'])
          .output(output)
          .on('end', function () {
            resolve({ index: index })
          }).on('error', function (err) {
            console.error(err)
          }).run()
      })
      promArray.push(p)
    } else {
      const p = new Promise((resolve, reject) => {
        ffmpeg()
          .input(input)
          .outputOptions(['-vf ass=' + index + '.ass', '-c:a copy'])
          .output(output)
          .on('end', function () {
            resolve({ index: index })
          }).on('error', function (err) {
            console.error(err)
          }).run()
      })
      promArray.push(p)
    }
    // cmd = 'ffmpeg -i vids/out2.mp4 -vf "ass=subtitles.ass" -c:a copy movieWithSubtitles.mp4'
  }

  await Promise.all(promArray).then(values => {
    for (var i = 0; i < values.length; i++) {
      vids[i] = key + values[i].index + '.mp4'
    }
    console.log(values)
    params['videos'] = vids
    callback(params)
  })
}
function createSubtitles (params) {
  for (var i = 0; i < params['paths'].length; i++) {
    createAssFile(params, i)
  }
}
function createAssFile (params, index) {
  console.log(params)

  var path = params['paths'][index]
  var text = ''
  if (path.hasOwnProperty('caption')) {
    text = path['caption']
  }
  // var text = params["subtitles"][index];
  var subtitleStyle = params['subtitleStyle']
  var keys = Object.keys(subtitleStyle)
  var values = Object.values(subtitleStyle)
  var tempStr0 = 'Format: Name, '
  var tempStr1 = 'Style: DefaultVCD,'
  for (var i = 0; i < keys.length; i++) {
    if (i === (keys.length - 1)) {
      tempStr0 += keys[i] + ' AlphaLevel, Encoding'
      tempStr1 += values[i] + '0,0'
    } else {
      tempStr0 += keys[i] + ', '
      tempStr1 += values[i] + ','
    }
  }
  console.log(tempStr0)
  console.log(tempStr1)
  console.log('**********')
  var temp = '[Script Info]\nCollisions: Normal\nPlayDepth: 0\nTimer: 100,0000\n\n[Empty]\n\n[V4 Styles]\n' +
  // "Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, TertiaryColour, BackColour, Bold, Italic, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, AlphaLevel, Encoding\n"+
  // "Style: DefaultVCD,Verdana,12,11861244,11861244,11861244,-2147483640,-1,0,1,1,2,2,30,30,30,0,0\n"+
  'format123\n' +
  'style123\n' +
  '\n[Events]\n' +
  'Format: Marked, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text\n' +
  'Dialogue: Marked=0,0:00:00.00,0:00:100.00,DefaultVCD,NTP,0000,0000,0000,,abc123'
  temp = temp.replace('format123', tempStr0)
  temp = temp.replace('style123', tempStr1)
  console.log('01 CAPTION', text)
  // text = text.replace(/\\/g, '') // remove any backslashes
  temp = temp.replace('abc123', text)
  console.log('02 CAPTION', JSON.stringify(text))
  console.log(temp)
  var myfile = index + '.ass'
  fs.writeFile(myfile, temp, (err) => {
    if (err) throw err
  })
}

async function createvideos (params, callback) {
  var vids = []
  console.log(params)
  var promArray = []
  var paths = params['paths']
  var newImages = []
  for (var i = 0; i < paths.length; i++) {
    var path = paths[i]
    const input = './' + paths[i]['path']
    // const img = "./"+logos[i];
    const output = i + '.mp4'
    const index = i
    if (path['path'].split('.')[1] != 'mp4') {
      // var tempd = params["durations"][0]
      // if( !hasOnlyOneDuration )
      // {
      //    tempd = params["durations"][i]
      // }
      var tempd
      if (path.hasOwnProperty('d')) {
        tempd = path['d']
      } else if (params['defaultParams'].hasOwnProperty('d')) {
        tempd = params['defaultParams']['d']
      } else {
        var errMsg = 'd not defined for path:' + path['path']
        errMsg += ' To fix this, set d for path or set d in defaultParams \n'
        throw errMsg
      }
      const d = tempd
      const p = new Promise((resolve, reject) => {
        ffmpeg()
          .input(input)
          .loop(1)
          .outputOptions('-c:v libx264')
          .outputOptions('-t ' + d)
          .outputOptions('-pix_fmt yuv420p')
          .output(output)
          .on('end', function () {
            console.log(input)
            resolve({ index: index })
          }).on('error', function (err) {
            console.error(err)
          }).run()
      })
      promArray.push(p)
    } else {
      vids[i] = paths[i]['path']
    }
  }
  await Promise.all(promArray).then(values => {
    for (var i = 0; i < values.length; i++) {
      index = values[i].index
      vids[index] = index + '.mp4'
    }
    console.log(values)
    console.log(vids)
    addparams(vids, params, callback)
    // callback("newoutput.m4a",vids,params["transition"]);
  })
}

async function createvid (imgs) {
  var vids = []
  var promArray = []
  var i = imgs.length
  var newImages = []
  for (var i = 0; i < imgs.length; i++) {
    const input = './' + imgs[i]
    // const img = "./"+logos[i];
    const output = i + '.mp4'
    const index = i
    const p = new Promise((resolve, reject) => {
      ffmpeg()
        .input(input)
        .loop(1)
        .outputOptions('-c:v libx264')
        .outputOptions('-t 10')
        .outputOptions('-pix_fmt yuv420p')
        .output(output)
      // fps: 25,
      // loop: 5, // seconds
      // transition: true,
      // transitionDuration: 1, // seconds
      // videoBitrate: 1024,
      // .videoBitrate(1024)
      // .loop(5)
        .on('end', function () {
          console.log(input)
          resolve({ index: 'done' })
        }).on('error', function (err) {
          console.error(err)
        }).run()
    })
    promArray.push(p)
  }

  await Promise.all(promArray).then(values => {
    console.log(values)
  })
}

function removeTemp (tempFiles) {
  for (var i = 0; i < tempFiles.length; i++) {
    fs.unlink(tempFiles[i], function (err) {
      if (err) throw err
      console.log('File deleted!')
    })
  }
}

module.exports.removeTemp = removeTemp
module.exports.createvideos = createvideos
module.exports.createSubtitles = createSubtitles
