const musicContainer = document.querySelector('.music-container')
const playBtn = document.querySelector('#play')
const prevBtn = document.querySelector('#prev')
const nextBtn = document.querySelector('#next')
const audio = document.querySelector('#audio')
const progress = document.querySelector('.progress')
const progressContainer = document.querySelector('.progress-container')
const bg = document.body


const title = document.querySelector('#title')
const cover = document.querySelector('#cover')
const sidebar = document.querySelector('#sidebar')
const musiclist = document.querySelector('#musiclist')

const volSlider = document.querySelector('#volume-control')

const currTimeTxt = document.querySelector('#current-time')
const lengthTxt = document.querySelector('#track-length')
const volumeContainer = document.querySelector('.volume-container')

const loopBtn = document.querySelector('#loop')
const shuffleBtn = document.querySelector('#shuffle')
const playlistBtn = document.querySelector('#playlist')

const songsType =  document.querySelectorAll('input[name="songs"]')

var shuffleModeOn = true


var songs= []
var songsList= []

let songIndex  = 0
let activeList  = 2

var songTitle=""
var songBg ="https://dummyimage.com/512x512"



class Song{
    constructor(title,link,img){
        this.title =title;
        this.link =link;
        this.img =img;
    }
}



function ActiveListType(type){
    if(type == 0){
        return "Data/ops.json"
    }
    else if(type == 1){
        return "Data/eds.json"
    }
    else if(type == 2){
        return "Data/ost.json"
    }
    else if(type == 3){
        return "Data/all.json"
    }
    else{
        window.alert("Error Loading Data");
        return ""
    }
}

//load openings from url
function readTextFile(file, callback) {
    var rawFile = new XMLHttpRequest();
    rawFile.overrideMimeType("application/json");
    rawFile.open("GET", file, true);
    rawFile.onreadystatechange = function() {
        if (rawFile.readyState === 4 && rawFile.status == "200") {
            callback(rawFile.responseText);
        }
    }
    rawFile.send(null);
}

//usage:


function getDataFromJson(type){
    readTextFile(ActiveListType(type), function(text){
    
        songsList = JSON.parse(text);
        songsList.forEach(element => {
            
            let song = new Song()
            song.title = element['name']
            song.link = element['link']
            .replace('download','stream')
            .replace('https://www.dropbox.com/','https://dl.dropbox.com/')
            song.img = element['img']
    
            songs.push(song)
        });
        
    
        console.log("Img: " + songs[5].title)
        populateSongs()
        
        var startVal = parseInt(Math.random() * (songs.length - 0) + 0)
        console.log("songs.length" + songs.length + "\n Start Val: " + startVal)
        songIndex = startVal
    
        loadSong(songs[songIndex])
        
        
    }); 
}



//update song details
function loadSong(song_){
    title.innerText = song_.title
    audio.src = song_.link
    cover.src = song_.img
    bg.style.backgroundImage = `url(${song_.img})`
    bg.style.backgroundRepeat = "no-repeat"
    bg.style.backgroundSize  = "cover"
    songTitle = song_.title
    songBg =song_.img
    
}



function populateSongs() {
    var ul = document.getElementById("musiclist");

    songs.forEach(element => {
    var li = document.createElement("li");
    //li.classList.add("")
    li.appendChild(document.createTextNode(element.title));

    li.addEventListener('click',function(){
        loadSong(element)
        playSong()
    })
    ul.appendChild(li);
    })
    
  }



function playSong(){
    musicContainer.classList.add('play')
    playBtn.querySelector('i.fas').classList.remove('fa-play')
    playBtn.querySelector('i.fas').classList.add('fa-pause')
    audio.play()
    updateMeta()
}

function pauseSong(){
    musicContainer.classList.remove('play')
    playBtn.querySelector('i.fas').classList.remove('fa-pause')
    playBtn.querySelector('i.fas').classList.add('fa-play')
    audio.pause()
    updateMeta()

}

function prevSong(){
    audio.currentTime = 0
    progress.style.width = audio.currentTime
    songIndex--
    if(songIndex < 0){
        songIndex = songs.length - 1
    }

    loadSong(songs[songIndex])

    playSong()

}

