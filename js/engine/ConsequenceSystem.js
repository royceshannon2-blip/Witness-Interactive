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
 *   hutu-moderate     : 15% death rate  (thousands of Hutu moderates killed;
 *                        elevated baseline because player is named on lists)
 *   tutsi-survivor    : 75% death rate  (500,000–800,000 of ~1M Tutsi killed)
 *   un-peacekeeper    :  5% death rate  (small number of peacekeepers killed;
 *                        elevated for defiance/engagement choices)
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
   * @param {string} roleId
   * @returns {{ survived: boolean, deathChance: number, modifiers: object }}
   */
  determineSurvival(roleId) {
    const flags = this.getAllFlags();

    switch (roleId) {
      case 'japanese-aviator':   return this._survivalJA(flags);
      case 'american-sailor':    return this._survivalAS(flags);
      case 'american-civilian':  return this._survivalAC(flags);
      case 'hutu-moderate':      return this._survivalHM(flags);
      case 'tutsi-survivor':     return this._survivalTS(flags);
      case 'un-peacekeeper':     return this._survivalUN(flags);
      default:
        console.warn(`ConsequenceSystem: unknown roleId "${roleId}", defaulting to survived`);
        return { survived: true, deathChance: 0, modifiers: {} };
    }
  }

  // ─── PEARL HARBOR SURVIVAL METHODS ────────────────────────────────────────

  /**
   * Japanese Aviator survival
   * Baseline: 35% death rate (64 aircraft lost of 183 in attack)
   */
  _survivalJA(flags) {
    let deathChance = 0.35;
    const modifiers = {};

    if (flags.aggressive_action >= 2) {
      deathChance += 0.25;
      modifiers['multiple_attack_runs'] = '+25% (flew multiple aggressive passes over target)';
    } else if (flags.aggressive_action >= 1) {
      deathChance += 0.10;
      modifiers['aggressive_attack'] = '+10% (pressed attack aggressively)';
    }

    if (flags.mission_priority && flags.fuel_risk) {
      deathChance += 0.20;
      modifiers['low_fuel_combat'] = '+20% (continued combat with critically low fuel)';
    }

    if (flags.helped_comrade && flags.fuel_risk) {
      deathChance += 0.15;
      modifiers['escort_fuel_risk'] = '+15% (escorted damaged aircraft while low on fuel)';
    } else if (flags.helped_comrade) {
      deathChance += 0.05;
      modifiers['escort_risk'] = '+5% (broke formation to escort damaged aircraft)';
    }

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
   */
  _survivalAS(flags) {
    let deathChance = 0.78;
    const modifiers = {};

    if (flags.damage_control || flags.duty_focused) {
      deathChance += 0.12;
      modifiers['below_deck_explosion'] = '+12% (below deck when forward magazine detonated)';
    }

    if (flags.stayed_aboard) {
      deathChance += 0.10;
      modifiers['stayed_aboard'] = '+10% (remained on sinking ship)';
    }

    if (flags.abandoned_ship) {
      deathChance -= 0.30;
      modifiers['abandoned_ship'] = '-30% (jumped overboard early, increased escape chance)';
    }

    if (flags.survival_priority && flags.prepared_for_disaster) {
      deathChance -= 0.15;
      modifiers['prepared_survival'] = '-15% (had survival gear ready)';
    }

    if (flags.quick_reaction) {
      deathChance -= 0.10;
      modifiers['quick_reaction'] = '-10% (reacted quickly, reached safer position)';
    }

    if (flags.helped_wounded) {
      deathChance -= 0.08;
      modifiers['topside_position'] = '-8% (was topside helping wounded, able to escape)';
    }

    if (flags.rescued_swimmers) {
      deathChance -= 0.12;
      modifiers['rescued_swimmers'] = '-12% (in water rescuing others = already off Arizona)';
    }

    if (flags.tactical_retreat) {
      deathChance -= 0.15;
      modifiers['tactical_retreat'] = '-15% (swam to another ship, off Arizona)';
    }

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
   * Baseline: ~2% death chance
   */
  _survivalAC(flags) {
    let deathChance = 0.02;
    const modifiers = {};

    if (flags.rushed_to_help || flags.went_to_harbor) {
      deathChance += 0.12;
      modifiers['entered_combat_zone'] = '+12% (moved toward active attack zone)';
    }

    if (flags.rescued_victim && flags.stayed_to_help) {
      deathChance += 0.10;
      modifiers['prolonged_exposure'] = '+10% (extended time in open during shell barrage)';
    } else if (flags.rescued_victim) {
      deathChance += 0.05;
      modifiers['rescue_exposure'] = '+5% (entered damaged structure to rescue victim)';
    }

    if (flags.took_cover && flags.self_preservation) {
      deathChance -= 0.008;
      modifiers['took_cover'] = '-0.8% (took immediate cover from falling shells)';
    }

    if (flags.saved_neighbor) {
      deathChance += 0.03;
      modifiers['exposed_for_neighbor'] = '+3% (briefly exposed protecting neighbor)';
    }

    if (flags.warned_others) {
      deathChance += 0.02;
      modifiers['warning_exposure'] = '+2% (stayed in open to warn others)';
    }

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

  // ─── RWANDA SURVIVAL METHODS ───────────────────────────────────────────────

  /**
   * Hutu Moderate (Augustin) survival
   *
   * Baseline: 15% death rate
   * Hutu moderates who sheltered Tutsi or refused to participate were
   * targeted by Interahamwe. Player is already on lists for refusing
   * to attend Hutu Power rallies — elevated baseline reflects this.
   *
   * Rescue path: high death risk (sheltering = death sentence if discovered)
   * Compliance path: lower death risk (militia trusts you — for now)
   * Flight path: low death risk (invisible, not participating)
   */
  _survivalHM(flags) {
    let deathChance = 0.15;
    const modifiers = {};

    // Rescue path — hiding Celestin is the most dangerous choice
    if (flags.rw_helped_celestin) {
      deathChance += 0.30;
      modifiers['sheltered_tutsi'] = '+30% (sheltering Tutsi is a death sentence if discovered)';
    }

    // Misdirecting the militia compounds the risk if discovered
    if (flags.rw_misdirected_militia) {
      deathChance += 0.15;
      modifiers['misdirected_militia'] = '+15% (lying to Interahamwe — discovery means death)';
    }

    // Saving people at roadblock — if militia finds out, instant execution
    if (flags.rw_saved_at_roadblock) {
      deathChance += 0.20;
      modifiers['saved_at_roadblock'] = '+20% (falsified identity cards — militia will discover this)';
    }

    // Compliance path — attending the rally buys protection
    if (flags.rw_attended_rally) {
      deathChance -= 0.08;
      modifiers['attended_rally'] = '-8% (demonstrated loyalty to Hutu Power)';
    }

    // Staffing roadblocks = trusted by militia = protected
    if (flags.rw_staffed_roadblock) {
      deathChance -= 0.10;
      modifiers['staffed_roadblock'] = '-10% (assigned role by militia commander, protected status)';
    }

    // Revealing Celestin = proof of loyalty = militia trusts you fully
    if (flags.rw_revealed_celestin) {
      deathChance -= 0.12;
      modifiers['revealed_celestin'] = '-12% (proved loyalty by revealing hiding Tutsi)';
    }

    // Direct participation = deepest militia trust, but RPF will find you later
    // (survival here = survived the genocide itself, not post-genocide justice)
    if (flags.rw_participated_directly) {
      deathChance -= 0.08;
      modifiers['participated_directly'] = '-8% (full militia member — protected during genocide)';
    }

    // Continued compliance = embedded in the machinery, militia won't target you
    if (flags.rw_continued_compliance) {
      deathChance -= 0.05;
      modifiers['continued_compliance'] = '-5% (consistent compliance, no suspicion)';
    }

    // Flight path — leaving Kigali removes you from the killing zone
    if (flags.rw_fled_kigali) {
      deathChance -= 0.10;
      modifiers['fled_kigali'] = '-10% (left the primary killing zone)';
    }

    if (flags.rw_stayed_hidden) {
      deathChance -= 0.08;
      modifiers['stayed_hidden'] = '-8% (maintained low profile in countryside)';
    }

    // Refusing to help initially is riskier than full compliance
    if (flags.rw_refused_help && !flags.rw_fled_kigali && !flags.rw_attended_rally) {
      deathChance += 0.10;
      modifiers['no_clear_alignment'] = '+10% (neither complied nor fled — suspicious to both sides)';
    }

    deathChance = Math.max(0.05, Math.min(0.85, deathChance));
    const roll     = Math.random();
    const survived = roll > deathChance;

    console.log(`[Survival] HM: deathChance=${(deathChance*100).toFixed(0)}% roll=${roll.toFixed(3)} survived=${survived}`);
    return { survived, deathChance, modifiers, roll };
  }

  /**
   * Tutsi Survivor (Immaculée) survival
   *
   * Baseline: 75% death rate
   * 500,000–800,000 of approximately 1,000,000 Tutsi killed in 100 days.
   * Every choice the player makes is about concealment vs. exposure.
   * Being found = almost certain death. Staying hidden = survival.
   */
  _survivalTS(flags) {
    let deathChance = 0.75;
    const modifiers = {};

    // Going to the church is historically the most dangerous choice —
    // churches became massacre sites across Rwanda
    if (flags.rw_trusted_church) {
      deathChance += 0.15;
      modifiers['trusted_church'] = '+15% (churches were primary massacre sites — false sanctuary)';
    }

    // Escaping the church during the massacre — chaos helps, but you're in the open
    if (flags.rw_escaped_church) {
      deathChance -= 0.20;
      modifiers['escaped_church'] = '-20% (escaped during attack chaos — out of massacre site)';
    }

    // Hiding in the church ceiling — extremely dangerous, but avoids the main hall
    if (flags.rw_hid_in_church) {
      deathChance -= 0.10;
      modifiers['hid_in_church'] = '-10% (concealed above massacre — not in main target zone)';
    }

    // Surviving the church hiding (stayed silent when militia searched)
    if (flags.rw_survived_church_hiding) {
      deathChance -= 0.25;
      modifiers['survived_church_hiding'] = '-25% (militia searched and missed — maximum concealment)';
    }

    // Seeking a Hutu friend — concealment with a protector
    if (flags.rw_sought_hutu_friend) {
      deathChance -= 0.15;
      modifiers['sought_hutu_friend'] = '-15% (concealed by Hutu protector — off the streets)';
    }

    // Hiding with Hutu friend
    if (flags.rw_hid_with_hutu) {
      deathChance -= 0.10;
      modifiers['hid_with_hutu'] = '-10% (in hiding with sympathetic Hutu family)';
    }

    // Trusting the protector (staying hidden in attic)
    if (flags.rw_trusted_protector) {
      deathChance -= 0.15;
      modifiers['trusted_protector'] = '-15% (remained concealed — protector held cover story)';
    }

    // Attempting the hotel — dangerous crossing, but safe destination
    if (flags.rw_attempted_hotel) {
      deathChance += 0.05;
      modifiers['attempted_hotel'] = '+5% (crossing roadblocks to reach hotel is high risk)';
    }

    // Using a false ID — the key survival mechanism at the roadblock
    if (flags.rw_used_false_id) {
      deathChance -= 0.30;
      modifiers['used_false_id'] = '-30% (Hutu identity card — passed militia checkpoint)';
    }

    // Reaching the hotel — UN protection, off the streets
    if (flags.rw_reached_hotel) {
      deathChance -= 0.20;
      modifiers['reached_hotel'] = '-20% (inside UN-protected enclave — militia held at perimeter)';
    }

    // Reaching UN protection after church escape
    if (flags.rw_reached_un_protection) {
      deathChance -= 0.25;
      modifiers['reached_un_protection'] = '-25% (UN convoy escort — formal protection status)';
    }

    // Witnessing the massacre — you're exposed but mobile
    if (flags.rw_witnessed_massacre) {
      deathChance += 0.05;
      modifiers['witnessed_massacre'] = '+5% (escaped massacre but still exposed in streets)';
    }

    deathChance = Math.max(0.05, Math.min(0.95, deathChance));
    const roll     = Math.random();
    const survived = roll > deathChance;

    console.log(`[Survival] TS: deathChance=${(deathChance*100).toFixed(0)}% roll=${roll.toFixed(3)} survived=${survived}`);
    return { survived, deathChance, modifiers, roll };
  }

  /**
   * UN Peacekeeper (Captain Marcus Webb) survival
   *
   * Baseline: 5% death rate
   * Most UNAMIR peacekeepers who stayed survived. The 10 Belgian peacekeepers
   * killed were a specific targeted event. Webb is Canadian — less targeted,
   * but defying orders and engaging militia raises his risk significantly.
   *
   * Stayed path: moderate risk (present, visible, potential militia target)
   * Evacuated path: very low risk (off the streets, following orders)
   * Documented path: low-moderate risk (exposed but militia treat as witness)
   */
  _survivalUN(flags) {
    let deathChance = 0.05;
    const modifiers = {};

    // Defying withdrawal orders — stays in Kigali during genocide peak
    if (flags.rw_defied_orders) {
      deathChance += 0.20;
      modifiers['defied_orders'] = '+20% (remained in Kigali against UN withdrawal — exposed position)';
    }

    // Holding the hotel after the attack masses — direct confrontation
    if (flags.rw_held_hotel) {
      deathChance += 0.15;
      modifiers['held_hotel'] = '+15% (held position against massing militia force)';
    }

    // Held position under attack — highest risk action in the game
    if (flags.rw_held_position) {
      deathChance += 0.25;
      modifiers['held_position'] = '+25% (held hotel perimeter during militia assault)';
    }

    // Staying after withdrawal (combined with defied orders = very exposed)
    if (flags.rw_stayed_after_withdrawal) {
      deathChance += 0.10;
      modifiers['stayed_after_withdrawal'] = '+10% (isolated with minimal force after UN withdrawal)';
    }

    // Following the mandate — working within the system, lower exposure
    if (flags.rw_followed_mandate) {
      deathChance -= 0.02;
      modifiers['followed_mandate'] = '-2% (operating within official UN parameters)';
    }

    // Protecting civilians at hotel (before defiance) — present but formal position
    if (flags.rw_protected_hotel) {
      deathChance += 0.03;
      modifiers['protected_hotel'] = '+3% (deployed to active civilian protection site)';
    }

    // Evacuation path — off the streets, following orders, lowest risk
    if (flags.rw_followed_evacuation_orders) {
      deathChance -= 0.03;
      modifiers['followed_evacuation_orders'] = '-3% (executing ordered convoy — militia lets UN through)';
    }

    // Saving Rwandans on convoy — defied orders, risked convoy stop
    if (flags.rw_saved_rwandans) {
      deathChance += 0.15;
      modifiers['saved_rwandans'] = '+15% (took unauthorized Rwandans — militia may stop convoy)';
    }

    // Left Rwanda — completely safe
    if (flags.rw_left_rwanda) {
      deathChance = 0.01;
      modifiers['left_rwanda'] = '→ 1% (departed Rwanda — out of genocide zone)';
    }

    // Documentation path — militia allow witnesses but not indefinitely
    if (flags.rw_chose_documentation) {
      deathChance += 0.08;
      modifiers['chose_documentation'] = '+8% (documented atrocities at massacre sites — exposed position)';
    }

    if (flags.rw_documented_evidence) {
      deathChance += 0.05;
      modifiers['documented_evidence'] = '+5% (gathered evidence at active massacre sites)';
    }

    if (flags.rw_witnessed_massacre) {
      deathChance += 0.05;
      modifiers['witnessed_massacre'] = '+5% (present at active massacre site)';
    }

    // Continued documentation — building a case, militia growing impatient
    if (flags.rw_continued_documentation) {
      deathChance += 0.05;
      modifiers['continued_documentation'] = '+5% (repeated presence at massacre sites raises militia suspicion)';
    }

    // Returned to duty after evacuation — back in the field
    if (flags.rw_returned_to_duty) {
      deathChance += 0.05;
      modifiers['returned_to_duty'] = '+5% (voluntarily returned to Kigali after evacuation)';
    }

    deathChance = Math.max(0.01, Math.min(0.80, deathChance));
    const roll     = Math.random();
    const survived = roll > deathChance;

    console.log(`[Survival] UN: deathChance=${(deathChance*100).toFixed(0)}% roll=${roll.toFixed(3)} survived=${survived}`);
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
    let bestScore   = -1;
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
