$('#_approved').click(function() {
  jQuery.post('http://localhost/Scripteka/json/set/approve',
    { id: $('#node-form').attr('action').match(/\/(\d{1,})\//)[1] },
    function() { alert('successfull') }
  )
})