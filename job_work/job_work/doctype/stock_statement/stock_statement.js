// Copyright (c) 2024, unitech and contributors
// For license information, please see license.txt

// frappe.ui.form.on("Stock Statement", {
//       refresh: function(frm) {
//           frm.fields_dict.get_data.$input.on('click', function() {
//               frappe.call({
//                   method: 'unitech.unitech.doctype.stock_statement.stock_statement.get_data',
//                   args: {
//                       docname: frm.doc.name
//                   },
//                   callback: function(r) {
//                       if (r.message) {
//                           frappe.msgprint(r.message);
//                       }
//                   }
//               });
//           });
//       }
//   });

frappe.ui.form.on('Stock Statement', {
    item_code: function (frm) {
        get_opening_stock(frm);
    },
    from_date: function (frm) {
        get_opening_stock(frm);
    }
});


function get_opening_stock(frm) {
        if (frm.doc.item_code && frm.doc.from_date) {
            frappe.call({
                method: 'erpnext.stock.utils.get_stock_balance',
                args: {
                    item_code: frm.doc.item_code,
                    warehouse: frm.doc.warehouse || '',  // Optional: Use warehouse if needed
                    posting_date: frm.doc.from_date,
                    posting_time: '00:00:00'  // Get opening stock at the start of the day
                },
                callback: function (r) {
                    if (r.message !== undefined) {
                        frm.set_value('opening_stock', r.message);
                        // frappe.msgprint(__('Opening Stock: {0}', [r.message]));
                    } else {
                        frm.set_value('opening_stock', 0);
                        // frappe.msgprint(__('No opening stock found.'));
                    }
                }
            });
        }
    }


frappe.ui.form.on('Stock Statement', {
	before_save(frm){
		frm.clear_table("inward")
		frm.refresh_field("inward")
        frm.clear_table("outward")
		frm.refresh_field("outward")
		frm.call	({
			method:"upend_trigger",
			doc:frm.doc,
		})
		// var row =(frm.doc.tot_ok + frm.doc.tot_cr + frm.doc.tot_mr + frm.doc.acr + frm.doc.rw);
		// 	frappe.model.set_value(cdt, cdn, 'total', row);
		// var row = frm.doc.casting_wgt * ( frm.doc.tot_cr + frm.doc.tot_mr);
		// 	frappe.model.set_value(cdt, cdn, 'casting_total_wgt', row);
		// var row = frm.doc.casting_wgt * (frm.doc.tot_cr + frm.doc.tot_mr) - frm.doc.cr_wgt + frm.doc.mr_wgt;
		// 	frappe.model.set_value(cdt, cdn, 'diff_wgt', row);
		// var row =frm.doc.cr_wgt + frm.doc.mr_wgt;
		// 	frappe.model.set_value(cdt, cdn, 'cr_mr_wgt', row);
		// var row = frm.doc.casting_wgt * (frm.doc.tot_cr + frm.doc.tot_mr) - frm.doc.cr_wgt + frm.doc.mr_wgt;
		// 	frappe.model.set_value(cdt, cdn, 'diff_wgt', row);
		// var row = frm.doc.cr_wgt + frm.doc.mr_wgt;
		// 	frappe.model.set_value(cdt, cdn, 'cr_mr_wgt', row);
		// var row = frm.doc.casting_wgt * (frm.doc.tot_cr + frm.doc.tot_mr) - frm.doc.cr_wgt + frm.doc.mr_wgt;
		// 	frappe.model.set_value(cdt, cdn, 'diff_wgt', row);
	}
});

frappe.ui.form.on('Stock Statement', {
	item_code(frm){
		frappe.db.get_value("Set CR MR Weight", {"name": frm.doc.item_code}, "casting_weight", function(value) {
			let caswgt = value.casting_weight;
			frm.set_value('casting_wgt', caswgt);
	});
	}
});

// frappe.ui.form.on('Stock Statement', {
// 	on_submit(frm){
// 		frm.call	({
// 			method:"after_submit_js",
// 			doc:frm.doc,
// 		})
// 	}
// });

