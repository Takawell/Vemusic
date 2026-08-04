var MP={
    init(){
        var barsHtml = '';
        var eqAnims = ['animate-eq-1', 'animate-eq-2', 'animate-eq-3', 'animate-eq-4', 'animate-eq-5', 'animate-eq-6'];
        for (var i = 0; i < 36; i++) {
            var animClass = eqAnims[i % eqAnims.length];
            barsHtml += '<span class="mini-beat-bar w-[2.5px] rounded-t-sm shrink-0 transition-all duration-300 ' + animClass + '" style="height:4px;background-color:#ff2a5f;"></span>';
        }

        gid('mini-container').innerHTML=`
        <div id="mini-player" class="hidden fixed left-2 right-2 z-[160]" style="bottom:70px;transition:transform 0.3s ease-out;transform:translateY(150px);">
            <div onclick="FullPlayer.open()" class="rounded-md p-2 flex items-center gap-3 cursor-pointer active:scale-[0.98] transition relative overflow-hidden" style="background:#0a0a0d;border:1px solid rgba(255,255,255,0.08);box-shadow:0 8px 24px rgba(0,0,0,0.85);">
                <!-- Dense Beats Visualizer Ambient Background -->
                <div id="mini-beats-bg" class="absolute inset-0 pointer-events-none opacity-0 transition-opacity duration-500 overflow-hidden rounded-md z-0">
                    <div id="mini-beats-bg-gradient" class="absolute inset-0 bg-gradient-to-r from-rose-950/40 via-purple-950/30 to-amber-950/30 transition-all duration-700"></div>
                    <div id="mini-beats-bars" class="absolute inset-x-0 bottom-0 top-0 flex items-end justify-between opacity-50 px-2 pb-0.5 gap-[1.5px] overflow-hidden">
                        ${barsHtml}
                    </div>
                </div>
                <div class="relative z-10 flex items-center gap-2 w-full">
                    <img id="mini-cover" src="" class="w-10 h-10 rounded-[4px] object-cover flex-shrink-0 shadow-md" />
                    <div class="flex-1 min-w-0 pr-1">
                        <div id="mini-title" class="font-semibold text-sm text-white truncate drop-shadow-sm">Pilih lagu</div>
                        <div id="mini-artist" class="text-[#b3b3b3] text-xs truncate"></div>
                    </div>
                    <button id="mini-like-btn" onclick="toggleCurrentLike(); if(typeof event !== 'undefined') event.stopPropagation();" class="text-[#b3b3b3] hover:text-white active:scale-90 p-1" title="Sukai Lagu"><i data-lucide="heart" class="w-4 h-4"></i></button>
                    <button id="mini-prev-btn" onclick="PV(); if(typeof event !== 'undefined') event.stopPropagation();" class="text-white/80 hover:text-white active:scale-90 p-1" title="Sebelumnya"><i data-lucide="skip-back" class="w-4 h-4 fill-current"></i></button>
                    <button onclick="TP(); if(typeof event !== 'undefined') event.stopPropagation();" class="text-white active:scale-90 p-1"><div id="mini-play-btn" class="w-8 h-8 rounded-full flex items-center justify-center transition-all bg-white/10"><i data-lucide="play" class="w-4 h-4 fill-current"></i></div></button>
                    <button id="mini-next-btn" onclick="NX(); if(typeof event !== 'undefined') event.stopPropagation();" class="text-white/80 hover:text-white active:scale-90 p-1" title="Berikutnya"><i data-lucide="skip-forward" class="w-4 h-4 fill-current"></i></button>
                </div>
                <div class="absolute bottom-0 left-2 right-2 h-[2px] bg-white/20 rounded-full overflow-hidden z-20">
                    <div id="mini-progress" class="h-full bg-rose-500" style="width:0%"></div>
                </div>
            </div>
        </div>`;
        lucide.createIcons();
    },
    show(){
        // Jangan muncul kalau belum ada lagu yang dipilih!
        if (!S || !S.ct || (!S.ct.id && !S.ct.videoId && !S.ct.title)) {
            return;
        }
        var mp=gid('mini-player');
        if(!mp) return;
        mp.classList.remove('hidden');
        requestAnimationFrame(function(){mp.style.transform='translateY(0)';});
        if (typeof S !== 'undefined' && S.ct) {
            MP.updateBeats(S.ct);
        }
    },
    hide(){
        var mp=gid('mini-player');
        if(!mp) return;
        mp.style.transform='translateY(150px)';
        setTimeout(function(){mp.classList.add('hidden');},300);
    },
    getTrackColors(track) {
        if (!track) return ['#ff2a5f', '#ff5e82', '#cc1b47', '#ff4070'];
        var str = (track.videoId || '') + (track.title || '') + (track.artist || '');
        var hash = 0;
        for (var i = 0; i < str.length; i++) {
            hash = (hash << 5) - hash + str.charCodeAt(i);
            hash |= 0;
        }
        hash = Math.abs(hash);
        var hue = hash % 360;
        return [
            'hsl(' + hue + ', 85%, 55%)',
            'hsl(' + hue + ', 95%, 68%)',
            'hsl(' + hue + ', 75%, 42%)',
            'hsl(' + hue + ', 88%, 60%)'
        ];
    },
    applyColors(colors) {
        if (typeof FullPlayer !== 'undefined' && FullPlayer.applyColors) {
            FullPlayer.applyColors(colors);
        }
    },
    extractFromImage(img) {
        try {
            var canvas = document.createElement('canvas');
            canvas.width = 16;
            canvas.height = 16;
            var ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, 16, 16);
            var imgData = ctx.getImageData(0, 0, 16, 16).data;
            
            var totalR = 0, totalG = 0, totalB = 0;
            var maxSat = -1;
            var bestR = 255, bestG = 42, bestB = 95;
            
            for (var i = 0; i < imgData.length; i += 4) {
                var r = imgData[i];
                var g = imgData[i+1];
                var b = imgData[i+2];
                
                totalR += r;
                totalG += g;
                totalB += b;
                
                var maxC = Math.max(r, g, b);
                var minC = Math.min(r, g, b);
                var sat = maxC - minC;
                
                if (sat > maxSat && maxC > 50 && minC < 220) {
                    maxSat = sat;
                    bestR = r;
                    bestG = g;
                    bestB = b;
                }
            }
            
            var count = imgData.length / 4;
            var avgR = Math.round(totalR / count);
            var avgG = Math.round(totalG / count);
            var avgB = Math.round(totalB / count);
            
            var mainR = (maxSat > 30) ? bestR : (Math.max(avgR, avgG, avgB) < 40 ? 220 : avgR);
            var mainG = (maxSat > 30) ? bestG : (Math.max(avgR, avgG, avgB) < 40 ? 100 : avgG);
            var mainB = (maxSat > 30) ? bestB : (Math.max(avgR, avgG, avgB) < 40 ? 140 : avgB);
            
            var c1 = 'rgb(' + mainR + ',' + mainG + ',' + mainB + ')';
            var c2 = 'rgb(' + Math.min(255, Math.round(mainR * 1.25 + 20)) + ',' + Math.min(255, Math.round(mainG * 1.25 + 20)) + ',' + Math.min(255, Math.round(mainB * 1.25 + 20)) + ')';
            var c3 = 'rgb(' + Math.max(30, Math.round(mainR * 0.75)) + ',' + Math.max(30, Math.round(mainG * 0.75)) + ',' + Math.max(30, Math.round(mainB * 0.75)) + ')';
            var c4 = 'rgb(' + Math.min(255, Math.round(mainR * 1.1 + 10)) + ',' + Math.min(255, Math.round(mainG * 1.1 + 10)) + ',' + Math.min(255, Math.round(mainB * 1.1 + 10)) + ')';
            
            return [c1, c2, c3, c4];
        } catch(e) {
            return null;
        }
    },
    updateBeats(track) {
        if (!track) return;
        var palette = MP.getTrackColors(track);
        MP.applyColors(palette);

        if (track.cover && track.cover.startsWith('http')) {
            var img = new Image();
            img.crossOrigin = 'Anonymous';
            img.src = track.cover;
            img.onload = function() {
                var colors = MP.extractFromImage(img);
                if (colors) {
                    MP.applyColors(colors);
                    if (typeof FullPlayer !== 'undefined' && FullPlayer.applyColors) {
                        FullPlayer.applyColors(colors);
                    }
                }
            };
        }
    }
};