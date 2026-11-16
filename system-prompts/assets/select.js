/* ==========================================================================
   SYS/PRM — custom select
   Progressive enhancement for single-line <select> controls. The native
   select stays in the DOM as fallback and as the source of truth; this layer
   only replaces the closed trigger and the open popup.
   ========================================================================== */
(function () {
  'use strict';

  var counter = 0;
  var openInstance = null;

  function textOf(option) {
    var text = option.label || option.textContent || '';
    return text.replace(/\s+/g, ' ').trim();
  }

  function isEnhanceable(select) {
    if (!select || select.tagName !== 'SELECT') return false;
    if (select.dataset.spEnhanced === 'true') return false;
    if (select.disabled || select.multiple || select.size > 1) return false;
    if (select.closest('pre, code, [data-native]')) return false;
    return true;
  }

  function enhance(select) {
    if (!isEnhanceable(select)) return;
    if (select.closest('.sp-select')) return;

    var base = select.id || 'sp-select-' + ++counter;
    var wrapper = document.createElement('div');
    var trigger = document.createElement('button');
    var valueEl = document.createElement('span');
    var listbox = document.createElement('div');
    var entries = [];
    var activeIndex = -1;
    var isOpen = false;
    var typeBuffer = '';
    var typeTimer = 0;

    function currentLabel() {
      var option = select.options[select.selectedIndex];
      return option ? textOf(option) : '—';
    }

    function syncLabel() {
      valueEl.textContent = currentLabel();
      valueEl.classList.toggle('is-placeholder', select.selectedIndex < 0);
    }

    function syncSelected() {
      for (var i = 0; i < entries.length; i++) {
        entries[i].row.setAttribute('aria-selected', entries[i].option.selected ? 'true' : 'false');
      }
      syncLabel();
    }

    function optionIndex(option) {
      for (var i = 0; i < select.options.length; i++) {
        if (select.options[i] === option) return i;
      }
      return -1;
    }

    function addOption(option, parent, groupDisabled) {
      var entryIndex = entries.length;
      var disabled = option.disabled || groupDisabled;
      var row = document.createElement('div');

      row.className = 'sp-select-option';
      row.id = listbox.id + '-opt-' + entryIndex;
      row.setAttribute('role', 'option');
      row.setAttribute('aria-selected', option.selected ? 'true' : 'false');
      row.textContent = textOf(option);
      if (disabled) {
        row.setAttribute('aria-disabled', 'true');
        row.classList.add('is-disabled');
      }

      row.addEventListener('mousedown', function (event) {
        event.preventDefault();
      });
      row.addEventListener('click', function (event) {
        event.preventDefault();
        if (!disabled) commit(entryIndex);
      });

      entries.push({
        option: option,
        row: row,
        disabled: disabled,
        index: optionIndex(option)
      });
      parent.appendChild(row);
    }

    function addGroup(group) {
      var groupEl = document.createElement('div');
      var groupLabel = document.createElement('div');
      var label = (group.label || '').replace(/\s+/g, ' ').trim();
      groupEl.className = 'sp-select-group';
      groupEl.setAttribute('role', 'group');
      groupEl.setAttribute('aria-label', label || 'grupo');
      groupLabel.className = 'sp-select-group-label';
      groupLabel.setAttribute('aria-hidden', 'true');
      groupLabel.textContent = label;
      groupEl.appendChild(groupLabel);
      listbox.appendChild(groupEl);

      for (var i = 0; i < group.children.length; i++) {
        if (group.children[i].tagName === 'OPTION') {
          addOption(group.children[i], groupEl, group.disabled);
        }
      }
    }

    function rebuild() {
      entries = [];
      listbox.textContent = '';

      for (var i = 0; i < select.children.length; i++) {
        var child = select.children[i];
        if (child.tagName === 'OPTGROUP') {
          addGroup(child);
        } else if (child.tagName === 'OPTION') {
          addOption(child, listbox, false);
        }
      }

      if (!entries.length) {
        var empty = document.createElement('div');
        empty.className = 'sp-select-empty';
        empty.setAttribute('role', 'presentation');
        empty.textContent = 'sem opções';
        listbox.appendChild(empty);
      }

      if (activeIndex >= entries.length) activeIndex = entries.length - 1;
      syncSelected();

      if (isOpen) {
        var keep = activeIndex >= 0 && activeIndex < entries.length ? activeIndex : firstEnabled(0, 1);
        activeIndex = -1;
        setActive(keep);
      }
    }

    function firstEnabled(from, step) {
      for (var i = from; i >= 0 && i < entries.length; i += step) {
        if (!entries[i].disabled) return i;
      }
      return -1;
    }

    function setActive(index) {
      if (activeIndex >= 0 && entries[activeIndex]) {
        entries[activeIndex].row.classList.remove('is-active');
      }
      activeIndex = index;

      if (activeIndex < 0 || !entries[activeIndex]) {
        trigger.removeAttribute('aria-activedescendant');
        return;
      }

      var row = entries[activeIndex].row;
      row.classList.add('is-active');
      trigger.setAttribute('aria-activedescendant', row.id);

      var menuTop = listbox.scrollTop;
      var menuBottom = menuTop + listbox.clientHeight;
      var rowTop = row.offsetTop;
      var rowBottom = rowTop + row.offsetHeight;
      if (rowTop < menuTop) listbox.scrollTop = rowTop;
      else if (rowBottom > menuBottom) listbox.scrollTop = rowBottom - listbox.clientHeight;
    }

    function positionMenu() {
      var rect = trigger.getBoundingClientRect();
      var menuHeight = Math.min(listbox.scrollHeight + 2, 300);
      var spaceBelow = window.innerHeight - rect.bottom;
      var spaceAbove = rect.top;
      wrapper.classList.toggle('is-open-up', spaceBelow < menuHeight && spaceAbove > spaceBelow);
    }

    function openMenu() {
      if (isOpen) return;
      if (openInstance && openInstance !== api) openInstance.closeMenu();

      syncSelected();
      isOpen = true;
      openInstance = api;
      wrapper.classList.add('is-open');
      trigger.setAttribute('aria-expanded', 'true');
      listbox.hidden = false;
      positionMenu();

      var selected = -1;
      for (var i = 0; i < entries.length; i++) {
        if (entries[i].option.selected && !entries[i].disabled) {
          selected = i;
          break;
        }
      }
      setActive(selected >= 0 ? selected : firstEnabled(0, 1));
    }

    function closeMenu() {
      if (!isOpen) return;
      isOpen = false;
      if (openInstance === api) openInstance = null;
      wrapper.classList.remove('is-open', 'is-open-up');
      trigger.setAttribute('aria-expanded', 'false');
      trigger.removeAttribute('aria-activedescendant');
      listbox.hidden = true;
    }

    function commit(index) {
      var entry = entries[index];
      if (!entry || entry.disabled) return;

      if (select.selectedIndex !== entry.index) {
        select.selectedIndex = entry.index;
        select.dispatchEvent(new Event('change', { bubbles: true }));
      }
      syncSelected();
      closeMenu();
      trigger.focus();
    }

    function moveActive(step) {
      var start = activeIndex >= 0 ? activeIndex + step : (step > 0 ? 0 : entries.length - 1);
      var next = firstEnabled(start, step);
      if (next >= 0) setActive(next);
    }

    function typeahead(char) {
      typeBuffer += char.toLowerCase();
      window.clearTimeout(typeTimer);
      typeTimer = window.setTimeout(function () {
        typeBuffer = '';
      }, 600);

      var found = -1;
      for (var i = 0; i < entries.length; i++) {
        if (entries[i].disabled) continue;
        if (textOf(entries[i].option).toLowerCase().indexOf(typeBuffer) === 0) {
          found = i;
          break;
        }
      }
      if (found < 0) return;
      if (!isOpen) openMenu();
      setActive(found);
    }

    function onKeyDown(event) {
      var key = event.key;

      if (key === 'ArrowDown' || key === 'ArrowUp') {
        event.preventDefault();
        if (!isOpen) openMenu();
        moveActive(key === 'ArrowDown' ? 1 : -1);
        return;
      }
      if (key === 'Home' || key === 'End') {
        if (!isOpen) return;
        event.preventDefault();
        setActive(key === 'Home' ? firstEnabled(0, 1) : firstEnabled(entries.length - 1, -1));
        return;
      }
      if (key === 'Enter' || key === ' ' || key === 'Spacebar') {
        event.preventDefault();
        if (!isOpen) openMenu();
        else if (activeIndex >= 0) commit(activeIndex);
        return;
      }
      if (key === 'Escape') {
        if (isOpen) {
          event.preventDefault();
          closeMenu();
        }
        return;
      }
      if (key === 'Tab') {
        closeMenu();
        return;
      }
      if (key && key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
        typeahead(key);
      }
    }

    var api = {
      wrapper: wrapper,
      closeMenu: closeMenu
    };

    wrapper.className = 'sp-select';
    wrapper.appendChild(trigger);

    trigger.type = 'button';
    trigger.className = 'sp-select-trigger';
    trigger.setAttribute('role', 'combobox');
    trigger.setAttribute('aria-haspopup', 'listbox');
    trigger.setAttribute('aria-expanded', 'false');
    trigger.setAttribute('aria-controls', base + '-listbox');

    valueEl.className = 'sp-select-value';
    trigger.appendChild(valueEl);

    listbox.className = 'sp-select-menu';
    listbox.id = base + '-listbox';
    listbox.setAttribute('role', 'listbox');
    listbox.hidden = true;
    wrapper.appendChild(listbox);

    var label = null;
    if (select.id) {
      var labels = document.getElementsByTagName('label');
      for (var i = 0; i < labels.length; i++) {
        if (labels[i].htmlFor === select.id) {
          label = labels[i];
          break;
        }
      }
    }
    if (!label) label = select.closest('label');

    if (label) {
      if (!label.id) label.id = base + '-label';
      trigger.setAttribute('aria-labelledby', label.id);
      label.addEventListener('click', function (event) {
        event.preventDefault();
        trigger.focus();
      });
    } else {
      var name = select.getAttribute('aria-label') || select.getAttribute('name') || select.id;
      if (name) trigger.setAttribute('aria-label', name);
    }

    select.parentNode.insertBefore(wrapper, select);
    wrapper.appendChild(select);

    trigger.addEventListener('click', function (event) {
      event.preventDefault();
      if (isOpen) closeMenu();
      else openMenu();
    });
    trigger.addEventListener('keydown', onKeyDown);
    trigger.addEventListener('focus', syncSelected);
    trigger.addEventListener('pointerdown', syncSelected);
    trigger.addEventListener('blur', function () {
      window.setTimeout(function () {
        if (document.activeElement !== trigger) closeMenu();
      }, 0);
    });

    select.addEventListener('change', syncSelected);

    new MutationObserver(function () {
      rebuild();
    }).observe(select, { childList: true, subtree: true });

    rebuild();

    select.classList.add('sp-select-native');
    select.setAttribute('tabindex', '-1');
    select.setAttribute('aria-hidden', 'true');
    select.dataset.spEnhanced = 'true';
  }

  document.addEventListener(
    'pointerdown',
    function (event) {
      if (openInstance && !openInstance.wrapper.contains(event.target)) openInstance.closeMenu();
    },
    true
  );
  window.addEventListener('resize', function () {
    if (openInstance) openInstance.closeMenu();
  });

  function enhanceAll(root) {
    var selects = root.querySelectorAll ? root.querySelectorAll('select') : [];
    for (var i = 0; i < selects.length; i++) enhance(selects[i]);
    if (root.tagName === 'SELECT') enhance(root);
  }

  function init() {
    enhanceAll(document);
    if (!document.body) return;
    var bodyObserver = new MutationObserver(function (mutations) {
      for (var i = 0; i < mutations.length; i++) {
        for (var j = 0; j < mutations[i].addedNodes.length; j++) {
          var node = mutations[i].addedNodes[j];
          if (node.nodeType === 1) enhanceAll(node);
        }
      }
    });
    bodyObserver.observe(document.body, { childList: true, subtree: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
