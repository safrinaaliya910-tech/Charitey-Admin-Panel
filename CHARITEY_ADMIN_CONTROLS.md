# Charitey Admin Panel - Control Systems Guide

## 1. NGO Approval System (Users Management)

### Status Flow
- **Pending**: New NGO registration, awaiting admin review
- **Approved**: NGO verified and can post donation requests
- **Rejected**: NGO declined, cannot access platform
- **Blocked**: Approved NGO blocked due to violations

### Admin Controls for NGOs
| NGO Status | Available Actions |
|-----------|------------------|
| Pending | ✓ Approve, ✓ Reject |
| Approved | ✓ Block, ✓ View Details |
| Rejected | ✓ Unblock, ✓ View Details |
| Blocked | ✓ Unblock, ✓ View Details |

### Key Rule
**Only approved NGOs can post donation requests.** All pending NGOs are restricted until explicitly approved by an admin. This ensures quality control and prevents spam.

### Access Path
`/admin/users` → Filter by Role: "NGO" → Review pending NGOs → Approve/Reject/Block

---

## 2. Item-Based Donation Management

### Donation Fields (NOT Money-Based)
```
✓ Donor Name        - Who is donating
✓ NGO Name          - Recipient organization
✓ Requested Item    - What NGO asked for (e.g., "Medical Supplies")
✓ Donated Item      - What donor actually gave (e.g., "First Aid Kits")
✓ Quantity          - Number of units (50, 100, 200, etc.)
✓ Volunteer Avail   - Does NGO have volunteers for delivery? Yes/No
✓ Chat Opened       - Has donor-NGO communication started? Yes/No
✓ Status            - Pending/Confirmed/Completed/Cancelled
✓ Date              - When donation was recorded
```

### Donation Status Flow
1. **Pending** (Yellow) - Donor offered items, NGO hasn't confirmed yet
2. **Confirmed** (Blue) - NGO confirmed and ready for delivery/pickup
3. **Completed** (Green) - Items successfully delivered to NGO
4. **Cancelled** (Red) - Donation cancelled or declined

### Volunteer Delivery Status
- **Volunteer Available: Yes** - NGO has registered volunteers who can handle delivery
- **Volunteer Available: No** - NGO using "Travel Agency Support" (Coming Soon) or manual coordination
- **Chat Opened: Yes** - Donor and NGO have direct communication
- **Chat Opened: No** - Initial matching phase, no direct communication yet

### Access Path
`/admin/donations` → View all donations with item details → Filter by status → Update delivery status

---

## 3. Volunteer & Delivery Logic

### Volunteer Availability States
| Status | Meaning | Actions Available |
|--------|---------|-----------------|
| Available | Can take assignments | Set Unavailable, Block, View Details |
| Unavailable | Temporarily not taking tasks | Set Available, Block, View Details |
| Blocked | Suspended account | Unblock, View Details |

### NGO Volunteer Support Levels

#### NGOs WITH Volunteers
- Show "Yes" in Volunteer Available column
- Volunteers handle item delivery/pickup
- Faster delivery timeline
- Direct volunteer coordination through app

#### NGOs WITHOUT Volunteers
- Show "No" in Volunteer Available column
- Message: **"Travel Agency Support - Later Phase / Coming Soon"**
- Current delivery: Donor-NGO coordination
- Future: Charitey will partner with travel/logistics agencies

### Access Path
`/admin/volunteers` → Manage volunteer availability by NGO → Update status

---

## 4. Dashboard Overview

### Dashboard Stat Cards
- **Total NGOs**: All registered NGOs (includes pending)
- **Total Donors**: All registered donors
- **Total Requests**: Open donation requests from approved NGOs
- **Pending Donations**: Awaiting NGO confirmation
- **Confirmed Donations**: Ready for delivery
- **Completed Donations**: Successfully delivered
- **Volunteer Available NGOs**: NGOs with active volunteer support
- **Blocked Users**: Suspended accounts (any role)

### Recent Activity Examples
- "New donation: 50 Food Packets from John Smith to Help Hearts NGO"
- "Clean Water Initiative submitted request for 200 Water Filter Kits"
- "Maria Garcia joined as volunteer for Education for All"

---

## 5. Reports & Complaints System

### When to Use Reports Page
- User misconduct reports
- NGO policy violations
- Donation fraud/suspicious activity
- Volunteer inappropriate behavior

### Actions Available
- **Pending Reports**: Review → Mark as Reviewed → Block User (if necessary)
- **Reviewed Reports**: View archived reports
- **Resolved Reports**: Closed cases

---

## 6. Messages Monitoring

### Privacy-First Design
- Only shows **reported conversations** by default
- Does NOT display all private messages
- Admin can review conversation for policy violations
- Filter: "All Chats" vs "Reported Chats"

### Use Cases
- Investigate inappropriate communication
- Verify harassment complaints
- Monitor for spam

---

## 7. Charitey Theme & Styling

### Color System
- **Dusky Rose** (#B76E79, #8E4F5A) - Primary actions, navigation
- **Green** - Active/Approved status
- **Yellow** - Pending status
- **Blue** - Confirmed/Secondary status
- **Red** - Rejected/Blocked status
- **Gray** - Unavailable/Inactive

### Button Actions
- Approve/Confirm: Green buttons
- Reject/Block: Red buttons
- Unblock/Change Status: Blue buttons
- View: Rose icon buttons

---

## Admin Workflow Summary

### Daily Admin Tasks
1. **Morning Check**: Dashboard → Review pending approvals & donations
2. **NGO Approvals**: Users → Filter by Pending NGOs → Approve/Reject
3. **Donation Updates**: Donations → Update statuses as deliveries progress
4. **Reports Review**: Reports → Review new complaints → Take action if needed
5. **Volunteer Management**: Volunteers → Manage availability by NGO

### Monthly Tasks
- Review blocked users for unblocking
- Check volunteer availability across NGOs
- Archive completed donations
- Generate impact reports

---

## Key Integration Points

### Data Flow
```
NGO Registration → Admin Approval → NGO Posts Requests
                                  ↓
Donor Sees Request → Offers Item → Chat Opens
                                  ↓
NGO Confirms → Shows Volunteer Status → Delivery Arranged
                                      ↓
Delivery Completed → Status Updated → Donation Marked Complete
```

### No Changes Needed For
- These controls are built into the web preview
- They match the Flutter admin panel architecture
- All field names are already item-focused
- Donation tracking is item-based throughout

---

## Testing Checklist

- [ ] NGO approval flow works (pending → approved → can post)
- [ ] Donations show item quantities, not money amounts
- [ ] Volunteer availability displays correctly per NGO
- [ ] Chat opened status shows in donations
- [ ] Status updates work correctly (pending → confirmed → completed)
- [ ] Reports can be reviewed and users blocked
- [ ] Messages monitoring is privacy-safe (reported only)
- [ ] Dusky Rose theme applied consistently
- [ ] All tables responsive and searchable
