/**
 * ConsequenceSystem - Player Decision Tracking + Survival Determination
 *
 * Tracks consequence flags set by player choices throughout the game session.
 * Supports boolean flags and numeric counters.
 *
 * SURVIVAL SYSTEM:
 * Survival is NOT a flag-match lookup. It is a weighted probability roll
 * grounded in real historical statistics for each role. Player choices
 * shift the survival probability up or down from the historical baseline.
 *
 * Historical baselines:
 *   japanese-aviator  : 35% death rate  (64 of 183 aircraft lost, Pearl Harbor)
 *   american-sailor   : 78% death rate  (1,177 of 1,512 USS Arizona crew)
 *   american-civilian :  2% death rate  (49 of ~2,400 civilians in blast zones)
 *                        elevated to ~2% from raw 0.03% because the player is
 *                        explicitly placed in a high-risk residential zone
 *
 * Requirements: 6.1, 6.2, 6.4, 6.5, 20.1, 20.2
 */

class ConsequenceSystem {
  constructor(eventBus) {
    this.flags    = new Map();
    this.eventBus = eventBus;
    this.eventBus.on('choice:made', this.handleChoiceMade.bind(this));
  }

  // ─── FLAG MANAGEMENT ───────────────────────────────────────────────────────

  handleChoiceMade(data) {
    if (!data?.consequences) return;
    for (const [name, value] of Object.entries(data.consequences)) {
      this.setFlag(name, value);
    }
  }

  setFlag(flagName, value) {
    if (typeof flagName !== 'string') {
      console.error('ConsequenceSystem.setFlag: flagName must be a string'); return;
    }
    if (typeof value !== 'boolean' && typeof value !== 'number') {
      console.warn(`ConsequenceSystem.setFlag: invalid value for "${flagName}"`); return;
    }
    this.flags.set(flagName, value);
  }

  getFlag(flagName)  { return this.flags.get(flagName); }
  getAllFlags()      {
    const obj = {};
    for (const [k, v] of this.flags) obj[k] = v;
    return obj;
  }

  reset() { this.flags.clear(); }

  // ─── SURVIVAL DETERMINATION ────────────────────────────────────────────────

  /**
   * Determine whether the player survived, based on historical probability
   * modified by their in-game choices.
   *
   * @param {string} roleId - 'japanese-aviator' | 'american-sailor' | 'american-civilian'
   * @returns {{ survived: boolean, deathChance: number, modifiers: object }}
   */
  determineSurvival(roleId) {
    const flags = this.getAllFlags();

    switch (roleId) {
      case 'japanese-aviator':   return this._survivalJA(flags);
      case 'american-sailor':    return this._survivalAS(flags);
      case 'american-civilian':  return this._survivalAC(flags);
      default:
        console.warn(`ConsequenceSystem: unknown roleId "${roleId}", defaulting to survived`);
        return { survived: true, deathChance: 0, modifiers: {} };
    }
  }

  /**
   * Japanese Aviator survival
   * Baseline: 35% death rate (64 aircraft lost of 183 in attack)
   * Aggressive choices increase death chance. Cautious choices decrease it.
   */
  _survivalJA(flags) {
    let deathChance = 0.35;
    const modifiers = {};

    // Aggressive attack runs increase exposure to AA fire
    if (flags.aggressive_action >= 2) {
      deathChance += 0.25;
      modifiers['multiple_attack_runs'] = '+25% (flew multiple aggressive passes over target)';
    } else if (flags.aggressive_action >= 1) {
      deathChance += 0.10;
      modifiers['aggressive_attack'] = '+10% (pressed attack aggressively)';
    }

    // Mission priority (one more pass) at scene 4 is the riskiest choice
    if (flags.mission_priority && flags.fuel_risk) {
      deathChance += 0.20;
      modifiers['low_fuel_combat'] = '+20% (continued combat with critically low fuel)';
    }

    // Helping a comrade means flying slower, lower, more exposed
    if (flags.helped_comrade && flags.fuel_risk) {
      deathChance += 0.15;
      modifiers['escort_fuel_risk'] = '+15% (escorted damaged aircraft while low on fuel)';
    } else if (flags.helped_comrade) {
      deathChance += 0.05;
      modifiers['escort_risk'] = '+5% (broke formation to escort damaged aircraft)';
    }

    // Caution / tactical awareness reduce death chance
    if (flags.tactical_caution) {
      deathChance -= 0.10;
      modifiers['tactical_caution'] = '-10% (avoided unnecessary AA exposure)';
    }
    if (flags.survival_instinct) {
      deathChance -= 0.08;
      modifiers['survival_instinct'] = '-8% (heightened situational awareness)';
    }
    if (flags.fuel_conserved && !flags.fuel_risk) {
      deathChance -= 0.08;
      modifiers['fuel_conserved'] = '-8% (managed fuel carefully, safe return margin)';
    }
    if (flags.followed_orders && flags.disciplined_approach) {
      deathChance -= 0.07;
      modifiers['disciplined_formation'] = '-7% (maintained formation discipline, reduced exposure)';
    }

    deathChance = Math.max(0.10, Math.min(0.90, deathChance));
    const roll     = Math.random();
    const survived = roll > deathChance;

    console.log(`[Survival] JA: deathChance=${(deathChance*100).toFixed(0)}% roll=${roll.toFixed(3)} survived=${survived}`);
    return { survived, deathChance, modifiers, roll };
  }

