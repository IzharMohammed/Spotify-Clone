

async function fetchsongs() {
    let a = await fetch('http://127.0.0.1:5500/songs/');
    let response = await a.text();
    // console.log(response);
    let div = document.createElement('div');
    div.innerHTML = response;
    // console.log(div);
    let as = div.getElementsByTagName('a')
    //    console.log(as);
    let songs = []
    for (let index = 0; index < as.length; index++) {
        const elements = as[index];
        if (elements.href.endsWith('.mp3')) {
            songs.push(elements.href.split('com')[1])
        }
    }
    return songs;

}


async function main() {
    let songs = await fetchsongs()

    // console.log(songs);
    let songsUl = document.querySelector('.songsList').getElementsByTagName('ul')[0]
    for (const song of songs) {
        songsUl.innerHTML = songsUl.innerHTML+ `<li>${song.replaceAll('%20',' ')}</li>`
        // console.log(songsUl.innerHTML);
        console.log(song);
    }
    // var audio = new Audio(songs[6]);
    // audio.play();
}
main()