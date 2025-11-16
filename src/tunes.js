//--Default song--
export const default_tune = `setcps(140/60/4)

samples('github:algorave-dave/samples')
samples('https://raw.githubusercontent.com/tidalcycles/Dirt-Samples/master/strudel.json')
samples('https://raw.githubusercontent.com/Mittans/tidal-drum-machines/main/machines/tidal-drum-machines.json')

// React will replace <master_gain> with a number like 1.00 or 0.35
const masterGain = <master_gain>;

const gain_patterns = [
  "2",
  "{0.75 2.5}*4",
  "{0.75 2.5!9 0.75 2.5!5 0.75 2.5 0.75 2.5!7 0.75 2.5!3 <2.5 0.75> 2.5}%16",
]

const drum_structure = [
  "~",
  "x*4",
  "{x ~!9 x ~!5 x ~ x ~!7 x ~!3 < ~ x > ~}%16",
]

const basslines = [
  "[[eb1, eb2]!16 [f2, f1]!16 [g2, g1]!16 [f2, f1]!8 [bb2, bb1]!8]/8",
  "[[eb1, eb2]!16 [bb2, bb1]!16 [g2, g1]!16 [f2, f1]!4 [bb1, bb2]!4 [eb1, eb2]!4 [f1, f2]!4]/8"
]

const arpeggiator1 = [
  "{d4 bb3 eb3 d3 bb2 eb2}%16",
  "{c4 bb3 f3 c3 bb2 f2}%16",
  "{d4 bb3 g3 d3 bb2 g2}%16",
  "{c4 bb3 f3 c3 bb2 f2}%16",
]

const arpeggiator2 = [
  "{d4 bb3 eb3 d3 bb2 eb2}%16",
  "{c4 bb3 f3 c3 bb2 f2}%16",
  "{d4 bb3 g3 d3 bb2 g2}%16",
  "{d5 bb4 g4 d4 bb3 g3 d4 bb3 eb3 d3 bb2 eb2}%16",
]

const pattern = 0
const bass = 0

bassline:
note(pick(basslines, bass))
  .sound("supersaw")
  .postgain(2)
  .room(0.6)
  .lpf(700)
  .room(0.4)
  .postgain(pick(gain_patterns, pattern))
  .gain(masterGain)

main_arp: 
note(pick(arpeggiator1, "<0 1 2 3>/2"))
  .sound("supersaw")
  .lpf(300)
  .adsr("0:0:.5:.1")
  .room(0.6)
  .lpenv(3.3)
  .postgain(pick(gain_patterns, pattern))
  .gain(masterGain)

drums:
stack(
  s("tech:5")
    .postgain(6)
    .pcurve(2)
    .pdec(1)
    .struct(pick(drum_structure, pattern)),

  s("sh").struct("[x!3 ~!2 x!10 ~]")
    .postgain(0.5).lpf(7000)
    .bank("RolandTR808")
    .speed(0.8).jux(rev).room(sine.range(0.1,0.4)).gain(0.6),

  s("{~ ~ rim ~ cp ~ rim cp ~!2 rim ~ cp ~ < rim ~ >!2}%8 *2")
    .bank("[KorgDDM110, OberheimDmx]").speed(1.2)
    .postgain(.25),
)
.gain(masterGain)
.log(1)

drums2: 
stack(
  s("[~ hh]*4").bank("RolandTR808").room(0.3).speed(0.75).gain(1.2),
  s("hh").struct("x*16").bank("RolandTR808")
    .gain(0.6)
    .jux(rev)
    .room(sine.range(0.1,0.4))
    .postgain(0.5),
  
  s("[psr:[2|5|6|7|8|9|12|24|25]*16]?0.1")
    .gain(0.1)
    .postgain(pick(gain_patterns, pattern))
    .hpf(1000)
    .speed(0.5)
    .rarely(jux(rev)),
)
.gain(masterGain)

//Remixed and reproduced from Algorave Dave's code found here: https://www.youtube.com/watch?v=ZCcpWzhekEY"
// @version 1.2`;

//--ALT 1 – Punchy--
export const alt1_tune = `setcps(150/60/4)

samples('github:algorave-dave/samples')
samples('https://raw.githubusercontent.com/tidalcycles/Dirt-Samples/master/strudel.json')
samples('https://raw.githubusercontent.com/Mittans/tidal-drum-machines/main/machines/tidal-drum-machines.json')

const masterGain = <master_gain>;

bassline:
note("[c2 g2 c3 g2]/4")
  .sound("supersaw")
  .room(0.4)
  .postgain(2)
  .gain(masterGain)

lead:
note("[c4 e4 g4 e4]/8 [d4 f4 a4 f4]/8")
  .sound("supersaw")
  .room(0.7)
  .lpf(1200)
  .postgain(1.5)
  .gain(masterGain)

drums:
stack(
  s("bd*4").bank("RolandTR808").postgain(2.8),
  s("hh").struct("x*8").bank("RolandTR808").postgain(0.7),
  s("cp").struct("~ x ~ x").bank("RolandTR808").postgain(0.9)
)
.gain(masterGain)
.log(1)`;

//--ALT 2 – Deep bass--
export const alt2_tune = `setcps(90/60/4)

samples('github:algorave-dave/samples')
samples('https://raw.githubusercontent.com/tidalcycles/Dirt-Samples/master/strudel.json')

const masterGain = <master_gain>;

pad:
note("[c3 g3 bb3 d4]/2 [f3 c4 eb4 g4]/2")
  .sound("supersaw")
  .room(0.9)
  .lpf(900)
  .postgain(1.8)
  .gain(masterGain)

bassline:
note("[c2 ~ g2 ~]/2 [bb1 ~ f2 ~]/2")
  .sound("supersaw")
  .room(0.6)
  .postgain(1.4)
  .gain(masterGain)

drums:
stack(
  s("bd*2").bank("RolandTR808").postgain(1.6),
  s("hh").struct("~ x ~ x").bank("RolandTR808").postgain(0.4)
)
.gain(masterGain)
.log(1)`;

//-- ALT 3 – Bright bass--
export const alt3_tune = `setcps(130/60/4)

samples('github:algorave-dave/samples')
samples('https://raw.githubusercontent.com/tidalcycles/Dirt-Samples/master/strudel.json')
samples('https://raw.githubusercontent.com/Mittans/tidal-drum-machines/main/machines/tidal-drum-machines.json')

const masterGain = <master_gain>;

lead:
note("[c4 e4 g4 bb4]*2 [d4 f4 a4 c5]*2")
  .sound("supersaw")
  .room(0.7)
  .lpf(1500)
  .postgain(1.7)
  .gain(masterGain)

arp:
note("[c5 g4 e5 g4]/4 [bb4 f4 d5 f4]/4")
  .sound("supersaw")
  .room(0.5)
  .postgain(1.2)
  .gain(masterGain)

drums:
stack(
  s("bd*4").bank("RolandTR808").postgain(2.2),
  s("hh").struct("x*16").bank("RolandTR808").postgain(0.9),
  s("[cp ~]*4").bank("RolandTR808").postgain(0.8),
  s("[psr:[2|5|7|9|12]*8]?0.2")
    .postgain(0.5)
    .hpf(1200)
)
.gain(masterGain)
.log(1)`;

export const stranger_tune = default_tune;
