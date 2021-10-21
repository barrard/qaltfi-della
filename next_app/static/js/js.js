//add web3 globally
// web3 = new Web3()

//add scroll into view for all input fields.....
// $(document).ready(() => {
//   setTimeout(() => {
//     //move the body down to make room for the navbar
//     let navbar = document.getElementById('navbar')
//     if(!navbar) return
//     let height = navbar.offsetHeight
//     console.log(height)
//     document.body.style.paddingTop = height + 'px'
//   }, 0);

// })
var sfy = JSON.stringify
var pse = JSON.parse

function get_local(key) {
  const val = localStorage.getItem(key)
  if (val) return pse(val)
}

function save_local(k, v) {
  localStorage.setItem(k, sfy(v))

}

function clear_storage() {
  localStorage.clear()
  location.reload()

}




// dataURItoBlob_worker.postMessage('dataURI')
function dataURItoBlob(dataURI) {
  var binary = atob(dataURI.split(',')[1]);
  var array = [];
  for (var i = 0; i < binary.length; i++) {
    array.push(binary.charCodeAt(i));
  }
  return new Blob([new Uint8Array(array)], { type: 'image/jpeg' });
}
function decrease_img_size(file, cb) {

  // const dataURItoBlob_worker = new Worker('/js/workers/dataURItoBlob.js')
  // dataURItoBlob_worker.addEventListener('message', (data) => {
  //   console.log('worker data')
  // })


  var reader = new FileReader();
  reader.onload = function (e) {
    console.log('file reader')
    const data = e.target.result
    // console.log(`inidial data length ${data.length}`)
    // console.log(data)
    // var img = $('#test_img')
    // img.css('height', '700px')
    // img.attr('src', e.target.result);

    var canvas = document.createElement('canvas')
    var ctx = canvas.getContext('2d')
    var image = new Image();
    var max_size = 775;
    image.onload = function () {

      // Resize the image
      // max_size = 277,// TODO : pull max size from a site config
      //max_size = 775,// TODO : pull max size from a site config
      width = image.width,
        height = image.height;
      if (width > height) {
        if (width > max_size) {
          height *= max_size / width;
          width = max_size;
        }
      } else {
        if (height > max_size) {
          width *= max_size / height;
          height = max_size;
        }
      }
      // console.log({ width, height })
      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(image, 0, 0, width, height);
      // canvas.style.display='none'
      // var dataUrl = canvas.toDataURL('image/jpeg');
      // var fullQuality = canvas.toDataURL('image/jpeg', 1.0);
      // data:image/jpeg;base64,/9j/4AAQSkZJRgABAQ...9oADAMBAAIRAxEAPwD/AD/6AP/Z"
      var mediumQuality = canvas.toBlob((blob) => {
        cb(blob)

      }, 'image/jpeg', 0.5);
      // var lowQuality = canvas.toDataURL('image/jpeg', 0.1);
      // console.log(fullQuality.length)
      // console.log(mediumQuality.length)
      // console.log(lowQuality.length)
      // var resizedImage = 
      // const blob = dataURItoBlob(mediumQuality)
      // upload_img(blob);
      // $('#low_test').css('height', '400px')
      // $('#med_test').css('height', '400px')
      // $('#hi_test').css('height', '700px')
      // $('#low_test').attr('src', lowQuality)
      // $('#med_test').attr('src', mediumQuality)
      // $('#hi_test').attr('src', fullQuality)

      // $.event.trigger({
      //   type: "imageResized",
      //   blob: resizedImage,
      //   url: dataUrl
      // });
      // edit_campaign_vue.crowdsale.photos.push(dataUrl)


      // console.log(`the image withd is ${image.width}, and height is ${image.height}`)

      // ctx.drawImage(image, 0, 0, canvas.width, canvas.height);


    };
    image.src = data
  }
  reader.readAsDataURL(file)

}
function setup_filereader(file, cb) {
  if (!file) return cb('no file')
  // Ensure it's an image
  if (file.type.match(/image.*/)) {
    console.log('An image has been loaded');
    if (file.size < 100000) {
      cb(file)
    } else {
      decrease_img_size(file, (smaller_file) => {
        cb(smaller_file)

      })
    }

  }else{
    toast('That doesnt appear to be an image, try something with .png, .jpg, .jpeg etc...','ERROR')
  }
}
function upload_img(_csrf,formData, url, cb) {
  console.log('ajax sending')
  console.log(_csrf)
  // formData.append('_csrf', _csrf)
  $.ajax({
    url: url,
    type: 'POST',
    beforeSend: function (request) {
      request.setRequestHeader("csrf-token", _csrf);
    },
    data: formData,
    processData: false,
    contentType: false,
    success: function (updated_photos_array) {
      console.log('upload successful!');
      // console.log(updated_photos_array)
      cb(updated_photos_array)

      new Toast('Photos uploaded!', Toast.TYPE_DONE, 3000)

    },
    error: function (error) {
      console.log('error ' + error)
      for (var k in error) {
        // console.log(k + ' : ' + error[k])
      }
    },
    xhr: function () {
      // create an XMLHttpRequest
      var xhr = new XMLHttpRequest();

      // listen to the 'progress' event
      xhr.upload.addEventListener('progress', function (evt) {
        console.log('progress')
        console.log(evt)
        if (evt.lengthComputable) {
          // calculate the percentage of upload completed
          var percentComplete = evt.loaded / evt.total;
          percentComplete = parseInt(percentComplete * 100);
          // cb({percentComplete})

          // update the Bootstrap progress bar with the new percentage
          $('.progress-bar').text(percentComplete + '%');
          $('.progress-bar').width(percentComplete + '%');

          // once the upload reaches 100%, set the progress bar text to done
          if (percentComplete === 100) {
            $('.progress-bar').html('Done');
          }

        }

      }, false);

      return xhr;
    }
  });
}
function handle_img_upload(_csrf, input, url, cb) {
  console.log('upload photo')

  if (window.File && window.FileReader && window.FileList && window.Blob) {

    let files = event.target.files
    var formData = new FormData();
    let total_files = files.length

    console.log(files)
    var counter2 = 0
    for (let counter = 0; counter < total_files; counter++) {

      console.log(files[counter])

      var data_sent = false
      var dup_obj_preventer = {}
      setup_filereader(files[counter], (file) => {
        counter2++
        console.log('counter2')
        console.log(counter2)
        console.log('total_files')
        console.log(total_files)
        console.log({total_files})
        if (!dup_obj_preventer[file.name]) {
          dup_obj_preventer[file.name] = true
          formData.append('uploads[]', file)
          if (!data_sent) cb({ img_processing: (counter2 / total_files * 100).toFixed(1) })

          if (counter2 == total_files && !data_sent) {
            data_sent = true
            // clearInterval(canvas_loop_interval)
            console.log('@@@@@@@@@@@@@@@2             Calling upload img @@@@@@@@@@@@@@@@@@@@@@@@@@@@2')
            upload_img(_csrf, formData, url, cb)

          }else{console.error('dont send yet')}
        }else{
          console.error('ERROR')
        }

      })

    }
  } else {
    alert('The File APIs are not fully supported in this browser.');
  }

}

