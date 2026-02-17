/**
 * Gère la redirection vers les différentes pages de parcours
 * @param {string} path - Le type de parcours choisi
 */
function goToPath(path) {
  if (path === "web") {
    // Redirige vers la page Web que nous avons créée précédemment
    // Assurez-vous que le fichier se nomme bien 'page_web.html' ou ajustez ici
    window.location.href = "page_web.html";
  } else if (path === "creation") {
    window.location.href = "page_crea.html";
  }
}
