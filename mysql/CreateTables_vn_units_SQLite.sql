DROP TABLE IF EXISTS wards;
DROP TABLE IF EXISTS districts;
DROP TABLE IF EXISTS provinces;
DROP TABLE IF EXISTS administrative_units;
DROP TABLE IF EXISTS administrative_regions;

-- CREATE administrative_regions TABLE
CREATE TABLE administrative_regions (
	id INTEGER PRIMARY KEY NOT NULL,
	name CHARACTER(255) NOT NULL,
	name_en CHARACTER(255) NOT NULL,
	code_name CHARACTER(255),
	code_name_en CHARACTER(255)
);

-- CREATE administrative_units TABLE
CREATE TABLE administrative_units (
	id INTEGER PRIMARY KEY NOT NULL,
	full_name CHARACTER(255) NULL,
	full_name_en CHARACTER(255) NULL,
	short_name CHARACTER(255) NULL,
	short_name_en CHARACTER(255) NULL,
	code_name CHARACTER(255) NULL,
	code_name_en CHARACTER(255) NULL
);

-- CREATE provinces TABLE
CREATE TABLE provinces (
	code CHARACTER(20) NOT NULL PRIMARY KEY,
	name CHARACTER(255) NOT NULL,
	name_en CHARACTER(255),
	full_name CHARACTER(255) NOT NULL,
	full_name_en CHARACTER(255),
	code_name CHARACTER(255),
	administrative_unit_id INTEGER,
	administrative_region_id INTEGER,
    FOREIGN KEY(administrative_unit_id) REFERENCES administrative_units(id),
    FOREIGN KEY(administrative_region_id) REFERENCES administrative_regions(id)
);

CREATE INDEX idx_provinces_region ON provinces(administrative_region_id);
CREATE INDEX idx_provinces_unit ON provinces(administrative_unit_id);

-- CREATE districts TABLE
CREATE TABLE districts (
	code CHARACTER(20) NOT NULL PRIMARY KEY,
	name CHARACTER(255) NOT NULL,
	name_en CHARACTER(255),
	full_name CHARACTER(255),
	full_name_en CHARACTER(255),
	code_name CHARACTER(255),
	province_code CHARACTER(20),
	administrative_unit_id INTEGER,
    FOREIGN KEY(province_code) REFERENCES provinces(code),
    FOREIGN KEY(administrative_unit_id) REFERENCES administrative_units(id)
);

CREATE INDEX idx_districts_province ON districts(province_code);
CREATE INDEX idx_districts_unit ON districts(administrative_unit_id);

-- CREATE wards TABLE
CREATE TABLE wards (
	code CHARACTER(20) NOT NULL PRIMARY KEY,
	name CHARACTER(255) NOT NULL,
	name_en CHARACTER(255),
	full_name CHARACTER(255),
	full_name_en CHARACTER(255),
	code_name CHARACTER(255),
	district_code CHARACTER(20),
	administrative_unit_id INTEGER,
    FOREIGN KEY(district_code) REFERENCES districts(code),
    FOREIGN KEY(administrative_unit_id) REFERENCES administrative_units(id)
);

CREATE INDEX idx_wards_district ON wards(district_code);
CREATE INDEX idx_wards_unit ON wards(administrative_unit_id);
