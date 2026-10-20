// MelodyPlayer - Music Player Application
// Inspired by Spotify architecture but with original implementation

class MelodyPlayer {
    constructor() {
        this.audio = new Audio();
        this.currentTrack = null;
        this.playlist = [];
        this.currentIndex = 0;
        this.isPlaying = false;
        this.isShuffled = false;
        this.repeatMode = 'none'; // none, all, one
        this.likedTracks = new Set();
        this.playlists = [];
        this.library = [];
        
        this.init();
    }

    init() {
        this.loadSampleData();
        this.bindEvents();
        this.renderUI();
    }

    loadSampleData() {
        // Sample library data
        this.library = [
            {
                id: 1,
                title: "Bohemian Rhapsody",
                artist: "Queen",
                album: "A Night at the Opera",
                duration: 354,
                cover: "🎸"
            },
            {
                id: 2,
                title: "Stairway to Heaven",
                artist: "Led Zeppelin",
                album: "Led Zeppelin IV",
                duration: 482,
                cover: "🎵"
            },
            {
                id: 3,
                title: "Hotel California",
                artist: "Eagles",
                album: "Hotel California",
                duration: 391,
                cover: "🎶"
            },
            {
                id: 4,
                title: "Sweet Child O' Mine",
                artist: "Guns N' Roses",
                album: "Appetite for Destruction",
                duration: 356,
                cover: "🎤"
            },
            {
                id: 5,
                title: "Smells Like Teen Spirit",
                artist: "Nirvana",
                album: "Nevermind",
                duration: 301,
                cover: "🎸"
            },
            {
                id: 6,
                title: "Imagine",
                artist: "John Lennon",
                album: "Imagine",
                duration: 183,
                cover: "🎹"
            },
            {
                id: 7,
                title: "Billie Jean",
                artist: "Michael Jackson",
                album: "Thriller",
                duration: 294,
                cover: "🕺"
            },
            {
                id: 8,
                title: "Like a Rolling Stone",
                artist: "Bob Dylan",
                album: "Highway 61 Revisited",
                duration: 369,
                cover: "🎵"
            }
        ];

        // Sample playlists
        this.playlists = [
            {
                id: 1,
                name: "Rock Classics",
                tracks: [1, 2, 3, 4, 5],
                cover: "🎸"
            },
            {
                id: 2,
                name: "Chill Vibes",
                tracks: [6, 7, 8],
                cover: "🎶"
            }
        ];

        this.playlist = [...this.library];
    }

