frappe.ui.form.on('Purchase Receipt', {
    supplier: function(frm) {
        // frappe.db.get_value("Warehouse", {"warehouse_name": frm.doc.supplier_name}, "name", function(value) {
        //     if (value) {
        //         let warehouse_name = value.name;
        //         frm.set_value('set_warehouse', warehouse_name);
        //     } else {
        //         frappe.msgprint(__('Warehouse not found'));
        //     }
        // });
        frappe.db.get_value("Supplier", {"name": frm.doc.supplier}, "custom_po_prifix", function(value) {
                let prifix = value.custom_po_prifix;
                frm.set_value('supplier_delivery_note', prifix);
        });
    }
});
