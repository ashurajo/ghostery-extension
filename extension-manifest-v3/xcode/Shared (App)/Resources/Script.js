function postMessage(name) {
  console.log(`postMessage: ${name}`);
  webkit.messageHandlers.controller.postMessage(name);
}

function localize(messages) {
  document.querySelectorAll('[data-i18n]').forEach((element) => {
    const key =
      element.dataset.i18n ||
      element.innerHTML.trim().replace(/[\s\n\t]+/g, ' ');
    const value = messages[key];
    if (value) element.innerHTML = value;
  });
}

document.querySelectorAll('a, button').forEach((item) => {
  item.addEventListener('click', (event) => {
    event.preventDefault();
    postMessage(item.id);
  });
});
