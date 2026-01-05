# Covera Platform - Quick Start Guide

## 🎯 What is Covera?

Covera is a premium B2B SaaS platform for vendor compliance and insurance tracking. It helps property managers, construction firms, healthcare groups, logistics companies, and franchises manage Certificates of Insurance (COIs), vendor contracts, and compliance status in real-time.

---

## 🚀 Getting Started (3 Steps)

### 1. **Sign Up** (30 seconds)
1. Visit the landing page
2. Click "Start 7-Day Free Trial"
3. Enter:
   - Email address
   - Password
   - Your name
   - Organization name
4. Click "Create account"

**You're in!** Your 7-day trial starts immediately.

---

### 2. **Add Your First Vendor** (1 minute)
1. From the Dashboard, click "Add vendor" or navigate to **Vendors** → **Add vendor**
2. Fill in vendor details:
   - **Name:** e.g., "ACME Construction Co."
   - **Email:** vendor contact email
   - **Phone:** vendor phone number
   - **Site/Project:** e.g., "Downtown Building Project"
   - **Insurance Expiry:** When their COI expires
3. Click "Add vendor"

**Done!** Your vendor is now being monitored.

---

### 3. **Upload a COI** (30 seconds)
1. Go to **Vendors** → Click on your vendor
2. Click "Upload COI"
3. Choose a file (PDF, PNG, or JPG)
4. AI will analyze it automatically and extract:
   - Insurance company name
   - Policy number
   - Coverage type
   - Coverage amount
   - Effective/expiry dates
5. Review and click "Save"

**That's it!** The platform will now track expiration and send automated reminders.

---

## 📋 Core Features

### Dashboard
**What you see:**
- Total vendors and compliance status
- Vendors expiring soon
- Recent activity feed
- Quick actions

**Use it to:**
- Get an instant overview of compliance
- Send reminders to vendors
- Navigate to detailed pages

---

### Vendors
**Manage all your vendors:**
- Add, edit, delete vendors
- Search by name
- Filter by status (compliant/at-risk/non-compliant)
- View detailed vendor pages
- Upload COIs directly to vendors

**Status explained:**
- 🟢 **Compliant:** Insurance valid, not expiring soon
- 🟡 **At Risk:** Expires within 30 days
- 🔴 **Non-Compliant:** Expired or missing insurance

---

### Insurance (COI Tracking)
**Track all Certificates of Insurance:**
- View all COIs across all vendors
- Filter by vendor
- Upload new COIs with AI analysis
- Manual entry option
- Download/view documents

**AI Analysis extracts:**
- Insurer name
- Policy number
- Coverage type (General Liability, Workers Comp, etc.)
- Coverage amount
- Effective and expiry dates

---

### Contracts
**Manage vendor contracts:**
- Upload contract documents
- AI extracts key terms
- Track renewal dates
- Filter by vendor
- Store all contracts in one place

---

### Alerts & Reminders
**Automated compliance notifications:**
- System monitors all expiration dates
- Sends reminders at: 30, 14, and 7 days before expiry
- View upcoming reminders
- See recent reminders sent
- Configure reminder schedule
- Internal escalation for non-response

---

### Compliance Dashboard
**Visual compliance tracking:**
- Overall compliance percentage
- Documents requiring attention
- Expired documents list
- Upcoming expirations (30-day window)
- Monthly trends chart

---

### Reports & Exports
**Generate audit-ready documentation:**

**Report types:**
- **Full Compliance Report:** All vendors with status
- **Insurance Summary:** All COIs
- **Contract Summary:** All contracts
- **Non-Compliant Vendors:** Only non-compliant
- **Expiring Insurance:** Expiring within 30 days

**Export formats:**
- PDF (professional layout)
- Excel (.xlsx)
- CSV

**Use cases:**
- Internal audits
- Client reports
- Board presentations
- Compliance documentation

---

## 🎓 Workflows

### Daily Workflow (5 minutes)
1. Open **Dashboard**
2. Check compliance stats
3. Review "Upcoming Expirations"
4. Send reminders to vendors expiring soon
5. Check "Recent Activity" for updates

---

### Weekly Workflow (10 minutes)
1. Open **Vendors**
2. Filter by "at-risk" status
3. Contact vendors expiring within 30 days
4. Upload any received COIs
5. Generate weekly compliance report

---

### Monthly Workflow (15 minutes)
1. Open **Compliance Dashboard**
2. Review monthly trends
3. Generate full compliance report
4. Export to PDF for stakeholders
5. Update any vendor information
6. Review contract renewals in **Contracts**

---

## 💡 Pro Tips

