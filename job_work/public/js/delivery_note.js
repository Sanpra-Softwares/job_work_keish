frappe.ui.form.on('Delivery Note', {
    // customer: function(frm) {
    //     frappe.db.get_value("Warehouse", {"warehouse_name": frm.doc.customer_name}, "name", function(value) {
    //         if (value) {
    //             let warehouse_name = value.name;
    //             frm.set_value('set_warehouse', warehouse_name);
    //         } else {
    //             frappe.msgprint(__('Warehouse not found'));
    //         }
    //     });
    // },
    company: function(frm){
        if(frm.doc.company){
            set_filters(frm, 'item_code', 'items',[['Item', 'custom_company', '=', frm.doc.company]])
        }
    },
    setup: function(frm){
        set_filters(frm, 'item_code', 'items',[['Item', 'custom_company', '=', frm.doc.company]])
    }
});

function set_filters(frm, DocTypeFieldName, DocTypeField, filters){
    if(DocTypeField !== 'None'){
        frm.set_query(DocTypeFieldName, DocTypeField, function(doc, cdt, cdn) {
            return {
                filters: filters
            };
        });
    } else{
        frm.set_query(DocTypeFieldName, function(doc) {
            return {
                filters: filters,
            };
        });
    }
}

frappe.ui.form.on('Delivery Note', {
    custom_vehicle_: function(frm) {
        frappe.db.get_value("Vehicle Master", {"name": frm.doc.custom_vehicle_}, ["name", "driver_name"], function(value) {
            let veh_name = value.name;
            frm.set_value('vehicle_no', veh_name);
            let dri_name = value.driver_name;
            frm.set_value('driver_name', dri_name);
        });
    }
});


frappe.ui.form.on("Delivery Note Item", "custom_casting", function(frm, cdt, cdn) {
    var d = locals[cdt][cdn];
    if(d.custom_casting == "CR"){
        var result = (d.qty).toFixed(2);
        frappe.model.set_value(cdt, cdn, 'custom_cr', result);
    }
    else{frappe.model.set_value(cdt, cdn, 'custom_cr', 0);}
    
    if(d.custom_casting == "MR"){
        var result1 = (d.qty).toFixed(2);
        frappe.model.set_value(cdt, cdn, 'custom_mr', result1);
    }
    else{frappe.model.set_value(cdt, cdn, 'custom_mr', 0);}
    
    if(d.custom_casting == "RW"){
        var result2 = (d.qty).toFixed(2);
        frappe.model.set_value(cdt, cdn, 'custom_rw', result2);
    }
    else{frappe.model.set_value(cdt, cdn, 'custom_rw', 0);}
    
    if(d.custom_casting == "ACR"){
        var result3 = (d.qty).toFixed(2);
        frappe.model.set_value(cdt, cdn, 'custom_acr', result3);
    }
    else{frappe.model.set_value(cdt, cdn, 'custom_acr', 0);}
    
    if(d.custom_casting == "OK"){
        var result4 = (d.qty).toFixed(2);
        frappe.model.set_value(cdt, cdn, 'custom_ok', result4);
    }
    else{frappe.model.set_value(cdt, cdn, 'custom_ok', 0);}
});
frappe.ui.form.on("Delivery Note Item", "qty", function(frm, cdt, cdn) {
    var d = locals[cdt][cdn];
    if(d.custom_casting == "CR"){
        var result = (d.qty).toFixed(2);
        frappe.model.set_value(cdt, cdn, 'custom_cr', result);
    }
    else{frappe.model.set_value(cdt, cdn, 'custom_cr', 0);}
    
    if(d.custom_casting == "MR"){
        var result1 = (d.qty).toFixed(2);
        frappe.model.set_value(cdt, cdn, 'custom_mr', result1);
    }
    else{frappe.model.set_value(cdt, cdn, 'custom_mr', 0);}
    
    if(d.custom_casting == "RW"){
        var result2 = (d.qty).toFixed(2);
        frappe.model.set_value(cdt, cdn, 'custom_rw', result2);
    }
    else{frappe.model.set_value(cdt, cdn, 'custom_rw', 0);}
    
    if(d.custom_casting == "ACR"){
        var result3 = (d.qty).toFixed(2);
        frappe.model.set_value(cdt, cdn, 'custom_acr', result3);
    }
    else{frappe.model.set_value(cdt, cdn, 'custom_acr', 0);}
    
    if(d.custom_casting == "OK"){
        var result4 = (d.qty).toFixed(2);
        frappe.model.set_value(cdt, cdn, 'custom_ok', result4);
    }
    else{frappe.model.set_value(cdt, cdn, 'custom_ok', 0);}
});

frappe.ui.form.on("Delivery Note Item", "qty", function(frm, cdt, cdn) {
    var d = locals[cdt][cdn];
    if(d.custom_casting == "OK"){
        var result = (d.qty * d.custom_ok_job_casting_wgt).toFixed(2);
        frappe.model.set_value(cdt, cdn, 'custom_ok_job_finish_wgt', result);
    }
    else{frappe.model.set_value(cdt, cdn, 'custom_ok_job_finish_wgt', 0);}
});

frappe.ui.form.on("Delivery Note Item", "item_code", function(frm, cdt, cdn) {
    var d = locals[cdt][cdn];
    if(d.custom_casting == "OK"){
        var result = (d.qty * d.custom_ok_job_casting_wgt).toFixed(2);
        frappe.model.set_value(cdt, cdn, 'custom_ok_job_finish_wgt', result);
    }
    else{frappe.model.set_value(cdt, cdn, 'custom_ok_job_finish_wgt', 0);}
});