function ajax_delete_photo(photo, _csrf, url, cb) {
  $.post(url,
    { photo, _csrf },
    (resp) => {
      cb(resp)

    })


}


var timer_flag
function start_spinner(message){
  var message = message || 
  'Creating transaction data'
  $('#loading_text').text(message)
  $('#spinner').show()


}

// function start_spinner(time, message) {
//   const normal_time = time || 30
//   let time_lapse = time || 30
//   timer_flag = true
//   var message = message || '~30 seconds Avg.'
//   $('#tx_spinner_progress_bar').removeClass('bg-danger')

//   $('#transaction_timer').text(message)
//   $('#tx_spinner_progress_bar').css('width', '100%')
//   $('#tx_spinner_progress_bar_container').css('display', 'block')
//   $('#tx_spinner_progress_bar').addClass('bg-info')


//   let progress_timer = setInterval(() => {
//     // console.log(time_lapse)
//     if (!timer_flag) clearInterval(progress_timer)

//     time_lapse--
//     var percent = (time_lapse / normal_time * 100).toFixed(0).toString()
//     // console.log(percent)
//     $('#tx_spinner_progress_bar').css('width', percent + '%')
//     $('#transaction_timer').text(`${message} ~${time_lapse} seconds Avg.`)

//     if (time_lapse == 0) {
//       clearInterval(progress_timer)
//       if (timer_flag) {
//         const normal_time = 30
//         let time_lapse = 30
//         toast('Transaction taking longer than expected', "WARNING")
//         $('#transaction_timer').text('Long transaction alert, auto refresh in 30 seconds')
//         $('#tx_spinner_progress_bar').css('width', '100%')
//         $('#tx_spinner_progress_bar_container').css('display', 'block')

