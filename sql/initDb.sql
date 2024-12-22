CREATE TABLE tg_bot_users(
	id SERIAL PRIMARY KEY,
	tg_username varchar(255) NOT NULL,
	tg_guid varchar(255) NOT NULL,
	referal_id integer REFERENCES tg_bot_users (id),
	referal_private_code varchar(255) UNIQUE NOT NULL
);

CREATE TYPE mining_boost AS ENUM ('NONE', 'LITE', 'HARD_BOOST');

CREATE TABLE user_wallets_tg_info(
	id SERIAL PRIMARY KEY,
	tg_user_id integer REFERENCES tg_bot_users NOT NULL,
	tg_guid varchar(255) NOT NULL,
	coins_amount NUMERIC(30,15) NOT NULL,
	energy_amount NUMERIC(30,10) NOT NULL,
	max_energy_capicity NUMERIC(30,10) NOT NULL,
	testing_energy_amount NUMERIC(30,10) NOT NULL,
	mining_boost_level mining_boost NOT NULL
);

CREATE TABLE image_info(
	id SERIAL PRIMARY KEY,
	image_name varchar(255) NOT NULL
);


CREATE TABLE image_user_instance(
	id SERIAL PRIMARY KEY,
	tg_user_id integer REFERENCES tg_bot_users NOT NULL,
	tg_user_guid varchar(255),
	active_status boolean NOT NULL,
	image_id integer REFERENCES image_info NOT NULL
);