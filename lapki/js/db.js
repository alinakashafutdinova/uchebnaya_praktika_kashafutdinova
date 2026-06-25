/* ============================================================
   Мини-БД приюта «Лапки» поверх localStorage.
   Коллекции: users (пользователи), pets (питомцы), requests (заявки).
   Подключается после data.js (использует window.LAPKI.PETS для сидов).
   ============================================================ */

window.DB = (function(){
  const P = "lapki_";

  function read(name, seed){
    try{ const s = localStorage.getItem(P+name); if(s) return JSON.parse(s); }catch(e){}
    if(seed !== undefined){ write(name, seed); return JSON.parse(JSON.stringify(seed)); }
    return [];
  }
  function write(name, val){ try{ localStorage.setItem(P+name, JSON.stringify(val)); }catch(e){} }
  function nextId(arr){ return arr.reduce((m,x)=>Math.max(m, x.id||0), 0) + 1; }

  /* --- сиды (начальные данные при первом запуске) --- */
  function seedUsers(){
    return [
      { id:1, name:"Администратор",     email:"admin@lapki.ru",    password:"admin",    role:"admin" },
      { id:2, name:"Ольга Волонтёрова", email:"volonter@lapki.ru", password:"volonter", role:"volunteer" },
    ];
  }
  function seedPets(){
    const base = (window.LAPKI && window.LAPKI.PETS) || [];
    return base.map(p => ({ id:p.id, name:p.name, species:p.species, speciesLabel:p.speciesLabel, age:p.age, status:p.status, desc:p.desc }));
  }
  function seedRequests(){
    return [
      { id:1, type:"Хочу забрать", petId:2, petName:"Белла", userId:2, userName:"Ольга Волонтёрова",
        message:"Готова забрать Беллу домой, есть опыт содержания собак.", status:"новая", date:"01.06.2026" },
    ];
  }

  return {
    users:        () => read("users", seedUsers()),
    saveUsers:    u  => write("users", u),
    pets:         () => read("pets", seedPets()),
    savePets:     p  => write("pets", p),
    requests:     () => read("requests", seedRequests()),
    saveRequests: r  => write("requests", r),
    nextId,
    resetAll: () => { ["users","pets","requests"].forEach(n => { try{ localStorage.removeItem(P+n); }catch(e){} }); },
  };
})();
