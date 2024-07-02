import './styles.css';

const locales = {};

function localize() {
  document.querySelectorAll('[data-i18n]').forEach((element) => {
    const key =
      element.dataset.i18n ||
      element.innerHTML
        .trim()
        .replace(/[\s\n\t]+/g, '_')
        .toLowerCase();
    const value = chrome.i18n.getMessage(key);

    locales[key] = {
      message: element.innerHTML,
    };

    if (value) element.innerHTML = value;
  });
}

localize();

window.locales = locales;
console.log(locales);
