const Lead = require('../models/Lead');
const asyncHandler = require('../utils/asyncHandler');

const SORT_MAP = {
  newest: { createdAt: -1 },
  oldest: { createdAt: 1 },
  'name-asc': { name: 1 },
  'name-desc': { name: -1 },
};

// Escapes regex metacharacters so free-text search can't throw on input like
// "Smith (referral)" and can't be used for a ReDoS via crafted patterns.
function escapeRegExp(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * GET /api/leads
 * Query params: search, status, source, sort, page, limit
 */
const getLeads = asyncHandler(async (req, res) => {
  const { search, status, source, sort = 'newest', page = 1, limit = 10 } = req.query;

  const query = {};

  if (status && status !== 'All') {
    query.status = status;
  }

  if (source && source !== 'All') {
    query.source = source;
  }

  if (search) {
    const regex = new RegExp(escapeRegExp(search.trim()), 'i');
    query.$or = [{ name: regex }, { email: regex }, { company: regex }, { phone: regex }];
  }

  const pageNum = Math.max(parseInt(page, 10) || 1, 1);
  const limitNum = Math.min(Math.max(parseInt(limit, 10) || 10, 1), 100);
  const skip = (pageNum - 1) * limitNum;
  const sortOption = SORT_MAP[sort] || SORT_MAP.newest;

  const [leads, total] = await Promise.all([
    Lead.find(query).sort(sortOption).skip(skip).limit(limitNum),
    Lead.countDocuments(query),
  ]);

  res.status(200).json({
    success: true,
    data: leads,
    pagination: {
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum) || 1,
    },
  });
});

/**
 * GET /api/leads/:id
 */
const getLeadById = asyncHandler(async (req, res) => {
  const lead = await Lead.findById(req.params.id);

  if (!lead) {
    return res.status(404).json({ success: false, message: 'Lead not found' });
  }

  res.status(200).json({ success: true, data: lead });
});

/**
 * POST /api/leads
 */
const createLead = asyncHandler(async (req, res) => {
  const { name, email, phone, company, source, status, notes } = req.body;

  const lead = await Lead.create({
    name,
    email,
    phone,
    company,
    source,
    status,
    notes: notes ? [{ text: notes }] : [],
  });

  res.status(201).json({ success: true, data: lead });
});

/**
 * PUT /api/leads/:id
 */
const updateLead = asyncHandler(async (req, res) => {
  const { name, email, phone, company, source, status } = req.body;

  const lead = await Lead.findById(req.params.id);

  if (!lead) {
    return res.status(404).json({ success: false, message: 'Lead not found' });
  }

  if (name !== undefined) lead.name = name;
  if (email !== undefined) lead.email = email;
  if (phone !== undefined) lead.phone = phone;
  if (company !== undefined) lead.company = company;
  if (source !== undefined) lead.source = source;
  if (status !== undefined) lead.status = status;

  await lead.save();

  res.status(200).json({ success: true, data: lead });
});

/**
 * DELETE /api/leads/:id
 */
const deleteLead = asyncHandler(async (req, res) => {
  const lead = await Lead.findByIdAndDelete(req.params.id);

  if (!lead) {
    return res.status(404).json({ success: false, message: 'Lead not found' });
  }

  res.status(200).json({ success: true, data: {} });
});

/**
 * POST /api/leads/:id/notes — add a follow-up note (timeline entry)
 */
const addNote = asyncHandler(async (req, res) => {
  const { text } = req.body;

  if (!text || !text.trim()) {
    return res.status(400).json({ success: false, message: 'Note text is required' });
  }

  const lead = await Lead.findById(req.params.id);

  if (!lead) {
    return res.status(404).json({ success: false, message: 'Lead not found' });
  }

  lead.notes.push({ text: text.trim() });
  await lead.save();

  res.status(201).json({ success: true, data: lead });
});

module.exports = { getLeads, getLeadById, createLead, updateLead, deleteLead, addNote };
