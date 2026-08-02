export const petSpeciesLabels: Record<string, string> = {
  DOG: 'Perro',
  CAT: 'Gato',
  BIRD: 'Ave',
  RABBIT: 'Conejo',
  RODENT: 'Roedor',
  REPTILE: 'Reptil',
  OTHER: 'Otro animal',
  HORSE: 'Caballo',
  DONKEY: 'Burro',
  GOAT: 'Cabra',
  SHEEP: 'Oveja',
  PIG: 'Cerdo',
  COW: 'Vaca',
  CHICKEN: 'Gallina',
  DUCK: 'Pato',
  GOOSE: 'Ganso',
  TURKEY: 'Pavo',
  FERRET: 'Hurón',
  FISH: 'Pez',
  AMPHIBIAN: 'Anfibio',
  EXOTIC_BIRD: 'Ave exótica',
  CAMELID: 'Camélido',
  OTHER_FARM: 'Otro animal de granja',
};

export const petSexLabels = {
  UNKNOWN: 'No indicado',
  FEMALE: 'Hembra',
  MALE: 'Macho',
} as const;

export const petSizeLabels = {
  UNKNOWN: 'No indicado',
  TINY: 'Muy pequeño',
  SMALL: 'Pequeño',
  MEDIUM: 'Mediano',
  LARGE: 'Grande',
  GIANT: 'Gigante',
} as const;
