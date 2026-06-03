import frappe
from frappe.model.document import Document
from datetime import datetime
from frappe.utils import nowdate, nowtime
from frappe.utils import flt
from erpnext.stock.utils import get_stock_balance

class StockStatement(Document):
	# @frappe.whitelist()	
	# def on_cancel(self):
	# 	for i in self.inward:
	# 		frappe.db.set_value("Purchase Receipt",i.po_no,"custom_flag", 0)
	# 	for j in self.outward:
	# 		frappe.db.set_value("Delivery Note",j.cn,"custom_flag", 0)

	# @frappe.whitelist()	
	# def after_submit_js(self):
	# 	for i in self.inward:
	# 		frappe.db.set_value("Purchase Receipt",i.po_no, "custom_flag", 1)
	# 	for j in self.outward:
	# 		frappe.db.set_value("Delivery Note",j.cn, "custom_flag", 1)



		# if self.ok_cr_mr_boring:
		# 	jobseting = frappe.get_doc("Jobwork Setting")
		# 	war_doc = frappe.get_all("Warehouse",filters={'warehouse_name':self.party_name})
		# 	war_hos_id = (war_doc[0]).name
		# 	stock_entry = frappe.new_doc("Stock Entry")
		# 	stock_entry.stock_entry_type = "Material Receipt"
		# 	stock_entry.posting_date = nowdate()
		# 	stock_entry.posting_time = nowtime()
		# 	stock_entry.to_warehouse = war_hos_id
		# 	stock_entry.custom_stock_statement = self.name
		# 	stock_entry.append("items",{
		# 		't_warehouse': war_hos_id,
		# 		'item_code': jobseting.boring_item,
		# 		'qty': self.ok_cr_mr_boring,
		# 	})
		# 	stock_entry.save()
		# 	stock_entry.submit()

	@frappe.whitelist()	
	def upend_trigger(self):
		# opn_sum = 0
		# opening_balance = frappe.db.sql("""
		# 		SELECT qty_after_transaction 
		# 		FROM `tabStock Ledger Entry` 
		# 		WHERE posting_date < '{0}' 
		# 			AND warehouse = '{1}' 
		# 			AND item_code = '{2}' 
		# 			AND company = '{3}' 
		# 			AND is_cancelled='{4}'
		# 		ORDER BY creation DESC 
		# 		LIMIT 1
		# 		""".format(self.from_date, self.warehouse, self.item_code, self.company, False), as_dict=True)
		# if opening_balance:
		# 	opn_sum = opening_balance[0].qty_after_transaction

		# frappe.msgprint(str(opening_balance))
		# self.opening_stock = opn_sum
		# open_stock = get_stock_balance(self.item_code, self.warehouse, self.from_date)
		# self.opening_stock = open_stock
		self.inward.clear()
		self.outward.clear()
		if isinstance(self.from_date, str):
			from_date = datetime.strptime(self.from_date, '%Y-%m-%d')
		else:
			from_date = self.from_date

		if isinstance(self.to_date, str):
			to_date = datetime.strptime(self.to_date, '%Y-%m-%d')
		else:
			to_date = self.to_date

		from_date_str = from_date.strftime('%Y-%m-%d')
		to_date_str = to_date.strftime('%Y-%m-%d')

		purchase_docs = frappe.get_all("Purchase Receipt", filters={
			'supplier': self.party_name,
			'posting_date': ['between', [from_date_str, to_date_str]],
			# 'custom_flag': 0
		},
		order_by='posting_date asc'
		)

		total_qty = 0

		for purchase_doc in purchase_docs:
			purchase = frappe.get_doc("Purchase Receipt", purchase_doc['name'])
			for item in purchase.items:
				if self.item_code == item.item_code and purchase.docstatus == 1 and self.company == purchase.company:
				# if self.item_code == item.item_code and purchase.custom_flag == 0:
					self.append("inward", {
						'date': purchase.posting_date,
						'item_code': item.item_code,
						'cn': purchase.supplier_delivery_note,
						'qty': item.received_qty,
						'po_no':purchase.name
					})
					total_qty += item.received_qty

		self.total_inward = total_qty

		delivery_docs = frappe.get_all("Delivery Note", filters={
			'customer': self.party_name,
			'posting_date': ['between', [from_date_str, to_date_str]],
			# 'custom_flag': 0
		},
    	order_by='posting_date asc'
		)

		tot_ok, tot_cr, tot_mr,tot_acr,tot_rw,tot_cr_kg,tot_mr_kg,tot_acr_kg,tot_rw_kg, = 0, 0, 0, 0, 0, 0, 0, 0, 0

		for delivery_doc in delivery_docs:
			delivery = frappe.get_doc("Delivery Note", delivery_doc['name'])
			for item in delivery.items:
				if self.item_code == item.item_code and delivery.docstatus == 1 and self.company == delivery.company:
				# if self.item_code == item.item_code and delivery.custom_flag == 0:
					self.append("outward", {
						'date': delivery.posting_date,
						'item_code': item.item_code,
						'cn': delivery.name,
						'qty': item.custom_ok,
						'cr': item.custom_cr,
						'mr': item.custom_mr,
						'acr':item.custom_acr,
						'rw':item.custom_rw,
						"cr_kg":item.custom_cr_kg,
						"mr_kg":item.custom_mr_kg,
						"acr_kg":item.custom_acr_kg,
						"rw_kg":item.custom_rw_kg,
						"ok_kg":item.custom_casting_weight,
					})
					tot_ok += item.custom_ok
					tot_cr += item.custom_cr
					tot_mr += item.custom_mr
					tot_acr += item.custom_acr
					tot_rw += item.custom_rw
					tot_cr_kg += item.custom_cr_kg
					tot_mr_kg += item.custom_mr_kg


		self.tot_ok = tot_ok
		self.tot_cr = tot_cr
		self.tot_mr = tot_mr
		self.acr = tot_acr
		self.rw = tot_rw
		self.total = tot_ok + tot_cr + tot_mr + tot_acr + tot_rw
		self.casting_qty = tot_cr + tot_mr
		if self.casting_wgt:
			self.casting_total_wgt = self.casting_wgt * (tot_cr + tot_mr)
		self.balance = (self.opening_stock + self.total_inward) - self.total
		# self.cr_wgt = tot_cr_kg
		# self.mr_wgt = tot_mr_kg
		# self.cr_mr_wgt = tot_cr_kg + tot_mr_kg
		# if self.casting_wgt:
		# 	self.diff_wgt = self.casting_wgt * (self.casting_qty) - self.cr_mr_wgt
		# single_wgt = self.casting_wgt - self.finish_weight
		# self.ok_qty_boring = single_wgt * self.tot_ok
		total_cr_kg = 0
		total_mr_kg = 0
		for j in self.outward:
			if j.cr: 
				total_cr_kg += j.ok_kg
			if j.mr: 
				total_mr_kg += j.ok_kg 

		self.cr_wgt = total_cr_kg
		self.mr_wgt = total_mr_kg
		self.cr_mr_wgt = self.cr_wgt + self.mr_wgt
		if self.casting_wgt:
			self.diff_wgt = self.casting_total_wgt - (self.cr_wgt + self.mr_wgt)
   
#    (self.casting_wgt *(self.casting_qty) - (self.cr_mr_wgt))
  
		