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
   * Select 5 questions based on player's path
   * @param {Object} flags - Player's choice flags
   * @param {Array} pathRules - Path classification rules
   * @returns {Array} - 5 selected questions
   */
  selectQuestions(flags, pathRules) {
    // Classify player's path using static method
    const playerPath = PathClassifier.classify(flags, pathRules);

    // Filter questions by path variant
    const pathSpecificQuestions = this.allQuestions.filter(q => 
      q.pathVariant === playerPath || q.pathVariant === 'general'
    );

    // Prioritize path-specific questions
    const pathOnlyQuestions = pathSpecificQuestions.filter(q => q.pathVariant === playerPath);
    const generalQuestions = pathSpecificQuestions.filter(q => q.pathVariant === 'general');

    // Select 3 path-specific + 2 general (or adjust if not enough)
    const selected = [];
    
    // Add path-specific questions first
    const shuffledPathQuestions = this.shuffle([...pathOnlyQuestions]);
    selected.push(...shuffledPathQuestions.slice(0, Math.min(3, shuffledPathQuestions.length)));

    // Fill remaining slots with general questions
    const remaining = 5 - selected.length;
    const shuffledGeneralQuestions = this.shuffle([...generalQuestions]);
    selected.push(...shuffledGeneralQuestions.slice(0, remaining));

    // If still not enough, add more path-specific
    if (selected.length < 5) {
      selected.push(...shuffledPathQuestions.slice(3, 5));
    }

    return selected.slice(0, 5);
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