//         let progress_timer = setInterval(() => {
//           if (!timer_flag) clearInterval(progress_timer)
//           time_lapse--
//           var percent = (time_lapse / normal_time * 100).toFixed(0).toString()
//           // console.log(percent)
//           $('#tx_spinner_progress_bar').css('width', percent + '%')
//           $('#tx_spinner_progress_bar').addClass('bg-danger')
//           $('#transaction_timer').text(`Long transaction alert, auto refresh in ${time_lapse} seconds`)
//           if (time_lapse == 0) {
//             clearInterval(progress_timer)
//             // location.reload()
//             if (timer_flag) {
//               toast('Possible Transaction Fail, Recommend reloading the page', "DANGER")
//             }
//           }
//         }, 1000)
//       }
//     }
//   }, 1000)
// }
// function stop_spinner() {
//   $('#tx_spinner_progress_bar').removeClass('bg-danger')
//   console.log($('#tx_spinner_progress_bar').hasClass('bg-danger'))
//   $('#tx_spinner_progress_bar_container').css('display', 'none')
//   timer_flag = false
// }

function stop_spinner(){
  $('#spinner').hide()

}

function toast(msg, type) {
  //types DONE, INFO, MESSAGE, ERROR, WARNING
  new Toast(msg, Toast[`TYPE_${type}`], 10000)
}

function redir_to(path) {
  window.location = `${window.location.origin}${path}`

}

function short_address(address) {
  if (!address) return 'Not Available'
  const start = address.slice(0, 6)
  const end = address.slice(-6)
  return `${start}...${end}`
}

function client_side_resp_handling_toast(resp_obj) {
  // stop_spinner()
  console.log('parsing this obj')
  console.log(resp_obj)
  //obj should have obj.error
  // if (!resp_obj.error) return 'No erro found'
  if (resp_obj.err) {
    console.log('if err is true')
    if (Array.isArray(resp_obj.err)) {
      resp_obj.err.forEach(err => {
        console.log('printing err')
        new Toast(err.msg, Toast.TYPE_ERROR, 3000)
      });
    } else {
      new Toast(resp_obj.err, Toast.TYPE_ERROR, 3000)

    }

  } else if (resp_obj.resp) {
    console.log('got a resp! of type.......')
    console.log(typeof resp_obj.resp)
    if (typeof resp_obj.resp == 'string') {
      new Toast(resp_obj.resp, Toast.TYPE_DONE, 3000)
    } else if (typeof resp_obj.resp == 'object') {
      new Toast('GOT DATA', Toast.TYPE_DONE, 3000)
      for (let k in resp_obj.resp) {
        new Toast(k, Toast.TYPE_DONE, 3000)
      }


    }


  } else {
    console.log('no error or succces, what the fuck do we have?')
    // setTimeout(()=>{
    //   location.reload()
    // }, 500)
  }

}

// Vue.component('transaction-popup', {
//   props: ['show_pw_input', 'gas_price', 'gas_estimate', 'transaction_type'],



//   template: `
//   <transition name="slide-fade">

