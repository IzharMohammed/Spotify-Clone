let currSong = new Audio(); //Current song which is playing is stored in currSong
let play = document.getElementById('play'); //image of play button
let songs;
let currfolder

async function fetchsongs(folder) {
    currfolder=folder
    // console.log((currfolder));
    let a = await fetch(`http://127.0.0.1:5500/${currfolder}/`);
    let response = await a.text();
    let div = document.createElement('div');
    div.innerHTML = response;
    let as = div.getElementsByTagName('a');
     songs = []
    for (let index = 0; index < as.length; index++) {
        const elements = as[index];
        if (elements.href.endsWith('.mp3')) {
            songs.push(elements.href.split('com')[1])
        }
    }


    let songsUl = document.querySelector('.songsList').getElementsByTagName('ul')[0];
    songsUl.innerHTML=''
    //we are not creating dom and attaching to ul instead we are directly attaching li's of all songs to ul
    for (const song of songs) {
        songsUl.innerHTML = songsUl.innerHTML + `
        <li>
                    <img id="invert" src="img/music.svg" alt="">
                    <div class='info'>${song.replaceAll('%20', ' ')}</div>
               
                    <div>Play now</div>
                    <img id="invert" src="img/play.svg" alt="">
                
                </li>`
    }
    /*
    we are selecting songlist ul and inside it selecting all songs(li) using  getElementsByTagName and using  Array.from() we are
     storing all songs in an array and we  are traversing through that array using forEach() and adding eventListener on which ever song we want to click
    */
    Array.from(document.querySelector('.songsList').getElementsByTagName('li')).forEach(e => {
        e.addEventListener('click', element => {
            // console.log(e.querySelector('.info').innerHTML);
            /*
            on which ever music we click it will start playing by calling playMusic() function
            here e is the current song on which we are clicking which is a (li) which is added using JS above 
            */
            playMusic(e.querySelector('.info').innerHTML)

        })
    })

    // return songs;
}

function secondsToMinutes(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');
    return `${formattedMinutes}:${formattedSeconds}`;
}

function playMusic(track) {
    // let audio =new Audio('/songs/y2mate.com'+track);
    currSong.src = `/${currfolder}/y2mate.com` + track;
    play.src = 'img/pause.svg'
    // console.log(decodeURI(currSong.src));
    //displaying name of current song on song bar
    document.querySelector('.songname').innerHTML = decodeURI(currSong.src).split('-')[1];
    // let circle = document.querySelector('.circle');
    currSong.play();
}



async function displayAlbums(){
    let a = await fetch(`http://127.0.0.1:5500/songs/`);
    let response = await a.text();
    let div = document.createElement('div');
    div.innerHTML = response;
    // console.log(div);
    let as = div.getElementsByTagName('a');
    // console.log(as.href);

        let array = Array.from(as)
        for (let index = 0; index < array.length; index++) {
            const e = array[index];
    // console.log(e.href);
  if(e.href.includes('/songs/')){
         let folder = e.href.split('songs/')[1];
         let a = await fetch(`http://127.0.0.1:5500/songs/${folder}/info.json`);
         let response = await a.json();
        //  console.log(response);
        let container = document.querySelector('.playlists')
        container.innerHTML=container.innerHTML + `
        <div data-folder=${folder} class="cards">
        <img src="songs/${folder}/cover.jpg" alt="" />
        <h3>${response.title}</h3>
        <p>${response.description}</p>
      </div>
        `

//load the playlist whenever card is clicked
Array.from(document.getElementsByClassName('cards')).forEach(e=>{
    // console.log(e);
    e.addEventListener('click', async item=>{
    //  console.log(item.currentTarget.dataset.folder);
   await fetchsongs(`songs/${item.currentTarget.dataset.folder}`);

    })
})
  }
}

}





async function main() {
     await fetchsongs("songs/ncs");


    displayAlbums()

    //Adding eventListener to play image if we click on play image the song which is stored in currSong starts plays and viceversa
    play.addEventListener('click', () => {
        if (currSong.paused) {
            currSong.play();
            play.src = 'img/pause.svg'
        } else {
            currSong.pause()
            play.src = 'img/play.svg'
        }
    })

    //on music bar it will update the time of music and duration of music using timeupdate eventListener
    currSong.addEventListener('timeupdate', () => {
        // console.log(`time : ${currSong.currentTime} duration : ${currSong.duration}`);
        document.querySelector('.songtime').innerHTML = `${secondsToMinutes(currSong.currentTime)} / ${secondsToMinutes(currSong.duration)}`
        document.querySelector('.circle').style.left = (currSong.currentTime / currSong.duration) * 100 + '%'
    })


    document.querySelector('.seekbar').addEventListener('click', e => {
        document.querySelector('.circle').style.left = (e.offsetX / e.target.getBoundingClientRect().width) * 100 + '%'
        currSong.currentTime = ((currSong.duration) * (e.offsetX / e.target.getBoundingClientRect().width) * 100) / 100
    })

    document.querySelector('.hamburger').addEventListener('click', (e) => {
        // console.log(e.target);
        document.querySelector('.left').style.left = '0px'
    })

    document.querySelector('.close').addEventListener('click', e => {
        document.querySelector('.left').style.left = '-100%'

    })


    console.log(songs);
    document.querySelector('.nextSong').addEventListener('click', (e) => {
        console.log(currSong.src.split('com'))
    console.log(songs);
       
          console.log(songs.indexOf( currSong.src.split('com')[1]));
          let indexOfCurrSong = songs.indexOf( currSong.src.split('com')[1])
          if(indexOfCurrSong+1< songs.length)
          playMusic(songs[indexOfCurrSong+1])
          // console.log(indexOfCurrSong+1 ,'<', songs.length)
      })
    

    document.querySelector('.preSong').addEventListener('click', (e) => {
      console.log(currSong.src)

        let indexOfCurrSong = songs.indexOf( currSong.src.split('com')[1])
        if(indexOfCurrSong>0)
        playMusic(songs[indexOfCurrSong-1])
    })

}
main();