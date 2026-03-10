/**
 * Psychology Data - Path Classification Rules and Psychology System Configuration
 * 
 * This file contains all data-driven configuration for:
 * - Path classification rules (which flags map to which path variant)
 * - Grade configuration (how scores map to letter grades)
 * - Personality archetypes (9 archetypes with role-specific descriptions)
 * - HUD display labels
 * - Default flag values
 * 
 * Requirements: Path Classification Logic, Psychology System
 */

// ═══════════════════════════════════════════════════════════════════════════
// PATH CLASSIFICATION RULES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Path classification rules - weighted scoring system
 * Each rule defines: which path variant, which flags to check, and weight
 */
export const PATH_RULES = [
  // ═══ COMPLIANCE PATH INDICATORS ═══
  // Discipline, following orders, maintaining formation
  { 
    variant: 'compliance', 
    requiredFlags: { disciplined_mindset: true }, 
    weight: 3 
  },
  { 
    variant: 'compliance', 
    requiredFlags: { followed_orders: true }, 
    weight: 3 
  },
  { 
    variant: 'compliance', 
    requiredFlags: { disciplined_approach: true }, 
    weight: 2 
  },
  { 
    variant: 'compliance', 
    requiredFlags: { perfect_execution: true }, 
    weight: 2 
  },
  { 
    variant: 'compliance', 
    requiredFlags: { professional_conduct: true }, 
    weight: 2 
  },
  { 
    variant: 'compliance', 
    requiredFlags: { unit_cohesion: true }, 
    weight: 2 
  },
  { 
    variant: 'compliance', 
    requiredFlags: { mission_discipline: true }, 
    weight: 2 
  },
  { 
    variant: 'compliance', 
    requiredFlags: { proper_procedure: true }, 
    weight: 2 
  },
  { 
    variant: 'compliance', 
    requiredFlags: { obedience: true }, 
    weight: 3 
  },
  { 
    variant: 'compliance', 
    requiredFlags: { disciplined_withdrawal: true }, 
    weight: 2 
  },
  { 
    variant: 'compliance', 
    requiredFlags: { unit_protection: true }, 
    weight: 2 
  },
  { 
    variant: 'compliance', 
    requiredFlags: { professional_retreat: true }, 
    weight: 2 
  },

  // ═══ INSTINCT PATH INDICATORS ═══
  // Strategic thinking, resource management, survival focus
  { 
    variant: 'instinct', 
    requiredFlags: { strategic_focus: true }, 
    weight: 3 
  },
  { 
    variant: 'instinct', 
    requiredFlags: { tactical_caution: true }, 
    weight: 2 
  },
  { 
    variant: 'instinct', 
    requiredFlags: { fuel_conserved: true }, 
    weight: 2 
  },
  { 
    variant: 'instinct', 
    requiredFlags: { strategic_targeting: true }, 
    weight: 3 
  },
  { 
    variant: 'instinct', 
    requiredFlags: { resource_management: true }, 
    weight: 3 
  },
  { 
    variant: 'instinct', 
    requiredFlags: { tactical_awareness: true }, 
    weight: 2 
  },
  { 
    variant: 'instinct', 
    requiredFlags: { strategic_initiative: true }, 
    weight: 3 
  },
  { 
    variant: 'instinct', 
    requiredFlags: { tactical_support: true }, 
    weight: 2 
  },
  { 
    variant: 'instinct', 
    requiredFlags: { survival_calculation: true }, 
    weight: 3 
  },
  { 
    variant: 'instinct', 
    requiredFlags: { calculated_risk: true }, 
    weight: 2 
  },
  { 
    variant: 'instinct', 
    requiredFlags: { strategic_preservation: true }, 
    weight: 3 
  },
  { 
    variant: 'instinct', 
    requiredFlags: { aggressive_tactics: true }, 
    weight: 2 
  },

  // ═══ WITNESS PATH INDICATORS ═══
  // Moral awareness, emotional conflict, compassion
  { 
    variant: 'witness', 
    requiredFlags: { moral_awareness: true }, 
    weight: 3 
  },
  { 
    variant: 'witness', 
    requiredFlags: { selective_targeting: true }, 
    weight: 3 
  },
  { 
    variant: 'witness', 
    requiredFlags: { duty_over_doubt: true }, 
    weight: 2 
  },
  { 
    variant: 'witness', 
    requiredFlags: { personal_motivation: true }, 
    weight: 2 
  },
  { 
    variant: 'witness', 
    requiredFlags: { emotional_suppression: true }, 
    weight: 2 
  },
  { 
    variant: 'witness', 
    requiredFlags: { rationalization: true }, 
    weight: 2 
  },
  { 
    variant: 'witness', 
    requiredFlags: { moral_acceptance: true }, 
    weight: 3 
  },
  { 
    variant: 'witness', 
    requiredFlags: { compassionate_risk: true }, 
    weight: 3 
  },
  { 
    variant: 'witness', 
    requiredFlags: { pragmatic_choice: true }, 
    weight: 2 
  },
  { 
    variant: 'witness', 
    requiredFlags: { compromise_solution: true }, 
    weight: 2 
  }
];