//   <div v-show="show_pw_input" class="card gas_price_password_popup_box shadow" style="width: 18rem;">
//     <div class="card-body">
//       <h5 class="card-title">{{transaction_type}}</h5>
//       <p class="card-text">Transaction details.</p>
//       <div class="form-group">
//         <label for="total gas">Total Gas Estimate</label>
//         <input :value="gas_estimate" type="number" class="form-control"  aria-describedby="total gas" placeholder="Total Gas">
//         <small class="form-text text-muted">Left over gas is returned.</small>
//       </div>
//       <div class="form-group">
//         <label for="exampleInputEmail1">Gas Price</label>
//         <input :value="gas_price" @input="$emit('gas_price_changed', ($event.target.value))" type="number" class="form-control" aria-describedby="gas price" placeholder="Gas Price">
//         <small class="form-text text-muted">Price per Gas Unit.</small>
//       </div>

//       <div class="alert alert-info" role="alert">
//         Price check <span>{{gas_estimate * gas_price}}</span>
//       </div>
//       <div class="form-group">
//         <label for="wallet password">Wallet Password</label>
//         <input type="password" class="form-control" aria-describedby="wallet password" placeholder="Wallet Password">
//         <small class="form-text text-muted">Password set when when you created your wallet.</small>
//       </div>
//       <a href="#" @click="$emit('submit')" class="btn btn-primary">SUBMIT</a>
//     </div>
//   </div>
//   </transition>

//   `
// })

function print_phone_number(phone) {
  if (phone.length != 10) return phone
  let area_code = phone.slice(0, 3)
  let first_half = phone.slice(3, 6)
  let second_half = phone.slice(7, 10)
  return `+1 (${area_code}) ${first_half}-${second_half}`
}

async function gas_station_data() {
  try {
    let resp = await $.get('/gas_station_data')
    console.log(resp)
    if (resp.resp) return {
      median_price,
      median_time,
    } = resp.resp
  } catch (err) {
    throw err

  }

}

function disable_ui(el) {
  console.log(el)
  $(el).prop('disabled', true)
}

function enable_ui(el) {
  $(el).prop('disabled', false)
}

function toEth(wei_amount) {
  return web3.fromWei(wei_amount, 'ether')
}

function copy (el_id) {
  console.log(el_id)
  var el = document.querySelector(`#${el_id}`)
  var resp = selectElementContents(el)
  console.log(resp)
}


function new_formated_date() {
  return moment(new Date().getTime()).format('MM/DD/YY hh:mm:ss a')
}
function format_date(time) {
  return moment(time).format('MM/DD/YY hh:mm:ss a')
}

function get_time_since(time) {
  // console.log(time)
  const d = moment.duration(moment().diff(new moment(time)))._data
  var timestamp = ''
  if (d.days) timestamp += `${d.days} days `
  if (d.hours) timestamp += `${d.hours} hours `
  if (d.minutes) timestamp += `${d.minutes} minutes `
  if (d.seconds) timestamp += `${d.seconds} seconds `
  timestamp += 'ago'
  return timestamp

}

function show_modal(id){
  setTimeout(() => {
    $(`#${id}`).modal('show')
  }, 0);
}
function hide_modal(id){
  setTimeout(() => {
    $(`#${id}`).modal('hide')
  }, 0);
}

function show_two_factor_auth_modal() {
  setTimeout(() => {
    $('#two_factor_auth_modal').modal('show')
  }, 0);
}
function hide_two_factor_auth_modal() {
    setTimeout(() => {
      $('#two_factor_auth_modal').modal('hide')
    }, 0);
}

// function get_eth_balance(address, cb) {
//   console.log(address)
//   $.get(`/eth_balance/${address}`,
//     // accounts:this.user.wallet_addresses[0]//sending an array to keep the loop function on the server incase later i want to loop over more accoutns
//     (resp) => {
//       console.log('main account balance')
//       cb(resp)
//       // console.log(resp[0])
//       // const balance_obj= resp[0]

//     })

// }

