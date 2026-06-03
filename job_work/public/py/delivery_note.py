import frappe
from frappe import _

def validate(doc, method=None):
    for row in doc.items:
        if not row.item_code:
            continue

        warehouse = frappe.db.get_value(
            "Item",
            row.item_code,
            "custom_warehouse"
        )

        if not warehouse:
            frappe.throw(
                _("Row #{0}: Custom Warehouse is not set in Item Master for Item <b>{1}</b>")
                .format(row.idx, row.item_code)
            )