    bindEvents() {
        // Navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const section = item.dataset.section;
                this.showSection(section);
            });
        });

        // Player controls
        document.getElementById('play-pause-btn').addEventListener('click', () => this.togglePlay());
        document.getElementById('prev-btn').addEventListener('click', () => this.playPrevious());
        document.getElementById('next-btn').addEventListener('click', () => this.playNext());
        document.getElementById('shuffle-btn').addEventListener('click', () => this.toggleShuffle());
        document.getElementById('repeat-btn').addEventListener('click', () => this.toggleRepeat());
        document.getElementById('like-btn').addEventListener('click', () => this.toggleLike());

        // Progress bar
        const progressSlider = document.getElementById('progress-slider');
        progressSlider.addEventListener('input', (e) => this.seekTo(e.target.value));

        // Volume
        const volumeSlider = document.getElementById('volume-slider');
        volumeSlider.addEventListener('input', (e) => this.setVolume(e.target.value));
        document.getElementById('volume-btn').addEventListener('click', () => this.toggleMute());

        // Audio events
        this.audio.addEventListener('timeupdate', () => this.updateProgress());
        this.audio.addEventListener('ended', () => this.onTrackEnd());
        this.audio.addEventListener('loadedmetadata', () => this.updateDuration());

        // Search
        document.getElementById('search-btn').addEventListener('click', () => this.search());
        document.getElementById('search-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.search();
        });

        // Library filters
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.filterLibrary(btn.dataset.filter);
            });
        });

        // Create playlist
        document.querySelector('.create-playlist-btn').addEventListener('click', () => this.createPlaylist());
    }

    renderUI() {
        this.renderRecentTracks();
        this.renderRecommended();
        this.renderLibrary();
        this.renderPlaylists();
        this.renderSidebarPlaylists();
    }

    showSection(section) {
        // Update navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
            if (item.dataset.section === section) {
                item.classList.add('active');
            }
        });

        // Show section
        document.querySelectorAll('.content-section').forEach(s => {
            s.classList.remove('active');
        });
        document.getElementById(`${section}-section`).classList.add('active');
    }

    renderRecentTracks() {
        const container = document.getElementById('recent-tracks-list');
        const recent = this.library.slice(0, 4);
        container.innerHTML = recent.map(track => this.createTrackCard(track)).join('');
    }

    renderRecommended() {
        const container = document.getElementById('recommended-list');
        const recommended = this.library.slice(4, 8);
        container.innerHTML = recommended.map(track => this.createTrackCard(track)).join('');
    }

    renderLibrary() {
        const container = document.getElementById('library-list');
        container.innerHTML = this.library.map(track => this.createTrackCard(track)).join('');
    }

    renderPlaylists() {
        const container = document.getElementById('playlists-grid');
        container.innerHTML = this.playlists.map(playlist => `
            <div class="playlist-card" data-playlist-id="${playlist.id}">
                <div class="playlist-card-image">${playlist.cover}</div>
                <div class="playlist-card-title">${playlist.name}</div>
                <div class="playlist-card-count">${playlist.tracks.length} músicas</div>
            </div>
        `).join('');

        // Add click handlers
        container.querySelectorAll('.playlist-card').forEach(card => {
            card.addEventListener('click', () => {
                const playlistId = parseInt(card.dataset.playlistId);
                this.loadPlaylist(playlistId);
            });
        });
    }

    renderSidebarPlaylists() {
        const container = document.getElementById('playlist-list');
        container.innerHTML = this.playlists.map(playlist => `
            <li data-playlist-id="${playlist.id}">${playlist.name}</li>
        `).join('');

        container.querySelectorAll('li').forEach(item => {
            item.addEventListener('click', () => {
                const playlistId = parseInt(item.dataset.playlistId);
                this.loadPlaylist(playlistId);
            });
        });
    }

    createTrackCard(track) {
        return `
            <div class="track-card" data-track-id="${track.id}">
                <div class="track-card-image">${track.cover}</div>
                <div class="track-card-title">${track.title}</div>
                <div class="track-card-artist">${track.artist}</div>
            </div>
        `;
    }

    loadTrack(track) {
        this.currentTrack = track;
        document.getElementById('track-title').textContent = track.title;
        document.getElementById('track-artist').textContent = track.artist;
        document.getElementById('track-image').innerHTML = `<span class="placeholder">${track.cover}</span>`;
        
        // Update like button
        const likeBtn = document.getElementById('like-btn');
        if (this.likedTracks.has(track.id)) {
            likeBtn.classList.add('liked');
            likeBtn.textContent = '♥';
        } else {
            likeBtn.classList.remove('liked');
            likeBtn.textContent = '♡';
        }

        // In a real implementation, you would load the actual audio file
        // this.audio.src = track.audioUrl;
        // this.audio.load();
    }

    playTrack(track) {
        this.loadTrack(track);
        this.isPlaying = true;
        this.updatePlayButton();
        // this.audio.play();
    }

    togglePlay() {
        if (!this.currentTrack && this.playlist.length > 0) {
            this.playTrack(this.playlist[0]);
            return;
        }

        if (this.isPlaying) {
            this.isPlaying = false;
            // this.audio.pause();
        } else {
            this.isPlaying = true;
            // this.audio.play();
        }
        this.updatePlayButton();
    }

    updatePlayButton() {
        const btn = document.getElementById('play-pause-btn');
        btn.textContent = this.isPlaying ? '⏸️' : '▶️';
    }

    playNext() {
        if (this.playlist.length === 0) return;

        if (this.isShuffled) {
            this.currentIndex = Math.floor(Math.random() * this.playlist.length);
        } else {
            this.currentIndex = (this.currentIndex + 1) % this.playlist.length;
        }

        this.playTrack(this.playlist[this.currentIndex]);
    }

    playPrevious() {
        if (this.playlist.length === 0) return;

        if (this.isShuffled) {
            this.currentIndex = Math.floor(Math.random() * this.playlist.length);
        } else {
            this.currentIndex = (this.currentIndex - 1 + this.playlist.length) % this.playlist.length;
        }

        this.playTrack(this.playlist[this.currentIndex]);
    }

    toggleShuffle() {
        this.isShuffled = !this.isShuffled;
        const btn = document.getElementById('shuffle-btn');
        btn.classList.toggle('active', this.isShuffled);
    }

    toggleRepeat() {
        const modes = ['none', 'all', 'one'];
        const currentIndex = modes.indexOf(this.repeatMode);
        this.repeatMode = modes[(currentIndex + 1) % modes.length];

        const btn = document.getElementById('repeat-btn');
        btn.classList.toggle('active', this.repeatMode !== 'none');
        
        if (this.repeatMode === 'one') {
            btn.textContent = '🔂';
        } else {
            btn.textContent = '🔁';
        }
    }

    onTrackEnd() {
        if (this.repeatMode === 'one') {
            this.audio.currentTime = 0;
            this.audio.play();
        } else if (this.repeatMode === 'all' || this.currentIndex < this.playlist.length - 1) {
            this.playNext();
        } else {
            this.isPlaying = false;
            this.updatePlayButton();
        }
    }

    updateProgress() {
        if (!this.currentTrack) return;

        const progress = (this.audio.currentTime / this.audio.duration) * 100;
        document.getElementById('progress-fill').style.width = `${progress}%`;
        document.getElementById('progress-slider').value = progress;
        
        document.getElementById('current-time').textContent = this.formatTime(this.audio.currentTime);
    }

    updateDuration() {
        if (!this.currentTrack) return;
        document.getElementById('total-time').textContent = this.formatTime(this.audio.duration);
    }

    seekTo(value) {
        if (!this.currentTrack) return;
        const time = (value / 100) * this.audio.duration;
        this.audio.currentTime = time;
    }

    setVolume(value) {
        this.audio.volume = value / 100;
        this.updateVolumeIcon(value);
    }

    toggleMute() {
        if (this.audio.volume > 0) {
            this.previousVolume = this.audio.volume;
            this.audio.volume = 0;
            document.getElementById('volume-slider').value = 0;
        } else {
            this.audio.volume = this.previousVolume || 0.7;
            document.getElementById('volume-slider').value = this.audio.volume * 100;
        }
        this.updateVolumeIcon(this.audio.volume * 100);
    }

    updateVolumeIcon(value) {
        const btn = document.getElementById('volume-btn');
        if (value === 0) {
            btn.textContent = '🔇';
        } else if (value < 50) {
            btn.textContent = '🔉';
        } else {
            btn.textContent = '🔊';
        }
    }

    toggleLike() {
        if (!this.currentTrack) return;

        if (this.likedTracks.has(this.currentTrack.id)) {
            this.likedTracks.delete(this.currentTrack.id);
            document.getElementById('like-btn').classList.remove('liked');
            document.getElementById('like-btn').textContent = '♡';
        } else {
            this.likedTracks.add(this.currentTrack.id);
            document.getElementById('like-btn').classList.add('liked');
            document.getElementById('like-btn').textContent = '♥';
        }
    }

    search() {
        const query = document.getElementById('search-input').value.toLowerCase();
        const results = this.library.filter(track => 
            track.title.toLowerCase().includes(query) ||
            track.artist.toLowerCase().includes(query) ||
            track.album.toLowerCase().includes(query)
        );

        const container = document.getElementById('search-results');
        if (results.length > 0) {
            container.innerHTML = results.map(track => this.createTrackCard(track)).join('');
        } else {
            container.innerHTML = '<p style="color: var(--text-secondary);">Nenhum resultado encontrado</p>';
        }
    }

    filterLibrary(filter) {
        let filtered = this.library;
        
        switch (filter) {
            case 'albums':
                filtered = [...new Set(this.library.map(t => t.album))].map(album => ({
                    title: album,
                    artist: this.library.find(t => t.album === album).artist,
                    cover: '💿',
                    isAlbum: true
                }));
                break;
            case 'artists':
                filtered = [...new Set(this.library.map(t => t.artist))].map(artist => ({
                    title: artist,
                    artist: 'Artista',
                    cover: '🎤',
                    isArtist: true
                }));
                break;
            case 'tracks':
                filtered = this.library;
                break;
        }

        const container = document.getElementById('library-list');
        container.innerHTML = filtered.map(item => this.createTrackCard(item)).join('');
    }

    loadPlaylist(playlistId) {
        const playlist = this.playlists.find(p => p.id === playlistId);
        if (!playlist) return;

        this.playlist = playlist.tracks.map(id => this.library.find(t => t.id === id));
        this.currentIndex = 0;
        
        if (this.playlist.length > 0) {
            this.playTrack(this.playlist[0]);
        }
    }

    createPlaylist() {
        const name = prompt('Nome da nova playlist:');
        if (!name) return;

        const newPlaylist = {
            id: Date.now(),
            name: name,
            tracks: [],
            cover: '🎵'
        };

        this.playlists.push(newPlaylist);
        this.renderPlaylists();
        this.renderSidebarPlaylists();
    }

    formatTime(seconds) {
        if (isNaN(seconds)) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
}

// Initialize the player when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.player = new MelodyPlayer();
    
    // Add click handlers to track cards
    document.addEventListener('click', (e) => {
        const trackCard = e.target.closest('.track-card');
        if (trackCard) {
            const trackId = parseInt(trackCard.dataset.trackId);
            const track = window.player.library.find(t => t.id === trackId);
            if (track) {
                window.player.playTrack(track);
            }
        }
    });
});
