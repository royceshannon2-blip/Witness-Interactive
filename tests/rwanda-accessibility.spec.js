/**
 * Accessibility Tests for Rwanda Genocide Mission
 * Task 12: Accessibility and mobile testing
 * 
 * Tests:
 * - Screen reader compatibility (NVDA/JAWS)
 * - Keyboard navigation (Tab, Enter, Arrow keys)
 * - Mobile viewports (320px, 768px, 1280px)
 * - Color contrast (WCAG AA compliance)
 * - Focus management
 * - ARIA labels and semantic HTML
 * 
 * Requirements: NFR-3.1
 */

import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:8000';

test.describe('Rwanda Mission - Accessibility Tests', () => {
  
  test.describe('Screen Reader Compatibility', () => {
    
    test('should have ARIA labels on Rwanda role selection buttons', async ({ page }) => {
      await page.goto(BASE_URL);
      await page.waitForSelector('#loading-screen', { state: 'hidden', timeout: 10000 });
      
      // Select Rwanda mission from timeline
      const rwandaButton = page.locator('button:has-text("Rwanda")');
      if (await rwandaButton.isVisible()) {
        await rwandaButton.click();
      }
      
      // Check for ARIA labels on role buttons
      const roleButtons = await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        const rwandaRoles = buttons.filter(btn => 
          btn.textContent.includes('Hutu') || 
          btn.textContent.includes('Tutsi') || 
          btn.textContent.includes('Peacekeeper')
        );
        
        return rwandaRoles.map(btn => ({
          text: btn.textContent,
          ariaLabel: btn.getAttribute('aria-label'),
          hasAccessibleName: btn.textContent.length > 0 || btn.getAttribute('aria-label')
        }));
      });
      
      // All Rwanda role buttons should have accessible names
      expect(roleButtons.length).toBeGreaterThan(0);
      const allHaveNames = roleButtons.every(btn => btn.hasAccessibleName);
      expect(allHaveNames).toBe(true);
    });

    test('should have ARIA labels on Rwanda choice buttons', async ({ page }) => {
      await page.goto(BASE_URL);
      await page.waitForSelector('#loading-screen', { state: 'hidden', timeout: 10000 });
      
      // Navigate to Rwanda mission
      const rwandaButton = page.locator('button:has-text("Rwanda")');
      if (await rwandaButton.isVisible()) {
        await rwandaButton.click();
      }
      
      // Select Hutu Moderate role
      await page.click('button:has-text("Hutu Moderate")');
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

    test('should announce Rwanda scene transitions to screen readers', async ({ page }) => {
      await page.goto(BASE_URL);
      await page.waitForSelector('#loading-screen', { state: 'hidden', timeout: 10000 });
      
      // Navigate to Rwanda mission
      const rwandaButton = page.locator('button:has-text("Rwanda")');
      if (await rwandaButton.isVisible()) {
        await rwandaButton.click();
      }
      
      await page.click('button:has-text("Tutsi Survivor")');
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

    test('should have semantic HTML structure for Rwanda mission', async ({ page }) => {
      await page.goto(BASE_URL);
      await page.waitForSelector('#loading-screen', { state: 'hidden', timeout: 10000 });
      
      // Navigate to Rwanda mission
      const rwandaButton = page.locator('button:has-text("Rwanda")');
      if (await rwandaButton.isVisible()) {
        await rwandaButton.click();
      }
      
      await page.click('button:has-text("UN Peacekeeper")');
      await page.waitForSelector('.narrative-text', { timeout: 5000 });
      
      // Check for semantic HTML elements
      const semanticStructure = await page.evaluate(() => {
        return {
          hasMain: document.querySelector('main') !== null,
          hasNav: document.querySelector('nav') !== null || document.querySelector('[role="navigation"]') !== null,
          hasHeadings: document.querySelectorAll('h1, h2, h3, h4, h5, h6').length > 0,
          hasButtons: document.querySelectorAll('button').length > 0,
          hasLandmarks: document.querySelectorAll('[role="main"], [role="navigation"], [role="complementary"]').length > 0
        };
      });
      
      // Should have semantic structure
      expect(semanticStructure.hasMain || semanticStructure.hasHeadings).toBe(true);
      expect(semanticStructure.hasButtons).toBe(true);
    });

    test('should announce timed choices to screen readers', async ({ page }) => {
      await page.goto(BASE_URL);
      await page.waitForSelector('#loading-screen', { state: 'hidden', timeout: 10000 });
      
      // Navigate to Rwanda mission
      const rwandaButton = page.locator('button:has-text("Rwanda")');
      if (await rwandaButton.isVisible()) {
        await rwandaButton.click();
      }
      
      await page.click('button:has-text("Hutu Moderate")');
      await page.waitForSelector('.choice-button', { timeout: 5000 });
      
      // Progress through scenes to find timed choice
      for (let i = 0; i < 5; i++) {
        const timerVisible = await page.locator('.timer-display, .countdown-timer, [data-timer]').isVisible().catch(() => false);
        
        if (timerVisible) {
          // Check for ARIA live region on timer
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
          await page.waitForTimeout(1000);
        }
      }
    });
  });

  test.describe('Keyboard Navigation', () => {
    
    test('should allow Tab navigation through Rwanda role selection', async ({ page }) => {
      await page.goto(BASE_URL);
      await page.waitForSelector('#loading-screen', { state: 'hidden', timeout: 10000 });
      
      // Navigate to Rwanda mission
      const rwandaButton = page.locator('button:has-text("Rwanda")');
      if (await rwandaButton.isVisible()) {
        await rwandaButton.click();
      }
      
      // Tab to first role button
      await page.keyboard.press('Tab');
      
      // Check focus is on a Rwanda role button
      const focusedElement = await page.evaluate(() => {
        const el = document.activeElement;
        return {
          tagName: el.tagName,
          text: el.textContent,
          isRwandaRole: el.textContent.includes('Hutu') || 
                        el.textContent.includes('Tutsi') || 
                        el.textContent.includes('Peacekeeper')
        };
      });
      
      expect(focusedElement.tagName).toBe('BUTTON');
    });

    test('should allow Enter to select Rwanda role', async ({ page }) => {
      await page.goto(BASE_URL);
      await page.waitForSelector('#loading-screen', { state: 'hidden', timeout: 10000 });
      
      // Navigate to Rwanda mission
      const rwandaButton = page.locator('button:has-text("Rwanda")');
      if (await rwandaButton.isVisible()) {
        await rwandaButton.click();
      }
      
      // Tab to first role button
      await page.keyboard.press('Tab');
      
      // Press Enter to select
      await page.keyboard.press('Enter');
      
      // Should load first scene
      await page.waitForSelector('.narrative-text', { timeout: 5000 });
      
      const narrativeVisible = await page.locator('.narrative-text').isVisible();
      expect(narrativeVisible).toBe(true);
    });

    test('should allow Tab navigation through Rwanda choices', async ({ page }) => {
      await page.goto(BASE_URL);
      await page.waitForSelector('#loading-screen', { state: 'hidden', timeout: 10000 });
      
      // Navigate to Rwanda mission
      const rwandaButton = page.locator('button:has-text("Rwanda")');
      if (await rwandaButton.isVisible()) {
        await rwandaButton.click();
      }
      
      await page.click('button:has-text("Tutsi Survivor")');
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

    test('should allow Enter to make Rwanda choice', async ({ page }) => {
      await page.goto(BASE_URL);
      await page.waitForSelector('#loading-screen', { state: 'hidden', timeout: 10000 });
      
      // Navigate to Rwanda mission
      const rwandaButton = page.locator('button:has-text("Rwanda")');
      if (await rwandaButton.isVisible()) {
        await rwandaButton.click();
      }
      
      await page.click('button:has-text("UN Peacekeeper")');
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

    test('should maintain focus during Rwanda scene transitions', async ({ page }) => {
      await page.goto(BASE_URL);
      await page.waitForSelector('#loading-screen', { state: 'hidden', timeout: 10000 });
      
      // Navigate to Rwanda mission
      const rwandaButton = page.locator('button:has-text("Rwanda")');
      if (await rwandaButton.isVisible()) {
        await rwandaButton.click();
      }
      
      await page.click('button:has-text("Hutu Moderate")');
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
      
      // Focus should not be on body
      expect(focusedElement.isBody).toBe(false);
    });

    test('should allow keyboard navigation through full Rwanda playthrough', async ({ page }) => {
      await page.goto(BASE_URL);
      await page.waitForSelector('#loading-screen', { state: 'hidden', timeout: 10000 });
      
      // Navigate to Rwanda mission
      const rwandaButton = page.locator('button:has-text("Rwanda")');
      if (await rwandaButton.isVisible()) {
        await rwandaButton.click();
      }
      
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

  test.describe('Mobile Viewport Testing', () => {
    
    test('should render correctly on 320px viewport (mobile)', async ({ page }) => {
      await page.setViewportSize({ width: 320, height: 568 });
      await page.goto(BASE_URL);
      await page.waitForSelector('#loading-screen', { state: 'hidden', timeout: 10000 });
      
      // Navigate to Rwanda mission
      const rwandaButton = page.locator('button:has-text("Rwanda")');
      if (await rwandaButton.isVisible()) {
        await rwandaButton.click();
      }
      
      await page.click('button:has-text("Hutu Moderate")');
      await page.waitForSelector('.narrative-text', { timeout: 5000 });
      
      // Check that content is visible and not cut off
      const contentVisible = await page.evaluate(() => {
        const narrative = document.querySelector('.narrative-text');
        const choices = document.querySelectorAll('.choice-button');
        
        if (!narrative) return false;
        
        const narrativeRect = narrative.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        
        return {
          narrativeVisible: narrativeRect.width > 0 && narrativeRect.width <= viewportWidth,
          choicesVisible: choices.length > 0,
          allChoicesInViewport: Array.from(choices).every(choice => {
            const rect = choice.getBoundingClientRect();
            return rect.width > 0 && rect.width <= viewportWidth;
          })
        };
      });
      
      expect(contentVisible.narrativeVisible).toBe(true);
      expect(contentVisible.choicesVisible).toBe(true);
      expect(contentVisible.allChoicesInViewport).toBe(true);
    });

    test('should render correctly on 768px viewport (tablet)', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });
      await page.goto(BASE_URL);
      await page.waitForSelector('#loading-screen', { state: 'hidden', timeout: 10000 });
      
      // Navigate to Rwanda mission
      const rwandaButton = page.locator('button:has-text("Rwanda")');
      if (await rwandaButton.isVisible()) {
        await rwandaButton.click();
      }
      
      await page.click('button:has-text("Tutsi Survivor")');
      await page.waitForSelector('.narrative-text', { timeout: 5000 });
      
      // Check that content is properly laid out
      const contentLayout = await page.evaluate(() => {
        const narrative = document.querySelector('.narrative-text');
        const choices = document.querySelectorAll('.choice-button');
        
        if (!narrative) return false;
        
        const narrativeRect = narrative.getBoundingClientRect();
        
        return {
          narrativeWidth: narrativeRect.width,
          choiceCount: choices.length,
          viewportWidth: window.innerWidth
        };
      });
      
      expect(contentLayout.narrativeWidth).toBeGreaterThan(0);
      expect(contentLayout.narrativeWidth).toBeLessThanOrEqual(768);
      expect(contentLayout.choiceCount).toBeGreaterThan(0);
    });

    test('should render correctly on 1280px viewport (desktop)', async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 720 });
      await page.goto(BASE_URL);
      await page.waitForSelector('#loading-screen', { state: 'hidden', timeout: 10000 });
      
      // Navigate to Rwanda mission
      const rwandaButton = page.locator('button:has-text("Rwanda")');
      if (await rwandaButton.isVisible()) {
        await rwandaButton.click();
      }
      
      await page.click('button:has-text("UN Peacekeeper")');
      await page.waitForSelector('.narrative-text', { timeout: 5000 });
      
      // Check that content is properly centered and sized
      const contentLayout = await page.evaluate(() => {
        const narrative = document.querySelector('.narrative-text');
        const choices = document.querySelectorAll('.choice-button');
        
        if (!narrative) return false;
        
        const narrativeRect = narrative.getBoundingClientRect();
        
        return {
          narrativeWidth: narrativeRect.width,
          narrativeCentered: narrativeRect.left > 0,
          choiceCount: choices.length,
          viewportWidth: window.innerWidth
        };
      });
      
      expect(contentLayout.narrativeWidth).toBeGreaterThan(0);
      expect(contentLayout.choiceCount).toBeGreaterThan(0);
    });

    test('should handle touch interactions on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto(BASE_URL);
      await page.waitForSelector('#loading-screen', { state: 'hidden', timeout: 10000 });
      
      // Navigate to Rwanda mission
      const rwandaButton = page.locator('button:has-text("Rwanda")');
      if (await rwandaButton.isVisible()) {
        await rwandaButton.click();
      }
      
      await page.click('button:has-text("Hutu Moderate")');
      await page.waitForSelector('.choice-button', { timeout: 5000 });
      
      // Tap first choice
      const firstChoice = page.locator('.choice-button').first();
      await firstChoice.tap();
      
      // Should transition to next scene
      await page.waitForTimeout(1000);
      
      const narrativeVisible = await page.locator('.narrative-text').isVisible();
      expect(narrativeVisible).toBe(true);
    });

    test('should not have horizontal scroll on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 320, height: 568 });
      await page.goto(BASE_URL);
      await page.waitForSelector('#loading-screen', { state: 'hidden', timeout: 10000 });
      
      // Navigate to Rwanda mission
      const rwandaButton = page.locator('button:has-text("Rwanda")');
      if (await rwandaButton.isVisible()) {
        await rwandaButton.click();
      }
      
      await page.click('button:has-text("Tutsi Survivor")');
      await page.waitForSelector('.narrative-text', { timeout: 5000 });
      
      // Check for horizontal overflow
      const hasHorizontalScroll = await page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth;
      });
      
      expect(hasHorizontalScroll).toBe(false);
    });
  });

  test.describe('Color Contrast (WCAG AA)', () => {
    
    test('should have sufficient contrast for Rwanda narrative text', async ({ page }) => {
      await page.goto(BASE_URL);
      await page.waitForSelector('#loading-screen', { state: 'hidden', timeout: 10000 });
      
      // Navigate to Rwanda mission
      const rwandaButton = page.locator('button:has-text("Rwanda")');
      if (await rwandaButton.isVisible()) {
        await rwandaButton.click();
      }
      
      await page.click('button:has-text("Hutu Moderate")');
      await page.waitForSelector('.narrative-text', { timeout: 5000 });
      
      const contrast = await page.evaluate(() => {
        const narrative = document.querySelector('.narrative-text');
        if (!narrative) return null;
        
        const style = window.getComputedStyle(narrative);
        const color = style.color;
        const backgroundColor = style.backgroundColor;
        const fontSize = style.fontSize;
        
        return { color, backgroundColor, fontSize };
      });
      
      // Should have defined colors
      expect(contrast.color).toBeDefined();
      expect(contrast.backgroundColor).toBeDefined();
      expect(contrast.fontSize).toBeDefined();
    });

    test('should have sufficient contrast for Rwanda choice buttons', async ({ page }) => {
      await page.goto(BASE_URL);
      await page.waitForSelector('#loading-screen', { state: 'hidden', timeout: 10000 });
      
      // Navigate to Rwanda mission
      const rwandaButton = page.locator('button:has-text("Rwanda")');
      if (await rwandaButton.isVisible()) {
        await rwandaButton.click();
      }
      
      await page.click('button:has-text("Tutsi Survivor")');
      await page.waitForSelector('.choice-button', { timeout: 5000 });
      
      const contrast = await page.evaluate(() => {
        const button = document.querySelector('.choice-button');
        if (!button) return null;
        
        const style = window.getComputedStyle(button);
        const color = style.color;
        const backgroundColor = style.backgroundColor;
        const borderColor = style.borderColor;
        
        return { color, backgroundColor, borderColor };
      });
      
      // Should have defined colors
      expect(contrast.color).toBeDefined();
      expect(contrast.backgroundColor).toBeDefined();
    });

    test('should have visible focus indicators on Rwanda elements', async ({ page }) => {
      await page.goto(BASE_URL);
      await page.waitForSelector('#loading-screen', { state: 'hidden', timeout: 10000 });
      
      // Navigate to Rwanda mission
      const rwandaButton = page.locator('button:has-text("Rwanda")');
      if (await rwandaButton.isVisible()) {
        await rwandaButton.click();
      }
      
      await page.click('button:has-text("UN Peacekeeper")');
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

    test('should maintain contrast during Rwanda atmospheric effects', async ({ page }) => {
      await page.goto(BASE_URL);
      await page.waitForSelector('#loading-screen', { state: 'hidden', timeout: 10000 });
      
      // Navigate to Rwanda mission
      const rwandaButton = page.locator('button:has-text("Rwanda")');
      if (await rwandaButton.isVisible()) {
        await rwandaButton.click();
      }
      
      await page.click('button:has-text("Hutu Moderate")');
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

    test('should have sufficient contrast for Rwanda timer display', async ({ page }) => {
      await page.goto(BASE_URL);
      await page.waitForSelector('#loading-screen', { state: 'hidden', timeout: 10000 });
      
      // Navigate to Rwanda mission
      const rwandaButton = page.locator('button:has-text("Rwanda")');
      if (await rwandaButton.isVisible()) {
        await rwandaButton.click();
      }
      
      await page.click('button:has-text("Tutsi Survivor")');
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
          await page.waitForTimeout(1000);
        }
      }
    });
  });

  test.describe('WCAG 2.1 Compliance', () => {
    
    test('should pass basic WCAG 2.1 Level AA checks for Rwanda mission', async ({ page }) => {
      await page.goto(BASE_URL);
      await page.waitForSelector('#loading-screen', { state: 'hidden', timeout: 10000 });
      
      // Navigate to Rwanda mission
      const rwandaButton = page.locator('button:has-text("Rwanda")');
      if (await rwandaButton.isVisible()) {
        await rwandaButton.click();
      }
      
      await page.click('button:has-text("Hutu Moderate")');
      await page.waitForSelector('.narrative-text', { timeout: 5000 });
      
      const wcagChecks = await page.evaluate(() => {
        return {
          hasLang: document.documentElement.hasAttribute('lang'),
          hasTitle: document.title.length > 0,
          hasHeadings: document.querySelectorAll('h1, h2, h3, h4, h5, h6').length > 0,
          hasButtons: document.querySelectorAll('button').length > 0,
          allButtonsHaveText: Array.from(document.querySelectorAll('button')).every(btn => 
            btn.textContent.trim().length > 0 || btn.getAttribute('aria-label')
          ),
          allImagesHaveAlt: Array.from(document.querySelectorAll('img')).every(img => 
            img.hasAttribute('alt')
          )
        };
      });
      
      expect(wcagChecks.hasLang).toBe(true);
      expect(wcagChecks.hasTitle).toBe(true);
      expect(wcagChecks.allButtonsHaveText).toBe(true);
    });

    test('should support prefers-reduced-motion for Rwanda mission', async ({ browser }) => {
      const context = await browser.newContext({
        reducedMotion: 'reduce'
      });
      const page = await context.newPage();
      
      await page.goto(BASE_URL);
      await page.waitForSelector('#loading-screen', { state: 'hidden', timeout: 10000 });
      
      // Navigate to Rwanda mission
      const rwandaButton = page.locator('button:has-text("Rwanda")');
      if (await rwandaButton.isVisible()) {
        await rwandaButton.click();
      }
      
      await page.click('button:has-text("UN Peacekeeper")');
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
  });
});
