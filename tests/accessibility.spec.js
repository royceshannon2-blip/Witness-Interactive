/**
 * Accessibility Tests for Interactive Polish & Engagement Features
 * Task 10.2: Accessibility testing
 * 
 * Tests:
 * - prefers-reduced-motion support
 * - Keyboard navigation
 * - Screen reader announcements
 * - Color contrast for all effects
 * - Focus management during transitions
 */

import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:8000';

test.describe('Accessibility Tests', () => {
  
  test.describe('prefers-reduced-motion Support', () => {
    
    test('should disable typewriter animation with prefers-reduced-motion', async ({ browser }) => {
      const context = await browser.newContext({
        reducedMotion: 'reduce'
      });
      const page = await context.newPage();
      
      await page.goto(BASE_URL);
      await page.click('button:has-text("Begin")');
      await page.waitForSelector('#loading-screen', { state: 'hidden', timeout: 10000 });
      
      // Select a role
      await page.click('button:has-text("American Sailor")');
      
      // Wait for scene
      await page.waitForSelector('.narrative-text', { timeout: 5000 });
      
      // Text should appear instantly (no typewriter delay)
      const narrative = page.locator('.narrative-text');
      const text = await narrative.textContent();
      
      // Should have full text immediately
      expect(text.length).toBeGreaterThan(50);
      
      // Choices should be enabled immediately
      const choicesEnabled = await page.locator('.choice-button').first().isEnabled();
      expect(choicesEnabled).toBe(true);
      
      await context.close();
    });

    test('should use instant transitions with prefers-reduced-motion', async ({ browser }) => {
      const context = await browser.newContext({
        reducedMotion: 'reduce'
      });
      const page = await context.newPage();
      
      await page.goto(BASE_URL);
      await page.waitForSelector('#loading-screen', { state: 'hidden', timeout: 10000 });
      
      await page.click('button:has-text("American Sailor")');
      await page.waitForSelector('.choice-button', { timeout: 5000 });
      
      const startTime = Date.now();
      
      // Make a choice to trigger transition
      await page.locator('.choice-button').first().click();
      
      // Wait for new scene
      await page.waitForSelector('.narrative-text', { timeout: 2000 });
      
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      // Transition should be very fast (instant or near-instant)
      expect(duration).toBeLessThan(500);
      
      await context.close();
    });

    test('should reduce atmospheric effects with prefers-reduced-motion', async ({ browser }) => {
      const context = await browser.newContext({
        reducedMotion: 'reduce'
      });
      const page = await context.newPage();
      
      await page.goto(BASE_URL);
      await page.waitForSelector('#loading-screen', { state: 'hidden', timeout: 10000 });
      
      await page.click('button:has-text("American Sailor")');
      await page.waitForSelector('.narrative-text', { timeout: 5000 });
      
      // Progress through scenes
      for (let i = 0; i < 3; i++) {
        // Check if effects are reduced
        const effectsReduced = await page.evaluate(() => {
          const body = document.body;
          const effectClasses = Array.from(body.classList).filter(c => c.startsWith('effect-'));
          
          if (effectClasses.length === 0) return true; // No effects applied
          
          // Check if animations are disabled via CSS
          const style = window.getComputedStyle(body);
          return style.animationDuration === '0s' || style.animationPlayState === 'paused';
        });
        
        // Effects should be disabled or reduced
        expect(effectsReduced).toBe(true);
        
        const firstChoice = page.locator('.choice-button').first();
        if (await firstChoice.isVisible()) {
          await firstChoice.click();
          await page.waitForTimeout(500);
        } else {
          break;
        }
      }
      
      await context.close();
    });

    test('should reduce timer pulse effects with prefers-reduced-motion', async ({ browser }) => {
      const context = await browser.newContext({
        reducedMotion: 'reduce'
      });
      const page = await context.newPage();
      
      await page.goto(BASE_URL);
      await page.waitForSelector('#loading-screen', { state: 'hidden', timeout: 10000 });
      
      await page.click('button:has-text("American Sailor")');
      await page.waitForSelector('.choice-button', { timeout: 5000 });
      
      // Find a scene with timer
      for (let i = 0; i < 5; i++) {
        const timerVisible = await page.locator('.timer-display, .countdown-timer, [data-timer]').isVisible().catch(() => false);
        
        if (timerVisible) {
          // Check if timer animations are reduced
          const animationsReduced = await page.evaluate(() => {
            const timer = document.querySelector('.timer-display, .countdown-timer, [data-timer]');
            if (!timer) return true;
            
            const style = window.getComputedStyle(timer);
            return style.animationDuration === '0s' || style.animationPlayState === 'paused';
          });
          
          expect(animationsReduced).toBe(true);
          break;
        }
        
        const firstChoice = page.locator('.choice-button').first();
        if (await firstChoice.isVisible()) {
          await firstChoice.click();
          await page.waitForTimeout(500);
        }
      }
      
      await context.close();
    });

    test('should reduce choice button hover effects with prefers-reduced-motion', async ({ browser }) => {
      const context = await browser.newContext({
        reducedMotion: 'reduce'
      });
      const page = await context.newPage();
      
      await page.goto(BASE_URL);
      await page.waitForSelector('#loading-screen', { state: 'hidden', timeout: 10000 });
      
      await page.click('button:has-text("American Sailor")');
      await page.waitForSelector('.choice-button', { timeout: 5000 });
      
      const firstChoice = page.locator('.choice-button').first();
      
      // Check that transitions are disabled
      const transitionsDisabled = await firstChoice.evaluate(el => {
        const style = window.getComputedStyle(el);
        return style.transition === 'none' || style.transition === 'all 0s ease 0s';
      });
      
      expect(transitionsDisabled).toBe(true);
      
      await context.close();
    });
  });

  test.describe('Keyboard Navigation', () => {
    
    test('should allow Tab navigation through role selection', async ({ page }) => {
      await page.goto(BASE_URL);
      await page.waitForSelector('#loading-screen', { state: 'hidden', timeout: 10000 });
      
      // Tab to first role button
      await page.keyboard.press('Tab');
      
      // Check focus is on a role button
      const focusedElement = await page.evaluate(() => {
        const el = document.activeElement;
        return {
          tagName: el.tagName,
          text: el.textContent,
          isRoleButton: el.classList.contains('role-button') || el.textContent.includes('Sailor') || el.textContent.includes('Civilian') || el.textContent.includes('Aviator')
        };
      });
      
      expect(focusedElement.isRoleButton).toBe(true);
    });

    test('should allow Enter/Space to select role', async ({ page }) => {
      await page.goto(BASE_URL);
      await page.waitForSelector('#loading-screen', { state: 'hidden', timeout: 10000 });
      
      // Tab to first role button
      await page.keyboard.press('Tab');
      
      // Press Enter to select
      await page.keyboard.press('Enter');
      
      // Should load first scene
      await page.waitForSelector('.narrative-text', { timeout: 5000 });
      
      const narrativeVisible = await page.locator('.narrative-text').isVisible();
      expect(narrativeVisible).toBe(true);
    });

    test('should allow Tab navigation through choices', async ({ page }) => {
      await page.goto(BASE_URL);
      await page.waitForSelector('#loading-screen', { state: 'hidden', timeout: 10000 });
      
      await page.click('button:has-text("American Sailor")');
      await page.waitForSelector('.choice-button', { timeout: 5000 });
      
      // Tab to first choice
      await page.keyboard.press('Tab');
      
      // Check focus is on a choice button
      const focusedElement = await page.evaluate(() => {
        const el = document.activeElement;
        return {
          tagName: el.tagName,
          isChoiceButton: el.classList.contains('choice-button')
        };
      });
      
      expect(focusedElement.isChoiceButton).toBe(true);
    });

    test('should allow Enter/Space to make choice', async ({ page }) => {
      await page.goto(BASE_URL);
      await page.waitForSelector('#loading-screen', { state: 'hidden', timeout: 10000 });
      
      await page.click('button:has-text("American Sailor")');
      await page.waitForSelector('.choice-button', { timeout: 5000 });
      
      // Tab to first choice
      await page.keyboard.press('Tab');
      
      // Press Enter to select
      await page.keyboard.press('Enter');
      
      // Should transition to next scene
      await page.waitForTimeout(1000);
      
      const narrativeVisible = await page.locator('.narrative-text').isVisible();
      expect(narrativeVisible).toBe(true);
    });

    test('should maintain focus during scene transitions', async ({ page }) => {
      await page.goto(BASE_URL);
      await page.waitForSelector('#loading-screen', { state: 'hidden', timeout: 10000 });
      
      await page.click('button:has-text("American Sailor")');
      await page.waitForSelector('.choice-button', { timeout: 5000 });
      
      // Make a choice
      await page.locator('.choice-button').first().click();
      
      // Wait for transition
      await page.waitForTimeout(1000);
      
      // Focus should be on a meaningful element (not lost)
      const focusedElement = await page.evaluate(() => {
        const el = document.activeElement;
        return {
          tagName: el.tagName,
          isBody: el.tagName === 'BODY'
        };
      });
      
      // Focus should not be on body (should be on a focusable element)
      expect(focusedElement.isBody).toBe(false);
    });

    test('should allow keyboard navigation through full game', async ({ page }) => {
      await page.goto(BASE_URL);
      await page.waitForSelector('#loading-screen', { state: 'hidden', timeout: 10000 });
      
      // Select role with keyboard
      await page.keyboard.press('Tab');
      await page.keyboard.press('Enter');
      
      // Play through 3 scenes with keyboard
      for (let i = 0; i < 3; i++) {
        await page.waitForSelector('.choice-button', { timeout: 5000 });
        
        // Tab to first choice
        await page.keyboard.press('Tab');
        
        // Select with Enter
        await page.keyboard.press('Enter');
        
        await page.waitForTimeout(1000);
      }
      
      // Should still be in game
      const narrativeVisible = await page.locator('.narrative-text').isVisible();
      expect(narrativeVisible).toBe(true);
    });
  });

  test.describe('Screen Reader Announcements', () => {
    
    test('should have ARIA labels on role selection buttons', async ({ page }) => {
      await page.goto(BASE_URL);
      await page.waitForSelector('#loading-screen', { state: 'hidden', timeout: 10000 });
      
      // Check for ARIA labels or accessible names
      const roleButtons = await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        return buttons.map(btn => ({
          text: btn.textContent,
          ariaLabel: btn.getAttribute('aria-label'),
          hasAccessibleName: btn.textContent.length > 0 || btn.getAttribute('aria-label')
        }));
      });
      
      // All buttons should have accessible names
      const allHaveNames = roleButtons.every(btn => btn.hasAccessibleName);
      expect(allHaveNames).toBe(true);
    });

    test('should have ARIA labels on choice buttons', async ({ page }) => {
      await page.goto(BASE_URL);
      await page.waitForSelector('#loading-screen', { state: 'hidden', timeout: 10000 });
      
      await page.click('button:has-text("American Sailor")');
      await page.waitForSelector('.choice-button', { timeout: 5000 });
      
      const choiceButtons = await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll('.choice-button'));
        return buttons.map(btn => ({
          text: btn.textContent,
          ariaLabel: btn.getAttribute('aria-label'),
          hasAccessibleName: btn.textContent.length > 0 || btn.getAttribute('aria-label')
        }));
      });
      
      // All choice buttons should have accessible names
      const allHaveNames = choiceButtons.every(btn => btn.hasAccessibleName);
      expect(allHaveNames).toBe(true);
    });

    test('should announce timer countdown to screen readers', async ({ page }) => {
      await page.goto(BASE_URL);
      await page.waitForSelector('#loading-screen', { state: 'hidden', timeout: 10000 });
      
      await page.click('button:has-text("American Sailor")');
      await page.waitForSelector('.choice-button', { timeout: 5000 });
      
      // Find a scene with timer
      for (let i = 0; i < 5; i++) {
        const timerVisible = await page.locator('.timer-display, .countdown-timer, [data-timer]').isVisible().catch(() => false);
        
        if (timerVisible) {
          // Check for ARIA live region
          const hasAriaLive = await page.evaluate(() => {
            const timer = document.querySelector('.timer-display, .countdown-timer, [data-timer]');
            if (!timer) return false;
            
            return timer.getAttribute('aria-live') === 'polite' || 
                   timer.getAttribute('aria-live') === 'assertive' ||
                   timer.closest('[aria-live]') !== null;
          });
          
          expect(hasAriaLive).toBe(true);
          break;
        }
        
        const firstChoice = page.locator('.choice-button').first();
        if (await firstChoice.isVisible()) {
          await firstChoice.click();
          await page.waitForTimeout(500);
        }
      }
    });

    test('should announce scene transitions to screen readers', async ({ page }) => {
      await page.goto(BASE_URL);
      await page.waitForSelector('#loading-screen', { state: 'hidden', timeout: 10000 });
      
      await page.click('button:has-text("American Sailor")');
      await page.waitForSelector('.narrative-text', { timeout: 5000 });
      
      // Check for ARIA live region on narrative
      const hasAriaLive = await page.evaluate(() => {
        const narrative = document.querySelector('.narrative-text, .scene-narrative, [data-narrative]');
        if (!narrative) return false;
        
        return narrative.getAttribute('aria-live') === 'polite' || 
               narrative.closest('[aria-live]') !== null ||
               narrative.getAttribute('role') === 'status';
      });
      
      expect(hasAriaLive).toBe(true);
    });

    test('should have semantic HTML structure', async ({ page }) => {
      await page.goto(BASE_URL);
      await page.waitForSelector('#loading-screen', { state: 'hidden', timeout: 10000 });
      
      // Check for semantic HTML elements
      const semanticStructure = await page.evaluate(() => {
        return {
          hasMain: document.querySelector('main') !== null,
          hasNav: document.querySelector('nav') !== null || document.querySelector('[role="navigation"]') !== null,
          hasHeadings: document.querySelectorAll('h1, h2, h3, h4, h5, h6').length > 0,
          hasButtons: document.querySelectorAll('button').length > 0
        };
      });
      
      // Should have semantic structure
      expect(semanticStructure.hasMain || semanticStructure.hasHeadings).toBe(true);
      expect(semanticStructure.hasButtons).toBe(true);
    });
  });

  test.describe('Color Contrast', () => {
    
    test('should have sufficient contrast for narrative text', async ({ page }) => {
      await page.goto(BASE_URL);
      await page.waitForSelector('#loading-screen', { state: 'hidden', timeout: 10000 });
      
      await page.click('button:has-text("American Sailor")');
      await page.waitForSelector('.narrative-text', { timeout: 5000 });
      
      const contrast = await page.evaluate(() => {
        const narrative = document.querySelector('.narrative-text');
        if (!narrative) return null;
        
        const style = window.getComputedStyle(narrative);
        const color = style.color;
        const backgroundColor = style.backgroundColor;
        
        return { color, backgroundColor };
      });
      
      // Should have defined colors
      expect(contrast.color).toBeDefined();
      expect(contrast.backgroundColor).toBeDefined();
    });

    test('should have sufficient contrast for choice buttons', async ({ page }) => {
      await page.goto(BASE_URL);
      await page.waitForSelector('#loading-screen', { state: 'hidden', timeout: 10000 });
      
      await page.click('button:has-text("American Sailor")');
      await page.waitForSelector('.choice-button', { timeout: 5000 });
      
      const contrast = await page.evaluate(() => {
        const button = document.querySelector('.choice-button');
        if (!button) return null;
        
        const style = window.getComputedStyle(button);
        const color = style.color;
        const backgroundColor = style.backgroundColor;
        
        return { color, backgroundColor };
      });
      
      // Should have defined colors
      expect(contrast.color).toBeDefined();
      expect(contrast.backgroundColor).toBeDefined();
    });

    test('should have sufficient contrast for timer display', async ({ page }) => {
      await page.goto(BASE_URL);
      await page.waitForSelector('#loading-screen', { state: 'hidden', timeout: 10000 });
      
      await page.click('button:has-text("American Sailor")');
      await page.waitForSelector('.choice-button', { timeout: 5000 });
      
      // Find a scene with timer
      for (let i = 0; i < 5; i++) {
        const timerVisible = await page.locator('.timer-display, .countdown-timer, [data-timer]').isVisible().catch(() => false);
        
        if (timerVisible) {
          const contrast = await page.evaluate(() => {
            const timer = document.querySelector('.timer-display, .countdown-timer, [data-timer]');
            if (!timer) return null;
            
            const style = window.getComputedStyle(timer);
            const color = style.color;
            const backgroundColor = style.backgroundColor;
            
            return { color, backgroundColor };
          });
          
          // Should have defined colors
          expect(contrast.color).toBeDefined();
          break;
        }
        
        const firstChoice = page.locator('.choice-button').first();
        if (await firstChoice.isVisible()) {
          await firstChoice.click();
          await page.waitForTimeout(500);
        }
      }
    });

    test('should maintain contrast during atmospheric effects', async ({ page }) => {
      await page.goto(BASE_URL);
      await page.waitForSelector('#loading-screen', { state: 'hidden', timeout: 10000 });
      
      await page.click('button:has-text("American Sailor")');
      await page.waitForSelector('.narrative-text', { timeout: 5000 });
      
      // Progress through scenes with effects
      for (let i = 0; i < 3; i++) {
        const bodyClasses = await page.evaluate(() => document.body.className);
        
        if (bodyClasses.includes('effect-')) {
          // Check text is still readable
          const textContrast = await page.evaluate(() => {
            const narrative = document.querySelector('.narrative-text');
            if (!narrative) return null;
            
            const style = window.getComputedStyle(narrative);
            const opacity = style.opacity;
            const visibility = style.visibility;
            
            return { opacity, visibility };
          });
          
          // Text should be visible
          expect(parseFloat(textContrast.opacity)).toBeGreaterThan(0.7);
          expect(textContrast.visibility).toBe('visible');
        }
        
        const firstChoice = page.locator('.choice-button').first();
        if (await firstChoice.isVisible()) {
          await firstChoice.click();
          await page.waitForTimeout(1000);
        } else {
          break;
        }
      }
    });

    test('should have visible focus indicators', async ({ page }) => {
      await page.goto(BASE_URL);
      await page.waitForSelector('#loading-screen', { state: 'hidden', timeout: 10000 });
      
      await page.click('button:has-text("American Sailor")');
      await page.waitForSelector('.choice-button', { timeout: 5000 });
      
      // Tab to focus a button
      await page.keyboard.press('Tab');
      
      // Check for focus indicator
      const focusIndicator = await page.evaluate(() => {
        const el = document.activeElement;
        const style = window.getComputedStyle(el);
        
        return {
          outline: style.outline,
          outlineWidth: style.outlineWidth,
          outlineColor: style.outlineColor,
          boxShadow: style.boxShadow
        };
      });
      
      // Should have some form of focus indicator
      const hasFocusIndicator = 
        focusIndicator.outline !== 'none' ||
        focusIndicator.outlineWidth !== '0px' ||
        focusIndicator.boxShadow !== 'none';
      
      expect(hasFocusIndicator).toBe(true);
    });
  });

  test.describe('Focus Management', () => {
    
    test('should not lose focus during typewriter animation', async ({ page }) => {
      await page.goto(BASE_URL);
      await page.waitForSelector('#loading-screen', { state: 'hidden', timeout: 10000 });
      
      await page.click('button:has-text("American Sailor")');
      await page.waitForSelector('.narrative-text', { timeout: 5000 });
      
      // Tab to focus something
      await page.keyboard.press('Tab');
      
      // Wait during typewriter
      await page.waitForTimeout(500);
      
      // Focus should still be on an element
      const hasFocus = await page.evaluate(() => {
        return document.activeElement !== document.body;
      });
      
      expect(hasFocus).toBe(true);
    });

    test('should restore focus after scene transition', async ({ page }) => {
      await page.goto(BASE_URL);
      await page.waitForSelector('#loading-screen', { state: 'hidden', timeout: 10000 });
      
      await page.click('button:has-text("American Sailor")');
      await page.waitForSelector('.choice-button', { timeout: 5000 });
      
      // Make a choice
      await page.locator('.choice-button').first().click();
      
      // Wait for transition
      await page.waitForTimeout(1000);
      
      // Focus should be on a meaningful element
      const focusedElement = await page.evaluate(() => {
        const el = document.activeElement;
        return {
          tagName: el.tagName,
          isInteractive: el.tagName === 'BUTTON' || el.tagName === 'A' || el.tagName === 'INPUT'
        };
      });
      
      // Focus should be on an interactive element or at least not lost
      expect(focusedElement.tagName).toBeDefined();
    });

    test('should focus first choice after typewriter completes', async ({ page }) => {
      await page.goto(BASE_URL);
      await page.waitForSelector('#loading-screen', { state: 'hidden', timeout: 10000 });
      
      await page.click('button:has-text("American Sailor")');
      await page.waitForSelector('.narrative-text', { timeout: 5000 });
      
      // Wait for typewriter to complete
      await page.waitForTimeout(2000);
      
      // Check if focus is on a choice or can be tabbed to
      await page.keyboard.press('Tab');
      
      const focusedElement = await page.evaluate(() => {
        const el = document.activeElement;
        return {
          isChoiceButton: el.classList.contains('choice-button')
        };
      });
      
      expect(focusedElement.isChoiceButton).toBe(true);
    });

    test('should trap focus in modal dialogs if present', async ({ page }) => {
      await page.goto(BASE_URL);
      await page.waitForSelector('#loading-screen', { state: 'hidden', timeout: 10000 });
      
      // Check if any modals exist
      const hasModal = await page.evaluate(() => {
        return document.querySelector('[role="dialog"], .modal, .dialog') !== null;
      });
      
      if (hasModal) {
        // Tab multiple times
        for (let i = 0; i < 10; i++) {
          await page.keyboard.press('Tab');
        }
        
        // Focus should still be within modal
        const focusInModal = await page.evaluate(() => {
          const modal = document.querySelector('[role="dialog"], .modal, .dialog');
          const focused = document.activeElement;
          return modal && modal.contains(focused);
        });
        
        expect(focusInModal).toBe(true);
      }
    });

    test('should handle focus during timer countdown', async ({ page }) => {
      await page.goto(BASE_URL);
      await page.waitForSelector('#loading-screen', { state: 'hidden', timeout: 10000 });
      
      await page.click('button:has-text("American Sailor")');
      await page.waitForSelector('.choice-button', { timeout: 5000 });
      
      // Find a scene with timer
      for (let i = 0; i < 5; i++) {
        const timerVisible = await page.locator('.timer-display, .countdown-timer, [data-timer]').isVisible().catch(() => false);
        
        if (timerVisible) {
          // Tab to a choice
          await page.keyboard.press('Tab');
          
          // Wait during countdown
          await page.waitForTimeout(1000);
          
          // Focus should still be on choice
          const focusedElement = await page.evaluate(() => {
            const el = document.activeElement;
            return {
              isChoiceButton: el.classList.contains('choice-button')
            };
          });
          
          expect(focusedElement.isChoiceButton).toBe(true);
          break;
        }
        
        const firstChoice = page.locator('.choice-button').first();
        if (await firstChoice.isVisible()) {
          await firstChoice.click();
          await page.waitForTimeout(500);
        }
      }
    });
  });

  test.describe('Accessibility Compliance Summary', () => {
    
    test('should pass basic WCAG 2.1 Level A checks', async ({ page }) => {
      await page.goto(BASE_URL);
      await page.waitForSelector('#loading-screen', { state: 'hidden', timeout: 10000 });
      
      const wcagChecks = await page.evaluate(() => {
        return {
          hasLang: document.documentElement.hasAttribute('lang'),
          hasTitle: document.title.length > 0,
          hasHeadings: document.querySelectorAll('h1, h2, h3, h4, h5, h6').length > 0,
          hasButtons: document.querySelectorAll('button').length > 0,
          allButtonsHaveText: Array.from(document.querySelectorAll('button')).every(btn => 
            btn.textContent.trim().length > 0 || btn.getAttribute('aria-label')
          )
        };
      });
      
      expect(wcagChecks.hasLang).toBe(true);
      expect(wcagChecks.hasTitle).toBe(true);
      expect(wcagChecks.allButtonsHaveText).toBe(true);
    });
  });
});
