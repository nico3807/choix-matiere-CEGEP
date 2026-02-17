document.addEventListener("DOMContentLoaded", () => {
  const checkboxes = document.querySelectorAll(".course-check");
  const titles = document.querySelectorAll(".course-title");
  const pdfButton = document.getElementById("download-pdf");

  // Gestion de l'affichage interactif et des calculs [cite: 22, 76, 77]
  const updateCalculations = () => {
    let ects = 0,
      h = 0,
      ti = 0;
    checkboxes.forEach((check) => {
      if (check.checked) {
        const row = check.closest("tr");
        ects += parseFloat(row.dataset.ects);
        h += parseFloat(row.dataset.h);
        ti += parseFloat(row.dataset.ti);
      }
    });
    document.getElementById("total-ects").textContent = ects.toFixed(2);
    document.getElementById("total-h").textContent = h;
    document.getElementById("total-ti").textContent = ti;
    document.getElementById("grand-total").textContent = (h + ti).toFixed(2);

    // Affichage des descriptions pour les lignes cochées
    document.querySelectorAll(".description").forEach((desc) => {
      const row = desc.closest("tr");
      desc.style.display = row.querySelector(".course-check").checked
        ? "block"
        : "none";
    });
  };

  titles.forEach((title) => {
    title.addEventListener("click", () => {
      const desc = title.nextElementSibling;
      desc.style.display = desc.style.display === "block" ? "none" : "block";
    });
  });

  checkboxes.forEach((check) =>
    check.addEventListener("change", updateCalculations),
  );
  updateCalculations();

  // LOGIQUE PDF CORRIGÉE
  pdfButton.addEventListener("click", () => {
    const nom = document.getElementById("user-lastname").value.trim();
    const prenom = document.getElementById("user-firstname").value.trim();

    if (!nom || !prenom) {
      alert("Veuillez saisir votre Nom et votre Prénom.");
      return;
    }

    const container = document.getElementById("main-container");
    const recapCard = document.getElementById("recap-card");
    const rows = document.querySelectorAll("#course-body tr");

    // 1. Préparer le DOM pour la capture PDF
    container.classList.add("pdf-mode-container");
    recapCard.classList.add("pdf-mode-card");
    pdfButton.classList.add("pdf-mode-hide");

    rows.forEach((row) => {
      if (!row.querySelector(".course-check").checked) {
        row.classList.add("pdf-mode-hide");
      }
      row.querySelector(".course-check").classList.add("pdf-mode-hide");
    });
    // Cacher toutes les descriptions pour le PDF
    document
      .querySelectorAll(".description")
      .forEach((d) => (d.style.display = "none"));

    // Déplacer la carte en bas pour le PDF
    container.appendChild(recapCard);

    const opt = {
      margin: [10, 5, 10, 5],
      filename: `Selection_${nom}_${prenom}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };

    // 2. Lancer la génération
    html2pdf()
      .set(opt)
      .from(container)
      .save()
      .then(() => {
        // 3. Restaurer l'interface web d'origine
        container.classList.remove("pdf-mode-container");
        recapCard.classList.remove("pdf-mode-card");
        pdfButton.classList.remove("pdf-mode-hide");

        // Remettre la carte dans sa sidebar
        document.getElementById("sidebar-id").appendChild(recapCard);

        rows.forEach((row) => {
          row.classList.remove("pdf-mode-hide");
          row.querySelector(".course-check").classList.remove("pdf-mode-hide");
        });
        updateCalculations();
      });
  });
});
