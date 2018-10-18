const j = require('jscodeshift');
const content = `import emberRouter from '@ember/routing/router';
const Router = emberRouter.extend();
Router.map(function() {
  this.route('catchAll', { path: '*:' });
  this.route('unauthorized', { path: '/*path' });
  this.route('disabled');
});

Router.map(function() {
  this.route('mobileappslist');
  this.route('dell-offer');
  this.route('home', function() {
    this.route('dashboard', {
      path: '/dashboard'
    });
  });
  this.route('customviews', function() {
    this.route('new');
    this.route('edit', { path: '/:customview_id/edit' });
  });
  this.route('orgsetup', { path: 'setuporganization' });
  this.route('initialsetup', { path: 'initialsetup' });
  this.route('orgquicksetup', { path: 'quicksetup' });

  this.route('setup', { resetNamespace: true }, function() {
    this.route('orgsettings');
    this.route('features');
    this.route('vat');
    this.route('taxreturn');
    this.route('tax');
    this.route('invoicetemplates');
    this.route('onlinepayments');
    this.route('squareconnect');
  });

  this.route('gettingstarted');
  this.route('contacts', function() {
    this.route('new', { path: '/new' });
    this.route('edit', { path: '/:contact_id/edit' });
    this.route('mailstatement', { path: '/:contact_id/statement/email' });
    this.route('vendormailstatement', { path: '/:contact_id/vendorstatement/email' });
    this.route('emailcustomer', { path: '/:contact_id/email' });
    this.route('customerreview', { path: '/:contact_id/customerreview/email' });
    this.route('paymentinformation', { path: '/:contact_id/paymentinformation' });
    this.route('vendorpaymentnew', { path: '/:contact_id/vendorpayment' });
    this.route('vendorchecknew', { path: '/:contact_id/vendorcheck' });
    this.route('gappscontacts', { path: '/importgappscontacts' });
    this.route('import', { path: '/import' });
    this.route('importmicrosoftcontacts', { path: '/importmicrosoftcontacts' });
    this.route('cpimport', { path: '/persons/import' });
    this.route('vendorimport', { path: '/vendor/import' });
    this.route('vendorcpimport', { path: '/vendorcp/import' });
    this.route('customerpaymentnew', { path: '/:contact_id/customerpayment' });
    this.route('list', { path: '/' }, function() {
      this.route('details', { path: '/:contact_id' }, function() {
        this.route('index', { path: '/' });
        this.route('salestxns', { path: '/sales' });
        this.route('purchasestxns', { path: '/purchases' });
        this.route('emailhistory', { path: '/emailhistory' });
        this.route('statement', { path: '/statement' });
        this.route('crmdetails', { path: '/crmdetails' });
        this.route('comments', { path: '/comments' });
      });
    });
  });

  this.route('vendors', function() {
    this.route('new', { path: '/new' });
    this.route('vendor-edit', { path: '/:contact_id/edit' });
    // this.route('vendormailstatement', { path: '/:contact_id/vendorstatement/email' });
    // this.route('emailcustomer', { path: '/:contact_id/email' });
    // this.route('customerreview', { path: '/:contact_id/customerreview/email' });
    // this.route('vendorpaymentnew', { path: '/:contact_id/vendorpayment' });
    // this.route('vendorchecknew', { path: '/:contact_id/vendorcheck' });
    // this.route('gappscontacts', { path: '/importgappscontacts' });
    // this.route('importmicrosoftcontacts', { path: '/importmicrosoftcontacts' });
    // this.route('vendorimport', { path: '/vendor/import' });
    // this.route('vendorcpimport', { path: '/vendorcp/import' });
    this.route('list', { path: '/' }, function() {
      this.route('details', { path: '/:contact_id' }, function() {
        this.route('index', { path: '/' });
        this.route('salestxns', { path: '/sales' });
        this.route('purchasestxns', { path: '/purchases' });
        this.route('emailhistory', { path: '/emailhistory' });
        this.route('statement', { path: '/statement' });
        this.route('crmdetails', { path: '/crmdetails' });
        this.route('vendor-comments', { path: '/comments' });
      });
    });
  });

  this.route('itemgroups', function() {
    this.route('new', { path: '/new' });
    this.route('edit', { path: '/:item_id/edit' });
    this.route('list', { path: '/' }, function() {
      this.route('details', { path: '/:group_id' });
      this.route('item-details', { path: 'items/:item_id' }, function() {
        this.route('index', { path: '/' });
        this.route('track-serial-number', { path: 'track-serial-number' });
        this.route('transactions', { path: 'transactions' });
        this.route('adjustments', { path: 'adjustment-history' });
        this.route('itemhistory', { path: '/history' });
      });
    });
    this.route('itemnew', { path: '/:group_id/newitem' });
    this.route('itemedit', { path: 'items/:item_id/edit' });

  });
  this.route('items', function() {
    this.route('list', { path: '/' }, function() {
      this.route('details', { path: '/:item_id' }, function() {
        this.route('index', { path: '/' });
        this.route('track-serial-number', { path: 'track-serial-number' });
        this.route('transactions', { path: 'transactions' });
        this.route('adjustments', { path: 'adjustment-history' });
        this.route('itemhistory', { path: '/history' });
      });
      this.route('composite-details', { path: 'composite/:composite_item_id' }, function() {
        this.route('index', { path: '/' });
        this.route('track-serial-number', { path: 'track-serial-number' });
        this.route('transactions', { path: 'transactions' });
        this.route('boxhistory', { path: 'box-history' });
        this.route('bundlehistory', { path: 'bundle-history' });
        this.route('bundledetails', { path: '/bundling/:bundle_id' });
        this.route('adjustments', { path: 'adjustment-history' });
        this.route('compositehistory', { path: '/history' });
      });
      this.route('bundledetails', { path: '/bundling/:bundle_id' });
    });
    // Migrating item with transactions for enabling inventory.
    this.route('trackinventory', { path: '/trackinventory' });
    this.route('import', { path: '/import' });
    this.route('itemcreation', { path: '/new' });
    this.route('itemedit', { path: '/:item_id/edit' });
  });
  // composite items
  this.route('compositeitems', { path: '/compositeitems' }, function() {
    this.route('list', { path: '/' }, function() {
      this.route('details', { path: '/:composite_item_id' }, function() {
        this.route('index', { path: '/' });
        this.route('track-serial-number', { path: 'track-serial-number' });
        this.route('transactions', { path: 'transactions' });
        this.route('boxhistory', { path: 'box-history' });
        this.route('bundledetails', { path: '/bundling/:bundle_id' });
        this.route('bundlehistory', { path: 'bundle-history' });
        this.route('adjustments', { path: 'adjustment-history' });
        this.route('compositehistory', { path: '/history' });
      });
      this.route('bundledetails', { path: '/bundling/:bundle_id' });
    });
    this.route('bundling.new', { path: '/:composite_item_id/bundling/new' });
    this.route('import', { path: '/import' });
    this.route('new', { path: '/new' });
    this.route('edit', { path: '/:composite_item_id/edit' });
  });
  this.route('pricebooks', { path: '/pricelists' }, function() {
    this.route('list', { path: '/' });
    this.route('importsalespl');
    this.route('importpurchasepl');
    this.route('new', { path: '/new' });
    this.route('edit', { path: '/:pricebook_id' });
  });
  this.route('inventoryadjustments', function() {
    this.route('new', { path: '/new' });
    this.route('list', { path: '/' }, function() {
      this.route('details', { path: '/:inventory_adjustment_id' });
    });
    this.route('quantityimport');
    this.route('valueimport');
  });
  this.route('transferorders', function() {
    this.route('new');
    this.route('list', { path: '/' }, function() {
      this.route('details', { path: '/:transfer_order_id' });
    });
    this.route('import');
  });

  // Transactions
  this.route('paymentsreceived', function() {
    this.route('new', { path: '/new' });
    this.route('edit', { path: '/:payment_id/edit' });
    this.route('mailreceipt', { path: '/:payment_id/email' });
    this.route('customerreview', { path: '/:payment_id/customerreview/email' });
    this.route('invpaymentsimport', { path: 'invoicepayments/import' });
    this.route('retpaymentsimport', { path: 'retainerpayments/import' });
    this.route('list', { path: '/' }, function() {
      this.route('details', { path: '/:payment_id' });
      this.route('retainerpaymentedit', { path: '/:payment_id/retainerpayment/edit' });
      this.route('paymentrefundnew', { path: '/:payment_id/paymentrefund/new' });
      this.route('paymentrefund', { path: '/:payment_id/paymentrefund/:payment_refund_id' });
    });
  });
  this.route('paymentsmade', function() {
    this.route('new', { path: '/new' });
    this.route('edit', { path: '/:payment_id/edit' });
    this.route('upgrade', { path: '/upgrade' });
    this.route('editcheck', { path: '/:payment_id/editcheck' });
    this.route('import', { path: '/import' });
    this.route('bulk');
    this.route('mailpaymentsmade', { path: '/:payment_id/email' });
    this.route('list', { path: '/' }, function() {
      this.route('details', { path: '/:payment_id' });
      this.route('paymentrefundnew', { path: '/:vendorpayment_id/paymentrefund/new' });
      this.route('paymentrefund', { path: '/:vendorpayment_id/paymentrefund/:vendorpayment_refund_id' });
    });
  });
  this.route('checks', function() {
    this.route('list', { path: '/' }, function() {
      this.route('details', { path: '/:check_id' });
    });
  });

  // Delivery Challans
  this.route('deliverychallans', function() {
    this.route('new', { path: '/new' });
    this.route('edit', { path: '/:deliverychallan_id/edit' });
    this.route('list', { path: '/' }, function() {
      this.route('details', { path: '/:deliverychallan_id' });
    });
  });

  // Invoices
  this.route('invoices', function() {
    this.route('new', { path: '/new' });
    this.route('edit', { path: '/:invoice_id/edit' });
    this.route('mailinvoice', { path: '/:invoice_id/email' });
    this.route('remindinvoice', { path: '/:invoice_id/reminder' });
    this.route('customerreview', { path: '/:invoice_id/customerreview/email' });
    this.route('import', { path: '/import' });
    this.route('customerpayment', { path: '/:invoice_id/payment/:payment_id/edit' });
    this.route('shipping-bill/new', { path: '/shipping-bill' });
    this.route('shipping-bill/edit', { path: '/shipping-bill/:shipping_bill_id/edit' });
    this.route('list', { path: '/' }, function() {
      this.route('shipping-bill/details', { path: '/shipping-bill/:shipping_bill_id/details' });
      this.route('details', { path: '/:invoice_id' });
      this.route('payment', { path: '/:invoice_id/payment' });
      this.route('snailmail', { path: '/:invoice_id/snailmail' });
      this.route('schedule', { path: '/:invoice_id/schedule' });
    });
  });

  this.route('quotes', function() {
    this.route('new', { path: '/new' });
    this.route('edit', { path: '/:estimate_id/edit' });
    this.route('mailquote', { path: '/:estimate_id/email' });
    this.route('import', { path: '/import' });
    this.route('list', { path: '/' }, function() {
      this.route('details', { path: '/:estimate_id' });
      this.route('snailmail', { path: '/:estimate_id/snailmail' });
    });
  });

  this.route('retainerinvoices', function() {
    this.route('new', { path: '/new' });
    this.route('edit', { path: '/:retainerinvoice_id/edit' });
    this.route('mailretainerinvoice', { path: '/:retainerinvoice_id/email' });
    this.route('import', { path: '/import' });
    this.route('list', { path: '/' }, function() {
      this.route('details', { path: '/:retainerinvoice_id' });
      this.route('payment', { path: '/:retainerinvoice_id/payment' });
      this.route('retainerpaymentedit', { path: '/:retainerinvoice_id/payment/:payment_id' });
      this.route('refund', { path: '/:retainerinvoice_id/:payment_id/refund' });
      this.route('editrefund', { path: '/:retainerinvoice_id/refund/:payment_refund_id' });
    });
  });

  this.route('creditnotes', function() {
    this.route('new', { path: '/new' });
    this.route('edit', { path: '/:creditnote_id/edit' });
    this.route('mailcreditnote', { path: '/:creditnote_id/email' });
    this.route('import', { path: '/import' });
    this.route('refundsimport', { path: '/refunds/import' });
    this.route('appliedcreditnoteimport', { path: '/appliedcreditnotes/import' });
    this.route('list', { path: '/' }, function() {
      this.route('details', { path: '/:creditnote_id' });
      this.route('refund', { path: '/:creditnote_id/refund' });
      this.route('editrefund', { path: '/:creditnote_id/refund/:creditnote_refund_id' });
    });
  });

  this.route('vendorcredits', function() {
    this.route('new', { path: '/new' });
    this.route('edit', { path: '/:vendor_credit_id/edit' });
    this.route('upgrade', { path: '/upgrade' });
    this.route('import', { path: '/import' });
    this.route('refundsimport', { path: '/refunds/import' });
    this.route('list', { path: '/' }, function() {
      this.route('details', { path: '/:vendor_credit_id' });
      this.route('refund', { path: '/:vendor_credit_id/refund' });
      this.route('editrefund', { path: '/:vendor_credit_id/refund/:vendor_credit_refund_id' });
    });
  });

  this.route('recurringinvoices', function() {
    this.route('new');
    this.route('edit', { path: '/:recurring_invoice_id/edit' });
    this.route('upgrade');
    this.route('import');
    this.route('list', { path: '/' }, function() {
      this.route('details', { path: '/:recurring_invoice_id' }, function() {
        this.route('index', { path: '/' });
        this.route('nextinvoice', { path: '/nextinvoice' });
        this.route('recentactivites', { path: '/recentactivites' });
      });
      this.route('invoicepayment', { path: '/:recurring_invoice_id/invoice/:invoice_id/payment' });
    });
  });

  this.route('expenses', function() {
    this.route('new');
    this.route('bulkadd');
    this.route('edit', { path: '/:expense_id/edit' });
    this.route('import');
    this.route('list', { path: '/' }, function() {
      this.route('details', { path: '/:expense_id' });
    });
  });

  this.route('recurringexpenses', function() {
    this.route('new');
    this.route('edit', { path: '/:recurring_expense_id/edit' });
    this.route('import');
    this.route('list', { path: '/' }, function() {
      this.route('details', { path: '/:recurring_expense_id' });
    });
  });

  this.route('timesheet', function() {
    this.route('projectnew', { path: '/projects/new' });
    this.route('projectedit', { path: '/projects/:project_id/edit' });
    this.route('logonweek', { path: '/logonweek' });
    this.route('projectlist', { path: '/projects' });
    this.route('projectdetails', { path: '/projects/:project_id' }, function() {
      this.route('index', { path: '/' });
      this.route('timesheet', { path: '/timesheet' });
      this.route('purchasetxns', { path: '/purchases' });
      this.route('salestxns', { path: '/sales' });
      this.route('comments', { path: '/comments' });
      this.route('zprojects', { path: '/zohoprojects/:project_id' });
    });
    this.route('logonmonth', { path: '/logonmonth' });
    this.route('alltimeentries', { path: '/alltimeentries' });
    this.route('timesheetsimport', { path: '/alltimeentries/import' });
    this.route('projectsimport', { path: '/projects/import' });
    this.route('tasksimport', { path: '/tasks/import' });
    this.route('approval-creation', { path: '/approvals/new' });
    this.route('clientapprovals', function() {
      this.route('list', { path: '/' }, function() {
        this.route('details', { path: '/:approval_id' });
      });
    });
  });

  this.mount('reports');
  this.route('payroll');

  this.route('documents', function() {
    this.route('allfiles', function() {
      this.route('create', function() {
        this.route('newexpense');
        this.route('newbill');
      });
    });
    this.route('inbox', function() {
      this.route('create', function() {
        this.route('newexpense');
        this.route('newbill');
      });
    });
    this.route('folder', function() {
      this.route('create', function() {
        this.route('newexpense');
        this.route('newbill');
      });
    });
    this.route('trash', { path: '/trash' });
  });

  this.route('referral', function() {
    this.route('index', { path: '/' });
  });

  this.route('settings', function() {

    this.route('orgprofile', { path: '/orgprofile' });
    this.route('users', { path: '/users' }, function() {
      this.route('list', { path: '/' });
      this.route('roles');
      this.route('rolesnew', { path: '/roles/new' });
      this.route('rolesedit', { path: '/roles/:role_id/edit' });
      this.route('customfields');
    });

    this.mount('templates', { as: 'templates' });

    this.route('warehouses');
    this.route('preferences', { path: '/preferences' }, function() {
      this.route('general', { path: '/' });
      this.route('contacts', function() {
        this.route('customfields');
        this.route('custombuttons');
      });
      this.route('items', function() {
        this.route('custombuttons');
      });
      this.route('quotes', function() {
        this.route('customfields');
        this.route('custombuttons');
      });
      this.route('approvals');
      this.route('salesorders', function() {
        this.route('customfields');
        this.route('custombuttons');
      });
      this.route('deliverychallans', function() {
        this.route('customfields');
      });
      this.route('invoices', function() {
        this.route('customfields');
        this.route('custombuttons');
        this.route('field-validations');
      });
      this.route('recurringinvoices');
      this.route('paymentsreceived', function() {
        this.route('customfields');
      });
      this.route('retainerinvoices', function() {
        this.route('customfields');
        this.route('custombuttons');
      });
      this.route('creditnotes', function() {
        this.route('customfields');
        this.route('custombuttons');
      });
      this.route('deliverynotes');
      this.route('packingslips');
      this.route('expenses', function() {
        this.route('customfields');
        this.route('vehicles');
        this.route('custombuttons');
      });
      this.route('bills', function() {
        this.route('customfields');
        this.route('custombuttons');
      });
      this.route('purchaseorders', function() {
        this.route('customfields');
        this.route('custombuttons');
      });
      this.route('branding', function() {
        this.route('domain');
        this.route('portal');
      });
      this.route('organization-networking');
      this.route('paymentsmade', function() {
        this.route('customfields');
      });
      this.route('vendorcredits', function() {
        this.route('customfields');
        this.route('custombuttons');
      });
      this.route('projects', function() {
        this.route('customfields');
        this.route('custombuttons');
      });
      this.route('accountant');
      this.route('newcustombutton', { path: '/custombuttons/new' });
      this.route('editcustombutton', { path: '/custombuttons/:custombutton_id/edit' });

      this.route('new-field-validations', { path: '/field-validations/new' });
      this.route('edit-field-validations', { path: '/field-validations/:field_name/edit' });

      this.route('customapprovals', function() {
        this.route('list');
        this.route('new');
        this.route('edit', { path: '/:policy_id/' });
      });
    });

    this.route('currencies', { path: '/currencies' });
    this.route('currenciesimport', { path: '/currencies/import' });
    this.route('exratehistory', { path: '/:currency_id/exrates' });

    this.route('expensecategories');

    this.route('taxes', function() {
      this.route('taxrates');
      this.route('taxreturnsettings');
      this.route('taxexemptions');
      this.route('list', { path: '/rates' });
      this.route('taxauthorities');
      this.route('avalarasettings');
      this.route('vatsettings');
      this.route('taxrules');
    });
    this.route('avalaraconfig', { path: '/avatax' });
    this.route('emailtemplates', function() {
      this.route('editemailtemplate', { path: '/edit' });
      this.route('emailtype');
    });
    this.route('reminders');
    this.route('subscription');
    this.route('changeplan');
    this.route('crmintegration', { path: '/crmintegration' });
    this.route('crmsetup', { path: '/crmintegration/setup/:entity_type' });
    this.route('crmhistory', { path: '/crmintegration/importhistory/:entity_type' });
    this.route('zohoreports', { path: '/integrations/zohoreports' });
    this.route('zohoreportssetup', { path: '/integrations/zohoreports/setup' });
    this.route('crmerrordetails', { path: '/crmintegration/errordetails' });
    this.route('internal-integration', { path: '/integration' }, function() {
      this.route('workerly', function() {
        this.route('dashboard');
        this.route('mapping');
        this.route('synchistory');
      });
      this.route('people', function() {
        this.route('dashboard');
        this.route('connect');
      });
      this.route('projects', function() {
        this.route('connect');
        this.route('dashboard');
      });
      this.route('errordetails');
      this.route('synchistory');
    });
    this.route('integrations', function() {
      this.route('onlinepayments');
      this.route('customer-onlinepayments');
      this.route('vendor-onlinepayments');
      this.route('zapps');
      this.route('otherapps');
      this.route('zsckey');
      this.route('squareconnect', { path: '/otherapps/square' });
      this.route('stripeconnect', { path: '/stripe' });
      this.route('gocardlessconnect', { path: '/gocardless' });
      this.route('office365', { path: '/otherapps/office365/importhistory' });
      this.route('office365errors', { path: '/otherapps/office365/:id/errors' });
    });

    this.route('automation', function() {
      this.route('workflows');
      this.route('newworkflow');
      this.route('editworkflow', { path: '/workflows/:rule_id/edit' });
      this.route('alerts');
      this.route('fieldupdates');
      this.route('webhooks');
      this.route('customfunctions');
      this.route('logs', function() {
        this.route('webhooks');
        this.route('webhookhistories', { path: '/webhook/:history_id' });
        this.route('customfunctions');
        this.route('cfhistories', { path: '/customfunction/:history_id' });
      });
      this.route('newcustomfunction');
      this.route('editcustomfunction', { path: '/customfunctions/:customfunction_id/edit' });
      this.route('customschedulers');
      this.route('newcustomscheduler');
      this.route('editcustomscheduler', { path: '/customschedulers/:customscheduler_id/edit' });
    });
    // Bulk export option. This route will be used by Finance Team of Zoho
    this.route('bulkexport');

    this.route('databackup');

    // Since this is still experimental, we have been asked to hide this and only expose it to
    // customers who are asking for it. Will have to change later once it is stabilised.
    this.route('backupdocs');

    this.route('reportingtags');
    this.route('openingbalance');
    this.route('openingbalanceedit', { path: '/openingbalance/edit' });
    this.route('openingbalanceimport', { path: '/openingbalance/import' });

  });

  // Import
  this.route('import', function() {
    this.route('index', { path: '/' });
  });

  // Organizations list
  this.route('home/organizations', { path: '/organizations', resetNamespace: true }, function() {
    this.route('otherapporganizations', { path: '/otherapporganizations' });
    this.route('googleorganizations', { path: '/googleorganizations' });
  });

});

Router.map(function() {
  this.route('home/zohoinvorgs', { path: '/zohoinvoiceorganizations' });
  this.route('home/ziimportdetails', { path: '/imports/:organization_id' });
});

Router.map(function() {
  this.route('bills', function() {
    this.route('new', { path: '/new' });
    this.route('edit', { path: '/:bill_id/edit' });
    this.route('upgrade', { path: '/upgrade' });
    this.route('import', { path: '/import' });
    this.route('bill-of-entry/new', { path: ':billId/create-bill-of-entry' });
    this.route('bill-of-entry/edit', { path: ':billId/bill-of-entry/:bill_of_entry_id/edit' });
    this.route('vendorpayment', { path: '/:bill_id/payment/:payment_id/edit' });
    this.route('vendorcheck', { path: '/:bill_id/payment/:payment_id/editcheck' });
    this.route('calendarview', { path: '/calendarview' });
    this.route('list', { path: '/' }, function() {
      this.route('details', { path: '/:bill_id' });
      this.route('bill-of-entry/details', { path: '/bill-of-entry/:bill_of_entry_id' });
      this.route('payment', { path: '/:bill_id/payment' });
    });
    this.route('writecheck', { path: '/:bill_id/checkpayment' });
  });

  this.route('recurringbills', function() {
    this.route('new', { path: '/new' });
    this.route('edit', { path: '/:recurring_bill_id/edit' });
    this.route('upgrade', { path: '/upgrade' });
    this.route('import', { path: '/import' });
    this.route('list', { path: '/' }, function() {
      this.route('details', { path: '/:recurring_bill_id' });
    });
  });

  this.mount('purchaseorders');

  this.route('salesorders', function() {
    this.route('new', { path: '/new' });
    this.route('edit', { path: '/:salesorder_id/edit' });
    this.route('upgrade', { path: '/upgrade' });
    this.route('mailsalesorder', { path: '/:salesorder_id/email' });
    this.route('import', { path: '/import' });
    this.route('list', { path: '/' }, function() {
      this.route('details', { path: '/:salesorder_id' });
    });
  });

  // Packages
  this.route('packages', function() {
    this.route('new');
    this.route('edit', { path: '/:package_id/edit' });
    this.route('list', { path: '/' }, function() {
      this.route('details', { path: '/:package_id' });
      this.route('manualshipment', { path: '/:pack_id/manualshipment' });
      this.route('newshipment', { path: '/:pack_id/shipViaCarrier' });
    });
    this.route('shipment', function() {
      this.route('mail', { path: '/:shipment_id/email' });
    });
  });

  this.mount('banking');

  this.mount('uk-vat-filing', { as: 'vat-filing' });
  this.route('gstfiling-dashboard');
  this.route('gstfiling', function() {
    this.mount('ztax-engine', { as: 'tax' });
  });

  this.mount('accountant');

  this.route('gst-migration', function() {
    this.route('itemslist');
    this.route('itemsummary');
    this.route('customerslist');
    this.route('customersummary');
    this.route('vendorslist');
    this.route('vendorsummary');
    this.route('taxpreference');
    this.route('recurringinvoices', function() {
      this.route('edit', { path: '/:recurring_invoice_id/edit' });
    });
    this.route('recurringbills', function() {
      this.route('edit', { path: '/:recurring_bill_id/edit' });
    });
    this.route('intro');
    this.route('completed');
  });
  this.route('gcc-migration', function() {
    this.route('itemslist');
    this.route('itemsummary');
    this.route('customerslist');
    this.route('customersummary');
    this.route('vendorslist');
    this.route('vendorsummary');
    this.route('taxpreference');
    this.route('recurring-invoices-gcc', function() {
      this.route('edit', { path: '/:recurring_invoice_id/edit' });
    });
    this.route('completed');
  });
  this.route('ewaybills', function() {
    this.route('new');
    this.route('list', { path: '/' }, function() {
      this.route('details', { path: '/:ewaybill_id' });
    });
  });
});
export default Router;

`;

