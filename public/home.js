var Home={
    render(){
        gid('view-home').innerHTML=`
        <div class="glass-pane border-b border-white/5 pt-12 pb-6 px-4 sticky top-0 z-10">
            <div class="flex justify-between items-center"><div><h1 class="text-3xl font-black chrome-text">NanzMusify</h1><p class="text-[#b3b3b3] text-xs mt-1">Rekomendasi buat kamu</p></div><div class="flex items-center gap-2"><button onclick="Home.refresh()" class="glass glass-hover rounded-full p-2.5 text-[#b3b3b3] hover:text-white active:scale-90" title="Muat Ulang"><i data-lucide="refresh-cw" class="w-4 h-4"></i></button></div></div>
        </div>
        <div class="px-4 space-y-6 mt-4"><div id="home-grid" class="grid grid-cols-2 md:grid-cols-4 gap-3"></div><div><h2 class="text-lg font-bold mb-3">Playlist & Album</h2><div id="home-scroll" class="flex gap-4 overflow-x-auto hide-scrollbar pb-4"></div></div><div><h2 class="text-lg font-bold mb-3">Artis Top</h2><div id="home-artists" class="flex gap-4 overflow-x-auto hide-scrollbar pb-4"></div></div></div>`;
        lucide.createIcons();
        if(S.ht && S.ht.length > 0){Home.show();}else{Home.showSkeleton();}
    },
    showSkeleton(){
        var g=gid('home-grid'),s=gid('home-scroll');if(!g||!s)return;
        g.innerHTML=Array(6).fill(0).map(function(_,i){
            return '<div class="glass rounded-xl flex items-center gap-3 p-2 animate-pulse"><div class="w-14 h-14 rounded-lg bg-white/5"></div><div class="flex-grow space-y-2"><div class="h-3.5 bg-white/10 rounded w-3/4"></div><div class="h-2.5 bg-white/5 rounded w-1/2"></div></div></div>';
        }).join('');
        var a=gid('home-artists');
        if(a) a.innerHTML=Array(4).fill(0).map(function(_,i){
            return '<div class="flex-shrink-0 w-32 animate-pulse"><div class="w-32 h-32 mb-2 rounded-full bg-white/5"></div><div class="h-3.5 bg-white/10 rounded w-3/4 mx-auto mb-1"></div></div>';
        }).join('');
        s.innerHTML=Array(4).fill(0).map(function(_,i){
            return '<div class="flex-shrink-0 w-40 animate-pulse"><div class="w-40 h-40 mb-2 rounded-xl bg-white/5"></div><div class="h-3.5 bg-white/10 rounded w-3/4 mb-1"></div><div class="h-2.5 bg-white/5 rounded w-1/2"></div></div>';
        }).join('');
    },
    async fetch(){
        Home.showSkeleton();
        try{
            var q=['indonesia populer','top hits barat','lagu terbaru 2024'][Math.floor(Math.random()*3)];
            var r=await fetch(API.search+'?query='+encodeURIComponent(q)+'&type=all');
            var d=await r.json();
            if(d.status){
                if (d.result.songs) {
                    S.ht=d.result.songs.map(function(s){return{id:s.videoId,videoId:s.videoId,title:cn(s.title),artist:cn(s.artist),artistId:s.artistId||'',cover:s.thumbnail||(s.videoId?'https://i.ytimg.com/vi/'+s.videoId+'/hqdefault.jpg':FI),ytUrl:s.url};});
                }
                if (d.result.playlists || d.result.albums) {
                    S.hp = [].concat(d.result.playlists||[]).concat(d.result.albums||[]);
                }
                var topArtR=await fetch(API.search+'?query='+encodeURIComponent('artis top')+'&type=artists');
                var topArtD=await topArtR.json();
                if(topArtD.status && topArtD.result.artists) {
                    S.ha = topArtD.result.artists;
                }
                Home.show();
            }
        }catch(e){}
    },
    show(){
        var g=gid('home-grid'),s=gid('home-scroll');if(!g||!s)return;
        g.innerHTML=S.ht.slice(0,6).map(function(t,i){
            var isCur = S.ct && (
                S.ct.id === t.id ||
                S.ct.videoId === t.id ||
                (S.ct.id && t.videoId && S.ct.id === t.videoId) ||
                (S.ct.videoId && t.id && S.ct.videoId === t.id) ||
                (S.ct.title === t.title && S.ct.artist === t.artist)
            );
            var isPlay = isCur && S.ip;
            var isLoad = isCur && S.il;

            var playIconHtml = '';
            if (isLoad) {
                playIconHtml = '<div class="w-7 h-7 rounded-full btn-chrome flex items-center justify-center shrink-0 ml-auto"><div class="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div></div>';
            } else if (isPlay) {
                playIconHtml = '<div class="w-7 h-7 rounded-full btn-chrome flex items-center justify-center shrink-0 ml-auto shadow-lg shadow-rose-500/50 ring-2 ring-white/80 scale-105"><div class="flex items-end justify-center gap-[2px] w-3.5 h-3.5 pb-0.5"><span class="w-[2px] bg-white rounded-full animate-eq-1"></span><span class="w-[2px] bg-white rounded-full animate-eq-2"></span><span class="w-[2px] bg-white rounded-full animate-eq-3"></span></div></div>';
            } else if (isCur) {
                playIconHtml = '<div class="w-7 h-7 rounded-full bg-rose-500 text-white flex items-center justify-center shrink-0 ml-auto border border-white/40"><i data-lucide="pause" class="w-3.5 h-3.5 fill-current"></i></div>';
            }

            var cardBg = isPlay ? 'bg-gradient-to-r from-rose-500/20 via-rose-500/10 to-amber-500/10 border border-rose-500/40 shadow-lg shadow-rose-500/10' : (isCur ? 'bg-white/10 border border-white/30' : 'glass glass-hover');
            var textStyle = isCur ? 'text-rose-400 font-bold' : '';

            return '<div onclick="PK(\'home1\','+i+')" class="home-grid-card '+cardBg+' rounded-xl flex items-center gap-3 p-2 cursor-pointer active:scale-95 transition-all animate-stagger" style="animation-delay:'+(i*50)+'ms">'+
                '<img src="'+t.cover+'" class="w-14 h-14 rounded-lg object-cover shadow-lg shrink-0" onerror="this.src=\''+FI+'\'" />'+
                '<span class="home-grid-title font-bold text-sm line-clamp-2 min-w-0 flex-1 '+textStyle+'">'+es(t.title)+'</span>'+
                '<div class="home-grid-icon ml-auto">'+playIconHtml+'</div>'+
            '</div>';
        }).join('');
        
        var pls=typeof getUserPlaylists === 'function' ? getUserPlaylists() : [];
        var plHtml='';
        
        // Tampilkan playlist yang dibuat pengguna
        pls.forEach(function(p, i){
            plHtml+='<div onclick="Library.open(\''+p.id+'\')" class="flex-shrink-0 w-40 cursor-pointer active:scale-95 animate-stagger" style="animation-delay:'+(i*50)+'ms"><div class="w-40 h-40 mb-2 relative rounded-xl overflow-hidden glass-edge"><img src="'+(p.image||(p.songs.length>0?p.songs[0].cover:FI))+'" class="w-full h-full object-cover" onerror="this.src=\''+FI+'\'" /><div class="absolute bottom-2 right-2 btn-chrome rounded-full p-3 opacity-0 hover:opacity-100 transition-all shadow-lg shadow-black/40"><i data-lucide="play" class="w-5 h-5 fill-current ml-0.5"></i></div></div><h3 class="font-semibold text-sm truncate">'+es(p.name)+'</h3><p class="text-[#6b7280] text-xs truncate mt-1">'+p.songs.length+' lagu</p></div>';
        });
        // Tampilkan tombol Buat Playlist Baru sebagai card
        plHtml+='<div onclick="if(typeof Library !== \'undefined\') Library.createNew()" class="flex-shrink-0 w-40 cursor-pointer active:scale-95 flex flex-col"><div class="w-40 h-40 mb-2 relative rounded-xl overflow-hidden glass flex flex-col items-center justify-center border border-dashed border-white/20 hover:border-white/40"><i data-lucide="plus" class="w-8 h-8 text-[#6b7280]"></i><span class="text-xs text-[#6b7280] mt-2">Buat Playlist</span></div><h3 class="font-semibold text-sm truncate text-[#6b7280]">Buat Baru</h3></div>';
        
        // Rekomendasi playlist dari Youtube Music
        if (S.hp && S.hp.length > 0) {
            S.hp.slice(0, 8).forEach(function(p, i){
                plHtml+='<div onclick="Album.open(\''+p.id+'\', \''+(p.cover||FI)+'\')" class="flex-shrink-0 w-40 cursor-pointer active:scale-95 animate-stagger" style="animation-delay:'+((i+pls.length+1)*50)+'ms"><div class="w-40 h-40 mb-2 relative rounded-xl overflow-hidden glass-edge"><img src="'+(p.cover||FI)+'" class="w-full h-full object-cover" onerror="this.src=\''+FI+'\'" /></div><h3 class="font-semibold text-sm truncate">'+es(p.title)+'</h3><p class="text-[#6b7280] text-xs truncate mt-1">'+es(p.artist)+'</p></div>';
            });
        } else {
            // fallback if playlists are not available yet
            S.ht.slice(6,12).forEach(function(t,i){
                var isCur = S.ct && (
                    S.ct.id === t.id ||
                    S.ct.videoId === t.id ||
                    (S.ct.id && t.videoId && S.ct.id === t.videoId) ||
                    (S.ct.videoId && t.id && S.ct.videoId === t.id) ||
                    (S.ct.title === t.title && S.ct.artist === t.artist)
                );
                var isPlay = isCur && S.ip;
                var isLoad = isCur && S.il;

                var cardBtn = '';
                var ringClass = '';
                if(isLoad) {
                    cardBtn = '<div class="absolute bottom-2 right-2 btn-chrome rounded-full p-2 shadow-lg"><div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div></div>';
                    ringClass = 'ring-2 ring-amber-400';
                } else if(isPlay) {
                    cardBtn = '<div class="absolute bottom-2 right-2 btn-chrome rounded-full p-2.5 shadow-lg shadow-rose-500/50 ring-2 ring-white/80 scale-105"><div class="flex items-end justify-center gap-[2px] w-4 h-4 pb-0.5"><span class="w-[2px] bg-white rounded-full animate-eq-1"></span><span class="w-[2px] bg-white rounded-full animate-eq-2"></span><span class="w-[2px] bg-white rounded-full animate-eq-3"></span></div></div>';
                    ringClass = 'ring-2 ring-rose-500 shadow-xl shadow-rose-500/30';
                } else if(isCur) {
                    cardBtn = '<div class="absolute bottom-2 right-2 bg-rose-500 text-white rounded-full p-2.5 shadow-lg border border-white/40"><i data-lucide="pause" class="w-4 h-4 fill-current"></i></div>';
                    ringClass = 'ring-2 ring-rose-500/60';
                } else {
                    cardBtn = '<div class="absolute bottom-2 right-2 btn-chrome rounded-full p-2.5 opacity-0 group-hover:opacity-100 transition-all shadow-lg shadow-black/40"><i data-lucide="play" class="w-4 h-4 fill-current ml-0.5"></i></div>';
                    ringClass = '';
                }

                plHtml+='<div onclick="PK(\'home2\','+i+')" class="home-scroll-card group flex-shrink-0 w-40 cursor-pointer active:scale-95 animate-stagger" style="animation-delay:'+((i+pls.length+1)*50)+'ms"><div class="home-scroll-cover w-40 h-40 mb-2 relative rounded-xl overflow-hidden glass-edge transition-all '+ringClass+'"><img src="'+t.cover+'" class="w-full h-full object-cover" onerror="this.src=\''+FI+'\'" /><div class="home-scroll-btn">'+cardBtn+'</div></div><h3 class="home-scroll-title font-semibold text-sm truncate '+(isCur?'text-rose-400 font-bold':'')+'">'+es(t.title)+'</h3><p class="text-[#6b7280] text-xs truncate mt-1">'+es(t.artist)+'</p></div>';
            });
        }
        
        s.innerHTML=plHtml;
        var a = gid('home-artists');
        if(a) {
            if(S.ha && S.ha.length > 0) {
                var artHtml = S.ha.slice(0, 10).map(function(p, i){
                    return '<div onclick="Artist.open(\''+p.id+'\')" class="flex-shrink-0 w-32 cursor-pointer active:scale-95 animate-stagger" style="animation-delay:'+(i*50)+'ms"><div class="w-32 h-32 mb-2 relative rounded-full overflow-hidden glass-edge"><img src="'+(p.cover||FI)+'" class="w-full h-full object-cover" onerror="this.src=\''+FI+'\'" /></div><h3 class="font-semibold text-center text-sm truncate">'+es(p.name||p.title)+'</h3></div>';
                }).join('');
                a.innerHTML = artHtml;
                a.parentElement.style.display = 'block';
            } else {
                a.parentElement.style.display = 'none';
            }
        }
        lucide.createIcons();
    },
    renderActive(){
        var g = gid('home-grid');
        if(g && g.children && S.ht) {
            var items = S.ht.slice(0,6);
            var cards = g.querySelectorAll('.home-grid-card');
            cards.forEach(function(el, i){
                var t = items[i];
                if(!t) return;
                var isCur = S.ct && (
                    S.ct.id === t.id ||
                    S.ct.videoId === t.id ||
                    (S.ct.id && t.videoId && S.ct.id === t.videoId) ||
                    (S.ct.videoId && t.id && S.ct.videoId === t.id) ||
                    (S.ct.title === t.title && S.ct.artist === t.artist)
                );
                var isPlay = isCur && S.ip;
                var isLoad = isCur && S.il;

                var playIconHtml = '';
                if (isLoad) {
                    playIconHtml = '<div class="w-7 h-7 rounded-full btn-chrome flex items-center justify-center shrink-0 ml-auto"><div class="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div></div>';
                } else if (isPlay) {
                    playIconHtml = '<div class="w-7 h-7 rounded-full btn-chrome flex items-center justify-center shrink-0 ml-auto shadow-lg shadow-rose-500/50 ring-2 ring-white/80 scale-105"><div class="flex items-end justify-center gap-[2px] w-3.5 h-3.5 pb-0.5"><span class="w-[2px] bg-white rounded-full animate-eq-1"></span><span class="w-[2px] bg-white rounded-full animate-eq-2"></span><span class="w-[2px] bg-white rounded-full animate-eq-3"></span></div></div>';
                } else if (isCur) {
                    playIconHtml = '<div class="w-7 h-7 rounded-full bg-rose-500 text-white flex items-center justify-center shrink-0 ml-auto border border-white/40"><i data-lucide="pause" class="w-3.5 h-3.5 fill-current"></i></div>';
                }

                var cardBg = isPlay ? 'bg-gradient-to-r from-rose-500/20 via-rose-500/10 to-amber-500/10 border border-rose-500/40 shadow-lg shadow-rose-500/10' : (isCur ? 'bg-white/10 border border-white/30' : 'glass glass-hover');
                el.className = 'home-grid-card ' + cardBg + ' rounded-xl flex items-center gap-3 p-2 cursor-pointer active:scale-95 transition-all';

                var titleEl = el.querySelector('.home-grid-title');
                if(titleEl) {
                    titleEl.className = 'home-grid-title font-bold text-sm line-clamp-2 min-w-0 flex-1 ' + (isCur ? 'text-rose-400 font-bold' : '');
                }
                var iconWrap = el.querySelector('.home-grid-icon');
                if(iconWrap) {
                    iconWrap.innerHTML = playIconHtml;
                }
            });
        }
        var s = gid('home-scroll');
        if(s && S.ht) {
            var scrollCards = s.querySelectorAll('.home-scroll-card');
            var items2 = S.ht.slice(6, 12);
            scrollCards.forEach(function(el, i){
                var t = items2[i];
                if(!t) return;
                var isCur = S.ct && (
                    S.ct.id === t.id ||
                    S.ct.videoId === t.id ||
                    (S.ct.id && t.videoId && S.ct.id === t.videoId) ||
                    (S.ct.videoId && t.id && S.ct.videoId === t.id) ||
                    (S.ct.title === t.title && S.ct.artist === t.artist)
                );
                var isPlay = isCur && S.ip;
                var isLoad = isCur && S.il;

                var cardBtn = '';
                var ringClass = '';
                if(isLoad) {
                    cardBtn = '<div class="absolute bottom-2 right-2 btn-chrome rounded-full p-2 shadow-lg"><div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div></div>';
                    ringClass = 'ring-2 ring-amber-400';
                } else if(isPlay) {
                    cardBtn = '<div class="absolute bottom-2 right-2 btn-chrome rounded-full p-2.5 shadow-lg shadow-rose-500/50 ring-2 ring-white/80 scale-105"><div class="flex items-end justify-center gap-[2px] w-4 h-4 pb-0.5"><span class="w-[2px] bg-white rounded-full animate-eq-1"></span><span class="w-[2px] bg-white rounded-full animate-eq-2"></span><span class="w-[2px] bg-white rounded-full animate-eq-3"></span></div></div>';
                    ringClass = 'ring-2 ring-rose-500 shadow-xl shadow-rose-500/30';
                } else if(isCur) {
                    cardBtn = '<div class="absolute bottom-2 right-2 bg-rose-500 text-white rounded-full p-2.5 shadow-lg border border-white/40"><i data-lucide="pause" class="w-4 h-4 fill-current"></i></div>';
                    ringClass = 'ring-2 ring-rose-500/60';
                } else {
                    cardBtn = '<div class="absolute bottom-2 right-2 btn-chrome rounded-full p-2.5 opacity-0 group-hover:opacity-100 transition-all shadow-lg shadow-black/40"><i data-lucide="play" class="w-4 h-4 fill-current ml-0.5"></i></div>';
                    ringClass = '';
                }

                var coverWrap = el.querySelector('.home-scroll-cover');
                if(coverWrap) {
                    coverWrap.className = 'home-scroll-cover w-40 h-40 mb-2 relative rounded-xl overflow-hidden glass-edge transition-all ' + ringClass;
                }
                var btnWrap = el.querySelector('.home-scroll-btn');
                if(btnWrap) btnWrap.innerHTML = cardBtn;

                var titleEl = el.querySelector('.home-scroll-title');
                if(titleEl) titleEl.className = 'home-scroll-title font-semibold text-sm truncate ' + (isCur ? 'text-rose-400 font-bold' : '');
            });
        }
        lucide.createIcons();
    },
    refresh(){Home.fetch();gid('main-area').scrollTop=0;}
};
