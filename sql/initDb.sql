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


CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,                
    is_daily BOOLEAN NOT NULL,          
    energy_reward NUMERIC(30,10) NOT NULL,
    link VARCHAR(255),
    task_type VARCHAR(50) NOT NULL,
	task_available boolean NOT NULL
);

CREATE TABLE task_info (
    id SERIAL PRIMARY KEY,              
    task_id INTEGER NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    app_language VARCHAR(10) NOT NULL,
    title VARCHAR(255) NOT NULL,  
    task_description TEXT NOT NULL
);

CREATE TABLE task_instances (
    id SERIAL PRIMARY KEY,  
	task_id INTEGER REFERENCES tasks NOT NULL,
    user_id INTEGER REFERENCES tg_bot_users NOT NULL,               
    user_tg_guid VARCHAR(255) NOT NULL,     
    date_completed TIMESTAMPTZ NOT NULL,
    energy_reward_catched NUMERIC(30,10) NOT NULL
);


CREATE TABLE mining_blocks (
    id SERIAL PRIMARY KEY,                    
    hash VARCHAR(255) NOT NULL,              
    user_tg_guid VARCHAR(255) NOT NULL,       
    user_id INTEGER NOT NULL REFERENCES tg_bot_users,                  
    miner_name VARCHAR(255) NOT NULL,          
    miner_reward NUMERIC(30, 10) NOT NULL,     
    shared_reward NUMERIC(30, 10) NOT NULL,    
    date TIMESTAMPTZ NOT NULL DEFAULT NOW()    
);



CREATE TABLE mining_blocks_shared_info (
    id SERIAL PRIMARY KEY,                         
    block_id INTEGER NOT NULL REFERENCES mining_blocks(id) ON DELETE CASCADE,
    shared_user_id INTEGER REFERENCES tg_bot_users NOT NULL,                       
    shared_user_guid VARCHAR(255) NOT NULL, 
    user_reward NUMERIC(30, 10) NOT NULL
);

CREATE TABLE ton_wallets (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES tg_bot_users(id) ON DELETE CASCADE NOT NULL,
    user_guid VARCHAR(255) NOT NULL UNIQUE,
    wallet_address VARCHAR(255) NOT NULL UNIQUE,
    date_created TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE starts_transactions (
    id SERIAL PRIMARY KEY,
    obj_id VARCHAR(255) NOT NULL,
    date_transaction TIMESTAMPTZ NOT NULL,
    tg_guid VARCHAR(255) NOT NULL,
    price NUMERIC(15, 2) NOT NULL,
    donate_type donate_type NOT NULL
);