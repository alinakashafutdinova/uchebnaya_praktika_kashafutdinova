/* ============================================================
   Локальное хранилище приюта «Лапки» (браузерный localStorage,
   НЕ серверная БД). Хранит статьи и заявки волонтёров.
   Подключается после data.js (использует LAPKI.ARTICLES для сидов).
   ============================================================ */

window.Store = (function(){
  const P = "lapki_";
  function read(key, seed){
    try{ const s = localStorage.getItem(P+key); if(s) return JSON.parse(s); }catch(e){}
    if(seed !== undefined){ write(key, seed); return JSON.parse(JSON.stringify(seed)); }
    return [];
  }
  function write(key, val){ try{ localStorage.setItem(P+key, JSON.stringify(val)); }catch(e){} }
  function nextId(arr){ return arr.reduce((m,x)=>Math.max(m, x.id||0), 0) + 1; }
  function seedArticles(){ return ((window.LAPKI && LAPKI.ARTICLES) || []).map(a => JSON.parse(JSON.stringify(a))); }

  return {
    articles:     () => read("articles", seedArticles()),
    saveArticles: a  => write("articles", a),
    requests:     () => read("requests", []),
    saveRequests: r  => write("requests", r),
    nextId,
    reset: () => { ["articles","requests"].forEach(k => { try{ localStorage.removeItem(P+k); }catch(e){} }); },
  };
})();