function nextSong(){
    audio.currentTime = 0
    progress.style.width = audio.currentTime
    if(shuffleModeOn){
        songIndex = parseInt(Math.random() * (songs.length - 0) + 0)
        loadSong(songs[songIndex])
        playSong()

    }

    else{
        songIndex++
        if(songIndex > songs.length-1){
            songIndex = 0
        }
        loadSong(songs[songIndex])
        playSong()

    }
}

//event listeners
playBtn.addEventListener('click',()=>{

    const isPlaying = musicContainer.classList.contains('play')

    if(isPlaying){
        pauseSong()
    }
    else{
        playSong()

    }

})

function updateProgress(e){
   const {duration,currentTime} = e.srcElement
   const progressPercent = (currentTime / duration) * 100 
   progress.style.width = `${progressPercent}%`

    var ss = new Date(0);

    ss.setSeconds(currentTime); 
    var ssVal = `${format_two_digits(ss.getMinutes())}:${format_two_digits(ss.getSeconds())}`

    ss.setSeconds(duration); 
    var mmVal   = `${format_two_digits(ss.getMinutes())}:${format_two_digits(ss.getSeconds())}`

    if(audio.currentTime > 0){
        currTimeTxt.innerText= ssVal
        lengthTxt.innerText = mmVal
    }

}

function format_two_digits(n) {
    return n < 10 ? '0' + n : n;
}



function setProgress(e){
    const width = this.clientWidth
    const clickX = e.offsetX
    const duration = audio.duration

    //skip to a specific time using mouse click
    audio.currentTime = (clickX/width) * duration
}


function changeVolume(e){
    audio.volume = e.currentTarget.value / 100
    
}

function volumeUp(){
audio.volume = Math.min(1, Math.round((audio.volume + 0.1) * 10) / 10);
//volumeContainer.classList.add("visible")
//display animation
updateMeta()

}

function volumeDown(){
    audio.volume = Math.max(0, Math.round((audio.volume - 0.1) * 10) / 10);
    //volumeContainer.classList.remove("visible")
//display animation
updateMeta()

}

  function timeForward(){
    audio.currentTime = Math.min(audio.duration,audio.currentTime + 5);
  }

  function timeRewind(){
      audio.currentTime = Math.max(0,audio.currentTime-5)
 }

  	// function to replay the current track
	function playAgain() {
		audio.currentTime = 0;
        updateMeta()
	}

  	// Functions to handle fullscreen
	function isFullscreen() {
		return Boolean(document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement);
	}

  function toggleFullscreen() {
    if (isFullscreen()) {
        if (document.exitFullscreen) document.exitFullscreen();
        else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
        else if (document.mozCancelFullScreen) document.mozCancelFullScreen();
        else if (document.msExitFullscreen) document.msExitFullscreen();
    } else {
        const e = document.getElementsByTagName("html")[0];
        if (e.requestFullscreen) e.requestFullscreen();
        else if (e.webkitRequestFullscreen) e.webkitRequestFullscreen();
        else if (e.mozRequestFullScreen) e.mozRequestFullScreen();
        else if (e.msRequestFullscreen) e.msRequestFullscreen();
    }
}


  function handleKeyUp(e) {
    if(e.keyCode === 32) {	// p
        const isPlaying = musicContainer.classList.contains('play')

        if(isPlaying){
            pauseSong()
        }
        else{
            playSong()
        }
    }
    else if(e.keyCode === 78) {	// n
        nextSong();
    }
    else if(e.keyCode === 82) {	// r
        playAgain();
    }
    else if(e.keyCode === 70) {	// f
        toggleFullscreen();
    }
    else if(e.keyCode === 76) {	// l
        prevSong();
    }
    else {
        return;
    }
}

function handleKeyDown(e) {
    switch (e.keyCode) {
        case 37: 	// Left Arrow
        timeRewind();
        break;
    case 38: 	// Up Arrow
        volumeUp();
        break;
    case 39: 	// Right Arrow
        timeForward();
        break;
    case 40: 	// Down Arrow
        volumeDown();
        break;
    }
}


