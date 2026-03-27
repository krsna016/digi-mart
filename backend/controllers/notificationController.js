const Notification = require('../models/Notification');

// @desc    Get all notifications (Admin only)
// @route   GET /api/notifications
// @access  Private/Admin
const getNotifications = async (req, res) => {
  console.log(`Fetching notifications for admin: ${req.user.email}`);
  const notifications = await Notification.find({}).sort({ createdAt: -1 }).limit(20);
  console.log(`Found ${notifications.length} notifications`);
  res.json(notifications);
};

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private/Admin
const markAsRead = async (req, res) => {
  const notification = await Notification.findById(req.params.id);

  if (notification) {
    notification.isRead = true;
    await notification.save();
    res.json({ message: 'Notification marked as read' });
  } else {
    res.status(404).json({ message: 'Notification not found' });
  }
};

module.exports = {
  getNotifications,
  markAsRead
};
