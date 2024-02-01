let currSong = new Audio(); //Current song which is playing is stored in currSong
let play = document.getElementById('play'); //image of play button

async function fetchsongs() {
    let a = await fetch('http://127.0.0.1:5500/songs/');
    let response = await a.text();
    let div = document.createElement('div');
    div.innerHTML = response;
    let as = div.getElementsByTagName('a');
    let songs = []
    for (let index = 0; index < as.length; index++) {
        const elements = as[index];
        if (elements.href.endsWith('.mp3')) {
            songs.push(elements.href.split('com')[1])
        }
    }
    return songs;
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
    currSong.src = '/songs/y2mate.com' + track;
    play.src = 'img/pause.svg'
    console.log(decodeURI(currSong.src));
    //displaying name of current song on song bar
    document.querySelector('.songname').innerHTML = decodeURI(currSong.src).split('-')[1];
    let circle = document.querySelector('.circle');
    currSong.play();
}

async function main() {
    let songs = await fetchsongs();
    let songsUl = document.querySelector('.songsList').getElementsByTagName('ul')[0];
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
            console.log(e.querySelector('.info').innerHTML);
            /*
            on which ever music we click it will start playing by calling playMusic() function
            here e is the current song on which we are clicking which is a (li) which is added using JS above 
            */
            playMusic(e.querySelector('.info').innerHTML)

        })
    })

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
        console.log(e);
        let offsetX = e.offsetX;
        // let width = e.cli

    })

}
main();