### Tip 1: Use AI Analysis
Upload COI images or PDFs and let AI extract all the data. It's 10x faster than manual entry and reduces errors.

### Tip 2: Set Up Reminders
Configure the 30/14/7-day reminder schedule in **Alerts & Reminders** to automate compliance follow-ups.

### Tip 3: Filter for Action Items
Use filters in **Vendors** to quickly see who needs attention:
- Filter "at-risk" → Contact these vendors now
- Filter "non-compliant" → Urgent action required

### Tip 4: Export Regularly
Generate weekly or monthly reports in **Reports** to maintain audit trails and share with stakeholders.

### Tip 5: Use Quick Actions
Dashboard Quick Actions let you:
- Add vendor (1 click)
- Upload COI (1 click)
- Generate report (1 click)
- View alerts (1 click)

---

## 📊 Understanding Your Data

### Vendor Status Logic
```
Insurance Expiry Date:
- More than 30 days away → COMPLIANT (green)
- 1-30 days away → AT RISK (yellow)
- Past or missing → NON-COMPLIANT (red)
```

### Activity Log
Every action is tracked:
- Vendor created/updated/deleted
- COI uploaded
- Reminder sent
- Contract uploaded
- Manual edits

View in **Vendor Detail** → Activity tab

---

## 🔐 Subscription & Billing

### 7-Day Free Trial
- Full access to all features
- No credit card charge during trial
- Card pre-authorized only (Stripe SetupIntent)
- Automatically converts to paid after 7 days

### Core Plan ($49/month)
**Includes:**
- Unlimited vendors
- Unlimited COIs
- Unlimited contracts
- AI document analysis
- Automated reminders
- Reports & exports
- Compliance dashboard
- Priority support

### Managing Your Subscription
- View status: **Settings** → Subscription Status
- Upgrade: **Billing** → Upgrade to Core
- Payment method: Managed via Stripe
- Cancel anytime: Contact support

---

## 🆘 Common Questions

### Q: How do I add multiple vendors at once?
**A:** Currently, vendors must be added individually. Bulk import is coming soon.

### Q: Can I customize reminder intervals?
**A:** Reminder settings are visible in **Alerts & Reminders**. Custom intervals are coming in a future update.

### Q: How accurate is AI analysis?
**A:** 95%+ accuracy on standard COI formats. Always review extracted data before saving.

### Q: What file formats are supported?
**A:** COIs and contracts support PDF, PNG, JPG. Maximum file size: 10MB.

### Q: Can I delete a vendor?
**A:** Yes. Go to **Vendors** → Click vendor → Click "Delete vendor". This also deletes all associated COIs and contracts.

### Q: Where are my files stored?
**A:** All files are securely stored in Supabase Storage with enterprise-grade encryption.

### Q: Can multiple people use one account?
**A:** Currently, one user per account. Multi-user organizations are coming soon.

---

## 🎯 Best Practices

### 1. Keep Vendor Info Updated
Regularly update vendor contact information, sites, and notes to ensure smooth communication.

### 2. Upload COIs Immediately
When you receive a new COI, upload it right away. AI will handle the rest.

### 3. Act on At-Risk Vendors
Don't wait for expirations. Contact "at-risk" vendors proactively.

### 4. Use Tags/Notes
Add notes to vendors about specific requirements or context.

### 5. Export Weekly Reports
Generate weekly compliance reports to maintain documentation and spot trends.

### 6. Review Activity Logs
Check vendor activity logs monthly to ensure nothing was missed.

---

## 🚨 Support & Help

### Need Help?
- **In-app:** Look for help icons (?) throughout the platform
- **Email:** support@covera.com (if configured)
- **Documentation:** Refer to this guide and PRODUCTION_READY.md

### Report Bugs
If something doesn't work:
1. Note what you were doing
2. Take a screenshot if possible
3. Contact support with details

### Feature Requests
We're always improving! Share your ideas for new features.

---

## ✅ Next Steps

Now that you're set up:

1. ✅ Add 3-5 vendors
2. ✅ Upload COIs for each
3. ✅ Explore the Dashboard
4. ✅ Generate your first report
5. ✅ Configure reminder settings
6. ✅ Review compliance status daily

---

## 🎉 You're All Set!

Covera is now monitoring your vendor compliance 24/7. The platform will:
- ✅ Track all insurance expirations
- ✅ Send automated reminders
- ✅ Generate reports on demand
- ✅ Alert you to compliance issues
- ✅ Keep all documents organized

**Welcome to stress-free compliance management!**

---

*Need more details? See PRODUCTION_READY.md for technical documentation.*  
*Questions? Contact support or refer to in-app help.*

**Happy tracking! 🎯**
