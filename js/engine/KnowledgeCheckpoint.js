/**
 * KnowledgeCheckpoint.js
 * Path-aware question selection for AP Knowledge Checkpoint
 * Selects questions based on player's narrative path
 */

import EventBus from './EventBus.js';
import PathClassifier from './PathClassifier.js';

export default class KnowledgeCheckpoint {
  constructor(eventBus, pathClassifier) {
    this.eventBus = eventBus;
    this.pathClassifier = pathClassifier;
    this.allQuestions = [];
  }

  /**
   * Load questions from content file
   * @param {Array} questions - Array of question objects from knowledge-questions.js
   */
  loadQuestions(questions) {
    this.allQuestions = questions;
  }

  /**
   * Select 3 questions for the current role
   * PathClassifier is Phase 3 — guard allows quiz to work without it
   * @param {string} roleId - Current role ID (e.g., 'japanese-aviator')
   * @returns {Array} - 3 selected questions
   */
  selectQuestions(roleId) {
    // PathClassifier is not built yet (Phase 3)
    // Return all questions so the quiz renders instead of crashing
    if (!this.pathClassifier || typeof this.pathClassifier.classify !== 'function') {
      return this.allQuestions;
    }

    // Filter questions by role
    const roleQuestions = this.allQuestions.filter(q =>
      q.roleSpecific === roleId
    );

    // Shuffle and select 3 questions
    const shuffled = this.shuffle([...roleQuestions]);
    return shuffled.slice(0, 3);
  }

  /**
   * Shuffle array using Fisher-Yates algorithm
   * @param {Array} array - Array to shuffle
   * @returns {Array} - Shuffled array
   */
  shuffle(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }
}
