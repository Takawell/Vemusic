// PWA - INSTALL PROMPT HANDLING
var deferredInstallPrompt=null;
var isStandaloneApp=(window.matchMedia&&window.matchMedia('(display-mode: standalone)').matches)||window.navigator.standalone===true;
var isIOSDevice=/iPad|iPhone|iPod/.test(navigator.userAgent)&&!window.MSStream;
window.addEventListener('beforeinstallprompt',function(e){
    e.preventDefault();
    deferredInstallPrompt=e;
    var btn=document.getElementById('pwa-install-btn');
    if(btn&&!isStandaloneApp)btn.classList.remove('hidden');
});
window.addEventListener('appinstalled',function(){
    deferredInstallPrompt=null;
    var btn=document.getElementById('pwa-install-btn');
    if(btn)btn.classList.add('hidden');
    if(typeof showToast==='function')showToast('✅ Vemusic berhasil diinstall!');
});
function installPWA(){
    if(deferredInstallPrompt){
        deferredInstallPrompt.prompt();
        deferredInstallPrompt.userChoice.then(function(choice){
            if(choice.outcome==='accepted'&&typeof showToast==='function')showToast('✅ Menginstall Vemusic...');
            deferredInstallPrompt=null;
            var btn=document.getElementById('pwa-install-btn');
            if(btn)btn.classList.add('hidden');
        });
    }else if(isIOSDevice){
        if(typeof showToast==='function')showToast('📲 Tap ikon Bagikan lalu pilih "Add to Home Screen"');
    }else{
        if(typeof showToast==='function')showToast('⚠️ Aplikasi sudah terinstall atau tidak didukung browser ini');
    }
}

