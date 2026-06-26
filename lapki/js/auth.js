/* ============================================================
   Авторизация приюта «Лапки» (клиентская, учебная).
   Пользователи и сессия хранятся в браузере (localStorage /
   sessionStorage). Серверной БД нет.
   ============================================================ */

window.Auth = (function(){
  const P = "lapki_", UK = "users", SK = "lapki_session";
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function seed(){
    return [
      { id:1, name:"Администратор",     email:"admin@lapki.ru",    password:"admin",    role:"admin" },
      { id:2, name:"Ольга Волонтёрова", email:"volonter@lapki.ru", password:"volonter", role:"volunteer" },
    ];
  }
  function readUsers(){
    try{ const s = localStorage.getItem(P+UK); if(s) return JSON.parse(s); }catch(e){}
    const s = seed(); writeUsers(s); return s;
  }
  function writeUsers(u){ try{ localStorage.setItem(P+UK, JSON.stringify(u)); }catch(e){} }
  function nextId(arr){ return arr.reduce((m,x)=>Math.max(m, x.id||0), 0) + 1; }

  function sessionId(){ try{ return sessionStorage.getItem(SK); }catch(e){ return null; } }
  function current(){
    const id = sessionId(); if(!id) return null;
    return readUsers().find(u => String(u.id) === String(id)) || null;
  }
  function login(email, password){
    email = String(email||"").trim();
    const u = readUsers().find(x => x.email.toLowerCase() === email.toLowerCase());
    if(!u) return { ok:false, error:"Пользователь с таким e-mail не найден." };
    if(u.password !== password) return { ok:false, error:"Неверный пароль." };
    try{ sessionStorage.setItem(SK, u.id); }catch(e){}
    return { ok:true, user:u };
  }
  function register({ name, email, password, role }){
    name = String(name||"").trim(); email = String(email||"").trim();
    if(name.length < 2) return { ok:false, error:"Введите имя (минимум 2 символа)." };
    if(!emailRe.test(email)) return { ok:false, error:"Введите корректный адрес e-mail." };
    if(String(password||"").length < 4) return { ok:false, error:"Пароль должен быть не короче 4 символов." };
    const users = readUsers();
    if(users.some(u => u.email.toLowerCase() === email.toLowerCase()))
      return { ok:false, error:"Пользователь с таким e-mail уже зарегистрирован." };
    const user = { id: nextId(users), name, email, password, role: role || "volunteer" };
    users.push(user); writeUsers(users);
    try{ sessionStorage.setItem(SK, user.id); }catch(e){}
    return { ok:true, user };
  }
  function logout(){ try{ sessionStorage.removeItem(SK); }catch(e){} }
  function require(roles){
    const u = current();
    if(!u){ location.href = "login.html"; return null; }
    if(roles && roles.length && !roles.includes(u.role)){ location.href = "cabinet.html"; return null; }
    return u;
  }
  return { current, login, register, logout, require, users: readUsers };
})();
