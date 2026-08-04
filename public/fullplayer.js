var FullPlayer={
    init(){
        gid('full-container').innerHTML=`
        <div id="full-player" class="fixed flex flex-col z-[170]" style="display:none;background:#121212;transition:transform 0.35s ease-out;transform:translateY(100%);top:12px;left:0;right:0;bottom:0;border-top-left-radius:16px;border-top-right-radius:16px;overflow:hidden;touch-action:none;box-shadow: 0 -10px 40px rgba(0,0,0,0.5);">
            
            <div class="relative z-10 flex justify-between items-center p-4 pt-6 flex-shrink-0">
                <button onclick="FullPlayer.close()" class="text-white/70 hover:text-white hover:bg-white/10 p-3 rounded-full active:scale-90 transition-all duration-200"><i data-lucide="chevron-down" class="w-7 h-7"></i></button>
                <div class="text-center"><p class="text-[10px] uppercase tracking-[0.2em] text-[#b3b3b3]">Now Playing</p><p id="full-header-artist" class="text-sm font-bold truncate max-w-[200px]"></p></div>
                <div class="flex gap-1">
                    <button onclick="openShareCard()" class="text-white/70 hover:text-white hover:bg-white/10 p-3 rounded-full active:scale-90 transition-all" title="Bagikan Lagu (Share Card)"><i data-lucide="share-2" class="w-5 h-5"></i></button>
                    <button onclick="toggleLyrics()" class="text-white/70 hover:text-white hover:bg-white/10 p-3 rounded-full active:scale-90 transition-all"><i data-lucide="align-left" class="w-6 h-6"></i></button>
                </div>
            </div>
            <div class="relative z-10 flex-1 flex items-center justify-center px-8" style="min-height:0;overflow:hidden;">
                <div class="relative w-full max-w-[300px] aspect-square flex items-center justify-center">
                    <img id="full-cover" src="" class="w-full h-full object-cover rounded-3xl shadow-2xl shadow-black/50 transition-all duration-500" />
                    <!-- Loading & Pause Overlay on Full Player Artwork -->
                    <div id="full-cover-overlay" class="absolute inset-0 rounded-3xl flex flex-col items-center justify-center bg-black/60 backdrop-blur-[3px] transition-all duration-300 opacity-0 pointer-events-none z-20">
                        <div id="full-cover-icon" class="mb-2 text-white flex items-center justify-center"></div>
                        <span id="full-cover-text" class="text-xs font-black text-white tracking-[0.2em] uppercase drop-shadow text-center px-4"></span>
                    </div>
                    <!-- Like Button on bottom right of Cover Art -->
                    <button id="full-like-btn" onclick="toggleCurrentLike(); if(typeof event !== 'undefined') event.stopPropagation();" class="absolute bottom-3 right-3 z-30 w-11 h-11 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-md border border-white/20 text-white flex items-center justify-center active:scale-90 transition-all shadow-lg" title="Sukai Lagu">
                        <i data-lucide="heart" class="w-5 h-5"></i>
                    </button>
                </div>
            </div>
            <div class="relative z-10 px-6 pb-2 flex-shrink-0">
                <div class="flex justify-between items-start mb-3">
                    <div class="flex-1 truncate">
                        <div class="flex items-center gap-2">
                            <h2 id="full-title" class="text-xl font-bold text-white truncate">Pilih lagu</h2>
                            <span id="full-status-tag" class="hidden px-2.5 py-0.5 rounded-full text-[9px] font-extrabold tracking-wider uppercase border transition-all"></span>
                        </div>
                        <p id="full-artist" class="text-[#b3b3b3] text-sm truncate cursor-pointer hover:text-[#cfd3d8] mt-0.5" onclick="FullPlayer.openArtist()"></p>
                    </div>
                </div>
                <div class="mb-2"><div class="relative w-full h-1.5 bg-white/10 rounded-full flex items-center group cursor-pointer"><input type="range" id="seek-bar" min="0" max="100" value="0" class="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" oninput="SK(this.value)" /><div id="full-progress" class="relative h-full bg-gradient-to-r from-[#cfd3d8] to-[#e8eaed] rounded-full" style="width:0%;box-shadow:0 0 10px rgba(207,211,216,0.5);"><div class="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-xl shadow-[#cfd3d8]/50 opacity-0 group-hover:opacity-100 transition-all"></div></div></div><div class="flex justify-between text-[10px] text-[#6b7280] mt-1"><span id="time-curr">0:00</span><span id="time-dur">0:00</span></div></div>
            </div>
            <!-- Bottom Beats Visualizer Wrapper for Controls -->
            <div id="full-beats-bg" class="relative z-10 mx-4 mb-5 rounded-2xl overflow-hidden flex-shrink-0 transition-all duration-500" style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
                <!-- Ambient Thumbnail Color Gradient -->
                <div id="full-beats-bg-gradient" class="absolute inset-0 pointer-events-none opacity-40 transition-all duration-700"></div>
                
                <!-- Dense Animated Equalizer Beat Bars -->
                <div id="full-beats-bars" class="absolute inset-x-0 bottom-0 top-0 flex items-end justify-between opacity-50 px-3 pb-1 gap-[2px] overflow-hidden pointer-events-none z-0">
                    <!-- Bars injected dynamically -->
                </div>

                <!-- Premium Utility Bar -->
                <div class="relative z-10 px-4 flex items-center justify-between gap-2 py-2.5 overflow-x-auto hide-scrollbar border-b border-white/10">
                    <button onclick="openEqualizer()" class="flex-shrink-0 flex flex-col items-center gap-1 text-[#a0a5b0] hover:text-white transition active:scale-90" title="Equalizer">
                        <i data-lucide="sliders" class="w-4.5 h-4.5"></i>
                        <span class="text-[9px] font-semibold tracking-wider uppercase opacity-80 mt-0.5">EQ</span>
                    </button>
                    <button onclick="openSleepTimer()" class="flex-shrink-0 flex flex-col items-center gap-1 text-[#a0a5b0] hover:text-white transition active:scale-90 relative" title="Timer Tidur">
                        <i data-lucide="clock" class="w-4.5 h-4.5"></i>
                        <span class="text-[9px] font-semibold tracking-wider uppercase opacity-80 mt-0.5" id="sleep-badge">Timer</span>
                        <span id="sleep-dot" class="hidden absolute top-0.5 right-2 w-1.5 h-1.5 bg-white rounded-full"></span>
                    </button>
                    <button onclick="openPlaybackSpeed()" class="flex-shrink-0 flex flex-col items-center gap-1 text-[#a0a5b0] hover:text-white transition active:scale-90" title="Kecepatan Putar">
                        <i data-lucide="gauge" class="w-4.5 h-4.5"></i>
                        <span class="text-[9px] font-semibold tracking-wider uppercase opacity-80 mt-0.5" id="speed-badge">Normal</span>
                    </button>
                    <button onclick="addCurrentToPlaylist()" class="flex-shrink-0 flex flex-col items-center gap-1 text-[#a0a5b0] hover:text-white transition active:scale-90" title="Tambah ke Playlist">
                        <i data-lucide="list-plus" class="w-4.5 h-4.5"></i>
                        <span class="text-[9px] font-semibold tracking-wider uppercase opacity-80 mt-0.5">Playlist</span>
                    </button>
                    <button onclick="openQueue()" class="flex-shrink-0 flex flex-col items-center gap-1 text-[#a0a5b0] hover:text-white transition active:scale-90" title="Daftar Antrian">
                        <i data-lucide="list-music" class="w-4.5 h-4.5"></i>
                        <span class="text-[9px] font-semibold tracking-wider uppercase opacity-80 mt-0.5">Antrian</span>
                    </button>
                    <button onclick="downloadCurrentSong()" class="flex-shrink-0 flex flex-col items-center gap-1 text-[#a0a5b0] hover:text-white transition active:scale-90" title="Unduh Lagu">
                        <i data-lucide="download" class="w-4.5 h-4.5"></i>
                        <span class="text-[9px] font-semibold tracking-wider uppercase opacity-80 mt-0.5">Unduh</span>
                    </button>
                    <button onclick="toggleLyrics()" class="flex-shrink-0 flex flex-col items-center gap-1 text-[#a0a5b0] hover:text-white transition active:scale-90" title="Lirik Lagu">
                        <i data-lucide="mic-2" class="w-4.5 h-4.5"></i>
                        <span class="text-[9px] font-semibold tracking-wider uppercase opacity-80 mt-0.5">Lirik</span>
                    </button>
                </div>

                <!-- Primary Playback Controls -->
                <div class="relative z-10 px-6 py-3 flex items-center justify-between">
                    <button id="full-shuffle-btn" onclick="SF()" class="relative text-[#6b7280] hover:text-white active:scale-90 p-2 transition-all duration-200" title="Acak (Shuffle)">
                        <i data-lucide="shuffle" class="w-5 h-5"></i>
                        <span id="full-shuffle-dot" class="hidden absolute top-1 right-1 w-1.5 h-1.5 rounded-full"></span>
                    </button>
                    <button id="full-prev-btn" onclick="PV()" class="text-white/80 hover:text-white active:scale-90 p-2 transition-all" title="Lagu Sebelumnya">
                        <i data-lucide="skip-back" class="w-7 h-7 fill-current"></i>
                    </button>
                    <button onclick="TP()" id="full-play-btn-wrap" class="relative bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-full p-4 hover:scale-105 active:scale-95 transition-all shadow-lg shadow-black/30" style="width:60px;height:60px;">
                        <div id="full-play-btn" class="absolute inset-0 flex items-center justify-center">
                            <i data-lucide="play" class="w-7 h-7 fill-current ml-0.5"></i>
                        </div>
                    </button>
                    <button id="full-next-btn" onclick="NX()" class="text-white/80 hover:text-white active:scale-90 p-2 transition-all" title="Lagu Berikutnya">
                        <i data-lucide="skip-forward" class="w-7 h-7 fill-current"></i>
                    </button>
                    <button onclick="TR()" id="btn-repeat" class="relative text-white hover:text-white active:scale-90 p-2 transition-all">
                        <i data-lucide="repeat" class="w-5 h-5"></i>
                        <span id="repeat-one" class="hidden absolute -top-2 left-1/2 -translate-x-1/2 text-[8px] font-black text-white">1</span>
                    </button>
                </div>
            </div>
        </div>`;
        gid('lyrics-container').innerHTML=`
        <div id="lyrics-overlay" class="fixed flex flex-col z-[200]" style="display:none;background:#000000;transition:transform 0.35s ease-out;transform:translateY(100%);top:0;left:0;width:100%;height:100%;overflow:hidden;touch-action:none;">
            <!-- Mobile Header (hidden on desktop) -->
            <div class="md:hidden flex justify-between items-center p-4 pt-6 flex-shrink-0 bg-[#000000] border-b border-white/10 relative z-20 shadow-xl">
                <div class="flex items-center gap-3 overflow-hidden">
                    <img id="lyrics-header-cover" src="" class="w-12 h-12 rounded-md object-cover shadow-md flex-shrink-0 bg-white/5" />
                    <div class="flex flex-col min-w-0">
                        <span id="lyrics-header-title" class="font-bold text-white text-base truncate">Lirik</span>
                        <span id="lyrics-header-artist" class="text-white/70 text-sm truncate"></span>
                    </div>
                </div>
                <button onclick="toggleLyrics()" class="text-white/70 hover:text-white p-2 rounded-full active:scale-90 flex-shrink-0 transition-all bg-white/10 ml-3"><i data-lucide="chevron-down" class="w-6 h-6"></i></button>
            </div>

            <!-- Floating Sync Controls (Mobile only, stays in place) -->
            <div class="md:hidden absolute top-[100px] right-6 z-30 flex items-center gap-2 bg-[#1a1a1a]/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 shadow-lg">
                <button onclick="lyricSyncPrev()" class="text-white/70 hover:text-white bg-white/5 hover:bg-white/10 w-8 h-8 rounded-full active:scale-90 flex items-center justify-center transition-all"><i data-lucide="minus" class="w-4 h-4"></i></button>
                <p id="lyric-sync-badge-mobile" class="hidden text-xs font-bold text-white tracking-wide">+0</p>
                <button onclick="lyricSyncNext()" class="text-white/70 hover:text-white bg-white/5 hover:bg-white/10 w-8 h-8 rounded-full active:scale-90 flex items-center justify-center transition-all"><i data-lucide="plus" class="w-4 h-4"></i></button>
            </div>

            <!-- Desktop Close Button -->
            <button onclick="toggleLyrics()" class="hidden md:flex absolute top-8 right-8 z-50 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full active:scale-90 transition-all backdrop-blur-md">
                <i data-lucide="chevron-down" class="w-8 h-8"></i>
            </button>
            
            <div class="flex-1 flex flex-col md:flex-row w-full h-full overflow-hidden relative">
                
                <!-- Left Side: Lyrics Scroll (Desktop: Left, Mobile: Full) -->
                <div id="lyrics-scroll-container" class="w-full md:w-3/5 h-full overflow-y-auto px-6 md:px-16 hide-scrollbar z-10 relative">
                    <div class="pt-[30vh] pb-[60vh] w-full max-w-3xl mx-auto md:mx-0">
                        
                        <div id="lyrics-loading" class="flex justify-center items-center h-[30vh] w-full">
                            <div class="w-10 h-10 border-4 border-[#cfd3d8] border-t-transparent rounded-full animate-spin"></div>
                        </div>
                        
                        <div id="lyrics-content" class="hidden w-full"></div>
                        
                        <div id="lyrics-empty" class="hidden flex justify-center items-center h-[30vh] w-full text-white/50">
                            <div class="text-center">
                                <i data-lucide="music" class="w-20 h-20 mx-auto mb-4 opacity-30"></i>
                                <p class="text-lg">Lirik tidak tersedia</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Right Side: Cover & Info (Desktop only) -->
                <div class="hidden md:flex w-2/5 flex-col justify-center items-start p-12 z-10 pl-16">
                    <img id="lyrics-desktop-cover" src="" class="w-[350px] max-w-full aspect-square rounded-xl shadow-2xl mb-8 object-cover bg-white/5" />
                    <h2 id="lyrics-desktop-title" class="font-bold text-white text-3xl mb-2 line-clamp-2 leading-tight">Lirik</h2>
                    <p id="lyrics-desktop-artist" class="text-white/70 text-lg line-clamp-1"></p>
                    
                    <div class="flex items-center justify-start gap-3 mt-8">
                        <button onclick="lyricSyncPrev()" title="Sinkron mundur 1 lirik" class="text-white/70 hover:text-white bg-white/5 hover:bg-white/10 w-12 h-12 rounded-full active:scale-90 flex items-center justify-center transition-all"><i data-lucide="minus" class="w-5 h-5"></i></button>
                        <p id="lyric-sync-badge-desktop" class="text-xs font-bold text-white tracking-wide">+0</p>
                        <button onclick="lyricSyncNext()" title="Sinkron lanjut 1 lirik" class="text-white/70 hover:text-white bg-white/5 hover:bg-white/10 w-12 h-12 rounded-full active:scale-90 flex items-center justify-center transition-all"><i data-lucide="plus" class="w-5 h-5"></i></button>
                    </div>
                </div>
            </div>
        </div>`;
        lucide.createIcons();

        var fullBarsHtml = '';
        var eqAnims = ['animate-eq-1', 'animate-eq-2', 'animate-eq-3', 'animate-eq-4', 'animate-eq-5', 'animate-eq-6'];
        for (var i = 0; i < 48; i++) {
            var animClass = eqAnims[i % eqAnims.length];
            fullBarsHtml += '<span class="full-beat-bar w-[3px] rounded-t-sm shrink-0 transition-all duration-300 ' + animClass + '" style="height:6px;background-color:#ff2a5f;"></span>';
        }
        var barsContainer = gid('full-beats-bars');
        if (barsContainer) {
            barsContainer.innerHTML = fullBarsHtml;
        }
    },
    open(){
        var fp=gid('full-player');
        fp.style.display='flex';
        document.body.style.overflow='hidden';
        requestAnimationFrame(function(){fp.style.transform='translateY(0)';});
        MP.hide();
        try{
            updateSleepBadge();
            updateSpeedBadge();
            if(typeof UB==='function')UB();
            if(typeof updateLikeButtons==='function')updateLikeButtons();
            if(S.ct && typeof FullPlayer.updateBeats === 'function') FullPlayer.updateBeats(S.ct);
        }catch(e){}
    },
    close(){var fp=gid('full-player');fp.style.transform='translateY(100%)';document.body.style.overflow='';setTimeout(function(){fp.style.display='none';MP.show();},350);},
    openArtist(){if(S.ct&&S.ct.artistId){FullPlayer.close();setTimeout(function(){Artist.open(S.ct.artistId,S.ct.artist);},400);}},
    applyColors(colors) {
        if (!colors || !colors[0]) return;
        var primary = colors[0];
        var secondary = colors[1] || primary;

        if (typeof S !== 'undefined') {
            S.currentAccentColor = primary;
        }

        // Full Player Progressbar
        var fullProgress = gid('full-progress');
        if (fullProgress) {
            fullProgress.style.background = 'linear-gradient(to right, ' + primary + ', ' + secondary + ')';
            fullProgress.style.boxShadow = '0 0 14px ' + primary + 'bb';
        }

        // Mini Player Progressbar
        var miniProgress = gid('mini-progress');
        if (miniProgress) {
            miniProgress.style.backgroundColor = primary;
            miniProgress.style.boxShadow = '0 0 10px ' + primary + 'bb';
        }

        // Full Play/Pause Wrap
        var playBtn = gid('full-play-btn-wrap');
        if (playBtn) {
            playBtn.style.background = 'linear-gradient(135deg, ' + primary + '44, ' + secondary + '22)';
            playBtn.style.borderColor = primary;
            playBtn.style.boxShadow = '0 0 25px ' + primary + 'aa';
            playBtn.style.color = '#ffffff';
        }

        // Mini Play/Pause Button
        var miniPlayBtn = gid('mini-play-btn');
        if (miniPlayBtn) {
            miniPlayBtn.style.backgroundColor = primary;
            miniPlayBtn.style.color = '#ffffff';
            miniPlayBtn.style.boxShadow = '0 0 12px ' + primary + 'aa';
        }

        // Full Player Prev/Next Buttons
        var prevBtn = gid('full-prev-btn');
        var nextBtn = gid('full-next-btn');
        if (prevBtn) {
            prevBtn.style.color = primary;
            prevBtn.style.filter = 'drop-shadow(0 0 6px ' + primary + '88)';
        }
        if (nextBtn) {
            nextBtn.style.color = primary;
            nextBtn.style.filter = 'drop-shadow(0 0 6px ' + primary + '88)';
        }

        // Mini Player Prev/Next Buttons
        var mPrevBtn = gid('mini-prev-btn');
        var mNextBtn = gid('mini-next-btn');
        if (mPrevBtn) {
            mPrevBtn.style.color = primary;
        }
        if (mNextBtn) {
            mNextBtn.style.color = primary;
        }

        // Beats Background Gradients
        var bgEl = gid('full-beats-bg-gradient');
        if (bgEl) {
            bgEl.style.background = 'linear-gradient(to right, ' + primary + '66, ' + secondary + '55, ' + (colors[2] || primary) + '55)';
        }
        var miniBg = gid('mini-beats-bg-gradient');
        if (miniBg) {
            miniBg.style.background = 'linear-gradient(to right, ' + primary + '55, ' + secondary + '44)';
        }

        var bars = document.querySelectorAll('.full-beat-bar, .mini-beat-bar');
        if (bars && bars.length > 0) {
            bars.forEach(function(bar, idx) {
                var color = colors[idx % colors.length];
                bar.style.backgroundColor = color;
                bar.style.boxShadow = '0 0 6px ' + color + 'aa';
            });
        }

        if (typeof updateShuffleUI === 'function') {
            updateShuffleUI();
        }
    },
    updateBeats(track) {
        if (!track) return;
        var palette = (typeof MP !== 'undefined' && MP.getTrackColors) ? MP.getTrackColors(track) : ['#ff2a5f', '#ff5e82', '#cc1b47', '#ff4070'];
        FullPlayer.applyColors(palette);

        if (track.cover && track.cover.startsWith('http')) {
            var img = new Image();
            img.crossOrigin = 'Anonymous';
            img.src = track.cover;
            img.onload = function() {
                var colors = (typeof MP !== 'undefined' && MP.extractFromImage) ? MP.extractFromImage(img) : null;
                if (colors) {
                    FullPlayer.applyColors(colors);
                }
            };
        }
    }
};