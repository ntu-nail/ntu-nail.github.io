---
widget: slider
weight: 1
active: true
headless: true

design:
  # Slide height is automatic unless you force a specific height (e.g. '400px')
  slide_height: ''
  is_fullscreen: true
  # Automatically transition through slides?
  loop: false
  # Duration of transition between slides (in ms)
  interval: 2000

content:
  slides:
    - title: 👋 Welcome to NAIL
      content: Take a look at what we're working on...
      align: center
      background:
        position: center
        color: '#666'
        brightness: 0.7
        media: hive_5.jpg
        
    - title: Lunch & Learn ☕️
      content: 'Share your knowledge with the group and explore exciting new topics together!'
      align: right
      background:
        position: center
        color: '#555'
        brightness: 0.7
        media: hive_3.jpg
    - title: 'The Stars, Our Destination'
      content: "Let's witness together!"
      align: left
      background:
        position: center
        color: '#333'
        brightness: 0.5
        media: ns.jpg
      link:
        icon: graduation-cap
        icon_pack: fas
        text: Join Us
        url: ../contact/
---
