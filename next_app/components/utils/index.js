
//categories
export const categories = [
  'completed',
  'active',
  'cancled',
  'started',
  'seeking support'
]


//home styles
export const home_styles = [
  'New Construction',
  'Older Home',
  "Duplex",
  // 'City',
  // 'State',//search filters
  // 'Zip',
  'Single Family',
  'Condominium',
  'Townhome',
  'Multi Family',
  'Other'
]
//Shared equity agreement types
export const agreement_types = [
  'long term',
  'short term',
  'force by-back',
  'no buy-back'

]


export function retry(name, time, fn){
let count = 0
  let try_again= setInterval(async ()=> {
// console.log(`Running ${name} count = ${count}`)
if ( (count > 5)) {
  // console.log(`Clearing retry interval for ${name}`)
  clearInterval(try_again)
}

let ran;
    try {
      count++
      ran = await fn()
      // console.log({ran, name})
    
      if (ran) {
        // console.log(`Clearing retry interval fpr ${name}`)
        clearInterval(try_again)
      }
    } catch (err) {
      // console.log(err.message)
      // console.log('Try again?')
    }
    
  }, time);

}
