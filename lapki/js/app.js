/* ============================================================
   Общая логика сайта «Лапки»: шапка, подвал, меню, анимации.
   Подключается после data.js, db.js, auth.js.
   ============================================================ */

const NAV = [
  ["index.html","Главная"],
  ["catalog.html","Питомцы"],
  ["articles.html","Статьи"],
  ["calculator.html","Калькулятор корма"],
  ["contacts.html","Контакты"],
];

function authCta(){
  const u = (window.Auth && Auth.current && Auth.current()) || null;
  if(u){
    const role = u.role === "admin" ? "Админ" : "Волонтёр";
    return `<a class="btn btn-ghost btn-sm" href="cabinet.html">${u.name.split(" ")[0]} · ${role}</a>
            <a class="btn btn-primary btn-sm" href="#" id="logout">Выйти</a>`;
  }
  return `<a class="btn btn-ghost btn-sm" href="login.html">Войти</a>
          <a class="btn btn-primary btn-sm" href="catalog.html">Найти друга</a>`;
}

function buildHeader(active){
  const links = NAV.map(([h,t]) =>
    `<li><a href="${h}" class="${h===active?'active':''}">${t}</a></li>`).join("");
  return `<header class="site-header"><div class="container nav">
    <a class="brand" href="index.html">${LAPKI.pawSVG()}<span>Лап<b>ки</b></span></a>
    <ul class="nav-links" id="navLinks">${links}</ul>
    <div class="nav-cta">
      ${authCta()}
      <button class="burger" id="burger" aria-label="Меню"><span></span><span></span><span></span></button>
    </div>
  </div></header>`;
}

function buildFooter(){
  const y = new Date().getFullYear();
  return `<footer class="site-footer"><div class="container">
    <div class="footer-grid">
      <div>
        <a class="brand" href="index.html">${LAPKI.pawSVG("#E0913E")}<span>Лап<b>ки</b></span></a>
        <p>Приют для животных «Лапки». Мы помогаем бездомным животным обрести дом и заботливых хозяев.</p>
      </div>
      <div>
        <h4>Разделы</h4>
        <ul>
          <li><a href="catalog.html">Каталог питомцев</a></li>
          <li><a href="articles.html">Статьи</a></li>
          <li><a href="calculator.html">Калькулятор корма</a></li>
          <li><a href="cabinet.html">Личный кабинет</a></li>
        </ul>
      </div>
      <div>
        <h4>Контакты</h4>
        <ul>
          <li><a href="tel:+74950000000">+7 (495) 000-00-00</a></li>
          <li><a href="mailto:hello@lapki.example">hello@lapki.example</a></li>
          <li>Москва, ул. Добрая, 1</li>
          <li>Ежедневно 10:00–19:00</li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <span>© ${y} Приют «Лапки». Учебный проект.</span>
      <span>Сделано с заботой о хвостах 🐾</span>
    </div>
  </div></footer>`;
}

function mountChrome(){
  const active = document.body.getAttribute("data-page") || "";
  const h = document.getElementById("header");
  const f = document.getElementById("footer");
  if(h) h.innerHTML = buildHeader(active);
  if(f) f.innerHTML = buildFooter();

  const burger = document.getElementById("burger");
  const links = document.getElementById("navLinks");
  if(burger && links) burger.addEventListener("click", () => links.classList.toggle("open"));

  const logout = document.getElementById("logout");
  if(logout) logout.addEventListener("click", e => { e.preventDefault(); Auth.logout(); location.href = "index.html"; });
}

function getParam(name){ return new URLSearchParams(location.search).get(name); }

function reveal(){
  document.querySelectorAll("[data-reveal]").forEach((el,i) => {
    el.classList.add("reveal");
    if(i%4===1) el.classList.add("d1");
    if(i%4===2) el.classList.add("d2");
    if(i%4===3) el.classList.add("d3");
  });
}

document.addEventListener("DOMContentLoaded", () => { mountChrome(); reveal(); });