var App={
    init(){
        document.documentElement.classList.remove('theme-light');
        localStorage.removeItem('theme');

        gid('nav-container').innerHTML=`
        <div class="nav-blur pb-safe h-[68px] flex items-center justify-around fixed bottom-0 w-full z-40 px-2 shadow-2xl">
            <button onclick="App.switch('home')" id="nav-home" class="nav-item group relative flex-1 h-full flex flex-col items-center justify-center cursor-pointer select-none touch-manipulation active:scale-95 transition-all">
                <div class="nav-icon-wrapper w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300">
                    <i data-lucide="home" class="w-5 h-5"></i>
                </div>
                <span class="nav-label text-[10px] font-bold transition-all duration-300">Home</span>
            </button>
            <button onclick="App.switch('search')" id="nav-search" class="nav-item group relative flex-1 h-full flex flex-col items-center justify-center cursor-pointer select-none touch-manipulation active:scale-95 transition-all">
                <div class="nav-icon-wrapper w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300">
                    <i data-lucide="search" class="w-5 h-5"></i>
                </div>
                <span class="nav-label text-[10px] font-bold transition-all duration-300">Search</span>
            </button>
            <button onclick="App.switch('library')" id="nav-library" class="nav-item group relative flex-1 h-full flex flex-col items-center justify-center cursor-pointer select-none touch-manipulation active:scale-95 transition-all">
                <div class="nav-icon-wrapper w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300">
                    <i data-lucide="library" class="w-5 h-5"></i>
                </div>
                <span class="nav-label text-[10px] font-bold transition-all duration-300">Library</span>
            </button>
            <button onclick="App.switch('dev')" id="nav-dev" class="nav-item group relative flex-1 h-full flex flex-col items-center justify-center cursor-pointer select-none touch-manipulation active:scale-95 transition-all">
                <div class="nav-icon-wrapper w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300">
                    <i data-lucide="info" class="w-5 h-5"></i>
                </div>
                <span class="nav-label text-[10px] font-bold transition-all duration-300">Info</span>
            </button>
        </div>`;
        
        gid('view-dev').innerHTML=`
        <div class="pt-12 px-4 text-center">
            <div class="relative w-24 h-24 rounded-full mx-auto mb-6 glass-strong shine-sweep flex items-center justify-center overflow-hidden shadow-2xl shadow-black/50">
                <i data-lucide="music" class="w-12 h-12 text-white/60 absolute"></i>
                <img src="/logo.png" class="absolute inset-0 w-full h-full object-cover" onerror="this.style.display='none'" />
            </div>
            <h1 class="text-3xl font-black chrome-text mb-1">Vemusic</h1>
            <p class="text-[#b3b3b3] text-sm mb-6">streaming music with lyrics</p>
            
            <div class="glass rounded-2xl p-5 max-w-sm mx-auto space-y-3 text-left mb-6">
                <h3 class="text-[#cfd3d8] font-bold text-sm uppercase tracking-wider mb-2">Aplikasi</h3>
                <div class="flex justify-between"><span class="text-[#6b7280] text-sm">Nama</span><span class="text-white font-medium text-sm">Vemusic</span></div>
                <div class="flex justify-between"><span class="text-[#6b7280] text-sm">Versi</span><span class="text-white font-medium text-sm">v1.0.0</span></div>
            </div>

            <div class="glass rounded-2xl p-5 max-w-sm mx-auto space-y-3 text-left mb-6">
                <h3 class="text-[#cfd3d8] font-bold text-sm uppercase tracking-wider mb-2">Developer</h3>
                <div class="flex justify-between items-center">
                    <span class="text-[#6b7280] text-sm">Developed by</span>
                    <div class="flex items-center gap-2">
                        <img src="/dev.png" class="w-6 h-6 rounded-full object-cover border border-white/10" referrerPolicy="no-referrer" onerror="this.src='/logo.png'" />
                        <span class="text-white font-medium text-sm">Takawell</span>
                    </div>
                </div>
            </div>
            
            <button id="pwa-install-btn" onclick="installPWA()" class="${isStandaloneApp?'hidden ':''}w-full max-w-sm mx-auto btn-chrome font-bold py-4 rounded-full active:scale-95 transition-all text-center flex items-center justify-center gap-2 mb-3">
                <i data-lucide="download" class="w-5 h-5"></i> Install Aplikasi
            </button>

            <a href="https://whatsapp.com/channel/0029VbDR5OBAe5VojCURLD2I" target="_blank" class="block w-full max-w-sm mx-auto btn-chrome font-bold py-4 rounded-full active:scale-95 transition-all text-center">
                 Gabung Channel WhatsApp
            </a>
        </div>`;
        
        MP.init();FullPlayer.init();Artist.init();Album.init();Home.render();Search.render();
        if(typeof updateOG==='function') updateOG(null);
        App.switch('home');
        lucide.createIcons();
        setTimeout(function(){ App.checkUrl(); }, 1000);
    },
    checkUrl(){
        var path = window.location.pathname;
        if(path.startsWith('/search/')){
            var q = path.split('/search/')[1];
            if(q){
                setTimeout(function(){
                    var si=gid('search-input');
                    if(si){
                        si.value=decodeURIComponent(q);
                        gid('search-form').dispatchEvent(new Event('submit'));
                    }
                    App.switch('search');
                },300);
            }
        }
        else if(path.startsWith('/play/')){
            var videoId = path.split('/play/')[1];
            if(videoId) {
                var p = new URLSearchParams(location.search);
                var isShared = p.get('share') === 'true' || p.get('share') === '1';
                if(isShared) {
                    App.showSharePopup(videoId);
                } else {
                    App.autoPlayTrack(videoId);
                }
            }
        }
        else if(path.startsWith('/album/')){
            var albumId = path.split('/album/')[1];
            if(albumId) {
                App.switch('home');
                setTimeout(function(){ Album.open(albumId); }, 300);
            }
        }
        else if(path.startsWith('/artist/')){
            var artistId = path.split('/artist/')[1];
            if(artistId) {
                App.switch('home');
                setTimeout(function(){ Artist.open(artistId); }, 300);
            }
        }
        else {
            var p=new URLSearchParams(location.search);
            var play=p.get('play'),search=p.get('search'),isShared=p.get('share')==='1';
            if(play){if(isShared){App.showSharePopup(play);}else{App.autoPlayTrack(play);}}
            else if(search){setTimeout(function(){var si=gid('search-input');if(si){si.value=decodeURIComponent(search);gid('search-form').dispatchEvent(new Event('submit'));}App.switch('search');},300);}
        }
    },
    autoPlayTrack(videoId){
        fetch(API.search+'?query=https://youtube.com/watch?v='+videoId).then(function(r){return r.json();}).then(function(d){
            var title='Lagu',artist='Vemusic',cover=videoId?'https://i.ytimg.com/vi/'+videoId+'/hqdefault.jpg':FI,artistId='';
            if(d.status&&d.result.songs&&d.result.songs.length>0){var song=d.result.songs[0];title=cn(song.title);artist=cn(song.artist);cover=song.thumbnail||(videoId?'https://i.ytimg.com/vi/'+videoId+'/hqdefault.jpg':FI);artistId=song.artistId||'';}
            S.ct={id:videoId,videoId:videoId,title:title,artist:artist,cover:cover,artistId:artistId,ytUrl:'https://youtube.com/watch?v='+videoId};
            S.ps='direct';S.pl=[S.ct];S.pi=0;UU();MP.show();resetLyricsUI(videoId);
            setTimeout(function(){FullPlayer.open();loadTrack(S.ct);},400);
        }).catch(function(){
            S.ct={id:videoId,videoId:videoId,title:'Lagu',artist:'Vemusic',cover:videoId?'https://i.ytimg.com/vi/'+videoId+'/hqdefault.jpg':FI,artistId:'',ytUrl:'https://youtube.com/watch?v='+videoId};
            S.ps='direct';S.pl=[S.ct];S.pi=0;UU();MP.show();resetLyricsUI(videoId);
            setTimeout(function(){FullPlayer.open();loadTrack(S.ct);},400);
        });
    },
    showSharePopup(videoId){
        fetch(API.search+'?query=https://youtube.com/watch?v='+videoId).then(function(r){return r.json();}).then(function(d){
            var title='Lagu',artist='Vemusic',cover=videoId?'https://i.ytimg.com/vi/'+videoId+'/hqdefault.jpg':FI;
            if(d.status&&d.result.songs&&d.result.songs.length>0){var song=d.result.songs[0];title=cn(song.title);artist=cn(song.artist);cover=song.thumbnail||(videoId?'https://i.ytimg.com/vi/'+videoId+'/hqdefault.jpg':FI);}
            App.renderPopup(videoId,title,artist,cover);
        }).catch(function(){App.renderPopup(videoId,'Lagu','Vemusic',videoId?'https://i.ytimg.com/vi/'+videoId+'/hqdefault.jpg':FI);});
    },
    renderPopup(videoId,title,artist,cover){
        if(typeof updateOG==='function') updateOG(title, cover, artist);
        var popup=document.createElement('div');popup.className='fixed inset-0 z-[300] flex items-end justify-center bg-black/60';
        popup.onclick=function(e){if(e.target===popup)popup.remove();};
        popup.innerHTML='<div class="glass-strong w-full max-w-md rounded-t-3xl p-6 border-t border-white/10" style="animation:slideUp 0.4s ease-out forwards;"><div class="w-10 h-1 bg-white/20 rounded-full mx-auto mb-4"></div><div class="flex items-center gap-4 mb-4"><img src="'+cover+'" class="w-16 h-16 rounded-xl object-cover shadow-lg" onerror="this.src=\''+FI+'\'" /><div class="flex-1 truncate"><h3 class="font-bold text-white truncate">'+title+'</h3><p class="text-[#b3b3b3] text-sm truncate">'+artist+'</p></div></div><p class="text-[#6b7280] text-xs mb-4 text-center">Seseorang membagikan lagu ini kepadamu</p><div class="flex gap-3"><button id="popup-play" class="flex-1 btn-chrome font-bold py-3 rounded-full active:scale-95">🎵 Putar Sekarang</button><button id="popup-later" class="px-6 py-3 glass glass-hover text-white rounded-full active:scale-95">Nanti</button></div></div>';
        document.body.appendChild(popup);
        popup.querySelector('#popup-play').onclick=function(){popup.remove();S.ct={id:videoId,videoId:videoId,title:title,artist:artist,cover:cover,artistId:'',ytUrl:'https://youtube.com/watch?v='+videoId};S.ps='direct';S.pl=[S.ct];S.pi=0;UU();MP.show();resetLyricsUI(videoId);setTimeout(function(){FullPlayer.open();loadTrack(S.ct);},400);};
        popup.querySelector('#popup-later').onclick=function(){popup.remove();};
    },
    switch(t){
        // Auto-close opened detail modals/tabs when switching bottom navbar
        if(typeof FullPlayer !== 'undefined' && FullPlayer.close) FullPlayer.close();
        if(typeof Album !== 'undefined' && Album.close) Album.close();
        if(typeof Artist !== 'undefined' && Artist.close) Artist.close();
        if(typeof Library !== 'undefined' && Library.closeModalOnly) Library.closeModalOnly();

        // Remove any open popups or dialogs
        document.querySelectorAll('.fixed.z-\\[300\\], .fixed.z-\\[400\\]').forEach(function(el){
            if(el.id !== 'v3-popup' && el.id !== 'mini-player') el.remove();
        });

        var tabs = ['home', 'search', 'library', 'dev'];
        var prevTab = S.at || 'home';
        var prevIndex = tabs.indexOf(prevTab);
        var nextIndex = tabs.indexOf(t);

        S.at = t;

        tabs.forEach(function(id){
            var el = gid('view-' + id);
            if(el) {
                el.style.display = 'none';
                el.classList.remove('animate-slide-right', 'animate-slide-left');
            }
        });

        if(t==='library'){Library.render();}
        if(t==='home'){Home.render();}
        if(t==='search'){Search.onShow();}

        var targetEl = gid('view-' + t);
        if(targetEl) {
            targetEl.style.display = 'block';
            if(prevIndex !== -1 && nextIndex !== -1 && prevIndex !== nextIndex) {
                if(nextIndex > prevIndex) {
                    targetEl.classList.add('animate-slide-right');
                } else {
                    targetEl.classList.add('animate-slide-left');
                }
            }
        }

        ['home','search','library','dev'].forEach(function(n){
            var b=gid('nav-'+n);
            if(!b)return;
            var wrapper = b.querySelector('.nav-icon-wrapper');
            var label = b.querySelector('.nav-label');
            var isCurrent = (n === t);

            if(isCurrent){
                if(wrapper){
                    wrapper.className = 'nav-icon-wrapper w-11 h-11 rounded-full flex items-center justify-center text-white btn-chrome shadow-xl shadow-rose-500/40 border-2 border-white/30 -translate-y-3.5 scale-110 transition-all duration-300';
                }
                if(label){
                    label.className = 'nav-label text-[11px] font-black text-white -translate-y-1 tracking-wider chrome-text transition-all duration-300';
                }
            } else {
                if(wrapper){
                    wrapper.className = 'nav-icon-wrapper w-10 h-10 rounded-full flex items-center justify-center text-[#8e95a2] hover:text-white bg-transparent translate-y-0 transition-all duration-300';
                }
                if(label){
                    label.className = 'nav-label text-[10px] font-semibold text-[#8e95a2] translate-y-0 transition-all duration-300';
                }
            }
        });

        gid('main-area').scrollTop=0;lucide.createIcons();
    },
    showV3Popup() {
        if(localStorage.getItem('seen_v3_popup_update')) return;
        var popup = document.createElement('div');
        popup.id = 'v3-popup';
        popup.className = 'fixed inset-0 z-[400] flex items-center justify-center bg-black/80 px-4';
        popup.style.backdropFilter = 'blur(8px)';
        popup.innerHTML = `
            <div class="glass-strong w-full max-w-sm rounded-3xl p-6 border border-white/10 text-center relative overflow-hidden" style="animation: slideUp 0.3s ease-out forwards;">
                <!-- Header -->
                <div class="relative w-16 h-16 rounded-full mx-auto mb-4 bg-gradient-to-tr from-rose-500 to-amber-500 flex items-center justify-center shadow-lg shadow-rose-500/20">
                    <i data-lucide="sparkles" class="w-8 h-8 text-white"></i>
                </div>
                
                <h2 class="text-2xl font-black chrome-text mb-1">New Version v3 🚀</h2>
                <p class="text-[#6b7280] text-xs mb-5">Berikut adalah fitur dan pembaruan terbaru:</p>
                
                <!-- Features list -->
                <div class="space-y-4 text-left mb-6 max-h-[250px] overflow-y-auto pr-1">
                    <div class="flex items-start gap-3">
                        <div class="w-6 h-6 rounded-lg bg-white/5 flex items-center justify-center shrink-0 mt-0.5">
                            <i data-lucide="sliders" class="w-4 h-4 text-rose-400"></i>
                        </div>
                        <div>
                            <h4 class="text-white font-bold text-sm">Equalizer Suara (Web Audio)</h4>
                            <p class="text-[#b3b3b3] text-xs leading-relaxed">Sesuaikan Bass, Mid, Treble, dan gunakan berbagai Preset Keren untuk kualitas audio musik terbaik.</p>
                        </div>
                    </div>
                    
                    <div class="flex items-start gap-3">
                        <div class="w-6 h-6 rounded-lg bg-white/5 flex items-center justify-center shrink-0 mt-0.5">
                            <i data-lucide="share-2" class="w-4 h-4 text-rose-400"></i>
                        </div>
                        <div>
                            <h4 class="text-white font-bold text-sm">Share Lagu via Link Audio Langsung</h4>
                            <p class="text-[#b3b3b3] text-xs leading-relaxed">Bagikan lagu favorit Anda menggunakan link audio langsung untuk kemudahan berbagi musik.</p>
                        </div>
                    </div>

                    <div class="flex items-start gap-3">
                        <div class="w-6 h-6 rounded-lg bg-white/5 flex items-center justify-center shrink-0 mt-0.5">
                            <i data-lucide="timer" class="w-4 h-4 text-rose-400"></i>
                        </div>
                        <div>
                            <h4 class="text-white font-bold text-sm">Timer Sleep (Pengantar Tidur)</h4>
                            <p class="text-[#b3b3b3] text-xs leading-relaxed">Atur waktu putar musik otomatis sebelum tidur dengan durasi yang dapat ditentukan sendiri.</p>
                        </div>
                    </div>

                    <div class="flex items-start gap-3">
                        <div class="w-6 h-6 rounded-lg bg-white/5 flex items-center justify-center shrink-0 mt-0.5">
                            <i data-lucide="shield-check" class="w-4 h-4 text-rose-400"></i>
                        </div>
                        <div>
                            <h4 class="text-white font-bold text-sm">Fitur Pintar: "Hentikan di Akhir Lagu"</h4>
                            <p class="text-[#b3b3b3] text-xs leading-relaxed">Dilengkapi opsi agar lagu aktif Anda tetap berputar sampai selesai sebelum pemutaran otomatis berhenti tanpa memotong lagu di tengah-tengah.</p>
                        </div>
                    </div>

                    <div class="flex items-start gap-3">
                        <div class="w-6 h-6 rounded-lg bg-white/5 flex items-center justify-center shrink-0 mt-0.5">
                            <i data-lucide="gauge" class="w-4 h-4 text-rose-400"></i>
                        </div>
                        <div>
                            <h4 class="text-white font-bold text-sm">Kontrol Kecepatan Putar</h4>
                            <p class="text-[#b3b3b3] text-xs leading-relaxed">Memungkinkan Anda mempercepat atau memperlambat musik sesuai kebutuhan (mendukung kecepatan 0.5x, 0.75x, 1.0x (Normal), 1.25x, 1.5x, 1.75x, hingga 2.0x).</p>
                        </div>
                    </div>

                    <div class="flex items-start gap-3">
                        <div class="w-6 h-6 rounded-lg bg-white/5 flex items-center justify-center shrink-0 mt-0.5">
                            <i data-lucide="zap" class="w-4 h-4 text-rose-400"></i>
                        </div>
                        <div>
                            <h4 class="text-white font-bold text-sm">Mode "Slowed + Reverb" & "Nightcore"</h4>
                            <p class="text-[#b3b3b3] text-xs leading-relaxed">Kustomisasi getaran audio dengan mengubah kecepatan musik secara instan ke gaya favorit Anda.</p>
                        </div>
                    </div>
                </div>
                
                <!-- Button -->
                <button id="close-v3-popup" class="w-full btn-chrome font-bold py-3.5 rounded-full active:scale-95 transition-all">
                    Keren, Mulai Dengar! 🎵
                </button>
            </div>
        `;
        document.body.appendChild(popup);
        lucide.createIcons();
        popup.querySelector('#close-v3-popup').onclick = function() {
            localStorage.setItem('seen_v3_popup_update', 'true');
            popup.remove();
        };
    }
};
App.init();Home.fetch();