  /**
   * American Sailor survival
   * Baseline: 78% death rate (1,177 of 1,512 USS Arizona crew)
   * Being below deck or staying aboard dramatically increases death.
   * Getting off the ship is the primary survival factor.
   */
  _survivalAS(flags) {
    let deathChance = 0.78;
    const modifiers = {};

    // Below deck when the magazine explodes = almost certain death
    if (flags.damage_control || flags.duty_focused) {
      deathChance += 0.12;
      modifiers['below_deck_explosion'] = '+12% (below deck when forward magazine detonated)';
    }

    // Staying aboard after the explosion = trapped on sinking ship
    if (flags.stayed_aboard) {
      deathChance += 0.10;
      modifiers['stayed_aboard'] = '+10% (remained on sinking ship)';
    }

    // Getting off the ship early is the main survival factor
    if (flags.abandoned_ship) {
      deathChance -= 0.30;
      modifiers['abandoned_ship'] = '-30% (jumped overboard early, increased escape chance)';
    }

    // Grabbing life jackets before the attack = survival preparation
    if (flags.survival_priority && flags.prepared_for_disaster) {
      deathChance -= 0.15;
      modifiers['prepared_survival'] = '-15% (had survival gear ready)';
    }

    // Quick reaction to battle stations = more time to respond
    if (flags.quick_reaction) {
      deathChance -= 0.10;
      modifiers['quick_reaction'] = '-10% (reacted quickly, reached safer position)';
    }

    // Helping wounded = on deck = exposed but mobile
    if (flags.helped_wounded) {
      deathChance -= 0.08;
      modifiers['topside_position'] = '-8% (was topside helping wounded, able to escape)';
    }

    // Rescuing swimmers = already off the ship
    if (flags.rescued_swimmers) {
      deathChance -= 0.12;
      modifiers['rescued_swimmers'] = '-12% (in water rescuing others = already off Arizona)';
    }

    // Swimming to another ship = off Arizona, on a less damaged vessel
    if (flags.tactical_retreat) {
      deathChance -= 0.15;
      modifiers['tactical_retreat'] = '-15% (swam to another ship, off Arizona)';
    }

    // Fighting back = on deck at guns = exposed but mobile
    if (flags.fought_back) {
      deathChance -= 0.05;
      modifiers['topside_fighting'] = '-5% (was topside at AA guns, mobile position)';
    }

    deathChance = Math.max(0.20, Math.min(0.95, deathChance));
    const roll     = Math.random();
    const survived = roll > deathChance;

    console.log(`[Survival] AS: deathChance=${(deathChance*100).toFixed(0)}% roll=${roll.toFixed(3)} survived=${survived}`);
    return { survived, deathChance, modifiers, roll };
  }

