-- SQL script to set up database with schemas

DROP SCHEMA IF EXISTS bite CASCADE;
CREATE SCHEMA bite;

SET search_path TO bite;

CREATE TABLE sections (
    id VARCHAR PRIMARY KEY,
    name VARCHAR NOT NULL,
    magic_copy_key VARCHAR,
    image_url VARCHAR
);

CREATE TABLE items (
    id VARCHAR PRIMARY KEY,
    name VARCHAR NOT NULL,
    price NUMERIC NOT NULL,
    magic_copy_key VARCHAR,
    image_url VARCHAR
);

CREATE TABLE mod_groups (
    id VARCHAR PRIMARY KEY,
    name VARCHAR NOT NULL,
    max_mods INTEGER,
    min_mods INTEGER
);

CREATE TABLE mods (
    id VARCHAR PRIMARY KEY,
    name VARCHAR NOT NULL,
    price NUMERIC NOT NULL
);

CREATE TABLE discounts (
    id VARCHAR PRIMARY KEY,
    name VARCHAR NOT NULL,
    amount NUMERIC,
    rate NUMERIC,
    coupon_code VARCHAR
);

CREATE TABLE order_types (
    id VARCHAR PRIMARY KEY,
    name VARCHAR NOT NULL
);

CREATE TABLE section_items (
    section_id VARCHAR NOT NULL,
    item_id VARCHAR NOT NULL,
    FOREIGN KEY (section_id) REFERENCES sections(id) ON DELETE CASCADE,
    FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE CASCADE,
    PRIMARY KEY (section_id, item_id)
);

CREATE TABLE item_mod_groups (
    item_id VARCHAR NOT NULL,
    mod_group_id VARCHAR NOT NULL,
    FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE CASCADE,
    FOREIGN KEY (mod_group_id) REFERENCES mod_groups(id) ON DELETE CASCADE,
    PRIMARY KEY (item_id, mod_group_id)
);

CREATE TABLE mod_group_mods (
    mod_group_id VARCHAR NOT NULL,
    mod_id VARCHAR NOT NULL,
    FOREIGN KEY (mod_group_id) REFERENCES mod_groups(id) ON DELETE CASCADE,
    FOREIGN KEY (mod_id) REFERENCES mods(id) ON DELETE CASCADE,
    PRIMARY KEY (mod_group_id, mod_id)
);