// MENU MODEL WITH QUERIES TO UPSERT DATA INTO DB

const { query } = require('../../database/pgPool');
const { validateSection, validateItem, validateModGroup, validateMod, validateDiscount, validateOrderType } = require('../validation/menuValidation');

const upsertMenuData = async (menu) => {
  try {
    await query('BEGIN');

    // MODIFIERS
    if (menu.mods) {
      for (const mod of menu.mods) {
        validateMod(mod);
        await query(
          `INSERT INTO bite.mods (id, name, price)
           VALUES ($1, $2, $3)
           ON CONFLICT (id) DO UPDATE SET
             name = EXCLUDED.name,
             price = EXCLUDED.price`,
          [mod.id, mod.name, mod.price]
        );
      }
      const modCount = await query('SELECT COUNT(*) FROM bite.mods');
      console.log(`Modifiers upsert successful. Total modifiers: ${modCount.rows[0].count}`);
    }

    // MODIFIER GROUPS
    if (menu.modGroups) {
      for (const modGroup of menu.modGroups) {
        validateModGroup(modGroup);
        await query(
          `INSERT INTO bite.mod_groups (id, name, max_mods, min_mods)
           VALUES ($1, $2, $3, $4)
           ON CONFLICT (id) DO UPDATE SET
             name = EXCLUDED.name,
             max_mods = EXCLUDED.max_mods,
             min_mods = EXCLUDED.min_mods`,
          [modGroup.id, modGroup.name, modGroup.maxMods, modGroup.minMods]
        );
        // MODGROUP-MODS JOIN TABLE
        for (const modId of modGroup.modIds) {
          await query(
            `INSERT INTO bite.mod_group_mods (mod_group_id, mod_id)
             VALUES ($1, $2)
             ON CONFLICT (mod_group_id, mod_id) DO NOTHING`,
            [modGroup.id, modId]
          );
        }
      }
      const modGroupCount = await query('SELECT COUNT(*) FROM bite.mod_groups');
      const modGroupModsCount = await query('SELECT COUNT(*) FROM bite.mod_group_mods');
      console.log(`ModGroups & ModGroup-Mods upsert successful. Total mod groups: ${modGroupCount.rows[0].count}, Total mod group-mods: ${modGroupModsCount.rows[0].count}`);
    }

    // ITEMS
    if (menu.items) {
      for (const item of menu.items) {
        validateItem(item);
        await query(
          `INSERT INTO bite.items (id, name, price, magic_copy_key, image_url)
           VALUES ($1, $2, $3, $4, $5)
           ON CONFLICT (id) DO UPDATE SET
             name = EXCLUDED.name,
             price = EXCLUDED.price,
             magic_copy_key = EXCLUDED.magic_copy_key,
             image_url = EXCLUDED.image_url`,
          [item.id, item.name, item.price, item.magicCopyKey, item.imageUrl]
        );
        // Insert into item-modGroups join table
        for (const modGroupId of item.modGroupIds) {
          await query(
            `INSERT INTO bite.item_mod_groups (item_id, mod_group_id)
             VALUES ($1, $2)
             ON CONFLICT (item_id, mod_group_id) DO NOTHING`,
            [item.id, modGroupId]
          );
        }
      }
      const itemCount = await query('SELECT COUNT(*) FROM bite.items');
      const itemModGroupsCount = await query('SELECT COUNT(*) FROM bite.item_mod_groups');
      console.log(`Items & Item-ModGroups upsert successful. Total items: ${itemCount.rows[0].count}, Total item-modGroups: ${itemModGroupsCount.rows[0].count}`);
    }

    // SECTIONS
    if (menu.sections) {
      for (const section of menu.sections) {
        validateSection(section);
        await query(
          `INSERT INTO bite.sections (id, name, magic_copy_key, image_url)
           VALUES ($1, $2, $3, $4)
           ON CONFLICT (id) DO UPDATE SET
             name = EXCLUDED.name,
             magic_copy_key = EXCLUDED.magic_copy_key,
             image_url = EXCLUDED.image_url`,
          [section.id, section.name, section.magicCopyKey, section.imageUrl]
        );
        // Insert into section-item join table
        for (const itemId of section.itemIds) {
          await query(
            `INSERT INTO bite.section_items (section_id, item_id)
             VALUES ($1, $2)
             ON CONFLICT (section_id, item_id) DO NOTHING`,
            [section.id, itemId]
          );
        }
      }
      const sectionCount = await query('SELECT COUNT(*) FROM bite.sections');
      const sectionItemsCount = await query('SELECT COUNT(*) FROM bite.section_items');
      console.log(`Sections & Section-Items upsert successful. Total sections: ${sectionCount.rows[0].count}, Total section-items: ${sectionItemsCount.rows[0].count}`);
    }

    // DISCOUNTS
    if (menu.discounts) {
      for (const discount of menu.discounts) {
        validateDiscount(discount);
        await query(
          `INSERT INTO bite.discounts (id, name, amount, rate, coupon_code)
           VALUES ($1, $2, $3, $4, $5)
           ON CONFLICT (id) DO UPDATE SET
             name = EXCLUDED.name,
             amount = EXCLUDED.amount,
             rate = EXCLUDED.rate,
             coupon_code = EXCLUDED.coupon_code`,
          [discount.id, discount.name, discount.amount, discount.rate, discount.couponCode]
        );
      }
      const discountCount = await query('SELECT COUNT(*) FROM bite.discounts');
      console.log(`Discounts upsert successful. Total discounts: ${discountCount.rows[0].count}`);
    }

    // ORDER TYPES
    if (menu.orderTypes) {
      for (const orderType of menu.orderTypes) {
        validateOrderType(orderType);
        await query(
          `INSERT INTO bite.order_types (id, name)
           VALUES ($1, $2)
           ON CONFLICT (id) DO UPDATE SET
             name = EXCLUDED.name`,
          [orderType.id, orderType.name]
        );
      }
      const orderTypeCount = await query('SELECT COUNT(*) FROM bite.order_types');
      console.log(`OrderTypes upsert successful. Total order types: ${orderTypeCount.rows[0].count}`);
    }

    await query('COMMIT');
    console.log('Database upsertMenuData completed');
  } catch (error) {
    await query('ROLLBACK');
    console.error('Error during upsertMenuData:', error.message);
    throw error;
  }
};

module.exports = { upsertMenuData };