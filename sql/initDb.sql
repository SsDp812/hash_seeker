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
	coins_amount NUMERIC(30,15) NOT NULL,
	energy_amount NUMERIC(30,10) NOT NULL,
	testing_energy_amount NUMERIC(30,10) NOT NULL,
	mining_boost_level mining_boost NOT NULL
);