/* =====================================================================
   CONTENU MODIFIABLE — Portfolio Serge Aristide Baba
   ---------------------------------------------------------------------
   Ce fichier contient tout ce qui change souvent :
     1. les liens des réseaux sociaux
     2. le formulaire de contact
     3. les PROJETS
   Les autres textes (à propos, compétences, outils…) sont directement
   dans index.html.

   Règles de syntaxe : garder les guillemets ' ', les virgules entre
   les éléments, et ne pas supprimer les accolades { } ni les crochets [ ].
   Dans un texte entre ' ', écrire l’apostrophe typographique ’ (et non ').
   ===================================================================== */

window.SITE = {

  /* -------------------------------------------------------------------
     1. RÉSEAUX SOCIAUX
     Laisser url: '' tant que le lien n'existe pas → affiché « bientôt ».
     ------------------------------------------------------------------- */
  socials: [
    { label: 'LinkedIn', url: '' },
    { label: 'Behance', url: '' },
    { label: 'Instagram', url: '' },
    { label: 'TikTok', url: '' },
  ],

  /* -------------------------------------------------------------------
     2. FORMULAIRE DE CONTACT
     endpoint vide  → le formulaire ouvre la messagerie avec le message pré-rempli.
     endpoint rempli (ex. Formspree : 'https://formspree.io/f/xxxxxxx')
                    → le message est envoyé directement, sans quitter le site.
     ------------------------------------------------------------------- */
  contact: {
    email: 'Sergearistidebaba225@gmail.com',
    formEndpoint: '',
    mailSubject: 'Proposition de collaboration',
    mailBody: "Bonjour Serge,\n\nJe vous contacte au sujet d'un projet :\n\n— Type de projet :\n— Délais :\n— Budget indicatif :\n\nMerci !",
  },

  /* -------------------------------------------------------------------
     3. PROJETS — affichés dans l’ordre de cette liste.

     MODÈLE À COPIER POUR AJOUTER UN PROJET :
     {
       id: 'nom-du-projet',              // unique, sans espace ni accent
       title: 'Nom du projet',
       client: 'Nom du client',          // facultatif
       category: 'Motion Design / Publicité',
       filter: 'motion',                 // motion | montage | graphisme | photomontage | ia
       year: '2026',
       layout: 'wide',                   // sans effet : toutes les vignettes ont la même taille
       cover: { src: 'media/projects/mon-image.webp', alt: 'Description de l’image' },
         // position: '50% 0%' (facultatif) → partie de l’image gardée si elle est recadrée
       video: {                          // facultatif
         mp4: 'media/projects/ma-video.mp4',
         poster: 'media/projects/ma-video-poster.webp',
         orientation: 'landscape',       // landscape (16:9) | portrait (9:16)
       },
       embed: 'https://www.youtube.com/embed/XXXXXXX', // facultatif : vidéo YouTube / Vimeo
       gallery: [
         { src: 'media/projects/detail-1.webp', alt: '…' },
       ],
       description: 'Contexte, message, cible, objectif.',
       role: ['Motion design', 'Montage'],
       tools: ['After Effects', 'Premiere Pro'],  // facultatif
       ai: ['Outil IA utilisé'],                  // facultatif
       result: 'Livrable final, diffusion, résultats.',
       link: { label: 'Voir sur Behance', url: 'https://…' }, // facultatif
     },

     Images : .webp, .jpg ou .png. Si le chemin est écrit SANS extension
     (ex. 'media/projects/mon-image'), le site charge mon-image.avif
     et mon-image.webp (fournir les deux fichiers).

     Mise en page conseillée : alterner wide + tall, puis tall + wide,
     puis un full ; deux square se placent côte à côte.
     ------------------------------------------------------------------- */
  filters: [
    { id: 'all', label: 'Tout' },
    { id: 'motion', label: 'Motion' },
    { id: 'montage', label: 'Montage' },
    { id: 'graphisme', label: 'Graphisme' },
    { id: 'photomontage', label: 'Photomontage' },
    { id: 'ia', label: 'IA' },
  ],

  projects: [
    {
      id: 'upeci-spot-soutenance',
      title: 'Spot — Cérémonie de soutenance',
      client: 'UPECI — Université Protestante Évangélique de Côte d’Ivoire',
      category: 'Motion Design / Spot événementiel',
      filter: 'motion',
      year: '2026',
      layout: 'wide',
      cover: { src: 'media/projects/upeci-spot-soutenance-poster.webp', alt: 'Carton « 2e édition — Cérémonie de soutenance Licence » du spot UPECI' },
      video: {
        mp4: 'media/projects/upeci-spot-soutenance.mp4',
        poster: 'media/projects/upeci-spot-soutenance-poster.webp',
        orientation: 'landscape',
      },
      description: 'Spot d’annonce de la 2ᵉ édition de la cérémonie de soutenance de Licence de l’UPECI, le mercredi 28 octobre 2026. Le film présente les personnalités qui président et parrainent l’événement, donne les informations pratiques (date, heure, salle) et intègre des images de soutenances, dans la charte violet et vert de l’université.',
      role: ['Motion design', 'Montage', 'Habillage graphique'],
      tools: ['After Effects'],
      result: 'Spot 16:9 de 42 secondes pour la communication de l’université.',
    },
    {
      id: 'upeci-video-motion',
      title: 'UPECI — Présentation animée',
      client: 'UPECI — Université Protestante Évangélique de Côte d’Ivoire',
      category: 'Motion Design / Infographie animée',
      filter: 'motion',
      year: '2026',
      layout: 'wide',
      cover: { src: 'media/projects/upeci-video-motion-poster.webp', alt: 'Illustration animée du bâtiment de l’UPECI' },
      video: {
        mp4: 'media/projects/upeci-video-motion.mp4',
        poster: 'media/projects/upeci-video-motion-poster.webp',
        orientation: 'landscape',
      },
      description: 'Vidéo en motion design qui présente l’université aux futurs étudiants : les filières (Sciences économiques et de gestion, Sciences juridiques administratives et politiques, Administration des affaires), les conditions d’accueil et la procédure d’inscription, jusqu’à la signature « Nous formons les cadres de demain ! ».',
      role: ['Motion design', 'Animation typographique'],
      tools: ['After Effects'],
      result: 'Vidéo 16:9 de 44 secondes.',
    },
    {
      id: 'upeci-animation-logo',
      title: 'Animation logo UPECI',
      client: 'UPECI — Université Protestante Évangélique de Côte d’Ivoire',
      category: 'Motion Design / Animation de logo',
      filter: 'motion',
      year: '2026',
      layout: 'wide',
      cover: { src: 'media/projects/upeci-animation-logo-poster.webp', alt: 'Logo de l’UPECI — Université Protestante Évangélique de Côte d’Ivoire, Yamoussoukro' },
      video: {
        mp4: 'media/projects/upeci-animation-logo.mp4',
        poster: 'media/projects/upeci-animation-logo-poster.webp',
        orientation: 'landscape',
      },
      description: 'En vue de créer une identité remarquable sur les contenus vidéo de l’UPECI, j’ai créé une animation du logo utilisée au début et à la fin de chaque vidéo, créant ainsi une signature institutionnelle et une esthétique visuelle cohérente.',
      role: ['Motion design', 'Direction artistique'],
      tools: ['After Effects'],
      result: 'Animation 16:9 de 5 secondes, utilisée en ouverture et en clôture des vidéos de l’université.',
    },
    {
      id: 'power-electricity-expo-logo',
      title: 'Animation logo — Power & Electricity Expo',
      client: 'Côte d’Ivoire Power & Electricity Expo',
      category: 'Motion Design / Animation de logo',
      filter: 'motion',
      year: '2026',
      layout: 'wide',
      cover: { src: 'media/projects/power-electricity-expo-logo-poster.webp', alt: 'Logo Côte d’Ivoire Power & Electricity Expo, éclair rouge sur fond noir' },
      video: {
        mp4: 'media/projects/power-electricity-expo-logo.mp4',
        poster: 'media/projects/power-electricity-expo-logo-poster.webp',
        orientation: 'landscape',
      },
      description: 'Animation du logo de Côte d’Ivoire Power & Electricity Expo, salon dédié à l’énergie et à l’électricité. Après avoir décomposé le logo en éléments séparés, je l’ai reconstruit à l’écran : les mots apparaissent un à un, puis l’éclair surgit et grésille comme une décharge électrique avant de révéler l’identité complète. Le rythme court et nerveux traduit l’énergie de l’événement.',
      role: ['Décomposition du logo', 'Animation de logo', 'Direction artistique'],
      tools: ['After Effects'],
      result: 'Animation 16:9 de 4 secondes, signature visuelle pour les contenus vidéo de l’événement.',
    },
    {
      id: 'upjunoo-pro',
      title: 'UpJunoo Pro — Mobilité urbaine',
      client: 'UpJunoo Pro',
      category: 'Motion design IA / Format vertical',
      filter: 'ia',
      year: '2026',
      layout: 'tall',
      cover: { src: 'media/projects/upjunoo-pro-poster.webp', alt: 'Écran « UpJunoo Pro vous accompagne » avec véhicules de livraison', position: '50% 0%' },
      video: {
        mp4: 'media/projects/upjunoo-pro.mp4',
        poster: 'media/projects/upjunoo-pro-poster.webp',
        orientation: 'portrait',
      },
      description: 'Vidéo verticale pour UpJunoo Pro, plateforme qui rassemble livraison de colis et mobilité urbaine. Le récit avance écran par écran : le besoin (un colis à expédier), l’application, puis la promesse de simplicité et la signature « votre partenaire de mobilité urbaine ».',
      role: ['Motion design assisté par IA', 'Animation typographique'],
      ai: ['Vibemotion'],
      result: 'Format 9:16 de 33 secondes pour les réseaux sociaux.',
    },
    {
      id: 'vigilus',
      title: 'Vigilus — Sécurité & protection',
      client: 'Vigilus',
      category: 'Motion design IA / Format vertical',
      filter: 'ia',
      year: '2026',
      layout: 'tall',
      offset: true,
      cover: { src: 'media/projects/vigilus-poster.webp', alt: 'Écran « La sécurité & la performance » de la vidéo Vigilus' },
      video: {
        mp4: 'media/projects/vigilus.mp4',
        poster: 'media/projects/vigilus-poster.webp',
        orientation: 'portrait',
      },
      description: 'Vidéo verticale pour Vigilus, entreprise de solutions de sécurité : prévention incendie, protection des biens et des infrastructures, solutions adaptées aux besoins de chaque client. Une animation rythmée en rouge et bleu nuit, construite autour des pictogrammes de la marque.',
      role: ['Motion design assisté par IA', 'Animation d’interface'],
      ai: ['Vibemotion'],
      result: 'Format 9:16 de 32 secondes pour les réseaux sociaux.',
    },
    {
      id: 'smartfin-app',
      title: 'SmartFin App — Vidéo de lancement',
      client: 'SmartFin',
      category: 'Motion design IA / Application mobile',
      filter: 'ia',
      year: '2026',
      layout: 'wide',
      cover: { src: 'media/projects/smartfin-app-poster.webp', alt: 'Écran « Téléchargez dès maintenant » de la vidéo SmartFin App' },
      video: {
        mp4: 'media/projects/smartfin-app.mp4',
        poster: 'media/projects/smartfin-app-poster.webp',
        orientation: 'landscape',
      },
      description: 'Vidéo de présentation de l’application de gestion financière SmartFin : prendre le contrôle de ses finances depuis son smartphone, gagner en visibilité grâce aux tableaux de bord, puis télécharger l’application. Animation d’interface et de typographie réalisée avec un outil de motion design assisté par IA.',
      role: ['Motion design assisté par IA', 'Animation d’interface'],
      ai: ['Vibemotion'],
      result: 'Vidéo 16:9 de 31 secondes, livrée sans musique pour la sonorisation.',
    },
    {
      id: 'affiche-showcase-as-rayan',
      title: 'Affiche — Concert AS-RAYAN',
      client: 'BDR VISUAL',
      category: 'Design graphique / Affiche événementielle',
      filter: 'graphisme',
      year: '2026',
      layout: 'square',
      cover: { src: 'media/projects/affiche-showcase-as-rayan', alt: 'Affiche « AS-RAYAN & ZXN en showcase » : les deux artistes dos à dos devant la basilique, février 2027', position: '50% 16%' },
      description: 'Dans le cadre de leur concert prévu en février 2027, le groupe AS-RAYAN & ZXN m’a contacté pour la réalisation de l’affiche de l’événement, de l’affiche d’appel à sponsors jusqu’à l’affiche finale.',
      role: ['Direction artistique', 'Conception graphique', 'Recherche créative'],
      tools: ['Illustrator'],
      result: 'Affiche verticale déclinée de l’appel à sponsors à la version finale.',
    },
    {
      id: 'upeci-signaletique',
      title: 'Bâches & signalétique',
      client: 'UPECI — Université Protestante Évangélique de Côte d’Ivoire',
      category: 'Design graphique / Grand format',
      filter: 'graphisme',
      year: '2026',
      layout: 'full',
      cover: { src: 'media/projects/upeci-facade-bienvenue', alt: 'Bâche « Bienvenue à l’Université Protestante Évangélique de Côte d’Ivoire » avec deux diplômés' },
      gallery: [
        { src: 'media/projects/upeci-cadre', alt: 'Visuel UPECI présentant les filières Licence et Master et les atouts de l’université' },
        { src: 'media/projects/upeci-bache-photo', alt: 'Photo de la bâche « Bienvenue » imprimée, sur le site de l’université' },
        { src: 'media/projects/upeci-cadre-facade-gauche', alt: 'Cadre de façade « Nous formons les cadres de demain »' },
      ],
      description: 'Supports grand format pour l’université : bâche de bienvenue de la façade intérieure, cadres de façade et visuel de présentation de l’offre de formation. Chaque support réunit l’identité de l’UPECI, les filières, les coordonnées et les partenaires, avec une hiérarchie lisible de loin.',
      role: ['Conception graphique', 'Mise en page grand format'],
      result: 'Supports imprimés pour le site de l’université, à Yamoussoukro.',
    },
    {
      id: 'upeci-rentree',
      title: 'Campagne de rentrée 2026-2027',
      client: 'UPECI — Université Protestante Évangélique de Côte d’Ivoire',
      category: 'Design graphique / Social media',
      filter: 'graphisme',
      year: '2026',
      layout: 'square',
      cover: { src: 'media/projects/upeci-rentree-universitaire', alt: 'Visuel « Excellente rentrée universitaire 2026-2027 » avec une diplômée' },
      gallery: [
        { src: 'media/projects/upeci-rentree-academique', alt: 'Visuel « Rentrée académique 2026-2027 — lundi 14 septembre »' },
        { src: 'media/projects/upeci-rentree-universitaire', alt: 'Visuel « Excellente rentrée universitaire 2026-2027 »' },
      ],
      description: 'Visuels d’annonce de la rentrée universitaire et académique 2026-2027 : date de rentrée (lundi 14 septembre), poursuite des inscriptions jusqu’au 30 septembre, contacts et localisation de l’université à Yamoussoukro.',
      role: ['Conception graphique', 'Supports social media'],
      result: 'Visuels carrés pour les réseaux sociaux de l’université.',
    },
    {
      id: 'simplon-soiree-cinema',
      title: 'Affiche — Soirée cinéma',
      client: 'Simplon Côte d’Ivoire — cohorte Montage vidéo & Motion design',
      category: 'Design graphique / Affiche événementielle',
      filter: 'graphisme',
      year: '2026',
      layout: 'square',
      cover: { src: 'media/projects/simplon-soiree-cinema', alt: 'Affiche « Soirée cinéma » rouge, vendredi 31 juillet 2026' },
      description: 'Affiche d’invitation à la soirée cinéma de la cohorte Montage vidéo – Motion design de Simplon Côte d’Ivoire, organisée le vendredi 31 juillet 2026 pour la projection des films de la promotion. Typographie massive et salle de cinéma en rouge profond pour installer l’ambiance.',
      role: ['Conception graphique', 'Direction artistique'],
      result: 'Affiche carrée diffusée pour inviter le public à la projection.',
    },
    {
      id: 'logos',
      title: 'Logos — Empreinte Distribution & O Design',
      category: 'Identité visuelle / Logo',
      filter: 'graphisme',
      year: '2026',
      layout: 'tall',
      cover: { src: 'media/projects/logos-cover', alt: 'Logos Empreinte Distribution et O Design' },
      gallery: [
        { src: 'media/projects/logo-empreinte-distribution', alt: 'Logo Empreinte Distribution : casque audio formant la lettre D' },
        { src: 'media/projects/logo-o-design', alt: 'Logo O Design : pinceau dans un cercle orange sur fond noir' },
      ],
      description: 'Deux créations de logo : Empreinte Distribution, qui fait du casque audio l’initiale D de la marque, et O Design, construit autour d’un pinceau qui traverse un cercle orange.',
      role: ['Création de logo', 'Identité visuelle'],
    },
    {
      id: 'teaser-50000',
      title: 'Teaser — « 50.000, le marchand de rêves »',
      client: 'Simplon Côte d’Ivoire — Groupe 7 Createch',
      category: 'Montage vidéo / Court métrage',
      filter: 'montage',
      year: '2026',
      layout: 'full',
      cover: { src: 'media/projects/teaser-50000-poster.webp', alt: 'Deux personnages qui s’enlacent, extrait du teaser' },
      video: {
        mp4: 'media/projects/teaser-50000.mp4',
        poster: 'media/projects/teaser-50000-poster.webp',
        orientation: 'landscape',
      },
      description: 'Teaser du court métrage « 50.000 — Le marchand de rêves », réalisé par le Groupe 7 Createch pendant la formation Montage vidéo & Motion design de Simplon. Le montage installe la tension par des plans courts, des visages et des silences, jusqu’au carton titre et à l’annonce de la sortie.',
      role: ['Montage', 'Rythme', 'Titrage'],
      result: 'Teaser de 55 secondes annonçant la sortie du film le 21 août.',
    },
    {
      id: 'photomontages',
      title: 'Compositions typographiques',
      category: 'Photomontage / Composition de texte',
      filter: 'photomontage',
      year: '2026',
      layout: 'full',
      cover: { src: 'media/projects/photomontage-korhogo', alt: 'Le mot KORHOGO placé derrière le mont, au-dessus de la ville' },
      gallery: [
        { src: 'media/projects/photomontage-man', alt: 'Le mot MAN derrière les montagnes — « la ville aux 18 montagnes »' },
        { src: 'media/projects/photomontage-paris', alt: 'Le mot PARIS traversé par la tour Eiffel — « C’magique »' },
        { src: 'media/projects/photomontage-lagune-mer', alt: 'Photomontage « Lagune entre Mer » fondant deux paysages' },
      ],
      description: 'Série de compositions qui mêlent typographie et paysage : le texte passe derrière le relief (Mont Korhogo, Man « la ville aux 18 montagnes », Paris) ou relie deux décors en une seule image (Lagune entre Mer). Un exercice de détourage, de profondeur et de mise en scène du texte.',
      role: ['Photomontage', 'Composition typographique', 'Détourage'],
    },
    {
      id: 'upeci-carte-etudiant',
      title: 'Carte d’étudiant',
      client: 'UPECI — Université Protestante Évangélique de Côte d’Ivoire',
      category: 'Design graphique / Print',
      filter: 'graphisme',
      year: '2026',
      layout: 'square',
      cover: { src: 'media/projects/upeci-carte-cover', alt: 'Recto et verso de la carte d’étudiant UPECI' },
      gallery: [
        { src: 'media/projects/upeci-carte-recto', alt: 'Recto de la carte d’étudiant 2026-2027' },
        { src: 'media/projects/upeci-carte-verso', alt: 'Verso de la carte d’étudiant avec les coordonnées de la scolarité' },
      ],
      description: 'Carte d’étudiant 2026-2027 de l’UPECI, recto et verso : identité de l’université, zone photo, champs d’identification de l’étudiant et coordonnées de la direction de la scolarité.',
      role: ['Conception graphique', 'Mise en page'],
    },
  ],
};