function toggleShuffle(){
    if(shuffleBtn.querySelector('i.fas').classList.contains('fa-random')){
        shuffleBtn.querySelector('i.fas').classList.remove('fa-random')
        shuffleBtn.querySelector('i.fas').classList.add('fa-grip-lines')
        shuffleModeOn = false
    }
    else{
        shuffleBtn.querySelector('i.fas').classList.remove('fa-grip-lines')
        shuffleBtn.querySelector('i.fas').classList.add('fa-random')
        shuffleModeOn = true
    }

}
   
function togglePlaylist(){
    
    if(sidebar.classList.contains('hidden')){
        sidebar.classList.remove('hidden')
        playlistBtn.querySelector('i.fas').classList.remove('fa-list')
        playlistBtn.querySelector('i.fas').classList.add('fa-times')

    }
    else{
        sidebar.classList.add('hidden')
        playlistBtn.querySelector('i.fas').classList.remove('fa-times')
        playlistBtn.querySelector('i.fas').classList.add('fa-list')
    }
}

getDataFromJson(0)

window.addEventListener('keyup', (e) => handleKeyUp(e));	// attach keyup event on window
window.addEventListener('keydown', (e) => handleKeyDown(e)); //  attach keydown event on window

//change song events
prevBtn.addEventListener('click',prevSong)
nextBtn.addEventListener('click',nextSong)


audio.addEventListener('timeupdate',updateProgress)
audio.addEventListener('ended',nextSong)

audio.addEventListener('canplay',playSong)

audio.addEventListener('playing',function(){
    musicContainer.classList.add('play')
    playBtn.querySelector('i.fas').classList.remove('fa-play')
    playBtn.querySelector('i.fas').classList.add('fa-pause')
    updateMeta()
})


progressContainer.addEventListener('click',setProgress)

volSlider.addEventListener("change",changeVolume)

shuffleBtn.addEventListener('click',toggleShuffle)
playlistBtn.addEventListener('click',togglePlaylist)

songsType[0].addEventListener('click',function(){
    
    musiclist.innerHTML=""
    songsList.length =""
    songs.length =""
    getDataFromJson(0)
    populateSongs()
})

songsType[1].addEventListener('click',function(){

    musiclist.innerHTML=""
    songsList.length =""
    songs.length =""
    getDataFromJson(1)
    populateSongs()
})

songsType[2].addEventListener('click',function(){

    musiclist.innerHTML=""
    songsList.length =""
    songs.length =""
    getDataFromJson(2)
    populateSongs()
})   


function updateMeta(){
    navigator.mediaSession.metadata = new MediaMetadata({
        title: songTitle,
        artist: '',
        album: '',
        artwork: [
          { src: songBg,   sizes: '96x96',   type: 'image/png' },
          { src: songBg, sizes: '128x128', type: 'image/png' },
          { src: songBg, sizes: '192x192', type: 'image/png' },
          { src: songBg, sizes: '256x256', type: 'image/png' },
          { src: songBg, sizes: '384x384', type: 'image/png' },
          { src: songBg, sizes: '512x512', type: 'image/png' },
        ]
      });
}

if ('mediaSession' in navigator) {
    navigator.mediaSession.setActionHandler('play', playSong);
    navigator.mediaSession.setActionHandler('pause', pauseSong);
    navigator.mediaSession.setActionHandler('stop', function() { /* Code excerpted. */ });
    navigator.mediaSession.setActionHandler('seekbackward', function() { /* Code excerpted. */ });
    navigator.mediaSession.setActionHandler('seekforward', function() { /* Code excerpted. */ });
    navigator.mediaSession.setActionHandler('seekto', function() { /* Code excerpted. */ });
    navigator.mediaSession.setActionHandler('previoustrack', prevSong);
    navigator.mediaSession.setActionHandler('nexttrack', nextSong);
    navigator.mediaSession.setActionHandler('skipad', function() { /* Code excerpted. */ });
  }