const event_hashes = {
  '0x13607bf9d2dd20e1f3a7daf47ab12856f8aad65e6ae7e2c75ace3d0c424a40e8': 'Closed',
  '0xdfe9f2e2d9a591e6f645aef6d055f259f1f68cff03c5021bbc474eee389fcca1': 'RefundsEnabled',
  '0xd7dee2702d63ad89917b6a4da9981c90c4d24f8c2bdfd64c604ecae57d8d0651': 'Refunded',
  '0xb0517ae5321897fe9226da206ab2ec4d2a9cb1ba7c10888e3858fa5c6ec4e21f': 'TokenPurchase',
  '0x8e500951de09bcc6854e88c0810bafb819503505895751e657a92df6578d3d99': 'Finalized',
  '0xab66f73b675d5595b284dcc568840a82274ef31950d24d3cc92d039419793396': 'Goal_reached_Event',
  '0xf4dbd1b10a25ed18852679e19c415bcc88fdc3c2535aa531078dae6da63bcd77': 'Cancled',
  '0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925': 'Approval',
  '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef': 'Transfer',
  '0x3e65cd77090a8b7240dd9dcefa460e7eb626926d8b68dbfc455c7ffcd988f688': 'Bid_For_Tokens_Event',
  '0xe6bb4597f6fbde839939e7cf759cd18c10138afa34a133d62d93b808a43158e9': 'Cancel_Bid_For_Tokens_Event',
  '0x16b55e5f2e44b418b44440f311e5c54144576f5afd3f769e47b8f04d67890ba8': 'Tokens_For_Sale_Event',
  '0x2227588728f2680978996ecf255b354a6beeb44f5c58b12ea33e63d4a975a36a': 'Cancel_Tokens_For_Sale_Event',
  '0x8c94105e6dccb901588092b210bea6eeb22a4df3d5080ba1cc1524ade8cab17f': 'Bid_For_tokens_Accepted_Event',
  '0x1e2756c8cd58bb6b59ef294def31a6f86208375d1aa154bffcc243da68dc938e': 'Purchase_Tokens_For_Sale_Event',
  '0x8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0': 'OwnershipTransferred',
  '0x2a22676e157590644e4de4fe87a71a6c3ade4c566ec41104344b759bf2d66a25': 'Crowdsale_started',
}

const expected_returned_event_values = {
  'Closed': ['crowdsale_address'],
  'RefundsEnabled': ['crowdsale_address'],
  'Refunded': ['beneficiary', 'weiAmount'],
  'TokenPurchase': ['purchaser', 'beneficiary', 'crowdsale_address', 'token_address', 'event_time', 'value', 'amount', 'refund_amount'],
  'Finalized': ['crowdsale_address'],
  'Goal_reached_Event': ['crowdsale_address', 'time'],
  'Cancled': ['crowdsale_address', 'msg_sender', 'time'],
  'Approval': ['owner', 'spender', 'value'],
  'Transfer': ['from', 'to', 'value'],
  'Bid_For_Tokens_Event': ['token_address', 'seller_address', 'token_amount', 'wei_amount', 'seller_index', 'token_index', 'time'],
  'Cancel_Bid_For_Tokens_Event': ['token_address', 'seller_address', 'token_amount', 'wei_amount', 'seller_index', 'token_index', 'time'],
  'Tokens_For_Sale_Event': ['token_address', 'seller_address', 'token_amount', 'wei_amount', 'seller_index', 'token_index', 'time'],
  'Cancel_Tokens_For_Sale_Event': ['token_address', 'seller_address', 'token_amount', 'wei_amount', 'seller_index', 'token_index', 'time'],
  'Bid_For_tokens_Accepted_Event': ['token_address', 'seller_address', 'buyer_address', 'token_amount', 'wei_amount', 'seller_index', 'token_index', 'time'],
  'Purchase_Tokens_For_Sale_Event': ['value_sent_from_buyer', 'token_address', 'seller_address', 'buyer_address', 'token_amount', 'wei_amount', 'seller_index', 'token_index', 'time',],
  'OwnershipTransferred': ['previousOwner', 'newOwner'],
  'Crowdsale_started': ['fundraiser_address', 'crowdsale_address', 'token_address'],
}

function parse_event_hash(hash) {
  return event_hashes[hash]
}

// function get_event_data