// SPLASH SCREEN - LOGO BULAT BESAR
(function(){
    var sp=gid('splash-screen');
    if(!sp)return;
    // Ganti logo jadi bulat besar
    var logoWrap=sp.querySelector('.logo-wrap');
    if(logoWrap){
        logoWrap.style.width='200px';
        logoWrap.style.height='200px';
        logoWrap.style.borderRadius='50%';
    }
    var logo=sp.querySelector('.logo');
    if(logo){
        logo.style.borderRadius='50%';
        logo.style.objectFit='cover';
    }
    setTimeout(function(){
        sp.classList.add('hide');
        setTimeout(function(){ 
            if(sp&&sp.parentNode) sp.parentNode.removeChild(sp); 
            // Trigger V3 Update popup here
            App.showV3Popup();
        },350);
    },2000);
})();

var Library={
    activeTab: 'liked',
    setTab(t){
        Library.activeTab = t;
        Library.render();
    },
    render(){
        var likedSongs = typeof getLikedSongs === 'function' ? getLikedSongs() : [];
        var pls = typeof getUserPlaylists === 'function' ? getUserPlaylists() : [];
        var isLikedTab = Library.activeTab === 'liked';

        var html = '<div class="pt-12 px-4 pb-12">' +
            '<div class="flex items-center justify-between mb-4">' +
                '<h1 class="text-3xl font-black chrome-text">Library</h1>' +
            '</div>' +
            
            '<!-- Tabs Navigation -->' +
            '<div class="flex gap-2 p-1 bg-white/5 rounded-2xl mb-5 border border-white/5">' +
                '<button onclick="Library.setTab(\'liked\')" class="flex-1 py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ' + (isLikedTab ? 'btn-chrome text-white shadow-lg' : 'text-[#a0a5b0] hover:text-white') + '">' +
                    '<i data-lucide="heart" class="w-4 h-4 ' + (isLikedTab ? 'fill-current text-rose-400' : '') + '"></i>' +
                    '<span>Lagu Disukai</span>' +
                    '<span class="px-1.5 py-0.5 rounded-full text-[10px] bg-white/10 text-white/80">' + likedSongs.length + '</span>' +
                '</button>' +
                '<button onclick="Library.setTab(\'playlists\')" class="flex-1 py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ' + (!isLikedTab ? 'btn-chrome text-white shadow-lg' : 'text-[#a0a5b0] hover:text-white') + '">' +
                    '<i data-lucide="list-music" class="w-4 h-4"></i>' +
                    '<span>Playlist Anda</span>' +
                    '<span class="px-1.5 py-0.5 rounded-full text-[10px] bg-white/10 text-white/80">' + pls.length + '</span>' +
                '</button>' +
            '</div>';

        if(isLikedTab){
            // LIKED SONGS TAB CONTENT
            if(likedSongs.length === 0){
                html += '<div class="text-center text-[#6b7280] py-16 px-4 glass rounded-3xl border border-white/5 mt-2">' +
                    '<div class="w-20 h-20 mx-auto mb-4 rounded-full bg-rose-500/10 flex items-center justify-center border border-rose-500/20">' +
                        '<i data-lucide="heart" class="w-10 h-10 text-rose-400 opacity-60"></i>' +
                    '</div>' +
                    '<h3 class="text-white font-bold text-lg mb-1">Belum Ada Lagu Disukai</h3>' +
                    '<p class="text-xs text-[#6b7280] max-w-xs mx-auto mb-6">Klik ikon <i data-lucide="heart" class="w-3.5 h-3.5 inline text-rose-400"></i> pada Mini Player atau Full Player saat memutar lagu favoritmu.</p>' +
                    '<button onclick="App.switch(\'search\')" class="btn-chrome px-6 py-3 font-bold rounded-full text-xs active:scale-95">🔍 Cari & Temukan Lagu</button>' +
                '</div>';
            } else {
                html += '<!-- Liked Songs Header Card -->' +
                '<div class="relative overflow-hidden rounded-2xl p-5 mb-5 bg-gradient-to-r from-rose-600/30 via-purple-600/20 to-indigo-600/10 border border-white/10 shadow-xl flex items-center justify-between">' +
                    '<div class="flex items-center gap-4 min-w-0">' +
                        '<div class="w-14 h-14 rounded-2xl bg-gradient-to-tr from-rose-500 to-rose-600 flex items-center justify-center shadow-lg shadow-rose-500/30 flex-shrink-0">' +
                            '<i data-lucide="heart" class="w-7 h-7 text-white fill-white"></i>' +
                        '</div>' +
                        '<div class="truncate">' +
                            '<h2 class="text-lg font-black text-white truncate">Lagu Disukai</h2>' +
                            '<p class="text-xs text-[#b3b3b3] mt-0.5">' + likedSongs.length + ' lagu tersimpan</p>' +
                        '</div>' +
                    '</div>' +
                    '<button onclick="Library.playAllLiked()" class="btn-chrome p-3.5 rounded-full shadow-lg shadow-rose-500/20 active:scale-90 flex-shrink-0" title="Putar Semua">' +
                        '<i data-lucide="play" class="w-5 h-5 fill-current ml-0.5"></i>' +
                    '</button>' +
                '</div>' +

                '<!-- Song List -->' +
                '<div id="liked-songs-list" class="space-y-1.5">';
                
                likedSongs.forEach(function(s, i){
                    var isCur = S.ct && (
                        S.ct.id === s.id ||
                        S.ct.videoId === s.videoId ||
                        (S.ct.title === s.title && S.ct.artist === s.artist)
                    );
                    var isPlay = isCur && S.ip;
                    var isLoad = isCur && S.il;

                    var iconOverlay = '';
                    if (isLoad) {
                        iconOverlay = '<div class="w-5 h-5 border-2 border-amber-400 border-t-transparent rounded-full animate-spin"></div>';
                    } else if (isPlay) {
                        iconOverlay = '<div class="flex items-end justify-center gap-[2px] w-5 h-5 pb-0.5"><span class="w-[2px] bg-rose-400 rounded-full animate-eq-1"></span><span class="w-[2px] bg-rose-400 rounded-full animate-eq-2"></span><span class="w-[2px] bg-rose-400 rounded-full animate-eq-3"></span></div>';
                    } else if (isCur) {
                        iconOverlay = '<i data-lucide="pause" class="w-5 h-5 text-rose-400 fill-current"></i>';
                    } else {
                        iconOverlay = '<i data-lucide="play" class="w-5 h-5 text-white fill-white"></i>';
                    }

                    var rowBg = isPlay ? 'bg-gradient-to-r from-rose-500/20 via-rose-500/10 to-transparent border border-rose-500/30 shadow-md' : (isCur ? 'bg-white/10 border border-white/20' : 'hover:bg-white/5 border border-transparent hover:border-white/5');
                    var titleClass = isCur ? 'text-rose-400 font-bold' : 'text-white font-bold';

                    html += '<div class="flex items-center gap-3 p-2.5 rounded-2xl active:scale-[0.99] transition-all group ' + rowBg + '">' +
                        '<div onclick="Library.playLikedIndex(' + i + ')" class="flex items-center gap-3 flex-1 min-w-0 cursor-pointer">' +
                            '<div class="relative w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 shadow-md">' +
                                '<img src="' + s.cover + '" class="w-full h-full object-cover" onerror="this.src=\'' + FI + '\'" />' +
                                '<div class="absolute inset-0 bg-black/40 ' + (isCur ? 'opacity-100' : 'opacity-0 group-hover:opacity-100') + ' transition-all flex items-center justify-center">' +
                                    iconOverlay +
                                '</div>' +
                            '</div>' +
                            '<div class="truncate flex-1">' +
                                '<p class="text-sm truncate transition-colors ' + titleClass + '">' + es(s.title) + '</p>' +
                                '<p class="text-[#6b7280] text-xs truncate mt-0.5">' + es(s.artist) + '</p>' +
                            '</div>' +
                        '</div>' +
                        '<button onclick="toggleLikeSong(' + es(JSON.stringify(s)).replace(/"/g, '&quot;') + ')" class="p-2 text-rose-500 hover:scale-110 active:scale-90 transition-all" title="Hapus dari Lagu Disukai">' +
                            '<i data-lucide="heart" class="w-5 h-5 fill-rose-500"></i>' +
                        '</button>' +
                        '<button onclick="showPlaylistPicker(' + es(JSON.stringify(s)).replace(/"/g, '&quot;') + ')" class="p-2 text-[#6b7280] hover:text-white active:scale-90 transition-all" title="Tambah ke Playlist">' +
                            '<i data-lucide="plus-circle" class="w-5 h-5"></i>' +
                        '</button>' +
                    '</div>';
                });

                html += '</div>';
            }
        } else {
            // PLAYLISTS TAB CONTENT
            html += '<button onclick="Library.createNew()" class="w-full btn-chrome font-bold py-3.5 rounded-2xl active:scale-95 mb-5 flex items-center justify-center gap-2 shadow-lg">+ Buat Playlist Baru</button>';
            
            if(pls.length === 0){
                html += '<div class="text-center text-[#6b7280] py-16 px-4 glass rounded-3xl border border-white/5 mt-2">' +
                    '<i data-lucide="list-music" class="w-16 h-16 mx-auto mb-4 opacity-30 text-white"></i>' +
                    '<h3 class="text-white font-bold text-lg mb-1">Belum Ada Playlist</h3>' +
                    '<p class="text-xs text-[#6b7280] max-w-xs mx-auto mb-5">Buat playlist pertamamu dan kumpulkan lagu-lagu favoritmu di satu tempat.</p>' +
                '</div>';
            } else {
                html += '<div class="grid grid-cols-2 gap-3">';
                pls.forEach(function(p){
                    html += '<div onclick="Library.open(\'' + p.id + '\')" class="glass glass-hover rounded-2xl p-3 cursor-pointer active:scale-95 transition-all">' +
                        '<div class="relative w-full aspect-square mb-2.5 rounded-xl overflow-hidden shadow-lg">' +
                            '<img src="' + (p.image || (p.songs.length > 0 ? p.songs[0].cover : FI)) + '" class="w-full h-full object-cover" onerror="this.src=\'' + FI + '\'" />' +
                            '<button onclick="event.stopPropagation();Library.showActions(\'' + p.id + '\')" class="absolute top-2 right-2 bg-black/60 hover:bg-black/80 rounded-full p-2 active:scale-90 transition-all backdrop-blur-sm" title="Opsi Playlist"><i data-lucide="more-vertical" class="w-4 h-4 text-white"></i></button>' +
                            (p.songs.length > 0 ? '<button onclick="event.stopPropagation();Library.playSong(\'' + p.id + '\',0)" class="absolute bottom-2 right-2 btn-chrome rounded-full p-2.5 shadow-xl shadow-black/40 active:scale-90" title="Putar"><i data-lucide="play" class="w-4 h-4 fill-current ml-0.5"></i></button>' : '') +
                        '</div>' +
                        '<h3 class="font-bold text-sm truncate text-white">' + es(p.name) + '</h3>' +
                        '<p class="text-[#6b7280] text-xs mt-0.5">' + p.songs.length + ' lagu</p>' +
                    '</div>';
                });
                html += '</div>';
            }
        }

        html += '</div>';
        gid('view-library').innerHTML = html;
        lucide.createIcons();
    },
    playAllLiked(){
        var songs = typeof getLikedSongs === 'function' ? getLikedSongs() : [];
        if(!songs.length) return;
        S.pl = songs;
        S.pi = 0;
        S.ps = 'playlist';
        S.ct = S.pl[S.pi];
        UU(); MP.show(); S.il = true; UB();
        resetLyricsUI(S.ct.videoId);
        loadTrack(S.ct);
    },
    playLikedIndex(index){
        var songs = typeof getLikedSongs === 'function' ? getLikedSongs() : [];
        if(!songs[index]) return;
        var s = songs[index];
        if (S.ct && (S.ct.id === s.id || S.ct.videoId === s.videoId || (S.ct.title === s.title && S.ct.artist === s.artist)) && AU.src) {
            TP();
            return;
        }
        S.pl = songs;
        S.pi = index;
        S.ps = 'playlist';
        S.ct = S.pl[S.pi];
        UU(); MP.show(); S.il = true; UB();
        resetLyricsUI(S.ct.videoId);
        loadTrack(S.ct);
    },
    createNew(){
        var popup=document.createElement('div');popup.className='fixed inset-0 z-[300] flex items-end justify-center bg-black/60';
        popup.innerHTML='<div class="glass-strong w-full max-w-md rounded-t-3xl p-6 border-t border-white/10" style="animation:slideUp 0.3s ease-out forwards;"><div class="w-10 h-1 bg-white/20 rounded-full mx-auto mb-4"></div><h3 class="font-bold text-white mb-4">Buat Playlist Baru</h3><input id="pl-name" class="w-full glass-input text-white rounded-xl px-4 py-3 mb-3 focus:outline-none" placeholder="Nama Playlist" /><input id="pl-image" type="file" accept="image/*" class="w-full text-sm text-[#6b7280] mb-4" /><div class="flex gap-3"><button id="pl-create" class="flex-1 btn-chrome font-bold py-3 rounded-full">Buat</button><button onclick="this.closest(\'.fixed\').remove()" class="px-6 py-3 glass glass-hover text-white rounded-full">Batal</button></div></div>';
        document.body.appendChild(popup);
        popup.querySelector('#pl-create').onclick=function(){
            var name=gid('pl-name').value.trim()||'Playlist Baru';
            var file=gid('pl-image').files[0];
            if(file){var reader=new FileReader();reader.onload=function(e){createPlaylist(name,e.target.result);popup.remove();Library.render();};reader.readAsDataURL(file);}
            else{createPlaylist(name,'');popup.remove();Library.render();}
        };
    },
    showActions(id){
        var pls=getUserPlaylists();var pl=pls.find(function(p){return p.id===id;});if(!pl)return;
        var popup=document.createElement('div');popup.className='fixed inset-0 z-[300] flex items-end justify-center bg-black/60';
        popup.onclick=function(e){if(e.target===popup)popup.remove();};
        popup.innerHTML='<div class="w-full max-w-md rounded-t-3xl p-6 border-t border-white/10 glass-strong" style="animation:slideUp 0.3s ease-out forwards; background: var(--bg-color);">'+
            '<div class="w-10 h-1 bg-white/20 rounded-full mx-auto mb-4"></div>'+
            '<div class="flex items-center gap-3 mb-5"><img src="'+(pl.image||(pl.songs.length>0?pl.songs[0].cover:FI))+'" class="w-12 h-12 rounded-lg object-cover" onerror="this.src=\''+FI+'\'" /><div class="truncate"><h3 class="font-bold text-white truncate">'+es(pl.name)+'</h3><p class="text-[#6b7280] text-xs">'+pl.songs.length+' lagu</p></div></div>'+
            '<button onclick="this.closest(\'.fixed\').remove();Library.editPlaylist(\''+id+'\')" class="w-full text-left p-4 rounded-xl hover:bg-white/5 flex items-center gap-3 mb-1"><i data-lucide="pencil" class="w-5 h-5 text-[#cfd3d8]"></i><span class="font-medium text-white">Edit Playlist</span></button>'+
            '<button onclick="this.closest(\'.fixed\').remove();Library.confirmDelete(\''+id+'\')" class="w-full text-left p-4 rounded-xl hover:bg-red-500/10 flex items-center gap-3"><i data-lucide="trash-2" class="w-5 h-5 text-red-400"></i><span class="font-medium text-red-400">Hapus Playlist</span></button>'+
        '</div>';
        document.body.appendChild(popup);lucide.createIcons();
    },
    editPlaylist(id){
        var pls=getUserPlaylists();var pl=pls.find(function(p){return p.id===id;});if(!pl)return;
        var popup=document.createElement('div');popup.className='fixed inset-0 z-[300] flex items-end justify-center bg-black/60';
        popup.innerHTML='<div class="glass-strong w-full max-w-md rounded-t-3xl p-6 border-t border-white/10" style="animation:slideUp 0.3s ease-out forwards;"><div class="w-10 h-1 bg-white/20 rounded-full mx-auto mb-4"></div><h3 class="font-bold text-white mb-4">Edit Playlist</h3><input id="pl-edit-name" class="w-full glass-input text-white rounded-xl px-4 py-3 mb-3 focus:outline-none" placeholder="Nama Playlist" value="'+es(pl.name).replace(/"/g,'&quot;')+'" /><input id="pl-edit-image" type="file" accept="image/*" class="w-full text-sm text-[#6b7280] mb-4" /><div class="flex gap-3"><button id="pl-edit-save" class="flex-1 btn-chrome font-bold py-3 rounded-full">Simpan</button><button onclick="this.closest(\'.fixed\').remove()" class="px-6 py-3 glass glass-hover text-white rounded-full">Batal</button></div></div>';
        document.body.appendChild(popup);
        popup.querySelector('#pl-edit-save').onclick=function(){
            var name=gid('pl-edit-name').value.trim()||pl.name;
            var file=gid('pl-edit-image').files[0];
            if(file){var reader=new FileReader();reader.onload=function(e){updateUserPlaylist(id,name,e.target.result);popup.remove();Library.render();showToast('✅ Playlist diperbarui');};reader.readAsDataURL(file);}
            else{updateUserPlaylist(id,name,null);popup.remove();Library.render();showToast('✅ Playlist diperbarui');}
        };
    },
    confirmDelete(id){
        var pls=getUserPlaylists();var pl=pls.find(function(p){return p.id===id;});if(!pl)return;
        var popup=document.createElement('div');popup.className='fixed inset-0 z-[300] flex items-end justify-center bg-black/60';
        popup.innerHTML='<div class="glass-strong w-full max-w-md rounded-t-3xl p-6 border-t border-white/10" style="animation:slideUp 0.3s ease-out forwards;"><div class="w-10 h-1 bg-white/20 rounded-full mx-auto mb-4"></div><h3 class="font-bold text-white mb-2">Hapus "'+es(pl.name)+'"?</h3><p class="text-[#6b7280] text-sm mb-5">Playlist ini akan dihapus permanen dan tidak bisa dikembalikan.</p><div class="flex gap-3"><button onclick="deleteUserPlaylist(\''+id+'\');this.closest(\'.fixed\').remove();Library.render();Library.close();showToast(\'🗑️ Playlist dihapus\')" class="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-full active:scale-95">Hapus</button><button onclick="this.closest(\'.fixed\').remove()" class="px-6 py-3 glass glass-hover text-white rounded-full">Batal</button></div></div>';
        document.body.appendChild(popup);
    },
    currentPlaylistId: null,
    open(id){
        var pls=getUserPlaylists();var pl=pls.find(function(p){return p.id===id;});if(!pl)return;
        Library.currentPlaylistId = id;
        
        var modal = gid('library-modal');
        if(!modal) {
            modal = document.createElement('div');
            modal.id = 'library-modal';
            modal.className = 'fixed inset-0 bg-[#050507] flex flex-col z-30';
            modal.style.animation = 'slideUp 0.3s ease-out forwards';
            document.body.appendChild(modal);
        }
        modal.style.display = 'flex';
        
        var html=`
            <div class="flex items-center gap-3 p-4 pt-6 bg-transparent absolute top-0 left-0 w-full z-10" id="library-header">
                <button onclick="Library.close()" class="glass glass-hover rounded-full text-white p-3 active:scale-90 shadow-md backdrop-blur-md bg-black/40"><i data-lucide="arrow-left" class="w-6 h-6"></i></button>
                <div class="flex-1"></div>
                <div class="flex items-center gap-1 bg-black/40 backdrop-blur-md rounded-full shadow-md">
                    <button onclick="Library.editPlaylist('${id}')" class="text-[#cfd3d8] hover:text-white p-2.5 active:scale-90" title="Edit Playlist"><i data-lucide="pencil" class="w-5 h-5"></i></button>
                    <button onclick="Library.confirmDelete('${id}')" class="text-red-400 hover:text-red-300 p-2.5 active:scale-90" title="Hapus Playlist"><i data-lucide="trash-2" class="w-5 h-5"></i></button>
                </div>
            </div>
            <div class="flex-1 overflow-y-auto hide-scrollbar pb-36 pt-24" id="library-content">
                <div class="relative w-full max-w-[220px] aspect-square mx-auto mb-4 rounded-2xl overflow-hidden glass-edge shadow-2xl shadow-black/40">
                    <img src="${pl.image||(pl.songs.length>0?pl.songs[0].cover:FI)}" class="w-full h-full object-cover" onerror="this.src='${FI}'" />
                    <div class="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                </div>
                <div class="text-center mb-5 px-4"><h1 class="text-xl font-bold truncate">${es(pl.name)}</h1><p class="text-[#6b7280] text-xs mt-1">${pl.songs.length} lagu</p></div>
                ${pl.songs.length>0?`<button onclick="Library.playSong('${id}',0)" class="btn-chrome font-bold rounded-full mx-auto mb-6 flex items-center justify-center shadow-xl shadow-black/40 active:scale-90 hover:scale-105 transition-all" style="width:64px;height:64px;" title="Putar Semua"><i data-lucide="play" class="w-7 h-7 fill-current ml-0.5"></i></button>`:''}
        `;
        if(pl.songs.length===0){
            html+='<div class="text-center text-[#6b7280] mt-10"><p>Belum ada lagu</p></div>';
        } else {
            html+='<div id="playlist-songs-list" class="space-y-1 px-4">';
            pl.songs.forEach(function(s,i){
                var isCur = S.ct && (
                    S.ct.id === s.id ||
                    S.ct.videoId === s.videoId ||
                    (S.ct.title === s.title && S.ct.artist === s.artist)
                );
                var isPlay = isCur && S.ip;
                var isLoad = isCur && S.il;

                var iconOverlay = '';
                if (isLoad) {
                    iconOverlay = '<div class="w-4 h-4 border-2 border-amber-400 border-t-transparent rounded-full animate-spin"></div>';
                } else if (isPlay) {
                    iconOverlay = '<div class="flex items-end justify-center gap-[2px] w-4 h-4 pb-0.5"><span class="w-[2px] bg-rose-400 rounded-full animate-eq-1"></span><span class="w-[2px] bg-rose-400 rounded-full animate-eq-2"></span><span class="w-[2px] bg-rose-400 rounded-full animate-eq-3"></span></div>';
                } else if (isCur) {
                    iconOverlay = '<i data-lucide="pause" class="w-4 h-4 text-rose-400 fill-current"></i>';
                } else {
                    iconOverlay = '<i data-lucide="play" class="w-4 h-4 text-white fill-white"></i>';
                }

                var rowBg = isPlay ? 'bg-gradient-to-r from-rose-500/20 via-rose-500/10 to-transparent border border-rose-500/30 shadow-md' : (isCur ? 'bg-white/10 border border-white/20' : 'hover:bg-white/5 border border-transparent');
                var titleClass = isCur ? 'text-rose-400 font-bold' : 'text-white font-medium';

                html+='<div class="flex items-center gap-2 p-2 rounded-lg active:scale-[0.98] ' + rowBg + '"><div onclick="Library.playSong(\''+id+'\','+i+')" class="flex items-center gap-3 flex-1 cursor-pointer overflow-hidden"><div class="relative w-10 h-10 rounded overflow-hidden shrink-0"><img src="'+s.cover+'" class="w-full h-full object-cover" onerror="this.src=\'' + FI + '\'" /><div class="absolute inset-0 bg-black/40 ' + (isCur ? 'opacity-100' : 'opacity-0 group-hover:opacity-100') + ' transition-all flex items-center justify-center">' + iconOverlay + '</div></div><div class="truncate flex-1 min-w-0"><p class="text-sm truncate ' + titleClass + '">'+es(s.title)+'</p><p class="text-[#6b7280] text-xs truncate">'+es(s.artist)+'</p></div></div><button onclick="Library.removeSong(\''+id+'\','+i+')" class="text-[#6b7280] hover:text-red-400 p-2 active:scale-90 shrink-0" title="Hapus"><i data-lucide="x" class="w-5 h-5"></i></button></div>';
            });
            html+='</div>';
        }
        html+='</div>';
        modal.innerHTML=html;
        lucide.createIcons();
    },
    closeModalOnly() {
        var modal = gid('library-modal');
        if(modal) modal.style.display = 'none';
        Library.currentPlaylistId = null;
    },
    close() {
        this.closeModalOnly();
        if (S.at === 'library') Library.render();
    },
    renderActive() {
        if (S.at === 'library' && S.libTab === 'liked') {
            Library.render();
            return;
        }
        var modal = gid('library-modal');
        if (!modal || modal.style.display === 'none' || !Library.currentPlaylistId) return;
        var pls = getUserPlaylists();
        var pl = pls.find(function(p){ return p.id === Library.currentPlaylistId; });
        var container = gid('playlist-songs-list');
        if (!container || !pl || !pl.songs) return;

        var children = container.children;
        for (var i = 0; i < pl.songs.length; i++) {
            var s = pl.songs[i];
            var el = children[i];
            if (!el) continue;

            var isCur = S.ct && (
                S.ct.id === s.id ||
                S.ct.videoId === s.videoId ||
                (S.ct.title === s.title && S.ct.artist === s.artist)
            );
            var isPlay = isCur && S.ip;
            var isLoad = isCur && S.il;

            var iconOverlay = '';
            if (isLoad) {
                iconOverlay = '<div class="w-4 h-4 border-2 border-amber-400 border-t-transparent rounded-full animate-spin"></div>';
            } else if (isPlay) {
                iconOverlay = '<div class="flex items-end justify-center gap-[2px] w-4 h-4 pb-0.5"><span class="w-[2px] bg-rose-400 rounded-full animate-eq-1"></span><span class="w-[2px] bg-rose-400 rounded-full animate-eq-2"></span><span class="w-[2px] bg-rose-400 rounded-full animate-eq-3"></span></div>';
            } else if (isCur) {
                iconOverlay = '<i data-lucide="pause" class="w-4 h-4 text-rose-400 fill-current"></i>';
            } else {
                iconOverlay = '<i data-lucide="play" class="w-4 h-4 text-white fill-white"></i>';
            }

            var coverOverlay = el.querySelector('.relative.w-10 .absolute');
            if (coverOverlay) {
                coverOverlay.innerHTML = iconOverlay;
                coverOverlay.className = 'absolute inset-0 bg-black/40 ' + (isCur ? 'opacity-100' : 'opacity-0 group-hover:opacity-100') + ' transition-all flex items-center justify-center';
            }

            var rowBg = isPlay ? 'bg-gradient-to-r from-rose-500/20 via-rose-500/10 to-transparent border border-rose-500/30 shadow-md' : (isCur ? 'bg-white/10 border border-white/20' : 'hover:bg-white/5 border border-transparent');
            el.className = 'flex items-center gap-2 p-2 rounded-lg active:scale-[0.98] ' + rowBg;

            var titleEl = el.querySelector('p');
            if (titleEl) {
                titleEl.className = 'text-sm truncate ' + (isCur ? 'text-rose-400 font-bold' : 'text-white font-medium');
            }
        }
        lucide.createIcons();
    },
    removeSong(plId,index){var pls=getUserPlaylists();var pl=pls.find(function(p){return p.id===plId;});if(!pl)return;pl.songs.splice(index,1);saveUserPlaylists(pls);Library.open(plId);showToast('🗑️ Lagu dihapus');},
    playSong(plId,index){
        var pls=getUserPlaylists();var pl=pls.find(function(p){return p.id===plId;});if(!pl||!pl.songs[index])return;
        var s = pl.songs[index];
        if (S.ct && (S.ct.id === s.id || S.ct.videoId === s.videoId || (S.ct.title === s.title && S.ct.artist === s.artist)) && AU.src) {
            TP();
            return;
        }
        S.pl=pl.songs;S.pi=index;S.ps='playlist';S.ct=S.pl[S.pi];UU();MP.show();S.il=true;UB();resetLyricsUI(S.ct.videoId);loadTrack(S.ct);
    }
};