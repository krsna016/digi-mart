const User = require('../models/User');

// @desc    Add a new address to user profile
// @route   POST /api/user/address
// @access  Private
const addAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { fullName, phone, pincode, addressLine, city, state, country, isDefault } = req.body;

    // If this is the first address, or isDefault is true, set others to false
    if (isDefault || user.addresses.length === 0) {
      user.addresses.forEach(addr => addr.isDefault = false);
    }

    const newAddress = {
      fullName,
      phone,
      pincode,
      addressLine,
      city,
      state,
      country,
      isDefault: isDefault || user.addresses.length === 0
    };

    user.addresses.push(newAddress);
    await user.save();

    res.status(201).json(user.addresses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all addresses of the user
// @route   GET /api/user/address
// @access  Private
const getAddresses = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user.addresses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update an address
// @route   PUT /api/user/address/:id
// @access  Private
const updateAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const address = user.addresses.id(req.params.id);
    if (!address) {
      return res.status(404).json({ message: 'Address not found' });
    }

    const { fullName, phone, pincode, addressLine, city, state, country, isDefault } = req.body;

    // Handle default address logic
    if (isDefault && !address.isDefault) {
      user.addresses.forEach(addr => addr.isDefault = false);
    }

    address.fullName = fullName || address.fullName;
    address.phone = phone || address.phone;
    address.pincode = pincode || address.pincode;
    address.addressLine = addressLine || address.addressLine;
    address.city = city || address.city;
    address.state = state || address.state;
    address.country = country || address.country;
    address.isDefault = isDefault !== undefined ? isDefault : address.isDefault;

    // Ensure at least one address is default if any exist
    const hasDefault = user.addresses.some(addr => addr.isDefault);
    if (!hasDefault && user.addresses.length > 0) {
      user.addresses[0].isDefault = true;
    }

    await user.save();
    res.json(user.addresses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete an address
// @route   DELETE /api/user/address/:id
// @access  Private
const deleteAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const addressIndex = user.addresses.findIndex(addr => addr._id.toString() === req.params.id);
    if (addressIndex === -1) {
      return res.status(404).json({ message: 'Address not found' });
    }

    const removedAddressIsDefault = user.addresses[addressIndex].isDefault;
    user.addresses.splice(addressIndex, 1);

    // If removed default address and others exist, set the first one as default
    if (removedAddressIsDefault && user.addresses.length > 0) {
      user.addresses[0].isDefault = true;
    }

    await user.save();
    res.json(user.addresses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addAddress,
  getAddresses,
  updateAddress,
  deleteAddress
};
