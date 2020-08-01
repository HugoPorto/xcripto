$(function () {
    $("#tickers24hrs").DataTable({
        "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]],
        "language": {
            "url": "datatables/json/Portuguese-Brasil.json"
        },
        "paging": false,
        "lengthChange": false,
        "searching": true,
        "ordering": false,
        "info": false,
        "autoWidth": false
    });
});