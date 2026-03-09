# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - button "Sound is on. Click to mute." [ref=e2]:
    - generic [ref=e3]: 🔊
  - button "Narrator is on. Click to mute." [ref=e4] [cursor=pointer]:
    - generic [ref=e5]: 🎙️
  - main "Witness Interactive Game" [ref=e6]:
    - article "Historical Timeline" [ref=e8]:
      - heading "Historical Timeline" [level=2] [ref=e9]
      - paragraph [ref=e10]: Select a mission to begin
      - navigation "Historical mission timeline" [ref=e11]:
        - button "Pearl Harbor, Dec 6, 1941, Available" [ref=e14] [cursor=pointer]:
          - generic [ref=e16]: ●
          - generic [ref=e17]:
            - generic [ref=e18]: Pearl Harbor
            - generic [ref=e19]: Dec 6, 1941
```