// frappe.ui.form.on('Stock Statement', {
// 	on_cancel(frm){
// 		frm.call	({
// 			method:"after__js",
// 			doc:frm.doc,
// 		})
// 	}
// });

// frappe.ui.form.on('Stock Statement', {
//     acr: function (frm, cdt, cdn) {
//         var row =(frm.doc.tot_ok + frm.doc.tot_cr + frm.doc.tot_mr + frm.doc.acr + frm.doc.rw);
//             frappe.model.set_value(cdt, cdn, 'total', row);
//     }
// });

// frappe.ui.form.on('Stock Statement', {
//     casting_wgt: function (frm, cdt, cdn) {
//         var row = frm.doc.casting_wgt * ( frm.doc.tot_cr + frm.doc.tot_mr);
//             frappe.model.set_value(cdt, cdn, 'casting_total_wgt', row);
// 			var row = (frm.doc.casting_total_wgt - frm.doc.cr_mr_wgt);
//             frappe.model.set_value(cdt, cdn, 'diff_wgt', row);
// 			var mpd = (frm.doc.ok_qty_boring + frm.doc.diff_wgt);
//             frappe.model.set_value(cdt, cdn, 'ok_cr_mr_boring', mpd);
//     }
// });

// frappe.ui.form.on('Stock Statement', {
//     cr_wgt: function (frm, cdt, cdn) {
//         var row =frm.doc.cr_wgt + frm.doc.mr_wgt;
//             frappe.model.set_value(cdt, cdn, 'cr_mr_wgt', row);
// 			var row = (frm.doc.casting_total_wgt - frm.doc.cr_mr_wgt);
//             frappe.model.set_value(cdt, cdn, 'diff_wgt', row);
// 			var mpd = (frm.doc.ok_qty_boring + frm.doc.diff_wgt);
//             frappe.model.set_value(cdt, cdn, 'ok_cr_mr_boring', mpd);
//     }
// });
// frappe.ui.form.on('Stock Statement', {
//     mr_wgt: function (frm, cdt, cdn) {
//         var row = frm.doc.cr_wgt + frm.doc.mr_wgt;
//             frappe.model.set_value(cdt, cdn, 'cr_mr_wgt', row);
// 			var row = (frm.doc.casting_total_wgt - frm.doc.cr_mr_wgt);
//             frappe.model.set_value(cdt, cdn, 'diff_wgt', row);
// 			var mpd = (frm.doc.ok_qty_boring + frm.doc.diff_wgt);
//             frappe.model.set_value(cdt, cdn, 'ok_cr_mr_boring', mpd);
//     }
// });

// frappe.ui.form.on('Stock Statement', {
// 	onload(frm,cdt,cdn) {
// 		$('input[data-fieldname="casting_wgt"]').css("background-color","#095255");
// 		$('input[data-fieldname="cr_wgt"]').css("background-color","#095255");
// 		$('input[data-fieldname="mr_wgt"]').css("background-color","#095255");
// 		$('input[data-fieldname="party_name"]').css("background-color","#095255");
// 		$('input[data-fieldname="from_date"]').css("background-color","#095255");
// 		$('input[data-fieldname="to_date"]').css("background-color","#095255");
// 		$('input[data-fieldname="item_code"]').css("background-color","#095255");
// 		$('button[data-fieldname="get_data"]').css("background-color","#16A4B0");
// 	}
// });
// frappe.ui.form.on('Stock Statement', {
// 	refresh(frm,cdt,cdn) {
// 		$('input[data-fieldname="casting_wgt"]').css("background-color","#095255");
// 		$('input[data-fieldname="cr_wgt"]').css("background-color","#095255");
// 		$('input[data-fieldname="mr_wgt"]').css("background-color","#095255");
// 		$('input[data-fieldname="party_name"]').css("background-color","#095255");
// 		$('input[data-fieldname="from_date"]').css("background-color","#095255");
// 		$('input[data-fieldname="to_date"]').css("background-color","#095255");
// 		$('input[data-fieldname="item_code"]').css("background-color","#095255");
// 		$('button[data-fieldname="get_data"]').css("background-color","#16A4B0");
// 	}
// });


  