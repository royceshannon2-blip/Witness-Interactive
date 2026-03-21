/**
 * StimuliManager Tests
 *
 * Unit tests for the StimuliManager engine component.
 * Covers: no-op on empty/null/absent stimuliUnlock, stimuli:shown events,
 * deduplication, answer flow, and dismiss flow.
 *
 * Requirements: 4.1, 4.3, 4.4, 4.5, 4.7, 4.8, 25.4
 */

import { describe, it, expect, beforeEach } from 'vitest';
import StimuliManager from './StimuliManager.js';
import EventBus from './EventBus.js';

// Helper: collect all emitted events of a given name
function collectEvents(eventBus, eventName) {
  const collected = [];
  eventBus.on(eventName, (data) => collected.push(data));
  return collected;
}

// Helper: emit a scene:transition with a given scene object
function emitSceneTransition(eventBus, scene) {
  eventBus.emit('scene:transition', { scene });
}

describe('StimuliManager', () => {
  let eventBus;
  let manager;

  beforeEach(() => {
    eventBus = new EventBus();
    manager = new StimuliManager(eventBus);
  });

  // ─── No-op on empty / null / absent stimuliUnlock ───────────────────────────

  describe('no-op behavior (Requirement 4.8)', () => {
    it('emits zero stimuli:shown events when stimuliUnlock is absent', () => {
      const shown = collectEvents(eventBus, 'stimuli:shown');
      emitSceneTransition(eventBus, { id: 'scene-01', narrative: 'test' });
      expect(shown).toHaveLength(0);
    });

    it('emits zero stimuli:shown events when stimuliUnlock is null', () => {
      const shown = collectEvents(eventBus, 'stimuli:shown');
      emitSceneTransition(eventBus, { id: 'scene-01', stimuliUnlock: null });
      expect(shown).toHaveLength(0);
    });

    it('emits zero stimuli:shown events when stimuliUnlock is empty array', () => {
      const shown = collectEvents(eventBus, 'stimuli:shown');
      emitSceneTransition(eventBus, { id: 'scene-01', stimuliUnlock: [] });
      expect(shown).toHaveLength(0);
    });

    it('emits zero stimuli:shown events when scene data is null', () => {
      const shown = collectEvents(eventBus, 'stimuli:shown');
      eventBus.emit('scene:transition', null);
      expect(shown).toHaveLength(0);
    });

    it('emits zero stimuli:shown events when scene data is undefined', () => {
      const shown = collectEvents(eventBus, 'stimuli:shown');
      eventBus.emit('scene:transition', undefined);
      expect(shown).toHaveLength(0);
    });
  });

  // ─── stimuli:shown fires for each doc in array ───────────────────────────────

  describe('stimuli:shown events (Requirements 4.1, 4.3)', () => {
    it('emits stimuli:shown for a single document', () => {
      const shown = collectEvents(eventBus, 'stimuli:shown');
      emitSceneTransition(eventBus, { stimuliUnlock: ['hm-doc-1a'] });
      expect(shown).toHaveLength(1);
      expect(shown[0].documentId).toBe('hm-doc-1a');
    });

    it('emits stimuli:shown for the first document in an array immediately', () => {
      const shown = collectEvents(eventBus, 'stimuli:shown');
      emitSceneTransition(eventBus, { stimuliUnlock: ['hm-doc-1a', 'hm-doc-2'] });
      // Only first doc shown immediately; second waits for dismiss
      expect(shown).toHaveLength(1);
      expect(shown[0].documentId).toBe('hm-doc-1a');
    });

    it('shows second document after first is dismissed', () => {
      const shown = collectEvents(eventBus, 'stimuli:shown');
      emitSceneTransition(eventBus, { stimuliUnlock: ['hm-doc-1a', 'hm-doc-2'] });

      // Answer and dismiss first doc
      eventBus.emit('stimuli:answer-submitted', {
        documentId: 'hm-doc-1a',
        selectedId: 'a',
        correct: true
      });
      eventBus.emit('stimuli:dismiss-requested', { documentId: 'hm-doc-1a' });

      expect(shown).toHaveLength(2);
      expect(shown[1].documentId).toBe('hm-doc-2');
    });

    it('shows all documents in order when each is answered and dismissed', () => {
      const shown = collectEvents(eventBus, 'stimuli:shown');
      const docs = ['hm-doc-0', 'hm-doc-1a', 'hm-doc-3'];
      emitSceneTransition(eventBus, { stimuliUnlock: docs });

      for (const docId of docs) {
        eventBus.emit('stimuli:answer-submitted', { documentId: docId, selectedId: 'b', correct: false });
        eventBus.emit('stimuli:dismiss-requested', { documentId: docId });
      }

      expect(shown).toHaveLength(3);
      expect(shown.map(e => e.documentId)).toEqual(docs);
    });
  });

  // ─── Deduplication (Property 17 / Requirement 25.4) ─────────────────────────

  describe('deduplication (Property 17)', () => {
    it('does not emit stimuli:shown for a document already shown in the same session', () => {
      const shown = collectEvents(eventBus, 'stimuli:shown');

      // First scene shows hm-doc-1a
      emitSceneTransition(eventBus, { stimuliUnlock: ['hm-doc-1a'] });
      eventBus.emit('stimuli:answer-submitted', { documentId: 'hm-doc-1a', selectedId: 'a', correct: true });
      eventBus.emit('stimuli:dismiss-requested', { documentId: 'hm-doc-1a' });

      // Second scene also lists hm-doc-1a — should be skipped
      emitSceneTransition(eventBus, { stimuliUnlock: ['hm-doc-1a'] });

      expect(shown).toHaveLength(1);
    });

    it('shows a new document even if a previous one was deduplicated', () => {
      const shown = collectEvents(eventBus, 'stimuli:shown');

      // First scene shows hm-doc-1a
      emitSceneTransition(eventBus, { stimuliUnlock: ['hm-doc-1a'] });
      eventBus.emit('stimuli:answer-submitted', { documentId: 'hm-doc-1a', selectedId: 'a', correct: true });
      eventBus.emit('stimuli:dismiss-requested', { documentId: 'hm-doc-1a' });

      // Second scene: hm-doc-1a (dup) + hm-doc-2 (new)
      emitSceneTransition(eventBus, { stimuliUnlock: ['hm-doc-1a', 'hm-doc-2'] });

      expect(shown).toHaveLength(2);
      expect(shown[1].documentId).toBe('hm-doc-2');
    });

    it('tracks shown documents in shownDocuments Set', () => {
      emitSceneTransition(eventBus, { stimuliUnlock: ['hm-doc-3'] });
      expect(manager.shownDocuments.has('hm-doc-3')).toBe(true);
    });
  });

  // ─── Answer and dismiss flow ─────────────────────────────────────────────────

  describe('answer and dismiss flow (Requirements 4.3, 4.4, 4.5)', () => {
    it('emits stimuli:pause-question-answered after answer submitted', () => {
      const answered = collectEvents(eventBus, 'stimuli:pause-question-answered');
      emitSceneTransition(eventBus, { stimuliUnlock: ['hm-doc-3'] });

      eventBus.emit('stimuli:answer-submitted', {
        documentId: 'hm-doc-3',
        selectedId: 'b',
        correct: true
      });

      expect(answered).toHaveLength(1);
      expect(answered[0]).toEqual({ documentId: 'hm-doc-3', correct: true, selectedId: 'b' });
    });

    it('emits stimuli:dismissed after answer + dismiss', () => {
      const dismissed = collectEvents(eventBus, 'stimuli:dismissed');
      emitSceneTransition(eventBus, { stimuliUnlock: ['hm-doc-3'] });

      eventBus.emit('stimuli:answer-submitted', { documentId: 'hm-doc-3', selectedId: 'b', correct: true });
      eventBus.emit('stimuli:dismiss-requested', { documentId: 'hm-doc-3' });

      expect(dismissed).toHaveLength(1);
      expect(dismissed[0].documentId).toBe('hm-doc-3');
      expect(dismissed[0].answeredCorrectly).toBe(true);
    });

    it('does NOT emit stimuli:dismissed if dismiss requested before answer', () => {
      const dismissed = collectEvents(eventBus, 'stimuli:dismissed');
      emitSceneTransition(eventBus, { stimuliUnlock: ['hm-doc-3'] });

      // Dismiss without answering first
      eventBus.emit('stimuli:dismiss-requested', { documentId: 'hm-doc-3' });

      expect(dismissed).toHaveLength(0);
    });

    it('records answeredCorrectly = false for wrong answer', () => {
      const dismissed = collectEvents(eventBus, 'stimuli:dismissed');
      emitSceneTransition(eventBus, { stimuliUnlock: ['hm-doc-3'] });

      eventBus.emit('stimuli:answer-submitted', { documentId: 'hm-doc-3', selectedId: 'a', correct: false });
      eventBus.emit('stimuli:dismiss-requested', { documentId: 'hm-doc-3' });

      expect(dismissed[0].answeredCorrectly).toBe(false);
    });

    it('ignores answer-submitted for a different documentId', () => {
      const answered = collectEvents(eventBus, 'stimuli:pause-question-answered');
      emitSceneTransition(eventBus, { stimuliUnlock: ['hm-doc-3'] });

      eventBus.emit('stimuli:answer-submitted', {
        documentId: 'hm-doc-WRONG',
        selectedId: 'a',
        correct: true
      });

      expect(answered).toHaveLength(0);
    });

    it('ignores dismiss-requested for a different documentId', () => {
      const dismissed = collectEvents(eventBus, 'stimuli:dismissed');
      emitSceneTransition(eventBus, { stimuliUnlock: ['hm-doc-3'] });

      eventBus.emit('stimuli:answer-submitted', { documentId: 'hm-doc-3', selectedId: 'b', correct: true });
      eventBus.emit('stimuli:dismiss-requested', { documentId: 'hm-doc-WRONG' });

      expect(dismissed).toHaveLength(0);
    });
  });

  // ─── forceAllowDismiss (missing pauseQuestion fallback) ──────────────────────

  describe('forceAllowDismiss (missing pauseQuestion fallback)', () => {
    it('allows dismiss after forceAllowDismiss is called', () => {
      const dismissed = collectEvents(eventBus, 'stimuli:dismissed');
      emitSceneTransition(eventBus, { stimuliUnlock: ['hm-doc-3'] });

      manager.forceAllowDismiss('hm-doc-3');
      eventBus.emit('stimuli:dismiss-requested', { documentId: 'hm-doc-3' });

      expect(dismissed).toHaveLength(1);
    });

    it('forceAllowDismiss is a no-op for wrong documentId', () => {
      const dismissed = collectEvents(eventBus, 'stimuli:dismissed');
      emitSceneTransition(eventBus, { stimuliUnlock: ['hm-doc-3'] });

      manager.forceAllowDismiss('hm-doc-WRONG');
      eventBus.emit('stimuli:dismiss-requested', { documentId: 'hm-doc-3' });

      // Still blocked — wrong doc was force-allowed
      expect(dismissed).toHaveLength(0);
    });
  });

  // ─── noPauseQuestion flag ────────────────────────────────────────────────────

  describe('noPauseQuestion flag on dismiss-requested', () => {
    it('allows dismiss when noPauseQuestion flag is set (data error fallback)', () => {
      const dismissed = collectEvents(eventBus, 'stimuli:dismissed');
      emitSceneTransition(eventBus, { stimuliUnlock: ['hm-doc-3'] });

      eventBus.emit('stimuli:dismiss-requested', { documentId: 'hm-doc-3', noPauseQuestion: true });

      expect(dismissed).toHaveLength(1);
    });
  });
});