/**
 * Default flag values - all roles start with these
 */
export const DEFAULT_FLAGS = {
  // Compliance flags
  disciplined_mindset: false,
  followed_orders: false,
  disciplined_approach: false,
  perfect_execution: false,
  professional_conduct: false,
  unit_cohesion: false,
  mission_discipline: false,
  proper_procedure: false,
  obedience: false,
  disciplined_withdrawal: false,
  unit_protection: false,
  professional_retreat: false,
  
  // Instinct flags
  strategic_focus: false,
  tactical_caution: false,
  fuel_conserved: false,
  strategic_targeting: false,
  resource_management: false,
  tactical_awareness: false,
  strategic_initiative: false,
  tactical_support: false,
  survival_calculation: false,
  calculated_risk: false,
  strategic_preservation: false,
  aggressive_tactics: false,
  
  // Witness flags
  moral_awareness: false,
  selective_targeting: false,
  duty_over_doubt: false,
  personal_motivation: false,
  emotional_suppression: false,
  rationalization: false,
  moral_acceptance: false,
  compassionate_risk: false,
  pragmatic_choice: false,
  compromise_solution: false,
  
  // Shared/risk flags
  fuel_risk: false,
  mission_complete: false
};

// ═══════════════════════════════════════════════════════════════════════════
// GRADE CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Grade calculation configuration
 * Uses weighted average of four psychology scores
 */
export const GRADE_CONFIG = {
  calculation: 'weighted_average',
  weights: {
    morale: 0.30,
    loyalty: 0.25,
    awareness: 0.30,
    composure: 0.15
  },
  thresholds: [
    { 
      min: 85, 
      letter: 'A', 
      label: 'Exceptional',
      description: 'You maintained your humanity under impossible conditions. History remembers people like you.'
    },
    { 
      min: 70, 
      letter: 'B', 
      label: 'Steadfast',
      description: 'You held together when everything fell apart. Not perfect — but present.'
    },
    { 
      min: 55, 
      letter: 'C', 
      label: 'Conflicted',
      description: 'You carried the weight of impossible choices. That conflict made you human.'
    },
    { 
      min: 40, 
      letter: 'D', 
      label: 'Fractured',
      description: 'The pressure broke through. December 7th tested everyone differently.'
    },
    { 
      min: 0, 
      letter: 'F', 
      label: 'Lost',
      description: 'Some days shatter people completely. History is full of those days too.'
    }
  ]
};

// ═══════════════════════════════════════════════════════════════════════════
// HUD DISPLAY LABELS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Labels for psychology score display in HUD
 */
export const HUD_LABELS = {
  morale: 'State of Mind',
  loyalty: 'Duty Rating',
  awareness: 'Awareness',
  composure: 'Under Pressure',
  gradeHeader: 'Teammate Grade',
  archetypeHeader: 'You Were'
};

// ═══════════════════════════════════════════════════════════════════════════
// PERSONALITY ARCHETYPES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Nine personality archetypes with role-specific descriptions
 * Each archetype applies to any role that matches the score pattern
 */
