// Helpers for decoding VIGI telemetry bitfields (alarmes / depassements / defauts)
// Bit N of a variable => variable & (1 << N)

export const VOIE_INDEXES = [1, 2, 3, 4, 5, 6, 7]

/** Voie N (1..7) alarm => bit (N-1) of `alarmes`. */
export function isVoieAlarm(alarmes, voieIndex) {
  if (alarmes == null) return false
  return (Number(alarmes) & (1 << (voieIndex - 1))) !== 0
}

/** Voie N (1..7) seuil haut depassement => bit (N-1) of `depassements`. */
export function isVoieDepassementHaut(depassements, voieIndex) {
  if (depassements == null) return false
  return (Number(depassements) & (1 << (voieIndex - 1))) !== 0
}

/** Voie N (1..7) seuil bas depassement => bit (N-1+8) of `depassements`. */
export function isVoieDepassementBas(depassements, voieIndex) {
  if (depassements == null) return false
  return (Number(depassements) & (1 << (voieIndex - 1 + 8))) !== 0
}

export function hasAnyAlarm(alarmes) {
  return (Number(alarmes) || 0) !== 0
}

/** Returns the list of voie indexes (1..7) currently in alarm state. */
export function getActiveAlarmVoies(alarmes) {
  return VOIE_INDEXES.filter((i) => isVoieAlarm(alarmes, i))
}

const DEFAUT_LABELS = {
  6: 'Comm. Mirror (timeout)',
  7: 'Comm. Mirror (boucle 4-20mA)',
  8: 'Capacité BUZZER',
  9: 'Convertisseur analogique',
  10: 'Alimentation',
  11: 'Bouton test',
  12: 'Bouton inhibition',
  13: 'Clavier outil',
  14: 'Horloge',
  15: 'Commande BUZZER',
}

/** Returns the list of active internal-fault labels for a `defauts` bitfield. */
export function getActiveDefauts(defauts) {
  if (defauts == null) return []
  const value = Number(defauts)
  return Object.entries(DEFAUT_LABELS)
    .filter(([bit]) => (value & (1 << Number(bit))) !== 0)
    .map(([, label]) => label)
}
