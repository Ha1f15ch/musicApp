// /* $(function() {
//     $('#form_POST_data_track').on('submit', function(e) {
//         /* e.preventDefault(); */
//         var val = document.getElementById('form_POST_data_track'),
//         formData = new FormData(val.get(0));
//         $.ajax({
//             url: val.attr('action'),
//             type: val.attr('method'),
//             contentType: false,
//             processData: false,
//             data: formData,
//             dataType: 'json',
//             success: function(json) {
//                 if(json) {
//                     val.replaceWith(json);
//                 }
//             }
//         })
//         console.log(formData)
//     })
// }) */
//https://www.pvsm.ru/javascript/64912
// /* document.addEventListener('DOMContentLoaded', () => {
        
//         const formData = document.getElementById('form_POST_data_track')
//         const formvalues = new FormData(formData);

//         let Track_data = {
//             name_track: formvalues.get('name_track'),
//             janr_track: formvalues.get('data_janr'),
//             descr_track: formvalues.get('description_track'),
//             trackValue: formvalues.get('track')
//         }

//         console.log(formData)

//         $("#btn_send_form_create_track").click(() => {
//             jQuery.ajax({
//                 type: 'POST',
//                 contentType: false,
//                 processData: false,
//                 data: formData,
//                 /* dataType: 'json', */
//                 success: function(resp) {
//                     console.log('Выполнелось, данные отправлены с клиента!!')
//                     alert(resp)
//                     console.log(resp)
//                 },
//                 error: function(xhr, str) {
//                     alert('Возникла ошибка - ' + xhr.resp)
//                 }
//             });
//         })
// })

// //http://incode.pro/jquery/ajax-na-praktike-zagruzka-fajlov.html */