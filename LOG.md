### 19-10-03
#### reasonable frequency scaling

when `> 0` exponentiate and can adjust in 1% increments
when `< 0` do the same, but use as denominator

was doing 2 exponentiations in either branch but this was slowing stuff down a bit

also, `sin` is just slow. better results w/ `triangle`
[] look into optimising `sin` (which is a great phrase out of context)

#### state freakout

going to try putting state in a diff file so that hot reloading doesn't reload it

b/c default state is AHH  
I guess I could also change default state. but this will be handy and a good thing to explore

- will start with simple: just an object in another file that is mutated
  - however, initialization code lives in `index`, which gets re-run every hot reload
  - state would have to be initialized in the other file, not imperatively in `index.ts

ok maybe later. for now just better defaults

#### sync

sync values become less meaningful as frequency decreases

I still need a better way to deal with this. maybe try the idea from yesterday: `t+i * refreshRate/dataLength`  
however, my guess is that this may totally change up the calibration of freq function. now this enters into "refresh rate" timescale?

what exactly does this mean? compare     
`i + t / 20` frequency corresponds to pixels    
`t + i * timePerPixel`  
`timePerPixel = refreshTime / numPixels = (1000/60) / numPixels`  
prev, 1px ~= 1ms, now 1px =  1000 / 60 / 62,500 = ~0.2ms

sync? or drift. the version I did for the canopy drifted and you could control the "drift" rate  
the first example above is more akin to "drift"

the sync model as doesn't simulate consistent frames: `t` is frame time on the computer, but not of the simulated synth  
the pixels should be drawn as though the frames are regular, I think

simulation: oscillator rendering to screen with particular refresh rate. each frame of rendering is taking a snapshot of the screen at that time
 
can convert `t` to "where would the scan line be", to find the pixel that would be being rendered. from there you can find the time each other pixel would have been rendered by subtracting

final eq:
```js
const frameRate = 60;
const timePerFrame = 1000/frameRate;
const timePerPixel = timePerFrame/numPixels;

const currentPixelAtT = Math.floor(t / timePerPixel) % numPixels;

const adjustedT = t + (currentPixelBeingRendered - currentPixelAtT) * timePerPixel;
```

still not sure yet how to do sync for this. one way to think about it is removing the "time" component entirely, just rendering based on `index`

seems like the frame jumps periodically. not sure why

#### trails

adding trails was surprisingly easy. only thing is that I'm doing additive color rn (`pixel = newValue + oldValue * trailsAmount`).  
[] experiment with other blend modes?

for example: dissolve mode

changing the source of the trails (1, 2, 3 frames prev) adds interesting effects