/* ==========================================================================
   content.js — Toutes les chaînes bilingues du site (FR par défaut, ZH).
   Source de vérité : web/site/CONTRACT.md §3 + web/spec/content-model.md
   + web/spec/data-model.json / assets/js/data.js (window.RIMU_DATA).
   Aucun chiffre n'est inventé : les valeurs reprennent les displayFR /
   displayZH de data.js ; les séquences 30 / 90 / 180 jours sont des
   propositions de séquencement, signalées comme telles.
   Structure : window.RIMU_CONTENT = { fr: {...}, zh: {...} } — clés miroir.
   ========================================================================== */
window.RIMU_CONTENT = {
  fr: {
    ui: {
      langLabel: "Français / 中文",
      langAria: "Changer de langue : français ou chinois",
      modeSynthese: "Synthèse",
      modeComplet: "Complet",
      modeAria: "Niveau de détail : synthèse ou complet",
      pitch: "Visite guidée · 3 min",
      present: "Présenter",
      pdf: "Dossier PDF",
      close: "Fermer",
      next: "Suivant",
      prev: "Précédent",
      pause: "Pause",
      resume: "Reprendre",
      exit: "Quitter",
      skip: "Passer",
      chapter: "Chapitre",
      of: "sur",
      methodology: "Méthodologie",
      scenario: "Scénario ambitieux",
      updated: "Dernière mise à jour",
      source: "Source",
      derived: "Dérivé",
      hypothesis: "Hypothèse",
      openFiche: "En savoir plus",
      seeConnections: "Voir les connexions",
      seeRoadmap: "Feuille de route",
      tabs: {
        apercu: "Aperçu",
        fonctionnement: "Fonctionnement",
        chiffres: "Chiffres clés",
        acteurs: "Acteurs & flux",
        roadmap: "Feuille de route",
        risques: "Risques"
      },
      flows: {
        capital: "Capital",
        marchandises: "Marchandises",
        paiements: "Paiements",
        donnees: "Données",
        attention: "Attention"
      },
      in: "Entrées",
      out: "Sorties",
      stage: {
        mature: "Mature",
        pilote: "Pilote",
        preEtude: "Pré-étude"
      },
      graph: "Graphe",
      matrix: "Matrice",
      all: "Tout",
      reset: "Réinitialiser",
      isolate: "Isoler",
      replay: "Rejouer",
      pauseStory: "Mettre en pause",
      playStory: "Lire l'histoire",
      tourStart: "Démarrer la visite",
      tourDone: "Visite terminée",
      tourRestart: "Revoir la visite",
      presenterHint: "Mode présentateur : ← / → changer de chapitre · B noir · Échap quitter",
      timer: "Minuteur",
      menu: "Sommaire",
      top: "Haut",
      share: "Partager",
      copied: "Lien copié",
      view: "Vue",
      pages: "pages",
      sourceDoc: "Document de référence",
      backToTop: "Retour en haut",
      closeModal: "Fermer la fenêtre",
      print: "Imprimer",
      footerNav: "Sommaire du dossier"
    },
    brand: {
      name: "Plateforme de coopération",
      sub: "RIMU · RIMP · IA",
      signature: "AUREON DIGITAL · Bâtisseur de la souveraineté numérique",
      tagline: "Une plateforme. Trois souverainetés."
    },
    hero: {
      kicker: "Nouakchott · 2026–2031 · Chine — Mauritanie",
      title1: "Une plateforme",
      title2: "Trois souverainetés",
      lead: "Le point d'entrée officiel commun aux deux pays : projets, commerce de gros, finance, formation et santé, reliés à une super-application nationale et à un socle de calcul IA souverain.",
      subline: "Relier la Chine et l'Afrique de l'Ouest, depuis Nouakchott.",
      ctaPitch: "Visite guidée 3 min",
      ctaExplore: "Explorer le système",
      ctaPdf: "Lire le dossier (PDF)",
      ctaCinema: "Version cinématique",
      scroll: "Faire défiler — 9 chapitres",
      kpis: [
        { id: "kpi.mau_2031", label: "Utilisateurs actifs mensuels · 2031" },
        { id: "kpi.revenue_total_2031", label: "Revenus annuels · 2031" },
        { id: "kpi.wallets_2031", label: "Portefeuilles RIMP" },
        { id: "kpi.jobs_5y", label: "Emplois directs + écosystème · 5 ans" }
      ],
      pillars: [
        { id: "p.plateforme", label: "Point d'entrée bilatéral", note: "Un seul canal officiel" },
        { id: "p.rimu", label: "Super-application RIMU", note: "Les usages du quotidien" },
        { id: "p.calcul", label: "Centre national de calcul IA", note: "La souveraineté des données" }
      ],
      network: {
        china: "Chine",
        mauritania: "Mauritanie",
        hub: "Nouakchott",
        westAfrica: "Afrique de l'Ouest"
      }
    },
    chapters: {
      hero: {
        kicker: "00 · Ouverture",
        title: "Une plateforme pour relier deux continents",
        lead: "Deux États, un canal officiel, une super-application et un socle de calcul souverain."
      },
      pourquoi: {
        kicker: "01 · Le constat",
        title: "Ce qui bloque aujourd'hui",
        lead: "Quatre blocages structurels — et une réponse qui n'est pas un site de plus.",
        transition: "La réponse n'est pas un site de plus. C'est un système : un point d'entrée bilatéral, une super-application, un socle de calcul."
      },
      systeme: {
        kicker: "02 · Le système",
        title: "Un système, pas une somme de projets",
        lead: "Trois piliers, six filières, quatre couches. Cliquez un nœud : sa fiche s'ouvre et les flux liés s'allument.",
        pillarsLabel: "Les trois piliers",
        businessesLabel: "Les six filières",
        layersLabel: "Les quatre couches",
        hint: "Cliquez un nœud pour ouvrir sa fiche ; les flux liés s'allument."
      },
      rimu: {
        kicker: "03 · RIMU",
        title: "RIMU, le système d'exploitation du quotidien",
        lead: "Pas un TikTok localisé : contenus, biens, emplois et services publics, en français, arabe et anglais au lancement (langues locales en phase 2), à faible bande passante, sous règles mauritaniennes.",
        modulesLabel: "Huit modules, une seule application",
        dayLabel: "Une journée avec RIMU",
        dayHint: "Sept moments : cliquez un point, l'écran du téléphone suit."
      },
      ia: {
        kicker: "04 · IA & calcul",
        title: "Le socle : contenu IA, calcul souverain",
        lead: "Quatre couches, trois phases, une règle : les données et les modèles restent sur le territoire national.",
        groupsLabel: "Trois familles d'usages",
        phasesLabel: "Trois phases de déploiement"
      },
      flux: {
        kicker: "05 · Les flux",
        title: "Cinq flux, un même circuit",
        lead: "Capital, marchandises, paiements, données, attention : trois récits de vingt secondes montrent comment le système tourne.",
        legendLabel: "Les cinq flux",
        hint: "Cliquez une histoire pour suivre le circuit ; cliquez un nœud pour ouvrir sa fiche."
      },
      trajectoire: {
        kicker: "06 · La trajectoire",
        title: "2026–2031 : trois trajectoires, un même calendrier",
        lead: "La plateforme bilatérale en trois étapes, RIMU en cinq ans, le calcul en trois phases — les trois avancent en parallèle.",
        note: "Durées relatives à la source ; le démarrage du calcul est une hypothèse de séquencement (2026-H2), non une date contractuelle."
      },
      impact: {
        kicker: "07 · L'impact",
        title: "2031 : ce que cela représente",
        lead: "Scénario ambitieux — chaque chiffre est étiqueté source, dérivé ou hypothèse ; chaque valeur s'ouvre sur sa méthode.",
        chartMauTitle: "Utilisateurs actifs : la courbe 2027–2031",
        chartRevenueTitle: "Composition des revenus 2031",
        winLabel: "Trois gagnants",
        mapLabel: "De point de transit à hub de services",
        mapLead: "Les acheteurs ouest-africains s'arrêtent à Nouakchott pour voir, sélectionner et répartir les marchandises chinoises.",
        transformationLabel: "Ce qui change"
      },
      decision: {
        kicker: "08 · La décision",
        title: "Cinq décisions pour ouvrir le canal",
        lead: "Sans avance budgétaire importante et sans confirmer des montants déjà conclus : cinq points à clarifier en même temps.",
        supportsLabel: "Ce que nous demandons à l'État",
        supportsLead: "Cinq décisions à clarifier en parallèle — des mécanismes, pas une promesse.",
        risksLabel: "Cinq risques, cinq garanties",
        risksLead: "Chaque risque a un mécanisme écrit, pas une promesse.",
        ctaLabel: "Choisissez votre prochaine étape",
        nextLabel: "Calendrier proposé",
        disclaimer: "Document de présentation : chiffres en scénario ambitieux, non contractuels ; fourchettes non strictement additives. Voir la méthodologie."
      }
    },
    problems: [
      {
        id: "attention",
        title: "L'attention s'exporte",
        body: "Les plateformes étrangères captent le temps d'écran des jeunes ; aucune règle nationale ne pilote la recommandation ni les langues de diffusion.",
        change: "Une plateforme nationale pilote la recommandation, les langues et les contenus certifiés.",
        link: "#ch-rimu"
      },
      {
        id: "argent",
        title: "L'argent circule hors circuit",
        body: "Moins de 20 % des adultes disposent d'un compte numérique ; l'économie de cash reste difficile à auditer.",
        change: "Comptes numériques adultes à ≈ 50 % en 2031 ; subventions et salaires sur un circuit traçable.",
        link: "#ch-systeme"
      },
      {
        id: "donnees",
        title: "Les données restent ailleurs",
        body: "Données, modèles et modération sont hébergés à l'étranger : ni les poids ni la recommandation ne sont maîtrisés.",
        change: "Données, clés et poids des modèles conservés sur le territoire national.",
        link: "#ch-ia"
      },
      {
        id: "mono-export",
        title: "Une économie mono-export",
        body: "Minerais bruts et captures non transformées portent les recettes ; la croissance (4,5 %) dépend d'un seul prix.",
        change: "Transformation, traçabilité, hub ouest-africain et services numériques exportables.",
        link: "#ch-impact"
      }
    ],
    rimu: {
      modulesLabel: "Huit modules, une seule application",
      modules: [
        { id: "rimu.live", title: "Live", body: "Mariages, marchés, débarquements de pêche, conférences religieuses certifiées et live commerce." },
        { id: "rimu.studio", title: "Studio créateurs", body: "Bibliothèque de droits musicaux locaux, modèles, transcription et sous-titres automatiques (FR/AR/EN ; hassaniya et langues locales en phase 2)." },
        { id: "rimu.creation", title: "Économie des créateurs", body: "Publicité, dons en live et commerce : des revenus en ouguiyas qui restent dans le circuit national." },
        { id: "rimu.shop", title: "RIMU Shop + RIMP", body: "Catalogue, commande, paiement à la livraison ou prépaiement réglé par RIMP." },
        { id: "rimu.jobs", title: "RIMU Jobs & formation", body: "Offres d'emploi, formations courtes en compétences et contenus de formation professionnelle." },
        { id: "rimu.verifie", title: "Comptes vérifiés administratifs", body: "Éducation, santé, paiements municipaux, alertes météo et tempêtes de sable." },
        { id: "rimu.mineurs", title: "Protection des mineurs", body: "Désactivation par défaut de la recommandation personnalisée, du défilement infini, des dons en live et des messages d'inconnus." },
        { id: "rimu.souverainete", title: "Souveraineté des contenus", body: "Vérification, modération et recommandation sous contrôle mauritanien ; priorisation transparente et signalement." }
      ],
      dayLabel: "Une journée avec RIMU",
      dayHint: "Sept moments : cliquez un point, l'écran du téléphone suit.",
      day: [
        { time: "07:00", title: "Le fil du matin", body: "Vidéos courtes, actualités et alertes météo : 15–60 s par contenu, 360p/480p par défaut, pré-cache nocturne.", screen: "feed" },
        { time: "09:00", title: "Le marché et les débarquements", body: "À proximité : marchés, arrivages de pêche, services municipaux et prix du jour, en français, arabe et anglais.", screen: "proximite" },
        { time: "12:00", title: "Live depuis le marché", body: "Un vendeur filme son étal, répond aux questions et encaisse en direct via RIMP.", screen: "live" },
        { time: "14:00", title: "Une formation courte", body: "RIMU Jobs et formation : une compétence pratique, une vidéo de trois minutes, un certificat à la clé.", screen: "jobs" },
        { time: "17:00", title: "Une consultation à distance", body: "Un point de télémédecine se connecte à un spécialiste ; l'IA transcrit et prépare le dossier.", screen: "sante" },
        { time: "19:00", title: "Eau, électricité et marché réglés", body: "Comptes vérifiés et RIMU Shop : factures, achats et livraisons payés en ouguiyas par RIMP.", screen: "marche" },
        { time: "21:00", title: "Le créateur encaisse", body: "Dons, ventes et commissions arrivent en ouguiyas ; l'argent reste dans le circuit national.", screen: "shop" }
      ],
      trust: [
        { title: "Protection des mineurs — par défaut", body: "Recommandation personnalisée, défilement infini, dons en live et messages d'inconnus désactivés par défaut." },
        { title: "Souveraineté des contenus — règles mauritaniennes", body: "Vérification, modération et recommandation sous contrôle national ; priorisation transparente et signalement, sans censure arbitraire." },
        { title: "Économie des créateurs — revenus en ouguiyas", body: "Publicité, dons et commerce : les revenus restent dans le circuit national." }
      ]
    },
    ia: {
      groupsLabel: "Trois familles d'usages",
      groups: [
        {
          id: "ai.content",
          title: "Production de contenu RIMU",
          items: [
            "Sous-titres automatiques et transcription voix-texte.",
            "Traduction multilingue arabe / français / anglais.",
            "Assistance aux vidéos de formation, de compétences techniques ou de contenus religieux certifiés.",
            "Contrôle humain après pré-modération par modèle, mots-clés ou empreinte vocale."
          ]
        },
        {
          id: "ai.quotidien",
          title: "Services du quotidien",
          items: [
            "Support aux consultations médicales à distance.",
            "Alertes précoces de tempête de sable ; rappels de paiement de l'eau et de l'électricité.",
            "Vidéos d'information sur les prix du poisson et des produits agricoles.",
            "Prévention santé et informations publiques en vidéos courtes accessibles."
          ]
        },
        {
          id: "ai.pro",
          title: "Usages professionnels et administratifs",
          items: [
            "Rappels d'entretien des machines dans les mines et les ports ; enregistrement des débarquements de pêche.",
            "Aide aux commerçants pour l'encaissement et l'évaluation de crédit.",
            "Envoi automatisé d'informations gouvernementales."
          ]
        }
      ],
      phasesLabel: "Trois phases de déploiement",
      phases: [
        { id: "calcul.phase1", title: "Phase 1 — inférence et modération", body: "Priorité à l'inférence ; modération et contrôle des risques des deux plateformes.", value: "≈ 18 mois · ≈ 100 cartes · ≈ 1 MW" },
        { id: "calcul.phase2", title: "Phase 2 — entraînement / inférence", body: "Séparation entraînement / inférence ; ouverture éventuelle d'interfaces d'inférence régionales ouest-africaines.", value: "≈ 36 mois · 2–3 MW" },
        { id: "calcul.phase3", title: "Phase 3 — extension modulaire", body: "Extension liée à un contrat d'électricité verte et à un accord national sur l'électricité.", value: "Contrat d'électricité verte · accord national sur l'électricité" }
      ],
      sovereignty: {
        title: "Une règle : les données et les modèles restent au pays",
        body: "Grand livre et modèles centraux locaux ; entraînement possiblement hybride, inférence rapatriée. Alimentation 2N + diesel + photovoltaïque + batteries, capacité nouvelle et ligne dédiée, sans empiéter sur la consommation résidentielle."
      }
    },
    flux: {
      legendLabel: "Cinq flux",
      storyLabel: "Trois récits, vingt secondes chacun",
      hint: "Cliquez une histoire pour suivre le circuit ; cliquez un nœud pour ouvrir sa fiche. Les couleurs distinguent les cinq flux.",
      matrixHint: "Version matricielle — même information, sans animation, pensée pour le faible débit.",
      stories: [
        {
          id: "capital",
          title: "Le capital ouvre la voie",
          subtitle: "Du financement aux projets, puis aux emplois",
          captions: [
            "La plateforme publique les coopérations existantes et les besoins de financement.",
            "Les investisseurs chinois et institutionnels repèrent des projets traçables et bancables.",
            "Les intentions d'investissement deviennent des dossiers, puis des chantiers.",
            "Mines, énergies nouvelles, infrastructures, agro-halieutique : six filières avancent.",
            "Les projets et la formation alimentent en retour le socle de calcul.",
            "Résultat : 5–8 projets en phase substantielle et 800 M–1,2 Md USD d'intentions."
          ],
          outcome: { value: "800 M–1,2 Md USD", label: "d'intentions d'investissement pour 5–8 projets en phase substantielle" }
        },
        {
          id: "marchandises",
          title: "Les marchandises s'arrêtent et se répartissent",
          subtitle: "Des clusters chinois au hub de Nouakchott, puis aux cinq pays",
          captions: [
            "Les clusters industriels chinois préparent quincaillerie, textile, électroménager, matériaux et motos.",
            "Le showroom et la zone en ligne présentent les produits aux acheteurs ouest-africains.",
            "Les biens arrivent par le port, se stockent et se répartissent depuis Nouakchott.",
            "Douane, transit et règlement sont écrits dans la plateforme, séparés des minerais en vrac.",
            "Sénégal, Mali, Guinée, Côte d'Ivoire et Gambie viennent s'approvisionner sur place.",
            "Résultat : 800 M–2 Md USD/an de biens passent par la Mauritanie."
          ],
          outcome: { value: "800 M–2 Md USD/an", label: "de biens transitant par la Mauritanie vers l'Afrique de l'Ouest" }
        },
        {
          id: "attention",
          title: "L'attention devient un revenu national",
          subtitle: "De l'attention aux revenus RIMU et à l'économie créative",
          captions: [
            "RIMU capte l'attention avec des contenus en français, arabe et anglais (langues locales en phase 2).",
            "Cette audience devient live commerce, visites de boutiques et commandes sur « À proximité / Marché ».",
            "Créateurs et institutions vérifiées publient ; publicité, dons et ventes rémunèrent la création locale.",
            "Chaque achat passe par RIMP : prépaiement, paiement à la livraison ou règlement marchand.",
            "Les revenus restent en ouguiyas dans le circuit national et les contenus diffusent vers la sous-région.",
            "Résultat : 30–50 M USD de revenus annuels RIMU en 2031."
          ],
          outcome: { value: "30–50 M USD", label: "de revenus annuels RIMU en 2031 (publicité, dons, commerce)" }
        }
      ],
      matrixRowLabels: ["Capital", "Marchandises", "Paiements", "Données", "Attention"]
    },
    trajectoire: {
      note: "Durées relatives à la source ; le démarrage du calcul est une hypothèse de séquencement (2026-H2), non une date contractuelle.",
      today: "Aujourd'hui",
      trackHint: "Choisissez une trajectoire : les trois se déroulent en parallèle.",
      milestoneLabel: "Jalons",
      deliverablesLabel: "Livrables"
    },
    impact: {
      scenarioLabel: "Scénario ambitieux",
      chartMauTitle: "Utilisateurs actifs : 2027–2031",
      chartRevenueTitle: "Composition des revenus 2031",
      revenueLegend: [
        "Vidéos courtes RIMU 30–50 M USD",
        "Paiement RIMP 90–140 M USD",
        "Centre de calcul IA 30–40 M USD"
      ],
      winLabel: "Trois gagnants",
      mapLabel: "De point de transit à hub de services et de distribution",
      mapLead: "Les acheteurs ouest-africains réduisent leurs déplacements vers l'Asie en s'arrêtant à Nouakchott pour voir, sélectionner et répartir les marchandises chinoises.",
      transformationLabel: "Ce qui change",
      tabs: [
        {
          id: "mauritanie",
          label: "Mauritanie",
          items: [
            "5–8 projets en phase substantielle et 800 M–1,2 Md USD d'intentions d'investissement.",
            "1 000–3 000 personnes formées et 8–15 points de télémédecine dès la première vague.",
            "800 M–2 Md USD/an de biens transitent par le pays ; 8–15 k emplois connexes à moyen terme.",
            "30–40 k emplois directs + écosystème sur cinq ans (créateurs, agents, digitalisation des commerçants).",
            "Comptes numériques adultes : de < 20 % à ≈ 50 % ; subventions et salaires sur circuit traçable."
          ]
        },
        {
          id: "chine",
          label: "Chine",
          items: [
            "Commandes, équipements et EPC pour les six filières, du minier à la santé.",
            "Clusters industriels : quincaillerie, biens du quotidien, textile, électroménager, matériaux, motos.",
            "Financement, assurance-crédit et fonds Chine-Afrique encadrent les opérations.",
            "Coopération de calcul : GPU, inférence, formation d'ingénieurs et maintenance.",
            "Une porte d'entrée vers l'Afrique de l'Ouest depuis un hub stable et souverain."
          ]
        },
        {
          id: "afrique",
          label: "Afrique de l'Ouest",
          items: [
            "Cinq pays desservis depuis Nouakchott : Sénégal, Mali, Guinée, Côte d'Ivoire, Gambie.",
            "Les acheteurs voient et sélectionnent les produits chinois sans traverser l'Asie.",
            "RIMP s'étend progressivement vers le Sénégal, le Mali et les voisins.",
            "Les contenus RIMU en français, arabe et anglais diffusent dans la zone francophone, arabophone et anglophone.",
            "800 M–2 Md USD/an de biens en transit : stockage, douane, transit et paiement restent dans la sous-région."
          ]
        }
      ]
    },
    decision: {
      supportsLabel: "Ce que nous demandons à l'État",
      supportsLead: "Cinq décisions à clarifier en même temps — sans avance budgétaire importante, sans confirmer des montants déjà conclus.",
      risksLabel: "Cinq risques, cinq garanties",
      risksLead: "Aucun projet de cette taille n'est sans risque ; chaque risque a un mécanisme écrit.",
      ctaLabel: "Choisissez votre prochaine étape",
      ctas: [
        { id: "gouvernement", kicker: "État & ministères", title: "Ouvrir le canal", body: "Désigner le ministère chef de file, les correspondants et le site du showroom ; lancer la pré-étude du calcul vert.", button: "Demander une réunion de travail" },
        { id: "investisseurs", kicker: "Partenaires & investisseurs", title: "Entrer dans la première vague", body: "Accéder aux listes de projets et de marchandises, aux besoins de financement et aux règles écrites.", button: "Recevoir le dossier investisseurs" },
        { id: "afrique", kicker: "Afrique de l'Ouest", title: "Voir les produits à Nouakchott", body: "Participer au showroom ou aux semaines d'exposition ; payer et se faire livrer via RIMP et RIMU Shop.", button: "Réserver une visite du showroom" }
      ],
      nextLabel: "Calendrier proposé",
      next: [
        { period: "30 jours", items: ["Ministère chef de file, points de contact et correspondants désignés.", "Périmètre du MVP de la plateforme fixé.", "Première liste des cinq catégories industrielles publiée."] },
        { period: "90 jours", items: ["Termes de référence de 5–8 projets.", "Protocole d'interconnexion RIMP avec la Banque centrale.", "Lancement de la pré-étude de calcul vert."] },
        { period: "6 mois", items: ["Version 1 de la pré-étude de calcul, ligne verte et tarif clarifiés.", "Premiers échantillons, showroom identifié, formations ouvertes."] }
      ],
      contact: {
        title: "Parlons-en",
        body: "Un premier échange suffit pour cadrer le périmètre, les sites et le calendrier. Benjamin LIU, vice-président — ccliuxd@gmail.com · +222 22 66 51 08 · www.aureondigital.mr",
        button: "Demander une réunion"
      },
      disclaimer: "Document de présentation : chiffres en scénario ambitieux, non contractuels ; fourchettes non strictement additives ; coordonnées à confirmer avant publication."
    },
    drawerExtra: {
      "b.projets": {
        apercu: [
          "Le canal officiel regroupe les coopérations sino-mauritaniennes existantes — mines, énergies nouvelles, infrastructures, transformation agro-halieutique — et publie les projets matures comme les besoins de financement.",
          "Elle ne remplace pas les mines et pêcheries : elle ajoute trois canaux maîtrisés par l'État — financement de projets, distribution de biens de consommation vers l'Afrique de l'Ouest, monétisation de l'électricité verte.",
          "Une interface est réservée à la pré-étude du centre de calcul vert : site, électricité, montage et partenaires."
        ],
        fonctionnement: {
          intro: "Du besoin publié au projet bancable, en quatre étapes.",
          steps: [
            { title: "Publier", body: "L'État et les entreprises publient titres miniers, capacités portuaires, sites industriels et besoins de financement." },
            { title: "Qualifier", body: "Due diligence, pièces techniques et financières : le projet devient lisible pour les bailleurs." },
            { title: "Mettre en relation", body: "La partie chinoise répond par commandes, équipements, EPC, financements, cursus ou télémédecine." },
            { title: "Suivre", body: "Jalons, traçabilité et statistiques douanières séparées documentent l'avancement." }
          ]
        }
      },
      "b.commerce-gros": {
        apercu: [
          "La mise en relation des acheteurs ouest-africains et des clusters industriels chinois : listes de marchandises, prix, quantités minimales, délais, demandes de devis et suivi logistique.",
          "Les règles de dédouanement et de règlement sont inscrites dans la plateforme, pour éviter que les petites commandes soient bloquées par les processus des minerais en vrac.",
          "Un guichet unique, des règles écrites : la condition pour que le commerce de gros devienne un flux régulier."
        ],
        fonctionnement: {
          intro: "Un guichet B2B, de la demande de devis à la livraison.",
          steps: [
            { title: "Catalogue & appels d'offres", body: "Prix, quantités minimales, délais et disponibilités par catégorie." },
            { title: "Sourcing", body: "Sélection selon climat, tension électrique, emballage et gamme de prix ouest-africains." },
            { title: "Logistique", body: "Transport, stockage, transit et suivi de statut." },
            { title: "Dédouanement & règlement", body: "Règles publiées et circuits séparés des minerais en vrac." },
            { title: "Showroom", body: "Échantillons, semaines d'exposition et invitations d'acheteurs." }
          ]
        }
      },
      "b.biens-conso": {
        apercu: [
          "Le hub de distribution de biens de consommation chinois vers l'Afrique de l'Ouest : showroom permanent ou semaines d'exposition à Nouakchott ou dans un port désigné.",
          "En ligne, une zone dédiée présente descriptions, prix, quantités minimales, délais, demandes de devis et suivi logistique — connectée aux onglets À proximité et Marché ainsi qu'au live commerce de RIMU.",
          "Le sourcing vise les clusters matures : quincaillerie, biens du quotidien, textile, petit électroménager, matériaux, motos et pièces."
        ],
        fonctionnement: {
          intro: "Deux canaux — physique et en ligne — pour un même acheteur.",
          steps: [
            { title: "Showroom", body: "Location ou aménagement d'un bâtiment existant, invitations aux cinq pays voisins." },
            { title: "Zone en ligne", body: "Descriptions, prix, quantités minimales, devis, commandes et suivi logistique." },
            { title: "Sourcing adapté", body: "Filtres climat, tension, emballage et gamme de prix." },
            { title: "Transit & apurement", body: "Guichets portuaires, zone franche, échantillons en importation temporaire." },
            { title: "Connexion RIMU", body: "Catalogue Marché, live commerce et paiement RIMP." }
          ]
        }
      },
      "b.finance-rimp": {
        apercu: [
          "RIMP est le rail de paiement, interconnecté aux portefeuilles et opérateurs existants, monétisé par les commissions marchands et transfrontalières, la microfinance, les canaux administratifs et le B2B.",
          "Il porte aussi les instruments de financement commercial — lettres de crédit, assurance-crédit — nécessaires aux flux de biens.",
          "Objectif du scénario ambitieux : 2,8 M comptes cumulés et 15–25 Md USD/an de flux en 2031, avec le grand livre conservé sur le territoire."
        ],
        fonctionnement: {
          intro: "Un rail interopérable, du compte du particulier au règlement B2B.",
          steps: [
            { title: "Portefeuille & comptes", body: "KYC, comptes RIMP et objectif de 2,8 M comptes cumulés." },
            { title: "Paiements marchands & QR", body: "Déploiement national des QR commerçants." },
            { title: "Paiements administratifs", body: "Eau, électricité, municipalités et paiements prioritaires." },
            { title: "Transferts transfrontaliers", body: "Extension progressive vers le Sénégal, le Mali et les voisins." },
            { title: "Microfinance & crédit", body: "Scoring sur les données de paiement, produits de crédit en pilote." },
            { title: "Interopérabilité", body: "Calendrier d'interconnexion obligatoire de la Banque centrale ; subventions et salaires versés en priorité sur ces rails." }
          ]
        }
      },
      "b.formation": {
        apercu: [
          "Transformer les formations professionnelles, les conseils de santé publique, les techniques agricoles et pastorales et les informations gouvernementales en vidéos courtes accessibles.",
          "RIMU Jobs et les formations courtes relient chaque compétence à une offre d'emploi ; la première vague vise 1 000–3 000 personnes formées.",
          "Le vivier alimente le calcul, les mines, la pêche, la santé et l'administration — dont les classes commandées et les apprentis locaux."
        ],
        fonctionnement: {
          intro: "De la vidéo courte au poste de travail.",
          steps: [
            { title: "Vidéos de formation", body: "Compétences techniques, agriculture, élevage, santé publique et informations publiques." },
            { title: "RIMU Jobs", body: "Offres d'emploi, formations courtes et mise en relation employeurs." },
            { title: "Cursus & partenariats", body: "Cours, enseignants et télémédecine avec les partenaires chinois." },
            { title: "Classes commandées", body: "Filières dédiées au calcul, aux mines, à la pêche et à l'administration." },
            { title: "Certification", body: "Reconnaissance des compétences et lien avec les employeurs." }
          ]
        }
      },
      "b.sante": {
        apercu: [
          "8–15 points de télémédecine en première vague, appuyés par les capacités chinoises et par l'IA : support aux consultations à distance, alertes sanitaires et météo.",
          "Les contenus de santé publique certifiés sont diffusés par RIMU en français, arabe et anglais, pour toucher les zones éloignées.",
          "Les données de santé restent sur le territoire ; l'IA aide la transcription et le tri, sans déplacer le dossier."
        ],
        fonctionnement: {
          intro: "Un spécialiste à distance, une prévention dans chaque poche.",
          steps: [
            { title: "Points de télémédecine", body: "Équipement et connectivité de 8–15 points en première vague." },
            { title: "Consultations à distance", body: "Mise en relation avec des médecins chinois et mauritaniens, transcription assistée." },
            { title: "Contenus de santé publique", body: "Prévention, maternité et nutrition en vidéos courtes certifiées." },
            { title: "Alertes sanitaires & météo", body: "Tempêtes de sable, épidémies et phénomènes extrêmes." },
            { title: "Formation médicale continue", body: "Modules courts pour les soignants des zones éloignées." }
          ]
        }
      },
      "p.plateforme": {
        apercu: [
          "Le point d'entrée bilatéral est le canal officiel unique : les deux États, les entreprises et les bailleurs y publient projets, marchandises, besoins de financement et capacités.",
          "Trois canaux maîtrisés par l'État : financement de projets, distribution de biens de consommation vers l'Afrique de l'Ouest, monétisation de l'électricité verte.",
          "Le périmètre couvre les coopérations existantes — mines, énergies nouvelles, infrastructures, agro-halieutique, commerce, finance, formation, santé."
        ],
        fonctionnement: {
          intro: "Trois étapes menées en parallèle, puis l'exploitation continue.",
          steps: [
            { title: "Lancement officiel", body: "L'État désigne un ministère chef de file et un point de contact de chaque côté ; les acteurs publient leurs offres." },
            { title: "Mise en correspondance", body: "La Mauritanie fournit titres miniers, ports, terrains, hôpitaux et lieux de formation ; la Chine répond par commandes, équipements, EPC et financements." },
            { title: "Six catégories en parallèle", body: "Projets, commerce de gros, biens de consommation, finance, formation et santé avancent ensemble." },
            { title: "Pré-étude du calcul vert", body: "Sélection de site, schéma électrique et montage du centre de calcul." },
            { title: "Interfaces réservées", body: "Emplacements prévus pour le hub de biens de consommation et la pré-étude du calcul." }
          ]
        }
      },
      "p.rimu": {
        apercu: [
          "RIMU n'est pas une localisation de TikTok : c'est le point d'entrée du système d'exploitation de la vie quotidienne — contenus, biens, emplois et services publics.",
          "Quatre onglets, huit modules, trois langues au lancement (français, arabe, anglais), faible bande passante : la différence se joue sur les langues locales (phase 2), la protection des mineurs et la monétisation des créateurs en ouguiyas.",
          "Les règles de vérification, de modération et de recommandation restent sous contrôle mauritanien, sans censure arbitraire."
        ],
        fonctionnement: {
          intro: "Un produit, quatre onglets, huit modules et une gouvernance.",
          steps: [
            { title: "Contenus & recommandation", body: "For You, abonnements, vidéos courtes de 15–60 s, vidéos de trois minutes et notes texte-image." },
            { title: "Modules du quotidien", body: "À proximité, Marché, Jobs, comptes vérifiés administratifs." },
            { title: "Live & commerce", body: "Mariages, marchés, débarquements de pêche, conférences certifiées et live commerce." },
            { title: "Paiement RIMP", body: "Prépaiement ou paiement à la livraison, encaissement des créateurs en ouguiyas." },
            { title: "Gouvernance", body: "Pré-modération par modèle, mots-clés ou empreinte vocale, contrôle humain et réponse rapide aux signalements." }
          ]
        }
      },
      "p.calcul": {
        apercu: [
          "Le centre national de calcul IA est le socle qui garde les données, les modèles et la modération sur le territoire national.",
          "Extension du centre Tier III de Nouakchott : cluster GPU, nœuds edge et priorité à l'électricité verte, avec une capacité nouvelle et une ligne dédiée.",
          "Trois phases : inférence et modération (≈ 1 MW, ≈ 100 cartes, ≈ 18 mois), puis séparation entraînement / inférence (2–3 MW, ≈ 36 mois), puis extension modulaire liée à un contrat d'électricité verte."
        ],
        fonctionnement: {
          intro: "Trois phases, une même règle : l'inférence reste au pays.",
          steps: [
            { title: "Phase 1 — inférence", body: "Modération et contrôle des risques des deux plateformes ; ≈ 100 cartes pour ≈ 1 MW." },
            { title: "Phase 2 — entraînement / inférence", body: "Séparation des charges, 2–3 MW, ouverture éventuelle d'interfaces régionales ouest-africaines." },
            { title: "Phase 3 — extension modulaire", body: "Extension liée à un contrat d'électricité verte et à un accord national sur l'électricité." },
            { title: "Énergie & refroidissement", body: "2N + diesel + photovoltaïque + batteries ; capacité nouvelle et ligne dédiée, sans empiéter sur la consommation résidentielle." },
            { title: "Données & modèles", body: "Grand livre et modèles centraux locaux ; entraînement possiblement hybride, inférence rapatriée." }
          ]
        }
      }
    },
    methodo: {
      title: "Méthodologie",
      intro: "Tous les chiffres de ce site viennent d'un document de référence (novembre 2026) ou d'un calcul explicite. Trois étiquettes : Source, Dérivé, Hypothèse.",
      qaTitle: "Points de vigilance",
      note: "Scénario ambitieux, non une prévision officielle. Les fourchettes ne sont pas strictement additives ; les badges ouvrent la fiche de chaque valeur.",
      qa: [
        { code: "QA-1", title: "Flux de paiement et revenus RIMP", decision: "Afficher 15–25 Md USD/an, type Dérivé, avec un taux de commission de 0,5–0,7 % ; ne pas reprendre l'expression « centaines de milliards »." },
        { code: "QA-2", title: "2,8 M comptes et population adulte", decision: "2,8 M = comptes cumulés, multi-comptes inclus ; l'indicateur « ≈ 50 % des adultes » reste séparé." },
        { code: "QA-3", title: "Trois chiffres d'emploi", decision: "Trois couches étiquetées — vague 1, connexes moyen-long terme, cumul cinq ans — et jamais additionnées." },
        { code: "QA-4", title: "60 %+ des internautes et MAU", decision: "Afficher « ≈ 60 % des internautes de 2031 » ; la base ≈ 4,2 M reste dans la méthodologie, marquée Dérivé." },
        { code: "QA-5", title: "Deux « phase 1 » du calcul", decision: "Distinguer la charge informatique (≈ 1 MW, ≈ 100 cartes) du programme d'électricité verte 20–50 MW, horizon post-phase 1." },
        { code: "QA-6", title: "Somme des revenus et total", decision: "Total 150–220 M USD ; fourchettes par composante ; le donut utilise les milieux 40 / 115 / 35 M USD, sans additionner les bornes." },
        { code: "QA-7", title: "Revenus calcul 2031 et long terme", decision: "2031 : 30–40 M USD uniquement ; « plusieurs dizaines à ~100 M USD/an » est un potentiel long terme non daté, hors total." }
      ],
      close: "Chaque chiffre du site s'ouvre sur sa fiche : type, formule, source. Aucune valeur n'est affichée sans étiquette."
    },
    pitch: {
      title: "Visite guidée — 3 minutes",
      subtitle: "Sept étapes pour comprendre la plateforme, le système et la décision demandée.",
      scenes: [
        { id: "scene.hero", chapterId: "ch-hero", title: "Une plateforme, trois souverainetés", caption: "Deux pays, un canal officiel : plateforme bilatérale, super-application RIMU, centre de calcul IA." },
        { id: "scene.pourquoi", chapterId: "ch-pourquoi", title: "Quatre blocages", caption: "Attention exportée, cash hors circuit, données à l'étranger, mono-export : le statu quo coûte." },
        { id: "scene.systeme", chapterId: "ch-systeme", title: "Un système, pas une somme de projets", caption: "Trois piliers, six filières, quatre couches : chaque nœud s'ouvre sur sa fiche." },
        { id: "scene.rimu", chapterId: "ch-rimu", title: "RIMU, le quotidien", caption: "Contenus, biens, emplois, services publics : huit modules, trois langues au lancement, faible bande passante." },
        { id: "scene.ia", chapterId: "ch-ia", title: "Le socle souverain", caption: "Quatre couches, trois phases de calcul : données et modèles restent au pays." },
        { id: "scene.impact", chapterId: "ch-impact", title: "2031 en chiffres", caption: "2,5 M d'utilisateurs actifs mensuels, 150–220 M USD de revenus, 30–40 k emplois : scénario ambitieux, chiffres étiquetés." },
        { id: "scene.decision", chapterId: "ch-decision", title: "Ouvrir le canal", caption: "Cinq décisions à clarifier en même temps ; 30 jours pour nommer, 90 jours pour publier." }
      ],
      controls: {
        start: "Démarrer la visite",
        pause: "Pause",
        resume: "Reprendre",
        next: "Suivant",
        prev: "Précédent",
        exit: "Quitter",
        skip: "Passer la visite"
      }
    },
    presenter: {
      hint: "Mode présentateur : ← / → changer de chapitre · B noir · Échap quitter",
      timer: "Minuteur",
      exit: "Quitter",
      black: "Noir"
    },
    media: {
      kicker: "LE FILM & LA DÉMO",
      title: "La plateforme, en mouvement",
      lead: "Trois minutes pour voir le système en action. Une démo interactive pour l'explorer.",
      videoCta: "Voir le film · 3 min 48",
      demoCta: "Ouvrir la démo",
      note: "Démo hébergée sur v0.app · s'ouvre dans un nouvel onglet.",
      filmLabel: "Film de présentation",
      duration: "3 min 48",
      videoTitle: "Le film de la plateforme",
      videoCaption: "Une introduction filmée à la coopération numérique sino-mauritanienne.",
      demoTitle: "Démo interactive",
      demoNote: "Aperçu hébergé sur v0.app. Si l'aperçu est bloqué, ouvrez la démo dans un nouvel onglet.",
      demoOpen: "Ouvrir dans un nouvel onglet"
    },
    footer: {
      sources: "Données : Source / Dérivé / Hypothèse — voir la méthodologie. Document de référence : novembre 2026.",
      version: "Version 1.0 · 2026-11-09 · Dernière mise à jour : 2026-11-09",
      legal: "© 2026 AUREON DIGITAL SARL — Nouakchott, Mauritanie. Document de présentation : scénario ambitieux, non contractuel. Coordonnées à confirmer avant publication.",
      contactTitle: "Contact",
      navTitle: "Sommaire"
    }
  },
  zh: {
    ui: {
      langLabel: "法语 / 中文",
      langAria: "切换语言：法语或中文",
      modeSynthese: "摘要",
      modeComplet: "完整",
      modeAria: "详细程度：摘要或完整",
      pitch: "3 分钟引导",
      present: "演示模式",
      pdf: "方案册 PDF",
      close: "关闭",
      next: "下一步",
      prev: "上一步",
      pause: "暂停",
      resume: "继续",
      exit: "退出",
      skip: "跳过",
      chapter: "章节",
      of: "/",
      methodology: "方法学",
      scenario: "雄心情景",
      updated: "最近更新",
      source: "来源",
      derived: "派生",
      hypothesis: "假设",
      openFiche: "了解更多",
      seeConnections: "查看关联",
      seeRoadmap: "路线图",
      tabs: {
        apercu: "概览",
        fonctionnement: "运作方式",
        chiffres: "关键数据",
        acteurs: "参与方与流",
        roadmap: "路线图",
        risques: "风险"
      },
      flows: {
        capital: "资本",
        marchandises: "货物",
        paiements: "支付",
        donnees: "数据",
        attention: "注意力"
      },
      in: "流入",
      out: "流出",
      stage: {
        mature: "成熟",
        pilote: "试点",
        preEtude: "预研"
      },
      graph: "关系图",
      matrix: "矩阵",
      all: "全部",
      reset: "重置",
      isolate: "聚焦",
      replay: "重播",
      pauseStory: "暂停",
      playStory: "播放故事",
      tourStart: "开始引导",
      tourDone: "引导结束",
      tourRestart: "重看引导",
      presenterHint: "演讲者模式：← / → 切换章节 · B 黑屏 · Esc 退出",
      timer: "计时",
      menu: "目录",
      top: "顶部",
      share: "分享",
      copied: "链接已复制",
      view: "视图",
      pages: "页",
      sourceDoc: "参考文件",
      backToTop: "回到顶部",
      closeModal: "关闭窗口",
      print: "打印",
      footerNav: "页脚目录"
    },
    brand: {
      name: "合作平台",
      sub: "RIMU · RIMP · IA",
      signature: "AUREON DIGITAL · 数字主权建设者",
      tagline: "一个平台，三重主权。"
    },
    hero: {
      kicker: "努瓦克肖特 · 2026–2031 · 中国—毛里塔尼亚",
      title1: "一个平台",
      title2: "三重主权",
      lead: "两国共同的官方入口：项目、批发、金融、培训与卫生，连接一个国民级超级应用与一个主权 AI 算力底座。",
      subline: "从努瓦克肖特连接中国与西非。",
      ctaPitch: "3 分钟引导参观",
      ctaExplore: "探索整个系统",
      ctaPdf: "阅读方案册（PDF）",
      ctaCinema: "沉浸版",
      scroll: "向下滚动 —— 9 章",
      kpis: [
        { id: "kpi.mau_2031", label: "月活用户 · 2031" },
        { id: "kpi.revenue_total_2031", label: "年收入 · 2031" },
        { id: "kpi.wallets_2031", label: "RIMP 钱包" },
        { id: "kpi.jobs_5y", label: "直接与生态就业 · 5 年" }
      ],
      pillars: [
        { id: "p.plateforme", label: "双边合作入口", note: "唯一官方渠道" },
        { id: "p.rimu", label: "RIMU 超级应用", note: "日常使用" },
        { id: "p.calcul", label: "国家 AI 算力中心", note: "数据主权" }
      ],
      network: {
        china: "中国",
        mauritania: "毛里塔尼亚",
        hub: "努瓦克肖特",
        westAfrica: "西非"
      }
    },
    chapters: {
      hero: {
        kicker: "00 · 开篇",
        title: "连接两个大陆的一个平台",
        lead: "两个国家、一个官方渠道、一个超级应用、一个主权算力底座。"
      },
      pourquoi: {
        kicker: "01 · 现状",
        title: "今天，卡在哪里",
        lead: "四道结构性堵点——而答案不是再做一网站。",
        transition: "答案不是再做一个网站，而是一套系统：一个双边入口、一个超级应用、一个算力底座。"
      },
      systeme: {
        kicker: "02 · 系统",
        title: "一套系统，而非项目拼盘",
        lead: "三支柱、六业务线、四层架构。点击任一节点打开详情，关联流即时高亮。",
        pillarsLabel: "三大支柱",
        businessesLabel: "六条业务线",
        layersLabel: "四层架构",
        hint: "点击任一节点打开详情；关联流即时高亮。"
      },
      rimu: {
        kicker: "03 · RIMU",
        title: "RIMU：日常生活的操作系统",
        lead: "不是本地化的 TikTok：内容、商品、就业与公共服务，首批支持法语、阿拉伯语与英语（本地语言二期），低带宽、毛里塔尼亚规则。",
        modulesLabel: "八个模块，一个应用",
        dayLabel: "与 RIMU 的一天",
        dayHint: "七个时刻：点击一个时间点，手机屏幕随之切换。"
      },
      ia: {
        kicker: "04 · 内容 AI 与算力",
        title: "底座：内容 AI 与主权算力",
        lead: "四层、三期、一条铁律：数据与模型留在本国。",
        groupsLabel: "三类用途",
        phasesLabel: "三期部署"
      },
      flux: {
        kicker: "05 · 五类流",
        title: "五类流，同一个回路",
        lead: "资本、货物、支付、数据、注意力：三段约二十秒的故事，讲清系统如何运转。",
        legendLabel: "五类流",
        hint: "点击故事跟走回路；点击节点打开详情。"
      },
      trajectoire: {
        kicker: "06 · 轨迹",
        title: "2026–2031：三条轨迹，同一张日历",
        lead: "双边平台三步、RIMU 五年、算力三期——三条并行推进。",
        note: "时长取自源文件；算力启动时间为排期假设（2026 下半年），非合同日期。"
      },
      impact: {
        kicker: "07 · 影响",
        title: "2031：这意味着什么",
        lead: "雄心情景——每个数字标注来源、派生或假设；每个数值都可打开算法。",
        chartMauTitle: "活跃用户：2027–2031 曲线",
        chartRevenueTitle: "2031 年收入构成",
        winLabel: "三方共赢",
        mapLabel: "从过境点到服务与分拨枢纽",
        mapLead: "西非买家在努瓦克肖特看货、选货并分拨中国商品，不必远赴亚洲。",
        transformationLabel: "改变了什么"
      },
      decision: {
        kicker: "08 · 决策",
        title: "五项决定，打开通道",
        lead: "无需大额预算垫付，也无需预先确认已谈成的金额：五个要点需同步明确。",
        supportsLabel: "我们对国家的请求",
        supportsLead: "五项并行明确的决定——是机制，不是承诺。",
        risksLabel: "五类风险，五项保障",
        risksLead: "每个风险都有书面机制，而不是口头承诺。",
        ctaLabel: "选择您的下一步",
        nextLabel: "建议时间表",
        disclaimer: "本页为方案说明文件：数字为雄心情景，非合同承诺；区间不可严格相加。详见方法学。"
      }
    },
    problems: [
      {
        id: "attention",
        title: "注意力在出口",
        body: "外国平台拿走年轻人的屏幕时间；推荐规则与内容语言都不在本国手里。",
        change: "由本国平台主导推荐、语言与认证内容。",
        link: "#ch-rimu"
      },
      {
        id: "argent",
        title: "钱在账外循环",
        body: "不到 20% 的成年人拥有数字账户；现金经济难以审计。",
        change: "2031 年成年人数字账户达约 50%；补贴与工资走可追溯回路。",
        link: "#ch-systeme"
      },
      {
        id: "donnees",
        title: "数据留在别处",
        body: "数据、模型与审核托管在境外：模型权重与推荐都不受控。",
        change: "数据、密钥与模型权重留在本国领土。",
        link: "#ch-ia"
      },
      {
        id: "mono-export",
        title: "单一出口经济",
        body: "原矿与未加工渔获撑起收入；4.5% 的增长系于一个价格。",
        change: "加工、可追溯、西非枢纽与可出口的数字服务。",
        link: "#ch-impact"
      }
    ],
    rimu: {
      modulesLabel: "八个模块，一个应用",
      modules: [
        { id: "rimu.live", title: "直播", body: "婚礼、集市、渔获上岸、认证宗教讲座与直播带货。" },
        { id: "rimu.studio", title: "创作者工作室", body: "本地音乐版权库、模板、自动转写与字幕（法/阿/英；哈桑尼亚与本地语言二期）。" },
        { id: "rimu.creation", title: "创作者经济", body: "广告、直播打赏与电商：以乌吉亚计的收入留在本国回路。" },
        { id: "rimu.shop", title: "商店 + RIMP", body: "目录、下单、货到付款或经 RIMP 预付。" },
        { id: "rimu.jobs", title: "就业与培训", body: "职位、技能短训与职业培训内容。" },
        { id: "rimu.verifie", title: "认证政务号", body: "教育、卫生、市政缴费、天气与沙尘暴预警。" },
        { id: "rimu.mineurs", title: "未成年人保护", body: "默认关闭个性化推荐、无限滚动、直播打赏与陌生人私信。" },
        { id: "rimu.souverainete", title: "内容主权", body: "验证、审核与推荐由毛里塔尼亚掌控；透明优先与举报机制。" }
      ],
      dayLabel: "与 RIMU 的一天",
      dayHint: "七个时刻：点击一个时间点，手机屏幕随之切换。",
      day: [
        { time: "07:00", title: "清晨的信息流", body: "短视频、资讯与天气预警：每条 15–60 秒，默认 360p/480p，夜间预缓存。", screen: "feed" },
        { time: "09:00", title: "集市与渔获上岸", body: "附近：集市、渔获上岸、市政服务与当日价格，以法语、阿拉伯语与英语呈现。", screen: "proximite" },
        { time: "12:00", title: "集市里的直播", body: "摊主直播自家摊位，回答问题并当场通过 RIMP 收款。", screen: "live" },
        { time: "14:00", title: "一节短训", body: "RIMU 就业与培训：一项实用技能、一段 3 分钟视频、一张证书。", screen: "jobs" },
        { time: "17:00", title: "一次远程会诊", body: "远程医疗点连线专科医生；AI 负责转写并准备病历。", screen: "sante" },
        { time: "19:00", title: "水电与集市账单", body: "认证账号与 RIMU 商店：账单、购物与配送以乌吉亚通过 RIMP 支付。", screen: "marche" },
        { time: "21:00", title: "创作者入账", body: "打赏、销售与佣金以乌吉亚到账；资金留在本国回路。", screen: "shop" }
      ],
      trust: [
        { title: "未成年人保护 —— 默认生效", body: "个性化推荐、无限滚动、直播打赏与陌生人私信默认关闭。" },
        { title: "内容主权 —— 毛里塔尼亚规则", body: "验证、审核与推荐由本国掌控；优先透明与举报机制，无任意审查。" },
        { title: "创作者经济 —— 乌吉亚收入", body: "广告、打赏与电商：收入留在本国回路。" }
      ]
    },
    ia: {
      groupsLabel: "三类用途",
      groups: [
        {
          id: "ai.content",
          title: "RIMU 内容生产",
          items: [
            "自动字幕与语音转写。",
            "多语翻译：阿拉伯语、法语、英语。",
            "辅助制作培训、技术技能与认证宗教内容视频。",
            "模型预审后人工复核，关键词或声纹辅助。"
          ]
        },
        {
          id: "ai.quotidien",
          title: "日常服务",
          items: [
            "支持远程医疗会诊。",
            "沙尘暴提前预警；水电缴费提醒。",
            "鱼价与农产品价格信息视频。",
            "以短小视频普及健康预防与公共信息。"
          ]
        },
        {
          id: "ai.pro",
          title: "行业与行政用途",
          items: [
            "矿山与港口设备维护提醒；渔获上岸登记。",
            "帮助商户收单与信用评估。",
            "政府信息自动推送。"
          ]
        }
      ],
      phasesLabel: "三期部署",
      phases: [
        { id: "calcul.phase1", title: "一期 —— 推理与审核", body: "优先推理；两个平台的审核与风险控制服务。", value: "约 18 个月 · 约 100 张加速卡 · 约 1 兆瓦" },
        { id: "calcul.phase2", title: "二期 —— 训练/推理分离", body: "训练与推理分离；视情况开放西非区域推理接口。", value: "约 36 个月 · 2–3 兆瓦" },
        { id: "calcul.phase3", title: "三期 —— 模块化扩建", body: "扩建绑定绿电合同与国家电力协议。", value: "绿电合同 · 国家电力协议" }
      ],
      sovereignty: {
        title: "一条铁律：数据与模型留在本国",
        body: "账本与核心模型本地；训练可混合，推理回流本国。供电为 2N + 柴油 + 光伏 + 电池，新增容量与专线，不挤占居民用电。"
      }
    },
    flux: {
      legendLabel: "五类流",
      storyLabel: "三段故事，每段约二十秒",
      hint: "点击故事跟走回路；点击节点打开详情。颜色区分五类流。",
      matrixHint: "矩阵版——同样的信息，无动画，面向低带宽。",
      stories: [
        {
          id: "capital",
          title: "资本打开通路",
          subtitle: "从融资到项目，再到就业",
          captions: [
            "平台公布既有合作与融资需求。",
            "中国与国际投资方找到可追溯、可融资的项目。",
            "投资意向变成文件，再变成工地。",
            "矿业、新能源、基础设施、农渔加工：六条线并行。",
            "项目与培训反过来供给算力底座。",
            "结果：5–8 个项目进入实质阶段，8–12 亿美元投资意向。"
          ],
          outcome: { value: "8–12 亿美元", label: "投资意向，对应 5–8 个项目进入实质阶段" }
        },
        {
          id: "marchandises",
          title: "货物在此停留并分拨",
          subtitle: "从中国产业集群到努瓦克肖特，再到五国",
          captions: [
            "中国产业集群备好五金、纺织、家电、建材与摩托。",
            "展贸中心与线上专区向西非买家展示产品。",
            "货物经港口入境，在努瓦克肖特仓储并分拨。",
            "清关、过境与结算规则写入平台，与大宗矿石流程分离。",
            "塞内加尔、马里、几内亚、科特迪瓦与冈比亚前来采购。",
            "结果：每年 8–20 亿美元货物经毛里塔尼亚流转。"
          ],
          outcome: { value: "8–20 亿美元/年", label: "货物经毛里塔尼亚流向西非" }
        },
        {
          id: "attention",
          title: "注意力变成国家收入",
          subtitle: "从注意力到 RIMU 收入与创作者经济",
          captions: [
            "RIMU 以法语、阿拉伯语与英语内容吸引年轻人（本地语言二期覆盖）。",
            "受众转化为直播带货、到店与「附近 / 市场」下单。",
            "创作者与认证机构持续发布；广告、打赏与成交让本地创作获得收入。",
            "每笔交易走 RIMP：预付、货到付款或商户收款。",
            "收入以乌吉亚留在本国回路，内容向次区域扩散。",
            "结果：2031 年 RIMU 年收入 0.3–0.5 亿美元。"
          ],
          outcome: { value: "0.3–0.5 亿美元", label: "2031 年 RIMU 年收入（广告、打赏、电商）" }
        }
      ],
      matrixRowLabels: ["资本", "货物", "支付", "数据", "注意力"]
    },
    trajectoire: {
      note: "时长取自源文件；算力启动时间为排期假设（2026 下半年），非合同日期。",
      today: "今天",
      trackHint: "选择一条轨迹：三条同时推进。",
      milestoneLabel: "里程碑",
      deliverablesLabel: "交付物"
    },
    impact: {
      scenarioLabel: "雄心情景",
      chartMauTitle: "活跃用户：2027–2031",
      chartRevenueTitle: "2031 年收入构成",
      revenueLegend: [
        "RIMU 短视频 0.3–0.5 亿美元",
        "RIMP 支付 0.9–1.4 亿美元",
        "AI 算力中心 0.3–0.4 亿美元"
      ],
      winLabel: "三方共赢",
      mapLabel: "从过境点到服务与分拨枢纽",
      mapLead: "西非买家不再远赴亚洲：在努瓦克肖特看货、选货并分拨中国商品。",
      transformationLabel: "改变了什么",
      tabs: [
        {
          id: "mauritanie",
          label: "毛里塔尼亚",
          items: [
            "5–8 个项目进入实质阶段，8–12 亿美元投资意向。",
            "首波培训 1000–3000 人，开设 8–15 个远程医疗点。",
            "每年 8–20 亿美元货物经本国流转；中期 0.8–1.5 万关联就业。",
            "五年 3–4 万直接 + 生态就业（创作者、代理点、商户数字化岗位）。",
            "成年人数字账户从 < 20% 到约 50%；补贴与工资走可追溯回路。"
          ]
        },
        {
          id: "chine",
          label: "中国",
          items: [
            "六条业务线的订单、设备与 EPC，从矿业到卫生。",
            "产业集群：五金、日用品、纺织、小家电、建材、摩托及配件。",
            "融资、信用保险与中非基金为交易提供支撑。",
            "算力合作：GPU、推理、工程师培养与运维。",
            "以稳定、主权的枢纽进入西非市场。"
          ]
        },
        {
          id: "afrique",
          label: "西非",
          items: [
            "从努瓦克肖特服务五国：塞内加尔、马里、几内亚、科特迪瓦、冈比亚。",
            "买家不必远赴亚洲即可看货与选货。",
            "RIMP 逐步扩展到塞内加尔、马里及邻国。",
            "RIMU 的法语、阿语与英语内容自然扩散到法语区、阿语区与英语区。",
            "每年 8–20 亿美元货物过境：仓储、关税、过境与支付留在次区域。"
          ]
        }
      ]
    },
    decision: {
      supportsLabel: "我们对国家的请求",
      supportsLead: "五项需同步明确的决定——无需大额预算垫付，也无需预先确认已谈成的金额。",
      risksLabel: "五类风险，五项保障",
      risksLead: "这个体量的项目不可能没有风险；每个风险都有书面机制。",
      ctaLabel: "选择您的下一步",
      ctas: [
        { id: "gouvernement", kicker: "国家与部委", title: "打开通道", body: "指定牵头部委、对接人与展贸场地；启动绿电算力预研。", button: "预约工作会议" },
        { id: "investisseurs", kicker: "合作伙伴与投资方", title: "进入第一波", body: "获取项目与商品清单、融资需求与成文规则。", button: "获取投资方方案册" },
        { id: "afrique", kicker: "西非", title: "到努瓦克肖特看货", body: "参加展贸中心或展贸周；通过 RIMP 与 RIMU 商店付款收货。", button: "预约展贸参观" }
      ],
      nextLabel: "建议时间表",
      next: [
        { period: "30 天", items: ["指定牵头部委、联络人与对接人。", "确定平台 MVP 范围。", "发布五类产业首份清单。"] },
        { period: "90 天", items: ["5–8 个项目工作说明书。", "与央行敲定 RIMP 互操作协议。", "启动绿电算力预研。"] },
        { period: "6 个月", items: ["算力预研第一版，绿电专线与电价明确。", "首批样品、展贸场地确定、培训开班。"] }
      ],
      contact: {
        title: "聊一聊",
        body: "一次初步沟通即可明确范围、场地与时间表。Benjamin LIU，副总裁 —— ccliuxd@gmail.com · +222 22 66 51 08 · www.aureondigital.mr",
        button: "预约会议"
      },
      disclaimer: "本页为方案说明：数字为雄心情景，非合同承诺；区间不可严格相加；联系方式上线前需确认。"
    },
    drawerExtra: {
      "b.projets": {
        apercu: [
          "官方渠道汇聚中毛既有合作——矿业、新能源、基础设施、农渔加工——并发布成熟项目与融资需求。",
          "它不取代矿山与渔场，而是新增三个国家掌握的渠道：项目融资、面向西非的消费品分销、绿电变现。",
          "一个接口留给绿电算力预研：选址、电力、架构与合作伙伴。"
        ],
        fonctionnement: {
          intro: "从发布需求到可融资项目，四步。",
          steps: [
            { title: "发布", body: "政府与企业发布矿权、港口产能、工业用地与融资需求。" },
            { title: "合格化", body: "尽职调查与技术、财务材料：项目对出资方变得可读。" },
            { title: "对接", body: "中方以订单、设备、EPC、融资、课程或远程医疗回应。" },
            { title: "跟踪", body: "里程碑、可追溯性与单列海关统计记录进展。" }
          ]
        }
      },
      "b.commerce-gros": {
        apercu: [
          "连接西非买家与中国产业集群：商品清单、价格、起订量、交期、询价与物流跟踪。",
          "清关与结算规则写入平台，避免小额订单被大宗矿石流程阻塞。",
          "一个窗口、一套成文规则：这是批发贸易成为稳定流量的前提。"
        ],
        fonctionnement: {
          intro: "一个 B2B 窗口，从询价到交付。",
          steps: [
            { title: "目录与询价", body: "按品类的价格、起订量、交期与库存。" },
            { title: "采购", body: "按西非气候、电压、包装与价格带筛选货源。" },
            { title: "物流", body: "运输、仓储、转运与状态跟踪。" },
            { title: "清关与结算", body: "规则公开，流程与大宗矿石分离。" },
            { title: "展贸中心", body: "样品、展贸周与买家邀请。" }
          ]
        }
      },
      "b.biens-conso": {
        apercu: [
          "面向西非的中国消费品分拨枢纽：努瓦克肖特或指定港口的常设展贸中心或展贸周。",
          "线上专区提供描述、价格、起订量、交期、询价与物流跟踪，并与附近、市场及直播带货打通。",
          "采购瞄准成熟产业集群：五金、日用品、纺织、小家电、建材、摩托及配件。"
        ],
        fonctionnement: {
          intro: "线上与线下两条渠道，服务同一买家。",
          steps: [
            { title: "展贸中心", body: "租赁或改造既有建筑，邀请五国买家。" },
            { title: "线上专区", body: "描述、价格、起订量、询价、下单与物流跟踪。" },
            { title: "适配采购", body: "按气候、电压、包装与价格带筛选。" },
            { title: "过境与核销", body: "港口窗口、自由区、样品临时进口核销。" },
            { title: "连接 RIMU", body: "市场目录、直播带货与 RIMP 支付。" }
          ]
        }
      },
      "b.finance-rimp": {
        apercu: [
          "RIMP 是与既有钱包和运营商互操作的支付轨道，通过商户与跨境佣金、微贷、行政渠道与 B2B 变现。",
          "它同时承载商品流所需的贸易融资工具——信用证、信用保险。",
          "雄心情景目标：280 万累计账户、150–250 亿美元/年流量（2031），账本留在本国。"
        ],
        fonctionnement: {
          intro: "一条互操作轨道，从个人账户到 B2B 结算。",
          steps: [
            { title: "钱包与账户", body: "KYC、RIMP 账户与 280 万累计账户目标。" },
            { title: "商户收款与 QR", body: "全国商户 QR 部署。" },
            { title: "行政缴费", body: "水、电、市政与优先缴费。" },
            { title: "跨境汇款", body: "逐步扩展到塞内加尔、马里及邻国。" },
            { title: "微贷与信贷", body: "基于支付数据的评分，信贷产品试点。" },
            { title: "互操作", body: "央行强制互操作时间表；国家补贴与工资优先走这些轨道。" }
          ]
        }
      },
      "b.formation": {
        apercu: [
          "把职业培训、公共卫生建议、农牧技术与政府信息转成可访问的短视频。",
          "RIMU 就业与短训把每项技能接到就业机会；首波目标 1000–3000 人受训。",
          "人才池反哺算力、矿业、渔业、卫生与行政——包括大学定向班与本地学徒。"
        ],
        fonctionnement: {
          intro: "从一条短视频到一份工作。",
          steps: [
            { title: "培训视频", body: "技术技能、农业、畜牧、公共卫生与公共信息。" },
            { title: "RIMU 就业", body: "职位、短训与雇主对接。" },
            { title: "课程与合作", body: "与中方伙伴对接课程、师资与远程医疗培训。" },
            { title: "定向班", body: "面向算力、矿业、渔业与行政的专门培养。" },
            { title: "认证", body: "技能认可与雇主对接。" }
          ]
        }
      },
      "b.sante": {
        apercu: [
          "首批开设 8–15 个远程医疗点，依托中方能力与 AI：支持远程会诊、卫生与气象预警。",
          "认证公共卫生内容通过 RIMU 传播，覆盖法语、阿拉伯语与英语，触达偏远地区。",
          "健康数据留在本国；AI 辅助转写与分诊，不迁移病历。"
        ],
        fonctionnement: {
          intro: "专家远程可达，预防装进每个人的口袋。",
          steps: [
            { title: "远程医疗点", body: "首波 8–15 个点的设备与网络。" },
            { title: "远程会诊", body: "对接中毛医生，AI 辅助转写。" },
            { title: "公共卫生内容", body: "预防、母婴与营养的认证短视频。" },
            { title: "卫生与气象预警", body: "沙尘暴、疫情与极端天气。" },
            { title: "继续医学教育", body: "面向偏远地区医护的短训模块。" }
          ]
        }
      },
      "p.plateforme": {
        apercu: [
          "双边入口是唯一官方渠道：两国政府、企业与出资方在此发布项目、商品、融资需求与产能。",
          "国家掌握的三个渠道：项目融资、面向西非的消费品分销、绿电变现。",
          "范围覆盖既有合作——矿业、新能源、基础设施、农渔加工、贸易、金融、培训、卫生。"
        ],
        fonctionnement: {
          intro: "三步并行，随后持续运营。",
          steps: [
            { title: "正式启动", body: "国家指定牵头部委与双方联络人；各方发布供给。" },
            { title: "资源匹配", body: "毛方提供矿权、港口、土地、医院与培训场所；中方对接订单、设备、EPC 与融资。" },
            { title: "六类并行", body: "项目、批发、消费品、金融、培训与卫生同步推进。" },
            { title: "绿电算力预研", body: "选址、电力方案与算力中心架构。" },
            { title: "预留接口", body: "为消费品枢纽与算力预研预留位置。" }
          ]
        }
      },
      "p.rimu": {
        apercu: [
          "RIMU 不是 TikTok 的本地化版本，而是日常生活操作系统的入口——内容、商品、就业与公共服务。",
          "四个 tab、八个模块、首批三种语言（法语、阿拉伯语、英语）、低带宽：差异在于本地语言（二期）、未成年人保护与创作者以乌吉亚变现。",
          "验证、审核与推荐规则由毛里塔尼亚掌控，无任意审查。"
        ],
        fonctionnement: {
          intro: "一个产品、四个 tab、八个模块与一套治理。",
          steps: [
            { title: "内容与推荐", body: "For You、订阅、15–60 秒短视频、3 分钟中视频与图文笔记。" },
            { title: "日常模块", body: "附近、市场、就业、认证政务号。" },
            { title: "直播与电商", body: "婚礼、集市、渔获上岸、认证讲座与直播带货。" },
            { title: "RIMP 支付", body: "预付或货到付款，创作者以乌吉亚收款。" },
            { title: "治理", body: "模型预审、关键词或声纹、人工复核与举报快速响应。" }
          ]
        }
      },
      "p.calcul": {
        apercu: [
          "国家 AI 算力中心是把数据、模型与审核留在本国领土的底座。",
          "扩建努瓦克肖特 Tier III 数据中心：GPU 集群、边缘节点、优先绿电，新增容量与专线。",
          "三期：推理与审核（约 1 兆瓦、约 100 张加速卡、约 18 个月），训练/推理分离（2–3 兆瓦、约 36 个月），再绑定绿电合同模块化扩建。"
        ],
        fonctionnement: {
          intro: "三期推进，一条铁律：推理留在本国。",
          steps: [
            { title: "一期 —— 推理", body: "两个平台的审核与风险控制；约 100 张加速卡对应约 1 兆瓦。" },
            { title: "二期 —— 训练/推理分离", body: "负载分离，2–3 兆瓦，视情况开放西非区域接口。" },
            { title: "三期 —— 模块化扩建", body: "扩建绑定绿电合同与国家电力协议。" },
            { title: "能源与散热", body: "2N + 柴油 + 光伏 + 电池；新增容量与专线，不挤占居民用电。" },
            { title: "数据与模型", body: "账本与核心模型本地；训练可混合，推理回流本国。" }
          ]
        }
      }
    },
    methodo: {
      title: "方法学",
      intro: "本站所有数字均来自参考文件（2026 年 11 月）或明确的计算。三种标签：来源、派生、假设。",
      qaTitle: "口径提示",
      note: "雄心情景，不是官方预测。区间不可严格相加；点击徽章可打开每个数值的说明。",
      qa: [
        { code: "QA-1", title: "支付流量与 RIMP 收入", decision: "统一显示 150–250 亿美元/年，标注派生，费率 0.5–0.7%；不照抄「数千亿美元」。", },
        { code: "QA-2", title: "280 万账户与成年人口", decision: "280 万为累计账户（含多账户）；「约 50% 的成年人」作为独立指标。", },
        { code: "QA-3", title: "三组就业数字", decision: "三层标注——首波、中长期关联、五年累计——且不相加。", },
        { code: "QA-4", title: "网民 60%+ 与 MAU", decision: "显示「2031 年约 60% 的网民」；约 420 万的基数只放在方法学，标注派生。", },
        { code: "QA-5", title: "算力两个「一期」", decision: "区分 IT 负载（约 1 兆瓦、约 100 张卡）与 20–50 兆瓦绿电项目（一期之后视野）。", },
        { code: "QA-6", title: "收入分项与总数", decision: "总数以 1.5–2.2 亿美元为准；分项各自显示区间；环图用 0.4 / 1.15 / 0.35 亿美元中点，不相加区间上限。", },
        { code: "QA-7", title: "2031 算力收入与长期收入", decision: "2031 年只显示 0.3–0.4 亿美元；「数千万至约 1 亿美元/年」为未标日期的长期潜力，不计入 2031 总数。", }
      ],
      close: "每个数字都可打开说明：类型、公式、来源。没有无标签的数值。"
    },
    pitch: {
      title: "3 分钟引导参观",
      subtitle: "七步看懂平台、系统与所请求的决策。",
      scenes: [
        { id: "scene.hero", chapterId: "ch-hero", title: "一个平台，三重主权", caption: "两个国家、一个官方渠道：双边平台、RIMU 超级应用、AI 算力中心。" },
        { id: "scene.pourquoi", chapterId: "ch-pourquoi", title: "四道堵点", caption: "注意力外流、现金在账外、数据在境外、单一出口：现状有代价。" },
        { id: "scene.systeme", chapterId: "ch-systeme", title: "一套系统，而非项目拼盘", caption: "三支柱、六业务线、四层架构：每个节点都能打开详情。" },
        { id: "scene.rimu", chapterId: "ch-rimu", title: "RIMU，日常操作系统", caption: "内容、商品、就业、公共服务：八个模块、首批三种语言、低带宽。" },
        { id: "scene.ia", chapterId: "ch-ia", title: "主权底座", caption: "四层、三期算力：数据与模型留在本国。" },
        { id: "scene.impact", chapterId: "ch-impact", title: "2031 的数字", caption: "250 万月活、1.5–2.2 亿美元收入、3–4 万就业：雄心情景，数字带标签。" },
        { id: "scene.decision", chapterId: "ch-decision", title: "打开通道", caption: "五项决定同步明确；30 天定人，90 天发布。" }
      ],
      controls: {
        start: "开始引导",
        pause: "暂停",
        resume: "继续",
        next: "下一步",
        prev: "上一步",
        exit: "退出",
        skip: "跳过引导"
      }
    },
    presenter: {
      hint: "演讲者模式：← / → 切换章节 · B 黑屏 · Esc 退出",
      timer: "计时",
      exit: "退出",
      black: "黑屏"
    },
    media: {
      kicker: "影片与演示",
      title: "平台，正在运转",
      lead: "用三分钟看系统如何工作。一个交互式演示，供你探索。",
      videoCta: "观看影片 · 3 分 48",
      demoCta: "打开演示",
      note: "演示托管于 v0.app · 在新标签页打开。",
      filmLabel: "介绍影片",
      duration: "3 分 48",
      videoTitle: "平台介绍影片",
      videoCaption: "中毛数字合作平台的影像介绍。",
      demoTitle: "交互式演示",
      demoNote: "演示托管于 v0.app；如预览被浏览器阻止，请在新标签页打开。",
      demoOpen: "在新标签页打开"
    },
    footer: {
      sources: "数据：来源 / 派生 / 假设 —— 见方法学。参考文件：2026 年 11 月。",
      version: "版本 1.0 · 2026-11-09 · 最近更新：2026-11-09",
      legal: "© 2026 AUREON DIGITAL SARL —— 努瓦克肖特，毛里塔尼亚。方案说明文件：雄心情景，非合同承诺。联系方式上线前需确认。",
      contactTitle: "联系",
      navTitle: "目录"
    }
  }
};
