var $form = $('#the-form');
var $table = $('#the-table');
var $tbody = $table.find('tbody');
var editingItem = null;

var drawTable = function(store) {

    store.getAll().then(function(data){
        $tbody.empty();
        $.each(data, function() {
            var tr = (tmpl("tpl", this));
            $tbody.append(tr);
        });
        attachTableEvents();
    });
};

var onSubmit = function() {
    var formData = {
        name: $('input[name="city"]').val(),
        visited: $('input[name="visited"]').is(":checked") ? 1 : 0,
        stars: parseInt($('input[name="stele"]').val(), 10)
    };

    if (editingItem) {

        store.update(editingItem.id,formData).then(function() {
            $form.removeClass("editing");
            drawTable(store);
        });
    } else {

        store.add(formData).then(function() {
            drawTable(store);
        });
    }

    resetForm();

    return false;
};

var attachTableEvents = function() {
    $tbody.find('a.delete').click(deleteClicked);
    $tbody.find('a.edit').click(editClicked);
};

var deleteClicked = function() {
    var id = $(this).closest('tr').data('id');

    store.delete(id).then(function() {
        drawTable(store);
    });

    return false;
};

var editClicked = function() {
    $form.addClass("editing");
    var id = $(this).closest('tr').data('id');

    store.get(id).then(function(data) {
        editingItem = data;
        $('input[name="city"]').val(data.name);
        $('input[name="visited"]').prop("checked", data.visited);
        $('input[name="stele"]').val(data.stars).change();
    });

    return false;
};

var cancelClicked = function (){
    $form.removeClass("editing");
    resetForm();

    return false;
};

var resetForm = function (){
    $('#inputCity').val('');
    $('input[name="stele"]').val('').change();
    $('input[name="visited"]').prop('checked', false);
};

$(document).ready(function() {
    $form.submit(onSubmit);
    $form.find('a.cancel').click(cancelClicked);
    $('[name="stele"]').stars();
    drawTable(store);
});