let i = j(content).find(j.CallExpression, {
  callee: {
    "type": "MemberExpression",
    "object": {
      "type": "Identifier",
      "name": "Router"
    },
    "property": {
      "type": "Identifier",
      "name": "map"
    },
    "computed": false
  }
});

const routeDefinition = {
  type: 'ExpressionStatement',
  "expression": {
    "type": "CallExpression",
    "callee": {
      "type": "MemberExpression",
      "object": {
        "type": "ThisExpression"
      },
      "property": {
        "type": "Identifier",
        "name": "route"
      },
      "computed": false
    }
  }
};

const routeCallStatement = {
  "callee": {
    "type": "MemberExpression",
    "object": {
      "type": "ThisExpression"
    },
    "property": {
      "type": "Identifier",
      "name": "route"
    }
  }
};

const getExpressionsFromRouterMap =  function(nodePath) {
  let blockStatement  = j(nodePath).find(j.BlockStatement).paths()[0];

  if (blockStatement) {
    return blockStatement.getValueProperty('body');
  }
}

let blocks = [];

i.forEach((routeMapNodePath) => {
  blocks.push(getExpressionsFromRouterMap(routeMapNodePath));
});


const iterateBlock = function(blockStatements) {
  let routes = [];
  blockStatements.forEach((blockNode) => {
    if (j.match(blockNode, routeDefinition)) { // match this.route('some-route-nmae');
      let routeName;
      let [routeDefinitionNodePath] = j(blockNode).find(j.CallExpression, routeCallStatement).paths();
      let args = routeDefinitionNodePath.getValueProperty('arguments');
      let [routeNamePath] = args;

      routeName = routeNamePath.value;
      routes.push(routeName);

      if (args.length > 1) {
        let childRoutesBlock = getExpressionsFromRouterMap(args);

        if (childRoutesBlock) {
          let childRoutes = iterateBlock(childRoutesBlock) || [];

          childRoutes = childRoutes.map((row) => {
            return `${routeName}.${row}`;
          });
          routes = routes.concat(...childRoutes);
        }
      }
    } else { // other statements like if (specificEdition) {.....}
      let childRoutesBlock = getExpressionsFromRouterMap(blockNode);
      if (childRoutesBlock) {
        let childRoutes = iterateBlock(childRoutesBlock);
        routes = routes.concat(...childRoutes);
      }
    }
  });
  return routes;
}
let routeHash = [];
i.paths().forEach((nodePath) => {
  routeHash.push(...iterateBlock(getExpressionsFromRouterMap(nodePath)));
});

console.log(routeHash);
