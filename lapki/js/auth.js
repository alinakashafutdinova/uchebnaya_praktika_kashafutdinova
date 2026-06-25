/* ============================================================
   Авторизация приюта «Лапки» (клиентская, учебная).
   Сессия хранится в sessionStorage, пользователи — в мини-БД.
   Подключается после db.js.
   ============================================================ */

window.Auth = (function(){
  const SK = "lapki_session";
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function sessionId(){ try{ return sessionStorage.getItem(SK); }catch(e){ return null; } }

  function current(){
    const id = sessionId();
    if(!id) return null;
    return DB.users().find(u => String(u.id) === String(id)) || null;
  }

  function login(email, password){
    email = String(email||"").trim();
    const u = DB.users().find(x => x.email.toLowerCase() === email.toLowerCase());
    if(!u) return { ok:false, error:"Пользователь с таким e-mail не найден." };
    if(u.password !== password) return { ok:false, error:"Неверный пароль." };
    try{ sessionStorage.setItem(SK, u.id); }catch(e){}
    return { ok:true, user:u };
  }

  function register({ name, email, password, role }){
    name = String(name||"").trim();
    email = String(email||"").trim();
    if(name.length < 2) return { ok:false, error:"Введите имя (минимум 2 символа)." };
    if(!emailRe.test(email)) return { ok:false, error:"Введите корректный адрес e-mail." };
    if(String(password||"").length < 4) return { ok:false, error:"Пароль должен быть не короче 4 символов." };

    const users = DB.users();
    if(users.some(u => u.email.toLowerCase() === email.toLowerCase()))
      return { ok:false, error:"Пользователь с таким e-mail уже зарегистрирован." };

    const user = { id: DB.nextId(users), name, email, password, role: role || "volunteer" };
    users.push(user);
    DB.saveUsers(users);
    try{ sessionStorage.setItem(SK, user.id); }catch(e){}
    return { ok:true, user };
  }

  function logout(){ try{ sessionStorage.removeItem(SK); }catch(e){} }

  /* защита страницы: возвращает пользователя или перенаправляет */
  function require(roles){
    const u = current();
    if(!u){ location.href = "login.html"; return null; }
    if(roles && roles.length && !roles.includes(u.role)){ location.href = "cabinet.html"; return null; }
    return u;
  }

  return { current, login, register, logout, require };
})();
