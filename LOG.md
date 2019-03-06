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
  - state would have to be initialized in the other file, not imperatively in `index.ts` 
 