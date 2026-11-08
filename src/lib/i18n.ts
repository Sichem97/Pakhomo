
export type Language = 'en' | 'fr'

export const translations = {
  en: {
    discover: 'Discover',
    howItWorks: 'How it works',
    listProperty: 'List a property',
    listYourProperty: 'List your property',

    tagline: 'A better way to find your place',
    heroTitle: 'Find a place',
    heroTitleEmphasis: 'to call yours.',
    heroDescription:
      'Discover homes, land and spaces across Africa — with more clarity, confidence and trust.',
    exploreProperties: 'Explore properties',
    localTrusted: 'Local properties. Trusted connections.',

    nextChapter: 'YOUR NEXT CHAPTER STARTS HERE',
    exploreIn: 'Explore properties in',
    countryDetected: 'Country detected',
    detectingCountry: 'Detecting country',

    searchPlaceholder: 'Search by city, neighbourhood or keyword',
    allCities: 'All cities',
    allTypes: 'All types',
    search: 'Search',

    allProperties: 'All properties',
    forRent: 'For rent',
    forSale: 'For sale',
    propertiesFound: 'properties found',

    noProperties: 'No properties found yet',
    noPropertiesDescription:
      'Try another city or adjust your filters. New listings will appear here as the marketplace grows.',
    clearFilters: 'Clear filters',

    verifiedNotice:
      'Listings marked verified have passed our initial owner review.',

    peaceOfMind: 'PROPERTY SEARCH, WITH PEACE OF MIND',
    confidenceTitle: 'Confidence should be part of every move.',
    confidenceDescription:
      'We are building a marketplace where property details are clearer and owners can be reviewed before their listings go live.',
    verificationWorks: 'Learn how verification works',

    reviewedOwners: 'Reviewed owners',
    reviewedOwnersDescription:
      'Owner identity checks before listings are approved.',

    localDiscovery: 'Local discovery',
    localDiscoveryDescription:
      'Start with properties available in your country.',

    madeForLife: 'Made for real life',
    madeForLifeDescription:
      'Homes, plots and business spaces in one place.',

    haveProperty: 'HAVE A PROPERTY?',
    ownerTitle: 'Put your property in front of the right people.',
    ownerDescription:
      'Join the marketplace and connect with people looking in your area.',
    registerInterest: 'Register your interest',

    footerDescription:
      'Building better property connections across Africa.',

    rent: 'For rent',
    sale: 'For sale',
    beds: 'beds',
    bathrooms: 'baths',
    month: '/ month',
    askingPrice: 'asking price',
    verified: 'Verified',

    house: 'House',
    apartment: 'Apartment',
    land: 'Land',
    shop: 'Shop',
    office: 'Office',
    hotel: 'Hotel',

    language: 'Language',
  },

  fr: {
    discover: 'Découvrir',
    howItWorks: 'Comment ça marche',
    listProperty: 'Publier un bien',
    listYourProperty: 'Publier votre bien',

    tagline: 'Une meilleure façon de trouver votre logement',
    heroTitle: 'Trouvez un endroit',
    heroTitleEmphasis: 'qui vous ressemble.',
    heroDescription:
      'Découvrez des maisons, terrains et espaces partout en Afrique, avec plus de clarté, de confiance et de sécurité.',
    exploreProperties: 'Explorer les biens',
    localTrusted: 'Des biens locaux. Des relations de confiance.',

    nextChapter: 'VOTRE NOUVEAU DÉPART COMMENCE ICI',
    exploreIn: 'Explorer les biens au',
    countryDetected: 'Pays détecté',
    detectingCountry: 'Détection du pays',

    searchPlaceholder: 'Rechercher une ville, un quartier ou un mot-clé',
    allCities: 'Toutes les villes',
    allTypes: 'Tous les types',
    search: 'Rechercher',

    allProperties: 'Tous les biens',
    forRent: 'À louer',
    forSale: 'À vendre',
    propertiesFound: 'biens trouvés',

    noProperties: 'Aucun bien trouvé pour le moment',
    noPropertiesDescription:
      'Essayez une autre ville ou modifiez vos filtres. De nouvelles annonces apparaîtront au fur et à mesure du développement de la plateforme.',
    clearFilters: 'Effacer les filtres',

    verifiedNotice:
      'Les annonces vérifiées ont passé notre premier contrôle du propriétaire.',

    peaceOfMind: 'RECHERCHE IMMOBILIÈRE EN TOUTE SÉRÉNITÉ',
    confidenceTitle:
      'La confiance doit accompagner chaque projet immobilier.',
    confidenceDescription:
      'Nous construisons une plateforme où les informations immobilières sont plus claires et où les propriétaires sont contrôlés avant la publication de leurs annonces.',
    verificationWorks: 'Comprendre la vérification',

    reviewedOwners: 'Propriétaires contrôlés',
    reviewedOwnersDescription:
      'Vérification de l’identité avant l’approbation des annonces.',

    localDiscovery: 'Recherche locale',
    localDiscoveryDescription:
      'Découvrez les biens disponibles dans votre pays.',

    madeForLife: 'Pensé pour la vie réelle',
    madeForLifeDescription:
      'Maisons, terrains et espaces commerciaux au même endroit.',

    haveProperty: 'VOUS AVEZ UN BIEN IMMOBILIER ?',
    ownerTitle: 'Présentez votre bien aux bonnes personnes.',
    ownerDescription:
      'Rejoignez notre plateforme et échangez avec des personnes qui recherchent un bien dans votre région.',
    registerInterest: 'Manifester votre intérêt',

    footerDescription:
      'Pour de meilleures relations immobilières en Afrique.',

    rent: 'À louer',
    sale: 'À vendre',
    beds: 'chambres',
    bathrooms: 'salles de bain',
    month: '/ mois',
    askingPrice: 'prix demandé',
    verified: 'Vérifié',

    house: 'Maison',
    apartment: 'Appartement',
    land: 'Terrain',
    shop: 'Boutique',
    office: 'Bureau',
    hotel: 'Hôtel',

    language: 'Langue',
  },
} as const

export type TranslationKey = keyof typeof translations.en

export function detectInitialLanguage(): Language {
  try {
    const savedLanguage = localStorage.getItem('habitat-language')

    if (savedLanguage === 'en' || savedLanguage === 'fr') {
      return savedLanguage
    }
  } catch {
    // Browser storage may be unavailable.
  }

  if (typeof navigator !== 'undefined') {
    const browserLanguages = navigator.languages?.length
      ? navigator.languages
      : [navigator.language]

    const frenchPreferred = browserLanguages.some((language) =>
      language.toLowerCase().startsWith('fr')
    )

    if (frenchPreferred) {
      return 'fr'
    }
  }

  return 'en'
}

export function saveLanguage(language: Language): void {
  try {
    localStorage.setItem('habitat-language', language)
  } catch {
    // The selected language still works during the current session.
  }
}
