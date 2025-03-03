const animeRecommendations = [
    {
        title: 'My Hero Academia',
        imageUrl: 'https://images.everyeye.it/img-notizie/my-hero-academia-anime-verrA-presentato-comic-new-york-v6-672104-1200x1200.webp'
    },
    {
        title: 'Demon Slayer: Kimetsu no Yaiba',
        imageUrl: 'https://m.media-amazon.com/images/M/MV5BZjZjNzI5MDctY2Y4YS00NmM4LTljMmItZTFkOTExNGI3ODRhXkEyXkFqcGdeQXVyNjc3MjQzNTI@._V1_.jpg'
    },
    {
        title: 'JoJo\'s Bizarre Adventure',
        imageUrl: 'https://m.media-amazon.com/images/M/MV5BZDc3NGQ3ZWQtYjNkOC00MjhiLTg2N2YtNmZlOGNiZTFkOWNhXkEyXkFqcGdeQXVyNjc2NjA5MTU@._V1_FMjpg_UX1000_.jpg'
    },
    {
        title: 'Dragon Ball Super',
        imageUrl: 'https://m.media-amazon.com/images/M/MV5BY2I2MzI1ODYtMWRlOS00MzdhLWEyOWEtYWJhNmFiZTIxMGJhXkEyXkFqcGdeQXVyMTExNDQ2MTI@._V1_.jpg'
    },
    {
        title: 'Hunter x Hunter',
        imageUrl: 'https://m.media-amazon.com/images/M/MV5BNGM0YTk3MWEtN2JlZC00ZmZmLWIwMDktZTMxZGE5Zjc2MGExXkEyXkFqcGdeQXVyNjAwNDUxODI@._V1_FMjpg_UX1000_.jpg'
    },
    {
        title: 'Attack on Titan',
        imageUrl: '../assets/attack-on-titan.jpg'
    },
    {
        title: 'Bleach: Thousand Year Blood War',
        imageUrl: '../assets/bleach.jpg'
    },
    {
        title: 'Naruto',
        imageUrl: '../assets/naruto.jpg'
    },
    {
        title: 'Tokyo Ghoul',
        imageUrl: '../assets/tokyo-ghoul.jpg'
    },
    {
        title: 'Sword Art Online',
        imageUrl: '../assets/sword-art-online.jpg'
    }, 
    {
        title: 'One Piece',
        imageUrl: '../assets/one-piece.jpg'
    },
    {
        title: 'Dr. Stone',
        imageUrl: '../assets/dr-stone.jpg'
    }, 
    {
        title: 'Re: Zero Starting Life in Another World',
        imageUrl: '../assets/re-zero.jpg'
    }, 
    {
        title: 'Bungo Stray Dogs',
        imageUrl: '../assets/bungo-stray-dogs.jpg'
    },
    {
        title: 'Neon Genesis Evangelion',
        imageUrl: '../assets/neon-genesis-evangelion.jpg'
    }
];

const recommendationsGrid = document.getElementById('recommendations-grid');

function generateRecommendations() {
    animeRecommendations.forEach(anime => {
        const recommendationBox = document.createElement('div');
        recommendationBox.classList.add('recommendation-box');
        
        const img = document.createElement('img');
        img.src = anime.imageUrl;
        img.alt = anime.title;
        recommendationBox.appendChild(img);
        
        const title = document.createElement('p');
        title.textContent = anime.title;
        recommendationBox.appendChild(title);
        
        const playButton = document.createElement('i');
        playButton.classList.add('bx', 'bx-play-circle', 'play-button');
        recommendationBox.appendChild(playButton);
        
        recommendationsGrid.appendChild(recommendationBox);
    });
}

generateRecommendations();


document.querySelector('.join-btn').addEventListener('click', () => {
    alert('Welcome to the AniTube community!');
});