# Site portfolio — Serge Aristide Baba

Site statique : **HTML + CSS + JavaScript**, sans framework, sans installation, sans compilation.
On dépose les fichiers sur un hébergeur et le site est en ligne.

---

## 1. Contenu du dossier

```
index.html            ← la page (tous les textes du site)
assets/css/style.css  ← le design
assets/js/data.js     ← PROJETS, réseaux sociaux, formulaire  ← à modifier
assets/js/main.js     ← animations et interactions (ne pas modifier)
assets/fonts/         ← polices (aucune connexion à Google Fonts)
media/                ← photos, images et vidéos
favicon.svg, apple-touch-icon.png, og-image.jpg, robots.txt
```

Pour voir le site sur votre ordinateur : double-cliquez sur `index.html`.

---

## 2. Mettre le site en ligne

### Option A — GitHub Pages (gratuit)
1. Créer un dépôt sur GitHub (ex. `serge-portfolio`).
2. *Add file → Upload files* : glisser **tout le contenu** du dossier (pas le dossier lui-même), puis *Commit*.
3. *Settings → Pages* → Source : *Deploy from a branch* → branche `main`, dossier `/ (root)` → *Save*.
4. Le site est en ligne après 1 à 2 minutes : `https://NOM-UTILISATEUR.github.io/serge-portfolio/`

### Option B — Netlify (gratuit, le plus rapide)
Aller sur **app.netlify.com/drop** et glisser le dossier. Le site est en ligne immédiatement.
Un nom de domaine personnalisé peut être ajouté ensuite.

### Option C — Hébergeur classique (o2switch, Hostinger, LWS…)
Envoyer tout le contenu du dossier dans `public_html/` (ou `www/`) par le gestionnaire de fichiers ou FTP.

### Après la mise en ligne (SEO)
Dans `index.html`, remplacer `og-image.jpg` par l'adresse complète
(ex. `https://www.votre-domaine.com/og-image.jpg`) dans les lignes `og:image` et `twitter:image`,
et activer la ligne `canonical`. Sans cela, l'aperçu du lien partagé sur WhatsApp / LinkedIn peut ne pas s'afficher.

---

## 3. Modifier le contenu

### Les projets → `assets/js/data.js`
Le site contient 12 réalisations de Serge. Elles s'affichent dans l'ordre de la liste `projects`.

Pour ajouter un projet :
1. Mettre les images dans `media/projects/` (format **.webp** ou **.jpg**, 1600 à 2000 px de large).
2. Ouvrir `assets/js/data.js` avec un éditeur de texte (VS Code, Notepad++…).
3. Copier le **modèle** indiqué en haut de la partie « 3. PROJETS » et le remplir.

Toutes les vignettes de la grille ont la même taille (format 16:9, deux par ligne) ; la vidéo ou l’image s’affiche dans son format d’origine à l’ouverture du projet. Le champ `layout` n’a plus d’effet sur la grille.
Si une image est recadrée au mauvais endroit, ajouter `position: '50% 0%'` dans `cover` (0% = haut, 100% = bas).

Filtres disponibles (`filter`) : `motion`, `montage`, `graphisme`, `photomontage`, `ia`.
Un filtre sans projet est masqué automatiquement.

**Vidéos** : MP4 (H.264), 720p ou 1080p, idéalement moins de 10 Mo. Commande de conversion avec ffmpeg :
`ffmpeg -i video.mov -vf scale=1280:-2 -c:v libx264 -crf 24 -preset slow -movflags +faststart -c:a aac -b:a 112k video.mp4`
(ou HandBrake, préréglage « Web / Vimeo YouTube HQ 720p »).
Pour une vidéo YouTube/Vimeo, utiliser le champ `embed` avec le lien d'intégration
(ex. `https://www.youtube.com/embed/XXXXXXX`).

### Réseaux sociaux → `assets/js/data.js`, partie 1
Coller le lien entre les guillemets `url: 'https://…'`. Tant que c'est vide, le site affiche « bientôt ».

### Formulaire de contact → `assets/js/data.js`, partie 2
- Par défaut : le formulaire ouvre la messagerie avec le message pré-rempli.
- Pour recevoir les messages directement : créer un formulaire gratuit sur **formspree.io**
  et coller son adresse dans `formEndpoint: 'https://formspree.io/f/xxxxxxx'`.

### Les autres textes → `index.html`
À propos, compétences, outils, processus, coordonnées : chercher le texte dans `index.html` et le remplacer.
Le téléphone et l'e-mail apparaissent à plusieurs endroits (menu mobile, section contact, données SEO en haut du fichier).

### Les photos de Serge
Remplacer `media/portrait.webp` / `.avif` (photo couleur, utilisée à l’accueil et dans « À propos »)
en gardant les mêmes noms de fichiers.

---

## 4. Identité visuelle

- Couleurs (début de `style.css`) : noir `#0B0B0C` · blanc cassé `#F2EFE9` · gris `#8C8A86` · bleu électrique `#2E5BFF`
- Polices : Space Grotesk (titres), Inter (texte), JetBrains Mono (métadonnées)

## 5. Accessibilité et performance

- Si le visiteur a activé « réduire les animations » sur son appareil, le site passe automatiquement en version sobre.
- Curseur personnalisé et effets de souris uniquement sur ordinateur.
- Navigation complète au clavier (fiche projet fermée avec Échap, comparateur avant/après aux flèches).
- Images chargées à la demande, vidéos chargées seulement au survol ou au clic, aucune ressource externe.
