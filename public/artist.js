var Artist={
    init(){
        gid('artist-container').innerHTML=`
        <div id="artist-modal" class="fixed inset-0 bg-[#050507] flex flex-col z-30" style="display:none;">
            <div class="flex items-center gap-3 p-4 pt-6">
                <button onclick="Artist.close()" class="glass glass-hover rounded-full text-white p-3 active:scale-90"><i data-lucide="x" class="w-6 h-6"></i></button>
                <h1 id="artist-name" class="text-xl font-bold truncate">Artist</h1>
            </div>
            <div class="flex-1 overflow-y-auto hide-scrollbar pb-36" id="artist-content">
                <p class="text-center text-[#6b7280] mt-10">Memuat...</p>
            </div>
        </div>`;
        lucide.createIcons();
    },
    open(id,name){
        var url=location.origin+'/artist/'+id;
        history.pushState({},'',url);
        gid('artist-modal').style.display='flex';
        gid('artist-name').innerText=name||'Artist';
        gid('artist-content').innerHTML=`
        <div class="flex justify-center mt-10">
            <div class="w-10 h-10 border-3 border-[#cfd3d8] border-t-transparent rounded-full animate-spin"></div>
        </div>`;
        fetch(API.artist+'?id='+id).then(function(r){return r.json();}).then(function(d){
            if(d.status&&d.result){
                var a=d.result;
                var headerImg=a.thumbnails&&a.thumbnails.length>0?a.thumbnails[a.thumbnails.length-1].url:FI;
                var html='';
                
                // HEADER
                html+=`
                <div class="relative mb-6 pt-8">
                    <div class="absolute top-0 left-0 right-0 h-48 overflow-hidden rounded-b-3xl">
                        <img src="${headerImg}" class="w-full h-full object-cover blur-3xl opacity-35 scale-150" />
                        <div class="absolute inset-0 bg-gradient-to-b from-transparent to-[#050507]"></div>
                    </div>
                    <div class="relative z-10 flex flex-col items-center">
                        <img src="${headerImg}" class="artist-photo shadow-2xl" onerror="this.src='${FI}'" />
                        <h2 class="text-2xl font-bold mt-4">${es(a.name)}</h2>
                    </div>
                </div>`;
                
                // TOP SONGS
                if(a.topSongs&&a.topSongs.length>0){
                    Artist.currentArtistData = a;
                    html+='<div class="mb-6"><h3 class="font-bold text-sm text-[#b3b3b3] uppercase tracking-wider mb-3 px-4">Lagu Teratas</h3><div id="artist-songs-list" class="space-y-1 px-2">';
                    a.topSongs.slice(0,10).forEach(function(s,i){
                        var im=FI;
                        if(s.thumbnails && s.thumbnails.length > 0) {
                            var lastT = s.thumbnails[s.thumbnails.length - 1];
                            im = typeof lastT === 'string' ? lastT : (lastT.url || lastT.src || FI);
                        }

                        var isCur = S.ct && (
                            S.ct.id === s.videoId ||
                            S.ct.videoId === s.videoId ||
                            (S.ct.title === s.title && S.ct.artist === (s.artist||a.name))
                        );
                        var isPlay = isCur && S.ip;
                        var isLoad = isCur && S.il;

                        var numHtml = '';
                        var btnIcon = '';
                        if (isLoad) {
                            numHtml = '<div class="w-4 h-4 border-2 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto"></div>';
                            btnIcon = '<div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>';
                        } else if (isPlay) {
                            numHtml = '<div class="flex items-end justify-center gap-[2px] w-4 h-4 pb-0.5 mx-auto"><span class="w-[2px] bg-rose-400 rounded-full animate-eq-1"></span><span class="w-[2px] bg-rose-400 rounded-full animate-eq-2"></span><span class="w-[2px] bg-rose-400 rounded-full animate-eq-3"></span></div>';
                            btnIcon = '<div class="flex items-end justify-center gap-[2px] w-4 h-4 pb-0.5"><span class="w-[2px] bg-rose-400 rounded-full animate-eq-1"></span><span class="w-[2px] bg-rose-400 rounded-full animate-eq-2"></span><span class="w-[2px] bg-rose-400 rounded-full animate-eq-3"></span></div>';
                        } else if (isCur) {
                            numHtml = '<i data-lucide="pause" class="w-4 h-4 text-rose-400 fill-current mx-auto"></i>';
                            btnIcon = '<i data-lucide="pause" class="w-5 h-5 text-rose-400 fill-current"></i>';
                        } else {
                            numHtml = (i + 1);
                            btnIcon = '<i data-lucide="play" class="w-5 h-5 text-[#6b7280] group-hover:text-[#cfd3d8] fill-current"></i>';
                        }

                        var rowBg = isPlay ? 'bg-gradient-to-r from-rose-500/20 via-rose-500/10 to-transparent border border-rose-500/30 shadow-md' : (isCur ? 'bg-white/10 border border-white/20' : 'hover:bg-white/5 border border-transparent');
                        var titleClass = isCur ? 'text-rose-400 font-bold' : 'text-white font-medium';

                        html+=`
                        <div onclick="Artist.play('${s.videoId}','${es(s.title).replace(/'/g,"\\'")}','${es(s.artist||a.name).replace(/'/g,"\\'")}','${im}')" class="flex items-center gap-3 p-3 rounded-xl cursor-pointer active:scale-[0.98] transition-all group ${rowBg}">
                            <span class="text-[#6b7280] w-6 text-center text-sm group-hover:text-white shrink-0">${numHtml}</span>
                            <img src="${im}" class="w-12 h-12 rounded-lg object-cover shadow-md shrink-0" onerror="this.src='${FI}'" />
                            <div class="flex-1 min-w-0 truncate">
                                <p class="text-sm truncate transition-colors ${titleClass}">${es(s.title)}</p>
                                <p class="text-[#6b7280] text-xs truncate">${es(s.artist||a.name)}</p>
                            </div>
                            <div class="shrink-0 p-1">${btnIcon}</div>
                        </div>`;
                    });
                    html+='</div></div>';
                }
                
                // TOP ALBUMS
                if(a.topAlbums&&a.topAlbums.length>0){
                    html+='<div class="mb-6"><h3 class="font-bold text-sm text-[#b3b3b3] uppercase tracking-wider mb-3 px-4">Album</h3><div class="flex gap-3 overflow-x-auto hide-scrollbar pb-2 px-4">';
                    a.topAlbums.forEach(function(al){
                        var im=FI;
                        if(al.thumbnails && al.thumbnails.length > 0) {
                            var lastT = al.thumbnails[al.thumbnails.length - 1];
                            im = typeof lastT === 'string' ? lastT : (lastT.url || lastT.src || FI);
                        }
                        html+=`
                        <div onclick="Album.open('${al.browseId}', '${al.thumbnails&&al.thumbnails.length?al.thumbnails[0].url||'':''}')" class="flex-shrink-0 w-36 cursor-pointer group">
                            <div class="w-36 h-36 rounded-xl overflow-hidden shadow-lg mb-2">
                                <img src="${im}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" onerror="this.src='${FI}'" />
                            </div>
                            <p class="font-medium text-sm truncate group-hover:text-[#cfd3d8] transition-colors">${es(al.name)}</p>
                            <p class="text-[#6b7280] text-xs">Album • ${es(al.artist||a.name)}</p>
                        </div>`;
                    });
                    html+='</div></div>';
                }
                
                // TOP SINGLES
                if(a.topSingles&&a.topSingles.length>0){
                    html+='<div class="mb-6"><h3 class="font-bold text-sm text-[#b3b3b3] uppercase tracking-wider mb-3 px-4">Singles & EP</h3><div class="flex gap-3 overflow-x-auto hide-scrollbar pb-2 px-4">';
                    a.topSingles.forEach(function(sg){
                        var im=FI;
                        if(sg.thumbnails && sg.thumbnails.length > 0) {
                            var lastT = sg.thumbnails[sg.thumbnails.length - 1];
                            im = typeof lastT === 'string' ? lastT : (lastT.url || lastT.src || FI);
                        }
                        html+=`
                        <div onclick="Album.open('${sg.browseId}', '${sg.thumbnails&&sg.thumbnails.length?sg.thumbnails[0].url||'':''}')" class="flex-shrink-0 w-36 cursor-pointer group">
                            <div class="w-36 h-36 rounded-xl overflow-hidden shadow-lg mb-2">
                                <img src="${im}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" onerror="this.src='${FI}'" />
                            </div>
                            <p class="font-medium text-sm truncate group-hover:text-[#cfd3d8] transition-colors">${es(sg.name)}</p>
                            <p class="text-[#6b7280] text-xs">Single</p>
                        </div>`;
                    });
                    html+='</div></div>';
                }
                
                // TOP VIDEOS
                if(a.topVideos&&a.topVideos.length>0){
                    html+='<div class="mb-6"><h3 class="font-bold text-sm text-[#b3b3b3] uppercase tracking-wider mb-3 px-4">Video</h3><div class="flex gap-3 overflow-x-auto hide-scrollbar pb-2 px-4">';
                    a.topVideos.forEach(function(vd){
                        var im=FI;
                        if(vd.thumbnails && vd.thumbnails.length > 0) {
                            var lastT = vd.thumbnails[vd.thumbnails.length - 1];
                            im = typeof lastT === 'string' ? lastT : (lastT.url || lastT.src || FI);
                        }
                        html+=`
                        <div onclick="Artist.play('${vd.videoId||''}','${es(vd.name).replace(/'/g,"\\'")}','${es(vd.artist||a.name).replace(/'/g,"\\'")}','${im}')" class="flex-shrink-0 w-44 cursor-pointer group">
                            <div class="w-44 h-24 rounded-xl overflow-hidden shadow-lg mb-2 relative">
                                <img src="${im}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" onerror="this.src='${FI}'" />
                                <div class="absolute bottom-2 right-2 bg-black/70 rounded-full p-1.5"><i data-lucide="play" class="w-4 h-4 fill-current text-white"></i></div>
                            </div>
                            <p class="font-medium text-sm truncate group-hover:text-[#cfd3d8] transition-colors">${es(vd.name)}</p>
                            <p class="text-[#6b7280] text-xs">${es(vd.artist||a.name)}</p>
                        </div>`;
                    });
                    html+='</div></div>';
                }
                
                // PLAYLISTS
                if(a.playlists&&a.playlists.length>0){
                    html+='<div class="mb-6"><h3 class="font-bold text-sm text-[#b3b3b3] uppercase tracking-wider mb-3 px-4">Playlist</h3><div class="flex gap-3 overflow-x-auto hide-scrollbar pb-2 px-4">';
                    a.playlists.forEach(function(pl){
                        var im=FI;
                        if(pl.thumbnails && pl.thumbnails.length > 0) {
                            var lastT = pl.thumbnails[pl.thumbnails.length - 1];
                            im = typeof lastT === 'string' ? lastT : (lastT.url || lastT.src || FI);
                        }
                        html+=`
                        <div onclick="Album.open('${pl.browseId}', '${pl.thumbnails&&pl.thumbnails.length?pl.thumbnails[0].url||'':''}')" class="flex-shrink-0 w-36 cursor-pointer group">
                            <div class="w-36 h-36 rounded-xl overflow-hidden shadow-lg mb-2">
                                <img src="${im}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" onerror="this.src='${FI}'" />
                            </div>
                            <p class="font-medium text-sm truncate group-hover:text-[#cfd3d8]">${es(pl.name)}</p>
                        </div>`;
                    });
                    html+='</div></div>';
                }
                
                // FEATURED ON
                if(a.featuredOn&&a.featuredOn.length>0){
                    html+='<div class="mb-6"><h3 class="font-bold text-sm text-[#b3b3b3] uppercase tracking-wider mb-3 px-4">Tampil Di</h3><div class="flex gap-3 overflow-x-auto hide-scrollbar pb-2 px-4">';
                    a.featuredOn.forEach(function(fo){
                        var im=FI;
                        if(fo.thumbnails && fo.thumbnails.length > 0) {
                            var lastT = fo.thumbnails[fo.thumbnails.length - 1];
                            im = typeof lastT === 'string' ? lastT : (lastT.url || lastT.src || FI);
                        }
                        html+=`
                        <div onclick="Album.open('${fo.browseId}', '${fo.thumbnails&&fo.thumbnails.length?fo.thumbnails[0].url||'':''}')" class="flex-shrink-0 w-36 cursor-pointer group">
                            <div class="w-36 h-36 rounded-xl overflow-hidden shadow-lg mb-2">
                                <img src="${im}" class="w-full h-full object-cover" onerror="this.src='${FI}'" />
                            </div>
                            <p class="font-medium text-sm truncate">${es(fo.name)}</p>
                            <p class="text-[#6b7280] text-xs">${es(fo.artist||'')}</p>
                        </div>`;
                    });
                    html+='</div></div>';
                }
                
                // SIMILAR ARTISTS
                if(a.similarArtists&&a.similarArtists.length>0){
                    html+='<div class="mb-6"><h3 class="font-bold text-sm text-[#b3b3b3] uppercase tracking-wider mb-3 px-4">Artis Serupa</h3><div class="flex gap-4 overflow-x-auto hide-scrollbar pb-2 px-4">';
                    a.similarArtists.forEach(function(s){
                        var im=FI;
                        if(s.thumbnails && s.thumbnails.length > 0) {
                            var lastT = s.thumbnails[s.thumbnails.length - 1];
                            im = typeof lastT === 'string' ? lastT : (lastT.url || lastT.src || FI);
                        }
                        html+=`
                        <div onclick="Artist.open('${s.browseId}','${es(s.name).replace(/'/g,"\\'")}')" class="flex-shrink-0 text-center cursor-pointer group">
                            <div class="w-24 h-24 rounded-full overflow-hidden shadow-lg ring-2 ring-transparent group-hover:ring-[#cfd3d8]/50 transition-all">
                                <img src="${im}" class="w-full h-full object-cover" onerror="this.src='${FI}'" />
                            </div>
                            <p class="text-xs mt-2 truncate w-24 group-hover:text-[#cfd3d8] transition-colors">${es(s.name)}</p>
                        </div>`;
                    });
                    html+='</div></div>';
                }
                
                gid('artist-content').innerHTML=html;
                lucide.createIcons();
            }
        });
    },
    currentArtistData: null,
    renderActive() {
        var modal = gid('artist-modal');
        if (!modal || modal.style.display === 'none' || !Artist.currentArtistData) return;
        var a = Artist.currentArtistData;
        var container = gid('artist-songs-list');
        if (!container || !a.topSongs) return;

        var songs = a.topSongs.slice(0, 10);
        var children = container.children;
        for (var i = 0; i < songs.length; i++) {
            var s = songs[i];
            var el = children[i];
            if (!el) continue;

            var isCur = S.ct && (
                S.ct.id === s.videoId ||
                S.ct.videoId === s.videoId ||
                (S.ct.title === s.title && S.ct.artist === (s.artist||a.name))
            );
            var isPlay = isCur && S.ip;
            var isLoad = isCur && S.il;

            var numHtml = '';
            var btnIcon = '';
            if (isLoad) {
                numHtml = '<div class="w-4 h-4 border-2 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto"></div>';
                btnIcon = '<div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>';
            } else if (isPlay) {
                numHtml = '<div class="flex items-end justify-center gap-[2px] w-4 h-4 pb-0.5 mx-auto"><span class="w-[2px] bg-rose-400 rounded-full animate-eq-1"></span><span class="w-[2px] bg-rose-400 rounded-full animate-eq-2"></span><span class="w-[2px] bg-rose-400 rounded-full animate-eq-3"></span></div>';
                btnIcon = '<div class="flex items-end justify-center gap-[2px] w-4 h-4 pb-0.5"><span class="w-[2px] bg-rose-400 rounded-full animate-eq-1"></span><span class="w-[2px] bg-rose-400 rounded-full animate-eq-2"></span><span class="w-[2px] bg-rose-400 rounded-full animate-eq-3"></span></div>';
            } else if (isCur) {
                numHtml = '<i data-lucide="pause" class="w-4 h-4 text-rose-400 fill-current mx-auto"></i>';
                btnIcon = '<i data-lucide="pause" class="w-5 h-5 text-rose-400 fill-current"></i>';
            } else {
                numHtml = (i + 1);
                btnIcon = '<i data-lucide="play" class="w-5 h-5 text-[#6b7280] group-hover:text-[#cfd3d8] fill-current"></i>';
            }

            var numSpan = el.children[0];
            if (numSpan) numSpan.innerHTML = numHtml;

            var btnDiv = el.children[3];
            if (btnDiv) btnDiv.innerHTML = btnIcon;

            var rowBg = isPlay ? 'bg-gradient-to-r from-rose-500/20 via-rose-500/10 to-transparent border border-rose-500/30 shadow-md' : (isCur ? 'bg-white/10 border border-white/20' : 'hover:bg-white/5 border border-transparent');
            el.className = 'flex items-center gap-3 p-3 rounded-xl cursor-pointer active:scale-[0.98] transition-all group ' + rowBg;

            var titleEl = el.querySelector('p');
            if (titleEl) {
                titleEl.className = 'text-sm truncate transition-colors ' + (isCur ? 'text-rose-400 font-bold' : 'text-white font-medium');
            }
        }
        lucide.createIcons();
    },
    close(){
        if(window.location.pathname.startsWith('/artist/')) history.pushState({},'', '/');
        gid('artist-modal').style.display='none';
        Artist.currentArtistData = null;
    },
    play(vid,title,artist,cover){
        if (S.ct && (S.ct.id === vid || S.ct.videoId === vid || (S.ct.title === title && S.ct.artist === artist)) && AU.src) {
            TP();
            return;
        }
        var cov = cover || FI;
        S.ct={id:vid,videoId:vid,title:title,artist:artist,cover:cov,artistId:'',ytUrl:'https://youtube.com/watch?v='+vid};
        S.ps='artist';S.pl=[S.ct];S.pi=0;
        var url=location.origin+'/play/'+S.ct.videoId;history.pushState({},'',url);
        UU();MP.show();S.il=true;UB();
        resetLyricsUI(vid);
        loadTrack(S.ct);
    }
};