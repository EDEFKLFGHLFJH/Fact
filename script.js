function creerFacture() {

    let client = document.getElementById("client").value.trim();
    let produit = document.getElementById("produit").value.trim();
    let prix = document.getElementById("prix").value;
    let quantite = document.getElementById("quantite").value;

    // 🔥 VALIDATION
    if (!client || !produit || !prix || !quantite) {
        alert("Veuillez remplir tous les champs !");
        return;
    }

    fetch("http://127.0.0.1:5000/facture", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            client: client,
            produit: produit,
            prix: prix,
            quantite: quantite
        })
    })
    .then(res => res.json())
    .then(data => {
        afficherFacture(data);

        // 🔥 RESET FORM
        document.getElementById("client").value = "";
        document.getElementById("produit").value = "";
        document.getElementById("prix").value = "";
        document.getElementById("quantite").value = "";
    })
    .catch(err => {
        console.error(err);
        alert("Erreur lors de la création !");
    });
}

// 🔥 AFFICHAGE FACTURE
function afficherFacture(data) {
    document.getElementById("facture").innerHTML = `
        <div class="facture-card">
            <h2>🧾 FACTURE</h2>
            <p><strong>Client :</strong> ${data.client}</p>
            <p><strong>Produit :</strong> ${data.produit}</p>
            <p><strong>Prix :</strong> ${data.prix} FCFA</p>
            <p><strong>Quantité :</strong> ${data.quantite}</p>
            <hr>
            <h3 style="color:green;">Total : ${data.total} FCFA</h3>

            <button onclick="genererPDF()">📄 Télécharger PDF</button>
        </div>
    `;
}

// 🚀 HISTORIQUE
function chargerFactures() {
    fetch("http://127.0.0.1:5000/factures")
    .then(res => res.json())
    .then(data => {

        if (data.length === 0) {
            document.getElementById("facture").innerHTML =
                "<p>Aucune facture enregistrée</p>";
            return;
        }

        let html = "<h2>📊 Historique des factures</h2>";

        data.forEach(f => {
            html += `
                <div class="facture-item">
                    <strong>${f.client}</strong> - ${f.produit} <br>
                    ${f.quantite} x ${f.prix} FCFA = <b>${f.total} FCFA</b>
                    <br>
                    <button onclick="supprimerFacture(${f.id})">🗑 Supprimer</button>
                </div>
                <hr>
            `;
        });

        document.getElementById("facture").innerHTML = html;
    })
    .catch(err => {
        console.error(err);
        alert("Erreur lors du chargement !");
    });
}

// 🗑 SUPPRIMER
function supprimerFacture(id) {
    if (!confirm("Supprimer cette facture ?")) return;

    fetch(`http://127.0.0.1:5000/facture/${id}`, {
        method: "DELETE"
    })
    .then(() => {
        chargerFactures();
    })
    .catch(err => {
        console.error(err);
        alert("Erreur suppression !");
    });
}

// 📄 PDF
function genererPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    let contenu = document.getElementById("facture").innerText;

    doc.text(contenu, 10, 10);
    doc.save("facture.pdf");
}