export const ARCHETYPES = [
  {
    id: 'the-soldier',
    name: 'The Soldier',
    dominantPattern: { loyalty: 'highest', composure: 'high' },
    descriptions: {
      'japanese-aviator': 'You flew as you were trained. Every order followed, every target hit. History will debate whether that was honor or obedience — you lived it as both.',
      'american-sailor': 'You ran to your post when others ran for their lives. The Navy trained you for this moment and you answered. That discipline saved lives around you even as it cost you.',
      'american-civilian': 'You did what you were told: stayed inside, turned off your lights, waited. In chaos, that steadiness was its own form of courage.'
    }
  },
  {
    id: 'the-reluctant-hero',
    name: 'The Reluctant Hero',
    dominantPattern: { awareness: 'highest', loyalty: 'low' },
    descriptions: {
      'japanese-aviator': 'You broke from what you were supposed to do when it mattered most. The mission demanded one thing; you gave something else. Call it weakness or conscience — you will carry it either way.',
      'american-sailor': 'You left your post to help someone. The Navy would call that a failure of duty. The man you pulled from the water would call it something else.',
      'american-civilian': 'You didn\'t wait for permission. You moved toward the people who needed help, against every instruction, through smoke and confusion. Some things are more important than following the rules.'
    }
  },
  {
    id: 'the-witness',
    name: 'The Witness',
    dominantPattern: { composure: 'highest', morale: 'low' },
    descriptions: {
      'japanese-aviator': 'You watched history happen from above. Your composure held while the world below broke apart. Witnesses carry a different burden — not guilt, but memory. You will remember everything.',
      'american-sailor': 'You saw it all. The Arizona going down. The oil burning. The men in the water. You survived because you watched before you acted. Now you carry what you saw.',
      'american-civilian': 'You stood on your roof and watched Pearl Harbor burn. Most people looked away. You didn\'t. Witnesses matter — someone has to remember what it actually looked like.'
    }
  },
  {
    id: 'the-survivor',
    name: 'The Survivor',
    dominantPattern: { morale: 'low', composure: 'low' },
    descriptions: {
      'japanese-aviator': 'You made it back to the carrier. That\'s the whole story. Everything else — the moral weight, the strategic meaning — comes later. Right now you just survived.',
      'american-sailor': 'You got out of the water. That was enough. December 7th demanded survival first and everything else second. You answered the first demand.',
      'american-civilian': 'You made it through December 7th. In the days that followed, that would have to be enough to build from.'
    }
  },
  {
    id: 'the-broken',
    name: 'The Broken',
    dominantPattern: { morale: 'lowest', awareness: 'high' },
    descriptions: {
      'japanese-aviator': 'The attack succeeded. Your mission was a tactical triumph. But something in you registered what that success actually meant, and it cost you something you won\'t get back.',
      'american-sailor': 'You felt every death on December 7th. That sensitivity is not weakness — but it will take years to carry. The men who came home whole were the ones who learned not to feel it. You couldn\'t do that.',
      'american-civilian': 'You understood what was happening before most people did. That understanding came at a price. The weight of December 7th settled on you differently.'
    }
  },
  {
    id: 'the-divided',
    name: 'The Divided',
    dominantPattern: { loyalty: 'mid', awareness: 'mid' },
    descriptions: {
      'japanese-aviator': 'You were never fully one thing or another on December 7th. Part soldier, part human being, pulling in both directions the entire time. History is full of people like you — it just rarely acknowledges them.',
      'american-sailor': 'You split the difference on every decision. Not fully committed to duty, not fully committed to instinct. That ambivalence kept you alive but it will haunt you.',
      'american-civilian': 'You couldn\'t decide whether to stay or go, help or hide, watch or look away. December 7th demanded clarity and you gave uncertainty. That\'s more honest than most people admit.'
    }
  },
  {
    id: 'the-pragmatist',
    name: 'The Pragmatist',
    dominantPattern: { composure: 'high', awareness: 'low' },
    descriptions: {
      'japanese-aviator': 'You calculated every decision. Fuel, ammunition, target priority, withdrawal timing. The mission was mathematics and you solved it. Whether that was cold or professional depends on who\'s asking.',
      'american-sailor': 'You made the choices that kept you alive. Not the heroic choices, not the moral choices — the practical ones. December 7th rewarded pragmatism.',
      'american-civilian': 'You assessed the situation and acted accordingly. No drama, no panic, no heroics. Just clear-eyed decisions in real time. That\'s rarer than it sounds.'
    }
  },
  {
    id: 'the-idealist',
    name: 'The Idealist',
    dominantPattern: { awareness: 'highest', morale: 'high' },
    descriptions: {
      'japanese-aviator': 'You believed in something larger than yourself on December 7th. Whether that was Japan, honor, duty, or something else — it carried you through. Idealism is dangerous. It\'s also what makes people capable of extraordinary things.',
      'american-sailor': 'You held onto what you believed even when everything around you was chaos. The Navy, America, your shipmates — something mattered enough to keep you moving forward.',
      'american-civilian': 'You saw December 7th as a call to something. Not just survival, not just reaction — purpose. That idealism will shape what comes next for you.'
    }
  },
  {
    id: 'the-realist',
    name: 'The Realist',
    dominantPattern: { morale: 'mid', composure: 'mid' },
    descriptions: {
      'japanese-aviator': 'You understood what December 7th was: a military operation with strategic objectives and human costs. You didn\'t romanticize it. You didn\'t demonize it. You just flew the mission.',
      'american-sailor': 'You knew what was happening and what it meant. No illusions, no denial, no false hope. Just the reality of December 7th, accepted and endured.',
      'american-civilian': 'You saw Pearl Harbor burn and understood exactly what it meant for the future. No panic, no optimism — just clear-eyed recognition of what had changed.'
    }
  }
];
