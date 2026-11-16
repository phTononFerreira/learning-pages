/* Seletor de cargo customizado (progressive enhancement de select[data-cargo-select]).
   O <select> nativo permanece no DOM como fallback: só é escondido depois que a
   interface customizada é montada com sucesso. */
(function () {
  "use strict";

  var selects = document.querySelectorAll("select[data-cargo-select]");
  if (!selects.length) return;

  function cargoById(id) {
    var list = (window.CARGOS && window.CARGOS.cargos) || [];
    for (var i = 0; i < list.length; i++) {
      if (list[i].id === id) return list[i];
    }
    return null;
  }

  function money(v) {
    return "R$ " + Number(v).toLocaleString("pt-BR");
  }

  function enhance(sel, index) {
    var wrap = sel.parentElement;
    if (!wrap || wrap.querySelector(".cargo-select-trigger")) return;

    var listboxId = index ? "cargo-select-listbox-" + index : "cargo-select-listbox";
    var label = sel.getAttribute("aria-label") || "Cargo alvo";

    var trigger = document.createElement("button");
    trigger.type = "button";
    trigger.className = "cargo-select-trigger";
    trigger.setAttribute("role", "combobox");
    trigger.setAttribute("aria-haspopup", "listbox");
    trigger.setAttribute("aria-expanded", "false");
    trigger.setAttribute("aria-controls", listboxId);
    trigger.setAttribute("aria-label", label);

    var valueEl = document.createElement("span");
    valueEl.className = "cargo-select-value";
    var chevron = document.createElement("span");
    chevron.className = "cargo-select-chevron";
    chevron.setAttribute("aria-hidden", "true");
    trigger.appendChild(valueEl);
    trigger.appendChild(chevron);

    var menu = document.createElement("div");
    menu.className = "cargo-select-menu";
    menu.id = listboxId;
    menu.setAttribute("role", "listbox");
    menu.setAttribute("aria-label", label);
    menu.setAttribute("tabindex", "-1");
    menu.hidden = true;

    var items = [];
    var activeIndex = -1;
    var isOpen = false;

    function appendOption(opt) {
      var row = document.createElement("div");
      row.className = "cargo-select-option";
      row.id = listboxId + "-opt-" + items.length;
      row.setAttribute("role", "option");
      row.setAttribute("data-value", opt.value);
      row.setAttribute("aria-selected", "false");

      var text = document.createElement("span");
      text.className = "cargo-select-option-text";
      var main = document.createElement("span");
      main.className = "cargo-select-option-main";
      main.textContent = (opt.textContent || "").trim();
      text.appendChild(main);

      var c = cargoById(opt.value);
      if (c) {
        var meta = document.createElement("span");
        meta.className = "cargo-select-option-meta";
        meta.textContent = c.vagas_total + " vagas · " + money(c.salario) + " · " + c.status_label;
        text.appendChild(meta);
      }

      var check = document.createElement("span");
      check.className = "cargo-select-check";
      check.setAttribute("aria-hidden", "true");
      check.textContent = "✓";

      row.appendChild(text);
      row.appendChild(check);
      row.addEventListener("mousedown", function (e) { e.preventDefault(); });
      row.addEventListener("click", function () { choose(opt.value); });
      menu.appendChild(row);
      items.push({ el: row, value: opt.value });
    }

    function buildMenu() {
      menu.textContent = "";
      items = [];
      activeIndex = -1;
      for (var i = 0; i < sel.children.length; i++) {
        var node = sel.children[i];
        if (node.tagName === "OPTGROUP") {
          var group = document.createElement("div");
          group.className = "cargo-select-group";
          group.setAttribute("role", "presentation");
          group.textContent = node.label;
          group.title = node.label;
          menu.appendChild(group);
          for (var j = 0; j < node.children.length; j++) {
            if (node.children[j].tagName === "OPTION") appendOption(node.children[j]);
          }
        } else if (node.tagName === "OPTION") {
          appendOption(node);
        }
      }
      sync();
      if (isOpen) setActive(selectedIndex());
    }

    function selectedIndex() {
      for (var i = 0; i < items.length; i++) {
        if (items[i].value === sel.value) return i;
      }
      return -1;
    }

    function sync() {
      var idx = selectedIndex();
      for (var i = 0; i < items.length; i++) {
        var selected = i === idx;
        items[i].el.setAttribute("aria-selected", selected ? "true" : "false");
        items[i].el.classList.toggle("is-selected", selected);
      }
      var opt = sel.options[sel.selectedIndex] || null;
      var text = opt ? (opt.textContent || "").trim() : "";
      valueEl.textContent = text;
      trigger.title = text;
      trigger.setAttribute("aria-label", label + ": " + text);
      if (isOpen) {
        if (idx >= 0 && activeIndex === -1) setActive(idx);
        else if (activeIndex >= items.length) setActive(idx);
      }
    }

    function scrollToItem(row) {
      var top = row.offsetTop;
      var bottom = top + row.offsetHeight;
      if (top < menu.scrollTop) menu.scrollTop = top;
      else if (bottom > menu.scrollTop + menu.clientHeight) menu.scrollTop = bottom - menu.clientHeight;
    }

    function setActive(i) {
      if (activeIndex >= 0 && items[activeIndex]) items[activeIndex].el.classList.remove("is-active");
      activeIndex = i >= 0 && i < items.length ? i : -1;
      if (activeIndex >= 0) {
        var row = items[activeIndex].el;
        row.classList.add("is-active");
        trigger.setAttribute("aria-activedescendant", row.id);
        scrollToItem(row);
      } else {
        trigger.removeAttribute("aria-activedescendant");
      }
    }

    function open() {
      if (isOpen || !items.length) return;
      isOpen = true;
      menu.hidden = false;
      trigger.setAttribute("aria-expanded", "true");
      setActive(selectedIndex() >= 0 ? selectedIndex() : 0);
    }

    function close() {
      if (!isOpen) return;
      isOpen = false;
      menu.hidden = true;
      trigger.setAttribute("aria-expanded", "false");
      setActive(-1);
    }

    function choose(value) {
      sel.value = value;
      sel.dispatchEvent(new Event("change", { bubbles: true }));
      sync();
      close();
      trigger.focus();
    }

    trigger.addEventListener("click", function (e) {
      e.preventDefault();
      if (isOpen) close();
      else open();
    });

    trigger.addEventListener("keydown", function (e) {
      var key = e.key;
      if (key === "ArrowDown" || key === "ArrowUp") {
        e.preventDefault();
        if (!isOpen) {
          open();
          return;
        }
        if (!items.length) return;
        var dir = key === "ArrowDown" ? 1 : -1;
        var next = activeIndex < 0
          ? (dir > 0 ? 0 : items.length - 1)
          : (activeIndex + dir + items.length) % items.length;
        setActive(next);
        return;
      }
      if (key === "Home" || key === "End") {
        if (!isOpen || !items.length) return;
        e.preventDefault();
        setActive(key === "Home" ? 0 : items.length - 1);
        return;
      }
      if (key === "Enter" || key === " " || key === "Spacebar") {
        e.preventDefault();
        if (!isOpen) {
          open();
          return;
        }
        if (activeIndex >= 0) choose(items[activeIndex].value);
        return;
      }
      if (key === "Escape") {
        if (!isOpen) return;
        e.preventDefault();
        close();
        trigger.focus();
        return;
      }
      if (key === "Tab") close();
    });

    document.addEventListener("click", function (e) {
      if (isOpen && !wrap.contains(e.target)) close();
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && isOpen) {
        close();
        trigger.focus();
      }
    });

    sel.addEventListener("change", sync);
    document.addEventListener("sp:select-sync", function (e) {
      if (e.target === sel) sync();
    });

    if (window.MutationObserver) {
      new MutationObserver(buildMenu).observe(sel, { childList: true, subtree: true });
    }

    // Monta a UI e só então esconde o select nativo.
    sel.parentNode.insertBefore(trigger, sel.nextSibling);
    sel.parentNode.insertBefore(menu, trigger.nextSibling);
    buildMenu();
    sel.classList.add("is-enhanced");
    sel.setAttribute("tabindex", "-1");
    sel.setAttribute("aria-hidden", "true");
  }

  for (var i = 0; i < selects.length; i++) enhance(selects[i], i);
})();
