// MENU SYNC CONTROLLER

const axios = require('axios');
const { upsertMenuData } = require('../models/menu');

const sync = async (req, res) => {
  try {

    console.log('Initiating menu synchronization');

    // Request data from third party API
    const response = await axios.get('https://bite-test-pos-production.herokuapp.com/locations/${location_id}/menu');
    const menu = response.data;

    // Check if there are any missing menu fields from the response
    const fields = ['sections', 'items', 'modGroups', 'mods', 'discounts', 'orderTypes'];
    const missingFields = fields.filter(field => !menu[field]);
    if (missingFields.length > 0) {
      console.log(`Missing fields in the response: ${missingFields.join(', ')}`);
    }

    // Call menu model to start upsert with menu data
    await upsertMenuData(menu);

    console.log('Menu synchronization complete!');
    res.status(200).send('Menu synchronization complete!');
  } catch (error) {
    console.error('Error synchronizing menu:', error.message);
    res.status(500).send('Error synchronizing menu');
  }
};

module.exports = { sync };