  /**
   * American Civilian survival
   * Baseline: ~2% death chance (elevated from raw 0.03% because
   * player is in a high-risk zone adjacent to Pearl Harbor)
   * Risk-taking choices dramatically raise the chance. Taking shelter drops it.
   */
  _survivalAC(flags) {
    let deathChance = 0.02;
    const modifiers = {};

    // Running toward Pearl Harbor = entering active combat zone
    if (flags.rushed_to_help || flags.went_to_harbor) {
      deathChance += 0.12;
      modifiers['entered_combat_zone'] = '+12% (moved toward active attack zone)';
    }

    // Staying to rescue = prolonged exposure to falling shells
    if (flags.rescued_victim && flags.stayed_to_help) {
      deathChance += 0.10;
      modifiers['prolonged_exposure'] = '+10% (extended time in open during shell barrage)';
    } else if (flags.rescued_victim) {
      deathChance += 0.05;
      modifiers['rescue_exposure'] = '+5% (entered damaged structure to rescue victim)';
    }

    // Diving for cover at scene 2 = survived the first shell barrage
    if (flags.took_cover && flags.self_preservation) {
      deathChance -= 0.008;
      modifiers['took_cover'] = '-0.8% (took immediate cover from falling shells)';
    }

    // Pushing elderly man = exposed self briefly but covered quickly
    if (flags.saved_neighbor) {
      deathChance += 0.03;
      modifiers['exposed_for_neighbor'] = '+3% (briefly exposed protecting neighbor)';
    }

    // Shouting warning = stayed in open longer
    if (flags.warned_others) {
      deathChance += 0.02;
      modifiers['warning_exposure'] = '+2% (stayed in open to warn others)';
    }

    // Taking family to shelter = inside, protected
    if (flags.family_priority && flags.survival_focused) {
      deathChance -= 0.01;
      modifiers['sheltered'] = '-1% (took shelter with family, reduced exposure)';
    }

    deathChance = Math.max(0.005, Math.min(0.70, deathChance));
    const roll     = Math.random();
    const survived = roll > deathChance;

    console.log(`[Survival] AC: deathChance=${(deathChance*100).toFixed(0)}% roll=${roll.toFixed(3)} survived=${survived}`);
    return { survived, deathChance, modifiers, roll };
  }

  // ─── OUTCOME SELECTION ─────────────────────────────────────────────────────

  /**
   * Select the best matching outcome from a role's outcome array.
   * Survival is pre-determined by determineSurvival(). This method
   * picks the most contextually appropriate outcome narrative
   * given whether the player survived and what flags they set.
   *
   * @param {Array}   outcomeRules - Array of outcome objects from role file
   * @param {boolean} survived     - Result from determineSurvival()
   * @returns {string} outcome id
   */
  calculateOutcome(outcomeRules, survived) {
    if (!Array.isArray(outcomeRules)) {
      console.error('ConsequenceSystem.calculateOutcome: outcomeRules must be an array');
      return null;
    }

    // Filter to only outcomes matching survival status
    // (exclude the default which has no conditions)
    const matchingPool = outcomeRules.filter(rule => {
      if (!rule.conditions || Object.keys(rule.conditions).length === 0) return false;
      return rule.survived === survived;
    });

    // Score each matching outcome by how many conditions are satisfied
    let bestScore  = -1;
    let bestOutcome = null;

    for (const rule of matchingPool) {
      const score = this._scoreConditions(rule.conditions);
      if (score > bestScore) {
        bestScore   = score;
        bestOutcome = rule;
      }
    }

    // If a scored match was found, use it
    if (bestOutcome) return bestOutcome.id;

    // Fall back to default (empty conditions) that matches survival status
    const defaultMatch = outcomeRules.find(rule =>
      (!rule.conditions || Object.keys(rule.conditions).length === 0) &&
      rule.survived === survived
    );
    if (defaultMatch) return defaultMatch.id;

    // Last resort: any default
    const anyDefault = outcomeRules.find(rule =>
      !rule.conditions || Object.keys(rule.conditions).length === 0
    );
    return anyDefault?.id ?? null;
  }

  /**
   * Score how many conditions in a rule are satisfied by current flags.
   * Returns the count of matching conditions (not all-or-nothing).
   */
  _scoreConditions(conditions) {
    let score = 0;
    for (const [flag, expected] of Object.entries(conditions)) {
      const actual = this.getFlag(flag);
      if (actual !== undefined && actual === expected) score++;
    }
    return score;
  }

  /**
   * Legacy method — kept for backward compatibility with UIController.
   * UIController calls calculateOutcome(outcomes) without a survived param.
   * This wrapper calls determineSurvival with the stored roleId.
   * NOTE: roleId must be set via setCurrentRole() before calling this.
   */
  calculateOutcomeLegacy(outcomeRules) {
    const roleId   = this._currentRoleId || 'american-sailor';
    const survival = this.determineSurvival(roleId);
    return this.calculateOutcome(outcomeRules, survival.survived);
  }

  setCurrentRole(roleId) {
    this._currentRoleId = roleId;
  }
}

export default ConsequenceSystem;
